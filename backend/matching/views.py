from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tasks.models import Task
from users.constants import UserRole

from .permissions import CanAccessTaskMatching
from .selectors import get_matches_for_latest_run, get_matches_for_task
from .serializers import MatchRunSerializer, MatchSerializer, VendorRecommendationSerializer
from .services import MatchingError, TaskNotReadyForMatchingError, run_matching_for_task


def _get_task_for_user(*, request, task_id: int) -> Task:
    task = get_object_or_404(Task.objects.select_related('detected_category'), pk=task_id)
    if request.user.role == UserRole.ADMIN:
        return task
    if task.customer_id != request.user.id:
        from rest_framework.exceptions import PermissionDenied

        raise PermissionDenied('You do not have access to this task.')
    return task


class TaskMatchListView(APIView):
    """GET ranked vendor matches for a task (latest run by default)."""

    permission_classes = [IsAuthenticated, CanAccessTaskMatching]

    def get(self, request, task_id: int):
        task = _get_task_for_user(request=request, task_id=task_id)
        latest_only = request.query_params.get('latest', 'true').lower() != 'false'

        matches = get_matches_for_latest_run(task_id=task.id) if latest_only else get_matches_for_task(task_id=task.id)

        # 1. FIX: Auto-trigger matching if it hasn't run yet
        if not matches.exists():
            from tasks.constants import TaskStatus
            from matching.services import run_matching_for_task
            import logging
            
            logger = logging.getLogger(__name__)
            
            # Promote task so engine accepts it
            if task.status == TaskStatus.PARSED:
                task.status = TaskStatus.PUBLISHED
                task.save(update_fields=['status'])
                
            try:
                run_matching_for_task(task=task)
                matches = get_matches_for_latest_run(task_id=task.id) if latest_only else get_matches_for_task(task_id=task.id)
            except Exception as exc:
                logger.error(f"Auto-matching failed for task {task.id}: {exc}")

        # 2. FIX: Temporary debug logging as requested
        print("=== MATCHING ENGINE DEBUG ===")
        print(f"Task ID: {task.id}")
        print(f"Raw Input: {task.raw_user_input}")
        print(f"Parsed Category: {task.detected_category.name if task.detected_category else 'None'}")
        print(f"Parsed Location: {task.location}")
        
        from vendors.models import Vendor
        all_vendors_count = Vendor.objects.filter(is_active=True).count()
        print(f"Total active vendors in DB: {all_vendors_count}")
        print(f"Final match count for this task: {matches.count()}")
        print("=============================")

        serializer = MatchSerializer(matches, many=True, context={'request': request})
        return Response(
            {
                'task_id': task.id,
                'count': matches.count(),
                'matches': serializer.data,
            }
        )


class RunMatchingView(APIView):
    """POST trigger matching for a published task."""

    permission_classes = [IsAuthenticated, CanAccessTaskMatching]

    def post(self, request, task_id: int):
        task = _get_task_for_user(request=request, task_id=task_id)
        try:
            match_run = run_matching_for_task(task=task)
        except TaskNotReadyForMatchingError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except MatchingError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        matches = get_matches_for_task(task_id=task.id).filter(match_run=match_run)
        return Response(
            {
                'match_run': MatchRunSerializer(match_run).data,
                'matches': MatchSerializer(matches, many=True, context={'request': request}).data,
            },
            status=status.HTTP_201_CREATED,
        )


class VendorRecommendationsView(APIView):
    """
    GET vendor recommendations for a task (mobile listing).
    Alias of matches with recommendation-oriented payload.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        task_id = request.query_params.get('task_id')
        if not task_id:
            return Response(
                {'detail': 'Query parameter task_id is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        task = _get_task_for_user(request=request, task_id=int(task_id))
        matches = get_matches_for_latest_run(task_id=task.id).filter(is_recommended=True)
        serializer = VendorRecommendationSerializer(
            matches,
            many=True,
            context={'request': request},
        )
        return Response(
            {
                'task_id': task.id,
                'recommendations': serializer.data,
            }
        )
