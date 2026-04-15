# Step 5: Review & Finalization

## Goal

Final review of the complete bi-weekly document. Ensure all sections are accurate, well-framed, and ready for the team meeting.

---

## Process

By this point, all sections have been written to the dated output file and pushed to Google Docs. This step is about review, refinement, and sign-off.

### 1. Read back the full file

Read the complete dated output file and present a summary of what's included:
- Number of sections
- Any sections that were carried forward unchanged
- Any sections that were updated or newly created
- Confirmation that Google Doc push succeeded (from Step 4)

### 2. Ask for revisions

Prompt: **"Any sections to revise? Any ad-hoc content to add (competitive analysis, strategic notes, etc.)?"**

If the PM requests changes:
- Make the edits in the markdown file
- Present the updated section for approval
- Re-push the updated section to Google Docs if needed

### 3. Final review checklist

Walk through the quality checklist before sign-off:

- [ ] **Accuracy:** All workstream statuses reflect reality (not just Linear / Jira / Asana)
- [ ] **Framing:** Headlines are business-goal-led, not feature-led
- [ ] **Quotes:** All customer quotes are verbatim with correct attribution
- [ ] **Categories:** All customers correctly categorized (Paying/Pilot/Pipeline/Free tier)
- [ ] **Completeness:** No calls or significant developments missing
- [ ] **Actionability:** Highlights are strategic and actionable for leadership
- [ ] **Formatting:** Tables render correctly, no broken markdown
- [ ] **Google Doc:** Content successfully pushed and formatted

### 4. Sign-off

Prompt: **"Everything look good? Ready to share with the team?"**

If approved:
- Confirm the Google Doc link is shareable with the intended audience
- Note any follow-up items that came up during review

### 5. Post-meeting: save transcript

After the bi-weekly meeting, process the meeting transcript:
- Save transcript to `product/meetings/team-bi-weekly/transcripts/YYYY-MM-DD.md`
- Save summary to `product/meetings/team-bi-weekly/summaries/YYYY-MM-DD.md`
- Extract action items and flag any that need Linear / Jira / Asana issues

---

## Notes

- The Google Doc is the final shared version. The markdown file is the working copy and historical archive.
- If the PM wants to skip Google Doc push and transfer content manually, that's fine. The markdown file is always the canonical source.
- The published file in `product/meetings/team-bi-weekly/docs/` serves as the historical record for future reference and trend analysis.
- Ad-hoc additions (competitive notes, strategic memos) should be clearly marked as one-off sections, not folded into the recurring structure.
