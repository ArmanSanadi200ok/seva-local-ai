"""
Development settings — DEBUG on, PostgreSQL via DATABASE_URL from .env.
"""

from .base import *  # noqa: F403

DEBUG = True

ALLOWED_HOSTS = [*ALLOWED_HOSTS, 'testserver']  # noqa: F405

CORS_ALLOW_ALL_ORIGINS = config('CORS_ALLOW_ALL_ORIGINS', default=True, cast=bool)  # noqa: F405
