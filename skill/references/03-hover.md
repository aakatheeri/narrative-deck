# 03 — Hover Disclosure

## When to use
Use at the Inciting Incident for secondary detail behind a strong visible fact. It lets the finding land first and the specifics appear on inspection.

## When NOT to use
Do not hide critical facts behind hover on mobile or keyboard-hostile elements.

## Prompt
Render values as focusable buttons with `data-v` labels. Grow bars on first intersection, then reveal the label on hover, tap/focus, and `:focus-visible`. Keep the base number visible through `aria-label`. Tooltips must stay inside the card/viewport on mobile and edge bars.

## Implementation
```js
const barsEl = $('#bars');
const vals = [18, 27, 33, 29, 41, 52, 47, 63, 71, 68, 84, 92];
barsEl.innerHTML = vals.map(v =>
  `<button class="bar" data-v="${v}% — tap or focus for detail" aria-label="${v} percent"></button>`
).join('');
function positionTips() {
  const card = barsEl.closest('.demo') || document.body;
  const c = card.getBoundingClientRect();
  const min = Math.max(8, c.left + 8), max = Math.min(innerWidth - 8, c.right - 8);
  [...barsEl.children].forEach(bar => {
    const w = Math.min(210, Math.max(112, max - min));
    const r = bar.getBoundingClientRect(), center = r.left + r.width / 2;
    const wanted = center - w / 2;
    const left = Math.max(min, Math.min(wanted, max - w));
    bar.style.setProperty('--tip-w', `${w}px`);
    bar.style.setProperty('--tip-x', `${Math.round(left - wanted)}px`);
  });
}
function growBars() {
  positionTips();
  [...barsEl.children].forEach((b, i) => {
    b.style.height = '0%';
    setTimeout(() => { b.style.height = vals[i] + '%'; }, RM ? 0 : 60 + i * 55);
  });
}
new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (e.isIntersecting) { growBars(); obs.unobserve(e.target); }
}), { threshold: .4 }).observe(barsEl);
addEventListener('resize', positionTips);
```
```css
.bar:hover,.bar:focus-visible{filter:brightness(1.35);transform:translateY(-5px);outline:none}
.bar::after{width:var(--tip-w,160px);translate:calc(-50% + var(--tip-x,0px)) 0}
.bar:hover::after,.bar:focus-visible::after{opacity:1;translate:calc(-50% + var(--tip-x,0px)) -6px}
```

## Known failure
Hover-only disclosure failed keyboard parity until the bars became buttons with `:focus-visible`. Centered pseudo-tooltips can overflow on first/last bars; measure or clamp every tooltip against the containing card and viewport.

## Checklist
- [ ] Beat matches: Inciting Incident.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Edge tooltips are clamped for mobile/card bounds.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m3](../../docs/index.html#m3)
