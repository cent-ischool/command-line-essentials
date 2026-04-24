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
    this._advancing = false;
    window._terminal = this;
    this.render();
  }

  get exercise() { return this.exercises[this.current]; }

  get os() { return getOS(); }

  get prompt() {
    return { windows: 'C:\\Users\\student>', macos: 'user@mac:~$', linux: 'user@ubuntu:~$' }[this.os];
  }

  _esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  normalize(cmd) {
    return cmd.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  evaluate(input) {
    const os = this.os;
    const expected = this.exercise.expected[os] || this.exercise.expected.all || [];
    const n = this.normalize(input);
    if (expected.map(e => this.normalize(e)).includes(n)) return true;
    if (this.exercise.matchPrefix) {
      return expected.some(e => n.startsWith(this.normalize(e)));
    }
    return false;
  }

  render() {
    this._advancing = false;
    const os = this.os;
    if (!os) return;

    const ex = this.exercise;
    const total = this.exercises.length;
    const idx = this.current;

    const dots = this.exercises.map((_, i) =>
      `<span class="ex-dot ${i < idx ? 'done' : i === idx ? 'active' : ''}"></span>`
    ).join('');

    const promptText = ex.prompt[os] || ex.prompt.all || '';

    this.el.innerHTML = `
      <div class="exercise-section-label">Practice</div>
      <div class="exercise-card">
        <div class="exercise-header">
          <span class="exercise-label">Exercise ${idx + 1} of ${total}</span>
        </div>
        <p class="exercise-prompt">${this._esc(promptText)}</p>
        <div class="terminal-input-row">
          <span class="terminal-prompt">${this._esc(this.prompt)}</span>
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
        <div id="hint-text" class="hint-text" style="display:none">${this._esc(ex.hint)}</div>
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
      const outHtml = out ? `<div class="output-text">${this._esc(out)}</div>` : '';
      outputEl.innerHTML = `<div class="output-status">✓ Correct!</div>${outHtml}`;
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
    if (this._advancing) return;
    this._advancing = true;
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
    if (!p.startsWith('/') && !(this.os === 'windows' && /^[A-Za-z]:\//.test(p))) p = this.cwd + '/' + p;
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
    if (this.cwd === sp || this.cwd.startsWith(sp + '/')) this.cwd = dp + this.cwd.slice(sp.length);
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
    this._completed = false;
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
    // Handle echo "text" > file
    if (/^echo\s+.*>\s*\S+/.test(raw)) {
      const m = raw.match(/^echo\s+(.*?)\s*>\s*(\S+)$/);
      if (m) {
        const text = m[1].replace(/^["']|["']$/g, '');
        const err = this.fs.echo(text, m[2]);
        return { out: '', err };
      }
    }
    // Handle type nul > file (Windows)
    if (/^type\s+nul\s*>\s*\S+/i.test(raw)) {
      const m = raw.match(/^type\s+nul\s*>\s*(\S+)/i);
      if (m) { const err = this.fs.echo('', m[1]); return { out: '', err }; }
    }

    const parts = raw.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    const verb = parts[0].toLowerCase();
    const args = parts.slice(1).map(a => a.replace(/^["']|["']$/g, ''));

    switch (verb) {
      case 'echo': return { out: args.join(' '), err: '' };
      case 'whoami': return { out: this.fs.whoami(), err: '' };
      case 'cls':
      case 'clear': this.outputEl.innerHTML = ''; return { out: '', err: '' };
      case 'pwd': return { out: this.fs.pwd(), err: '' };
      case 'cd': {
        if (!args[0]) return { out: this.fs.pwd(), err: '' };
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

    if (allDone && !this._completed) {
      this._completed = true;
      setLessonProgress(this.lessonId, 'complete');
      renderSidebar(this.lessonId);
      if (this.onComplete) this.onComplete();
    }
  }

  reset() {
    this.fs.reset();
    this._completed = false;
    this.outputEl.innerHTML = '';
    this.goals.forEach((_, i) => {
      const item = document.getElementById(`goal-${i}`);
      if (item) item.classList.remove('done');
    });
    this.updatePrompt();
  }
}
