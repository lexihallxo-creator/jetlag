from app.schemas.lead import LeadScore, OutreachDrafts, WebsiteAudit


def _first_fact(lead: dict, audit: WebsiteAudit) -> str:
    if lead.get("review_count"):
        return f"{lead['review_count']} public reviews"
    if not lead.get("website"):
        return "no usable website"
    if not audit.cta_present:
        return "no clear CTA on the site"
    if not audit.viewport_present:
        return "no mobile viewport tag"
    return "public demand signals with conversion gaps"


def build_outreach_drafts(lead: dict, score: LeadScore, audit: WebsiteAudit) -> OutreachDrafts:
    fact = _first_fact(lead, audit)
    offer_move = score.primary_offer
    email = (
        f"Saw {lead['business_name']} in {lead.get('city') or 'your market'}: {fact}, and that likely leaks "
        f"about ${score.est_monthly_loss:,}/mo. Best first move: {offer_move}. Want the 3-step breakdown?"
    )
    words = email.split()
    if len(words) > 80:
        email = " ".join(words[:80])

    whatsapp = (
        f"WhatsApp draft placeholder: {lead['business_name']} | fact={fact} | monthly_leak=${score.est_monthly_loss:,} | "
        f"best_first_move={offer_move}"
    )
    call_opener = (
        f"I checked {lead['business_name']} and noticed {fact}; the fastest win looks like {offer_move.lower()}."
    )
    return OutreachDrafts(email_draft=email, whatsapp_placeholder=whatsapp, call_opener=call_opener)
