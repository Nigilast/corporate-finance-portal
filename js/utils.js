/* ============================================
   Corporate Finance v2 — Utilities
   Quiz engine, Calculator helpers, Glossary search
   ============================================ */

'use strict';

/* --- Quiz Engine --- */
function renderQuiz(containerId, questions, scoreBoxId) {
  const container = document.getElementById(containerId);
  const scoreBox = document.getElementById(scoreBoxId);
  if (!container || !questions.length) return;

  let answered = 0;
  let correct = 0;

  container.innerHTML = questions.map((q, qi) => {
    const optionsHtml = q.options.map((opt, oi) =>
      `<label class="quiz-option" data-q="${qi}" data-o="${oi}">
        <input type="radio" name="q${qi}" value="${oi}" aria-label="${opt}">
        <span>${opt}</span>
      </label>`
    ).join('');

    const explanationHtml = q.explanation
      ? `<div class="quiz-explanation" id="expl-${qi}">${q.explanation}</div>`
      : '';

    return `
      <div class="quiz-question" id="qq-${qi}">
        <div class="quiz-question-header">
          <span class="quiz-num">${qi + 1}/${questions.length}</span>
          <span class="quiz-text">${q.text}</span>
        </div>
        <div class="quiz-options">${optionsHtml}</div>
        ${explanationHtml}
      </div>`;
  }).join('');

  // Event delegation for option clicks
  container.addEventListener('change', (e) => {
    const radio = e.target;
    if (radio.type !== 'radio') return;

    const qi = parseInt(radio.closest('.quiz-option').dataset.q, 10);
    const oi = parseInt(radio.value, 10);
    const q = questions[qi];
    const questionEl = document.getElementById(`qq-${qi}`);
    const options = questionEl.querySelectorAll('.quiz-option');
    const explanation = document.getElementById(`expl-${qi}`);

    // Prevent re-answering
    if (questionEl.dataset.answered) return;
    questionEl.dataset.answered = 'true';
    answered++;

    // Mark correct/incorrect
    options.forEach((opt, i) => {
      opt.classList.add('disabled');
      opt.querySelector('input').disabled = true;
      if (i === q.correct) opt.classList.add('correct');
      if (i === oi && oi !== q.correct) opt.classList.add('incorrect');
    });

    if (oi === q.correct) correct++;

    // Show explanation
    if (explanation) explanation.classList.add('visible');

    // Show score when all answered
    if (answered === questions.length && scoreBox) {
      showScore(scoreBox, correct, questions.length);
    }
  });
}

function showScore(scoreBox, correct, total) {
  const pct = Math.round((correct / total) * 100);
  const numEl = scoreBox.querySelector('.score-num');
  const msgEl = scoreBox.querySelector('.score-msg');

  if (numEl) numEl.textContent = `${correct}/${total}`;

  if (msgEl) {
    if (pct >= 90) msgEl.textContent = 'Отлично! Вы прекрасно усвоили материал.';
    else if (pct >= 70) msgEl.textContent = 'Хороший результат! Есть небольшие пробелы.';
    else if (pct >= 50) msgEl.textContent = 'Удовлетворительно. Рекомендуем повторить материал.';
    else msgEl.textContent = 'Нужно повторить материал. Перечитайте лекции и попробуйте снова.';
  }

  scoreBox.classList.add('visible');
  scoreBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* --- Glossary Search --- */
function initGlossarySearch(inputId, listSelector, itemSelector) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const items = document.querySelectorAll(itemSelector);
  const countEl = document.querySelector('.glossary-count');
  const total = items.length;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    let visible = 0;

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const match = !query || text.includes(query);
      item.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (countEl) {
      countEl.textContent = query
        ? `Найдено: ${visible} из ${total}`
        : `Всего терминов: ${total}`;
    }
  });
}

/* --- Calculator Helpers --- */
function calcNPV(rate, cashflows) {
  return cashflows.reduce((npv, cf, t) => npv + cf / Math.pow(1 + rate, t), 0);
}

function calcIRR(cashflows, guess) {
  let rate = guess || 0.1;
  for (let i = 0; i < 1000; i++) {
    const npv = calcNPV(rate, cashflows);
    const dnpv = cashflows.reduce((sum, cf, t) =>
      sum - t * cf / Math.pow(1 + rate, t + 1), 0);
    if (Math.abs(dnpv) < 1e-10) break;
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < 1e-8) break;
    rate = newRate;
  }
  return rate;
}

function calcPI(rate, cashflows) {
  const investment = Math.abs(cashflows[0]);
  const pvInflows = cashflows.slice(1).reduce(
    (sum, cf, t) => sum + cf / Math.pow(1 + rate, t + 1), 0);
  return investment > 0 ? pvInflows / investment : 0;
}

function calcDPP(rate, cashflows) {
  let cumulative = 0;
  for (let t = 0; t < cashflows.length; t++) {
    cumulative += cashflows[t] / Math.pow(1 + rate, t);
    if (cumulative >= 0 && t > 0) {
      const prev = cumulative - cashflows[t] / Math.pow(1 + rate, t);
      const fraction = -prev / (cashflows[t] / Math.pow(1 + rate, t));
      return t - 1 + fraction;
    }
  }
  return null; // no payback
}

function formatNumber(n, decimals) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return n.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals || 2,
    maximumFractionDigits: decimals || 2
  });
}

function formatPercent(n, decimals) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return (n * 100).toFixed(decimals || 2) + '%';
}
