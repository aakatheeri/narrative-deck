# Anti-patterns

[See live fixes](../../docs/index.html#m1).

## Replay fights IntersectionObserver
Symptom: replay buttons sometimes do nothing, or staggered children stay visible.
Cause: removing and re-adding CSS classes lands in one style recalculation while observer state also owns `.in`.
Fix: use WAAPI for replay, call `cancel()` on running animations, and set `fill:'both'`.

## Transparent radial gradients on light paper
Symptom: glow layers disappear or look like dirty smudges.
Cause: gradients fade to transparent, revealing `--paper` instead of a controlled dark field.
Fix: place the gradient on a dark container or end in an explicit colour stop.

## SVG transform-origin is wrong
Symptom: threaded chart marks rotate or scale around the SVG canvas corner.
Cause: SVG elements do not use CSS layout boxes by default.
Fix: set `transform-box:fill-box` and `transform-origin:center` on SVG marks.

## Scroll handler does layout work every event
Symptom: parallax stutters under fast scroll.
Cause: repeated `getBoundingClientRect()` and style writes happen outside a ticking guard.
Fix: use a passive listener, a `ticking` boolean, and one `requestAnimationFrame` batch.

## Ungated rAF loops
Symptom: hidden modules keep drawing and drain battery.
Cause: each canvas starts an independent infinite loop.
Fix: gate loops with IntersectionObserver, stop on exit, or keep only essential global loops.
