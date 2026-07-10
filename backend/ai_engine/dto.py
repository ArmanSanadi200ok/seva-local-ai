from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class ParsedLocationDTO:
    city: str = 'Ichalkaranji'
    area: str = ''
    address: str = ''
    latitude: float | None = None
    longitude: float | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class ParsedTaskDTO:
    """Structured task intent returned by the AI pipeline."""

    title: str
    description: str
    category_slug: str | None
    subcategory: str
    urgency: str
    location: ParsedLocationDTO
    confidence: float
    locale: str
    schema_version: str = '1.0'
    keywords: list[str] = field(default_factory=list)
    provider: str = 'stub'
    raw_response: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        payload = asdict(self)
        payload['location'] = self.location.to_dict()
        return payload
