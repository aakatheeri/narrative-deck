/* ============================================================
   PREMIUM STORY EFFECTS — BEHAVIOUR
   A central REPLAY registry lets every module expose one
   reset function, dispatched by a single delegated handler.
   ============================================================ */

(() => {
'use strict';

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = s => document.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

/* Module registry — each effect assigns its reset here. */
const REPLAY = {};

/* Removing and re-adding a class in the same frame is a no-op:
   the browser batches both into one style recalc. Reading
   offsetWidth forces a synchronous layout flush between them,
   so the transition genuinely restarts. */
const reflow = el => void el.offsetWidth;


/* ============ PROGRESS BAR ============ */
const progEl = $('#prog');
addEventListener('scroll', () => {
  const h = document.documentElement;
  progEl.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });


/* ============ 01 — SCROLL REVEAL ============ */

/* Keyframes defined in JS so replay uses WAAPI, not class toggles.
   This sidesteps every style-recalc batching quirk. */
const RISE = [
  { opacity: 0, transform: 'translateY(28px)' },
  { opacity: 1, transform: 'translateY(0)' }
];

const RISE_OPTS = (delay = 0) => ({
  duration: RM ? 0 : 600,
  delay: RM ? 0 : delay,
  easing: 'cubic-bezier(.2,.8,.2,1)',
  fill: 'both'
});

/* Track running animations per module so replay can cancel cleanly. */
const running = new Map();

/* First-paint reveal via IntersectionObserver — fires once, then detaches. */
const revealIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    obs.unobserve(e.target);          // ALWAYS unobserve — no guard, no exceptions
    e.target.classList.add('in');
  });
}, { threshold: .2 });

$$('.reveal').forEach(el => revealIO.observe(el));

/* Stagger block: observed separately so replay can own it outright. */
const staggerEl = $('#stagger1');
const staggerKids = $$('.sg', staggerEl);

const playStagger = () => {
  // Cancel anything mid-flight
  (running.get('stagger') || []).forEach(a => a.cancel());

  const anims = staggerKids.map((kid, i) => {
    kid.style.opacity = '';           // clear any stale inline state
    kid.style.transform = '';
    return kid.animate(RISE, RISE_OPTS(RM ? 0 : i * 130));
  });

  running.set('stagger', anims);
};

/* Initial trigger on scroll-in, once only. */
new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    obs.unobserve(e.target);
    playStagger();
  });
}, { threshold: .35 }).observe(staggerEl);

REPLAY.reveal = playStagger;

/* ============ 02 — SCROLLYTELLING ============ */
const scrollyDemo = $('#scrollyDemo');
const steps = $$('.step', scrollyDemo);

function setScrollyState(step) {
  steps.forEach(x => x.classList.remove('active'));
  step.classList.add('active');
  scrollyDemo.dataset.state = step.dataset.state;
}

const scrollyIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  setScrollyState(e.target);
}), { rootMargin: '-45% 0px -45% 0px' });

steps.forEach(s => scrollyIO.observe(s));

REPLAY.scrolly = () => {
  let i = 0;
  const run = () => {
    setScrollyState(steps[i]);
    if (++i < steps.length) setTimeout(run, RM ? 0 : 1400);
  };
  run();
};


/* ============ 03 — HOVER BARS ============ */
const barsEl = $('#bars');
const vals = [18, 27, 33, 29, 41, 52, 47, 63, 71, 68, 84, 92];

barsEl.innerHTML = vals.map(v =>
  `<button type="button" class="bar" data-v="${v}% — hover reveals detail" aria-label="${v} percent"></button>`
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

REPLAY.bars = growBars;


/* ============ 04 — YOU DRAW IT ============ */
const draw = $('#draw');
const dc   = draw.getContext('2d');
const verdictEl = $('#verdict');

let W, H, userPts = [], drawing = false, revealed = false;
const SPLIT  = 0.45;
const actual = t => 0.82 - Math.pow(t, 1.7) * 0.55;

const px = t => 40 + t * (W - 60);
const py = v => H - 34 - v * (H - 70);

function sizeDraw() {
  const r = draw.getBoundingClientRect();
  draw.width  = r.width * devicePixelRatio;
  draw.height = 300 * devicePixelRatio;
  dc.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  W = r.width; H = 300;
  paintDraw();
}

function paintDraw() {
  dc.clearRect(0, 0, W, H);

  dc.strokeStyle = '#ece7df'; dc.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = py(i / 4);
    dc.beginPath(); dc.moveTo(40, y); dc.lineTo(W - 20, y); dc.stroke();
  }

  dc.fillStyle = '#9b958c';
  dc.font = '11px Helvetica Neue, sans-serif';
  dc.fillText('100%', 4, py(1) + 4);
  dc.fillText('0%', 14, py(0) + 4);

  dc.fillStyle = 'rgba(26,106,168,.05)';
  dc.fillRect(px(SPLIT), 10, W - 20 - px(SPLIT), H - 44);

  dc.strokeStyle = '#1a1a1a'; dc.lineWidth = 2.5;
  dc.beginPath();
  for (let t = 0; t <= SPLIT; t += .01) {
    const x = px(t), y = py(actual(t));
    t === 0 ? dc.moveTo(x, y) : dc.lineTo(x, y);
  }
  dc.stroke();

  dc.fillStyle = '#1a1a1a';
  dc.beginPath(); dc.arc(px(SPLIT), py(actual(SPLIT)), 4.5, 0, Math.PI * 2); dc.fill();

  if (!userPts.length && !revealed) {
    dc.fillStyle = '#1a6aa8';
    dc.font = '13px Helvetica Neue, sans-serif';
    dc.fillText('↳ drag across this zone to predict', px(SPLIT) + 12, 34);
  }

  if (userPts.length) {
    dc.strokeStyle = '#1a6aa8'; dc.lineWidth = 3; dc.setLineDash([]);
    dc.beginPath();
    userPts.forEach((p, i) => i ? dc.lineTo(p.x, p.y) : dc.moveTo(p.x, p.y));
    dc.stroke();
  }

  if (revealed) {
    dc.strokeStyle = '#c1272d'; dc.lineWidth = 2.5; dc.setLineDash([6, 5]);
    dc.beginPath();
    for (let t = SPLIT; t <= 1; t += .01) {
      const x = px(t), y = py(actual(t));
      t === SPLIT ? dc.moveTo(x, y) : dc.lineTo(x, y);
    }
    dc.stroke(); dc.setLineDash([]);

    dc.fillStyle = '#c1272d';
    dc.font = '12px Helvetica Neue, sans-serif';
    dc.fillText('actual', px(1) - 46, py(actual(1)) - 12);
  }
}

const pos = e => {
  const r = draw.getBoundingClientRect();
  const c = e.touches ? e.touches[0] : e;
  return { x: c.clientX - r.left, y: c.clientY - r.top };
};

function startDraw(e) {
  if (revealed) return;
  if (pos(e).x < px(SPLIT) - 10) return;
  drawing = true; userPts = [];
  e.preventDefault();
}

function moveDraw(e) {
  if (!drawing) return;
  const p = pos(e);
  if (p.x < px(SPLIT)) return;
  if (userPts.length && p.x <= userPts[userPts.length - 1].x) return;
  userPts.push({
    x: Math.min(p.x, px(1)),
    y: Math.max(10, Math.min(H - 34, p.y))
  });
  paintDraw();
  e.preventDefault();
}

const endDraw = () => { drawing = false; };

draw.addEventListener('mousedown', startDraw);
draw.addEventListener('mousemove', moveDraw);
addEventListener('mouseup', endDraw);
draw.addEventListener('touchstart', startDraw, { passive: false });
draw.addEventListener('touchmove',  moveDraw,  { passive: false });
addEventListener('touchend', endDraw);
addEventListener('resize', sizeDraw);

$('#revealBtn').addEventListener('click', () => {
  if (!userPts.length) {
    verdictEl.textContent = 'Draw a line first — commitment is the whole point.';
    return;
  }
  revealed = true;
  paintDraw();

  let err = 0;
  userPts.forEach(p => {
    const t = (p.x - 40) / (W - 60);
    err += Math.abs(p.y - py(actual(t)));
  });
  const avg = err / userPts.length;

  verdictEl.textContent =
    avg < 18 ? `Average error ${avg.toFixed(0)}px — close. Most readers overestimate.`
  : avg < 45 ? `Average error ${avg.toFixed(0)}px — typical. The decline is steeper than intuition suggests.`
             : `Average error ${avg.toFixed(0)}px — well off, which is exactly why this format works.`;
});

