# 02 — Sticky Scrollytelling

## When to use
Use at Pinch Point 1 when the reader must keep looking at one object while its meaning changes. Best for maps, documents, product shots, or charts that need staged attention.

## When NOT to use
Do not open with it; it asks for scrolling before the reader knows why to care. Do not use it for decoration only.

## Prompt
Build a two-column scrolly with a sticky visual and text steps. Each `.step` changes a small integer state on the parent. The sticky object transforms with CSS: map pan/zoom, crop, annotation opacity, highlight, or label reveal. Keep scroll listeners out of the path.

On mobile, keep sticky native. Do not emulate it with fixed/absolute JS pinning unless device testing proves it necessary.

## Implementation
```js
const scrolly = $('.scrolly');
const steps = $$('.step', scrolly);
function setState(step) {
  steps.forEach(x => x.classList.remove('active'));
  step.classList.add('active');
  scrolly.dataset.state = step.dataset.state;
}
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) setState(e.target);
}), { rootMargin: '-45% 0px -45% 0px' });
steps.forEach(s => io.observe(s));
```

```css
.sticky-viz{position:sticky;top:12vh}
.object{transition:transform .7s var(--ease),opacity .4s var(--ease)}
.scrolly[data-state="1"] .object{transform:translate3d(-24px,0,0) scale(1.04)}
.scrolly[data-state="2"] .object{transform:translate3d(18px,0,0) scale(1.12) rotate(2deg)}
.scrolly[data-state="2"] .hotspot{opacity:1}
@media(max-width:720px){
  .scrolly{display:block;margin-top:24px}
  .sticky-viz{position:sticky;top:calc(env(safe-area-inset-top,0px) + 12px);height:300px;z-index:10}
  .steps{display:flex;flex-direction:column;padding-bottom:240px}
  .step{margin-bottom:260px}
}
```

## Known failure
Continuous scroll math makes sticky sections feel heavy. Use IntersectionObserver for step changes. If using canvas, gate any draw loop while offscreen.

Mobile sticky fails if any scroll ancestor has `overflow:hidden`, `overflow:clip`, transforms, or JS position switching. Do not put overflow clipping on `html`, `body`, `.scrolly`, or other sticky ancestors. Fix horizontal overflow at the source instead. Prefer stable pixel sticky heights over `vh/svh`, which can shift when browser chrome hides.

## Checklist
- [ ] Beat matches: Pinch Point 1.
- [ ] Same object persists across steps.
- [ ] Each state changes interpretation, not just decoration.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Mobile sticky tested at 360px+ with no clipped/overflow ancestor.

## See it live
[docs/index.html#m2](../../docs/index.html#m2)
