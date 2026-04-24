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
  try {
    const v = JSON.parse(localStorage.getItem('cle_progress'));
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
  } catch { return {}; }
}

function setLessonProgress(lessonId, status) {
  const p = getProgress();
  if (p[lessonId] === 'complete' && status === 'in-progress') return; // never downgrade
  p[lessonId] = status;
  localStorage.setItem('cle_progress', JSON.stringify(p));
}

function getFurthestLesson() {
  const p = getProgress();
  for (let i = LESSONS.length - 1; i >= 0; i--) {
    const s = p[LESSONS[i].id];
    if (s === 'complete' || s === 'in-progress') {
      return LESSONS[Math.min(i + (s === 'complete' ? 1 : 0), LESSONS.length - 1)].href;
    }
  }
  return LESSONS[0].href;
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
    if (lessonId) {
      renderSidebar(lessonId);
    } else {
      renderSidebar(null);
      renderDashboard();
    }
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
    const safeCls = (status === 'complete' || status === 'in-progress') ? status : '';
    const cls = ['lesson-card', safeCls].filter(Boolean).join(' ');
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
