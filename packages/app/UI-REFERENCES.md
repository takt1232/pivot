# UI References

Reference set for the surfaces described in [PRODUCT.md](./PRODUCT.md). These are sources to steal mechanics from, not a moodboard — nothing here is a visual direction. `DESIGN.md` stays absent until a direction is chosen and built.

Read the first three and you have 80% of it. The rest are specific parts to steal later.

## Start here

| Reference | Take | Why it earns the slot |
|---|---|---|
| **Linear** (linear.app) | The whole operating model: one flat list per view, monochrome ground, colour only on status dots, `Cmd K` for everything, single-letter keys, detail pane instead of page navigation | The three complaints — slow, heavy, mouse-bound — are exactly what Linear solved. It is the density and speed benchmark for the web side. |
| **Height** (height.app) | Spreadsheet-as-task-list: every cell editable in place, arrow keys walk the grid, no modal for a field edit | Closest existing thing to "monday's hierarchy with Linear's speed". Study its grid keyboard model, not its visuals. |
| **Things 3** (culturedcode.com/things) | Today / Upcoming / Anytime / Someday as *views over one dataset*; Areas vs Projects; the magic-plus capture button; motion that explains spatial change | The native side. It proves a personal work app needs no collaboration chrome, and its daily rhythm is the "what do I do next" answer. |

## Board, grid and views

| Reference | Take | Why here |
|---|---|---|
| **Notion databases** | View tabs (table / board / timeline / calendar) over one property set; the view config popover | Solves "rigid board structure": structure is properties, presentation is a saved view. |
| **Airtable** | Field-type picker, expand-record, grid power moves (fill down, drag handle, summary footer) | The column model and inline editing vocabulary. Do not copy its page weight. |
| **OmniFocus** (omnigroup.com/omnifocus) | Perspectives — saved, named filters over everything | The genuinely personal answer to "boards shouldn't be fixed": any cut of the data can become a first-class screen. |
| **Asana Timeline** | Range bars, drag-to-resize an end date, dependency arrows that reroute | The one timeline mechanic people actually understand. |
| **Superlist** | Native task-app craft: generous hit areas, satisfying completion, subtle haptics | Reference for making native feel built, not ported. |
| **Trello** | Drag affordances and the "drop anywhere" insertion preview | Cheap, familiar drag grammar. Keep the grammar, drop the card. |

## Keep from monday.com

The parts worth missing: groups as colour-banded blocks with a summarising footer row · subitem indentation under a parent row · per-column summaries (count, sum, date range) · the item detail side-panel rather than a full page · inline "+ add item" per group · board-to-timeline continuity.

These are good ideas buried in a product being left; keep them and delete the chrome around them.

## Timeline, calendar and the day

| Reference | Take | Why here |
|---|---|---|
| **Vimcal** | Full keyboard calendar: letter keys move the grid, single-key create/move, no drag required | Directly serves the keyboard-first constraint on date views. |
| **Sunsama** | Daily plan as a timeline of the day; evening shutdown ritual; dragging work into time | The "review" half of the cycle, which monday never does for one person. |
| **Notion Calendar** (ex-Cron) | Calendar rendering quality: hairlines, today marker, week density, time-blocking | Craft benchmark for the calendar view. |
| **Fantastical** | Natural-language entry ("fri 3pm ship board") | Best-in-class capture speed on native. |

## Dashboards and data

| Reference | Take | Why here |
|---|---|---|
| **Linear Insights** | 3–5 charts that fit on one screen, no dashboard builder, monochrome with one accent | Prevents the dashboard becoming another product. |
| **Tremor** / **Observable Plot** | Chart scales, tick density, tooltip behaviour, small-multiple layouts | Implementation-grade data-viz craft; Tremor for React, Plot for correctness. |
| **Height dashboards** | Charts bound to the same board data being edited | One dataset, no separate reporting model. |
| **Sparklines / Tufte small multiples** | Sequence of tiny charts instead of one big chart on a tile | Fits dense personal screens better than widget grids. |

## Docs and notes

| Reference | Take | Why here |
|---|---|---|
| **Coda** | Docs where tables and text are the same material, interleaved | Boards and docs must not become two apps. |
| **Craft** | Block-level native editing, drag a block anywhere | Native doc feel on iPad/iPhone. |
| **Obsidian** (local-first) | Plain files on disk, fast search, canvas | The local-first ethos and a "nice to grep" escape hatch. |
| **Bear** | Restrained markdown editor, one accent, excellent typography | Proof that a notes surface can be quiet and premium. |

## Keyboard and command surfaces

| Reference | Take | Why here |
|---|---|---|
| **Raycast** | Command palette anatomy: fuzzy ranking, sections, per-row shortcut hints, inline actions | The palette is the primary navigation, so it must be the best-made component. |
| **Superhuman** | Single-key triage, undo, speed as an explicit product value | Model for bulk triage of items without a mouse. |
| **GitHub's `?` overlay + Vim plugins** | Discoverable keymap listings generated from the real bindings | Keeps 60 shortcuts learnable. |
| **tldraw / Figma keyboard layers** | Modifier layering (`g` then `t`), selection-model consistency | Grammar for selection and multi-edit. |

## Density and visual system craft

| Reference | Take | Why here |
|---|---|---|
| **Vercel Geist** (vercel.com/geist) | Monochrome token system, tight type scale, restrained borders | A starting grammar for dense-but-calm UI. |
| **Bloomberg Terminal** | Row density and information-per-pixel ceiling | A calibration benchmark only — density target, not a look to copy. |
| **Material 3** + **Apple HIG** | Navigation, sheets, insets, dynamic type, dark mode | Not optional on `adaptive` (already loaded). |
| **Refactoring UI** | Hierarchy via weight/colour rather than size; spacing rhythm | Cheap, high-yield craft book. |
| **Butterick, *Practical Typography*** | Measure, leading and scale for the docs surface | Free online; settles long-form reading. |

## Where to browse real screens

- **Mobbin** (mobbin.com) — largest library of shipped app screens, filterable by pattern like "command palette" or "timeline".
- **Refero** (refero.design) — same idea, tighter curation.
- **Page Flows** — recorded flows, not stills, so transitions are visible.
- **Pttrns** — mobile only, best for native patterns.
- **SaaS Interface** — dashboards and data-dense admin screens.
- **App Motion** — microinteraction clips.
- **Built for Mars** — written teardowns of why specific flows work.

Skip Dribbble for interaction decisions: it rewards static composition, and everyone's monday alternative there is a board on a dark gradient.

## Anti-references

**monday.com** — coloured everything, template marketplace, seat upsell, automations as a product. **ClickUp** — settings sprawl, every feature visible at once. **Jira** — configuration-driven, slow, adversarial defaults. **Asana** — airy whitespace purchased with density. **Notion at scale** — the latency of a large database, and a view builder where a keyboard shortcut belongs. **Trello** — cards as the only unit.
