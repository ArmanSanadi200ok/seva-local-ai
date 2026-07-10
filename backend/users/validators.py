import re

from django.core.exceptions import ValidationError

_DIGITS_ONLY = re.compile(r'\D+')


def normalize_phone_number(value: str) -> str:
    """Normalize input to E.164 (+91XXXXXXXXXX) for storage."""
    if not value or not str(value).strip():
        raise ValidationError('Phone number is required.')

    digits = _DIGITS_ONLY.sub('', value.strip())

    if len(digits) == 10 and digits[0] in '6789':
        return f'+91{digits}'
    if len(digits) == 12 and digits.startswith('91') and digits[2] in '6789':
        return f'+{digits}'

    raise ValidationError(
        'Enter a valid Indian mobile number (10 digits, optional +91 prefix).'
    )
