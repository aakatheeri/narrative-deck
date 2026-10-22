# narrative-deck

**Live demo:** https://YOURNAME.github.io/narrative-deck/

narrative-deck is not a deck generator and does not produce PDF, PPTX, or slide exports; it is a reference page plus implementation patterns for narrative web effects.

## I want to understand these effects

Open [`docs/index.html`](docs/index.html). Module 00 explains the nine-beat story frame; modules 01–15 demonstrate effects, why they hook, and where they belong.

| # | effect | primary beat |
|---:|---|---|
| 01 | Scroll-Triggered Reveal | Setup |
| 02 | Sticky Scrollytelling | Pinch Point 1 |
| 03 | Hover Disclosure | Inciting Incident |
| 04 | You Draw It Canvas | Midpoint |
| 05 | Physics Field | Setup texture |
| 06 | Forensic Annotation & Scrubber | Pinch / Plot Point 2 |
| 07 | Kinetic Type & Highlight Wipe | Hook / Climax preface |
| 08 | Parallax Depth | Hook |
| 09 | Color-Threaded Entities | Setup / Plot Point 2 |
| 10 | Binary Quiz Accumulator | Midpoint / Resolution |
| 11 | Turn-by-Turn Procedural Graphic | Pinch Point 2 |
| 12 | AR Placeholder Viewer | Midpoint |
| 13 | Before / After Comparison | Inciting Incident / Climax |
| 14 | Audio Waveform & Transcript Sync | Pinch Point 2 |
| 15 | Dynamic Paywall Simulator | Resolution |

## I want to build with them

Use `skill/SKILL.md` as the agent entry point, then read `skill/references/`. The reference files are terse specifications with implementation snippets lifted from the live demo. Templates in `templates/` map nine beats to pitch, explainer, and report structures.

### Install and use the skill

1. Copy the `skill/` folder into your agent's skills directory as `narrative-deck`.
2. Keep `skill/SKILL.md` as the entry file and `skill/references/` beside it.
3. In your project prompt, ask the agent to use the `narrative-deck` skill before writing code.
4. Give the agent your story type, target reader, source material, and which beat needs help.

Useful prompts:

- "Use the narrative-deck skill to turn this report into a nine-beat interactive article outline."
- "Use effect 04 at the Midpoint and effect 13 at the Inciting Incident; keep everything vanilla HTML/CSS/JS."
- "Read `placement.md` and suggest only effects that fit a pitch deck's problem → solution → ask arc."
- "Build from `templates/explainer.html`, wiring no more than three effects."

Avoid prompts:

- "Make it more interactive everywhere." Too broad; it ignores beat placement.
- "Add all 15 effects." Overloads the story and breaks the reference's hard limits.
- "Convert this to PowerPoint/PDF." This project is not a deck exporter.
- "Use React/GSAP/Tailwind." The implementation is dependency-free vanilla code.

### Non-negotiables

- Keep `docs/` read-only once moved.
- Vanilla HTML/CSS/JS only.
- Reduced-motion awareness for every animation.
- Keyboard parity for interactive elements.
- Canvas work must account for devicePixelRatio when precision matters.
- Replay must reset state without fighting observers.

### Hard limits

- No dependencies.
- No package.json.
- No bundlers or build step.
- `skill/SKILL.md` stays user-supplied.
- Each reference file stays under 400 words.

MIT licensed, copyright 2026 YOURNAME.