REPLAY.draw = () => {
  userPts = []; revealed = false;
  verdictEl.textContent = '';
  paintDraw();
};

sizeDraw();


/* ============ 05 — ORB FIELD ============ */
const orbs = $('#orbs');
const oc = orbs.getContext('2d');
const N = 46;

let OW, OH, ps = [], mouse = { x: -999, y: -999 };

const seed = () => {
  ps = Array.from({ length: N }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - .5) * .0014,
    vy: (Math.random() - .5) * .0014,
    r: 2 + Math.random() * 4,
    hue: 190 + Math.random() * 55
  }));
};
seed();

function sizeOrbs() {
  const r = orbs.getBoundingClientRect();
  orbs.width  = r.width * devicePixelRatio;
  orbs.height = 280 * devicePixelRatio;
  oc.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  OW = r.width; OH = 280;
}
addEventListener('resize', sizeOrbs);
sizeOrbs();

orbs.addEventListener('mousemove', e => {
  const r = orbs.getBoundingClientRect();
  mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
});
orbs.addEventListener('mouseleave', () => { mouse = { x: -999, y: -999 }; });

function tickOrbs() {
  oc.fillStyle = '#0d1117';
  oc.fillRect(0, 0, OW, OH);

  // link lines between nearby orbs
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const ax = ps[i].x * OW, ay = ps[i].y * OH;
      const bx = ps[j].x * OW, by = ps[j].y * OH;
      const d = Math.hypot(ax - bx, ay - by);
      if (d < 92) {
        oc.strokeStyle = `rgba(110,170,220,${(1 - d / 92) * .28})`;
        oc.lineWidth = 1;
        oc.beginPath();
        oc.moveTo(ax, ay);
        oc.lineTo(bx, by);
        oc.stroke();
      }
    }
  }

  ps.forEach(p => {
    if (!RM) { p.x += p.vx; p.y += p.vy; }
    if (p.x < 0 || p.x > 1) p.vx *= -1;
    if (p.y < 0 || p.y > 1) p.vy *= -1;

    const sx = p.x * OW, sy = p.y * OH;
    const dx = sx - mouse.x, dy = sy - mouse.y;
    const d = Math.hypot(dx, dy) || 1;

    let ox = 0, oy = 0;
    if (d < 110) {
      const f = (1 - d / 110) * 34;
      ox = dx / d * f;
      oy = dy / d * f;
    }

    oc.beginPath();
    oc.arc(sx + ox, sy + oy, p.r, 0, Math.PI * 2);
    oc.fillStyle = `hsl(${p.hue} 70% ${d < 110 ? 74 : 58}%)`;
    oc.fill();
  });

  // cursor halo
  if (mouse.x > -500) {
    oc.strokeStyle = 'rgba(240,180,41,.4)';
    oc.lineWidth = 1.5;
    oc.beginPath();
    oc.arc(mouse.x, mouse.y, 110, 0, Math.PI * 2);
    oc.stroke();
  }

  requestAnimationFrame(tickOrbs);
}
tickOrbs();

REPLAY.orbs = seed;


/* ============ 06 — FORENSIC SCRUBBER ============ */
const scrub  = $('#scrub');
const sc     = scrub.getContext('2d');
const timeEl = $('#time');

function paintScrub(v) {
  sc.clearRect(0, 0, 700, 290);
  const t = v / 100;

  // travelled path
  sc.strokeStyle = 'rgba(240,180,41,.5)';
  sc.lineWidth = 2;
  sc.setLineDash([4, 4]);
  sc.beginPath();
  for (let k = 0; k <= t; k += .01) {
    sc.lineTo(70 + k * 520, 150 + Math.sin(k * 3.1) * 42);
  }
  sc.stroke();
  sc.setLineDash([]);

  // subject marker
  const x = 70 + t * 520;
  const y = 150 + Math.sin(t * 3.1) * 42;

  sc.fillStyle = '#f0b429';
  sc.beginPath(); sc.arc(x, y, 9, 0, Math.PI * 2); sc.fill();

  sc.strokeStyle = '#fff';
  sc.lineWidth = 1.5;
  sc.beginPath(); sc.arc(x, y, 18, 0, Math.PI * 2); sc.stroke();

  // timecode readout
  sc.fillStyle = 'rgba(0,0,0,.72)';
  sc.fillRect(12, 12, 100, 26);
  sc.fillStyle = '#fff';
  sc.font = '13px monospace';
  sc.fillText(
    '00:' + String(Math.floor(t * 15)).padStart(2, '0') +
    '.'  + String(Math.floor(t * 900) % 100).padStart(2, '0'),
    20, 30
  );
}

timeEl.addEventListener('input', e => paintScrub(+e.target.value));
paintScrub(0);

