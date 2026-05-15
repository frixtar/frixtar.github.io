/* CURSOR */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  rx += (mx - rx) * .12; ry += (my - ry) * .12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();

/* CANVAS PARTICLES */
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, dots;
  const NUM = 80;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function initDots() {
    dots = Array.from({length: NUM}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.5 + .4
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,229,160,.55)'; ctx.fill();
    });
    for (let i = 0; i < NUM; i++) {
      for (let j = i + 1; j < NUM; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(0,229,160,${.18 * (1 - dist/130)})`;
          ctx.lineWidth = .6; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize(); initDots(); draw();
  window.addEventListener('resize', () => { resize(); initDots(); });
})();

/* NAV SCROLL */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* TYPEWRITER */
(function() {
  const phrases = [
    'Construyendo apps con impacto real.',
    'Integrando IA en cada proyecto.',
    'Oaxaca × Tecnología × Innovación.',
    'Full-stack desde cero hasta producción.'
  ];
  let pi = 0, ci = 0, deleting = false;
  const el = document.getElementById('typewriter');
  function tick() {
    const phrase = phrases[pi];
    el.textContent = phrase.slice(0, ci);
    if (!deleting) {
      ci++;
      if (ci > phrase.length) { deleting = true; return setTimeout(tick, 1600); }
      setTimeout(tick, 42);
    } else {
      ci--;
      if (ci < 0) {
        deleting = false; ci = 0;
        pi = (pi + 1) % phrases.length;
        return setTimeout(tick, 400);
      }
      setTimeout(tick, 24);
    }
  }
  setTimeout(tick, 1200);
})();

/* SCROLL REVEAL */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: .12 });
revealEls.forEach(el => io.observe(el));

/* HOVER cursor grow on links */
document.querySelectorAll('a, button, .project-card, .cert-card, .skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.6)');
  el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
});