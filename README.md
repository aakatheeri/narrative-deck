# narrative-deck

**Live demo:** https://aakatheeri.github.io/narrative-deck/

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

For manual use, give your assistant `skill/SKILL.md` as the entry point and keep `skill/references/` available beside it. The reference files are terse specifications with implementation snippets lifted from the live demo. Templates in `templates/` map nine beats to pitch, explainer, and report structures.

### Install and use the skill

This repository includes the Narrative Deck agent skill in `skill/`. Use it with Claude Code, Cursor, Codex, Cline, or any AI-assistant tool that can load skills, rules, or project instructions.

#### With `npx skills`

For supported agents, start the interactive installer:

```sh
npx skills add aakatheeri/narrative-deck
```

To target supported agents directly:

```sh
npx skills add aakatheeri/narrative-deck --agent claude-code cursor
```

Then ask your assistant:

```text
Use the narrative-deck skill to turn this material into a nine-beat interactive article.
Keep it vanilla HTML/CSS/JS and use no more than three effects.
```

#### Manual install

If your tool does not support `npx skills`, copy this repo's `skill/` folder manually:

```sh
git clone https://github.com/aakatheeri/narrative-deck.git
mkdir -p skills
cp -R narrative-deck/skill skills/narrative-deck
```

Then move `skills/narrative-deck` into the skills, rules, or project-context location your AI assistant uses.

Keep these files together:

```text
narrative-deck/
  SKILL.md
  references/
```

#### Tool notes

- **Claude Code:** use `npx skills add aakatheeri/narrative-deck`, or target Claude Code directly with `--agent claude-code`.
- **Cursor:** use `npx skills add aakatheeri/narrative-deck --agent cursor`, or add `skill/SKILL.md` and `skill/references/` as project context.
- **Codex:** add `skill/SKILL.md` as the instruction entry point and keep `skill/references/` available beside it.
- **Cline:** add `skill/SKILL.md` as the instruction entry point and let it read only the reference files for the chosen effects.
- **Other agents:** give the assistant `SKILL.md` first, then let it pull the reference files it needs.

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

MIT licensed, copyright 2026 Ahmed Alkatheeri.
