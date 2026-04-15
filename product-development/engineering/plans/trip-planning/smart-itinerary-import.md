# Engineering Plan: Smart Itinerary Import

## Objectives

- Support manual paste input as the first import path
- Normalize departure and arrival timestamps into a canonical trip object
- Flag low-confidence parses for user confirmation

## Implementation Notes

- Separate parsing from trip persistence so new import sources can be added later
- Preserve original raw input for debugging and support
- Instrument parse success, fallback edits, and abandonment
