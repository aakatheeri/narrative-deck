---
name: narrative-deck
description: >-
  Builds narrative-structured web presentations — a nine-beat story frame
  plus fifteen editorial effects, in pure HTML/CSS/JS with zero
  dependencies, responsive from phone to projector. Use when the user asks
  for a deck, slides, a pitch, a presentation, a talk, or a scroll-driven
  story page; or when they say "make it feel premium", "like a NYT story",
  "editorial", "scrollytelling", or "interactive presentation".
license: MIT
---

# Narrative Deck

Nine-beat story frame, fifteen implemented effects, three starting
templates. Placement matters more than execution.

## Scope

**Does:** structure a deck around narrative beats; implement scroll,
canvas, and interaction effects; produce responsive single-file or
three-file HTML decks.

**Does not:** write the user's content; export PDF/PPTX; design brand
systems; evaluate general UX.

## Workflow

1. Ask what the deck is for and who sees it. Do not skip this.
2. Map content to the nine beats — read `references/structure.md`.
3. Choose **at most three** effects — read `references/placement.md`.
4. Confirm the beat list and effect list with the user before coding.
5. Start from a template in `../templates/`, not from scratch.
6. Implement using the per-effect reference files.
7. Run `references/checklist.md` before declaring done.

## The Nine Beats

Hook → Setup → Inciting Incident → Pinch 1 → Midpoint → Pinch 2 →
Plot Point 2 → Climax → Resolution

Full table with positions, jobs, and principles:
`references/structure.md`

## The Fifteen Effects

| # | Effect | Serves | Reference |
|---|---|---|---|
| 01 | Scroll reveal | Setup | `references/01-reveal.md` |
| 02 | Sticky scrollytelling | Pinch 1 | `references/02-scrolly.md` |
| 03 | Hover disclosure | Inciting | `references/03-hover.md` |
| 04 | You Draw It | Midpoint | `references/04-draw.md` |
| 05 | Physics field | Ambient | `references/05-orbs.md` |
| 06 | Forensic annotation | Pinch 1 / PP2 | `references/06-forensic.md` |
| 07 | Kinetic type | Hook / Climax | `references/07-type.md` |
| 08 | Parallax depth | Hook | `references/08-parallax.md` |
| 09 | Colour threading | Throughout | `references/09-thread.md` |
| 10 | Binary quiz | Midpoint | `references/10-quiz.md` |
| 11 | Turn-by-turn | Pinch 2 | `references/11-proc.md` |
| 12 | Spatial viewer | Midpoint | `references/12-ar.md` |
| 13 | Before/after | Inciting / Climax | `references/13-ba.md` |
| 14 | Audio waveform | Pinch 2 | `references/14-wave.md` |
| 15 | Paywall simulator | Resolution | `references/15-pw.md` |

Read a reference file only for effects actually being used.

## Architecture — Non-Negotiable

1. Read `prefers-reduced-motion` once into a constant. Every animation
   checks it and jumps to end state.
2. Triggers use `IntersectionObserver`, not scroll handlers. Where scroll
   position is genuinely needed, wrap in `requestAnimationFrame` with a
   `ticking` guard and `{passive:true}`.
3. Gate canvas loops behind `IntersectionObserver`. Never run more than
   three simultaneously.
4. Anything replayable uses WAAPI — `element.animate()` with
   `fill:'both'`, `cancel()` before re-running. Not CSS class toggles.
   See `references/anti-patterns.md`.
5. All colour, type, and easing values come from `:root` custom
   properties. See `references/tokens.md`.
6. Hover reveals also fire on `:focus-visible`. Interactive elements are
   `<button>`, never `<div>`.
7. Every canvas scales by `devicePixelRatio`.
8. Arrow keys and space advance slides. Responsive from 360px up.

## Hard Limits

- **Three effects per deck maximum.** Four reads as a showreel.
- **Never place an effect at the climax.** Spectacle competes with
  resolution.
- **Parallax: six layers maximum.**
- **Kinetic type: headlines only.** Never body copy.
- **No dependencies.** No build step, no framework, no package.json.

## Templates

| File | Shape |
|---|---|
| `../templates/pitch.html` | problem → solution → ask |
| `../templates/explainer.html` | question → mechanism → implication |
| `../templates/report.html` | finding → evidence → recommendation |

## Live Reference

`../docs/index.html` runs all fifteen effects with replay controls.
Lift working code from there rather than regenerating it.
