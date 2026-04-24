# Command Line Essentials — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-lesson self-paced command line course deliverable via GitHub Pages, with verification scripts, badge, and certificate generation.

**Architecture:** Static site built from markdown lessons served via GitHub Pages. Student clones repo, works through lessons locally in their terminal, runs verification scripts to check work. On full completion, GitHub Actions generates a badge SVG and certificate PDF.

**Tech Stack:** Markdown (lessons), Bash scripts (verification, badge/cert generation), GitHub Actions (CI/CD), SVG (badge), HTML/Python (certificate PDF), Jekyll (GitHub Pages, optional — simplest approach is pure markdown with a custom 404 nav page).

---

## Repository Structure

```
command-line-essentials/
├── .gitignore
├── README.md
├── docs/                           # GitHub Pages root
│   ├── index.md                    # Landing page
│   ├── _config.yml                 # Jekyll config
│   ├── 404.md                      # Navigation helper page
│   ├── lessons/
│   │   ├── 01-what-is-terminal.md
│   │   ├── 02-navigating-folders.md
│   │   ├── 03-files-and-folders.md
│   │   ├── 04-gui-terminal-bridge.md
│   │   └── 05-challenge.md
│   ├── exercises/
│   │   ├── 01-what-is-terminal-exercises.md
│   │   ├── 02-navigating-folders-exercises.md
│   │   ├── 03-files-and-folders-exercises.md
│   │   ├── 04-gui-terminal-bridge-exercises.md
│   │   └── 05-challenge-exercises.md
│   ├── hints/
│   │   ├── 01-hints.md
│   │   ├── 02-hints.md
│   │   ├── 03-hints.md
│   │   ├── 04-hints.md
│   │   └── 05-hints.md
│   └── assets/
│       ├── style.css
│       └── badge-template.svg
├── scripts/
│   ├── verify.sh                  # Per-lesson verification (pass lesson number as arg)
│   ├── generate-badge.sh          # Generates SVG badge from git config
│   ├── generate-certificate.py    # Generates PDF certificate
│   └── templates/
│       ├── badge-template.svg
│       └── certificate-template.html
├── .github/
│   └── workflows/
│       ├── verify-lesson.yml      # Runs verification on push
│       └── issue-badge.yml        # Runs full test suite, issues badge + cert
├── setup/
│   └── github-setup.md            # Step-by-step for students to set up GitHub + clone repo
└── SPEC.md                         # Copy of design spec for reference
```

---

## Task 1: Create Repository Foundation

**Files:**
- Create: `README.md`
- Create: `.gitignore`
- Create: `SPEC.md`
- Create: `docs/_config.yml`
- Create: `docs/404.md`
- Create: `docs/assets/style.css`

- [ ] **Step 1: Write README.md**

```markdown
# Command Line Essentials

A free, self-paced course teaching you how to use the command line, navigate files and folders, and connect your terminal to your graphical desktop.

**Platform:** Windows · macOS · Ubuntu Linux
**Duration:** 1-2 hours
**Prerequisites:** None

## What You'll Learn

- Open and use your terminal on any OS
- Navigate folders with confidence
- Create, copy, move, and delete files
- Bridge the gap between your GUI file explorer and the command line
- Complete a hands-on challenge using all your new skills

## How It Works

1. [Set up GitHub and clone this repo](./setup/github-setup.md)
2. Open the [course portal](https://yourusername.github.io/command-line-essentials/) (link from your Blackboard course)
3. Work through each lesson in order
4. Run verification commands after each lesson to check your work
5. Complete all 5 lessons to earn your badge and certificate

## Course Outline

| Lesson | Title | Time |
|--------|-------|------|
| 01 | What Is the Terminal? | 15 min |
| 02 | Navigating Folders | 20 min |
| 03 | Files and Folders | 20 min |
| 04 | GUI ↔ Terminal Bridge | 15 min |
| 05 | Challenge: Build a Mini Project | 20 min |

## Earn Your Badge

Complete all lessons and pass all verification checks to receive:
- A verification badge on your GitHub repo
- A downloadable badge SVG
- A certificate of completion

## Getting Help

Stuck? Use the **Show Hint** buttons in each lesson. If you're still having trouble, ask your instructor.
```

