# Interactive Course Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Jekyll site with a self-contained HTML/CSS/JS interactive course where students pick their OS, read OS-specific lessons, and practice commands in an in-browser terminal simulator with progress saved to localStorage.

**Architecture:** Seven HTML pages share one `css/style.css`, one `js/app.js` (OS cookie + progress + sidebar), and one `js/terminal.js` (GuidedTerminal for lessons 1–4 + VirtualFS/FreeTerminal for lesson 5). All pages include both scripts and call an init function from an inline `<script>` block.

**Tech Stack:** Vanilla HTML, CSS, JavaScript (ES6). No build step. No frameworks. GitHub Pages static hosting.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `docs/css/style.css` | All shared styles |
| Create | `docs/js/app.js` | OS cookie, progress, sidebar, OS overlay |
| Create | `docs/js/terminal.js` | GuidedTerminal, VirtualFS, FreeTerminal |
| Create | `docs/index.html` | OS selection + lesson dashboard |
| Create | `docs/lesson-01.html` | What Is the Terminal? |
| Create | `docs/lesson-02.html` | Navigating Folders |
| Create | `docs/lesson-03.html` | Files & Folders |
| Create | `docs/lesson-04.html` | GUI Bridge |
| Create | `docs/lesson-05.html` | Challenge |
| Modify | `.github/workflows/pages.yml` | Remove Jekyll build, serve docs/ directly |
| Modify | `.gitignore` | Add `.superpowers/` |
| Delete | `docs/_config.yml`, `docs/404.md`, `docs/index.md`, `docs/assets/style.css`, all `docs/lessons/*.md`, `docs/exercises/*.md`, `docs/hints/*.md` | Remove Jekyll source files |

---

## Task 1: Shared CSS

**Files:**
- Create: `docs/css/style.css`

- [ ] **Step 1: Create `docs/css/style.css`**

```css
/* ── Tokens ───────────────────────────────────────── */
:root {
  --blue: #1d4ed8;
  --blue-light: #eff6ff;
  --blue-mid: #bfdbfe;
  --green: #22c55e;
  --green-light: #dcfce7;
  --red: #ef4444;
  --red-light: #fee2e2;
  --text: #1e293b;
  --text-muted: #64748b;
  --text-faint: #94a3b8;
  --border: #e2e8f0;
  --surface: #f8fafc;
  --white: #ffffff;
  --topbar-h: 48px;
  --sidebar-w: 220px;
}

/* ── Reset ────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; color: var(--text); background: var(--white); font-size: 15px; line-height: 1.6; }
a { color: var(--blue); text-decoration: none; }
a:hover { text-decoration: underline; }
code { font-family: 'Courier New', monospace; font-size: 13px; background: var(--blue-light); padding: 1px 5px; border-radius: 3px; color: var(--blue); }

/* ── OS Overlay ───────────────────────────────────── */
#os-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.6);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.os-overlay-box {
  background: var(--white); border-radius: 12px; padding: 36px 40px;
  max-width: 360px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.os-overlay-box h2 { font-size: 22px; margin-bottom: 8px; }
.os-overlay-box > p { color: var(--text-muted); margin-bottom: 24px; }
.os-buttons { display: flex; flex-direction: column; gap: 10px; }
.os-btn {
  display: flex; align-items: center; gap: 14px;
  background: var(--surface); border: 2px solid var(--border);
  border-radius: 10px; padding: 12px 16px; cursor: pointer;
  font-size: 14px; text-align: left; transition: border-color .15s, background .15s;
}
.os-btn:hover { border-color: var(--blue); background: var(--blue-light); }
.os-btn .os-icon { font-size: 24px; line-height: 1; }
.os-btn .os-name { font-weight: 600; color: var(--text); }
.os-btn .os-desc { font-size: 12px; color: var(--text-muted); }
.os-note { font-size: 12px; color: var(--text-faint); margin-top: 16px; }

/* ── Top Bar ──────────────────────────────────────── */
.topbar {
  position: sticky; top: 0; z-index: 100;
  height: var(--topbar-h); background: var(--blue);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px;
}
.topbar-brand { color: var(--white); font-weight: 700; font-size: 16px; }
.topbar-brand:hover { text-decoration: none; opacity: .9; }
.topbar-os { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--blue-mid); }
.os-badge {
  background: var(--white); color: var(--blue);
  font-weight: 700; font-size: 12px; padding: 3px 12px; border-radius: 99px;
}
.change-os {
  background: transparent; border: 1px solid rgba(255,255,255,.4);
  color: var(--blue-mid); border-radius: 4px; padding: 2px 10px;
  font-size: 12px; cursor: pointer;
}
.change-os:hover { background: rgba(255,255,255,.1); }

/* ── Layout ───────────────────────────────────────── */
.layout {
  display: flex;
  min-height: calc(100vh - var(--topbar-h));
}

/* ── Sidebar ──────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-w); flex-shrink: 0;
  background: var(--surface); border-right: 1px solid var(--border);
  padding: 20px 0; display: flex; flex-direction: column;
  position: sticky; top: var(--topbar-h); height: calc(100vh - var(--topbar-h));
  overflow-y: auto;
}
.sidebar-label {
  padding: 0 16px 8px; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);
}
.sidebar-lesson {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 16px; font-size: 13px; color: var(--text-muted);
  border-left: 3px solid transparent; transition: background .1s;
}
.sidebar-lesson:hover { background: var(--blue-light); text-decoration: none; color: var(--text); }
.sidebar-lesson.complete { color: var(--text-muted); }
.sidebar-lesson.complete .lesson-icon { color: var(--green); }
.sidebar-lesson.current {
  background: var(--blue-light); border-left-color: var(--blue);
  color: var(--blue); font-weight: 600;
}
.sidebar-lesson.current .lesson-icon { color: var(--blue); }
.lesson-icon { font-size: 12px; width: 16px; text-align: center; flex-shrink: 0; }
.sidebar-progress { padding: 16px 16px 8px; border-top: 1px solid var(--border); margin-top: auto; }
.sidebar-progress-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 6px; }
.progress-bar { background: var(--border); border-radius: 99px; height: 6px; overflow: hidden; }
.progress-fill { background: var(--blue); height: 100%; border-radius: 99px; transition: width .3s; }
.progress-text { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.sidebar-footer { padding: 12px 16px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 6px; }
.sidebar-footer a, .reset-link {
  font-size: 13px; color: var(--text-muted); background: none; border: none;
  cursor: pointer; padding: 0; text-align: left;
}
.sidebar-footer a:hover, .reset-link:hover { color: var(--text); text-decoration: underline; }

/* ── Main Content ─────────────────────────────────── */
.main-content { flex: 1; padding: 32px 40px; max-width: 780px; }
.lesson-title { font-size: 26px; font-weight: 700; margin-bottom: 6px; }
.lesson-intro { color: var(--text-muted); font-size: 15px; margin-bottom: 28px; }
.lesson-section { margin-bottom: 28px; }
.lesson-section h2 { font-size: 18px; font-weight: 600; margin-bottom: 10px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
.lesson-section p { margin-bottom: 10px; }
.lesson-section ul { padding-left: 20px; }
.lesson-section li { margin-bottom: 4px; }
.callout { background: var(--blue-light); border-left: 4px solid var(--blue); border-radius: 0 6px 6px 0; padding: 12px 16px; margin: 12px 0; font-size: 14px; }
.callout.warning { background: #fff7ed; border-left-color: #f59e0b; }

/* ── Exercise Card ────────────────────────────────── */
.exercise-section-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; color: var(--blue); margin-bottom: 12px;
}
.exercise-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 20px; margin-bottom: 16px;
}
.exercise-header { margin-bottom: 4px; }
.exercise-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: .5px; }
.exercise-prompt { font-size: 15px; font-weight: 500; margin-bottom: 14px; color: var(--text); }
.terminal-input-row {
  display: flex; align-items: center; gap: 8px;
  background: #0f172a; border-radius: 6px; padding: 8px 12px;
}
.terminal-prompt { font-family: 'Courier New', monospace; font-size: 12px; color: #64748b; white-space: nowrap; flex-shrink: 0; }
.terminal-input {
  flex: 1; background: transparent; border: none; outline: none;
  font-family: 'Courier New', monospace; font-size: 13px; color: #e2e8f0;
  caret-color: #e2e8f0;
}
.run-btn {
  background: var(--blue); color: var(--white); border: none; border-radius: 4px;
  padding: 4px 14px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap;
}
.run-btn:hover { background: #1e40af; }
.terminal-output {
  margin-top: 8px; background: #0f172a; border-radius: 4px;
  padding: 8px 12px; font-family: 'Courier New', monospace; font-size: 12px;
}
.terminal-output.success .output-status { color: #4ade80; font-weight: 600; margin-bottom: 2px; }
.terminal-output.success .output-text { color: #e2e8f0; }
.terminal-output.error .output-status { color: #f87171; }
.exercise-controls { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.hint-btn, .skip-btn {
  background: none; border: none; cursor: pointer; font-size: 13px; color: var(--text-muted);
}
.hint-btn:hover, .skip-btn:hover { color: var(--text); }
.next-btn {
  margin-left: auto; background: var(--blue); color: var(--white); border: none;
  border-radius: 6px; padding: 6px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
}
.next-btn:hover { background: #1e40af; }
.hint-text { margin-top: 10px; font-size: 13px; color: var(--text-muted); background: #fff7ed; border-radius: 4px; padding: 8px 12px; }
.ex-dots { display: flex; gap: 6px; margin-top: 14px; align-items: center; }
.ex-dot { width: 8px; height: 8px; border-radius: 99px; background: var(--border); }
.ex-dot.done { background: var(--green); }
.ex-dot.active { background: var(--blue); }

/* ── Lesson Complete ──────────────────────────────── */
.lesson-complete { text-align: center; padding: 48px 24px; }
.complete-icon { font-size: 48px; margin-bottom: 12px; }
.lesson-complete h2 { font-size: 24px; margin-bottom: 8px; }
.lesson-complete p { color: var(--text-muted); margin-bottom: 24px; }
.next-lesson-btn {
  display: inline-block; background: var(--blue); color: var(--white);
  padding: 10px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;
}
.next-lesson-btn:hover { background: #1e40af; text-decoration: none; }

/* ── Free Terminal (Lesson 5) ─────────────────────── */
.challenge-layout { display: flex; gap: 24px; align-items: flex-start; }
.challenge-info { flex: 1; min-width: 0; }
.challenge-terminal { flex: 1; min-width: 0; }
.checklist { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-top: 16px; }
.checklist h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--text-muted); margin-bottom: 10px; }
.checklist-item { display: flex; align-items: center; gap: 10px; padding: 5px 0; font-size: 14px; color: var(--text-muted); border-bottom: 1px solid var(--border); }
.checklist-item:last-child { border-bottom: none; }
.checklist-item.done { color: var(--green); }
.checklist-item.done .check-icon::before { content: '✓'; }
.checklist-item .check-icon::before { content: '○'; color: var(--text-faint); }
.checklist-item.done .check-icon::before { color: var(--green); }
.free-terminal-box { background: #0f172a; border-radius: 8px; overflow: hidden; }
.free-terminal-header { background: #1e293b; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; }
.free-terminal-title { font-size: 12px; color: #64748b; font-family: 'Courier New', monospace; }
.reset-terminal-btn { background: none; border: 1px solid #334155; border-radius: 4px; color: #64748b; font-size: 11px; padding: 2px 8px; cursor: pointer; }
.reset-terminal-btn:hover { color: #94a3b8; border-color: #475569; }
.free-terminal-output { padding: 10px 12px; font-family: 'Courier New', monospace; font-size: 12px; min-height: 280px; max-height: 360px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.free-terminal-output .ft-line { color: #94a3b8; }
.free-terminal-output .ft-cmd { color: #e2e8f0; }
.free-terminal-output .ft-out { color: #cbd5e1; }
.free-terminal-output .ft-err { color: #f87171; }
.free-terminal-output .ft-success { color: #4ade80; font-size: 11px; }
.free-terminal-input-row {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 12px; border-top: 1px solid #1e293b;
}
.free-terminal-prompt-text { font-family: 'Courier New', monospace; font-size: 12px; color: #64748b; white-space: nowrap; flex-shrink: 0; }
.free-terminal-input {
  flex: 1; background: transparent; border: none; outline: none;
  font-family: 'Courier New', monospace; font-size: 12px; color: #e2e8f0; caret-color: #e2e8f0;
}
.free-run-btn { background: var(--blue); color: var(--white); border: none; border-radius: 4px; padding: 3px 10px; font-size: 11px; cursor: pointer; }

/* ── Index / Dashboard ────────────────────────────── */
.dashboard-intro { margin-bottom: 32px; }
.dashboard-intro h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
.dashboard-intro p { color: var(--text-muted); max-width: 520px; }
.lesson-cards { display: flex; flex-direction: column; gap: 12px; }
.lesson-card {
  display: flex; align-items: center; gap: 16px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 16px 20px; text-decoration: none; color: var(--text);
  transition: border-color .15s, box-shadow .15s;
}
.lesson-card:hover { border-color: var(--blue); box-shadow: 0 2px 8px rgba(29,78,216,.1); text-decoration: none; }
.lesson-card.complete { border-left: 4px solid var(--green); }
.lesson-card.in-progress { border-left: 4px solid var(--blue); }
.card-icon { font-size: 20px; width: 32px; text-align: center; flex-shrink: 0; }
.card-body { flex: 1; }
.card-title { font-weight: 600; font-size: 15px; }
.card-desc { font-size: 13px; color: var(--text-muted); }
.card-status { font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 99px; }
.card-status.complete { background: var(--green-light); color: #15803d; }
.card-status.in-progress { background: var(--blue-light); color: var(--blue); }
```

