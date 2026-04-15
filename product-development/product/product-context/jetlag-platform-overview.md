# JetLag Platform Overview

JetLag is a travel-aware planning product focused on helping users reduce the effects of crossing time zones.

## Core User Flow

1. A traveler adds a trip manually or imports itinerary details.
2. JetLag determines key context such as departure, arrival, time-zone shift, and trip duration.
3. The system generates a personalized recovery plan.
4. The traveler receives reminders and can adjust the plan as travel changes.
5. JetLag tracks engagement and plan completion to improve future recommendations.

## Core Systems

### Trip Intake

- Manual trip entry
- Imported itinerary parsing
- Time-zone validation and normalization

### Recovery Planning

- Personalization based on sleep preference, trip timing, and time-zone delta
- Plan generation for pre-trip, travel day, and post-arrival windows
- Adjustment logic when users edit trip details

### Engagement Layer

- Reminders and notifications
- Daily plan view
- Lightweight completion tracking

### Insights Layer

- Onboarding conversion
- Plan generation success rate
- Reminder engagement
- Repeat-trip retention
