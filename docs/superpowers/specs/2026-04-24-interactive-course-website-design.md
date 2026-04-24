# Interactive Course Website Design

**Date:** 2026-04-24  
**Project:** Command Line Essentials  
**Status:** Approved

---

## Overview

Replace the current Jekyll-based GitHub Pages site with a self-contained static website built from plain HTML, CSS, and JavaScript. The new site requires no build step, deploys directly on GitHub Pages, and provides an interactive learning experience: OS-aware content, an in-browser command simulator, and persistent progress tracking.

---

## Goals

- Students visit a URL and start learning immediately — no GitHub fork, no local setup required.
- All content adapts to the student's chosen OS (Windows, macOS, Ubuntu Linux).
- Students practice commands in an in-browser terminal simulator without leaving the page.
- Progress is saved across sessions without requiring accounts or a backend.

---

## Site Structure

```
docs/
├── index.html          ← OS selection screen + lesson dashboard
├── lesson-01.html      ← What Is the Terminal?
├── lesson-02.html      ← Navigating Folders
├── lesson-03.html      ← Files & Folders
├── lesson-04.html      ← GUI Bridge
├── lesson-05.html      ← Challenge (free terminal)
├── tip-sheet.html      ← Quick reference (already exists, keep as-is)
├── js/
│   ├── app.js          ← OS cookie, progress (localStorage), sidebar rendering
│   └── terminal.js     ← Virtual filesystem + command evaluator
└── css/
    └── style.css       ← Shared styles
```

**Removed:** `_config.yml`, `404.md`, `docs/lessons/*.md`, `docs/exercises/*.md`, `docs/hints/*.md`, `docs/assets/style.css`. The GitHub Pages Actions workflow is simplified to serve `docs/` as static files with no Jekyll build.

---

## Visual Design

- **Mode:** Light
- **Palette:** White background, `#1d4ed8` blue for primary actions and nav bar, `#eff6ff` for active/highlight states, `#f8fafc` for sidebar and card backgrounds
- **Typography:** System UI font stack for prose; monospace for terminal areas
- **Responsive:** Desktop-first; readable on tablet. Mobile is not a priority for this course.

---

## Page Layout

Every lesson page shares the same layout:

```
┌─────────────────────────────────────────────────────────┐
│  Top Bar: Course title · OS badge · "change" link        │
├──────────────┬──────────────────────────────────────────┤
│   Sidebar    │  Main Content                            │
│              │                                          │
│  Lesson list │  Lesson title + prose (OS-specific)      │
│  ✓ / ▶ / ○  │                                          │
│              │  Exercise card:                          │
│  Progress    │    - Prompt text                         │
│  bar         │    - Terminal input + Run button         │
│              │    - Pass/fail output                    │
│  Tip Sheet   │    - Hint / Skip / Next controls         │
│  link        │                                          │
│              │  Exercise dots (position indicator)      │
└──────────────┴──────────────────────────────────────────┘
```

### Top Bar
- Always visible. Blue background, white text.
- Shows the student's current OS in a white pill badge.
- A "change" link opens the OS selector overlay (same as first visit).

### Sidebar
- Lists all 5 lessons with state indicators: `✓` complete (green), `▶` current (blue, highlighted), `○` not yet reached (grey).
- Progress bar below the list shows lessons completed out of 5.
- Link to `tip-sheet.html` at the bottom.

### Main Content Area
- Lesson title and a short intro paragraph.
- OS-specific prose — instructions use the correct commands and paths for the student's platform.
- One exercise card visible at a time (not all at once).

---

## OS Selection

### First Visit
- `index.html` detects no OS cookie and shows a centered selection screen.
- Three large buttons: Windows (⊞), macOS (⌘), Ubuntu Linux (🐧).
- Each button shows the platform name and a short description (e.g. "PowerShell or CMD").
- On click, saves to cookie and redirects to the furthest lesson the student has reached: the first lesson whose status is `"in-progress"`, or `lesson-01.html` if no progress exists yet.

### Returning Visit
- Cookie is read on every page load. Content renders for the saved OS immediately.
- "Change" link in the top bar shows the same three-button overlay without redirecting.
- Cookie name: `cle_os`. Values: `windows`, `macos`, `linux`. Expires: 1 year.

