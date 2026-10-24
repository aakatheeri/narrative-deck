# 01 — Scroll-Triggered Reveal

## When to use
Use when setup must feel paced rather than dumped. It serves the Setup beat by rewarding scroll with one clean arrival at a time.

Hook: controlled arrival turns scroll into a small reward loop, keeping setup from feeling like exposition.

## When NOT to use
Do not use for climax copy or replay by CSS class toggling; observer-owned state and replay state will fight.

## Prompt
Create a reduced-motion-aware scroll reveal. Observe `.reveal` blocks once, unobserve on entry, and use WAAPI for replayed stagger children. Cancel running animations before starting, use the shared editorial easing, and preserve final state with `fill:'both'`.

## Implementation
```js
const RISE = [
  { opacity: 0, transform: 'translateY(28px)' },
  { opacity: 1, transform: 'translateY(0)' }
];
const RISE_OPTS = (delay = 0) => ({ duration: RM ? 0 : 600, delay: RM ? 0 : delay, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
const revealIO = new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  obs.unobserve(e.target);
  e.target.classList.add('in');
}), { threshold: .2 });
$$('.reveal').forEach(el => revealIO.observe(el));
const playStagger = () => {
  (running.get('stagger') || []).forEach(a => a.cancel());
  running.set('stagger', staggerKids.map((kid, i) => kid.animate(RISE, RISE_OPTS(RM ? 0 : i * 130))));
};
```

## Known failure
CSS class-toggle replay can be batched into a no-op. WAAPI plus `cancel()` avoids it.

## Checklist
- [ ] Beat matches: Setup.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m1](../../docs/index.html#m1)
