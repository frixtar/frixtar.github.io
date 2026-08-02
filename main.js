/* ═══════════════════════════════════════════
   FRIXTAR PORTFOLIO — main.js
═══════════════════════════════════════════ */

/* ── 1. PRELOADER ── */
(function () {
  const logoEl = document.getElementById('pre-logo');
  const fillEl = document.getElementById('pre-fill');
  const numEl  = document.getElementById('pre-num');
  const LOGO   = 'FRIXTAR';

  // Type out logo letter by letter
  let li = 0;
  const logoTimer = setInterval(() => {
    logoEl.textContent = LOGO.slice(0, ++li);
    if (li >= LOGO.length) clearInterval(logoTimer);
  }, 80);

  // Progress counter
  let count = 0;
  function step() {
    count += Math.floor(Math.random() * 5) + 2;
    if (count >= 100) count = 100;
    fillEl.style.width = count + '%';
    numEl.textContent  = count + '%';
    if (count < 100) {
      setTimeout(step, Math.random() * 45 + 18);
    } else {
      setTimeout(finishPreloader, 380);
    }
  }
  setTimeout(step, 220);

  function finishPreloader() {
    document.getElementById('preloader').classList.add('done');
    // Staggered hero reveal
    setTimeout(() => {
      document.getElementById('hero-names').classList.add('ready');
      document.getElementById('hero-meta').classList.add('in');
    }, 80);
    setTimeout(() => document.getElementById('hero-footer').classList.add('in'), 640);
    setTimeout(() => {
      document.getElementById('scroll-ind').classList.add('in');
      startTypewriter();
    }, 960);
  }
})();

/* ── 2. SCROLL PROGRESS ── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ── 3. CANVAS PARTICLES ── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  const NUM    = 65;
  let W, H, dots;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initDots() {
    dots = Array.from({ length: NUM }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r:  Math.random() * 1.2 + .3
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.vx;  d.y += d.vy;
      if (d.x < 0) d.x = W;  if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H;  if (d.y > H) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,229,160,.48)';
      ctx.fill();
    });
    for (let i = 0; i < NUM; i++) {
      for (let j = i + 1; j < NUM; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(0,229,160,${.14 * (1 - dist / 120)})`;
          ctx.lineWidth   = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize(); initDots(); draw();
  window.addEventListener('resize', () => { resize(); initDots(); }, { passive: true });
})();

/* ── 4. NAV SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── 5. TYPEWRITER ── */
function startTypewriter() {
  const phrases = [
    'Construyendo apps con impacto real.',
    'Integrando IA en cada proyecto.',
    'Oaxaca × Tecnología × Innovación.',
    'Full-stack desde cero hasta producción.'
  ];
  let pi = 0, ci = 0, del = false;
  const el = document.getElementById('typewriter');

  function tick() {
    const p = phrases[pi];
    el.textContent = p.slice(0, ci);
    if (!del) {
      ci++;
      if (ci > p.length) { del = true; return setTimeout(tick, 1900); }
      setTimeout(tick, 44);
    } else {
      ci--;
      if (ci < 0) {
        del = false; ci = 0;
        pi = (pi + 1) % phrases.length;
        return setTimeout(tick, 360);
      }
      setTimeout(tick, 22);
    }
  }
  tick();
}

/* ── 6. INTERSECTION OBSERVER ── */
function animateCounter(el, target) {
  const start = performance.now();
  const dur   = 1900;
  (function update(t) {
    const p    = Math.min((t - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(update);
  })(start);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    // Animate counters on stat-box reveal
    if (e.target.classList.contains('stat-box')) {
      const numEl = e.target.querySelector('.sb-num[data-target]');
      if (numEl) animateCounter(numEl, parseInt(numEl.dataset.target, 10));
    }
    io.unobserve(e.target);
  });
}, { threshold: .12 });

document.querySelectorAll(
  '.section-eyebrow, .section-title, .fade-up, .stat-box, .stat-avail'
).forEach(el => io.observe(el));

/* ── 7. TEXT SCRAMBLE ── */
const SCRAMBLE_CHARS = '!<>_\\/[]{}=+*^?#@░▒▓';

function scramble(el) {
  const text = el.dataset.scramble || el.textContent;
  let iter = 0;
  clearInterval(el._si);
  el._si = setInterval(() => {
    el.textContent = text.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (i < iter)  return text[i];
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }).join('');
    if (iter >= text.length) {
      clearInterval(el._si);
      el.textContent = text;
    }
    iter += 0.45;
  }, 28);
}

document.querySelectorAll('.pr-title[data-scramble]').forEach(el => {
  el.addEventListener('mouseenter', () => scramble(el));
});
