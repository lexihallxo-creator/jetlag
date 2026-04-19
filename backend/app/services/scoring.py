from app.core.constants import COMPLIANCE_KEYWORDS, OFFER_CATALOG
from app.schemas.lead import LeadScore, OfferBreakdown, WebsiteAudit


def _compliance_risk(category: str) -> int:
    lowered = category.lower()
    score = 20
    for keywords in COMPLIANCE_KEYWORDS.values():
        if any(token in lowered for token in keywords):
            score += 45
    return min(score, 100)


def score_lead(lead: dict, audit: WebsiteAudit) -> LeadScore:
    review_count = lead.get("review_count") or 0
    rating = lead.get("rating") or 0.0
    has_website = bool(lead.get("website"))
    website_pain = 0 if has_website else 75
    website_pain += 15 if not audit.title else 0
    website_pain += 10 if not audit.meta_description else 0
    website_pain += 15 if not audit.cta_present else 0
    website_pain += 12 if audit.forms_count == 0 else 0
    website_pain += 10 if not audit.viewport_present else 0
    website_pain += 8 if len(audit.missing_pages) >= 2 else 0
    website_pain = min(website_pain, 100)

    automation_pain = 20
    automation_pain += 25 if review_count >= 75 else 10 if review_count >= 20 else 0
    automation_pain += 20 if audit.forms_count == 0 else 0
    automation_pain += 15 if not audit.cta_present else 0
    automation_pain += 10 if rating >= 4.4 and review_count >= 25 else 0
    automation_pain = min(automation_pain, 100)

    ai_readiness = 20
    ai_readiness += 20 if has_website else 0
    ai_readiness += 15 if review_count >= 20 else 5 if review_count > 0 else 0
    ai_readiness += 10 if audit.cta_present else 0
    ai_readiness += 10 if audit.viewport_present else 0
    ai_readiness += 10 if audit.forms_count > 0 else 0
    ai_readiness += 10 if audit.wordpress_detected else 0
    ai_readiness = min(ai_readiness, 100)

    compliance_risk = _compliance_risk(lead.get("category") or "")

    demand_band = 2500
    if review_count >= 500:
        demand_band = 12000
    elif review_count >= 150:
        demand_band = 8000
    elif review_count >= 50:
        demand_band = 5000

    est_monthly_loss = int(demand_band * ((website_pain * 0.55 + automation_pain * 0.45) / 100))
    est_monthly_loss = max(est_monthly_loss, 1500)

    priority_score = int(
        min(
            100,
            website_pain * 0.3
            + automation_pain * 0.3
            + ai_readiness * 0.15
            + compliance_risk * 0.1
            + min(review_count, 300) * 0.05
            + (10 if rating >= 4.6 else 0),
        )
    )

    website_fit = website_pain >= 55
    audit_fit = automation_pain >= 45 or website_pain >= 45
    automation_fit = automation_pain >= 60
    tool_fit = ai_readiness >= 65 and review_count >= 20
    governance_fit = compliance_risk >= 60

    if website_fit and website_pain >= automation_pain:
        primary_offer = "Website + Conversion Refresh"
    elif automation_fit:
        primary_offer = "Automation Build Sprint"
    elif tool_fit:
        primary_offer = "Custom AI Tool Build"
    elif governance_fit:
        primary_offer = "AI Governance Gap Assessment"
    else:
        primary_offer = "AI Workflow Audit"

    secondary_offer = "AI Workflow Audit"
    if primary_offer == secondary_offer:
        secondary_offer = "Automation Build Sprint" if automation_pain >= website_pain else "Website + Conversion Refresh"
    elif governance_fit and primary_offer != "AI Governance Gap Assessment":
        secondary_offer = "AI Governance Gap Assessment"

    notes = []
    if review_count:
        notes.append(f"{review_count} public reviews indicate real demand.")
    if not has_website:
        notes.append("No website was found.")
    if audit.major_issues:
        notes.append(audit.major_issues[0])
    if compliance_risk >= 60:
        notes.append("Regulated-category signals raise governance sensitivity.")

    why_this_first = (
        f"{lead.get('business_name')} shows the clearest near-term revenue lift through {primary_offer.lower()} "
        f"because current friction likely leaks about ${est_monthly_loss:,}/month."
    )

    catalog = OFFER_CATALOG[primary_offer]
    return LeadScore(
        website_pain_score=website_pain,
        automation_pain_score=automation_pain,
        ai_readiness_score=ai_readiness,
        compliance_risk_score=compliance_risk,
        est_monthly_loss=est_monthly_loss,
        priority_score=priority_score,
        website_fit=website_fit,
        audit_fit=audit_fit,
        automation_fit=automation_fit,
        tool_fit=tool_fit,
        governance_fit=governance_fit,
        primary_offer=primary_offer,
        secondary_offer=secondary_offer,
        effort=catalog["effort"],
        timeline=catalog["timeline"],
        why_this_first=why_this_first,
        scoring_notes=notes,
    )


def build_offer_breakdown(offer_name: str, why_it_fits: str) -> OfferBreakdown:
    catalog = OFFER_CATALOG[offer_name]
    return OfferBreakdown(
        offer_name=offer_name,
        what_it_is=offer_name,
        how_we_execute=catalog["execution"],
        expected_effort=catalog["effort"],
        timeline=catalog["timeline"],
        value_range=catalog["value_range"],
        why_it_fits=why_it_fits,
    )
