// Accessible mobile nav toggle with focus management
(function () {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;

  const focusableSelectors = 'a[href], button:not([disabled])';
  let lastFocus;

  function openNav() {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    lastFocus = document.activeElement;
    const firstLink = nav.querySelector(focusableSelectors);
    firstLink && firstLink.focus();
    document.addEventListener('keydown', trapFocus);
    document.addEventListener('click', onDocClick);
  }

  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.removeEventListener('keydown', trapFocus);
    document.removeEventListener('click', onDocClick);
    toggle.focus();
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusables = nav.querySelectorAll(focusableSelectors);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }

  function onDocClick(e) {
    if (!nav.contains(e.target) && e.target !== toggle) {
      closeNav();
    }
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
  });
})();

// Year in footer
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// Scroll reveal
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reveals.length === 0) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  reveals.forEach(el => io.observe(el));
})();

// Accordion (Services page)
(function () {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });
})();

// Contact form validation
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError'), validate: v => v.trim().length >= 2 || 'Enter your full name.' },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email.' },
    address: { el: document.getElementById('address'), error: document.getElementById('addressError'), validate: v => v.trim().length >= 6 || 'Enter your pickup address.' },
    plan: { el: document.getElementById('plan'), error: document.getElementById('planError'), validate: v => v.trim().length > 0 || 'Select a plan.' },
    date: { el: document.getElementById('date'), error: document.getElementById('dateError'), validate: v => v !== '' || 'Choose a date.' }
  };

  function setError(field, message) {
    field.el.setAttribute('aria-invalid', 'true');
    field.error.textContent = message;
  }
  function clearError(field) {
    field.el.removeAttribute('aria-invalid');
    field.error.textContent = '';
  }

  Object.values(fields).forEach(field => {
    field.el.addEventListener('input', () => {
      const res = field.validate(field.el.value);
      res === true ? clearError(field) : setError(field, res);
    });
    field.el.addEventListener('blur', () => {
      const res = field.validate(field.el.value);
      res === true ? clearError(field) : setError(field, res);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    Object.values(fields).forEach(field => {
      const res = field.validate(field.el.value);
      if (res !== true) { setError(field, res); valid = false; }
      else { clearError(field); }
    });
    if (!valid) return;

    // Simulated submission success
    const success = document.getElementById('formSuccess');
    success.hidden = false;
    form.reset();
    form.querySelector('button[type="submit"]').focus();
  });
})();
