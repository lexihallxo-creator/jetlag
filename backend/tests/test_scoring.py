from app.schemas.lead import WebsiteAudit
from app.services.scoring import score_lead


def test_scoring_prioritizes_real_conversion_gaps() -> None:
    lead = {
        "business_name": "Triangle HVAC",
        "category": "hvac",
        "review_count": 96,
        "rating": 4.7,
        "website": None,
    }
    audit = WebsiteAudit(
        url=None,
        major_issues=["No website found."],
        missing_pages=["homepage"],
    )
    score = score_lead(lead, audit)

    assert score.website_pain_score >= 75
    assert score.est_monthly_loss >= 1500
    assert score.primary_offer in {"Website + Conversion Refresh", "Automation Build Sprint"}
