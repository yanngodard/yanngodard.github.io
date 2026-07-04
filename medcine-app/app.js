// ── STATE ────────────────────────────────────────────────────
let state = {
  screen: 'home',
  mode: 'normal',       // 'normal' | 'exam'
  currentUE: null,
  questions: [],
  currentIndex: 0,
  selectedAnswers: [],
  answers: [],
  showExplanation: false,
  examTimer: null,
  examSeconds: 0,
  examDuration: 45 * 60, // 45 min
};

// ── USER DATA ─────────────────────────────────────────────────
function loadUserData() {
  const raw = localStorage.getItem('medcine_v2');
  if (raw) return JSON.parse(raw);
  return {
    xp: 0, level: 1, streak: 0,
    lastPlayDate: null,
    totalQuestions: 0, correctAnswers: 0,
    achievements: [],
    ueProgress: {},
    // Spaced repetition: { questionId: { due: timestamp, interval: days, ease: 2.5, reps: 0 } }
    srData: {},
  };
}
function saveUserData() { localStorage.setItem('medcine_v2', JSON.stringify(userData)); }
let userData = loadUserData();

// ── STREAK ────────────────────────────────────────────────────
function updateStreak() {
  const today = new Date().toDateString();
  if (userData.lastPlayDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  userData.streak = userData.lastPlayDate === yesterday ? userData.streak + 1 : 1;
  userData.lastPlayDate = today;
  saveUserData();
}

// ── XP & LEVEL ────────────────────────────────────────────────
function addXP(n) {
  userData.xp += n;
  userData.level = Math.floor(Math.sqrt(userData.xp / 100)) + 1;
  saveUserData();
}
function xpForLevel(l) { return Math.pow(l, 2) * 100; }
function xpPct() {
  const prev = xpForLevel(userData.level - 1);
  const next = xpForLevel(userData.level);
  return Math.min(100, Math.round(((userData.xp - prev) / (next - prev)) * 100));
}

// ── SPACED REPETITION (SM-2 simplified) ──────────────────────
function srUpdate(questionId, correct) {
  const sr = userData.srData[questionId] || { interval: 1, ease: 2.5, reps: 0, due: Date.now() };
  if (correct) {
    sr.reps++;
    sr.interval = sr.reps === 1 ? 1 : sr.reps === 2 ? 3 : Math.round(sr.interval * sr.ease);
    sr.ease = Math.max(1.3, sr.ease + 0.1);
  } else {
    sr.reps = 0; sr.interval = 1;
    sr.ease = Math.max(1.3, sr.ease - 0.3);
  }
  sr.due = Date.now() + sr.interval * 86400000;
  userData.srData[questionId] = sr;
}

function srWeight(questionId) {
  const sr = userData.srData[questionId];
  if (!sr) return 3; // never seen → high priority
  const overdue = (Date.now() - sr.due) / 86400000;
  if (overdue > 0) return 4 + overdue; // overdue → highest priority
  if (sr.ease < 2.0) return 2;         // hard → medium
  return 1;                             // mastered → low
}

function weightedShuffle(questions) {
  return [...questions]
    .map(q => ({ q, w: srWeight(q.id) + Math.random() }))
    .sort((a, b) => b.w - a.w)
    .map(x => x.q);
}

function isDueForReview(qId) {
  const sr = userData.srData[qId];
  return !sr || Date.now() >= sr.due;
}

// ── QUIZ ENGINE ───────────────────────────────────────────────
function startQuiz(ueKey) {
  const ue = QUESTIONS_DB[ueKey];
  clearInterval(state.examTimer);
  state = {
    ...state,
    screen: 'quiz', mode: 'normal', currentUE: ueKey,
    questions: weightedShuffle(ue.questions),
    currentIndex: 0, selectedAnswers: [], answers: [],
    showExplanation: false, examTimer: null, examSeconds: 0,
  };
  updateStreak();
  render();
}

function startExam() {
  const allQ = Object.values(QUESTIONS_DB).flatMap(ue => ue.questions);
  const shuffled = weightedShuffle(allQ).slice(0, 30);
  clearInterval(state.examTimer);
  const timer = setInterval(() => {
    state.examSeconds++;
    if (state.examSeconds >= state.examDuration) {
      clearInterval(state.examTimer);
      finishQuiz();
    } else {
      // Update only timer display
      const el = document.getElementById('exam-timer');
      if (el) el.textContent = formatTime(state.examDuration - state.examSeconds);
      const urgent = document.getElementById('exam-timer');
      if (urgent && state.examDuration - state.examSeconds < 300) urgent.classList.add('urgent');
    }
  }, 1000);
  state = {
    ...state,
    screen: 'quiz', mode: 'exam', currentUE: null,
    questions: shuffled,
    currentIndex: 0, selectedAnswers: [], answers: [],
    showExplanation: false, examTimer: timer, examSeconds: 0,
  };
  updateStreak();
  render();
}

function formatTime(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function toggleAnswer(id) {
  if (state.showExplanation) return;
  const i = state.selectedAnswers.indexOf(id);
  i === -1 ? state.selectedAnswers.push(id) : state.selectedAnswers.splice(i, 1);
  render();
}

function submitAnswer() {
  if (!state.selectedAnswers.length) return;
  const q = state.questions[state.currentIndex];
  const correctIds = q.answers.filter(a => a.correct).map(a => a.id);
  const isCorrect =
    correctIds.length === state.selectedAnswers.length &&
    correctIds.every(id => state.selectedAnswers.includes(id));
  state.answers.push({ questionId: q.id, selected: [...state.selectedAnswers], correct: isCorrect });
  srUpdate(q.id, isCorrect);
  state.showExplanation = true;
  render();
}

function nextQuestion() {
  state.currentIndex++;
  state.selectedAnswers = [];
  state.showExplanation = false;
  if (state.currentIndex >= state.questions.length) finishQuiz();
  else render();
}

function finishQuiz() {
  clearInterval(state.examTimer);
  const correct = state.answers.filter(a => a.correct).length;
  const total = state.answers.length;
  const bonus = correct === total && total > 0 ? 50 : 0;
  const xp = correct * 20 + bonus;
  userData.totalQuestions += total;
  userData.correctAnswers += correct;
  if (state.currentUE) {
    if (!userData.ueProgress[state.currentUE]) userData.ueProgress[state.currentUE] = { done: 0, correct: 0 };
    userData.ueProgress[state.currentUE].done += total;
    userData.ueProgress[state.currentUE].correct += correct;
  }
  addXP(xp);
  checkAchievements();
  saveUserData();
  state.screen = 'results';
  render();
}

function checkAchievements() {
  const add = id => { if (!userData.achievements.includes(id)) userData.achievements.push(id); };
  if (userData.totalQuestions > 0) add('first_quiz');
  if (userData.streak >= 3)  add('streak_3');
  if (userData.streak >= 7)  add('streak_7');
  if (state.answers.length > 0 && state.answers.every(a => a.correct)) add('perfect_quiz');
  if (userData.totalQuestions >= 50) add('questions_50');
  if (state.mode === 'exam') add('exam_done');
}

// ── RENDER ────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  const map = { home: renderHome, quiz: renderQuiz, results: renderResults, stats: renderStats };
  app.innerHTML = (map[state.screen] || renderHome)();
  attachEvents();
}

// ── HOME ──────────────────────────────────────────────────────
function renderHome() {
  const acc = userData.totalQuestions > 0
    ? Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0;
  return `
  <div class="screen home-screen">
    <header class="app-header">
      <div class="logo">
        <span class="logo-icon">🩺</span>
        <span class="logo-text">MedPrep<span class="logo-accent">Rennes</span></span>
      </div>
      <button class="btn-icon" id="btn-stats" data-action="stats">📊</button>
    </header>

    <div class="hero-card glass">
      <div class="hero-greeting">Bonjour, futur médecin 👋</div>
      <div class="hero-sub">Continue ta progression quotidienne</div>
      <div class="level-row">
        <span class="level-badge">Niv. ${userData.level}</span>
        <div class="xp-bar-wrap"><div class="xp-bar" style="width:${xpPct()}%"></div></div>
        <span class="xp-label">${userData.xp} XP</span>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card glass">
        <div class="stat-icon">🔥</div>
        <div class="stat-val">${userData.streak}</div>
        <div class="stat-lbl">Jours</div>
      </div>
      <div class="stat-card glass">
        <div class="stat-icon">🎯</div>
        <div class="stat-val">${acc}%</div>
        <div class="stat-lbl">Précision</div>
      </div>
      <div class="stat-card glass">
        <div class="stat-icon">📝</div>
        <div class="stat-val">${userData.totalQuestions}</div>
        <div class="stat-lbl">Questions</div>
      </div>
    </div>

    <button class="exam-card glass" id="btn-exam" data-action="exam">
      <span class="exam-icon">🏆</span>
      <div class="exam-info">
        <div class="exam-title">Examen blanc</div>
        <div class="exam-sub">30 questions · 45 min · toutes UE</div>
      </div>
      <span class="exam-arrow">›</span>
    </button>

    <div class="section-title">Réviser par UE</div>
    <div class="ue-list">
      ${Object.entries(QUESTIONS_DB).map(([key, ue]) => {
        const p = userData.ueProgress[key];
        const done = p ? p.done : 0;
        const pct = Math.min(100, Math.round((done / (ue.questions.length * 2)) * 100));
        const dueCount = ue.questions.filter(q => isDueForReview(q.id)).length;
        return `<button class="ue-card glass" data-action="start-quiz" data-ue="${key}" style="--ue-color:${ue.color}">
          <span class="ue-icon">${ue.icon}</span>
          <div class="ue-info">
            <div class="ue-name">${ue.name}</div>
            <div class="ue-progress-bar-wrap">
              <div class="ue-progress-bar" style="width:${pct}%;background:${ue.color}"></div>
            </div>
            <div class="ue-meta">${ue.questions.length} questions · ${dueCount} à revoir</div>
          </div>
          <span class="ue-arrow">›</span>
        </button>`;
      }).join('')}
    </div>

    ${userData.achievements.length ? `
    <div class="section-title">Succès</div>
    <div class="achievements-row">
      ${userData.achievements.map(id => {
        const a = ACHIEVEMENTS.find(x => x.id === id);
        return a ? `<div class="achievement-badge glass" title="${a.name}">${a.icon}</div>` : '';
      }).join('')}
    </div>` : ''}
  </div>`;
}

// ── QUIZ ──────────────────────────────────────────────────────
function renderQuiz() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;
  const idx = state.currentIndex;
  const pct = Math.round((idx / total) * 100);
  const ueKey = state.currentUE || Object.keys(QUESTIONS_DB).find(k =>
    QUESTIONS_DB[k].questions.some(x => x.id === q.id));
  const ue = QUESTIONS_DB[ueKey] || { name: 'Examen blanc', icon: '🏆', color: '#fbbf24' };
  const isMulti = q.answers.filter(a => a.correct).length > 1;
  const sr = userData.srData[q.id];
  const isHard = sr && sr.ease < 2.0;

  return `
  <div class="screen quiz-screen">
    <div class="quiz-header">
      <button class="btn-back" data-action="home">✕</button>
      <div class="quiz-progress-wrap">
        <div class="quiz-progress-bar" style="width:${pct}%;background:${ue.color}"></div>
      </div>
      <div class="quiz-counter">${idx + 1}/${total}</div>
      ${state.mode === 'exam' ? `<div class="timer-wrap">
        <div class="timer-dot"></div>
        <span class="timer-text" id="exam-timer">${formatTime(state.examDuration - state.examSeconds)}</span>
      </div>` : ''}
    </div>

    <div class="question-ue-tag" style="color:${ue.color}">${ue.icon} ${ue.name}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <div class="multi-hint">${isMulti ? '✦ Plusieurs bonnes réponses' : '◆ Une seule réponse'}</div>
      ${isHard ? '<div class="sr-badge">⚡ Question difficile</div>' : ''}
    </div>

    <div class="question-card glass">
      <div class="question-text">${q.text}</div>
    </div>

    <div class="answers-list">
      ${q.answers.map(a => {
        let cls = 'answer-btn glass';
        if (state.showExplanation) {
          if (a.correct) cls += ' correct';
          else if (state.selectedAnswers.includes(a.id)) cls += ' wrong';
        } else if (state.selectedAnswers.includes(a.id)) {
          cls += ' selected';
        }
        const icon = state.showExplanation
          ? (a.correct ? '<span class="answer-icon">✓</span>'
            : state.selectedAnswers.includes(a.id) ? '<span class="answer-icon">✗</span>' : '')
          : '';
        return `<button class="${cls}" data-action="toggle-answer" data-answer="${a.id}">
          <span class="answer-letter">${a.id.toUpperCase()}</span>
          <span class="answer-text">${a.text}</span>
          ${icon}
        </button>`;
      }).join('')}
    </div>

    ${state.showExplanation ? `
    <div class="explanation-card glass">
      <div class="explanation-title">💡 Explication</div>
      <div class="explanation-text">${q.explanation}</div>
    </div>
    <button class="btn-primary" data-action="next">
      ${idx + 1 < total ? 'Question suivante →' : 'Voir les résultats 🎉'}
    </button>` : `
    <button class="btn-primary ${!state.selectedAnswers.length ? 'disabled' : ''}" data-action="submit">
      Valider ma réponse
    </button>`}
  </div>`;
}

