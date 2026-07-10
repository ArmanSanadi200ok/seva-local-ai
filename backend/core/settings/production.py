"""
Production settings — DEBUG off, required environment variables enforced.
"""

from decouple import UndefinedValueError

from .base import _non_empty, config  # noqa: F401
from .base import *  # noqa: F403

DEBUG = False

_REQUIRED_ENV_VARS = (
    'SECRET_KEY',
    'ALLOWED_HOSTS',
    'DATABASE_URL',
    'JWT_SECRET_KEY',
)

for _var in _REQUIRED_ENV_VARS:
    try:
        if _non_empty(_var, '') == '':
            raise UndefinedValueError(f'{_var} is not set.')
    except UndefinedValueError as exc:
        raise UndefinedValueError(
            f'{_var} must be set in production.'
        ) from exc

CORS_ALLOW_ALL_ORIGINS = False

# Optional: DATABASE_SSLMODE=require (or verify-full) for managed Postgres.
_sslmode = _non_empty('DATABASE_SSLMODE', '')
if _sslmode:
    DATABASES['default'].setdefault('OPTIONS', {})['sslmode'] = _sslmode  # noqa: F405
