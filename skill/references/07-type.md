# 07 — Kinetic Type & Highlight Wipe

## When to use
Use in the Hook or just before Climax when a phrase needs memorability. Keep it short and let prose carry the resolution.

## When NOT to use
Do not animate long paragraphs; character motion becomes illegible and delays comprehension.

## Prompt
Split the target line into spans, animate characters with WAAPI, then animate the highlight wipe after the last character lands. Cancel previous type animations before replay.

## Implementation
```js
const CHAR_STEP = 26;
kinEl.dataset.raw = kinEl.textContent;
kinEl.innerHTML = [...kinEl.textContent].map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
const chars = $$('span', kinEl);
const CHAR_IN = [
  { opacity: 0, transform: 'translateY(16px) rotate(4deg)' },
  { opacity: 1, transform: 'translateY(0) rotate(0deg)' }
];
const WIPE = [{ backgroundSize: '0% 100%', color: '#121212' }, { backgroundSize: '100% 100%', color: '#ffffff' }];
function playType() {
  (running.get('type') || []).forEach(a => a.cancel());
  const anims = chars.map((span, i) => span.animate(CHAR_IN, { duration: RM ? 0 : 480, delay: RM ? 0 : i * CHAR_STEP, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' }));
  anims.push(hlEl.animate(WIPE, { duration: RM ? 0 : 950, delay: RM ? 0 : chars.length * CHAR_STEP + 180, easing: 'ease', fill: 'both' }));
  running.set('type', anims);
}
```

## Known failure
Inline transition delays were brittle; WAAPI owns timing and replay cancellation.

## Checklist
- [ ] Beat matches: Hook / Climax preface.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m7](../../docs/index.html#m7)
