# 08 — Parallax Depth

## When to use
Use at the Hook to create depth before the argument begins. It should frame entry, not carry evidence.

Hook: immediate depth implies craft and scale, buying attention before the first evidence beat.

## When NOT to use
Avoid around dense text, charts, or users likely to prefer reduced motion.

## Prompt
Apply transforms from scroll progress inside a passive, rAF-batched scroll handler. Include a replay override so scripted sweeps do not fight live scroll.

## Implementation
```js
let pxOverride = false;
function applyParallax(progress) {
  pxLayers.forEach(l => {
    const d = +l.dataset.depth || .3;
    l.style.transform = `translate3d(0, ${(progress * 70 * d).toFixed(2)}px, 0)`;
  });
}
function parallaxFromScroll() {
  if (pxOverride) return;
  const r = pxStage.getBoundingClientRect();
  const centre = r.top + r.height / 2;
  applyParallax(Math.max(-1, Math.min(1, (innerHeight / 2 - centre) / (innerHeight / 2 + r.height / 2))));
}
let ticking = false;
addEventListener('scroll', () => {
  if (RM || ticking) return;
  ticking = true;
  requestAnimationFrame(() => { parallaxFromScroll(); ticking = false; });
}, { passive: true });
```

## Known failure
Scroll handlers without a ticking guard forced layout and caused visible stutter.

## Checklist
- [ ] Beat matches: Hook.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m8](../../docs/index.html#m8)
