# 10 — Binary Quiz Accumulator

## When to use
Use at Midpoint for light commitment or at Resolution for recall. The beat works because binary taps feel cheaper than form fields.

## When NOT to use
Do not use when the answer requires nuance; yes/no can flatten trust.

## Prompt
Store questions in an array, track index and boolean answers, update a fill meter and dots, and render the result when complete. Replay resets index, answers, dots, and result.

## Implementation
```js
const QUESTIONS = ['A story should open with its most surprising fact.','Readers finish longform more often on mobile than desktop.'];
let qIndex = 0, answers = [];
quizDots.innerHTML = QUESTIONS.map(() => '<span class="dot"></span>').join('');
const dots = $$('.dot', quizDots);
function renderQuiz() {
  const done = qIndex >= QUESTIONS.length;
  quizCount.textContent = `${Math.min(qIndex, QUESTIONS.length)} of ${QUESTIONS.length}`;
  quizFill.style.width = (qIndex / QUESTIONS.length * 100) + '%';
  quizBtns.forEach(b => b.disabled = done);
  if (done) { quizQ.textContent = 'Done.'; quizResult.innerHTML = `You agreed with <b>${answers.filter(Boolean).length}</b> of ${QUESTIONS.length}.`; return; }
  quizQ.textContent = QUESTIONS[qIndex];
}
quizBtns.forEach(btn => btn.addEventListener('click', () => {
  const yes = btn.dataset.ans === '1'; answers[qIndex] = yes; dots[qIndex].classList.add(yes ? 'yes' : 'no'); qIndex++; renderQuiz();
}));
```

## Known failure
Too many questions feel lighter than text fields only if each tap is instant and reversible by replay.

## Checklist
- [ ] Beat matches: Midpoint / Resolution.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m10](../../docs/index.html#m10)