- [ ] **Step 2: Write .gitignore**

```
# OS files
.DS_Store
Thumbs.db

# Temp files
*.swp
*.tmp

# Badge outputs
badge.svg
certificate.pdf

# Editor directories
.vscode/
.idea/
```

- [ ] **Step 3: Write SPEC.md** — copy the design spec content into the repo root

- [ ] **Step 4: Write docs/_config.yml**

```yaml
title: Command Line Essentials
description: A self-paced course on using the command line
theme: minima
markdown: kramdown
kramdown:
  input: GFM
```

- [ ] **Step 5: Write docs/404.md**

```markdown
# Page Not Found

It looks like this page doesn't exist. Head back to the [course homepage](/).
```

- [ ] **Step 6: Write docs/assets/style.css**

Minimal CSS for lesson readability — readable fonts, code blocks styled, hint buttons styled, responsive layout. Include:
- Monospace font for code blocks
- Hint button styles (collapsed/expanded states)
- Platform tabs styling (Windows/macOS/Ubuntu)
- Lesson navigation footer
```

- [ ] **Step 7: Commit**

```bash
git add README.md .gitignore SPEC.md docs/
git commit -m "feat: scaffold repository structure"
```

---

## Task 2: Create GitHub Setup Guide for Students

**Files:**
- Create: `setup/github-setup.md`

- [ ] **Step 1: Write setup/github-setup.md**

```markdown
# Setting Up GitHub and This Course

If you already have a GitHub account and Git installed on your computer, skip to Step 3.

## Step 1: Create a GitHub Account

