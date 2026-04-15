# Engineering Plan: Recovery Reminders

## Objectives

- Trigger reminders relative to trip milestones rather than fixed local times
- Respect quiet hours and user preference controls
- Record delivery, open, and completion attribution events

## Implementation Notes

- Use trip and plan state as the source of truth for reminder timing
- Build a fallback behavior for delayed or edited trips
- Keep the first version channel-agnostic so push, SMS, and email can share scheduling rules
