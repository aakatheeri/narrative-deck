# Tokens

See live anchors from every effect reference, e.g. [01](../../docs/index.html#m1).

## Visual direction
Choose tokens from brand, audience, content, and tone. If direction is clear, infer and state the assumption. If missing, ask. If asked to choose, default to restrained editorial. Do not default to edutainment; use warm learning cues only for educational, playful, training, or magazine-like content.

Common modes:
- Executive: restrained, high-contrast, minimal accent.
- Investor/product: premium, confident, product-led.
- Editorial/report: evidence-first, readable, calm.
- Technical: diagrammatic, precise, system-like.
- Edutainment: warm paper, cards, friendly feedback.

## Colour
| token | controls |
|---|---|
| `--ink:#211b16` | Primary text and dark UI. |
| `--dark:#151719` | Deep media/canvas surfaces. |
| `--paper:#f7efe2` | Warm page background. |
| `--card:#fffdf8` | Learning cards and controls. |
| `--sand:#efe2cf` | Explanation panels and quiet fills. |
| `--rule:#decfbd` | Borders, separators, inactive dots/cells. |
| `--accent:#c83b33` | Surprise, reveals, warnings, “actual” lines. |
| `--accent2:#276f9f` | Explanation, focus rings, contrast data. |
| `--accent3:#dc9a2e` | Warm feedback and transitional states. |
| `--mint:#8ebf9f` | Correct/affirming feedback. |
| `--muted:#75695d` | Captions, labels, readouts. |

Entity threading should alias tokens: `--ent-a:var(--accent)`, `--ent-b:var(--accent2)`, `--ent-c:var(--accent3)`.

## Type
| token | controls |
|---|---|
| `--serif:"Iowan Old Style","Palatino Linotype",Georgia,serif` | Long-form body voice. |
| `--sans:"Avenir Next","Nunito Sans","Helvetica Neue",Inter,system-ui,-apple-system,sans-serif` | UI, labels, captions, buttons. |

## Shape, depth, motion
| token | controls |
|---|---|
| `--radius:16px` | Cards and large containers. |
| `--radius-sm:10px` | Media frames, panels, transcript rows. |
| `--shadow-card` | Soft learning-card elevation. |
| `--shadow-media` | Framed diagram/specimen surfaces. |
| `--ease:cubic-bezier(.2,.8,.2,1)` | Editorial reveals and transitions. |
