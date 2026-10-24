# 05 — Physics Field (Canvas)

## When to use
Use sparingly as ambient setup texture or a rest between heavier modules. It creates curiosity without carrying evidence.

Hook: responsive motion signals aliveness and gives the reader a light reset between evidence beats.

## When NOT to use
Do not use for precise data or essential claims; the field is decorative and pointer-led.

## Prompt
Seed particles in normalized coordinates, draw them on a dark canvas, repel from pointer within a radius, and reseed on replay. Keep reduced motion from changing semantic state.

## Implementation
```js
const N = 46;
let OW, OH, ps = [], mouse = { x: -999, y: -999 };
function seed() {
  ps = Array.from({ length: N }, () => ({
    x: Math.random(), y: Math.random(), vx: (Math.random()-.5)*.0018, vy: (Math.random()-.5)*.0018,
    r: 2 + Math.random()*3, hue: 195 + Math.random()*80
  }));
}
function tickOrbs() {
  oc.clearRect(0, 0, OW, OH);
  ps.forEach(p => {
    p.x += RM ? 0 : p.vx; p.y += RM ? 0 : p.vy;
    const sx = p.x * OW, sy = p.y * OH;
    const dx = sx - mouse.x, dy = sy - mouse.y;
    const d = Math.hypot(dx, dy) || 1;
    let ox = 0, oy = 0;
    if (d < 110) { const f = (1 - d / 110) * 34; ox = dx / d * f; oy = dy / d * f; }
    oc.beginPath(); oc.arc(sx + ox, sy + oy, p.r, 0, Math.PI * 2); oc.fill();
  });
  requestAnimationFrame(tickOrbs);
}
```

## Known failure
Multiple canvas rAF loops can drain battery when offscreen; gate in production pages.

## Checklist
- [ ] Beat matches: Setup texture.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m5](../../docs/index.html#m5)
