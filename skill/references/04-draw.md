# 04 — You Draw It Canvas

## When to use
Use at the Midpoint when the reader has enough context to make a prediction. The beat turns passive reading into commitment.

## When NOT to use
Do not ask too early; an uninformed guess is noise, not investment.

## Prompt
Create a canvas with known history shown, future zone shaded, and pointer/touch drawing only after the split. On reveal, draw the actual line, compute error against the prediction, and print a verdict. Scale canvas by `devicePixelRatio`.

## Implementation
```js
function sizeDraw() {
  const r = draw.getBoundingClientRect();
  draw.width  = r.width * devicePixelRatio;
  draw.height = 300 * devicePixelRatio;
  dc.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  W = r.width; H = 300; paintDraw();
}
function moveDraw(e) {
  if (!drawing) return;
  const p = pos(e);
  if (p.x < px(SPLIT)) return;
  if (userPts.length && p.x <= userPts[userPts.length - 1].x) return;
  userPts.push({ x: Math.min(p.x, px(1)), y: Math.max(10, Math.min(H - 34, p.y)) });
  paintDraw(); e.preventDefault();
}
$('#revealBtn').addEventListener('click', () => {
  if (!userPts.length) { verdictEl.textContent = 'Draw a line first — commitment is the whole point.'; return; }
  revealed = true; paintDraw();
});
```

## Known failure
Forgetting DPR scaling makes prediction lines blurry and hit testing misleading on retina screens.

## Checklist
- [ ] Beat matches: Midpoint.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m4](../../docs/index.html#m4)
