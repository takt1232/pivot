---
name: Pivot
description: A personal work operating system kept as a tournament scoresheet.
colors:
  paper: "#F4F1E8"
  sheet: "#FCFAF3"
  ink: "#141414"
  pencil: "#6B6862"
  pencil-soft: "#6F6A60"
  rule: "#D6D0BF"
  rule-strong: "#2A2A28"
  annotation: "#9E2B25"
  resolved: "#3D6B4A"
  sel: "#F1ECDD"
  night-ground: "#171614"
  night-sheet: "#1F1E1B"
  night-ink: "#F1ECDD"
  night-pencil: "#A29B8B"
  night-soft: "#8C8679"
  night-rule: "#3A3833"
  night-strong: "#E8E2D3"
  night-annotation: "#E0685C"
  night-resolved: "#8FB894"
  night-sel: "#262420"
typography:
  display:
    fontFamily: Archivo
    fontSize: 30px
    fontWeight: 500
    letterSpacing: -0.02em
    lineHeight: 1.05
  headline:
    fontFamily: Archivo
    fontSize: 17px
    fontWeight: 600
  title:
    fontFamily: Courier Prime
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: Courier Prime
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: Archivo
    fontSize: 9px
    fontWeight: 600
    letterSpacing: 0.15em
rounded:
  none: 0px
  clip: 8px
spacing:
  row: 40px
  row-touch: 44px
  subrow: 30px
  rail: 196px
  sheet: 344px
components:
  move-row:
    backgroundColor: "{colors.sheet}"
    borderColor: "{colors.rule}"
    textColor: "{colors.ink}"
    height: 40px
  move-row-selected:
    backgroundColor: "{colors.sel}"
    borderColor: "{colors.annotation}"
  button-primary:
    backgroundColor: "transparent"
    borderColor: "{colors.rule-strong}"
    textColor: "{colors.ink}"
    height: 44px
---

# Design System: Pivot

## Overview

**Creative North Star: "The Tournament Scoresheet"**

Pivot is kept the way one person keeps a long game: numbered turns, a heavy rule down the centre, results written beside the move, and annotations in red ink in the margin. The interface is a working sheet, not a board of cards. Groups are games, items are moves, subitems are continuations, and the week is a round in progress. Nothing on the surface is decorative; every mark either records something or points at a decision.

The world is paper and type. Surfaces are flat sheets in two tones — the pad and the sheet laid on it — divided by hairlines and 2px rules. There are no rounded cards, no shadows, no coloured pills, and no icon set standing in for words. Density is the point: a full week reads in one viewport at 40px per row, and the detail sheet is clipped to the side rather than opened as a page.

**Night pad** is the same object under a desk lamp: the paper goes to near-black, the rules soften, the ink goes to warm white, and annotation red becomes a hotter signal. It is a second lighting condition, not an inversion.

**Key Characteristics:**
- Flat paper surfaces, two tones, no shadows.
- Courier Prime records the work; Archivo speaks about it.
- A 2px centre rule splits every move from its result.
- Red appears in the margin only: annotations, overdue values, one selection rule.
- Dense 40px rows on desktop, 44px rows on touch.

## Colors

A warm paper ground with one ink, one pencil, and one annotation red — the palette of a printed score pad.

### Primary

