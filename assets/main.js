/* ============================================================
   ONE SCENE MYSTERY — site logic
   - Language toggle (KO ⇄ EN), persisted in localStorage
   - Image source swap by language (data-img-ko / data-img-en)
   - Reveal-on-scroll (IntersectionObserver)
   ============================================================ */

(function () {
  'use strict';

  const html = document.documentElement;
  const STORAGE_KEY = 'osm.lang';

  // ---- initial language detection --------------------------
  function initialLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ko' || stored === 'en') return stored;
    const nav = (navigator.language || 'en').toLowerCase();
    return nav.startsWith('ko') ? 'ko' : 'en';
  }

  function applyLang(lang) {
    html.setAttribute('lang', lang);
    document.querySelectorAll('[data-img-ko][data-img-en]').forEach(el => {
      const src = lang === 'ko' ? el.dataset.imgKo : el.dataset.imgEn;
      if (src && el.getAttribute('src') !== src) el.setAttribute('src', src);
    });
    document.querySelectorAll('.lang button').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    localStorage.setItem(STORAGE_KEY, lang);
  }

  // ---- on load ---------------------------------------------
  applyLang(initialLang());

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang button[data-lang]');
    if (!btn) return;
    applyLang(btn.dataset.lang);
  });

  // ---- reveal on scroll ------------------------------------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
  }
})();