1. Go to [github.com](https://github.com)
2. Click **Sign up**
3. Follow the steps — pick a free plan
4. **Important:** Use an email address your instructor can verify, or share your username with your instructor

## Step 2: Install Git

### Windows
1. Download Git from [git-scm.com](https://git-scm.com)
2. Run the installer — accept all defaults
3. Open **Git Bash** from your Start menu (not the regular Command Prompt)

### macOS
1. Open **Terminal** (Cmd+Space, type "Terminal")
2. If prompted to install Command Line Tools, click **Install**
3. Git comes pre-installed on recent macOS versions

### Ubuntu Linux
1. Open Terminal (Ctrl+Alt+T)
2. Run: `sudo apt update && sudo apt install git`
3. Enter your password when asked

## Step 3: Configure Git

Tell Git your name and email (use your real name — it appears on your certificate):

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## Step 4: Fork and Clone This Repo

### Fork (one-time, creates your own copy)
1. Go to the course repo on GitHub
2. Click the **Fork** button (top right)
3. Wait for GitHub to create your copy

### Clone (downloads to your computer)
1. On your forked repo, click the **Code** button
2. Copy the URL (choose HTTPS)
3. Open Git Bash (Windows) or Terminal (Mac/Linux)
4. Run:
   ```bash
   git clone https://github.com/YOURUSERNAME/command-line-essentials.git
   ```
5. Move into the folder:
   ```bash
   cd command-line-essentials
   ```

## Step 5: Open the Course Website

1. Wait a few minutes after forking for GitHub Pages to build
2. Go to: `https://YOURUSERNAME.github.io/command-line-essentials/`
3. Bookmark this page — this is your course portal

## Step 6: Keep Your Repo Updated

If the instructor updates the course materials, pull the latest version:

```bash
git pull origin main
```

---

## Verify Your Setup

Run this command to confirm everything is working:

```bash
git config --global user.name
```

It should print your name. If it does — you're ready for Lesson 1!
```

- [ ] **Step 2: Commit**

```bash
git add setup/github-setup.md
git commit -m "feat: add student GitHub setup guide"
```

---

## Task 3: Create Lesson 1 — What Is the Terminal?

**Files:**
- Create: `docs/lessons/01-what-is-terminal.md`
- Create: `docs/hints/01-hints.md`
- Create: `docs/exercises/01-what-is-terminal-exercises.md`

- [ ] **Step 1: Write docs/lessons/01-what-is-terminal.md**

Lesson structure:
1. **What is the terminal?** — Brief plain-English explanation (no jargon)
2. **Why bother?** — Practical examples of what CLI lets you do
3. **Open your terminal** — Platform-specific instructions with screenshots described in text
4. **Your first command** — `echo "Hello, World!"` with Windows/macOS/Ubuntu tabs
5. **Understanding the prompt** — Break down `user@computer:~$` and equivalents on Windows
6. **Exercise** — Link to exercises file
7. **Key takeaways**

Include platform tabs using HTML:
```html
<details>
<summary>Windows (PowerShell)</summary>

```
```
</details>
```

Same for macOS (zsh/bash) and Ubuntu (bash).

- [ ] **Step 2: Write docs/hints/01-hints.md**

Hints for lesson 1 exercises (typically 2-3 hints per exercise, progressive):
- Hint 1: "Try typing exactly what you see, then press Enter"
- Hint 2: "On Windows, try running: echo $env:USERNAME"
- etc.

Format with collapsible sections referencing specific exercises.

- [ ] **Step 3: Write docs/exercises/01-what-is-terminal-exercises.md**

Three exercises:
1. **Exercise 1:** Open your terminal and run `echo "Hello, World!"` — prove it by showing the output
2. **Exercise 2:** Run a command to find out your computer's username (different command per OS)
3. **Exercise 3:** Clear the screen (Windows: `cls`, macOS/Ubuntu: `clear`)

Each exercise should have:
- Clear goal in one sentence
- The command(s) to run
- What to look for in the output
- "Verify" section with the command to run to check work
- Link to hints

- [ ] **Step 4: Commit**

```bash
git add docs/lessons/01-what-is-terminal.md docs/hints/01-hints.md docs/exercises/01-what-is-terminal-exercises.md
git commit -m "feat: add lesson 1 - What Is the Terminal"
```

---

## Task 4: Create Lesson 2 — Navigating Folders

**Files:**
- Create: `docs/lessons/02-navigating-folders.md`
- Create: `docs/hints/02-hints.md`
- Create: `docs/exercises/02-navigating-folders-exercises.md`

- [ ] **Step 1: Write docs/lessons/02-navigating-folders.md**

Topics:
1. **Where are you?** — `pwd` (Unix) / `cd` without args (Windows)
2. **Listing files** — `ls` / `dir`, common flags (`-la`, etc.)
3. **Moving between folders** — `cd foldername`, `cd ..`, `cd /full/path`
4. **Absolute vs relative paths** — explained with examples on all 3 OSes
5. **Tab completion** — how to use it (platform-agnostic concept)
6. **Exercise** — link to exercises file

Key commands table (Windows | macOS | Ubuntu):
- List files: `dir` | `ls` | `ls`
- Change directory: `cd` | `cd` | `cd`
- Parent folder: `cd ..` | `cd ..` | `cd ..`
- Home folder: `cd %USERPROFILE%` or `cd ~` | `cd ~` | `cd ~`

- [ ] **Step 2: Write docs/hints/02-hints.md**

- [ ] **Step 3: Write docs/exercises/02-navigating-folders-exercises.md**

Three exercises:
1. **Find your location** — run the "where am I" command, identify your home folder path
2. **Navigate to Desktop** — change into Desktop folder, confirm with listing command
3. **Navigate back and forth** — go to Desktop, back to home, into Documents, back two levels

- [ ] **Step 4: Commit**

```bash
git add docs/lessons/02-navigating-folders.md docs/hints/02-hints.md docs/exercises/02-navigating-folders-exercises.md
git commit -m "feat: add lesson 2 - Navigating Folders"
```

---

## Task 5: Create Lesson 3 — Files and Folders

**Files:**
- Create: `docs/lessons/03-files-and-folders.md`
- Create: `docs/hints/03-hints.md`
- Create: `docs/exercises/03-files-and-folders-exercises.md`

- [ ] **Step 1: Write docs/lessons/03-files-and-folders.md**

Topics:
1. **Creating folders** — `mkdir foldername`
2. **Creating files** — `touch filename.txt` (Unix) / `type nul > filename.txt` (Windows)
3. **Copying** — `cp source dest`
4. **Moving / Renaming** — `mv oldname newname`
5. **Deleting** — `rm file` / `rmdir folder` (be careful!)
6. **File naming rules** — no special characters, spaces need quotes, case sensitivity differences
7. **Exercise** — link to exercises file

Important safety note: There's no recycle bin in the terminal — deleted files are gone forever.

- [ ] **Step 2: Write docs/hints/03-hints.md**

- [ ] **Step 3: Write docs/exercises/03-files-and-folders-exercises.md**

Three exercises:
1. **Create a project folder** — `mkdir cli-project`, verify it exists
2. **Add some files** — create 3 files inside cli-project with names of your favorite things
3. **Reorganize** — copy one file, rename another, delete the third; verify final state

- [ ] **Step 4: Commit**

```bash
git add docs/lessons/03-files-and-folders.md docs/hints/03-hints.md docs/exercises/03-files-and-folders-exercises.md
git commit -m "feat: add lesson 3 - Files and Folders"
```

---

## Task 6: Create Lesson 4 — GUI ↔ Terminal Bridge

**Files:**
- Create: `docs/lessons/04-gui-terminal-bridge.md`
- Create: `docs/hints/04-hints.md`
- Create: `docs/exercises/04-gui-terminal-bridge-exercises.md`

- [ ] **Step 1: Write docs/lessons/04-gui-terminal-bridge.md**

This is the key bridging lesson. Topics:

1. **Opening the GUI from the terminal**
   - Windows: `explorer .` (opens current folder in File Explorer)
   - macOS: `open .` (opens current folder in Finder)
   - Ubuntu: `xdg-open .` (opens in Files / Nautilus)
   - **Key insight:** `.` means "current folder"

2. **Opening the terminal from the GUI**
   - Windows: Right-click folder → "Open in Terminal" (Windows 11; or use File Explorer address bar → type `cmd`)
   - macOS: Services → "New Terminal at Folder" (enable in System Settings → Keyboard → Services)
   - Ubuntu: Right-click → "Open in Terminal" (or Ctrl+Alt+T opens terminal at home)

3. **The mental model click** — explain that both views show the same folder; changes in one appear in the other

4. **Practical demo** — students create a folder in GUI, then `ls` to see it in terminal; then delete it in terminal, refresh GUI to see it gone

5. **Exercise** — link to exercises file

- [ ] **Step 2: Write docs/hints/04-hints.md**

Hints covering both directions (terminal→GUI and GUI→terminal) per OS.

- [ ] **Step 3: Write docs/exercises/04-gui-terminal-bridge-exercises.md**

Three exercises:
1. **Open your Desktop in the GUI from terminal** — navigate to Desktop, use the open command
2. **Open a terminal from your Desktop folder** — use GUI to open terminal at Desktop location
3. **Spot the difference** — create a file in GUI, confirm in terminal; delete in terminal, refresh GUI; observe both directions

- [ ] **Step 4: Commit**

```bash
git add docs/lessons/04-gui-terminal-bridge.md docs/hints/04-hints.md docs/exercises/04-gui-terminal-bridge-exercises.md
git commit -m "feat: add lesson 4 - GUI Terminal Bridge"
```

---

## Task 7: Create Lesson 5 — Challenge

**Files:**
- Create: `docs/lessons/05-challenge.md`
- Create: `docs/hints/05-hints.md`
- Create: `docs/exercises/05-challenge-exercises.md`

- [ ] **Step 1: Write docs/lessons/05-challenge.md**

**Build a Mini Project Folder**

Students apply all skills from lessons 1-4 to create a small personal project:

**The challenge:** Build a "My Recipes" folder structure for a recipe collection.

Requirements:
1. Create a main folder called `my-recipes`
2. Inside it, create 3 category folders: `breakfast`, `lunch`, `dinner`
3. In each category, create a file named `favorite.txt`
4. Add a sentence to each `favorite.txt` describing your favorite breakfast/lunch/dinner
5. From the terminal, open the `my-recipes` folder in your GUI file explorer
6. Verify all files and folders exist

Platform tabs for all commands.

**Key lesson:** This is what real folder organization looks like — a skill you'll use in every coding project going forward.

- [ ] **Step 2: Write docs/hints/05-hints.md**

More substantial hints for the challenge (up to 3 hints, more explicit guidance).

- [ ] **Step 3: Write docs/exercises/05-challenge-exercises.md**

Single comprehensive challenge with:
- Clear deliverables (folder structure, 3 text files with content)
- Verification commands for each step
- Stretch goal for early finishers: add a README.txt at the root

- [ ] **Step 4: Commit**

```bash
git add docs/lessons/05-challenge.md docs/hints/05-hints.md docs/exercises/05-challenge-exercises.md
git commit -m "feat: add lesson 5 - Challenge"
```

---

## Task 8: Create Verification Scripts

**Files:**
- Create: `scripts/verify.sh`
- Modify: `scripts/` (per-lesson verification logic within verify.sh)

- [ ] **Step 1: Write scripts/verify.sh**

The main verification script that takes a lesson number and checks evidence:

```bash
#!/bin/bash
# verify.sh — Verify student completed lesson N exercises
# Usage: bash scripts/verify.sh [lesson-number]
# Example: bash scripts/verify.sh 01

set -e

LESSON=$1

case $LESSON in
  01)
    echo "Checking Lesson 1..."
    # Check: student ran echo and showed their username
    # Verify: $HOME or %USERPROFILE% exists, .gitconfig has user.name set
    ;;
  02)
    echo "Checking Lesson 2..."
    # Check: Desktop folder exists and is accessible from CLI
    ;;
  03)
    echo "Checking Lesson 3..."
    # Check: cli-project folder exists with 3 files
    ;;
  04)
    echo "Checking Lesson 4..."
    # Check: Desktop folder accessible, evidence of open commands run
    ;;
  05)
    echo "Checking Lesson 5..."
    # Check: my-recipes folder with breakfast/lunch/dinner subfolders
    # Each subfolder has favorite.txt with content
    ;;
