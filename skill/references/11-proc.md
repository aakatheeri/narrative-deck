# 11 — Turn-by-Turn Procedural Graphic

## When to use
Use at Pinch Point 2 when pressure comes from sequence. It shows how a process becomes harder over time.

## When NOT to use
Do not use for static comparisons; a procedural graphic needs phases and motion.

## Prompt
Define phases, a parametric path, a phase function, and a play loop. Sync canvas, scrubber, phase buttons, badge, note, and time from one `procT` value.

## Implementation
```js
const PHASES = [{ n:'Phase 01', t:'Approach', note:'Weight centred.' }, { n:'Phase 02', t:'Edge change', note:'Hips cross over.' }];
const TURN_MS = 4200;
let procT = 0, procPlaying = false, procRAF = null, procLast = 0;
const pathAt = t => ({ x: 90 + t * 580, y: 250 - Math.sin(t * Math.PI) * 120 + t * 40 });
function phaseOf(t) { return Math.min(PHASES.length - 1, Math.floor(t * PHASES.length)); }
function setProc(t) { procT = Math.max(0, Math.min(1, t)); drawProc(); syncProcUI(); }
function procLoop(now) {
  if (!procPlaying) return;
  const dt = now - procLast; procLast = now; procT += dt / TURN_MS;
  if (procT >= 1) { procT = 1; stopProc(); setProc(1); return; }
  setProc(procT); procRAF = requestAnimationFrame(procLoop);
}
procScrub.addEventListener('input', e => { stopProc(); setProc(+e.target.value / 1000); });
```

## Known failure
Multiple starts without `stopProc()` create competing rAF loops.

## Checklist
- [ ] Beat matches: Pinch Point 2.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m11](../../docs/index.html#m11)
