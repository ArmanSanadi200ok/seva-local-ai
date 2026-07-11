"""
Shared Django settings for Ichalkaranji Seva backend.
"""

from datetime import timedelta
from pathlib import Path

import dj_database_url
from decouple import config, Csv
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent.parent



def _non_empty(key, default=''):
    """Treat blank .env values as unset so defaults apply."""
    value = config(key, default=default)
    if isinstance(value, str) and value.strip() == '':
        return default
    return value


SECRET_KEY = _non_empty(
    'SECRET_KEY',
    'django-insecure-change-me-in-production-use-a-50-char-secret-key',
)

DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='localhost,127.0.0.1',
    cast=Csv(),
)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_filters',
    'rest_framework_simplejwt',
    'corsheaders',
    'users',
    'vendors',
    'tasks',
    'matching',
    'ai_engine',
    'notifications',
    'analytics',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

DATABASE_URL = _non_empty('DATABASE_URL', '')

if not DATABASE_URL:
    raise ImproperlyConfigured(
        'DATABASE_URL is required. Example: '
        'postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME'
    )

if DATABASE_URL.startswith('sqlite'):
    raise ImproperlyConfigured(
        'SQLite is not supported. Set DATABASE_URL to a PostgreSQL connection string.'
    )

DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# dj-database-url sets postgresql backend; ensure psycopg2 driver explicitly.
DATABASES['default'].setdefault(
    'ENGINE',
    'django.db.backends.postgresql',
)

AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    'SIGNING_KEY': _non_empty('JWT_SECRET_KEY', SECRET_KEY),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000',
    cast=Csv(),
)

# AI provider: stub | gemini
AI_PROVIDER = _non_empty('AI_PROVIDER', 'stub')
GEMINI_API_KEY = _non_empty('GEMINI_API_KEY', '')
GEMINI_MODEL = _non_empty('GEMINI_MODEL', 'gemini-2.0-flash')
GEMINI_TIMEOUT_SECONDS = config('GEMINI_TIMEOUT_SECONDS', default=30, cast=int)
GEMINI_TEMPERATURE = config('GEMINI_TEMPERATURE', default=0.2, cast=float)
AI_FALLBACK_TO_STUB = config('AI_FALLBACK_TO_STUB', default=True, cast=bool)

# Matching engine: rule_based (default) | ai (future re-ranker)
MATCHING_ENGINE = _non_empty('MATCHING_ENGINE', 'rule_based')
