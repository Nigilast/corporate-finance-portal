/* ============================================
   Corporate Finance v2 — Progress Tracker
   localStorage-based progress tracking
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'cf-progress';
  const BADGE_KEY = 'cf-badges';

  // All trackable content
  const CONTENT_MAP = {
    lectures: [
      'topic-11', 'topic-12', 'topic-21', 'topic-22',
      'topic-31', 'topic-32', 'topic-41', 'topic-42',
      'topic-51', 'topic-52', 'topic-61', 'topic-71',
      'topic-81', 'topic-82', 'topic-83'
    ],
    cases: ['lukoil', 'gazprom', 'sberbank', 'apple', 'tesla', 'nornickel'],
    quizzes: ['quiz-wacc', 'quiz-sections-1-2', 'quiz-sections-3-4'],
    tools: ['wacc-calculator', 'npv-calculator', 'capm-calculator',
            'dcf-calculator', 'gordon-calculator', 'dupont-calculator', 'altman-calculator']
  };

  // Section groupings for lectures
  const SECTIONS = {
    1: ['topic-11', 'topic-12'],
    2: ['topic-21', 'topic-22'],
    3: ['topic-31', 'topic-32'],
    4: ['topic-41', 'topic-42'],
    5: ['topic-51', 'topic-52'],
    6: ['topic-61'],
    7: ['topic-71'],
    8: ['topic-81', 'topic-82', 'topic-83']
  };

  // --- Storage helpers ---
  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }

  function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function markCompleted(category, id) {
    const data = getProgress();
    if (!data[category]) data[category] = {};
    if (!data[category][id]) {
      data[category][id] = { completedAt: new Date().toISOString() };
      saveProgress(data);
      checkBadges(data);
      return true; // newly completed
    }
    return false;
  }

  function isCompleted(category, id) {
    const data = getProgress();
    return !!(data[category] && data[category][id]);
  }

  function getCategoryCount(category) {
    const data = getProgress();
    return Object.keys(data[category] || {}).length;
  }

  function getTotalProgress() {
    const data = getProgress();
    let completed = 0;
    let total = 0;
    for (const [cat, items] of Object.entries(CONTENT_MAP)) {
      total += items.length;
      completed += Object.keys(data[cat] || {}).length;
    }
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  // --- Auto-track current page ---
  function autoTrackPage() {
    const page = document.body.dataset.page || '';

    // Lectures: "lectures/topic-42" → category=lectures, id=topic-42
    if (page.startsWith('lectures/topic-')) {
      const id = page.replace('lectures/', '');
      markCompleted('lectures', id);
    }
    // Cases: "cases/lukoil" → category=cases, id=lukoil
    else if (page.startsWith('cases/') && page !== 'cases/index') {
      const id = page.replace('cases/', '');
      markCompleted('cases', id);
    }
    // Tools: "tools/wacc-calculator" → category=tools, id=wacc-calculator
    else if (page.startsWith('tools/') && page.includes('calculator')) {
      const id = page.replace('tools/', '');
      markCompleted('tools', id);
    }
  }

  // --- Render progress bar (for index.html / catalog pages) ---
  function renderProgressBar(container) {
    const { completed, total, percent } = getTotalProgress();
    container.innerHTML = `
      <div class="progress-tracker" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="Прогресс обучения">
        <div class="progress-header">
          <span class="progress-label">Прогресс обучения</span>
          <span class="progress-count">${completed} / ${total}</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${percent}%"></div>
        </div>
        <div class="progress-details">
          <span>Лекции: ${getCategoryCount('lectures')}/${CONTENT_MAP.lectures.length}</span>
          <span>Кейсы: ${getCategoryCount('cases')}/${CONTENT_MAP.cases.length}</span>
          <span>Тесты: ${getCategoryCount('quizzes')}/${CONTENT_MAP.quizzes.length}</span>
          <span>Инструменты: ${getCategoryCount('tools')}/${CONTENT_MAP.tools.length}</span>
        </div>
      </div>`;
  }

  // --- Add checkmarks to list items ---
  function addCheckmarks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Check if this link points to a tracked page
      let matched = false;
      for (const [cat, items] of Object.entries(CONTENT_MAP)) {
        for (const id of items) {
          if (href.includes(id)) {
            if (isCompleted(cat, id)) {
              link.classList.add('completed');
              if (!link.querySelector('.check-icon')) {
                const check = document.createElement('span');
                check.className = 'check-icon';
                check.setAttribute('aria-label', 'Пройдено');
                check.textContent = '\u2713';
                link.appendChild(check);
              }
            }
            matched = true;
            break;
          }
        }
        if (matched) break;
      }
    });
  }

  // --- "Mark as read" button for lectures ---
  function addMarkReadButton() {
    const page = document.body.dataset.page || '';
    if (!page.startsWith('lectures/topic-')) return;

    const id = page.replace('lectures/', '');
    const main = document.querySelector('main');
    if (!main) return;

    // Find last section or end of main
    const btn = document.createElement('div');
    btn.className = 'mark-read-container';

    if (isCompleted('lectures', id)) {
      btn.innerHTML = `<div class="mark-read-done">&#9989; Лекция отмечена как прочитанная</div>`;
    } else {
      btn.innerHTML = `<button class="btn btn-primary btn-lg mark-read-btn" id="mark-read">&#9989; Отметить как прочитано</button>`;
      btn.querySelector('#mark-read').addEventListener('click', function () {
        markCompleted('lectures', id);
        btn.innerHTML = `<div class="mark-read-done">&#9989; Лекция отмечена как прочитанная!</div>`;
        triggerConfetti();
      });
    }
    main.appendChild(btn);
  }

  // --- Confetti effect ---
  function triggerConfetti() {
    if (typeof window.confetti !== 'function') return;
    window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
  }

  // --- Badge system ---
  const BADGES = {
    'first-lecture': { name: 'Первый шаг', desc: 'Прочитана первая лекция', icon: '&#128218;' },
    'all-section-1': { name: 'Основы освоены', desc: 'Завершён Раздел 1', icon: '&#11088;' },
    'five-lectures': { name: 'На полпути', desc: 'Прочитано 5 лекций', icon: '&#128170;' },
    'all-lectures': { name: 'Мастер теории', desc: 'Все 15 лекций прочитаны', icon: '&#127942;' },
    'first-case': { name: 'Практик', desc: 'Изучен первый кейс', icon: '&#128188;' },
    'all-cases': { name: 'Аналитик', desc: 'Все 6 кейсов изучены', icon: '&#128142;' },
    'first-quiz': { name: 'Испытатель', desc: 'Пройден первый тест', icon: '&#9989;' },
    'all-quizzes': { name: 'Отличник', desc: 'Все 3 теста пройдены', icon: '&#127941;' },
    'first-tool': { name: 'Калькулятор', desc: 'Использован первый инструмент', icon: '&#128290;' },
    'all-tools': { name: 'Финансист', desc: 'Все калькуляторы освоены', icon: '&#128200;' },
    'half-done': { name: 'Экватор', desc: '50% курса пройдено', icon: '&#9889;' },
    'completionist': { name: 'Гуру финансов', desc: '100% курса пройдено', icon: '&#127775;' },
  };

  function getBadges() {
    try { return JSON.parse(localStorage.getItem(BADGE_KEY)) || {}; } catch { return {}; }
  }

  function awardBadge(id) {
    const badges = getBadges();
    if (badges[id]) return false;
    badges[id] = { awardedAt: new Date().toISOString() };
    localStorage.setItem(BADGE_KEY, JSON.stringify(badges));
    showBadgeNotification(id);
    return true;
  }

  function showBadgeNotification(id) {
    const badge = BADGES[id];
    if (!badge) return;

    const toast = document.createElement('div');
    toast.className = 'badge-toast';
    toast.innerHTML = `
      <div class="badge-toast-icon">${badge.icon}</div>
      <div>
        <div class="badge-toast-title">Достижение!</div>
        <div class="badge-toast-name">${badge.name}</div>
        <div class="badge-toast-desc">${badge.desc}</div>
      </div>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));
    triggerConfetti();
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function checkBadges(data) {
    const lCount = Object.keys(data.lectures || {}).length;
    const cCount = Object.keys(data.cases || {}).length;
    const qCount = Object.keys(data.quizzes || {}).length;
    const tCount = Object.keys(data.tools || {}).length;
    const { percent } = getTotalProgress();

    if (lCount >= 1) awardBadge('first-lecture');
    if (lCount >= 5) awardBadge('five-lectures');
    if (lCount >= 15) awardBadge('all-lectures');
    if (cCount >= 1) awardBadge('first-case');
    if (cCount >= 6) awardBadge('all-cases');
    if (qCount >= 1) awardBadge('first-quiz');
    if (qCount >= 3) awardBadge('all-quizzes');
    if (tCount >= 1) awardBadge('first-tool');
    if (tCount >= CONTENT_MAP.tools.length) awardBadge('all-tools');
    if (percent >= 50) awardBadge('half-done');
    if (percent >= 100) awardBadge('completionist');

    // Section 1 complete
    const s1 = SECTIONS[1];
    if (s1.every(id => data.lectures && data.lectures[id])) awardBadge('all-section-1');
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    autoTrackPage();

    // Render progress bar if placeholder exists
    const progressEl = document.getElementById('progress-tracker');
    if (progressEl) renderProgressBar(progressEl);

    // Add checkmarks on catalog pages
    addCheckmarks();

    // Add "mark as read" button on lectures
    addMarkReadButton();

    // Check badges on load
    checkBadges(getProgress());
  });

  // Expose for quiz completion hooks
  window.CFProgress = {
    markCompleted,
    isCompleted,
    getTotalProgress,
    getBadges,
    BADGES,
    triggerConfetti
  };
})();