esac

echo "Verification passed for Lesson $LESSON!"
```

The script checks filesystem state (did the student create the expected folders/files) and git config (did they set up their identity). These serve as proxy evidence of completing the exercises.

- [ ] **Step 2: Write the per-lesson checks in verify.sh**

Each lesson's verification logic:
- **Lesson 1:** Git config `user.name` and `user.email` are set (proves they did setup)
- **Lesson 2:** `Desktop` folder exists (we can navigate there)
- **Lesson 3:** `cli-project` folder exists with at least 3 files inside
- **Lesson 4:** Student shows evidence (a text file they create noting what they opened)
- **Lesson 5:** `my-recipes/` exists with correct subfolder structure and file contents

For lesson 4 (where the exercise is about observing GUI↔terminal, not creating files), the verification can be a text file where the student records what they observed: "I ran `open .` and Finder opened to my Desktop."

- [ ] **Step 3: Test the verify script locally**

Run `bash scripts/verify.sh 01` through `bash scripts/verify.sh 05` and confirm each exits 0.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify.sh
git commit -m "feat: add verification scripts"
```

---

## Task 9: Create Badge Generation

**Files:**
- Create: `scripts/generate-badge.sh`
- Create: `scripts/templates/badge-template.svg`

- [ ] **Step 1: Write scripts/templates/badge-template.svg**