### OS-Specific Content
Each lesson page contains content for all three platforms, rendered via `data-os` attributes. `app.js` hides all content that doesn't match the saved OS on page load and on OS change.

```html
<p data-os="windows">Type <code>cd</code> to see your current location.</p>
<p data-os="macos linux">Type <code>pwd</code> to see your current location.</p>
```

---

## Guided Exercises (Lessons 1–4)

Each lesson has 3–5 exercises. One exercise is visible at a time; completing it reveals the next.

### Exercise Card Structure
- **Prompt:** A plain-English task description (OS-specific where needed).
- **Terminal input:** A single-line text field styled as a terminal prompt. The prompt prefix adapts to OS (`C:\Users\student>` / `user@mac:~$` / `user@ubuntu:~$`).
- **Run button:** Evaluates the typed command.
- **Output area:** Shows the simulated command output on success, or an error message on failure.
- **Controls:** "💡 Show hint" (reveals a hint string), "Skip" (marks exercise done without credit), "Next exercise →" (appears after passing).

### Command Evaluation
Commands are evaluated by `terminal.js`. Each exercise defines:
- `expected`: one or more acceptable command strings (e.g. `["pwd"]` or `["cd", "cd ."]` for Windows).
- `output`: the string to display on success (e.g. `"/home/student"`).
- `hint`: a plain-English hint string.

Evaluation is case-insensitive and trims leading/trailing whitespace. Extra spaces between tokens are normalized. Arguments can be flexible (e.g. `ls -la` and `ls -al` both pass for a "list with details" exercise).

### Progress
Completing all exercises in a lesson marks it complete in `localStorage`. Key: `cle_progress`. Value: a JSON object `{ "lesson-01": "complete" | "in-progress" | null, ... }`. A lesson is set to `"in-progress"` when first opened and `"complete"` when all exercises are passed or skipped.

---

## Free Terminal — Challenge Lesson (Lesson 5)

### Layout
Same sidebar + top bar as other lessons, but the main area has two panels:
- **Left:** Task description + live checklist of goals.
- **Right (or below on narrow screens):** Free terminal with command history.

### Terminal Behavior
- Maintains a virtual filesystem state: current directory, list of files and folders that exist.
- Supports all commands taught in the course: `echo`, `whoami`, `cls`/`clear`, `pwd`/`cd`, `ls`/`dir`, `mkdir`, `touch`/`type nul >`, `cp`, `mv`, `rm`, `rmdir`, `cat`, `echo > file`, `ls -R`, `explorer .`/`open .`/`xdg-open .`.
- Unsupported commands return: `Command not found. Try one of the commands from the course.`
- Up arrow cycles through command history (last 50 commands).
- The filesystem resets to a clean home directory if the student clicks "Reset terminal".

### Checklist Evaluation
The challenge defines a set of filesystem goals:
```js
{ type: "dir-exists", path: "my-recipes/breakfast" }
{ type: "dir-exists", path: "my-recipes/dinner" }
{ type: "file-exists", path: "my-recipes/breakfast/*.txt" }
{ type: "file-exists", path: "my-recipes/dinner/*.txt" }
```
After each command runs, `terminal.js` checks all unmet goals against the current filesystem state and ticks them off the checklist in real time. When all goals are met, the lesson is marked complete and a congratulations message appears.

---

## Progress Tracking

- Stored in `localStorage` under key `cle_progress`.
- Schema: `{ "lesson-01": "complete" | "in-progress" | null, ... }`
- A lesson becomes `"in-progress"` when the student opens it for the first time.
- A lesson becomes `"complete"` when all its exercises are passed (or skipped).
- The sidebar reads this on every page load and renders states accordingly.
- A "Reset my progress" link in the sidebar footer clears `cle_progress` after a confirmation prompt.

---

## GitHub Pages Deployment

- The existing `pages.yml` workflow is updated: remove the Jekyll build step, just upload `docs/` as a static artifact.
- No `_config.yml` needed. GitHub Pages serves plain HTML files directly.
- `tip-sheet.html` continues to work at the same URL path.

---

## What Is Not In Scope

- User accounts or server-side progress storage.
- Mobile-optimized layout.
- Badge/certificate issuance (the existing GitHub Actions workflow for this is unchanged).
- Syntax highlighting beyond basic monospace styling.
- Accessibility audit (ARIA roles are added where obvious, but a full audit is out of scope).
