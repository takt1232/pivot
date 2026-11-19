---
version: 1
slug: "apps-next-app-page-tsx"
primary_target: "apps/next/app/page.tsx"
related_targets: ["packages/app/features/board/board-screen.tsx","apps/expo/app/index.tsx"]
---

# Board — the scoresheet

**Scope:** the board view at `/`, rendered from `packages/app` on web and native.
**Mode:** Operate.

## Direction contract

**THESIS:** The board is a tournament scoresheet — one game per group, one numbered move per item — refusing the colour-coded board and the card grid.

**OWN-WORLD:** A score pad: paper `#F4F1E8`, sheet `#FCFAF3`, ink `#141414`, annotation red `#9E2B25`, pencil `#6B6862`. Courier Prime carries every record line; Archivo carries chrome and titles. A heavy centre rule splits each move from its result; red glyphs (`!`, `?`, `✓`, `✗`) sit in the margin. No rounded cards, no shadows, no colour chips.

**STORY:** The operator reads the week as a game in progress — what was played, what it resolved to, what is annotated, what is overdue — then edits the row or opens its sheet.

**FIRST VIEWPORT:** Left rail of sheets and games; a pad with player line, headings set as `1. SHIPS THIS WEEK`, numbered turns, a centre rule, results, due dates and red marks; a paper-clipped detail sheet on the right showing move 2, its continuation and annotation; a result line at the foot of the pad.

**FORM:** the Score Sheet, first of seven grounded directions. seed:2282a37780bd0e58

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
