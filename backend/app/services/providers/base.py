from typing import Protocol

from app.schemas.lead import BusinessSearchRequest, BusinessSearchResult


class BusinessSearchProvider(Protocol):
    source_name: str

    async def search(self, request: BusinessSearchRequest) -> list[BusinessSearchResult]:
        ...
