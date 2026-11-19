# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Exactly one person: the repository owner. There is no team, no seat model, no permissions, no sharing, no mentions, and no second audience to satisfy.

They use it daily from two places:

- a desktop browser, keyboard in hand, doing planning, triage and bulk edits;
- a phone, reading and quick captures.

The work it holds is their own: side projects and open-source builds that run over months, freelance and employment tasks with real deadlines, and study or learning tracks with courses, exams and reading.

## Product Purpose

A personal work operating system that replaces monday.com for a single user. It holds boards of grouped items, nested subitems, a timeline, dashboards, and long-form notes in one place, so that planning, doing and reviewing do not require four separate apps.

Success means the owner opens it daily because it is the fastest way to answer "what do I do next," and never opens monday.com again.

## Positioning

Monday.com is built to be sold to organisations: templates, permissioning, collaboration surfaces, and a board model shaped by what demos well to a committee. This product is built for one named person, so the board structure is theirs to define, the interface can be dense instead of illustrative, and the primary input is the keyboard.

The claim a team product could not copy: every surface is optimised for a single operator who knows the data intimately, and none of the interface budget is spent on onboarding strangers, selling seats, or mediating between people.

## Operating Context

- Four reference workflows from monday.com that must survive: boards with coloured groups and rows, subitems and checklists under a row, timeline and calendar date views, dashboards and charts, and docs attached to a project.
- Explicitly not selected, so treat as out of scope until requested: per-person assignment columns, a cross-board "My Work" inbox of notifications, and rule-based automations.
- Characteristics of the replaced tool the owner is escaping: too expensive, too slow and chrome-heavy, too rigid in board structure, and not keyboard-driven.
- Both platforms must render from the shared package in `packages/app`; the Next.js and Expo apps stay thin routers.

## Capabilities and Constraints

Confirmed:

- Boards contain groups of items, ordered and reorderable; items carry columns and inline editing.
- Items nest into subitems and checklists.
- Tasks carry comments and subtasks. A task's progress percentage is derived from its subtasks and only appears once subtasks exist.
- Date views: timeline (ranges across time) and calendar (due dates).
- Dashboards and charts that aggregate the same board data.
- Long-form docs and notes attached to a project.
- Keyboard-first operation on web: navigation, item creation, editing, reordering and view switching without a pointer.
- Adaptive design: web is the dense desktop workspace; native is a touch-appropriate companion, not a stretched website.

Data:

- Local-first storage. A versioned JSON payload via AsyncStorage on native and `localStorage` on web, working offline without an account. The schema can move to SQLite once it settles.
- The storage layer must sit behind an interface so it can be swapped for a hosted database such as Supabase without rewriting features. Do not hard-code local-only assumptions into feature code.

Undecided:

- Sync between the two devices. Local-first is confirmed; multi-device sync is not designed yet.
- Whether status/people-style typed columns exist beyond the confirmed board, subitem and date structures.

## Evidence on Hand

None. The app now stores the owner's own projects and tasks locally; there is no imported data, no testimonials, no benchmarks, and no user research. Future work must not fabricate product claims, metrics or social proof.

## Product Principles

1. One operator, no audience. If a feature exists to persuade, onboard or coordinate strangers, it does not belong.
2. The keyboard is the primary interface on web; every action reachable by mouse is reachable faster by key.
3. Density is a feature. Show more of the real work per screen instead of illustrative whitespace and card chrome.
4. The board is the data model, not a template. Structure is defined by the owner, not by a marketplace of presets.
5. Own the data. Local-first, offline-capable, and portable to another backend without changing the product surfaces.

## Accessibility & Inclusion

Keyboard operability on web is a product requirement, not a nice-to-have: focus order, visible focus, and keyboard equivalents for drag, reordering and view switching. Touch targets on native must meet platform minimums.
