/* ============================================================
   MARWAN YOUSEF PORTFOLIO — script.js
   ============================================================ */

// ---- AOS Init ----
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80 });

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

// ---- Mobile burger ----
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Active nav ----
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}
updateActiveNav();

// ---- Typing animation ----
const phrases = [
  'Flutter Developer',
  'Firebase Integrator',
  'State Management Expert',
  'Mobile App Builder',
  'Clean Code Advocate'
];
let pi = 0, ci = 0, deleting = false;
const typingEl = document.getElementById('typingText');
function typeLoop() {
  const current = phrases[pi];
  if (!deleting) {
    typingEl.textContent = current.slice(0, ++ci);
    if (ci === current.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
  } else {
    typingEl.textContent = current.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

// ---- Skill bar animation ----
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.3 });
const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

// ---- Contact form ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fname = document.getElementById('fname');
    const femail = document.getElementById('femail');
    const fsubject = document.getElementById('fsubject');
    const fmessage = document.getElementById('fmessage');
    let valid = true;

    function setErr(field, errId, msg) {
      const errEl = document.getElementById(errId);
      if (!field.value.trim()) {
        field.classList.add('invalid');
        errEl.textContent = msg;
        valid = false;
      } else {
        field.classList.remove('invalid');
        errEl.textContent = '';
      }
    }

    setErr(fname, 'nameErr', 'Name is required.');
    if (!femail.value.trim()) {
      femail.classList.add('invalid');
      document.getElementById('emailErr').textContent = 'Email is required.';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(femail.value)) {
      femail.classList.add('invalid');
      document.getElementById('emailErr').textContent = 'Enter a valid email.';
      valid = false;
    } else { femail.classList.remove('invalid'); document.getElementById('emailErr').textContent = ''; }
    setErr(fsubject, 'subjectErr', 'Subject is required.');
    setErr(fmessage, 'msgErr', 'Message is required.');

    if (!valid) return;

    const btn = document.getElementById('formSubmit');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok || res.status === 200 || res.redirected) {
        successMsg.style.display = 'flex';
        form.reset();
      } else { throw new Error('Failed'); }
    } catch {
      errorMsg.style.display = 'flex';
    } finally {
      btn.disabled = false;
      btnText.style.display = 'flex';
      btnLoading.style.display = 'none';
    }
  });
}

// ---- Smooth scroll offset for sticky nav ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});
