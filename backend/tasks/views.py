from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser

from .constants import TaskStatus
from .filters import TaskFilter
from .permissions import CanPublishTask, TaskPermission
from .selectors import get_tasks_for_user
from .serializers import (
    TaskCreateSerializer,
    TaskDetailSerializer,
    TaskListSerializer,
    TaskStatusUpdateSerializer,
    AdminTaskSerializer,
)


class TaskViewSet(viewsets.ModelViewSet):
    """
    Service task CRUD for customers (natural language → structured task).

    Create runs the AI intent pipeline (stub today, Gemini later).
    """

    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ['raw_user_input', 'structured_output']
    ordering_fields = ['created_at', 'urgency', 'ai_confidence']
    ordering = ['-created_at']
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        return get_tasks_for_user(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return TaskListSerializer
        if self.action == 'create':
            return TaskCreateSerializer
        if self.action == 'partial_update':
            return TaskStatusUpdateSerializer
        return TaskDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        return Response(
            TaskDetailSerializer(task, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    def partial_update(self, request, *args, **kwargs):
        task = self.get_object()
        serializer = TaskStatusUpdateSerializer(
            task,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            TaskDetailSerializer(task, context={'request': request}).data,
        )

    @action(
        detail=True,
        methods=['post'],
        url_path='publish',
        permission_classes=[CanPublishTask],
    )
    def publish(self, request, pk=None):
        """Mark task ready for vendor matching."""
        task = self.get_object()
        if task.status != TaskStatus.PARSED:
            return Response(
                {'detail': 'Only parsed tasks can be published.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        task.status = TaskStatus.PUBLISHED
        task.save(update_fields=['status', 'updated_at'])

        auto_match = request.query_params.get('auto_match', 'true').lower() != 'false'
        matching_payload = None
        if auto_match:
            from matching.services import MatchingError, run_matching_for_task

            try:
                match_run = run_matching_for_task(task=task)
                from matching.selectors import get_matches_for_task
                from matching.serializers import MatchRunSerializer, MatchSerializer

                matches = get_matches_for_task(task_id=task.id).filter(match_run=match_run)
                matching_payload = {
                    'match_run': MatchRunSerializer(match_run).data,
                    'match_count': matches.count(),
                }
            except MatchingError:
                matching_payload = {'detail': 'Matching could not be completed.'}

        response_data = TaskDetailSerializer(task, context={'request': request}).data
        if matching_payload is not None:
            response_data['matching'] = matching_payload
        return Response(response_data)

class AdminTaskViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    """Dedicated admin endpoints for task monitoring."""
    permission_classes = [IsAdminUser]
    serializer_class = AdminTaskSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'detected_category', 'urgency', 'locale']
    search_fields = ['raw_user_input']
    ordering_fields = ['created_at', 'ai_confidence']
    ordering = ['-created_at']

    def get_queryset(self):
        from django.db.models import Count
        from .models import Task
        return Task.objects.select_related('customer', 'detected_category').annotate(
            match_count=Count('vendor_matches')
        ).all()

    @action(detail=True, methods=['post'])
    def rerun_matching(self, request, pk=None):
        task = self.get_object()
        from matching.services import run_matching_for_task
        try:
            run_matching_for_task(task=task)
            return Response({'status': 'matching rerun complete'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    @action(detail=True, methods=['patch'])
    def set_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status in TaskStatus.values:
            task.status = new_status
            task.save(update_fields=['status', 'updated_at'])
            return Response({'status': new_status})
        return Response({'error': 'invalid status'}, status=400)