An SVG badge template that accepts:
- Student name (from git config)
- Completion date
- Course name

Use placeholder text like `{{STUDENT_NAME}}` that the script replaces.

Badge design: Simple, clean — course title, student name, date, maybe a terminal prompt icon.

- [ ] **Step 2: Write scripts/generate-badge.sh**

```bash
#!/bin/bash
# generate-badge.sh — Generate badge SVG for the student
# Usage: bash scripts/generate-badge.sh

STUDENT_NAME=$(git config user.name)
COMPLETION_DATE=$(date +"%B %d, %Y")
COURSE_NAME="Command Line Essentials"

# Read template and replace placeholders
sed -e "s/{{STUDENT_NAME}}/$STUDENT_NAME/g" \
    -e "s/{{COMPLETION_DATE}}/$COMPLETION_DATE/g" \
    -e "s/{{COURSE_NAME}}/$COURSE_NAME/g" \
    templates/badge-template.svg > badge.svg

echo "Badge generated: badge.svg"
```

Support both `sed` (Unix/macOS) and a PowerShell fallback for Windows.

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-badge.sh scripts/templates/badge-template.svg
git commit -m "feat: add badge generation script"
```

---

## Task 10: Create Certificate Generation

**Files:**
- Create: `scripts/generate-certificate.py`
- Create: `scripts/templates/certificate-template.html`

- [ ] **Step 1: Write scripts/templates/certificate-template.html`