// ── RESULTS ───────────────────────────────────────────────────
function renderResults() {
  const correct = state.answers.filter(a => a.correct).length;
  const total = state.answers.length;
  const pct = Math.round((correct / total) * 100);
  const xp = correct * 20 + (correct === total && total > 0 ? 50 : 0);
  const elapsed = state.mode === 'exam' ? formatTime(state.examSeconds) : null;
  const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : pct >= 40 ? '💪' : '😕';
  const msg = pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bon résultat !' : pct >= 40 ? 'Continue !' : 'Revois le cours !';

  return `
  <div class="screen results-screen">
    <div class="results-hero">
      <div class="results-emoji">${emoji}</div>
      <div class="results-score">${correct}/${total}</div>
      <div class="results-pct">${pct}% de bonnes réponses${elapsed ? ` · ⏱ ${elapsed}` : ''}</div>
      <div class="results-msg">${msg}</div>
      <div class="xp-earned">+${xp} XP</div>
    </div>

    <div class="results-detail glass">
      ${state.answers.map((ans, i) => {
        const q = state.questions[i];
        return `<div class="result-row ${ans.correct ? 'ok' : 'ko'}">
          <span class="result-icon">${ans.correct ? '✓' : '✗'}</span>
          <span class="result-q">${q.text.substring(0, 65)}${q.text.length > 65 ? '…' : ''}</span>
        </div>`;
      }).join('')}
    </div>

    <div class="results-actions">
      ${state.mode === 'exam'
        ? `<button class="btn-primary" data-action="exam">Nouvel examen blanc</button>`
        : `<button class="btn-primary" data-action="replay">Rejouer cette UE</button>`}
      <button class="btn-secondary glass" data-action="home">Retour au menu</button>
    </div>
  </div>`;
}

