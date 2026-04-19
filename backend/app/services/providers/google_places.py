from typing import Any

import httpx

from app.core.config import get_settings
from app.schemas.common import SourceName
from app.schemas.lead import BusinessSearchRequest, BusinessSearchResult


class GooglePlacesProvider:
    source_name = SourceName.GOOGLE_PLACES

    def __init__(self) -> None:
        self.settings = get_settings()

    async def search(self, request: BusinessSearchRequest) -> list[BusinessSearchResult]:
        if not self.settings.google_places_api_key:
            raise RuntimeError("GOOGLE_PLACES_API_KEY is required for Google Places search.")

        query_parts = [request.query, "in", request.city]
        if request.country:
            query_parts.extend([",", request.country])

        payload = {
            "textQuery": " ".join(query_parts),
            "maxResultCount": request.max_results,
        }
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": self.settings.google_places_api_key,
            "X-Goog-FieldMask": ",".join(
                [
                    "places.id",
                    "places.displayName",
                    "places.formattedAddress",
                    "places.websiteUri",
                    "places.rating",
                    "places.userRatingCount",
                    "places.googleMapsUri",
                    "places.location",
                    "places.nationalPhoneNumber",
                    "places.primaryType",
                    "places.types",
                    "places.addressComponents",
                ]
            ),
        }

        async with httpx.AsyncClient(timeout=self.settings.request_timeout_seconds) as client:
            response = await client.post(
                f"{self.settings.google_places_base_url}/places:searchText",
                json=payload,
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()

        return [self._normalize_place(place, request.query, request.country) for place in data.get("places", [])]

    def _normalize_place(
        self,
        place: dict[str, Any],
        query: str,
        country: str | None,
    ) -> BusinessSearchResult:
        city = None
        for component in place.get("addressComponents", []):
            types = component.get("types", [])
            if "locality" in types:
                city = component.get("longText")
                break

        return BusinessSearchResult(
            source_record_id=place["id"],
            source=SourceName.GOOGLE_PLACES,
            business_name=place.get("displayName", {}).get("text", "Unknown business"),
            category=place.get("primaryType") or query,
            city=city,
            country=country,
            address=place.get("formattedAddress"),
            website=place.get("websiteUri"),
            phone=place.get("nationalPhoneNumber"),
            rating=place.get("rating"),
            review_count=place.get("userRatingCount"),
            source_url=place.get("googleMapsUri"),
            latitude=(place.get("location") or {}).get("latitude"),
            longitude=(place.get("location") or {}).get("longitude"),
            categories=place.get("types", []),
            raw_payload=place,
        )
