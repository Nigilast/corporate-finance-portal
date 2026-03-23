/* ============================================
   Corporate Finance v2 — App
   Theme, scroll, reveal, favicon, lazy loading
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
  }

  // --- Scroll Reveal (IntersectionObserver) ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  }

  // --- Smooth scroll for anchor links ---
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    }
  });

  // --- Dark/Light Theme ---
  const stored = localStorage.getItem('cf-theme');
  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  }
  // If no stored preference, the CSS @media (prefers-color-scheme) handles auto

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  toggleBtn.setAttribute('aria-label', 'Переключить тему оформления');

  function updateToggleIcon() {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    toggleBtn.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }
  updateToggleIcon();
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark =
      current === 'dark' ||
      (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cf-theme', next);
    updateToggleIcon();
  });

  // Listen for OS theme change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem('cf-theme')) {
      updateToggleIcon();
    }
  });

  // --- SVG Favicon ---
  if (!document.querySelector('link[rel="icon"]')) {
    const fav = document.createElement('link');
    fav.rel = 'icon';
    fav.type = 'image/svg+xml';
    fav.href =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">' +
          '<rect width="36" height="36" rx="8" fill="url(#g)"/>' +
          '<defs><linearGradient id="g" x1="0" y1="0" x2="36" y2="36">' +
          '<stop offset="0%" stop-color="#b45309"/>' +
          '<stop offset="100%" stop-color="#1d4ed8"/>' +
          '</linearGradient></defs>' +
          '<text x="18" y="25" text-anchor="middle" fill="white" ' +
          'font-family="Georgia,serif" font-weight="800" font-size="15">КФ</text>' +
          '</svg>'
      );
    document.head.appendChild(fav);
  }
});
