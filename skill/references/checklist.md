# Pre-ship checklist

[Run the live demo](../../docs/index.html#m0).

- [ ] Reduced motion: every animation has an instant or shortened path.
- [ ] Keyboard parity: buttons, sliders, comparison handles, transcript lines, and hotspots are reachable.
- [ ] Canvas scaling: devicePixelRatio is handled before drawing; CSS size and backing store match.
- [ ] rAF gating: loops are cancelled, paused, or IntersectionObserver-gated when offscreen.
- [ ] Token usage: colours, type, easing, borders, and radii use shared tokens where possible.
- [ ] Mobile breakpoints: usable from 360px width; sticky/scrolly layouts collapse.
- [ ] Focus-visible: every interactive element has an obvious `:focus-visible` state.
- [ ] Replay: buttons reset state without fighting scroll observers.
- [ ] Transcript or text fallback exists for audio/visual-only moments.
- [ ] No dependencies, package.json, build step, or generated bundle.
