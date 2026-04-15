# Preview environments

## Overview
Generate shareable preview links for each version of a project so users can share work-in-progress with stakeholders without deploying to production.

## Steps
1. Add preview deploy pipeline
   - On "Share preview" action, deploy current project state to isolated preview environment
   - Generate unique URL: `preview-{hash}.lovable.app`
   - Store in `preview_deploys` table with project_id, version, created_at, expires_at
2. Add `POST /api/projects/:id/previews` endpoint in `src/routes/previews.ts`
   - Create preview deploy and return shareable URL
   - `GET /api/projects/:id/previews` — list active previews
   - `DELETE /api/projects/:id/previews/:previewId` — tear down preview
3. Create `SharePreview` component in `src/components/editor/`
   - Button in editor toolbar → generates preview link
   - Copy-to-clipboard with success toast
   - Show list of active previews with expiry countdown
4. Add preview expiry and cleanup
   - Previews expire after 7 days by default
   - User can extend or set to "never expire" (paid plans only)
   - Cron job tears down expired preview environments
5. Add optional password protection
   - Toggle to require a password to view the preview
   - Simple password gate page before rendering the preview
6. Add tests
   - Preview deploy creates accessible URL
   - Expired previews return 410 Gone
   - Password-protected previews require correct password
