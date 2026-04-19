from app.schemas.lead import WebsiteAudit
from app.services.outreach import build_outreach_drafts
from app.services.scoring import score_lead


def test_outreach_generation_is_short_and_factual() -> None:
    lead = {
        "business_name": "Raleigh Dental Arts",
        "city": "Raleigh",
        "category": "dentist",
        "review_count": 143,
        "rating": 4.8,
        "website": "https://example.com",
    }
    audit = WebsiteAudit(
        url="https://example.com",
        title="Dentist in Raleigh",
        meta_description=None,
        cta_present=False,
        forms_count=0,
        viewport_present=True,
        missing_pages=["reviews"],
        major_issues=["No lead capture form detected."],
    )
    score = score_lead(lead, audit)
    drafts = build_outreach_drafts(lead, score, audit)

    assert len(drafts.email_draft.split()) <= 80
    assert "143 public reviews" in drafts.email_draft
    assert "Best first move" in drafts.email_draft
