/* ============================================
   Corporate Finance v2 — Site Search
   Fuse.js fuzzy search with Ctrl+K modal
   ============================================ */

(function () {
  'use strict';

  // Search index — all pages with titles and keywords
  const SEARCH_INDEX = [
    // Lectures
    { title: 'Тема 1.1. Введение в корпоративные финансы', url: 'lectures/topic-11.html', category: 'Лекции', keywords: 'корпоративные финансы введение цели агентский конфликт' },
    { title: 'Тема 1.2. Временная стоимость денег', url: 'lectures/topic-12.html', category: 'Лекции', keywords: 'PV FV аннуитет дисконтирование сложный процент' },
    { title: 'Тема 2.1. Риск и доходность', url: 'lectures/topic-21.html', category: 'Лекции', keywords: 'риск доходность волатильность стандартное отклонение' },
    { title: 'Тема 2.2. CAPM и портфельная теория', url: 'lectures/topic-22.html', category: 'Лекции', keywords: 'CAPM бета коэффициент SML CML Марковиц портфель' },
    { title: 'Тема 3.1. Критерии оценки инвестиций', url: 'lectures/topic-31.html', category: 'Лекции', keywords: 'NPV IRR PI DPP окупаемость инвестиционный проект' },
    { title: 'Тема 3.2. Анализ инвестиционных проектов', url: 'lectures/topic-32.html', category: 'Лекции', keywords: 'денежный поток FCF чувствительность сценарный анализ' },
    { title: 'Тема 4.1. Стоимость капитала и WACC', url: 'lectures/topic-41.html', category: 'Лекции', keywords: 'WACC стоимость капитала собственный заёмный' },
    { title: 'Тема 4.2. Структура капитала', url: 'lectures/topic-42.html', category: 'Лекции', keywords: 'Модильяни Миллер структура капитала леверидж долг' },
    { title: 'Тема 5.1. Дивидендная политика', url: 'lectures/topic-51.html', category: 'Лекции', keywords: 'дивиденды выплата дивидендная политика стабильная' },
    { title: 'Тема 5.2. Оборотный капитал', url: 'lectures/topic-52.html', category: 'Лекции', keywords: 'оборотный капитал NWC цикл ликвидность дебиторская' },
    { title: 'Тема 6.1. Оценка бизнеса', url: 'lectures/topic-61.html', category: 'Лекции', keywords: 'DCF мультипликаторы P/E EV/EBITDA оценка компании' },
    { title: 'Тема 7.1. Финансовый анализ', url: 'lectures/topic-71.html', category: 'Лекции', keywords: 'Дюпон ROE рентабельность Альтман Z-score банкротство коэффициенты' },
    { title: 'Тема 8.1. ESG и устойчивое развитие', url: 'lectures/topic-81.html', category: 'Лекции', keywords: 'ESG устойчивое развитие экология социальная ответственность' },
    { title: 'Тема 8.2. Финансовые технологии', url: 'lectures/topic-82.html', category: 'Лекции', keywords: 'финтех блокчейн DeFi цифровой рубль СБП' },
    { title: 'Тема 8.3. Поведенческие финансы', url: 'lectures/topic-83.html', category: 'Лекции', keywords: 'поведенческие финансы Канеман эвристика якорение потеря' },

    // Cases
    { title: 'Кейс: ПАО «Лукойл»', url: 'cases/lukoil.html', category: 'Кейсы', keywords: 'Лукойл нефть дивиденды WACC' },
    { title: 'Кейс: ПАО «Газпром»', url: 'cases/gazprom.html', category: 'Кейсы', keywords: 'Газпром газ санкции экспорт' },
    { title: 'Кейс: ПАО «Сбербанк»', url: 'cases/sberbank.html', category: 'Кейсы', keywords: 'Сбербанк банк кредит ROE' },
    { title: 'Кейс: Apple Inc.', url: 'cases/apple.html', category: 'Кейсы', keywords: 'Apple buyback дивиденды капитализация' },
    { title: 'Кейс: Tesla Inc.', url: 'cases/tesla.html', category: 'Кейсы', keywords: 'Tesla IPO рост электромобили Маск' },
    { title: 'Кейс: ПАО «Норникель»', url: 'cases/nornickel.html', category: 'Кейсы', keywords: 'Норникель ESG штраф никель' },

    // Tools
    { title: 'Калькулятор WACC', url: 'tools/wacc-calculator.html', category: 'Инструменты', keywords: 'WACC средневзвешенная стоимость капитала калькулятор' },
    { title: 'Калькулятор NPV/IRR', url: 'tools/npv-calculator.html', category: 'Инструменты', keywords: 'NPV IRR чистая приведённая стоимость калькулятор' },
    { title: 'Калькулятор CAPM', url: 'tools/capm-calculator.html', category: 'Инструменты', keywords: 'CAPM бета калькулятор SML' },
    { title: 'Калькулятор DCF', url: 'tools/dcf-calculator.html', category: 'Инструменты', keywords: 'DCF дисконтированный денежный поток оценка' },
    { title: 'Калькулятор Гордона', url: 'tools/gordon-calculator.html', category: 'Инструменты', keywords: 'Гордон модель дивиденды рост акция стоимость' },
    { title: 'Формула Дюпона', url: 'tools/dupont-calculator.html', category: 'Инструменты', keywords: 'Дюпон ROE рентабельность оборачиваемость леверидж' },
    { title: 'Z-Score Альтмана', url: 'tools/altman-calculator.html', category: 'Инструменты', keywords: 'Альтман Z-score банкротство прогноз' },
    { title: 'Формульный справочник', url: 'tools/formulas.html', category: 'Инструменты', keywords: 'формулы справочник PV FV NPV WACC CAPM' },
    { title: 'Excel-практикумы', url: 'tools/excel-labs.html', category: 'Инструменты', keywords: 'Excel шаблоны практикум расчёт таблица' },

    // Quizzes
    { title: 'Тест: WACC (10 вопросов)', url: 'assessment/quiz-wacc.html', category: 'Тесты', keywords: 'тест WACC средневзвешенная' },
    { title: 'Тест: Разделы 1–2 (20 вопросов)', url: 'assessment/quiz-sections-1-2.html', category: 'Тесты', keywords: 'тест риск доходность PV' },
    { title: 'Тест: Разделы 3–4 (20 вопросов)', url: 'assessment/quiz-sections-3-4.html', category: 'Тесты', keywords: 'тест NPV структура капитала' },

    // Pages
    { title: 'О курсе', url: 'about.html', category: 'Страницы', keywords: 'курс информация преподаватель программа' },
    { title: 'Программа курса', url: 'syllabus.html', category: 'Страницы', keywords: 'программа учебный план раздел семестр' },
    { title: 'Глоссарий (84 термина)', url: 'glossary.html', category: 'Страницы', keywords: 'глоссарий термины определения словарь' },
    { title: 'Ресурсы и литература', url: 'resources.html', category: 'Страницы', keywords: 'учебники курсы видео ресурсы литература' },
  ];

  let fuse = null;
  let modal = null;

  function initFuse() {
    if (typeof Fuse === 'undefined') return false;
    fuse = new Fuse(SEARCH_INDEX, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'keywords', weight: 0.3 },
        { name: 'category', weight: 0.2 }
      ],
      threshold: 0.4,
      includeMatches: true,
      minMatchCharLength: 2,
    });
    return true;
  }

  function createModal() {
    const depth = parseInt(document.body.dataset.depth || '0', 10);
    const prefix = depth === 0 ? '' : '../';

    modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Поиск по сайту');
    modal.innerHTML = `
      <div class="search-backdrop"></div>
      <div class="search-dialog">
        <div class="search-input-wrap">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="search-input" placeholder="Поиск по курсу..." autocomplete="off" spellcheck="false">
          <kbd class="search-kbd">Esc</kbd>
        </div>
        <div class="search-results" role="listbox"></div>
        <div class="search-footer">
          <span><kbd>&#8593;&#8595;</kbd> навигация</span>
          <span><kbd>Enter</kbd> перейти</span>
          <span><kbd>Esc</kbd> закрыть</span>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const input = modal.querySelector('.search-input');
    const results = modal.querySelector('.search-results');
    const backdrop = modal.querySelector('.search-backdrop');

    backdrop.addEventListener('click', closeSearch);

    input.addEventListener('input', () => {
      const query = input.value.trim();
      if (query.length < 2) {
        results.innerHTML = '<div class="search-empty">Начните вводить запрос...</div>';
        return;
      }
      if (!fuse) {
        results.innerHTML = '<div class="search-empty">Загрузка поиска...</div>';
        return;
      }

      const hits = fuse.search(query).slice(0, 8);
      if (hits.length === 0) {
        results.innerHTML = '<div class="search-empty">Ничего не найдено</div>';
        return;
      }

      results.innerHTML = hits.map((hit, i) => `
        <a href="${prefix}${hit.item.url}" class="search-result${i === 0 ? ' active' : ''}" role="option" data-index="${i}">
          <span class="search-result-category">${hit.item.category}</span>
          <span class="search-result-title">${hit.item.title}</span>
        </a>`).join('');
    });

    // Keyboard navigation
    input.addEventListener('keydown', e => {
      const items = results.querySelectorAll('.search-result');
      const active = results.querySelector('.search-result.active');
      let idx = active ? parseInt(active.dataset.index) : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        idx = Math.min(idx + 1, items.length - 1);
        items.forEach(el => el.classList.remove('active'));
        if (items[idx]) items[idx].classList.add('active');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        idx = Math.max(idx - 1, 0);
        items.forEach(el => el.classList.remove('active'));
        if (items[idx]) items[idx].classList.add('active');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = results.querySelector('.search-result.active');
        if (target) window.location.href = target.getAttribute('href');
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    });
  }

  function openSearch() {
    if (!modal) createModal();
    modal.classList.add('open');
    const input = modal.querySelector('.search-input');
    input.value = '';
    input.focus();
    modal.querySelector('.search-results').innerHTML = '<div class="search-empty">Начните вводить запрос...</div>';
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    // Load Fuse.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';
    script.onload = initFuse;
    document.head.appendChild(script);

    // Ctrl+K / Cmd+K shortcut
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    });

    // Add search button to navbar after components.js renders
    setTimeout(() => {
      const nav = document.querySelector('.nav-links');
      if (nav) {
        const searchLi = document.createElement('li');
        searchLi.innerHTML = `<button class="nav-search-btn" aria-label="Поиск (Ctrl+K)" title="Поиск (Ctrl+K)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>`;
        searchLi.querySelector('button').addEventListener('click', openSearch);
        nav.appendChild(searchLi);
      }
    }, 100);
  });

  window.CFSearch = { open: openSearch, close: closeSearch };
})();
