# Real-time collaboration

## Overview
Enable multiplayer editing so team members can work on the same project simultaneously with live presence indicators and conflict-free updates.

## Steps
1. Set up WebSocket collaboration server
   - Add `yjs` for CRDT-based document sync
   - Authenticate connections using existing session token
   - Room per project, auto-join on project open
2. Add presence indicators in `src/components/editor/`
   - Show collaborator avatars in top bar with colored borders
   - Display colored cursors/selections in the code view
   - "Currently viewing" indicator on the visual canvas
3. Add real-time sync for AI generations
   - When one user submits a prompt, others see a "generating..." indicator
   - Result streams to all connected clients simultaneously
   - Lock prompt input for others during active generation
4. Add conflict resolution
   - CRDT handles concurrent text edits automatically
   - Visual canvas changes use last-write-wins with undo support
   - Show toast when another user's edit affects your current view
5. Add tests
   - Two clients see each other's edits in real time
   - Presence shows correct collaborator count
   - Concurrent edits merge without data loss
