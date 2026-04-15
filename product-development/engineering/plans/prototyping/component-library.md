# Component library

## Overview
Let users save reusable components (navbars, hero sections, footers) from one project and drop them into new projects, building a personal design system over time.

## Steps
1. Add "Save as component" action in the editor
   - Right-click element → "Save to library"
   - Prompt for component name and optional tags
   - Extract component code + styles into `saved_components` table
2. Add `GET/POST /api/components` endpoints in `src/routes/components.ts`
   - List user's saved components with preview thumbnails
   - Create new component from selected element tree
3. Create `ComponentLibrary` panel in `src/components/editor/`
   - Searchable grid of saved components with visual previews
   - Drag or click to insert into current project
   - Edit name/tags inline
4. Add component insertion logic
   - Insert component code at cursor position or selected container
   - Resolve style conflicts with existing project styles
   - Adapt responsive breakpoints to match project settings
5. Add tests
   - Save extracts correct element tree and styles
   - Insert renders component correctly in new project
   - Search filters by name and tags