- **Annotation Red** (#9E2B25): the margin voice. Annotation glyphs (`!`, `?`, `✓`, `✗`), overdue dates and the overdue result word, the 1px rule marking the selected move. In the night pad it lifts to #E0685C so it still reads as ink on dark paper.

### Neutral

- **Paper** (#F4F1E8): the desk — rails, detail sheet, page ground.
- **Sheet** (#FCFAF3): the pad itself, one step lighter than the desk.
- **Ink** (#141414): titles, move titles, values, rules at full weight.
- **Pencil** (#6B6862): secondary records — player line, due dates, subitem titles.
- **Pencil Soft** (#6F6A60): labels and counts; kept above 4.5:1 on both paper tones.
- **Rule** (#D6D0BF): the 1px hairline under every row.
- **Rule Strong** (#2A2A28): the 2px centre rule, section rules, the pad's outer rules.
- **Resolved Green** (#3D6B4A): the check mark on a resolved move — the only green in the system.

### Named Rules

**The Marginal Red Rule.** Red never fills a surface, never becomes a chip, and never colours a whole row. It is ink in the margin: a glyph, a date, a 1px selection rule.

**The Two-Tone Paper Rule.** Depth comes from the desk/sheet pair, not from a tint scale. If a surface needs to step forward, it becomes the sheet colour and earns a rule; it does not get a shadow.

## Typography

**Display / UI Font:** Archivo (system-ui, sans-serif)
**Record Font:** Courier Prime (ui-monospace, Menlo, monospace)

**Character:** A grotesk that labels and a typewriter that records. Archivo is used small, in caps, for chrome — it tells you what section you are in. Courier Prime carries every title, state, date and note, so the board reads as something written rather than something configured.

### Hierarchy

- **Display** (500, 30px desktop / 27px compact, -0.02em): the board title. One per surface.
- **Headline** (600, 17px): the rail's product mark; the detail sheet's move title uses Courier Prime bold at the same size instead.
- **Title** (Courier Prime 700, 17px, 1.35): the move title in the detail sheet.
- **Body** (Courier Prime 400, 13.5px; 12.5px compact): move titles, notes, field values.
- **Label** (Archivo 600 or Courier Prime 400, 9–10px, 0.12–0.15em, uppercase): column heads, section labels, counts, states.

### Named Rules

**The Two Faces Rule.** Archivo never records a piece of work; Courier Prime never names a section. Breaking this makes the sheet look like a dashboard with a mono font.

**The Small Caps Rule.** Every label is uppercase at 9–10px with at least 0.12em tracking. Labels never exceed 10px, so they cannot compete with records.

## Layout

Three regions above 1024px: a 196px rail of sheets and games, the pad taking the rest, and a 344px detail sheet clipped to the right. Below that, the rail and sheet collapse: a compact bar with the product mark, then the pad full width, with the detail opened as a modal sheet from any row. Touch rows are 44px; desktop rows 40px; subitem rows 30px in both. The pad is inset 16px compact / 28px desktop; sections are separated by 16px and a rule, not by whitespace alone.

## Elevation & Depth

Flat by construction. There are no shadows anywhere in the product surfaces. Depth is tonal and linear: the desk (#F4F1E8) sits behind the sheet (#FCFAF3), 1px hairlines divide rows, 2px ink rules divide sections, and the detail sheet is separated by a 1px border and a paper clip. The only rounded object is the clip.

**The Flat Sheet Rule.** No shadow, blur, or glow in product surfaces. If something needs to lift, it changes paper tone and gains a rule.

## Shapes

Square corners everywhere (0 radius). Borders do the work: 1px hairlines for row division, 2px for the centre rule, 2.5px for the pad's major rules, 1px dashed for continuations. The single exception is the paper clip, a capsule at the top of the detail sheet. Nothing is inset or inset-shadowed.

## Components

### Buttons

- **Shape:** square (0 radius), 1px border in Rule Strong, 44px minimum height on touch, 34px on desktop.
- **Primary:** transparent ground, ink text, uppercase Archivo 10px at 0.12em. "Resolve" is the only primary action on the sheet.
- **Hover / Focus:** background to Sheet, plus the global 1px annotation-red focus outline at 2px offset. No transition longer than 100ms.
- **Secondary:** identical geometry, muted label ("Close").

### Move rows

- **Style:** 40px, Courier Prime 13.5px title, mono 11.5px result, mono 11px due, 8px annotation column.
- **Selected:** Sheet-tint background (#F1ECDD), a 1px annotation-red rule on the left edge, and the title goes bold. Never a filled colour row.
- **Resolved:** title struck through in Pencil Soft, result reads "resolved" with a green check.
- **Subitems:** 30px, dashed hairline, 10px id (`119.1`), 12px title, uppercase 9.5px state.

### Detail sheet

- **Style:** 344px paper column, 1px left border, paper-clip capsule, 2px rule under the header.
- **Fields:** 9px uppercase label in a 74px column, 12px Courier value, dotted 1px rule between rows.
- **Sections:** Continuation, Annotation, Record, Also in this game — each separated by a rule, never by a card.
- **Actions:** a single Resolve/Reopen control pinned to the bottom of the sheet.

### Navigation

- **Rail:** plain text rows, 13px Archivo, count in mono 10px at the right. The active sheet carries a 1px annotation-red margin rule and semibold weight. No icons.
- **Games:** the same row grammar, one level quieter, with the round number as the count.

## Do's and Don'ts

- Do keep every division as a rule; don't use gaps alone to separate sections.
- Do use annotation red for meaning only; don't use it for emphasis or hover.
- Do keep the record in Courier Prime and the chrome in Archivo.
- Don't introduce cards, pills, shadows, or gradients into a product surface.
- Don't add an icon where a word or a count will do.
- Don't let annotation marks float free of the row they annotate.