- [ ] **Step 2: Open `docs/index.html` in browser to confirm styles load (will be blank — that's expected at this point)**

- [ ] **Step 3: Commit**

```bash
git add docs/css/style.css
git commit -m "feat: add shared CSS for interactive course site"
```

---

## Task 2: app.js — OS Cookie + Content Filtering + Progress + Sidebar

**Files:**
- Create: `docs/js/app.js`

- [ ] **Step 1: Create `docs/js/app.js`**

```js
const LESSONS = [
  { id: 'lesson-01', title: 'What Is the Terminal?', href: 'lesson-01.html', icon: '💻' },
  { id: 'lesson-02', title: 'Navigating Folders',    href: 'lesson-02.html', icon: '📂' },
  { id: 'lesson-03', title: 'Files & Folders',       href: 'lesson-03.html', icon: '📄' },
  { id: 'lesson-04', title: 'GUI Bridge',             href: 'lesson-04.html', icon: '🔗' },
  { id: 'lesson-05', title: 'Challenge',              href: 'lesson-05.html', icon: '🏆' },
];

const OS_LABELS = { windows: '⊞ Windows', macos: '⌘ macOS', linux: '🐧 Linux' };

// ── OS Cookie ─────────────────────────────────────────────────
function getOS() {
  const m = document.cookie.match(/(?:^|;\s*)cle_os=([^;]+)/);
  return m ? m[1] : null;
}

function setOS(os) {
  const exp = new Date();
  exp.setFullYear(exp.getFullYear() + 1);
  document.cookie = `cle_os=${os}; expires=${exp.toUTCString()}; path=/`;
}

function applyOS(os) {
  document.querySelectorAll('[data-os]').forEach(el => {
    const platforms = el.dataset.os.split(' ');
    el.style.display = platforms.includes(os) ? '' : 'none';
  });
  const badge = document.getElementById('os-badge');
  if (badge) badge.textContent = OS_LABELS[os] || os;
}

// ── Progress ───────────────────────────────────────────────────
function getProgress() {
  try { return JSON.parse(localStorage.getItem('cle_progress')) || {}; }
  catch { return {}; }
}

function setLessonProgress(lessonId, status) {
  const p = getProgress();
  if (p[lessonId] === 'complete' && status === 'in-progress') return; // never downgrade
  p[lessonId] = status;
  localStorage.setItem('cle_progress', JSON.stringify(p));
}

function getFurthestLesson() {
  const p = getProgress();
  for (const lesson of LESSONS) {
    if (p[lesson.id] === 'in-progress') return lesson.href;
  }
  return 'lesson-01.html';
}

// ── Sidebar ────────────────────────────────────────────────────
function renderSidebar(currentLessonId) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const p = getProgress();
  const completedCount = LESSONS.filter(l => p[l.id] === 'complete').length;
  const pct = Math.round((completedCount / LESSONS.length) * 100);

  const items = LESSONS.map(lesson => {
    const status = p[lesson.id];
    const isCurrent = lesson.id === currentLessonId;
    const icon = status === 'complete' ? '✓' : isCurrent ? '▶' : '○';
    const cls = ['sidebar-lesson', status === 'complete' ? 'complete' : '', isCurrent ? 'current' : ''].filter(Boolean).join(' ');
    return `<a href="${lesson.href}" class="${cls}"><span class="lesson-icon">${icon}</span>${lesson.title}</a>`;
  }).join('');

  sidebar.innerHTML = `
    <div class="sidebar-label">Course Lessons</div>
    ${items}
    <div class="sidebar-progress">
      <div class="sidebar-progress-label">Progress</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-text">${completedCount} of ${LESSONS.length} lessons complete</div>
    </div>
    <div class="sidebar-footer">
      <a href="tip-sheet.html" target="_blank">📄 Tip Sheet</a>
      <button class="reset-link" onclick="resetProgress()">Reset progress</button>
    </div>
  `;
}

function resetProgress() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    localStorage.removeItem('cle_progress');
    location.reload();
  }
}

// ── OS Overlay ─────────────────────────────────────────────────
function showOSOverlay() {
  const overlay = document.getElementById('os-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function hideOSOverlay() {
  const overlay = document.getElementById('os-overlay');
  if (overlay) overlay.style.display = 'none';
}

function selectOS(os, redirect) {
  setOS(os);
  hideOSOverlay();
  if (redirect) {
    window.location.href = getFurthestLesson();
  } else {
    applyOS(os);
    const lessonId = document.body.dataset.lesson;
    if (lessonId) renderSidebar(lessonId);
    if (window._terminal) window._terminal.render();
  }
}

// ── Page Init ──────────────────────────────────────────────────
function initLesson(lessonId) {
  const os = getOS();
  if (!os) { showOSOverlay(); return; }
  setLessonProgress(lessonId, 'in-progress');
  applyOS(os);
  renderSidebar(lessonId);
}

function initIndex() {
  const os = getOS();
  if (!os) { showOSOverlay(); return; }
  applyOS(os);
  renderSidebar(null);
  renderDashboard();
}

function renderDashboard() {
  const container = document.getElementById('dashboard-cards');
  if (!container) return;
  const p = getProgress();
  container.innerHTML = LESSONS.map(lesson => {
    const status = p[lesson.id];
    const statusHtml = status === 'complete'
      ? '<span class="card-status complete">✓ Complete</span>'
      : status === 'in-progress'
      ? '<span class="card-status in-progress">In Progress</span>'
      : '';
    const cls = ['lesson-card', status || ''].filter(Boolean).join(' ');
    return `
      <a href="${lesson.href}" class="${cls}">
        <span class="card-icon">${lesson.icon}</span>
        <div class="card-body">
          <div class="card-title">${lesson.title}</div>
        </div>
        ${statusHtml}
      </a>`;
  }).join('');
}
```

- [ ] **Step 2: Verify in browser console — open any HTML file that includes app.js, call `getOS()`, confirm it returns null initially**

- [ ] **Step 3: Commit**

```bash
git add docs/js/app.js
git commit -m "feat: add app.js for OS cookie, progress, and sidebar"
```

---

## Task 3: terminal.js — GuidedTerminal

**Files:**
- Create: `docs/js/terminal.js`

- [ ] **Step 1: Create `docs/js/terminal.js` with GuidedTerminal**

```js
// ── GuidedTerminal ─────────────────────────────────────────────
// Used by lessons 1-4. exercises is an array of exercise objects (see below).
// nextHref is the URL of the next lesson page.
class GuidedTerminal {
  constructor(containerEl, exercises, lessonId, nextHref) {
    this.el = containerEl;
    this.exercises = exercises;
    this.lessonId = lessonId;
    this.nextHref = nextHref;
    this.current = 0;
    window._terminal = this;
    this.render();
  }

  get exercise() { return this.exercises[this.current]; }

  get os() { return getOS(); }

  get prompt() {
    return { windows: 'C:\\Users\\student>', macos: 'user@mac:~$', linux: 'user@ubuntu:~$' }[this.os];
  }

  normalize(cmd) {
    return cmd.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  evaluate(input) {
    const os = this.os;
    const expected = this.exercise.expected[os] || this.exercise.expected.all || [];
    const n = this.normalize(input);
    // Check exact matches first
    if (expected.map(e => this.normalize(e)).includes(n)) return true;
    // Check prefix matches for commands like "echo > file" where content varies
    if (this.exercise.matchPrefix) {
      return expected.some(e => n.startsWith(this.normalize(e)));
    }
    return false;
  }

  render() {
    const ex = this.exercise;
    const os = this.os;
    const total = this.exercises.length;
    const idx = this.current;

    const dots = this.exercises.map((_, i) =>
      `<span class="ex-dot ${i < idx ? 'done' : i === idx ? 'active' : ''}"></span>`
    ).join('');

    const prompt = ex.prompt[os] || ex.prompt.all || '';

    this.el.innerHTML = `
      <div class="exercise-section-label">Practice</div>
      <div class="exercise-card">
        <div class="exercise-header">
          <span class="exercise-label">Exercise ${idx + 1} of ${total}</span>
        </div>
        <p class="exercise-prompt">${prompt}</p>
        <div class="terminal-input-row">
          <span class="terminal-prompt">${this.prompt}</span>
          <input type="text" id="cmd-input" class="terminal-input"
            autocomplete="off" spellcheck="false" placeholder="type your command here">
          <button class="run-btn" onclick="window._terminal.run()">▶ Run</button>
        </div>
        <div id="cmd-output" class="terminal-output" style="display:none"></div>
        <div class="exercise-controls">
          <button class="hint-btn" onclick="window._terminal.showHint()">💡 Show hint</button>
          <button class="skip-btn" onclick="window._terminal.skip()">Skip</button>
          <button id="next-btn" class="next-btn" style="display:none"
            onclick="window._terminal.next()">Next exercise →</button>
        </div>
        <div id="hint-text" class="hint-text" style="display:none">${ex.hint}</div>
        <div class="ex-dots">${dots}</div>
      </div>
    `;

    const input = document.getElementById('cmd-input');
    if (input) {
      input.addEventListener('keydown', e => { if (e.key === 'Enter') window._terminal.run(); });
      input.focus();
    }
  }

  run() {
    const input = document.getElementById('cmd-input');
    const outputEl = document.getElementById('cmd-output');
    if (!input || !outputEl) return;
    const val = input.value.trim();
    if (!val) return;

    outputEl.style.display = 'block';

    if (this.evaluate(val)) {
      const os = this.os;
      const out = this.exercise.output[os] || this.exercise.output.all || '';
      outputEl.className = 'terminal-output success';
      outputEl.innerHTML = `<div class="output-status">✓ Correct!</div>${out ? `<div class="output-text">${out}</div>` : ''}`;
      const nextBtn = document.getElementById('next-btn');
      if (nextBtn) nextBtn.style.display = 'inline-block';
      input.disabled = true;
    } else {
      outputEl.className = 'terminal-output error';
      outputEl.innerHTML = `<div class="output-status">✗ Not quite. Try again or click "Show hint".</div>`;
    }
  }

  showHint() {
    const el = document.getElementById('hint-text');
    if (el) el.style.display = 'block';
  }

  skip() { this._advance(); }

  next() { this._advance(); }

  _advance() {
    this.current++;
    if (this.current >= this.exercises.length) {
      setLessonProgress(this.lessonId, 'complete');
      renderSidebar(this.lessonId);
      this.el.innerHTML = `
        <div class="lesson-complete">
          <div class="complete-icon">🎉</div>
          <h2>Lesson Complete!</h2>
          <p>You've finished all exercises for this lesson.</p>
          <a href="${this.nextHref}" class="next-lesson-btn">Next Lesson →</a>
        </div>`;
    } else {
      this.render();
    }
  }
}
```

- [ ] **Step 2: Commit (terminal.js is partial — VirtualFS/FreeTerminal come next)**

```bash
git add docs/js/terminal.js
git commit -m "feat: add GuidedTerminal class to terminal.js"
```

---

## Task 4: terminal.js — VirtualFS + FreeTerminal

**Files:**
- Modify: `docs/js/terminal.js` (append)

- [ ] **Step 1: Append VirtualFS and FreeTerminal to `docs/js/terminal.js`**

```js
// ── VirtualFS ──────────────────────────────────────────────────
// Maintains an in-memory filesystem for the free terminal (lesson 5).
class VirtualFS {
  constructor(os) {
    this.os = os;
    this.reset();
  }

  home() {
    return this.os === 'windows' ? 'C:/Users/student' : '/home/student';
  }

  reset() {
    this.cwd = this.home();
    // entries: Map<absPath, { type: 'dir'|'file', content: string, children: Set<name> }>
    this.entries = new Map();
    this._addDir(this.home());
    this._addDir(this.home() + '/Documents');
    this._addDir(this.home() + '/Downloads');
    this._addDir(this.home() + '/Desktop');
  }

  _addDir(path) {
    this.entries.set(path, { type: 'dir', children: new Set() });
    this._registerChild(path);
  }

  _addFile(path, content = '') {
    this.entries.set(path, { type: 'file', content });
    this._registerChild(path);
  }

  _registerChild(path) {
    const sep = path.lastIndexOf('/');
    if (sep <= 0) return;
    const parent = path.slice(0, sep) || '/';
    const name = path.slice(sep + 1);
    if (this.entries.has(parent)) this.entries.get(parent).children.add(name);
  }

  _unregisterChild(path) {
    const sep = path.lastIndexOf('/');
    if (sep < 0) return;
    const parent = path.slice(0, sep) || '/';
    const name = path.slice(sep + 1);
    if (this.entries.has(parent)) this.entries.get(parent).children.delete(name);
  }

  resolve(rawPath) {
    if (!rawPath || rawPath === '.') return this.cwd;
    let p = rawPath.replace(/\\/g, '/');
    if (p === '~') return this.home();
    if (p.startsWith('~/')) p = this.home() + p.slice(1);
    if (this.os === 'windows' && /^[A-Za-z]:\//.test(p)) return p;
    if (!p.startsWith('/')) p = this.cwd + '/' + p;
    const parts = p.split('/');
    const out = [];
    for (const part of parts) {
      if (part === '' && out.length === 0) { out.push(''); continue; }
      if (part === '' || part === '.') continue;
      if (part === '..') { out.pop(); } else { out.push(part); }
    }
    return out.join('/') || '/';
  }

  mkdir(args) {
    const paths = args.trim().split(/\s+/);
    const errs = [];
    for (const raw of paths) {
      const p = this.resolve(raw);
      if (this.entries.has(p)) { errs.push(`mkdir: cannot create directory '${raw}': File exists`); continue; }
      const parent = p.slice(0, p.lastIndexOf('/')) || '/';
      if (!this.entries.has(parent)) { errs.push(`mkdir: cannot create directory '${raw}': No such file or directory`); continue; }
      this._addDir(p);
    }
    return errs.join('\n');
  }

  touch(args) {
    const paths = args.trim().split(/\s+/);
    const errs = [];
    for (const raw of paths) {
      const p = this.resolve(raw);
      const parent = p.slice(0, p.lastIndexOf('/')) || '/';
      if (!this.entries.has(parent)) { errs.push(`touch: cannot touch '${raw}': No such file or directory`); continue; }
      if (!this.entries.has(p)) this._addFile(p);
    }
    return errs.join('\n');
  }

  ls(rawPath, flags = '') {
    const p = rawPath ? this.resolve(rawPath) : this.cwd;
    if (!this.entries.has(p)) return `ls: cannot access '${rawPath}': No such file or directory`;
    const entry = this.entries.get(p);
    if (entry.type === 'file') return p.slice(p.lastIndexOf('/') + 1);
    const showHidden = flags.includes('a') || flags.includes('A');
    let children = Array.from(entry.children);
    if (!showHidden) children = children.filter(c => !c.startsWith('.'));
    children.sort();
    if (!flags.includes('R')) return children.join('  ') || '(empty)';
    let out = p + ':\n' + children.join('  ');
    for (const c of children) {
      const cp = p + '/' + c;
      if (this.entries.has(cp) && this.entries.get(cp).type === 'dir') out += '\n\n' + this.ls(cp, flags);
    }
    return out;
  }

  dir(rawPath) { return this.ls(rawPath); }

  cd(rawPath) {
    if (!rawPath || rawPath === '~') { this.cwd = this.home(); return { ok: true }; }
    const p = this.resolve(rawPath);
    if (!this.entries.has(p)) return { ok: false, err: `cd: ${rawPath}: No such file or directory` };
    if (this.entries.get(p).type !== 'dir') return { ok: false, err: `cd: ${rawPath}: Not a directory` };
    this.cwd = p;
    return { ok: true };
  }

  pwd() { return this.os === 'windows' ? this.cwd.replace(/\//g, '\\') : this.cwd; }

  echo(text, dest) {
    if (!dest) return text;
    const p = this.resolve(dest);
    const parent = p.slice(0, p.lastIndexOf('/')) || '/';
    if (!this.entries.has(parent)) return `Cannot write to '${dest}': No such file or directory`;
    this._addFile(p, text);
    return '';
  }

  cat(rawPath) {
    const p = this.resolve(rawPath);
    if (!this.entries.has(p)) return `cat: ${rawPath}: No such file or directory`;
    const e = this.entries.get(p);
    if (e.type === 'dir') return `cat: ${rawPath}: Is a directory`;
    return e.content || '(empty file)';
  }

  rm(rawPath) {
    const p = this.resolve(rawPath);
    if (!this.entries.has(p)) return `rm: cannot remove '${rawPath}': No such file or directory`;
    if (this.entries.get(p).type === 'dir') return `rm: cannot remove '${rawPath}': Is a directory`;
    this._unregisterChild(p);
    this.entries.delete(p);
    return '';
  }

  rmdir(rawPath) {
    const p = this.resolve(rawPath);
    if (!this.entries.has(p)) return `rmdir: failed to remove '${rawPath}': No such file or directory`;
    if (this.entries.get(p).type !== 'dir') return `rmdir: failed to remove '${rawPath}': Not a directory`;
    if (this.entries.get(p).children.size > 0) return `rmdir: failed to remove '${rawPath}': Directory not empty`;
    this._unregisterChild(p);
    this.entries.delete(p);
    return '';
  }

  cp(src, dest) {
    const sp = this.resolve(src), dp = this.resolve(dest);
    if (!this.entries.has(sp)) return `cp: ${src}: No such file or directory`;
    if (this.entries.get(sp).type === 'dir') return `cp: -r not supported in this simulator`;
    const parent = dp.slice(0, dp.lastIndexOf('/')) || '/';
    if (!this.entries.has(parent)) return `cp: ${dest}: No such file or directory`;
    this._addFile(dp, this.entries.get(sp).content);
    return '';
  }

  mv(src, dest) {
    const sp = this.resolve(src);
    let dp = this.resolve(dest);
    if (!this.entries.has(sp)) return `mv: ${src}: No such file or directory`;
    if (this.entries.has(dp) && this.entries.get(dp).type === 'dir') {
      const name = sp.slice(sp.lastIndexOf('/') + 1);
      dp = dp + '/' + name;
    }
    const parent = dp.slice(0, dp.lastIndexOf('/')) || '/';
    if (!this.entries.has(parent)) return `mv: ${dest}: No such file or directory`;
    this.entries.set(dp, this.entries.get(sp));
    this._registerChild(dp);
    this._unregisterChild(sp);
    this.entries.delete(sp);
    if (this.cwd === sp) this.cwd = dp;
    return '';
  }

  whoami() { return 'student'; }

  checkGoals(goals) {
    return goals.map(g => {
      const base = this.home() + '/';
      if (g.type === 'dir-exists') {
        return this.entries.has(this.resolve(base + g.path)) &&
               this.entries.get(this.resolve(base + g.path)).type === 'dir';
      }
      if (g.type === 'file-exists') {
        if (g.path.includes('*')) {
          const parts = g.path.split('/');
          const dir = this.resolve(base + parts.slice(0, -1).join('/'));
          const ext = parts[parts.length - 1].replace('*', '');
          if (!this.entries.has(dir)) return false;
          return Array.from(this.entries.get(dir).children).some(f => f.endsWith(ext));
        }
        return this.entries.has(this.resolve(base + g.path)) &&
               this.entries.get(this.resolve(base + g.path)).type === 'file';
      }
      return false;
    });
  }
}

// ── FreeTerminal ───────────────────────────────────────────────
// Used by lesson 5. goals is an array of { type, path, label } objects.
class FreeTerminal {
  constructor(outputEl, inputEl, promptEl, goals, lessonId, onComplete) {
    this.outputEl = outputEl;
    this.inputEl = inputEl;
    this.promptEl = promptEl;
    this.goals = goals;
    this.lessonId = lessonId;
    this.onComplete = onComplete;
    this.os = getOS();
    this.fs = new VirtualFS(this.os);
    this.history = [];
    this.histIdx = -1;
    this.updatePrompt();
    this._bindKeys();
    window._freeTerminal = this;
  }

  updatePrompt() {
    if (!this.promptEl) return;
    const cwd = this.fs.pwd();
    this.promptEl.textContent = this.os === 'windows'
      ? `${cwd}>`
      : `student@terminal:${cwd.replace(this.fs.home(), '~')}$`;
  }

  _bindKeys() {
    if (!this.inputEl) return;
    this.inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') { this.run(this.inputEl.value); this.inputEl.value = ''; this.histIdx = -1; }
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.histIdx < this.history.length - 1) { this.histIdx++; this.inputEl.value = this.history[this.histIdx]; }
      }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.histIdx > 0) { this.histIdx--; this.inputEl.value = this.history[this.histIdx]; }
        else { this.histIdx = -1; this.inputEl.value = ''; }
      }
    });
  }

  _addLine(text, cls) {
    const div = document.createElement('div');
    div.className = `ft-line ${cls}`;
    div.textContent = text;
    this.outputEl.appendChild(div);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    if (this.history[0] !== cmd) this.history.unshift(cmd);
    if (this.history.length > 50) this.history.pop();

    this._addLine(this.promptEl.textContent + ' ' + cmd, 'ft-cmd');

    const result = this._exec(cmd);
    if (result.out) result.out.split('\n').forEach(l => this._addLine(l, 'ft-out'));
    if (result.err) result.err.split('\n').forEach(l => this._addLine(l, 'ft-err'));

    this.updatePrompt();
    this._checkGoals();
  }

  _exec(raw) {
    // Parse: handle echo "text" > file and type nul > file
    if (/^echo\s+.*>\s*\S+/.test(raw)) {
      const m = raw.match(/^echo\s+(.*?)\s*>\s*(\S+)$/);
      if (m) {
        const text = m[1].replace(/^["']|["']$/g, '');
        const err = this.fs.echo(text, m[2]);
        return { out: '', err };
      }
    }
    if (/^type\s+nul\s*>\s*\S+/i.test(raw)) {
      const m = raw.match(/^type\s+nul\s*>\s*(\S+)/i);
      if (m) { const err = this.fs.echo('', m[1]); return { out: '', err }; }
    }

    const parts = raw.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    const verb = parts[0].toLowerCase();
    const args = parts.slice(1).map(a => a.replace(/^["']|["']$/g, ''));

    const os = this.os;
    switch (verb) {
      case 'echo': return { out: args.join(' '), err: '' };
      case 'whoami': return { out: this.fs.whoami(), err: '' };
      case 'cls':
      case 'clear': this.outputEl.innerHTML = ''; return { out: '', err: '' };
      case 'pwd': return { out: this.fs.pwd(), err: '' };
      case 'cd': {
        if (!args[0] || args[0] === '') { return { out: this.fs.pwd(), err: '' }; }
        const r = this.fs.cd(args[0]);
        return r.ok ? { out: '', err: '' } : { out: '', err: r.err };
      }
      case 'ls': {
        const flags = args.filter(a => a.startsWith('-')).map(a => a.slice(1)).join('');
        const path = args.find(a => !a.startsWith('-'));
        return { out: this.fs.ls(path, flags), err: '' };
      }
      case 'dir': return { out: this.fs.dir(args[0]), err: '' };
      case 'mkdir': return { out: '', err: this.fs.mkdir(args.join(' ')) };
      case 'touch': return { out: '', err: this.fs.touch(args.join(' ')) };
      case 'cat': return { out: this.fs.cat(args[0]), err: '' };
      case 'cp': return { out: '', err: this.fs.cp(args[0], args[1]) };
      case 'mv': return { out: '', err: this.fs.mv(args[0], args[1]) };
      case 'rm': return { out: '', err: this.fs.rm(args[0]) };
      case 'rmdir': return { out: '', err: this.fs.rmdir(args[0]) };
      case 'explorer':
      case 'open':
      case 'xdg-open': return { out: `(Opening ${args[0] || '.'} in file manager...)`, err: '' };
      default:
        return { out: '', err: `${verb}: command not found. Try one of the commands from the course.` };
    }
  }

  _checkGoals() {
    const results = this.fs.checkGoals(this.goals);
    const allDone = results.every(Boolean);

    this.goals.forEach((goal, i) => {
      const item = document.getElementById(`goal-${i}`);
      if (item && results[i] && !item.classList.contains('done')) {
        item.classList.add('done');
        this._addLine(`✓ ${goal.label}`, 'ft-success');
      }
    });

    if (allDone) {
      setLessonProgress(this.lessonId, 'complete');
      renderSidebar(this.lessonId);
      if (this.onComplete) this.onComplete();
    }
  }

  reset() {
    this.fs.reset();
    this.outputEl.innerHTML = '';
    this.updatePrompt();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add docs/js/terminal.js
git commit -m "feat: add VirtualFS and FreeTerminal to terminal.js"
```

---

## Task 5: index.html

**Files:**
- Create: `docs/index.html`

- [ ] **Step 1: Create `docs/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Command Line Essentials</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-lesson="">

  <div id="os-overlay" style="display:none">
    <div class="os-overlay-box">
      <h2>Welcome!</h2>
      <p>Before we start, tell us which computer you're using.</p>
      <div class="os-buttons">
        <button class="os-btn" onclick="selectOS('windows', true)">
          <span class="os-icon">⊞</span>
          <div><div class="os-name">Windows</div><div class="os-desc">PowerShell or CMD</div></div>
        </button>
        <button class="os-btn" onclick="selectOS('macos', true)">
          <span class="os-icon">⌘</span>
          <div><div class="os-name">macOS</div><div class="os-desc">Terminal app</div></div>
        </button>
        <button class="os-btn" onclick="selectOS('linux', true)">
          <span class="os-icon">🐧</span>
          <div><div class="os-name">Ubuntu Linux</div><div class="os-desc">Bash terminal</div></div>
        </button>
      </div>
      <p class="os-note">Saved as a cookie — change anytime</p>
    </div>
  </div>

  <header class="topbar">
    <a class="topbar-brand" href="index.html">⌨️ Command Line Essentials</a>
    <div class="topbar-os">
      <span>Your platform:</span>
      <span id="os-badge" class="os-badge"></span>
      <button class="change-os" onclick="showOSOverlay()">change</button>
    </div>
  </header>

  <div class="layout">
    <nav id="sidebar" class="sidebar"></nav>
    <main class="main-content">
      <div class="dashboard-intro">
        <h1>Command Line Essentials</h1>
        <p>Learn to use the terminal in 1–2 hours. Pick a lesson below to start — or continue where you left off.</p>
      </div>
      <div id="dashboard-cards" class="lesson-cards"></div>
    </main>
  </div>

  <script src="js/app.js"></script>
  <script src="js/terminal.js"></script>
  <script>initIndex();</script>
</body>
</html>
```

- [ ] **Step 2: Open `docs/index.html` in a browser. Verify:**
  - OS overlay appears (no cookie set yet)
  - Clicking Windows sets the cookie and redirects to `lesson-01.html`
  - Returning to `index.html` shows the dashboard with lesson cards
  - "change" link in top bar re-opens the overlay without redirecting

- [ ] **Step 3: Commit**

```bash
git add docs/index.html
git commit -m "feat: add index.html with OS selection and lesson dashboard"
```

---

## Task 6: lesson-01.html — What Is the Terminal?

**Files:**
- Create: `docs/lesson-01.html`

- [ ] **Step 1: Create `docs/lesson-01.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson 1: What Is the Terminal? — Command Line Essentials</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-lesson="lesson-01">

  <div id="os-overlay" style="display:none">
    <div class="os-overlay-box">
      <h2>Choose your platform</h2>
      <p>We'll show instructions for your operating system.</p>
      <div class="os-buttons">
        <button class="os-btn" onclick="selectOS('windows', false)">
          <span class="os-icon">⊞</span>
          <div><div class="os-name">Windows</div><div class="os-desc">PowerShell or CMD</div></div>
        </button>
        <button class="os-btn" onclick="selectOS('macos', false)">
          <span class="os-icon">⌘</span>
          <div><div class="os-name">macOS</div><div class="os-desc">Terminal app</div></div>
        </button>
        <button class="os-btn" onclick="selectOS('linux', false)">
          <span class="os-icon">🐧</span>
          <div><div class="os-name">Ubuntu Linux</div><div class="os-desc">Bash terminal</div></div>
        </button>
      </div>
      <p class="os-note">Saved as a cookie — change anytime</p>
    </div>
  </div>

  <header class="topbar">
    <a class="topbar-brand" href="index.html">⌨️ Command Line Essentials</a>
    <div class="topbar-os">
      <span>Your platform:</span>
      <span id="os-badge" class="os-badge"></span>
      <button class="change-os" onclick="showOSOverlay()">change</button>
    </div>
  </header>

  <div class="layout">
    <nav id="sidebar" class="sidebar"></nav>
    <main class="main-content">

      <h1 class="lesson-title">Lesson 1: What Is the Terminal?</h1>
      <p class="lesson-intro">The terminal is a text-based way to control your computer. It might look intimidating at first, but it's incredibly powerful — and you'll be comfortable with it by the end of this lesson.</p>

      <div class="lesson-section">
        <h2>Opening the Terminal</h2>
        <p data-os="windows">Press <strong>Win + S</strong>, type <strong>PowerShell</strong>, and hit Enter. Or press <strong>Win + R</strong>, type <code>powershell</code>, and press Enter.</p>
        <p data-os="macos">Press <strong>⌘ + Space</strong>, type <strong>Terminal</strong>, and hit Enter. Or open Finder → Applications → Utilities → Terminal.</p>
        <p data-os="linux">Press <strong>Ctrl + Alt + T</strong> to open the terminal directly. Or search for "Terminal" in your applications menu.</p>
      </div>

      <div class="lesson-section">
        <h2>Understanding the Prompt</h2>
        <p data-os="windows">When PowerShell is ready, you'll see something like: <code>PS C:\Users\YourName&gt;</code> — this means the terminal is waiting for your command.</p>
        <p data-os="macos">When Terminal is ready, you'll see something like: <code>YourName@Mac ~ %</code> — the <code>~</code> means your home folder.</p>
        <p data-os="linux">When the terminal is ready, you'll see something like: <code>user@computer:~$</code> — the <code>~</code> means your home folder and <code>$</code> means you're a regular user.</p>
        <p>Everything after the prompt is where you type. Press <strong>Enter</strong> to run a command.</p>
      </div>

      <div class="lesson-section">
        <h2>Your First Commands</h2>
        <p>The <code>echo</code> command prints text to the screen. Try it:</p>
        <p data-os="windows"><code>echo "Hello, World!"</code></p>
        <p data-os="macos linux"><code>echo "Hello, World!"</code></p>

        <p>To see your username:</p>
        <p data-os="windows"><code>echo $env:USERNAME</code> — prints your Windows username.</p>
        <p data-os="macos linux"><code>whoami</code> — prints your username.</p>

        <p>To clear the terminal screen:</p>
        <p data-os="windows"><code>cls</code></p>
        <p data-os="macos linux"><code>clear</code></p>

        <div class="callout">Tip: Press <strong>↑</strong> to cycle through previous commands. Press <strong>Ctrl+C</strong> to cancel a running command.</div>
      </div>

      <div id="terminal-container"></div>

    </main>
  </div>

  <script src="js/app.js"></script>
  <script src="js/terminal.js"></script>
  <script>
    initLesson('lesson-01');

    const EXERCISES = [
      {
        prompt: {
          all: 'Print "Hello, World!" to the screen using the <code>echo</code> command.'
        },
        expected: {
          all: ['echo "hello, world!"', "echo 'hello, world!'", 'echo hello, world!', 'echo "Hello, World!"', "echo 'Hello, World!'"]
        },
        output: { all: 'Hello, World!' },
        hint: 'Type: echo "Hello, World!" and press Enter (or the Run button).'
      },
      {
        prompt: {
          windows: 'Print your username to the screen.',
          macos: 'Print your username to the screen.',
          linux: 'Print your username to the screen.'
        },
        expected: {
          windows: ['echo $env:username', 'echo $env:USERNAME', 'whoami'],
          macos: ['whoami'],
          linux: ['whoami']
        },
        output: { all: 'student' },
        hint: 'Windows: try <code>echo $env:USERNAME</code>. Mac/Linux: try <code>whoami</code>.'
      },
      {
        prompt: {
          windows: 'Clear the terminal screen.',
          macos: 'Clear the terminal screen.',
          linux: 'Clear the terminal screen.'
        },
        expected: {
          windows: ['cls', 'clear'],
          macos: ['clear'],
          linux: ['clear']
        },
        output: { all: '(Terminal cleared)' },
        hint: 'Windows: <code>cls</code>. Mac/Linux: <code>clear</code>.'
      }
    ];

    new GuidedTerminal(
      document.getElementById('terminal-container'),
      EXERCISES, 'lesson-01', 'lesson-02.html'
    );
  </script>
</body>
</html>
```

- [ ] **Step 2: Open `docs/lesson-01.html`. Verify:**
  - Lesson prose shows for your OS (others hidden)
  - Exercise 1 renders with a terminal input
  - Typing `echo "Hello, World!"` and clicking Run shows "✓ Correct!"
  - "Next exercise →" button appears; clicking it advances to exercise 2
  - Completing all 3 exercises shows "Lesson Complete!" with a link to lesson-02.html
  - Sidebar shows Lesson 1 as `▶ current`; after completion it shows `✓`

- [ ] **Step 3: Commit**

```bash
git add docs/lesson-01.html
git commit -m "feat: add lesson-01.html — What Is the Terminal?"
```

---

## Task 7: lesson-02.html — Navigating Folders

**Files:**
- Create: `docs/lesson-02.html`

- [ ] **Step 1: Create `docs/lesson-02.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson 2: Navigating Folders — Command Line Essentials</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-lesson="lesson-02">

  <div id="os-overlay" style="display:none">
    <div class="os-overlay-box">
      <h2>Choose your platform</h2>
      <p>We'll show instructions for your operating system.</p>
      <div class="os-buttons">
        <button class="os-btn" onclick="selectOS('windows', false)"><span class="os-icon">⊞</span><div><div class="os-name">Windows</div><div class="os-desc">PowerShell or CMD</div></div></button>
        <button class="os-btn" onclick="selectOS('macos', false)"><span class="os-icon">⌘</span><div><div class="os-name">macOS</div><div class="os-desc">Terminal app</div></div></button>
        <button class="os-btn" onclick="selectOS('linux', false)"><span class="os-icon">🐧</span><div><div class="os-name">Ubuntu Linux</div><div class="os-desc">Bash terminal</div></div></button>
      </div>
      <p class="os-note">Saved as a cookie — change anytime</p>
    </div>
  </div>

  <header class="topbar">
    <a class="topbar-brand" href="index.html">⌨️ Command Line Essentials</a>
    <div class="topbar-os">
      <span>Your platform:</span>
      <span id="os-badge" class="os-badge"></span>
      <button class="change-os" onclick="showOSOverlay()">change</button>
    </div>
  </header>

  <div class="layout">
    <nav id="sidebar" class="sidebar"></nav>
    <main class="main-content">

      <h1 class="lesson-title">Lesson 2: Navigating Folders</h1>
      <p class="lesson-intro">Learn to move around your computer using the terminal. You'll use these commands every time you open a terminal.</p>

      <div class="lesson-section">
        <h2>Where Am I?</h2>
        <p>When you open a terminal, you start in a folder. To see which folder you're in:</p>
        <p data-os="windows"><code>cd</code> — with no arguments, prints your current location.</p>
        <p data-os="macos linux"><code>pwd</code> — short for "print working directory."</p>
        <p>The location shown is called your <strong>current working directory</strong>.</p>
      </div>

      <div class="lesson-section">
        <h2>Listing Files</h2>
        <p data-os="windows"><code>dir</code> — lists all files and folders in your current location.</p>
        <p data-os="macos linux"><code>ls</code> — lists all files and folders in your current location.</p>
        <p>Useful flags:</p>
        <p data-os="windows"><code>dir /a</code> — show hidden files too (files starting with a dot).</p>
        <p data-os="macos linux"><code>ls -a</code> — show hidden files too. <code>ls -la</code> adds size and date details.</p>
      </div>

      <div class="lesson-section">
        <h2>Moving Between Folders</h2>
        <p><code>cd FolderName</code> — enter a folder (same on all platforms).</p>
        <p><code>cd ..</code> — go up one level to the parent folder (same on all platforms).</p>
        <p><code>cd ~</code> — go to your home folder. The <code>~</code> symbol always means "home."</p>
        <p data-os="windows">Windows alternative: <code>cd $env:USERPROFILE</code></p>
        <div class="callout">Tip: Press <strong>Tab</strong> to auto-complete folder names as you type.</div>
      </div>

      <div class="lesson-section">
        <h2>Relative vs Absolute Paths</h2>
        <p>A <strong>relative path</strong> starts from where you are now: <code>cd Documents</code></p>
        <p data-os="windows">An <strong>absolute path</strong> starts from the root: <code>cd C:\Users\YourName\Documents</code></p>
        <p data-os="macos linux">An <strong>absolute path</strong> starts from the root: <code>cd /Users/YourName/Documents</code></p>
      </div>

      <div id="terminal-container"></div>

    </main>
  </div>

  <script src="js/app.js"></script>
  <script src="js/terminal.js"></script>
  <script>
    initLesson('lesson-02');

    const EXERCISES = [
      {
        prompt: { windows: 'Print your current working directory.', macos: 'Print your current working directory.', linux: 'Print your current working directory.' },
        expected: { windows: ['cd', 'pwd'], macos: ['pwd'], linux: ['pwd'] },
        output: { windows: 'C:\\Users\\student', macos: '/Users/student', linux: '/home/student' },
        hint: 'Windows: <code>cd</code> (no arguments). Mac/Linux: <code>pwd</code>.'
      },
      {
        prompt: { windows: 'List the files in your current folder.', macos: 'List the files in your current folder.', linux: 'List the files in your current folder.' },
        expected: { windows: ['dir'], macos: ['ls'], linux: ['ls'] },
        output: { all: 'Documents  Downloads  Desktop' },
        hint: 'Windows: <code>dir</code>. Mac/Linux: <code>ls</code>.'
      },
      {
        prompt: { all: 'Show all files including hidden ones (files that start with a dot).' },
        expected: {
          windows: ['dir /a'],
          macos: ['ls -a', 'ls -la', 'ls -al', 'ls -a -l', 'ls -l -a'],
          linux: ['ls -a', 'ls -la', 'ls -al', 'ls -a -l', 'ls -l -a']
        },
        output: { all: '.hidden  Documents  Downloads  Desktop' },
        hint: 'Windows: <code>dir /a</code>. Mac/Linux: <code>ls -a</code>.'
      },
      {
        prompt: { all: 'Go up one level to the parent folder.' },
        expected: { all: ['cd ..'] },
        output: { all: '' },
        hint: 'Try: <code>cd ..</code> (two dots).'
      },
      {
        prompt: { all: 'Go to your home folder using the <code>~</code> shortcut.' },
        expected: {
          windows: ['cd ~', 'cd $env:userprofile', 'cd $env:USERPROFILE'],
          macos: ['cd ~', 'cd'],
          linux: ['cd ~', 'cd']
        },
        output: { all: '' },
        hint: 'Try: <code>cd ~</code>'
      }
    ];

    new GuidedTerminal(
      document.getElementById('terminal-container'),
      EXERCISES, 'lesson-02', 'lesson-03.html'
    );
  </script>
</body>
</html>
```

- [ ] **Step 2: Open `docs/lesson-02.html`. Verify all 5 exercises work. After completion, "Next Lesson →" links to lesson-03.html.**

- [ ] **Step 3: Commit**

```bash
git add docs/lesson-02.html
git commit -m "feat: add lesson-02.html — Navigating Folders"
```

---

## Task 8: lesson-03.html — Files & Folders

**Files:**
- Create: `docs/lesson-03.html`

- [ ] **Step 1: Create `docs/lesson-03.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson 3: Files & Folders — Command Line Essentials</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-lesson="lesson-03">

  <div id="os-overlay" style="display:none">
    <div class="os-overlay-box">
      <h2>Choose your platform</h2>
      <p>We'll show instructions for your operating system.</p>
      <div class="os-buttons">
        <button class="os-btn" onclick="selectOS('windows', false)"><span class="os-icon">⊞</span><div><div class="os-name">Windows</div><div class="os-desc">PowerShell or CMD</div></div></button>
        <button class="os-btn" onclick="selectOS('macos', false)"><span class="os-icon">⌘</span><div><div class="os-name">macOS</div><div class="os-desc">Terminal app</div></div></button>
        <button class="os-btn" onclick="selectOS('linux', false)"><span class="os-icon">🐧</span><div><div class="os-name">Ubuntu Linux</div><div class="os-desc">Bash terminal</div></div></button>
      </div>
      <p class="os-note">Saved as a cookie — change anytime</p>
    </div>
  </div>

  <header class="topbar">
    <a class="topbar-brand" href="index.html">⌨️ Command Line Essentials</a>
    <div class="topbar-os">
      <span>Your platform:</span>
      <span id="os-badge" class="os-badge"></span>
      <button class="change-os" onclick="showOSOverlay()">change</button>
    </div>
  </header>

  <div class="layout">
    <nav id="sidebar" class="sidebar"></nav>
    <main class="main-content">

      <h1 class="lesson-title">Lesson 3: Files &amp; Folders</h1>
      <p class="lesson-intro">Create, copy, move, and delete files and folders from the command line.</p>

      <div class="lesson-section">
        <h2>Creating Folders</h2>
        <p><code>mkdir FolderName</code> — creates a new folder (same on all platforms).</p>
        <p>Create multiple at once: <code>mkdir breakfast lunch dinner</code></p>
      </div>

      <div class="lesson-section">
        <h2>Creating Files</h2>
        <p data-os="windows"><code>type nul &gt; filename.txt</code> — creates an empty file in PowerShell.</p>
        <p data-os="macos linux"><code>touch filename.txt</code> — creates an empty file.</p>
      </div>

      <div class="lesson-section">
        <h2>Writing &amp; Reading Files</h2>
        <p><code>echo "text" &gt; filename.txt</code> — writes text to a file (overwrites). Same on all platforms.</p>
        <p><code>cat filename.txt</code> — reads and prints a file's contents. Same on all platforms.</p>
        <div class="callout warning">⚠️ The <code>&gt;</code> operator overwrites the file. Use <code>&gt;&gt;</code> to append instead.</div>
      </div>

      <div class="lesson-section">
        <h2>Copying, Moving, Deleting</h2>
        <p><code>cp source.txt dest.txt</code> — copies a file. Same on all platforms.</p>
        <p><code>mv old.txt new.txt</code> — renames or moves a file. Same on all platforms.</p>
        <p><code>rm filename.txt</code> — deletes a file. Same on all platforms.</p>
        <p><code>rmdir FolderName</code> — deletes an empty folder. Same on all platforms.</p>
        <div class="callout warning">⚠️ There is no recycle bin in the terminal. Deleted files are gone permanently.</div>
      </div>

      <div id="terminal-container"></div>

    </main>
  </div>

  <script src="js/app.js"></script>
  <script src="js/terminal.js"></script>
  <script>
    initLesson('lesson-03');

    const EXERCISES = [
      {
        prompt: { all: 'Create a folder called <code>projects</code>.' },
        expected: { all: ['mkdir projects'] },
        output: { all: '' },
        hint: 'Try: <code>mkdir projects</code>'
      },
      {
        prompt: {
          windows: 'Create an empty file called <code>notes.txt</code>.',
          macos: 'Create an empty file called <code>notes.txt</code>.',
          linux: 'Create an empty file called <code>notes.txt</code>.'
        },
        expected: {
          windows: ['type nul > notes.txt'],
          macos: ['touch notes.txt'],
          linux: ['touch notes.txt']
        },
        output: { all: '' },
        hint: 'Windows: <code>type nul &gt; notes.txt</code>. Mac/Linux: <code>touch notes.txt</code>.'
      },
      {
        prompt: { all: 'Write the text <code>Hello</code> to <code>notes.txt</code> using <code>echo</code> and <code>&gt;</code>.' },
        expected: {
          all: ['echo "hello" > notes.txt', "echo 'hello' > notes.txt",
                'echo hello > notes.txt', 'echo "Hello" > notes.txt',
                "echo 'Hello' > notes.txt", 'echo Hello > notes.txt']
        },
        matchPrefix: false,
        output: { all: '' },
        hint: 'Try: <code>echo "Hello" &gt; notes.txt</code>'
      },
      {
        prompt: { all: 'Read the contents of <code>notes.txt</code>.' },
        expected: { all: ['cat notes.txt'] },
        output: { all: 'Hello' },
        hint: 'Try: <code>cat notes.txt</code>'
      },
      {
        prompt: { all: 'Delete the file <code>notes.txt</code>.' },
        expected: { all: ['rm notes.txt'] },
        output: { all: '' },
        hint: 'Try: <code>rm notes.txt</code>'
      }
    ];

    new GuidedTerminal(
      document.getElementById('terminal-container'),
      EXERCISES, 'lesson-03', 'lesson-04.html'
    );
  </script>
</body>
</html>
```

- [ ] **Step 2: Open `docs/lesson-03.html`. Verify all 5 exercises work end-to-end.**

- [ ] **Step 3: Commit**

```bash
git add docs/lesson-03.html
git commit -m "feat: add lesson-03.html — Files and Folders"
```

---

## Task 9: lesson-04.html — GUI Bridge

**Files:**
- Create: `docs/lesson-04.html`

- [ ] **Step 1: Create `docs/lesson-04.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson 4: GUI Bridge — Command Line Essentials</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-lesson="lesson-04">

  <div id="os-overlay" style="display:none">
    <div class="os-overlay-box">
      <h2>Choose your platform</h2>
      <p>We'll show instructions for your operating system.</p>
      <div class="os-buttons">
        <button class="os-btn" onclick="selectOS('windows', false)"><span class="os-icon">⊞</span><div><div class="os-name">Windows</div><div class="os-desc">PowerShell or CMD</div></div></button>
        <button class="os-btn" onclick="selectOS('macos', false)"><span class="os-icon">⌘</span><div><div class="os-name">macOS</div><div class="os-desc">Terminal app</div></div></button>
        <button class="os-btn" onclick="selectOS('linux', false)"><span class="os-icon">🐧</span><div><div class="os-name">Ubuntu Linux</div><div class="os-desc">Bash terminal</div></div></button>
      </div>
      <p class="os-note">Saved as a cookie — change anytime</p>
    </div>
  </div>

  <header class="topbar">
    <a class="topbar-brand" href="index.html">⌨️ Command Line Essentials</a>
    <div class="topbar-os">
      <span>Your platform:</span>
      <span id="os-badge" class="os-badge"></span>
      <button class="change-os" onclick="showOSOverlay()">change</button>
    </div>
  </header>

  <div class="layout">
    <nav id="sidebar" class="sidebar"></nav>
    <main class="main-content">

      <h1 class="lesson-title">Lesson 4: GUI ↔ Terminal Bridge</h1>
      <p class="lesson-intro">The terminal and your file manager (File Explorer, Finder, Files) are just two different views of the same folders. This lesson shows you how to move between them.</p>

      <div class="lesson-section">
        <h2>The Key Insight</h2>
        <p>When you create a file in the terminal, the file manager shows it. When you delete a file in the file manager, the terminal reflects that too. They are <strong>two windows into the same folder</strong>.</p>
      </div>

      <div class="lesson-section">
        <h2>Open the GUI from the Terminal</h2>
        <p>Use <code>.</code> to mean "the current folder":</p>
        <p data-os="windows"><code>explorer .</code> — opens the current folder in File Explorer.</p>
        <p data-os="macos"><code>open .</code> — opens the current folder in Finder.</p>
        <p data-os="linux"><code>xdg-open .</code> — opens the current folder in Files (Nautilus).</p>
        <p>You can also open a specific folder:</p>
        <p data-os="windows"><code>explorer C:\Users\YourName\Documents</code></p>
        <p data-os="macos"><code>open ~/Documents</code></p>
        <p data-os="linux"><code>xdg-open ~/Documents</code></p>
      </div>

      <div class="lesson-section">
        <h2>Open the Terminal from the GUI</h2>
        <p data-os="windows"><strong>Windows 11:</strong> Right-click a folder → "Open in Terminal". <strong>Windows 10:</strong> Click the address bar → type <code>cmd</code> → Enter.</p>
        <p data-os="macos">System Settings → Keyboard → Keyboard Shortcuts → Services → enable "New Terminal at Folder". Then right-click any folder → Services → "New Terminal at Folder".</p>
        <p data-os="linux">Right-click a folder → "Open in Terminal". Or press <strong>Ctrl+Alt+T</strong> to open a terminal at your home folder.</p>
      </div>

      <div id="terminal-container"></div>

    </main>
  </div>

  <script src="js/app.js"></script>
  <script src="js/terminal.js"></script>
  <script>
    initLesson('lesson-04');

    const EXERCISES = [
      {
        prompt: {
          windows: 'Open the current folder in File Explorer.',
          macos: 'Open the current folder in Finder.',
          linux: 'Open the current folder in the Files app.'
        },
        expected: {
          windows: ['explorer .', 'explorer.exe .'],
          macos: ['open .'],
          linux: ['xdg-open .']
        },
        output: {
          windows: '(File Explorer opened)',
          macos: '(Finder opened)',
          linux: '(Files opened)'
        },
        hint: 'Windows: <code>explorer .</code> Mac: <code>open .</code> Linux: <code>xdg-open .</code>'
      },
      {
        prompt: {
          windows: 'Open your home folder in File Explorer.',
          macos: 'Open your home folder in Finder.',
          linux: 'Open your home folder in Files.'
        },
        expected: {
          windows: ['explorer ~', 'explorer $env:userprofile', 'explorer $env:USERPROFILE'],
          macos: ['open ~'],
          linux: ['xdg-open ~']
        },
        output: {
          windows: '(File Explorer opened at C:\\Users\\student)',
          macos: '(Finder opened at /Users/student)',
          linux: '(Files opened at /home/student)'
        },
        hint: 'Windows: <code>explorer ~</code> Mac: <code>open ~</code> Linux: <code>xdg-open ~</code>'
      }
    ];

    new GuidedTerminal(
      document.getElementById('terminal-container'),
      EXERCISES, 'lesson-04', 'lesson-05.html'
    );
  </script>
</body>
</html>
```

- [ ] **Step 2: Open `docs/lesson-04.html`. Verify both exercises work for all three OS values (switch OS with the "change" link).**

- [ ] **Step 3: Commit**

```bash
git add docs/lesson-04.html
git commit -m "feat: add lesson-04.html — GUI Bridge"
```

---

## Task 10: lesson-05.html — Challenge

**Files:**
- Create: `docs/lesson-05.html`

- [ ] **Step 1: Create `docs/lesson-05.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson 5: Challenge — Command Line Essentials</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-lesson="lesson-05">

  <div id="os-overlay" style="display:none">
    <div class="os-overlay-box">
      <h2>Choose your platform</h2>
      <p>We'll show instructions for your operating system.</p>
      <div class="os-buttons">
        <button class="os-btn" onclick="selectOS('windows', false)"><span class="os-icon">⊞</span><div><div class="os-name">Windows</div><div class="os-desc">PowerShell or CMD</div></div></button>
        <button class="os-btn" onclick="selectOS('macos', false)"><span class="os-icon">⌘</span><div><div class="os-name">macOS</div><div class="os-desc">Terminal app</div></div></button>
        <button class="os-btn" onclick="selectOS('linux', false)"><span class="os-icon">🐧</span><div><div class="os-name">Ubuntu Linux</div><div class="os-desc">Bash terminal</div></div></button>
      </div>
      <p class="os-note">Saved as a cookie — change anytime</p>
    </div>
  </div>

  <header class="topbar">
    <a class="topbar-brand" href="index.html">⌨️ Command Line Essentials</a>
    <div class="topbar-os">
      <span>Your platform:</span>
      <span id="os-badge" class="os-badge"></span>
      <button class="change-os" onclick="showOSOverlay()">change</button>
    </div>
  </header>

  <div class="layout">
    <nav id="sidebar" class="sidebar"></nav>
    <main class="main-content">

      <h1 class="lesson-title">Lesson 5: Challenge — Build a Recipe Collection</h1>
      <p class="lesson-intro">Put everything together. Build a folder structure using only the terminal. The checklist on the right tracks your progress automatically.</p>

      <div class="challenge-layout">

        <div class="challenge-info">
          <div class="lesson-section">
            <h2>The Goal</h2>
            <p>Create a <code>my-recipes</code> folder with three category folders, each containing a recipe file.</p>
            <pre style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:12px;font-size:13px;line-height:1.6;">my-recipes/
├── breakfast/
│   └── favorite.txt
├── lunch/
│   └── favorite.txt
└── dinner/
    └── favorite.txt</pre>
          </div>

          <div class="lesson-section">
            <h2>Hint: Step by Step</h2>
            <ol style="padding-left:20px;font-size:14px;line-height:2;">
              <li>Create the <code>my-recipes</code> folder: <code>mkdir my-recipes</code></li>
              <li data-os="windows">Create the subfolders: <code>mkdir my-recipes/breakfast my-recipes/lunch my-recipes/dinner</code></li>
              <li data-os="macos linux">Create the subfolders: <code>mkdir my-recipes/breakfast my-recipes/lunch my-recipes/dinner</code></li>
              <li data-os="windows">Create files: <code>type nul &gt; my-recipes/breakfast/favorite.txt</code> (repeat for lunch, dinner)</li>
              <li data-os="macos linux">Create files: <code>touch my-recipes/breakfast/favorite.txt my-recipes/lunch/favorite.txt my-recipes/dinner/favorite.txt</code></li>
              <li>Add content: <code>echo "Pancakes!" &gt; my-recipes/breakfast/favorite.txt</code></li>
              <li>Verify: <code>ls -R my-recipes</code></li>
            </ol>
          </div>

          <div class="checklist">
            <h3>Checklist</h3>
            <div id="goal-0" class="checklist-item"><span class="check-icon"></span>Create <code>my-recipes/</code> folder</div>
            <div id="goal-1" class="checklist-item"><span class="check-icon"></span>Create <code>breakfast/</code> subfolder</div>
            <div id="goal-2" class="checklist-item"><span class="check-icon"></span>Create <code>lunch/</code> subfolder</div>
            <div id="goal-3" class="checklist-item"><span class="check-icon"></span>Create <code>dinner/</code> subfolder</div>
            <div id="goal-4" class="checklist-item"><span class="check-icon"></span>Add a file in <code>breakfast/</code></div>
            <div id="goal-5" class="checklist-item"><span class="check-icon"></span>Add a file in <code>lunch/</code></div>
            <div id="goal-6" class="checklist-item"><span class="check-icon"></span>Add a file in <code>dinner/</code></div>
          </div>
        </div>

        <div class="challenge-terminal">
          <div class="free-terminal-box">
            <div class="free-terminal-header">
              <span class="free-terminal-title">Terminal</span>
              <button class="reset-terminal-btn" onclick="window._freeTerminal && window._freeTerminal.reset()">Reset</button>
            </div>
            <div id="ft-output" class="free-terminal-output"></div>
            <div class="free-terminal-input-row">
              <span id="ft-prompt" class="free-terminal-prompt-text"></span>
              <input type="text" id="ft-input" class="free-terminal-input"
                autocomplete="off" spellcheck="false" placeholder="type a command...">
              <button class="free-run-btn" onclick="window._freeTerminal && window._freeTerminal.run(document.getElementById('ft-input').value); document.getElementById('ft-input').value=''">Run</button>
            </div>
          </div>
          <div id="challenge-complete" style="display:none" class="lesson-complete" style="padding:24px">
            <div class="complete-icon">🏆</div>
            <h2>Challenge Complete!</h2>
            <p>You've finished the course. Great work!</p>
            <a href="index.html" class="next-lesson-btn">Back to Dashboard</a>
          </div>
        </div>

      </div>

    </main>
  </div>

  <script src="js/app.js"></script>
  <script src="js/terminal.js"></script>
  <script>
    initLesson('lesson-05');

    const GOALS = [
      { type: 'dir-exists',  path: 'my-recipes',           label: 'Created my-recipes/ folder' },
      { type: 'dir-exists',  path: 'my-recipes/breakfast',  label: 'Created breakfast/ subfolder' },
      { type: 'dir-exists',  path: 'my-recipes/lunch',      label: 'Created lunch/ subfolder' },
      { type: 'dir-exists',  path: 'my-recipes/dinner',     label: 'Created dinner/ subfolder' },
      { type: 'file-exists', path: 'my-recipes/breakfast/*', label: 'Added a file in breakfast/' },
      { type: 'file-exists', path: 'my-recipes/lunch/*',    label: 'Added a file in lunch/' },
      { type: 'file-exists', path: 'my-recipes/dinner/*',   label: 'Added a file in dinner/' },
    ];

    new FreeTerminal(
      document.getElementById('ft-output'),
      document.getElementById('ft-input'),
      document.getElementById('ft-prompt'),
      GOALS,
      'lesson-05',
      () => { document.getElementById('challenge-complete').style.display = 'block'; }
    );
  </script>
</body>
</html>
```

- [ ] **Step 2: Open `docs/lesson-05.html`. Verify:**
  - Free terminal renders with a prompt matching the selected OS
  - `mkdir my-recipes` then `mkdir my-recipes/breakfast my-recipes/lunch my-recipes/dinner` ticks off checklist goals
  - `touch my-recipes/breakfast/favorite.txt` (Mac/Linux) or `type nul > my-recipes/breakfast/favorite.txt` (Windows) ticks the file goals
  - Completing all 7 goals shows the "Challenge Complete!" panel
  - "Reset" button clears the filesystem and output
  - Up arrow key cycles through command history

- [ ] **Step 3: Commit**

```bash
git add docs/lesson-05.html
git commit -m "feat: add lesson-05.html — Challenge with free terminal"
```

---

## Task 11: Update GitHub Pages Workflow + Cleanup

**Files:**
- Modify: `.github/workflows/pages.yml`
- Modify: `.gitignore`
- Delete: Jekyll source files

- [ ] **Step 1: Replace `.github/workflows/pages.yml`**

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 2: Add `.superpowers/` to `.gitignore`**

Open `.gitignore` and append:
```
.superpowers/
```

- [ ] **Step 3: Delete Jekyll source files**

```bash
git rm docs/_config.yml docs/404.md docs/index.md docs/assets/style.css
git rm -r docs/lessons docs/exercises docs/hints
```

- [ ] **Step 4: Commit everything**

```bash
git add .github/workflows/pages.yml .gitignore
git commit -m "feat: simplify Pages workflow to static HTML; remove Jekyll source files"
```

- [ ] **Step 5: Push to main and verify GitHub Actions runs successfully**

```bash
git push origin main
```

Go to the repo's Actions tab and confirm the "Deploy GitHub Pages" workflow completes without errors. Then open the GitHub Pages URL and verify:
- `index.html` loads with the OS selection overlay
- Navigating through lessons works
- Progress persists on page reload
- `tip-sheet.html` still loads

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|-----------------|-----------|
| OS selection overlay on first visit | Task 5 (index.html) + app.js `initIndex()` |
| OS cookie `cle_os`, 1-year expiry | Task 2 `setOS()` |
| `data-os` content filtering | Task 2 `applyOS()` |
| OS badge + "change" link in top bar | All lesson HTML files |
| Sidebar with ✓/▶/○ + progress bar | Task 2 `renderSidebar()` |
| Tip Sheet link in sidebar | Task 2 `renderSidebar()` |
| Reset progress link | Task 2 `resetProgress()` |
| Guided exercises (lessons 1-4) | Task 3 `GuidedTerminal` + Tasks 6-9 |
| Exercise card: prompt, input, Run, output, hint, skip, next | Task 3 `GuidedTerminal.render()` |
| Command eval: case-insensitive, normalized, flexible flags | Task 3 `normalize()` + `evaluate()` |
| Lesson completion → `localStorage` | Task 3 `_advance()` + Task 2 `setLessonProgress()` |
| Free terminal (lesson 5) | Task 4 `VirtualFS` + `FreeTerminal` |
| All course commands supported in VirtualFS | Task 4 `FreeTerminal._exec()` |
| Up-arrow history (last 50) | Task 4 `FreeTerminal._bindKeys()` |
| Reset terminal button | Task 10 `FreeTerminal.reset()` |
| Live checklist with glob matching | Task 4 `VirtualFS.checkGoals()` |
| Congratulations on lesson 5 complete | Task 10 `onComplete` callback |
| Remove Jekyll, plain HTML Pages | Task 11 |
| `tip-sheet.html` preserved | Not deleted in Task 11 |

**No gaps found.**
