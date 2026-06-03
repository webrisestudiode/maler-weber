/* ============================================================
   Weber Malerbetrieb – script.js
   ============================================================ */

/* ---- Mobile Menu ---- */
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn && navLinks) {
  mobileBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    mobileBtn.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      document.body.style.overflow = '';
    });
  });
}

/* ---- Scroll Animations ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

/* ---- Cookie Banner ---- */
const cookieBanner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-cookies');
const declineBtn = document.getElementById('decline-cookies');

if (cookieBanner) {
  if (!localStorage.getItem('wb_cookie_consent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1200);
  }
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('wb_cookie_consent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('wb_cookie_consent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }
}

/* ---- Multi-Step Contact Form ---- */
const multiForm = document.getElementById('multi-step-form');
if (multiForm) {
  const steps = multiForm.querySelectorAll('.form-step');
  const indicators = document.querySelectorAll('.step-circle');
  const labels = document.querySelectorAll('.step-label');
  let currentStep = 0;

  function showStep(idx) {
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    indicators.forEach((c, i) => {
      c.classList.toggle('active', i === idx);
      c.classList.toggle('done', i < idx);
    });
    labels.forEach((l, i) => l.classList.toggle('active', i === idx));
    currentStep = idx;
  }

  showStep(0);

  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) showStep(currentStep + 1);
    });
  });

  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  multiForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formContent = document.getElementById('form-content');
    const successMsg = document.getElementById('form-success');
    if (formContent && successMsg) {
      formContent.style.display = 'none';
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ---- Job Application Form ---- */
const jobForm = document.getElementById('job-form');
if (jobForm) {
  jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = jobForm.querySelector('.btn-submit-job');
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Bewerbung gesendet!';
      btn.style.background = '#388E3C';
      btn.disabled = true;
    }
  });
}

/* ---- Active Nav Link ---- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

/* ---- Animate numbers (stats) ---- */
function animateNumber(el, target, duration = 1800) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target || el.textContent);
      if (!isNaN(target)) animateNumber(el, target);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => statObserver.observe(el));

// ========================
// Firma Name Replacement
// ========================
(function () {
  var params = new URLSearchParams(window.location.search);
  var firma = params.get('firma');
  if (!firma) return;

  var demoNames = [
    'Weber Malerbetrieb München',
    'Weber Malerbetrieb',
    'Malerbetrieb Weber',
    'Weber Maler',
  ];

  function replaceText(node, oldStr, newStr) {
    if (node.nodeType === 3) {
      if (node.textContent.indexOf(oldStr) !== -1)
        node.textContent = node.textContent.split(oldStr).join(newStr);
    } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      for (var i = 0; i < node.childNodes.length; i++)
        replaceText(node.childNodes[i], oldStr, newStr);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    demoNames.forEach(function (n) {
      replaceText(document.body, n, firma);
    });
    document.title = demoNames.reduce(function (t, n) { return t.split(n).join(firma); }, document.title);
  });
})();
