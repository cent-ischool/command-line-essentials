# Lesson 2 Exercises

Time to practice! These exercises will help you get comfortable with navigating folders.

---

## Exercise 1: Find Your Location

**Goal:** Run the "where am I" command and identify your home folder path.

### The Commands

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
pwd
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
pwd
```

</details>

### What to Look For

You should see a path displayed on screen. On Windows, this looks like `C:\Users\YourName`. On macOS, this looks like `/Users/YourName`. On Ubuntu, this looks like `/home/YourName`.

This is your **home folder** — where your personal files are stored.

### Verify

Run the command again. Did you get the same result? Your home folder doesn't change unless you explicitly navigate somewhere else.

### Need a Hint?

[See Exercise 1 hints](../hints/02-hints.html#exercise-1-find-your-location)

---

## Exercise 2: Navigate to Desktop

**Goal:** Change into the Desktop folder and confirm you're there by listing its contents.

### The Commands

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd Desktop
dir
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
cd Desktop
ls
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
cd Desktop
ls
```

</details>

### What to Look For

After `cd Desktop`, your prompt should change to show you're now inside the Desktop folder. Then `dir` or `ls` will show you all the files and folders sitting on your Desktop.

### Verify

You can run the "where am I" command again to confirm:

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
pwd
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
pwd
```

</details>

### Need a Hint?

[See Exercise 2 hints](../hints/02-hints.html#exercise-2-navigate-to-desktop)

---

## Exercise 3: Navigate Back and Forth

**Goal:** Practice moving between folders — go to Desktop, back to home, into Documents, then back two levels.

### The Commands

Step 1: Go to Desktop

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd Desktop
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
cd Desktop
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
cd Desktop
```

</details>

Step 2: Go back to home folder

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd ~
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
cd ~
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
cd ~
```

</details>

Step 3: Go into Documents

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd Documents
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
cd Documents
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
cd Documents
```

</details>

Step 4: Go back two levels

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd ../..
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
cd ../..
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
cd ../..
```

</details>

### What to Look For

After Step 1, you should be inside Desktop. After Step 2, you should be back in your home folder. After Step 3, you should be inside Documents. After Step 4, you should be in your home folder again (going up two levels from Documents takes you to your user root).

### Verify

After each step, you can run the "where am I" command to confirm your location:

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
pwd
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
pwd
```

</details>

### Need a Hint?

[See Exercise 3 hints](../hints/02-hints.html#exercise-3-navigate-back-and-forth)