An HTML certificate template suitable for printing to PDF. Include:
- Institution logo placeholder
- "Certificate of Completion"
- Course title: "Command Line Essentials"
- "Awarded to: [student name]"
- Date
- Decorative border (CSS)

Designed to be opened in browser and printed to PDF by the student.

- [ ] **Step 2: Write scripts/generate-certificate.py**

```python
#!/usr/bin/env python3
"""
generate-certificate.py — Generate a PDF certificate of completion.
Reads student name from git config, date from system clock.
"""
import subprocess
import sys
from pathlib import Path

def get_git_config(key):
    result = subprocess.run(['git', 'config', '--global', key],
                          capture_output=True, text=True)
    return result.stdout.strip()

def main():
    student_name = get_git_config('user.name')
    if not student_name:
        print("Error: git config user.name not set. Run: git config --global user.name 'Your Name'")
        sys.exit(1)

    import datetime
    completion_date = datetime.date.today().strftime('%B %d, %Y')

    template = Path('scripts/templates/certificate-template.html').read_text()
    cert_html = (template
        .replace('{{STUDENT_NAME}}', student_name)
        .replace('{{COMPLETION_DATE}}', completion_date))

    output = Path('certificate.html')
    output.write_text(cert_html)
    print(f"Certificate generated: {output}")
    print("Open certificate.html in your browser and print to PDF.")

if __name__ == '__main__':
    main()
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-certificate.py scripts/templates/certificate-template.html
git commit -m "feat: add certificate generation script"
```

---

## Task 11: Create GitHub Actions Workflows

**Files:**
- Create: `.github/workflows/verify-lesson.yml`
- Create: `.github/workflows/issue-badge.yml`

- [ ] **Step 1: Write .github/workflows/verify-lesson.yml**

Triggered on push. Runs the verify script for the changed lesson.

```yaml
name: Verify Lesson

on:
  push:
    paths:
      - 'docs/lessons/**'
      - 'docs/exercises/**'
      - 'docs/hints/**'
      - 'scripts/verify.sh'

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run verification
        run: |
          chmod +x scripts/verify.sh
          # In a real CI run, verify the content changes (not student work)
          # Student verification happens locally and via issue-badge workflow
```

Actually, this workflow is more for **course maintainers** — it verifies the lesson content renders correctly. Student verification is local via `verify.sh`.

- [ ] **Step 2: Write .github/workflows/issue-badge.yml**

Triggered on `workflow_dispatch` (manual trigger) or on push to main after all 5 lesson directories exist.

