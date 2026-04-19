DEFAULT_TOWNS = [
    "Raleigh",
    "Durham",
    "Chapel Hill",
    "Cary",
    "Morrisville",
    "Apex",
    "Holly Springs",
    "Garner",
    "Wake Forest",
    "Zebulon",
    "Sanford",
    "Pittsboro",
    "Carrboro",
    "Wilson",
]

DEFAULT_COUNTRY = "USA"

DEFAULT_CATEGORIES = [
    "dentist",
    "med spa",
    "hvac",
    "plumber",
    "landscaper",
    "roofer",
    "law firm",
    "accountant",
]

SUPPORTED_SOURCES = [
    "google_places",
    "website_audit",
    "local_directory_stub",
]

OFFER_CATALOG = {
    "Website + Conversion Refresh": {
        "execution": "Rewrite the funnel, tighten landing pages, add proof, and fix mobile conversion gaps.",
        "effort": "2-4 weeks",
        "timeline": "Fast rebuild",
        "value_range": "$4k-$12k",
    },
    "AI Workflow Audit": {
        "execution": "Map intake, handoffs, follow-up, and reporting, then rank the highest-leak automation wins.",
        "effort": "3-5 days",
        "timeline": "1 week",
        "value_range": "$1.5k-$4k",
    },
    "Automation Build Sprint": {
        "execution": "Implement lead capture, follow-up, review recovery, and CRM sync using n8n/Make/Zapier.",
        "effort": "1-2 weeks",
        "timeline": "Quick win",
        "value_range": "$3k-$9k",
    },
    "Custom AI Tool Build": {
        "execution": "Ship a focused internal tool for quoting, knowledge retrieval, or operations.",
        "effort": "3-6 weeks",
        "timeline": "Structured build",
        "value_range": "$8k-$25k",
    },
    "AI Governance Gap Assessment": {
        "execution": "Review current AI usage, data handling, approval flows, and policy gaps.",
        "effort": "1-2 weeks",
        "timeline": "Decision-ready",
        "value_range": "$2.5k-$8k",
    },
}

COMPLIANCE_KEYWORDS = {
    "health": ["dentist", "medical", "med spa", "clinic", "orthodontist", "therapy"],
    "finance": ["accountant", "financial", "insurance", "mortgage", "tax"],
    "legal": ["law", "attorney", "lawyer", "estate planning"],
}
