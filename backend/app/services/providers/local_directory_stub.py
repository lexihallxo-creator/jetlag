from app.schemas.common import SourceName
from app.schemas.lead import BusinessSearchRequest, BusinessSearchResult


class LocalDirectoryStubProvider:
    source_name = SourceName.LOCAL_DIRECTORY_STUB

    async def search(self, request: BusinessSearchRequest) -> list[BusinessSearchResult]:
        return []
