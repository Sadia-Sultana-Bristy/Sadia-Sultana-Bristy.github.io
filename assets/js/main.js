/* =====================================================================
   Portfolio interactions — no dependencies.
   Theme toggle · mobile nav · active section · hero test run ·
   copy email · contact form (mailto) · loader · footer year
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Loader ---------- */
  var loader = document.querySelector('.loader');
  function hideLoader() {
    if (!loader) return;
    loader.classList.add('is-done');
    setTimeout(function () { loader && loader.remove(); loader = null; }, 500);
    startRunner();
  }
  // Show the mark briefly, but never hold the page longer than needed.
  var minShow = reduceMotion ? 0 : 550;
  var started = Date.now();
  function onReady() {
    setTimeout(hideLoader, Math.max(0, minShow - (Date.now() - started)));
  }
  if (document.readyState === 'complete') onReady();
  else window.addEventListener('load', onReady);
  setTimeout(hideLoader, 2500); // safety net if a font or asset stalls

  /* ---------- Theme ---------- */
  var toggle = document.querySelector('[data-theme-toggle]');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (toggle) toggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  applyTheme(root.getAttribute('data-theme') || 'light');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      store('theme', next);
    });
  }
  // Follow the OS setting until the visitor picks a theme themselves.
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      if (!store('theme')) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  /* ---------- Mobile nav ---------- */
  var nav = document.getElementById('site-nav');
  var navToggle = document.querySelector('[data-nav-toggle]');
  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      setNav(false);
      navToggle.focus();
    }
  });

  /* ---------- Header border on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active section in nav ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) current = entry.target.id;
      });
      links.forEach(function (a) {
        if (a.getAttribute('href') === '#' + current) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Hero test run ---------- */
  var runnerStarted = false;
  function startRunner() {
    if (runnerStarted) return;
    runnerStarted = true;
    var runner = document.querySelector('.hero .runner');
    if (!runner || reduceMotion) return;

    var lines = runner.querySelectorAll('.r-line');
    var cmd = runner.querySelector('.r-cmd');
    var cmdText = cmd ? cmd.lastChild : null;
    var full = cmdText ? cmdText.textContent : '';

    runner.classList.add('is-animating');
    if (cmdText) cmdText.textContent = '';
    cmd.classList.add('is-shown', 'is-typing');

    var i = 0;
    var typer = setInterval(function () {
      i += 1;
      cmdText.textContent = full.slice(0, i);
      if (i >= full.length) {
        clearInterval(typer);
        setTimeout(revealRest, 300);
      }
    }, 32);

    function revealRest() {
      cmd.classList.remove('is-typing');
      var rest = Array.prototype.slice.call(lines, 1);
      rest.forEach(function (line, idx) {
        var delay = idx === 0 ? 120 : 260 + idx * 230;
        if (idx === rest.length - 1) delay += 250;
        setTimeout(function () { line.classList.add('is-shown'); }, delay);
      });
    }
  }

  /* ---------- Copy email ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.querySelector('span');
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      function done(msg) {
        if (label) label.textContent = msg;
        setTimeout(function () { if (label) label.textContent = 'Copy'; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { done('Select and copy'); });
      } else {
        done('Select and copy');
      }
    });
  });

  /* ---------- Contact form → email app ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form__status');
    var fields = {
      name:    { el: form.elements.name,    err: document.getElementById('cf-name-err'),  ok: function (v) { return v.trim().length > 1; } },
      email:   { el: form.elements.email,   err: document.getElementById('cf-email-err'), ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } },
      message: { el: form.elements.message, err: document.getElementById('cf-msg-err'),   ok: function (v) { return v.trim().length > 4; } }
    };
    function check(f) {
      var valid = f.ok(f.el.value);
      f.el.setAttribute('aria-invalid', String(!valid));
      if (valid) f.el.removeAttribute('aria-describedby');
      else f.el.setAttribute('aria-describedby', f.err.id);
      f.err.hidden = valid;
      return valid;
    }
    Object.keys(fields).forEach(function (k) {
      fields[k].el.addEventListener('blur', function () { if (fields[k].el.value) check(fields[k]); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(fields).forEach(function (k) {
        if (!check(fields[k]) && !firstBad) firstBad = fields[k].el;
      });
      if (firstBad) { firstBad.focus(); status.textContent = ''; return; }

      var name = fields.name.el.value.trim();
      var subject = 'Portfolio enquiry from ' + name;
      var body = fields.message.el.value.trim() + '\n\n' + name + '\n' + fields.email.el.value.trim();
      var href = 'mailto:sadiasultanabristy202@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = href;
      status.textContent = 'Your email app should open with the message filled in. If it doesn’t, email sadiasultanabristy202@gmail.com directly.';
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
