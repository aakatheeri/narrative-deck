# 02 — Sticky Scrollytelling

## When to use
Use at Pinch Point 1 when a fact needs staged pressure. Sticky visual state should change only when text steps enter the reading band.

## When NOT to use
Do not open with it; it asks for scrolling before the reader knows why to care.

## Prompt
Build a two-column scrolly with a sticky canvas and text steps. Observe each `.step` with a middle viewport root margin, mark the active step, and draw the canvas from a small integer state. Keep scroll listeners out of the path.

## Implementation
```js
const viz = $('#viz');
const vz  = viz.getContext('2d');
let state = 0, tick = 0;
function drawViz() {
  vz.fillStyle = '#101418';
  vz.fillRect(0, 0, 520, 520);
  pts.forEach((p, i) => {
    let y = p.base, col = '#5b8db8', r = 9, a = 1;
    if (state >= 1) { y = p.base + (i % 2 ? -1 : 1) * (i * 9); col = i % 2 ? '#4f9ad6' : '#d0565c'; }
    if (state === 2) { const hot = i === 7; a = hot ? 1 : .16; r = hot ? 17 : 8; }
    vz.globalAlpha = a; vz.fillStyle = col; vz.beginPath(); vz.arc(p.x, y, r, 0, Math.PI * 2); vz.fill();
  });
  tick++; requestAnimationFrame(drawViz);
}
steps.forEach(s => new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  steps.forEach(x => x.classList.remove('active'));
  e.target.classList.add('active'); state = +e.target.dataset.state;
}), { rootMargin: '-45% 0px -45% 0px' }).observe(s));
```

## Known failure
An infinite draw loop can keep running offscreen; gate it if copying into heavier pages.

## Checklist
- [ ] Beat matches: Pinch Point 1.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m2](../../docs/index.html#m2)
