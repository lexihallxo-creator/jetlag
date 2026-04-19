from app.services.providers.google_places import GooglePlacesProvider


def test_google_places_normalization() -> None:
    provider = GooglePlacesProvider()
    place = {
        "id": "abc123",
        "displayName": {"text": "Raleigh Dental Arts"},
        "formattedAddress": "123 Main St, Raleigh, NC 27601, USA",
        "websiteUri": "https://example.com",
        "rating": 4.7,
        "userRatingCount": 143,
        "googleMapsUri": "https://maps.google.com/example",
        "location": {"latitude": 35.7796, "longitude": -78.6382},
        "nationalPhoneNumber": "+1 919-555-0100",
        "primaryType": "dentist",
        "types": ["dentist", "health"],
        "addressComponents": [{"longText": "Raleigh", "types": ["locality"]}],
    }

    normalized = provider._normalize_place(place, "dentist", "USA")

    assert normalized.source_record_id == "abc123"
    assert normalized.business_name == "Raleigh Dental Arts"
    assert normalized.city == "Raleigh"
    assert normalized.review_count == 143
