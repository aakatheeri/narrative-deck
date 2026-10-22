# 06 — Forensic Annotation & Scrubber

## When to use
Use at Pinch Point 1 to reveal pressure or at Plot Point 2 to reconstruct evidence already introduced. It makes inspection feel controlled.

## When NOT to use
Do not introduce brand-new evidence after Plot Point 2; it reads like a late save.

## Prompt
Draw the travelled path and marker from a range input. Let the slider own time, repaint on `input`, and provide replay by stepping value with `requestAnimationFrame`.

## Implementation
```js
function paintScrub(v) {
  sc.clearRect(0, 0, 700, 290);
  const t = v / 100;
  sc.strokeStyle = 'rgba(240,180,41,.5)'; sc.setLineDash([4, 4]);
  sc.beginPath();
  for (let k = 0; k <= t; k += .01) sc.lineTo(70 + k * 520, 150 + Math.sin(k * 3.1) * 42);
  sc.stroke(); sc.setLineDash([]);
  const x = 70 + t * 520, y = 150 + Math.sin(t * 3.1) * 42;
  sc.fillStyle = '#f0b429'; sc.beginPath(); sc.arc(x, y, 9, 0, Math.PI * 2); sc.fill();
}
timeEl.addEventListener('input', e => paintScrub(+e.target.value));
REPLAY.forensic = () => {
  if (RM) { timeEl.value = 100; paintScrub(100); return; }
  let v = 0; const step = () => { v = Math.min(100, v + 1.4); timeEl.value = v; paintScrub(v); if (v < 100) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};
```

## Known failure
Replay can start another rAF step if not guarded; cancel or disable during long scrubs.

## Checklist
- [ ] Beat matches: Pinch Point 1 / Plot Point 2.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m6](../../docs/index.html#m6)
