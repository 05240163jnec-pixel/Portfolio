// ---------- Theme toggle (remembers choice) ----------
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function setTheme(t){
  root.setAttribute('data-theme', t);
  themeBtn.innerHTML = t === 'dark' ? '&#9728;' : '&#9790;'; // sun in dark mode, moon in light mode
  try { localStorage.setItem('theme', t); } catch(e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch(e) {}
setTheme(saved || 'dark');
themeBtn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// ---------- Mobile menu ----------
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false);
}));

// ---------- Typing effect ----------
const words = ['responsive websites.', 'simple APIs.', 'secure networks and servers.'];
const typed = document.getElementById('typed');
let w = 0, c = 0, deleting = false;
(function type(){
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!deleting && c === word.length) { deleting = true; return setTimeout(type, 1600); }
  if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
  c += deleting ? -1 : 1;
  setTimeout(type, deleting ? 40 : 85);
})();

// ---------- Scroll: progress bar, back-to-top ----------
const progress = document.getElementById('progress');
const toTop = document.getElementById('toTop');
addEventListener('scroll', () => {
  const h = document.documentElement;
  progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  toTop.classList.toggle('show', h.scrollTop > 500);
}, { passive: true });
toTop.addEventListener('click', () => scrollTo({ top: 0 }));

// ---------- Active nav link ----------
const links = [...menu.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

// ---------- Skill bars fill when visible ----------
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelector('.bar div').style.width = e.target.dataset.level + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: .4 });
document.querySelectorAll('.skill').forEach(s => barObs.observe(s));

// ---------- Card spotlight follows the mouse ----------
document.querySelectorAll('.card').forEach(card => card.addEventListener('pointermove', e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

// ---------- Project filter ----------
const filters = document.querySelectorAll('.filter');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.card').forEach(card => {
    const show = btn.dataset.filter === 'all' || card.dataset.cat.split(' ').includes(btn.dataset.filter);
    card.classList.toggle('hide', !show);
  });
}));

// ---------- Contact form: validate, then open the email app ----------
const toast = document.getElementById('toast');
function showToast(msg){
  toast.textContent = msg; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const error = document.getElementById('error');
  if (!name || !email || !message) { error.textContent = 'Please fill in your name, email and message.'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { error.textContent = 'Enter a valid email address, like name@example.com.'; return; }
  error.textContent = '';
  const subject = encodeURIComponent('Portfolio message from ' + name);
  const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
  location.href = 'mailto:05240163.jnec@rub.edu.bt?subject=' + subject + '&body=' + body;
  showToast('Opening your email app to send the message');
  e.target.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();

// ================= Moving background: prayer-flag colour particles =================
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cv = document.getElementById('fx'), cx = cv.getContext('2d');
const flagCols = ['#19d3ff', '#3b8cff', '#ffb020', '#e8ecf8'];
let W, H, P = [];
const mouse = { x: -999, y: -999 };
function sizeCanvas(){
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  P = Array.from({ length: Math.min(85, Math.floor(W / 15)) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .4, vy: -.15 - Math.random() * .35,
    r: 1.6 + Math.random() * 2.2, c: flagCols[Math.random() * 4 | 0]
  }));
}
sizeCanvas(); addEventListener('resize', sizeCanvas);
function frame(){
  cx.clearRect(0, 0, W, H);
  for (const p of P) {
    const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
    if (d < 140 && d > 0) { p.x += dx / d * 1.8; p.y += dy / d * 1.8; }
    p.x += p.vx; p.y += p.vy;
    if (p.y < -10) p.y = H + 10;
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
  }
  for (let i = 0; i < P.length; i++) {
    for (let j = i + 1; j < P.length; j++) {
      const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
      if (d < 120) {
        cx.strokeStyle = 'rgba(25,211,255,' + (1 - d / 120) * .35 + ')';
        cx.beginPath(); cx.moveTo(P[i].x, P[i].y); cx.lineTo(P[j].x, P[j].y); cx.stroke();
      }
    }
    cx.globalAlpha = .85; cx.fillStyle = P[i].c;
    cx.fillRect(P[i].x - P[i].r, P[i].y - P[i].r, P[i].r * 2, P[i].r * 2); cx.globalAlpha = 1;
  }
  if (!reduce) requestAnimationFrame(frame);
}
frame();

// cursor glow follows the pointer
const cursor = document.getElementById('cursor');
addEventListener('pointermove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  cursor.style.opacity = e.pointerType === 'mouse' ? .55 : 0;
  cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
});

