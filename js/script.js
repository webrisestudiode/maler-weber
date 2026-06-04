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

// ========================
// Demo Personalisierung
// ========================
(function () {
  // Params aus URL lesen → sessionStorage speichern
  var p = new URLSearchParams(window.location.search);
  ['firma','name','stadt','telefon'].forEach(function(k) {
    if (p.get(k)) sessionStorage.setItem('ws_'+k, p.get(k));
  });

  var firma   = sessionStorage.getItem('ws_firma');
  var name    = sessionStorage.getItem('ws_name');
  var stadt   = sessionStorage.getItem('ws_stadt');
  var telefon = sessionStorage.getItem('ws_telefon');

  // Telefon-Fallback per Stadt (wenn kein Lead-Telefon vorhanden)
  if (!telefon) {
    var CITY_PHONES = {
      'Stuttgart-Mitte':'0711 48 27 93','Stuttgart-Nord':'0711 38 16 74',
      'Stuttgart-Süd':'0711 62 93 41','Stuttgart-Ost':'0711 57 84 20',
      'Stuttgart-West':'0711 29 54 86','Bad Cannstatt':'0711 56 83 12',
      'Vaihingen':'0711 74 29 61','Zuffenhausen':'0711 83 47 25',
      'Feuerbach':'0711 94 61 38','Degerloch':'0711 46 82 57',
      'Möhringen':'0711 73 19 84','Stammheim':'0711 85 34 67',
      'Mühlhausen':'0711 91 46 23','Böblingen':'07031 6 48 27',
      'Sindelfingen':'07031 8 37 45','Esslingen':'0711 39 72 56',
      'Ostfildern':'0711 48 65 31','Leinfelden-Echterdingen':'0711 97 28 43',
      'Ludwigsburg':'07141 8 36 29','Kornwestheim':'07141 5 74 83',
      'Bietigheim-Bissingen':'07142 4 82 67','Waiblingen':'07151 6 93 48',
      'Fellbach':'0711 58 37 94','Schorndorf':'07181 4 72 85',
      'Winnenden':'07195 9 38 62','Göppingen':'07161 7 48 23',
      'Kirchheim unter Teck':'07021 8 53 46','Nürtingen':'07022 6 47 91',
      'Leonberg':'07152 5 83 27','Ditzingen':'07156 4 69 38',
      'Gerlingen':'07156 9 24 71','Korntal-Münchingen':'07150 3 84 56',
      'Remshalden':'07151 8 37 24','Plochingen':'07153 6 48 92',
      'Wendlingen':'07024 5 73 81'
    };
    telefon = (stadt && CITY_PHONES[stadt]) || '0711 48 27 93';
    sessionStorage.setItem('ws_telefon', telefon);
  }

  function replaceInText(node, oldStr, newStr) {
    if (!oldStr || oldStr === newStr) return;
    if (node.nodeType === 3) {
      if (node.textContent.indexOf(oldStr) !== -1)
        node.textContent = node.textContent.split(oldStr).join(newStr);
    } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      for (var i = 0; i < node.childNodes.length; i++)
        replaceInText(node.childNodes[i], oldStr, newStr);
    }
  }

  function replaceTelLinks(newTel) {
    var clean = newTel.replace(/\s/g, '');
    document.querySelectorAll('a[href^="tel:"]').forEach(function(a) {
      a.setAttribute('href', 'tel:' + clean);
      if (/^[0-9\s\-\/\+\(\)]+$/.test(a.textContent.trim()))
        a.textContent = newTel;
    });
  }

  function run() {
    if (firma) {
      var demoNames = ['Weber Malerbetrieb München', 'Weber Malerbetrieb', 'Malerbetrieb Weber', 'Weber Maler'];
      demoNames.forEach(function(n) { replaceInText(document.body, n, firma); });
      document.title = demoNames.reduce(function(t,n){ return t.split(n).join(firma); }, document.title);
    }
    if (stadt) {
      var demoCities = ['München'];
      demoCities.forEach(function(c) { replaceInText(document.body, c, stadt); });
      document.title = demoCities.reduce(function(t,c){ return t.split(c).join(stadt); }, document.title);
    }
    // Logo direkt ersetzen – Text ist auf mehrere Nodes aufgeteilt
    if (firma) {
      var logoEl = document.querySelector('a.logo, a.navbar__logo, a.navbar-brand');
      if (logoEl) {
        var iconEl = logoEl.querySelector('i, .logo-icon, .navbar__logo-icon');
        var iconHTML = iconEl ? iconEl.outerHTML : '';
        logoEl.innerHTML = iconHTML + (iconHTML ? ' ' : '') + firma;
      }
    }
    if (telefon) {
      var demoPhones = ['089 123456', '089123456'];
      demoPhones.forEach(function(ph) { replaceInText(document.body, ph, telefon); });
      replaceTelLinks(telefon);
    }
    if (name) {
      var banner = document.getElementById('personalized-banner');
      var nameEl = document.getElementById('banner-name');
      if (banner && nameEl) {
        nameEl.textContent = name;
        banner.style.display = 'block';
        // Zu <html> verschieben – body overflow-x:hidden bricht sonst position:fixed
        if (banner.parentNode !== document.documentElement) {
          document.documentElement.appendChild(banner);
        }
        document.body.style.paddingTop = '50px';
      }
    }
  }

  // Script steht am Ende von <body> – DOM ist bereit
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
