/* ============================================
   Corporate Finance v2 — Shared Components
   Nav and Footer injection (DRY principle)
   ============================================ */

(function () {
  'use strict';

  // Determine path prefix based on page depth
  // data-depth="0" → root pages (index.html, about.html)
  // data-depth="1" → subfolder pages (lectures/topic-42.html)
  const depth = parseInt(document.body.dataset.depth || '0', 10);
  const prefix = depth === 0 ? '' : '../';

  // Current page for active nav highlighting
  const path = window.location.pathname;
  const page = path.split('/').filter(Boolean).pop() || 'index.html';
  const section = path.split('/').filter(Boolean).slice(-2, -1)[0] || '';

  function isActive(href) {
    if (href === 'index.html' && (page === 'index.html' || path.endsWith('/'))) {
      return section === '' || section === 'site-v2';
    }
    if (href.endsWith('/')) {
      return section === href.replace('/', '');
    }
    return page === href;
  }

  const navItems = [
    { href: 'index.html', label: 'Главная' },
    { href: 'about.html', label: 'О курсе' },
    { href: 'syllabus.html', label: 'Программа' },
    { href: 'lectures/', label: 'Лекции' },
    { href: 'tools/', label: 'Инструменты' },
    { href: 'cases/', label: 'Кейсы' },
    { href: 'assessment/', label: 'Тесты' },
    { href: 'glossary.html', label: 'Глоссарий' },
    { href: 'resources.html', label: 'Ресурсы' },
  ];

  // --- Render Navigation ---
  const navTarget = document.getElementById('site-nav');
  if (navTarget) {
    const linksHtml = navItems
      .map(item => {
        const active = isActive(item.href) ? ' class="active"' : '';
        return `<li><a href="${prefix}${item.href}"${active}>${item.label}</a></li>`;
      })
      .join('\n          ');

    navTarget.innerHTML = `
    <a href="#main-content" class="skip-link">Перейти к содержимому</a>
    <div class="top-bar" role="presentation"></div>
    <nav class="navbar" role="navigation" aria-label="Основная навигация">
      <div class="container">
        <a href="${prefix}index.html" class="nav-logo" aria-label="На главную">
          <div class="logo-mark" aria-hidden="true">КФ</div>
          <span>Корпоративные финансы</span>
        </a>
        <ul class="nav-links" role="menubar">
          ${linksHtml}
        </ul>
        <button class="nav-toggle" aria-label="Открыть меню" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>`;

    // Hamburger toggle
    const toggle = navTarget.querySelector('.nav-toggle');
    const links = navTarget.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.toggle('open');
        links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
      });

      // Close on link click (mobile)
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          toggle.classList.remove('open');
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && links.classList.contains('open')) {
          toggle.classList.remove('open');
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    }
  }

  // --- Render Footer ---
  const footerTarget = document.getElementById('site-footer');
  if (footerTarget) {
    footerTarget.innerHTML = `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-logo">Корпоративные финансы</div>
        <div class="footer-info">
          <span>Московский университет &laquo;Синергия&raquo; &bull; Кафедра ОДиКФ</span>
          <span>Педагогическая практика &bull; Шохин А.А., ДАФ-206 &bull; 2026</span>
        </div>
      </div>
    </footer>`;
  }
})();