// 3D tilt on project and certificate cards
document.querySelectorAll('.card, .cert').forEach(el => {
  el.addEventListener('pointermove', e => {
    if (reduce) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = 'perspective(800px) rotateX(' + (-y * 10) + 'deg) rotateY(' + (x * 12) + 'deg) translateY(-6px)';
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

// rotating greeting in the languages I speak
const greet = document.getElementById('greet');
const hellos = ['Kuzuzangpo la', 'Namaste', 'Hello'];
let gi = 0;
setInterval(() => {
  greet.classList.add('out');
  setTimeout(() => { gi = (gi + 1) % hellos.length; greet.textContent = hellos[gi]; greet.classList.remove('out'); }, 400);
}, 2600);

// skills marquee (duplicate for a seamless loop)
const mq = document.getElementById('mq');
mq.innerHTML += mq.innerHTML;

// reveal on scroll
const rvObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('h2, .about-grid, .skills-grid, .project-grid, .timeline, .cert-grid, .sub, .contact-grid')
  .forEach(el => { el.classList.add('rv'); rvObs.observe(el); });

// ================= Music: chill robot beat made live with Web Audio =================
let ac, master, bus, playing = false, timer, step = 0;
const bass = [55, 55, 65.41, 55, 82.41, 55, 73.42, 65.41];
const arp = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33]; // A minor pentatonic
function initAudio(){
  if (ac) return;
  ac = new (window.AudioContext || window.webkitAudioContext)();
  master = ac.createGain(); master.gain.value = 0;
  bus = ac.createBiquadFilter(); bus.type = 'lowpass'; bus.frequency.value = 2400;
  const echo = ac.createDelay(1); echo.delayTime.value = .375;
  const fb = ac.createGain(); fb.gain.value = .38;
  echo.connect(fb); fb.connect(echo);
  bus.connect(master); bus.connect(echo); echo.connect(master);
  master.connect(ac.destination);
}
function tone(type, f, t, a, d, dest){
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + .01);
  g.gain.exponentialRampToValueAtTime(.0004, t + d);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t + d + .05);
}
function beat(){
  if (!playing) return;
  const t = ac.currentTime + .03, n = step % 8;
  tone('sawtooth', bass[n], t, .16, .32, bus);                           // bass pulse
  if (n % 4 === 0) {                                                      // kick drum
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .14);
    g.gain.setValueAtTime(.55, t); g.gain.exponentialRampToValueAtTime(.001, t + .2);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + .22);
  }
  if (Math.random() < .6) tone('square', arp[Math.random() * arp.length | 0], t, .045, .3, bus); // robot blips
  step++;
  timer = setTimeout(beat, 250);
}
const musicBtn = document.getElementById('musicBtn'), musicTxt = document.getElementById('musicTxt');
function setMusic(on){
  try { initAudio(); ac.resume(); } catch (e) { return; }
  playing = on; clearTimeout(timer);
  master.gain.setTargetAtTime(on ? .5 : 0, ac.currentTime, on ? .6 : .3);
  if (on) { step = 0; beat(); }
  musicBtn.classList.toggle('on', on);
  musicBtn.setAttribute('aria-pressed', on);
  musicBtn.setAttribute('aria-label', on ? 'Turn music off' : 'Turn music on');
  musicTxt.textContent = on ? 'Music on' : 'Music off';
}
musicBtn.addEventListener('click', () => setMusic(!playing));

// splash screen (a tap is needed before browsers allow sound)
const splash = document.getElementById('splash');
document.body.classList.add('locked');
function enter(withMusic){
  splash.classList.add('gone'); document.body.classList.remove('locked');
  if (withMusic) setMusic(true);
}
document.getElementById('enterMusic').addEventListener('click', () => enter(true));
document.getElementById('enterSilent').addEventListener('click', () => enter(false));
document.getElementById('enterMusic').focus();

// robot eyes follow the pointer
const pupils = document.querySelectorAll('#botMain .pupil');
addEventListener('pointermove', e => {
  const nx = (e.clientX / innerWidth - .5) * 2, ny = (e.clientY / innerHeight - .5) * 2;
  pupils.forEach(p => { p.style.transform = 'translate(' + nx * 14 + 'px,' + ny * 12 + 'px)'; });
});
