export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export const DEFAULT_TOWNS = [
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
] as const;

export const SOURCE_OPTIONS = [
  { id: "google_places", label: "Google Places", status: "Live" },
  { id: "website_audit", label: "Website Audit", status: "Adapter" },
  { id: "local_directory_stub", label: "Local Directory", status: "Stub" },
] as const;

export const DEFAULT_CATEGORIES = [
  "dentist",
  "med spa",
  "hvac",
  "plumber",
  "landscaper",
  "roofer",
  "law firm",
  "accountant",
] as const;

export const STAGE_OPTIONS = [
  "new",
  "queued",
  "contacted",
  "replied",
  "proposal",
  "negotiation",
  "won",
  "lost",
  "archived",
] as const;

export const OPEN_PIPELINE_STAGES = new Set([
  "new",
  "queued",
  "contacted",
  "replied",
  "proposal",
  "negotiation",
]);

export const PAST_PIPELINE_STAGES = new Set(["won", "lost", "archived"]);
