from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup

from app.core.config import get_settings
from app.schemas.lead import WebsiteAudit


class WebsiteAuditAdapter:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def audit(self, url: str | None, *, query: str, city: str | None) -> WebsiteAudit:
        if not url:
            return WebsiteAudit(
                url=None,
                major_issues=["No website found."],
                missing_pages=["homepage"],
                gbp_gap_note="GBP/map-pack audit is deferred behind a future provider adapter.",
                citation_review_velocity_note="Review velocity is estimated from current public review count only.",
            )

        normalized_url = url if url.startswith("http") else f"https://{url}"
        try:
            async with httpx.AsyncClient(
                timeout=self.settings.request_timeout_seconds,
                follow_redirects=True,
                headers={"User-Agent": "hxp.digital lead engine audit bot"},
            ) as client:
                response = await client.get(normalized_url)
            html = response.text
        except Exception as exc:  # noqa: BLE001
            return WebsiteAudit(
                url=normalized_url,
                major_issues=[f"Site fetch failed: {exc}"],
                gbp_gap_note="GBP/map-pack audit is deferred behind a future provider adapter.",
                citation_review_velocity_note="Review velocity is estimated from current public review count only.",
            )

        soup = BeautifulSoup(html, "html.parser")
        text = soup.get_text(" ", strip=True).lower()
        title = soup.title.string.strip() if soup.title and soup.title.string else None
        meta = soup.find("meta", attrs={"name": "description"})
        meta_description = meta.get("content", "").strip() or None if meta else None
        viewport = soup.find("meta", attrs={"name": "viewport"}) is not None
        forms_count = len(soup.find_all("form"))
        has_wordpress = "wp-content" in html or "wordpress" in html.lower()
        cta_tokens = ["book", "schedule", "call", "contact", "quote", "request", "consult"]
        cta_present = any(token in text for token in cta_tokens)

        keyword_targets = [query.lower()]
        if city:
            keyword_targets.append(city.lower())

        missing_keywords = [token for token in keyword_targets if token not in text]
        keyword_hits = len(keyword_targets) - len(missing_keywords)
        keyword_coverage_estimate = int((keyword_hits / max(1, len(keyword_targets))) * 100)

        missing_pages: list[str] = []
        anchor_hrefs = " ".join(link.get("href", "") for link in soup.find_all("a"))
        for page in ["contact", "services", "about", "reviews"]:
            if page not in anchor_hrefs.lower():
                missing_pages.append(page)

        major_issues: list[str] = []
        if not title:
            major_issues.append("Missing page title.")
        if not meta_description:
            major_issues.append("Missing meta description.")
        if not viewport:
            major_issues.append("Missing mobile viewport meta tag.")
        if forms_count == 0:
            major_issues.append("No lead capture form detected.")
        if not cta_present:
            major_issues.append("No strong CTA language detected.")

        host = urlparse(normalized_url).netloc
        return WebsiteAudit(
            url=normalized_url,
            status_code=response.status_code,
            title=title,
            meta_description=meta_description,
            cta_present=cta_present,
            forms_count=forms_count,
            wordpress_detected=has_wordpress,
            viewport_present=viewport,
            keyword_coverage_estimate=keyword_coverage_estimate,
            missing_keywords=missing_keywords,
            missing_pages=missing_pages,
            major_issues=major_issues,
            gbp_gap_note="GBP/map-pack coverage is not directly integrated yet; this field is a provider-backed placeholder.",
            citation_review_velocity_note=f"Public review velocity heuristic is based on current review count only for {host}.",
            raw_snapshot={"host": host, "html_length": len(html)},
        )
