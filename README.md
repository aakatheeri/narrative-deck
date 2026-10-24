# Narrative Deck

**Live demo:** https://aakatheeri.github.io/narrative-deck/
**Skill/repo slug:** `narrative-deck`

**AI-agent skill for story-structured interactive web presentations.**

Narrative Deck helps assistants turn raw material into responsive, dependency-free HTML/CSS/JS decks, explainers, reports, scrollytelling pages, and pitch presentations. It combines a nine-beat narrative frame with editorial interaction effects, then guides the assistant to choose only the effects that fit the content.

This is a skill/reference repo, not an npm package. Install it with a skill installer or copy `skill/` into your assistant's skill/context folder.

## What it builds

- Interactive web presentations
- Pitch decks and investor narratives
- Executive briefings
- Product and technical explainers
- Editorial scrollytelling articles
- Research/report presentations
- Training or edutainment modules

## Why use it

- Story-first nine-beat structure.
- Effects chosen by narrative purpose, not decoration.
- Dependency-free vanilla HTML/CSS/JS output.
- Responsive from phone to projector.
- Reduced-motion and keyboard-accessibility rules.
- Visual direction adapts to audience, content, and tone.

## Works with

Claude Code, Cursor, Codex, Cline, or any assistant that can load `skill/SKILL.md` and nearby reference files.

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
Use the narrative-deck skill to turn this material into a nine-beat interactive web presentation.
If the visual direction is missing, ask me which design mode to use.
Keep it vanilla HTML/CSS/JS and use no more than three effects.
Do not default to edutainment unless I ask for it.
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

- "Use the narrative-deck skill to turn this report into a nine-beat interactive article outline. Infer the tone from the audience and content."
- "Use effect 04 at the Midpoint and effect 13 at the Inciting Incident; keep everything vanilla HTML/CSS/JS."
- "Read `placement.md` and suggest only effects that fit a pitch deck's problem → solution → ask arc."
- "Build from `templates/explainer.html`, wiring no more than three effects."
- "Create a restrained executive briefing. Do not use edutainment styling."
- "Create a premium investor pitch with a confident product-led look."
- "Create an evidence-led editorial investigation."
- "Create a precise technical explainer with diagrammatic interactions."
- "Create a warm edutainment learning module."

### Style is content-led

Narrative Deck does not require an edutainment look. If the user provides a brand, design system, or visual direction, tailor the deck to it. If the user gives a clear use case or audience, infer the mode and state the assumption. If visual direction is missing, ask one short follow-up question before building.

Ask: "What visual direction should this use?"

- Restrained executive briefing
- Premium investor/product pitch
- Evidence-led editorial/report
- Technical diagrammatic explainer
- Warm edutainment/learning module

If the user asks the assistant to choose, default to a restrained editorial web presentation. Effects should be tailored to the content's narrative job, not applied as decoration.

Avoid prompts:

- "Make it more interactive everywhere." Too broad; it ignores beat placement.
- "Add all 15 effects." Overloads the story and breaks the reference's hard limits.
- "Convert this to PowerPoint/PDF." This project is not a deck exporter.
- "Use React/GSAP/Tailwind." The implementation is dependency-free vanilla code.

### Output expectations

Narrative Deck outputs dependency-free vanilla HTML/CSS/JS. Generated decks should be responsive, keyboard-accessible, reduced-motion aware, and use no more than three effects unless the user explicitly changes the constraint.

