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