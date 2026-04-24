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