REPLAY.forensic = () => {
  if (RM) { timeEl.value = 100; paintScrub(100); return; }
  let v = 0;
  timeEl.value = 0;
  paintScrub(0);
  const step = () => {
    v = Math.min(100, v + 1.4);
    timeEl.value = v;
    paintScrub(v);
    if (v < 100) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};


/* ============ 07 — KINETIC TYPE & HIGHLIGHT WIPE ============ */

const CHAR_STEP = 26;   // ms between characters

/* Split text into spans — NO inline transition-delay.
   Timing is handled entirely by WAAPI below. */
const kinEl = $('#kin1');
kinEl.dataset.raw = kinEl.textContent;
kinEl.innerHTML = [...kinEl.textContent]
  .map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`)
  .join('');

const chars = $$('span', kinEl);
const hlEl  = $('#hl1');

const CHAR_IN = [
  { opacity: 0, transform: 'translateY(16px) rotate(4deg)' },
  { opacity: 1, transform: 'translateY(0) rotate(0deg)' }
];

const WIPE = [
  { backgroundSize: '0% 100%', color: '#121212' },
  { backgroundSize: '100% 100%', color: '#ffffff' }
];

function playType() {
  (running.get('type') || []).forEach(a => a.cancel());

  const anims = chars.map((span, i) =>
    span.animate(CHAR_IN, {
      duration: RM ? 0 : 480,
      delay: RM ? 0 : i * CHAR_STEP,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      fill: 'both'
    })
  );

  /* Wipe starts after the last character has landed. */
  const wipeDelay = RM ? 0 : chars.length * CHAR_STEP + 180;

  anims.push(
    hlEl.animate(WIPE, {
      duration: RM ? 0 : 950,
      delay: wipeDelay,
      easing: 'ease',
      fill: 'both'
    })
  );

  running.set('type', anims);
}

/* Initial trigger, once. */
new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    obs.unobserve(e.target);
    playType();
  });
}, { threshold: .4 }).observe(kinEl);

REPLAY.type = playType;

/* ============ 08 — PARALLAX ============ */
const pxStage  = $('#pxStage');
const pxLayers = $$('.px-layer', pxStage);
const heroEl = $('.hero');
const heroDepthEls = $$('[data-hero-depth]', heroEl);
const pxRead = $('#pxRead');
const pxProg = $('#pxProg');

let pxOverride = false;   // true while the replay sweep owns the transform

function applyParallax(progress) {
  // progress: -1 (stage below viewport) → +1 (above). 0 = centred.
  pxLayers.forEach(l => {
    const d = +l.dataset.depth || .3;
    l.style.transform = `translate3d(0, ${(progress * 70 * d).toFixed(2)}px, 0)`;
  });
  pxRead.textContent = (progress * 70 * 0.95).toFixed(1) + 'px (near layer)';
  pxProg.textContent = Math.round((progress + 1) / 2 * 100) + '%';
}

function parallaxFromScroll() {
  if (pxOverride) return;
  const r = pxStage.getBoundingClientRect();
  const centre = r.top + r.height / 2;
  const p = Math.max(-1, Math.min(1,
    (innerHeight / 2 - centre) / (innerHeight / 2 + r.height / 2)
  ));
  applyParallax(p);
}

function heroParallaxFromScroll() {
  if (RM) return;
  const r = heroEl.getBoundingClientRect();
  if (r.bottom <= 0 || r.top >= innerHeight) return;
  const p = Math.max(0, Math.min(1, -r.top / r.height));
  heroDepthEls.forEach(el => {
    const d = +el.dataset.heroDepth || 0;
    el.style.setProperty('--hero-y', (p * 90 * d).toFixed(2) + 'px');
    if (el.classList.contains('hero-depth')) {
      el.style.setProperty('--hero-x', (p * -20 * d).toFixed(2) + 'px');
    }
  });
}

let ticking = false;
addEventListener('scroll', () => {
  if (RM || ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    heroParallaxFromScroll();
    parallaxFromScroll();
    ticking = false;
  });
}, { passive: true });

addEventListener('resize', () => {
  heroParallaxFromScroll();
  parallaxFromScroll();
});
heroParallaxFromScroll();
parallaxFromScroll();   // paint once on load so the stage isn't flat

REPLAY.parallax = () => {
  if (RM) { applyParallax(0); return; }

  const DUR = 2600;
  const start = performance.now();
  pxOverride = true;

  const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

  const step = now => {
    const e = Math.min(1, (now - start) / DUR);
    // travel -1 → +1 over the first 70%, then settle toward 0
    const p = e < .7
      ? -1 + ease(e / .7) * 2
      : 1 - ease((e - .7) / .3);
    applyParallax(p);

    if (e < 1) {
      requestAnimationFrame(step);
    } else {
      pxOverride = false;
      parallaxFromScroll();
    }
  };
  requestAnimationFrame(step);
};

/* ============ 09 — COLOR THREADING ============ */

const ENTS = {
  a: { name: 'Northfield', color: '#c1272d', val: 86, cx: 72,  cy: 52 },
  b: { name: 'Lakeside',   color: '#1a6aa8', val: 54, cx: 168, cy: 94 },
  c: { name: 'Eastgate',   color: '#e08c1a', val: 31, cx: 236, cy: 46 }
};

const KEYS = Object.keys(ENTS);

/* --- build chart --- */
const chart = $('#threadChart');
chart.innerHTML = KEYS.map((k, i) => {
  const e = ENTS[k];
  const h = e.val * 1.1;
  return `<rect class="th-el" data-ent="${k}" x="${38 + i * 82}" y="${130 - h}"
            width="54" height="${h}" rx="3" fill="${e.color}"/>
          <text x="${65 + i * 82}" y="144" text-anchor="middle"
            font-family="Helvetica Neue" font-size="9" fill="#6b6b6b">${e.name}</text>`;
}).join('');

/* --- build map --- */
const map = $('#threadMap');
map.innerHTML =
  `<rect x="0" y="0" width="300" height="150" fill="#eee9e0" rx="3"/>
   <path d="M0 110 Q 80 88 150 104 T 300 92 L300 150 L0 150Z" fill="#ddd6ca"/>` +
  KEYS.map(k => {
    const e = ENTS[k];
    return `<circle class="th-el" data-ent="${k}" cx="${e.cx}" cy="${e.cy}"
              r="${8 + e.val / 14}" fill="${e.color}" fill-opacity=".85"
              stroke="#fff" stroke-width="2"/>`;
  }).join('');

/* --- build timeline --- */
$('#threadTime').innerHTML = KEYS.map(k => {
  const e = ENTS[k];
  return `<div class="tl-band th-band" data-ent="${k}"
            style="background:${e.color}">${e.name}</div>`;
}).join('');

/* --- cross-highlight wiring --- */
const allThreaded = () => $$('[data-ent]');

function litEntity(key) {
  allThreaded().forEach(el => {
    const match = el.dataset.ent === key;
    el.classList.toggle('lit', match);
    el.classList.toggle('dim', !match);
  });
}

function clearEntity() {
  allThreaded().forEach(el => el.classList.remove('lit', 'dim'));
}

allThreaded().forEach(el => {
  el.addEventListener('mouseenter', () => litEntity(el.dataset.ent));
  el.addEventListener('mouseleave', clearEntity);
  el.addEventListener('focus', () => litEntity(el.dataset.ent));
  el.addEventListener('blur', clearEntity);
  if (el.classList.contains('ent')) el.tabIndex = 0;
});

/* --- replay: re-teach each colour in narrative order --- */
let threadTimers = [];

function playThread() {
  threadTimers.forEach(clearTimeout);
  threadTimers = [];
  clearEntity();
  $$('.ent').forEach(e => e.classList.remove('taught'));

  if (RM) {
    $$('.ent').forEach(e => e.classList.add('taught'));
    return;
  }

  KEYS.forEach((k, i) => {
    threadTimers.push(setTimeout(() => {
      $(`.ent[data-ent="${k}"]`).classList.add('taught');
      litEntity(k);
    }, 400 + i * 900));
  });

  threadTimers.push(setTimeout(clearEntity, 400 + KEYS.length * 900));
}

new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  obs.unobserve(e.target);
  playThread();
}), { threshold: .4 }).observe($('#m9 .thread-prose'));

REPLAY.thread = playThread;

/* ============ 10 — BINARY QUIZ ============ */

const QUESTIONS = [
  'A story should open with its most surprising fact.',
  'Readers finish longform more often on mobile than desktop.',
  'Animation always improves comprehension.',
  'A chart needs a legend to be understood.',
  'Scroll depth is a better metric than time on page.',
  'Interactivity increases recall of statistics.',
  'Most readers skip embedded video entirely.',
  'Colour coding reduces the need for labels.',
  'Shorter paragraphs raise completion rate.',
  'Readers trust hand-drawn charts less than rendered ones.',
  'A paywall should appear before the halfway point.',
  'Audio versions cannibalise text readership.'
];

const quizQ      = $('#quizQ');
const quizFill   = $('#quizFill');
const quizCount  = $('#quizCount');
const quizDots   = $('#quizDots');
const quizResult = $('#quizResult');
const quizBtns   = $$('.qb');

let qIndex = 0, answers = [];

quizDots.innerHTML = QUESTIONS.map(() => '<span class="dot"></span>').join('');
const dots = $$('.dot', quizDots);

function renderQuiz() {
  const done = qIndex >= QUESTIONS.length;

  quizCount.textContent = `${Math.min(qIndex, QUESTIONS.length)} of ${QUESTIONS.length}`;
  quizFill.style.width = (qIndex / QUESTIONS.length * 100) + '%';
  quizBtns.forEach(b => b.disabled = done);

  if (done) {
    quizQ.textContent = 'Done.';
    const yes = answers.filter(Boolean).length;
    quizResult.innerHTML =
      `You agreed with <b>${yes}</b> of ${QUESTIONS.length} statements. ` +
      `Note what actually happened: twelve taps felt lighter than three text fields would have. ` +
      `<b>That asymmetry is the entire mechanism.</b>`;
    return;
  }

  quizResult.textContent = '';

  if (RM) {
    quizQ.textContent = QUESTIONS[qIndex];
    return;
  }

  quizQ.animate(
    [{ opacity: 0, transform: 'translateY(14px)' },
     { opacity: 1, transform: 'translateY(0)' }],
    { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' }
  );
  quizQ.textContent = QUESTIONS[qIndex];
}

quizBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (qIndex >= QUESTIONS.length) return;
    const yes = btn.dataset.ans === '1';
    answers[qIndex] = yes;
    dots[qIndex].classList.add(yes ? 'yes' : 'no');
    qIndex++;
    renderQuiz();
  });
});

function resetQuiz() {
  qIndex = 0;
  answers = [];
  dots.forEach(d => d.classList.remove('yes', 'no'));
  quizResult.textContent = '';
  renderQuiz();
}

resetQuiz();
REPLAY.quiz = resetQuiz;

/* ============ 11 — TURN-BY-TURN PROCEDURAL ============ */

const PHASES = [
  { n:'Phase 01', t:'Approach',
    note:'Weight centred, skis flat. The racer reads the gate two turns ahead — the decision is already made before any edge change happens.' },
  { n:'Phase 02', t:'Edge change',
    note:'Hips cross over the skis. This is the moment amateurs rush; elite racers initiate early and let the skis travel beneath them.' },
  { n:'Phase 03', t:'Apex pressure',
    note:'Maximum edge angle, maximum force. The outside ski carries almost the entire load — upward of three times body weight.' },
  { n:'Phase 04', t:'Release',
    note:'Pressure bleeds off progressively. Releasing too fast scrubs speed; too slow and the line runs wide of the next gate.' },
  { n:'Phase 05', t:'Transition',
    note:'Body returns to neutral, already loading for the opposite turn. The sequence never truly stops — it loops.' }
];

const pc        = $('#procCanvas').getContext('2d');
const procBadge = $('#procBadge');
const procNote  = $('#procNote');
const procScrub = $('#procScrub');
const procTime  = $('#procTime');
const procPlay  = $('#procPlay');

const TURN_MS = 4200;
let procT = 0, procPlaying = false, procRAF = null, procLast = 0;

/* Build phase buttons */
$('#procPhases').innerHTML = PHASES.map((p, i) =>
  `<button type="button" class="ph" data-ph="${i}" aria-pressed="false">
     <span class="ph-n">${p.n}</span>
     <span class="ph-t">${p.t}</span>
   </button>`
).join('');

const phBtns = $$('.ph');

/* Racer path — a parametric arc across the slope */
const pathAt = t => ({
  x: 90 + t * 580,
  y: 250 - Math.sin(t * Math.PI) * 120 + t * 40
});

/* Edge angle peaks at apex (t = 0.5) */
const edgeAt = t => Math.sin(t * Math.PI) * 62;

function phaseOf(t) {
  return Math.min(PHASES.length - 1, Math.floor(t * PHASES.length));
}

function drawProc() {
  const W = 760, H = 380;

  /* Slope background */
  const g = pc.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#182430');
  g.addColorStop(1, '#0a1016');
  pc.fillStyle = g;
  pc.fillRect(0, 0, W, H);

  /* Fall-line grid */
  pc.strokeStyle = 'rgba(255,255,255,.05)';
  pc.lineWidth = 1;
  for (let x = 0; x <= W; x += 46) {
    pc.beginPath(); pc.moveTo(x, 0); pc.lineTo(x - 40, H); pc.stroke();
  }

  /* Gates */
  [[0.18,'#c1272d'],[0.52,'#1a6aa8'],[0.86,'#c1272d']].forEach(([gt, col]) => {
    const p = pathAt(gt);
    pc.strokeStyle = col; pc.lineWidth = 3;
    pc.beginPath(); pc.moveTo(p.x, p.y - 58); pc.lineTo(p.x, p.y + 14); pc.stroke();
    pc.fillStyle = col;
    pc.beginPath(); pc.arc(p.x, p.y - 58, 6, 0, Math.PI * 2); pc.fill();
  });

  /* Ghost trail — the full line, faint */
  pc.strokeStyle = 'rgba(255,255,255,.14)';
  pc.lineWidth = 2; pc.setLineDash([5, 6]);
  pc.beginPath();
  for (let t = 0; t <= 1; t += .01) {
    const p = pathAt(t);
    t === 0 ? pc.moveTo(p.x, p.y) : pc.lineTo(p.x, p.y);
  }
  pc.stroke(); pc.setLineDash([]);

  /* Travelled portion — solid, warm */
  pc.strokeStyle = '#f0b429'; pc.lineWidth = 3.5;
  pc.beginPath();
  for (let t = 0; t <= procT; t += .005) {
    const p = pathAt(t);
    t === 0 ? pc.moveTo(p.x, p.y) : pc.lineTo(p.x, p.y);
  }
  pc.stroke();

  /* Phase boundary ticks */
  for (let i = 1; i < PHASES.length; i++) {
    const bt = i / PHASES.length;
    const p = pathAt(bt);
    const passed = procT >= bt;
    pc.strokeStyle = passed ? 'rgba(240,180,41,.8)' : 'rgba(255,255,255,.25)';
    pc.lineWidth = 2;
    pc.beginPath(); pc.moveTo(p.x, p.y - 9); pc.lineTo(p.x, p.y + 9); pc.stroke();
  }

  /* Racer body */
  const pos = pathAt(procT);
  const ang = edgeAt(procT) * Math.PI / 180;

  pc.save();
  pc.translate(pos.x, pos.y);
  pc.rotate(ang * 0.42);

  /* Skis */
  pc.strokeStyle = '#e8e2d8'; pc.lineWidth = 3.5; pc.lineCap = 'round';
  pc.beginPath(); pc.moveTo(-26, 7); pc.lineTo(26, 7); pc.stroke();
  pc.beginPath(); pc.moveTo(-26, 14); pc.lineTo(26, 14); pc.stroke();

  /* Torso + head */
  pc.strokeStyle = '#4f9ad6'; pc.lineWidth = 7;
  pc.beginPath(); pc.moveTo(0, 5); pc.lineTo(-4, -22); pc.stroke();
  pc.fillStyle = '#4f9ad6';
  pc.beginPath(); pc.arc(-5, -30, 8, 0, Math.PI * 2); pc.fill();

  pc.restore();

  /* Force vector at apex */
  const force = Math.sin(procT * Math.PI);
  if (force > 0.12) {
    pc.strokeStyle = `rgba(193,39,45,${force})`;
    pc.lineWidth = 2.5;
    pc.beginPath();
    pc.moveTo(pos.x, pos.y + 10);
    pc.lineTo(pos.x, pos.y + 10 + force * 54);
    pc.stroke();
    pc.fillStyle = `rgba(193,39,45,${force})`;
    pc.beginPath();
    pc.moveTo(pos.x, pos.y + 14 + force * 62);
    pc.lineTo(pos.x - 5, pos.y + 8 + force * 54);
    pc.lineTo(pos.x + 5, pos.y + 8 + force * 54);
    pc.fill();
    pc.font = '11px Helvetica Neue, sans-serif';
    pc.fillText(`${(force * 3.1).toFixed(1)}g`, pos.x + 9, pos.y + 34 + force * 30);
  }

  /* Edge-angle readout */
  pc.fillStyle = 'rgba(0,0,0,.6)';
  pc.fillRect(W - 142, 14, 128, 46);
  pc.fillStyle = '#9fb4c4';
  pc.font = '10px Helvetica Neue, sans-serif';
  pc.fillText('EDGE ANGLE', W - 132, 30);
  pc.fillStyle = '#f0b429';
  pc.font = '600 19px Helvetica Neue, sans-serif';
  pc.fillText(`${edgeAt(procT).toFixed(0)}°`, W - 132, 51);
}

function syncProcUI() {
  const i = phaseOf(procT);
  phBtns.forEach((b, k) => {
    const on = k === i;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  procBadge.textContent = `${PHASES[i].n} · ${PHASES[i].t}`;
  procNote.textContent = PHASES[i].note;
  procScrub.value = Math.round(procT * 1000);
  procTime.textContent = (procT * TURN_MS / 1000).toFixed(2) + 's';
}

function setProc(t) {
  procT = Math.max(0, Math.min(1, t));
  drawProc();
  syncProcUI();
}

function procLoop(now) {
  if (!procPlaying) return;
  const dt = now - procLast;
  procLast = now;
  procT += dt / TURN_MS;
  if (procT >= 1) { procT = 1; stopProc(); setProc(1); return; }
  setProc(procT);
  procRAF = requestAnimationFrame(procLoop);
}

function startProc() {
  if (RM) { setProc(1); return; }
  if (procT >= 1) procT = 0;
  procPlaying = true;
  procPlay.textContent = '❚❚ Pause';
  procLast = performance.now();
  procRAF = requestAnimationFrame(procLoop);
}

function stopProc() {
  procPlaying = false;
  procPlay.textContent = '▶ Play';
  if (procRAF) cancelAnimationFrame(procRAF);
}

procPlay.addEventListener('click', () => procPlaying ? stopProc() : startProc());

procScrub.addEventListener('input', e => {
  stopProc();
  setProc(+e.target.value / 1000);
});

phBtns.forEach(b => b.addEventListener('click', () => {
  stopProc();
  /* Land on the midpoint of the chosen phase */
  setProc((+b.dataset.ph + 0.5) / PHASES.length);
}));

/* Auto-play once on first scroll-in */
new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  obs.unobserve(e.target);
  setProc(0);
  setTimeout(startProc, 420);
}), { threshold: .45 }).observe($('#procCanvas'));

setProc(0);

REPLAY.proc = () => { stopProc(); setProc(0); setTimeout(startProc, 120); };

/* ============ 12 — AR PLACEHOLDER ============ */

const arCv    = $('#arCanvas');
const ac      = arCv.getContext('2d');
const arStage = $('#arStage');
const arAngle = $('#arAngle');
const arMode  = $('#arMode');
const arTilt  = $('#arTilt');
const arHint  = $('#arHint');
const arLabel = $('#arLabel');
const arDesc  = $('#arDesc');

const AR_W = 760, AR_H = 420;

/* Annotation hotspots, positioned in object space (yaw°, height) */
const SPOTS = [
  { yaw:   0, y: -40, label:'Rim chip · post-excavation',
    desc:'A clean fracture on the lip, inconsistent with burial damage. Catalogued as handling loss between 1911 and 1947.' },
  { yaw: 130, y:  20, label:'Figural band · workshop mark',
    desc:'The meander pattern breaks rhythm here — a second hand took over mid-band, visible only when light rakes across the surface.' },
  { yaw: 235, y:  70, label:'Base repair · ancient',
    desc:'Lead staples through drilled holes. The vessel was valuable enough to mend in antiquity rather than discard.' }
];

let arYaw = 0, arPitch = 0;
let arDragging = false, arLastX = 0, arLastY = 0;
let arTiltOn = false, arTourRAF = null, arTouring = false;
const arSeen = new Set();

/* Build progress dots */
$('#arDots').innerHTML = SPOTS.map((s, i) =>
  `<button type="button" class="ar-dot" data-spot="${i}" aria-label="Go to ${s.label}" aria-pressed="false"></button>`
).join('');
const arDots = $$('.ar-dot');

function setArDotSeen(i, seen = true) {
  arDots[i].classList.toggle('seen', seen);
  arDots[i].setAttribute('aria-pressed', String(seen));
}

/* --- 3D projection helpers --- */
function project(x, y, z) {
  const cy = Math.cos(arYaw), sy = Math.sin(arYaw);
  const cp = Math.cos(arPitch), sp = Math.sin(arPitch);

  let x1 = x * cy - z * sy;
  let z1 = x * sy + z * cy;
  let y1 = y * cp - z1 * sp;
  let z2 = y * sp + z1 * cp;

  const f = 620 / (620 + z2);
  return { x: AR_W / 2 + x1 * f, y: AR_H / 2 + y1 * f, f, z: z2 };
}

/* Amphora silhouette: radius at each height */
const PROFILE = [
  [-150, 34], [-132, 40], [-118, 30], [-96, 46],
  [-60, 76], [-20, 92], [20, 94], [60, 84],
  [100, 62], [130, 40], [150, 28], [160, 34]
];

function drawAR() {
  ac.clearRect(0, 0, AR_W, AR_H);

  /* Ground shadow */
  const sh = project(0, 168, 0);
  ac.fillStyle = 'rgba(0,0,0,.45)';
  ac.beginPath();
  ac.ellipse(sh.x, sh.y, 96 * sh.f, 20 * sh.f, 0, 0, Math.PI * 2);
  ac.fill();

  /* Grid plane — the "surface it sits on" */
  ac.strokeStyle = 'rgba(120,170,210,.13)';
  ac.lineWidth = 1;
  for (let i = -4; i <= 4; i++) {
    const a = project(i * 52, 168, -210);
    const b = project(i * 52, 168, 210);
    ac.beginPath(); ac.moveTo(a.x, a.y); ac.lineTo(b.x, b.y); ac.stroke();
    const c = project(-210, 168, i * 52);
    const d = project(210, 168, i * 52);
    ac.beginPath(); ac.moveTo(c.x, c.y); ac.lineTo(d.x, d.y); ac.stroke();
  }

  /* Vessel body — ring mesh */
  const SEG = 28;
  for (let p = 0; p < PROFILE.length - 1; p++) {
    const [y0, r0] = PROFILE[p];
    const [y1, r1] = PROFILE[p + 1];

    for (let s = 0; s < SEG; s++) {
      const a0 = (s / SEG) * Math.PI * 2;
      const a1 = ((s + 1) / SEG) * Math.PI * 2;

      const q = [
        project(Math.cos(a0) * r0, y0, Math.sin(a0) * r0),
        project(Math.cos(a1) * r0, y0, Math.sin(a1) * r0),
        project(Math.cos(a1) * r1, y1, Math.sin(a1) * r1),
        project(Math.cos(a0) * r1, y1, Math.sin(a0) * r1)
      ];

      /* Backface cull + depth shading */
      if (q[0].z > 40 && q[1].z > 40) continue;
      const lum = 0.34 + (1 - (q[0].z + 320) / 640) * 0.52;
      const band = (y0 > -60 && y0 < 60) ? 1 : 0;

      ac.fillStyle = band
        ? `rgba(${Math.round(188 * lum)},${Math.round(92 * lum)},${Math.round(48 * lum)},1)`
        : `rgba(${Math.round(152 * lum)},${Math.round(118 * lum)},${Math.round(88 * lum)},1)`;

      ac.beginPath();
      ac.moveTo(q[0].x, q[0].y);
      q.slice(1).forEach(pt => ac.lineTo(pt.x, pt.y));
      ac.closePath();
      ac.fill();
    }
  }

  /* Handles */
  [1, -1].forEach(side => {
    ac.strokeStyle = 'rgba(126,96,70,.92)';
    ac.lineWidth = 7;
    ac.beginPath();
    for (let t = 0; t <= 1; t += .06) {
      const hy = -118 + t * 86;
      const hr = 46 + Math.sin(t * Math.PI) * 44;
      const pt = project(side * hr, hy, 0);
      t === 0 ? ac.moveTo(pt.x, pt.y) : ac.lineTo(pt.x, pt.y);
    }
    ac.stroke();
  });

  /* Hotspots */
  SPOTS.forEach((sp, i) => {
    const rad = sp.yaw * Math.PI / 180;
    const r = 88;
    const pt = project(Math.cos(rad) * r, sp.y, Math.sin(rad) * r);

    const facing = pt.z < -10;
    const alpha = facing ? 1 : 0.18;
    const pulse = 1 + Math.sin(Date.now() / 420 + i) * 0.14;

    ac.strokeStyle = `rgba(240,180,41,${alpha})`;
    ac.lineWidth = 2;
    ac.beginPath();
    ac.arc(pt.x, pt.y, 13 * pulse * pt.f, 0, Math.PI * 2);
    ac.stroke();

    ac.fillStyle = `rgba(240,180,41,${alpha * .85})`;
    ac.beginPath();
    ac.arc(pt.x, pt.y, 4.5 * pt.f, 0, Math.PI * 2);
    ac.fill();

    if (facing) {
      ac.fillStyle = 'rgba(0,0,0,.72)';
      const w = ac.measureText(sp.label).width + 20;
      ac.fillRect(pt.x + 18, pt.y - 11, w, 22);
      ac.fillStyle = '#f0b429';
      ac.font = '11px Helvetica Neue, sans-serif';
      ac.fillText(sp.label, pt.x + 28, pt.y + 4);

      if (!arSeen.has(i)) {
        arSeen.add(i);
        setArDotSeen(i);
        arLabel.textContent = sp.label;
        arDesc.textContent = sp.desc;
      }
    }
  });

  arAngle.textContent =
    `${Math.round(arYaw * 180 / Math.PI) % 360}° / ${Math.round(arPitch * 180 / Math.PI)}°`;
}

function arFrame() {
  drawAR();
  requestAnimationFrame(arFrame);
}
arFrame();

/* --- pointer drag --- */
const arPos = e => {
  const c = e.touches ? e.touches[0] : e;
  return { x: c.clientX, y: c.clientY };
};

arStage.addEventListener('pointerdown', e => {
  if (e.target.closest('.ar-tilt')) return;
  arDragging = true;
  arTouring = false;
  if (arTourRAF) cancelAnimationFrame(arTourRAF);
  const p = arPos(e);
  arLastX = p.x; arLastY = p.y;
  arStage.classList.add('grabbing');
  arHint.classList.add('hide');
  arStage.setPointerCapture(e.pointerId);
});

arStage.addEventListener('pointermove', e => {
  if (!arDragging) return;
  const p = arPos(e);
  arYaw   += (p.x - arLastX) * 0.009;
  arPitch  = Math.max(-0.5, Math.min(0.5, arPitch + (p.y - arLastY) * 0.005));
  arLastX = p.x; arLastY = p.y;
});

['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
  arStage.addEventListener(ev, () => {
    arDragging = false;
    arStage.classList.remove('grabbing');
  })
);

/* --- device tilt (the AR approximation) --- */
let tiltBase = null;

function onTilt(e) {
  if (e.gamma == null) return;
  if (!tiltBase) tiltBase = { g: e.gamma, b: e.beta };
  arYaw   = (e.gamma - tiltBase.g) * 0.042;
  arPitch = Math.max(-0.5, Math.min(0.5, (e.beta - tiltBase.b) * 0.012));
}

arTilt.addEventListener('click', async () => {
  if (arTiltOn) {
    removeEventListener('deviceorientation', onTilt);
    arTiltOn = false; tiltBase = null;
    arTilt.classList.remove('on');
    arTilt.setAttribute('aria-pressed', 'false');
    arTilt.textContent = 'Enable tilt control';
    arMode.textContent = 'DRAG MODE';
    return;
  }

  /* iOS 13+ requires explicit permission, gated behind a user gesture */
  const DOE = window.DeviceOrientationEvent;
  if (DOE && typeof DOE.requestPermission === 'function') {
    try {
      const res = await DOE.requestPermission();
      if (res !== 'granted') { arTilt.textContent = 'Tilt denied'; return; }
    } catch {
      arTilt.textContent = 'Tilt unavailable';
      return;
    }
  } else if (!DOE) {
    arTilt.textContent = 'No sensor';
    arTilt.disabled = true;
    return;
  }

  addEventListener('deviceorientation', onTilt);
  arTiltOn = true;
  arTilt.classList.add('on');
  arTilt.setAttribute('aria-pressed', 'true');
  arTilt.textContent = 'Tilt active · tap to stop';
  arMode.textContent = 'TILT MODE';
  arHint.textContent = 'Tilt your device to orbit';
  arHint.classList.remove('hide');
  setTimeout(() => arHint.classList.add('hide'), 2600);
});

/* --- hotspot navigation --- */
function arGoTo(i) {
  arTouring = false;
  if (arTourRAF) cancelAnimationFrame(arTourRAF);

  const target = -SPOTS[i].yaw * Math.PI / 180 + Math.PI / 2;
  const start = arYaw;
  const delta = ((target - start + Math.PI) % (Math.PI * 2)) - Math.PI;
  const t0 = performance.now();

  const ease = x => 1 - Math.pow(1 - x, 3);
  const step = now => {
    const e = Math.min(1, (now - t0) / 700);
    arYaw = start + delta * ease(e);
    if (e < 1) arTourRAF = requestAnimationFrame(step);
  };

  if (RM) { arYaw = target; return; }
  arTourRAF = requestAnimationFrame(step);
}

arDots.forEach(d => d.addEventListener('click', () => arGoTo(+d.dataset.spot)));

/* --- orbit tour (replay) --- */
function arTour() {
  arSeen.clear();
  arDots.forEach((d, i) => setArDotSeen(i, false));
  arPitch = 0.12;
  arHint.classList.add('hide');

  if (RM) { arYaw = Math.PI / 2; return; }

  arTouring = true;
  const t0 = performance.now();
  const DUR = 7200;

  const step = now => {
    if (!arTouring) return;
    const e = (now - t0) / DUR;
    if (e >= 1) { arTouring = false; return; }
    arYaw = e * Math.PI * 2;
    arTourRAF = requestAnimationFrame(step);
  };
  arTourRAF = requestAnimationFrame(step);
}

new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  obs.unobserve(e.target);
  setTimeout(arTour, 300);
}), { threshold: .4 }).observe(arStage);

REPLAY.ar = arTour;

/* ============ 13 — BEFORE/AFTER ============ */
const baWrap = $('#baWrap'), baClip = $('#baClip'), baDiv = $('#baDiv');
const baHandle = $('#baHandle'), baStat = $('#baStat');
let baPos = 50, baAnim = null, baDrag = false;

function paintLake(ctx, shrink) {
  const W = 760, H = 380;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, shrink ? '#b8a483' : '#8fa86e');
  g.addColorStop(1, shrink ? '#9c8766' : '#6f8a52');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(0,0,0,.08)';
  for (let i = 0; i < 90; i++) ctx.fillRect(Math.random()*W, Math.random()*H, 3, 2);

  const s = shrink ? 0.42 : 1;
  ctx.fillStyle = shrink ? '#3e6b86' : '#2f6d94';
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2; a += .08) {
    const r = (150 + Math.sin(a*5)*28 + Math.cos(a*3)*18) * s;
    const x = 380 + Math.cos(a) * r * 1.4;
    const y = 200 + Math.sin(a) * r * .78;
    a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.fill();

  if (shrink) {
    ctx.strokeStyle = 'rgba(255,255,255,.28)';
    ctx.setLineDash([6,5]); ctx.lineWidth = 2;
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += .08) {
      const r = 150 + Math.sin(a*5)*28 + Math.cos(a*3)*18;
      const x = 380 + Math.cos(a) * r * 1.4;
      const y = 200 + Math.sin(a) * r * .78;
      a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.font = '12px Helvetica Neue, sans-serif';
    ctx.fillText('1984 shoreline', 492, 118);
  }
}
paintLake($('#baBefore').getContext('2d'), false);
paintLake($('#baAfter').getContext('2d'), true);

function setBA(p) {
  baPos = Math.max(0, Math.min(100, p));
  baClip.style.width = baPos + '%';
  baDiv.style.left = baPos + '%';
  baHandle.setAttribute('aria-valuenow', Math.round(baPos));
  baHandle.setAttribute('aria-valuetext', `${Math.round(baPos)} percent before image visible`);
  baStat.innerHTML = `Surface water loss: <b>${Math.round((100 - baPos) * 0.58)}%</b> revealed`;
}

const baFromEvent = e => {
  const r = baWrap.getBoundingClientRect();
  return ((e.clientX - r.left) / r.width) * 100;
};

baWrap.addEventListener('pointerdown', e => {
  baDrag = true;
  if (baAnim) cancelAnimationFrame(baAnim);
  setBA(baFromEvent(e));
  baWrap.setPointerCapture(e.pointerId);
});
baWrap.addEventListener('pointermove', e => { if (baDrag) setBA(baFromEvent(e)); });
['pointerup','pointercancel'].forEach(ev =>
  baWrap.addEventListener(ev, () => { baDrag = false; }));

baHandle.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { setBA(baPos - 4); e.preventDefault(); }
  if (e.key === 'ArrowRight') { setBA(baPos + 4); e.preventDefault(); }
});

REPLAY.ba = () => {
  if (baAnim) cancelAnimationFrame(baAnim);
  if (RM) { setBA(50); return; }
  const t0 = performance.now(), DUR = 2800;
  const step = now => {
    const e = Math.min(1, (now - t0) / DUR);
    const eased = e < .5 ? 2*e*e : 1 - Math.pow(-2*e+2, 2)/2;
    setBA(eased < .5 ? 100 - eased*200 : (eased-.5)*200);
    if (e < 1) baAnim = requestAnimationFrame(step); else setBA(50);
  };
  setBA(100);
  baAnim = requestAnimationFrame(step);
};
setBA(50);


/* ============ 14 — AUDIO WAVEFORM ============ */
const TRANSCRIPT = [
  { t:0,  s:'The first thing you notice is the silence.' },
  { t:5,  s:'Not absence of sound — absence of the sounds you expect.' },
  { t:11, s:'No traffic. No machinery. No voices carrying across the water.' },
  { t:18, s:'The lake was here in 1984. You can still see where it ended.' },
  { t:25, s:'A white mineral line, two metres above the current shore.' },
  { t:32, s:'Locals call it the bathtub ring. Nobody finds that funny anymore.' },
  { t:39, s:'The question is no longer whether it comes back.' },
  { t:44, s:'It is what gets built on the ground it left behind.' }
];
const DUR_S = 48;

const waveCv = $('#wave'), wv = waveCv.getContext('2d');
const wavePlay = $('#wavePlay'), waveTime = $('#waveTime'), waveSpeed = $('#waveSpeed');
let wT = 0, wPlaying = false, wRAF = null, wLast = 0, wRate = 1;

const PEAKS = Array.from({ length: 190 }, (_, i) => {
  const base = 0.22 + Math.abs(Math.sin(i * 0.19)) * 0.5;
  const burst = Math.sin(i * 0.052) > 0.55 ? 0.3 : 0;
  return Math.min(1, base + burst + Math.random() * 0.18);
});

$('#transcript').innerHTML = TRANSCRIPT.map((l, i) =>
  `<button type="button" class="tr-line" data-i="${i}" aria-current="false">
     <span class="tr-ts">0:${String(l.t).padStart(2,'0')}</span>${l.s}
   </button>`).join('');
const trLines = $$('.tr-line');

function drawWave() {
  const W = 760, H = 110, bw = W / PEAKS.length;
  wv.fillStyle = '#0e1419'; wv.fillRect(0, 0, W, H);

  const prog = wT / DUR_S;
  PEAKS.forEach((p, i) => {
    const h = p * (H - 26);
    wv.fillStyle = (i / PEAKS.length) < prog ? '#f0b429' : 'rgba(120,160,195,.35)';
    wv.fillRect(i * bw, (H - h) / 2, bw - 1.1, h);
  });

  TRANSCRIPT.forEach(l => {
    const x = (l.t / DUR_S) * W;
    wv.strokeStyle = 'rgba(255,255,255,.22)'; wv.lineWidth = 1;
    wv.beginPath(); wv.moveTo(x, 6); wv.lineTo(x, H - 6); wv.stroke();
  });

  const px = prog * W;
  wv.strokeStyle = '#fff'; wv.lineWidth = 2;
  wv.beginPath(); wv.moveTo(px, 0); wv.lineTo(px, H); wv.stroke();
  wv.fillStyle = '#fff';
  wv.beginPath(); wv.arc(px, H/2, 5, 0, Math.PI*2); wv.fill();
}

function syncWave() {
  drawWave();
  let idx = 0;
  TRANSCRIPT.forEach((l, i) => { if (wT >= l.t) idx = i; });
  trLines.forEach((b, k) => {
    const on = k === idx;
    b.classList.toggle('on', on);
    b.setAttribute('aria-current', String(on));
  });
  const m = Math.floor(wT / 60), s = Math.floor(wT % 60);
  waveTime.textContent = `${m}:${String(s).padStart(2,'0')} / 0:48`;
}

function waveLoop(now) {
  if (!wPlaying) return;
  wT += ((now - wLast) / 1000) * wRate;
  wLast = now;
  if (wT >= DUR_S) { wT = DUR_S; stopWave(); syncWave(); return; }
  syncWave();
  wRAF = requestAnimationFrame(waveLoop);
}
function startWave() {
  if (RM) { wT = DUR_S; syncWave(); return; }
  if (wT >= DUR_S) wT = 0;
  wPlaying = true; wavePlay.textContent = '❚❚ Pause';
  wLast = performance.now();
  wRAF = requestAnimationFrame(waveLoop);
}
function stopWave() {
  wPlaying = false; wavePlay.textContent = '▶ Play';
  if (wRAF) cancelAnimationFrame(wRAF);
}

wavePlay.addEventListener('click', () => wPlaying ? stopWave() : startWave());

waveCv.addEventListener('click', e => {
  const r = waveCv.getBoundingClientRect();
  wT = Math.max(0, Math.min(DUR_S, ((e.clientX - r.left) / r.width) * DUR_S));
  syncWave();
});

trLines.forEach(b => b.addEventListener('click', () => {
  wT = TRANSCRIPT[+b.dataset.i].t;
  syncWave();
  if (!wPlaying) startWave();
}));

waveSpeed.addEventListener('click', () => {
  wRate = wRate === 1 ? 1.5 : wRate === 1.5 ? 2 : 1;
  waveSpeed.textContent = wRate + '×';
});

REPLAY.wave = () => {
  stopWave();
  wT = 0;
  syncWave();
  setTimeout(startWave, 120);
};

syncWave();


/* ============ 15 — PAYWALL SIMULATOR ============ */
const pwEng   = $('#pwEng'),   pwFreq  = $('#pwFreq'),  pwPrice = $('#pwPrice');
const pwEngV  = $('#pwEngV'),  pwFreqV = $('#pwFreqV'), pwPriceV = $('#pwPriceV');
const pwLimit = $('#pwLimit'), pwTrack = $('#pwTrack');
const pwProp  = $('#pwProp'),  pwVerdict = $('#pwVerdict'), pwCopy = $('#pwCopy');

const PW_MAX = 20;
let pwSweep = null;

/* Build the 20 article cells once */
pwTrack.innerHTML = Array.from({ length: PW_MAX }, (_, i) =>
  `<div class="pw-cell" data-n="${i + 1}">${i + 1}</div>`
).join('');
const pwCells = $$('.pw-cell', pwTrack);

/* Toy model: the meter is a tuned variable, not a fixed rule.
   - High engagement  → fewer free articles (they'll convert anyway)
   - High frequency   → fewer free articles (habit already formed)
   - High sensitivity → more free articles (needs longer courtship) */
function pwModel(eng, freq, price) {
  const base = 10;
  const limit = Math.round(
    base - eng * 0.72 - freq * 0.34 + price * 0.85
  );
  const clamped = Math.max(2, Math.min(PW_MAX, limit));

  const propensity = Math.max(2, Math.min(97, Math.round(
    eng * 6.4 + freq * 2.9 - price * 4.1 + 18
  )));

  return { limit: clamped, propensity };
}

function pwVerdictFor(p, limit) {
  if (p >= 70) return { label: 'Tighten the meter', tone: 'high' };
  if (p >= 40) return { label: 'Hold and observe',  tone: 'mid'  };
  return { label: 'Extend the runway', tone: 'low' };
}

function pwCopyFor(p, limit, eng, freq, price) {
  if (p >= 70) {
    return `This reader is <b>already hooked</b>. The model cuts them off at article
      <b>${limit}</b> because every additional free read is revenue left on the table.
      The interruption lands early — and it works.`;
  }
  if (p >= 40) {
    return `A borderline case. <b>${limit}</b> free articles is the model's hedge:
      enough to deepen the habit, few enough to keep the ask credible.
      Most readers live here, and most of the tuning effort goes here too.`;
  }
  return `Price-sensitive and still browsing. The model opens the gate to
    <b>${limit}</b> articles — interrupting now would simply end the relationship.
    The narrative needs more runway before it earns the right to ask.`;
}

function pwRender() {
  const eng   = +pwEng.value;
  const freq  = +pwFreq.value;
  const price = +pwPrice.value;

  pwEngV.textContent   = eng;
  pwFreqV.textContent  = freq;
  pwPriceV.textContent = price;

  const { limit, propensity } = pwModel(eng, freq, price);
  const verdict = pwVerdictFor(propensity, limit);

  pwLimit.textContent = limit;
  pwProp.textContent  = propensity + '%';
  pwVerdict.textContent = verdict.label;

  pwCells.forEach((c, i) => {
    const n = i + 1;
    c.classList.toggle('free',   n < limit);
    c.classList.toggle('edge',   n === limit);
    c.classList.toggle('locked', n > limit);
  });

  pwCopy.innerHTML = pwCopyFor(propensity, limit, eng, freq, price);
}

[pwEng, pwFreq, pwPrice].forEach(input => {
  input.addEventListener('input', () => {
    if (pwSweep) { clearTimeout(pwSweep); pwSweep = null; }
    pwRender();
  });
});

/* Replay: cycle three archetypes */
const PW_ARCHETYPES = [
  { name: 'Casual',   eng: 2,  freq: 1,  price: 8 },
  { name: 'Regular',  eng: 5,  freq: 5,  price: 5 },
  { name: 'Loyalist', eng: 9,  freq: 12, price: 2 }
];

function pwPlaySweep() {
  if (pwSweep) clearTimeout(pwSweep);

  if (RM) {
    const a = PW_ARCHETYPES[2];
    pwEng.value = a.eng; pwFreq.value = a.freq; pwPrice.value = a.price;
    pwRender();
    return;
  }

  let i = 0;
  const run = () => {
    const a = PW_ARCHETYPES[i];
    pwEng.value = a.eng;
    pwFreq.value = a.freq;
    pwPrice.value = a.price;
    pwRender();
    i++;
    if (i < PW_ARCHETYPES.length) pwSweep = setTimeout(run, 1900);
    else pwSweep = null;
  };
  run();
}

new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  obs.unobserve(e.target);
  setTimeout(pwPlaySweep, 350);
}), { threshold: .4 }).observe($('#pwTrack'));

REPLAY.pw = pwPlaySweep;

pwRender();

/* ============ 00 — STRUCTURAL FRAME ============ */

const BEATS = [
  {
    pos: '0–1%',
    name: 'The Hook',
    h: 3,
    job: 'Open a loop. One unresolved question, planted fast. The hook does not need to be about the main conflict — it needs to be the first domino, where this scene\'s structure builds directly into the next.',
    principle: 'A hook stops the scroll by opening a loop in the reader\'s head. That is a real and valuable job, and it is also the end of the hook\'s authority. Everything after is structure.',
    serves: [[8,'Parallax opener'],[7,'Kinetic type']]
  },
  {
    pos: '1–12%',
    name: 'Setup',
    h: 2,
    job: 'Establish the normal state — who, where, what the stakes currently are. Kept deliberately short, because setup is the only beat that spends reader attention without replenishing it.',
    principle: 'Context exists to be made insufficient. If the setup does not create an expectation the next beat can violate, cut it.',
    serves: [[1,'Scroll reveal'],[9,'Colour threading']]
  },
  {
    pos: '12–25%',
    name: 'Inciting Incident',
    h: 3,
    job: 'The thing that makes the normal state untenable. In journalism this is usually the finding — the number, the document, the contradiction that the rest of the piece exists to explain.',
    principle: 'This is where the reader decides whether to stay. Put your strongest single fact here, not in the headline.',
    serves: [[13,'Before/after'],[3,'Hover disclosure']]
  },
  {
    pos: '25–37%',
    name: 'Pinch Point 1',
    h: 4,
    job: 'First real pressure. The opposing force shows its shape — the scale of the problem, the strength of the counter-argument, the reason this is harder than it looked.',
    principle: 'Stack two triggers here. "This is for me" plus "I should be worried" compounds rather than adds, and now leaving feels like a decision instead of a reflex.',
    serves: [[6,'Forensic annotation'],[2,'Scrollytelling']]
  },
  {
    pos: '37–55%',
    name: 'Midpoint',
    h: 4,
    job: 'The reader shifts from spectator to participant. Everything before was received; everything after is tested. This is the correct position for any device that asks the reader to commit something.',
    principle: 'Commitment bias is strongest at the midpoint. Ask too early and there is no investment to protect; too late and the reader has already decided.',
    serves: [[4,'You Draw It'],[10,'Binary quiz'],[12,'AR viewer']]
  },
  {
    pos: '55–68%',
    name: 'Pinch Point 2',
    h: 5,
    job: 'Second pressure, higher than the first. The complication the reader did not anticipate — the exception, the counter-case, the cost nobody mentioned.',
    principle: 'The second pinch must exceed the first or the curve flattens and the reader leaves at the exact moment you need them most.',
    serves: [[11,'Turn-by-turn'],[14,'Audio waveform']]
  },
  {
    pos: '68–80%',
    name: 'Plot Point 2',
    h: 4,
    job: 'The pivot into resolution. All evidence is now on the table; the piece turns from gathering to arguing. In investigations this is where reconstruction ends and interpretation begins.',
    principle: 'Never introduce new evidence after this beat. Anything arriving later reads as something you forgot, not something you saved.',
    serves: [[6,'Forensic annotation'],[9,'Colour threading']]
  },
  {
    pos: '80–92%',
    name: 'Climax',
    h: 5,
    job: 'The loop opened at 0% closes here. Maximum clarity, minimum ornament — this beat should be the plainest prose in the piece.',
    principle: 'Effects peak before the climax, not during it. Spectacle at the moment of resolution competes with the resolution.',
    serves: [[7,'Kinetic type'],[13,'Before/after']]
  },
  {
    pos: '92–100%',
    name: 'Resolution',
    h: 1,
    job: 'What this means, and what happens next. Recency makes this the second-best-remembered position in the piece — treat it as real estate, not as a courtesy.',
    principle: 'Tell the reader what to do at the end so they remember those details best. Primacy and recency do the heavy lifting; the middle is where the work happens.',
    serves: [[15,'Paywall simulator'],[10,'Binary quiz']]
  }
];

const beatRail      = $('#beatRail');
const beatPos       = $('#beatPos');
const beatName      = $('#beatName');
const beatJob       = $('#beatJob');
const beatChips     = $('#beatChips');
const beatPrincipleText = $('#beatPrincipleText');

let beatTour = null;

/* Build the rail */
beatRail.innerHTML = BEATS.map((b, i) =>
  `<button type="button" class="beat" data-b="${i}" data-h="${b.h}" aria-label="${b.name}" aria-controls="beatDetail" aria-current="false">
     <span class="beat-node"></span>
     <span class="beat-label">${b.name}</span>
   </button>`
).join('');

const beatBtns = $$('.beat', beatRail);

function showBeat(i, markSeen = true) {
  const b = BEATS[i];

  beatBtns.forEach((btn, k) => {
    const on = k === i;
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-current', String(on));
    if (markSeen && k === i) btn.classList.add('seen');
  });

  beatPos.textContent  = b.pos;
  beatName.textContent = b.name;
  beatJob.textContent  = b.job;
  beatPrincipleText.textContent = b.principle;

  beatChips.innerHTML = b.serves.map(([n, label]) =>
    `<a class="beat-chip" href="#m${n}"><i>${String(n).padStart(2,'0')}</i>${label}</a>`
  ).join('');

  if (!RM) {
    $('#beatDetail').animate(
      [{ opacity: 0, transform: 'translateY(8px)' },
       { opacity: 1, transform: 'translateY(0)' }],
      { duration: 340, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' }
    );
  }
}

beatBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (beatTour) { clearTimeout(beatTour); beatTour = null; }
    showBeat(+btn.dataset.b);
  });
});

/* Smooth-scroll the chips to their module */
beatChips.addEventListener('click', e => {
  const a = e.target.closest('.beat-chip');
  if (!a) return;
  e.preventDefault();
  const target = $(a.getAttribute('href'));
  if (target) target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
});

/* Tour: walk all nine beats in order */
function playBeatTour() {
  if (beatTour) clearTimeout(beatTour);
  beatBtns.forEach(b => b.classList.remove('seen'));

  if (RM) { showBeat(0); return; }

  let i = 0;
  const run = () => {
    showBeat(i);
    i++;
    if (i < BEATS.length) beatTour = setTimeout(run, 1500);
    else beatTour = null;
  };
  run();
}

new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  obs.unobserve(e.target);
  setTimeout(playBeatTour, 400);
}), { threshold: .4 }).observe(beatRail);

REPLAY.structure = playBeatTour;

showBeat(0, false);

/* ============ BACK TO TOP ============ */
const bttWrap = $('#bttWrap');
const btt     = $('#btt');
const bttTop  = $('#bttTop');
const bttRing = $('.btt-ring');

const frameEl = $('#m0');
let bttVisible = false;

/* Appear once the reader has passed the frame and is into the effects.
   Threshold is one viewport past Module 00 — far enough that returning
   is a genuine need, not a reflex. */
function bttCheck() {
  const trigger = frameEl
    ? frameEl.getBoundingClientRect().bottom + scrollY + innerHeight * 0.4
    : innerHeight * 1.6;

  const should = scrollY > trigger;

  if (should !== bttVisible) {
    bttVisible = should;
    bttWrap.classList.toggle('show', should);
    bttWrap.setAttribute('aria-hidden', String(!should));
  }

  /* Ring mirrors the top progress bar — same value, different shape */
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  bttRing.style.setProperty('--p', pct.toFixed(1));
}

addEventListener('scroll', bttCheck, { passive: true });
addEventListener('resize', bttCheck);
bttCheck();

/* Scroll to the frame, not the hero — the hero carries no information */
function goToFrame() {
  if (!frameEl) { scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); return; }

  frameEl.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });

  /* Flag the destination so the reader's eye lands correctly */
  const rail = $('#beatRail');
  if (rail && !RM) {
    setTimeout(() => {
      rail.animate(
        [{ opacity: .35 }, { opacity: 1 }],
        { duration: 620, easing: 'ease-out' }
      );
    }, 420);
  }
}

btt.addEventListener('click', goToFrame);

bttTop.addEventListener('click', () => {
  scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
});

/* Keyboard shortcut: T returns to the frame */
addEventListener('keydown', e => {
  if (e.key.toLowerCase() !== 't') return;
  if (/input|textarea|select/i.test(document.activeElement.tagName)) return;
  goToFrame();
});

/* ============ REPLAY DISPATCH ============ */
const ORDER = [
  'reveal','scrolly','bars','draw','orbs','forensic','type','parallax',
  'thread','quiz','proc','ar','ba','wave','pw'
];


$$('.replay').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.replay;

    if (key === 'all') {
      ORDER.forEach((k, i) => {
        setTimeout(() => REPLAY[k] && REPLAY[k](), RM ? 0 : i * 350);
      });
    } else if (REPLAY[key]) {
      REPLAY[key]();
    }

    const svg = btn.querySelector('svg');
    if (svg && !RM) {
      svg.animate(
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-360deg)' }],
        { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
    }

    btn.disabled = true;
    setTimeout(() => { btn.disabled = false; }, 500);
  });
});

/* Keyboard shortcut: R replays everything */
addEventListener('keydown', e => {
  if (e.key.toLowerCase() !== 'r') return;
  if (/input|textarea|select/i.test(document.activeElement.tagName)) return;
  $('[data-replay="all"]').click();
});

})();
