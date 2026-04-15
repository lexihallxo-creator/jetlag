# Activity feed

## Overview
Surface a timeline of recent edits, deploys, and collaborator activity below My Projects so users can quickly resume work or see what teammates changed.

## Steps
1. Add `GET /api/home/activity` endpoint in `src/routes/home.ts`
   - Aggregate recent events: project edits, deploys, shares, comments
   - Return last 20 events, paginated
   - Filter to projects the user owns or is shared on
2. Create `ActivityFeed` component in `src/components/home/`
   - Each item shows: avatar, action description, project name, timestamp
   - Click navigates to the relevant project or deploy
   - Relative timestamps ("2 hours ago")
3. Add activity event recording
   - Emit events from project editor, deploy pipeline, and share flow
   - Write to `activity_events` table with user_id, project_id, event_type, metadata
4. Add "Shared with me" filter toggle
   - Default shows all, toggle filters to only shared project activity
5. Add tests
   - Feed shows events across owned and shared projects
   - Pagination loads more items
   - Events record correctly from each source
