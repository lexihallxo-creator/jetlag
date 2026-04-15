# Prompt suggestions

## Overview
Show contextual starter prompts below the main input based on user's past projects and trending templates, replacing the static placeholder text.

## Steps
1. Create `SuggestionEngine` service in `src/services/suggestions.ts`
   - Pull user's last 5 project types (dashboard, landing page, portfolio, etc.)
   - Mix in 2-3 trending templates from the catalog
   - Return 4-6 prompt suggestions ranked by relevance
2. Add `GET /api/home/suggestions` endpoint in `src/routes/home.ts`
   - Call SuggestionEngine, return formatted suggestion cards
   - Cache per user for 1 hour
3. Create `SuggestionChips` component in `src/components/home/`
   - Render horizontally scrollable chips below the prompt input
   - Click fills the prompt input with the suggestion text
   - Show skeleton loader while fetching
4. Add new-user fallback path
   - If no project history, show category-based starters (SaaS, portfolio, e-commerce, internal tool)
5. Add tests
   - Suggestions reflect user project history
   - Fallback renders for new users
   - Click populates prompt input
