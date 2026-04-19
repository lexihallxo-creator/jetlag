from enum import StrEnum


class SourceName(StrEnum):
    GOOGLE_PLACES = "google_places"
    WEBSITE_AUDIT = "website_audit"
    LOCAL_DIRECTORY_STUB = "local_directory_stub"


class LeadStage(StrEnum):
    NEW = "new"
    QUEUED = "queued"
    CONTACTED = "contacted"
    REPLIED = "replied"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    WON = "won"
    LOST = "lost"
    ARCHIVED = "archived"
