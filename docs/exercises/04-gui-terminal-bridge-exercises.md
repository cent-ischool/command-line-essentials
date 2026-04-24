# Exercise 4: GUI ↔ Terminal Bridge

Practice bridging your terminal and GUI — in both directions.

---

## Exercise 1: Open Your Desktop in the GUI from Terminal

**Goal:** Use the terminal to open your Desktop folder in the file manager.

**Steps:**

1. Make sure your terminal is at your home directory (not on Desktop)
2. Run the command to open your Desktop folder in the GUI

**Commands:**

<details>
<summary>Windows</summary>

```powershell
explorer %USERPROFILE%\Desktop
```

Or if that doesn't work, replace `%USERPROFILE%` with your actual username path:

```powershell
explorer C:\Users\YourName\Desktop
```

</details>
<details>
<summary>macOS</summary>

```bash
open ~/Desktop
```

</details>
<details>
<summary>Ubuntu</summary>

```bash
xdg-open ~/Desktop
```

</details>

**Expected output:**
Your file manager opens and shows the contents of your Desktop folder.

**Verify:** You should see the icons and files that appear on your Desktop.

**Need help?** [Open Hint 1 for Exercise 1](../hints/04-hints.md#exercise-1-open-your-desktop-in-the-gui-from-terminal)

---

## Exercise 2: Open a Terminal from Your Desktop Folder

**Goal:** Use the GUI to open a terminal that is already inside your Desktop folder.

**Steps:**

1. Open your Desktop folder in the GUI (File Explorer, Finder, or Files)
2. Open a terminal that is already positioned inside Desktop

**Instructions by OS:**

<details>
<summary>Windows</summary>

**Windows 11:**
1. Navigate to your Desktop in File Explorer
2. Right-click in an empty area of the folder (not on a file)
3. Select "Open in Terminal"

**Windows 10 or if option missing:**
1. Navigate to your Desktop in File Explorer
2. Click the address bar at the top
3. Type `cmd` and press Enter

</details>
<details>
<summary>macOS</summary>

**First-time setup:**
1. Open System Settings → Keyboard → Keyboard Shortcuts → Services
2. Find "New Terminal at Folder" and check the box to enable it

**Using the service:**
1. Navigate to your Desktop in Finder
2. Right-click the Desktop folder (or any folder inside it)
3. Select "Services" → "New Terminal at Folder"

</details>
<details>
<summary>Ubuntu</summary>

**Method 1 — Right-click:**
1. Navigate to your Desktop in Files
2. Right-click the Desktop folder
3. Select "Open in Terminal"

**Method 2 — Keyboard shortcut:**
1. Press `Ctrl + Alt + T` to open a terminal at home
2. Type `cd ~/Desktop`

</details>

**Verify:** Run `pwd` in the new terminal. It should show your Desktop path.

```bash
pwd
```

**Expected output:** The terminal shows the path ending in `Desktop` (or your language equivalent).

**Need help?** [Open Hint 1 for Exercise 2](../hints/04-hints.md#exercise-2-open-a-terminal-from-your-desktop-folder)

---

## Exercise 3: Spot the Difference

**Goal:** Observe that the terminal and GUI are always looking at the same folder — changes made in one appear in the other.

### Part A: Create in Terminal, Confirm in GUI

**Steps:**

1. In your terminal, create a new folder called `sync-test`:
   ```bash
   mkdir sync-test
   ```
2. Without doing anything else, open the GUI and navigate to the current folder
3. Look for `sync-test` in the file listing

**Verify:** `sync-test` folder appears in the GUI file listing.

### Part B: Create in GUI, Confirm in Terminal

**Steps:**

1. In the GUI (while viewing the current folder), create a new empty file called `gui-created.txt`
   - Right-click → New → Text Document (Windows)
   - Right-click → New → Plain Text File (macOS)
   - Right-click → New → Empty Document (Ubuntu)
2. Come back to your terminal
3. Run `ls` to see the file

**Verify:** `gui-created.txt` appears in the terminal's `ls` output.

### Part C: Delete in Terminal, Confirm in GUI

**Steps:**

1. In your terminal, delete the file you just created:
   ```bash
   rm gui-created.txt
   ```
2. Go to the GUI window
3. Press F5 or click the refresh button
4. Confirm the file is gone

**Verify:** `gui-created.txt` no longer appears in the GUI.

### Part D: Delete in GUI, Confirm in Terminal

**Steps:**

1. In the GUI, delete the `sync-test` folder (right-click → Delete or Move to Trash)
2. Come back to your terminal
3. Press F5 or press the up arrow and Enter to re-run your last command
4. Run `ls` to see the folder is gone

**Verify:** `sync-test` folder no longer appears in the terminal's `ls` output.

**Summary of what you observed:**
- Creating a file/folder in the terminal → immediately visible in GUI (or after refresh)
- Creating a file/folder in the GUI → immediately visible in terminal (or after refresh)
- Deleting in either place removes it from both

**Need help?** [Open Hint 1 for Exercise 3](../hints/04-hints.md#exercise-3-spot-the-difference)

---

## All Done?

**[← Back to Lesson 4: GUI ↔ Terminal Bridge](../lessons/04-gui-terminal-bridge.md)**