// ── STATS ─────────────────────────────────────────────────────
function renderStats() {
  const acc = userData.totalQuestions > 0
    ? Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0;
  const masteredCount = Object.values(userData.srData).filter(s => s.ease >= 2.5 && s.reps >= 3).length;

  return `
  <div class="screen stats-screen">
    <div class="quiz-header">
      <button class="btn-back" data-action="home">←</button>
      <div class="screen-title">Mes statistiques</div>
      <div style="width:36px"></div>
    </div>

    <div class="stats-grid">
      <div class="stats-big-card glass"><div class="sbc-val">${userData.streak} 🔥</div><div class="sbc-lbl">Jours consécutifs</div></div>
      <div class="stats-big-card glass"><div class="sbc-val">${acc}%</div><div class="sbc-lbl">Précision globale</div></div>
      <div class="stats-big-card glass"><div class="sbc-val">${userData.totalQuestions}</div><div class="sbc-lbl">Questions répondues</div></div>
      <div class="stats-big-card glass"><div class="sbc-val">${masteredCount} ⭐</div><div class="sbc-lbl">Questions maîtrisées</div></div>
    </div>

    <div class="section-title">Progression par UE</div>
    ${Object.entries(QUESTIONS_DB).map(([key, ue]) => {
      const p = userData.ueProgress[key];
      const done = p ? p.done : 0;
      const cor = p ? p.correct : 0;
      const ueAcc = done > 0 ? Math.round((cor / done) * 100) : 0;
      const pct = Math.min(100, Math.round((done / (ue.questions.length * 2)) * 100));
      return `<div class="ue-stat glass">
        <div class="ue-stat-header"><span>${ue.icon} ${ue.name}</span><span style="color:${ue.color}">${ueAcc}%</span></div>
        <div class="ue-progress-bar-wrap"><div class="ue-progress-bar" style="width:${pct}%;background:${ue.color}"></div></div>
        <div class="ue-stat-meta">${done} réponses · ${ue.questions.filter(q => isDueForReview(q.id)).length} à revoir</div>
      </div>`;
    }).join('')}

    <div class="section-title">Succès</div>
    <div class="achievements-list">
      ${ACHIEVEMENTS.map(a => {
        const unlocked = userData.achievements.includes(a.id);
        return `<div class="achievement-item glass ${unlocked ? 'unlocked' : 'locked'}">
          <div class="ach-icon">${a.icon}</div>
          <div class="ach-info"><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div></div>
          <div class="ach-xp">+${a.xp} XP</div>
        </div>`;
      }).join('')}
    </div>

    <button class="btn-danger glass" data-action="reset">Réinitialiser la progression</button>
  </div>`;
}

// ── EVENTS ────────────────────────────────────────────────────
function attachEvents() {
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const a = el.dataset.action;
      if (a === 'start-quiz') startQuiz(el.dataset.ue);
      else if (a === 'exam')   startExam();
      else if (a === 'toggle-answer') toggleAnswer(el.dataset.answer);
      else if (a === 'submit') submitAnswer();
      else if (a === 'next')   nextQuestion();
      else if (a === 'home')   { clearInterval(state.examTimer); state.screen = 'home'; render(); }
      else if (a === 'stats')  { state.screen = 'stats'; render(); }
      else if (a === 'replay') startQuiz(state.currentUE);
      else if (a === 'reset') {
        if (confirm('Réinitialiser toute ta progression ?')) {
          localStorage.removeItem('medcine_v2');
          userData = loadUserData();
          state.screen = 'home';
          render();
        }
      }
    });
  });
}

// ── BOOT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', render);