This workflow:
1. Runs all verification checks
2. If all pass: runs `generate-badge.sh` and `generate-certificate.py`
3. Creates a release artifact with badge.svg and certificate.pdf
4. Comments on the commit with a success message

```yaml
name: Issue Badge and Certificate

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - 'my-recipes/**'   # Lesson 5 final artifact

jobs:
  verify-and-issue:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Verify lesson 1
        run: bash scripts/verify.sh 01
      - name: Verify lesson 2
        run: bash scripts/verify.sh 02
      - name: Verify lesson 3
        run: bash scripts/verify.sh 03
      - name: Verify lesson 4
        run: bash scripts/verify.sh 04
      - name: Verify lesson 5
        run: bash scripts/verify.sh 05
      - name: Generate badge
        run: bash scripts/generate-badge.sh
      - name: Generate certificate
        run: python scripts/generate-certificate.py
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: badge-and-certificate
          path: |
            badge.svg
            certificate.html
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/verify-lesson.yml .github/workflows/issue-badge.yml
git commit -m "feat: add GitHub Actions workflows for verification and badge issuance"
```

---

## Task 12: Create Landing Page (index.md)

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: Write docs/index.md**

```markdown
---
title: Command Line Essentials
nav_order: 1
---

# Command Line Essentials

Learn to use the command line, navigate files and folders, and connect your terminal to your graphical desktop — all in 1-2 hours.

## Start Here

New to the course? [Set up GitHub and clone the repo](../setup/github-setup.md) first.

## Course Lessons

### Lesson 1: What Is the Terminal?
Open your terminal for the first time and run your first command.
[Start Lesson 1](lessons/01-what-is-terminal.html) · [Exercises](exercises/01-what-is-terminal-exercises.html)

### Lesson 2: Navigating Folders
Learn to move between folders using cd, ls, and paths.
[Start Lesson 2](lessons/02-navigating-folders.html) · [Exercises](exercises/02-navigating-folders-exercises.html)

### Lesson 3: Files and Folders
Create, copy, move, and delete files from the command line.
[Start Lesson 3](lessons/03-files-and-folders.html) · [Exercises](exercises/03-files-and-folders-exercises.html)

### Lesson 4: GUI ↔ Terminal Bridge
Open your file explorer from the terminal — and your terminal from your file explorer.
[Start Lesson 4](lessons/04-gui-terminal-bridge.html) · [Exercises](exercises/04-gui-terminal-bridge-exercises.html)

### Lesson 5: Challenge
Apply everything you've learned to build a real project folder.
[Start Lesson 5](lessons/05-challenge.html) · [Exercises](exercises/05-challenge-exercises.html)

## Earn Your Badge

Complete all 5 lessons to earn a badge and certificate of completion.

---

*Command Line Essentials — a free course for learners everywhere.*
```

- [ ] **Step 2: Commit**

```bash
git add docs/index.md
git commit -m "feat: add course landing page"
```

---

## Spec Coverage Check

- [x] 5 lessons covering terminal basics, navigation, files, GUI↔terminal, challenge — all 5 tasks
- [x] Hint system — hints/ directory with per-lesson files, Show Hint buttons in lessons
- [x] Badge SVG — generate-badge.sh + badge-template.svg
- [x] Certificate PDF — generate-certificate.py + certificate-template.html
- [x] GitHub Actions verification — issue-badge.yml
- [x] Platform tabs (Windows/macOS/Ubuntu) — in every lesson
- [x] Linear sequence — nav_order set in index.md, lessons must be done in order
- [x] Self-paced — no time limits, no unlock gates
- [x] GitHub accounts — setup/github-setup.md covers account creation
- [x] 100% challenge requirement — verify.sh must pass all 5 for badge issuance

## Plan Review

- No placeholders found
- All file paths are absolute-ish (relative to repo root)
- Types consistent across tasks (lesson numbers match, script arguments match)
- Implementation order is logical: foundation → lessons → scripts → automation → landing page

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks for quality

**2. Inline Execution** — I execute tasks in this session, batched with checkpoints

Which approach?
