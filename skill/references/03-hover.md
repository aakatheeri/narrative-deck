# 03 — Hover Disclosure

## When to use
Use at the Inciting Incident for secondary detail behind a strong visible fact. It lets the finding land first and the specifics appear on inspection.

## When NOT to use
Do not hide critical facts behind hover on mobile or keyboard-hostile elements.

## Prompt
Render values as focusable buttons with `data-v` labels. Grow bars on first intersection, then reveal the label on hover and `:focus-visible`. Keep the base number visible through `aria-label`.

## Implementation
```js
const barsEl = $('#bars');
const vals = [18, 27, 33, 29, 41, 52, 47, 63, 71, 68, 84, 92];
barsEl.innerHTML = vals.map(v =>
  `<button class="bar" data-v="${v}% — hover reveals detail" aria-label="${v} percent"></button>`
).join('');
function growBars() {
  [...barsEl.children].forEach((b, i) => {
    b.style.height = '0%';
    setTimeout(() => { b.style.height = vals[i] + '%'; }, RM ? 0 : 60 + i * 55);
  });
}
new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (e.isIntersecting) { growBars(); obs.unobserve(e.target); }
}), { threshold: .4 }).observe(barsEl);
```
```css
.bar:hover,.bar:focus-visible{filter:brightness(1.35);transform:translateY(-5px);outline:none}
.bar:hover::after,.bar:focus-visible::after{opacity:1;translate:-50% -6px}
```

## Known failure
Hover-only disclosure failed keyboard parity until the bars became buttons with `:focus-visible`.

## Checklist
- [ ] Beat matches: Inciting Incident.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m3](../../docs/index.html#m3)
