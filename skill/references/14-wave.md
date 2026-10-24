# 14 — Audio Waveform & Transcript Sync

## When to use
Use at Pinch Point 2 when voice, silence, or timing adds pressure. Transcript sync keeps the effect accessible.

Hook: visible timing makes audio skimmable while preserving the pressure of voice and silence.

## When NOT to use
Do not use audio without text; silent environments and assistive tech need the transcript.

## Prompt
Generate waveform peaks, render transcript buttons from timed lines, draw progress against duration, and sync active transcript line from current time. Canvas and transcript clicks seek.

## Implementation
```js
const TRANSCRIPT = [{ t:0, s:'The first thing you notice is the silence.' }, { t:5, s:'Not absence of sound.' }];
const DUR_S = 48;
$('#transcript').innerHTML = TRANSCRIPT.map((l, i) => `<button class="tr-line" data-i="${i}"><span class="tr-ts">0:${String(l.t).padStart(2,'0')}</span>${l.s}</button>`).join('');
function syncWave() {
  drawWave();
  let idx = 0; TRANSCRIPT.forEach((l, i) => { if (wT >= l.t) idx = i; });
  trLines.forEach((b, k) => b.classList.toggle('on', k === idx));
  waveTime.textContent = `${Math.floor(wT/60)}:${String(Math.floor(wT%60)).padStart(2,'0')} / 0:48`;
}
function waveLoop(now) {
  if (!wPlaying) return;
  wT += ((now - wLast) / 1000) * wRate; wLast = now;
  if (wT >= DUR_S) { wT = DUR_S; stopWave(); syncWave(); return; }
  syncWave(); wRAF = requestAnimationFrame(waveLoop);
}
```

## Known failure
Transcript lines must be buttons; plain text sync gives no keyboard seeking.

## Checklist
- [ ] Beat matches: Pinch Point 2.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m14](../../docs/index.html#m14)
