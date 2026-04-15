# Template customizer

## Overview
Add a preview and customization step between selecting a template and starting a project, so users can tweak colors, fonts, and content before committing.

## Steps
1. Create `TemplatePreview` page at `/templates/:id/preview`
   - Full-width live preview of the template in an iframe
   - Sidebar with customization controls
   - "Use this template" button creates project with applied customizations
2. Add customization panel in `src/components/templates/`
   - Color picker: primary, secondary, accent, background
   - Font selector: heading and body font from curated list
   - Content fields: replace placeholder text (company name, tagline, CTA)
3. Build preview update pipeline
   - Apply customizations in real time to the iframe preview
   - Use CSS custom properties for color/font swaps
   - Text replacements via DOM manipulation in the preview frame
4. Add "Start with AI" option
   - Instead of manual customization, user describes changes in a prompt
   - AI applies requested modifications to the template as a starting point
5. Add tests
   - Color changes reflect immediately in preview
   - Font swap applies to correct elements
   - Created project contains all customizations
