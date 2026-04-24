# Navigating Folders

Now that you know how to open the terminal and run basic commands, let's learn how to move around your computer. In this lesson, you'll discover how to see where you are, look at files, and navigate into different folders.

---

## Where Are You?

When you open your terminal, you start in a specific location on your computer. It's like opening a door to a room — you're already *somewhere*, but you need to know how to describe that location.

To find out where you are, use this command:

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd
```

This command with no arguments displays your current location.

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
pwd
```

Short for "print working directory" — it tells you exactly where you are.

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
pwd
```

Short for "print working directory" — it tells you exactly where you are.

</details>

The location it shows you is called your **current working directory**. This is the folder your terminal is currently "inside" of.

---

## Listing Files

You can see what files and folders are in your current location by listing them:

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
dir
```

Short for "directory" — shows all items in your current folder.

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
ls
```

Short for "list" — shows all items in your current folder.

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
ls
```

Short for "list" — shows all items in your current folder.

</details>

### Useful Flags

Commands can have extra options called **flags** that change how they behave. These come after the command with a space:

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
dir /a
```

Shows all files including hidden files (those starting with a dot).

```powershell
dir /la
```

Long listing format with details like file size and date.

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
ls -a
```

Shows all files including hidden files (those starting with a dot).

```bash
ls -la
```

Long listing format with details like file size and date.

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
ls -a
```

Shows all files including hidden files (those starting with a dot).

```bash
ls -la
```

Long listing format with details like file size and date.

</details>

---

## Moving Between Folders

To change your location, use the **change directory** command:

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd FolderName
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
cd FolderName
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
cd FolderName
```

</details>

### Going to the Parent Folder

To go up one level (to the containing folder), use two dots:

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd ..
```

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
cd ..
```

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
cd ..
```

</details>

### Going to Your Home Folder

To return to your home folder (where your user files are stored):

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd ~
```

Or:

```powershell
cd $env:USERPROFILE
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

The `~` symbol is a shortcut that always means "my home folder."

---

## Absolute vs Relative Paths

Understanding paths is crucial for navigation. There are two ways to specify a location:

### Relative Paths

A **relative path** describes where something is *relative to your current location*. It's like giving directions from where you are now.

If you're in `C:\Users\YourName` and you type `cd Documents`, you're saying "find the Documents folder that's inside my current location."

Examples:

| Scenario | Command |
|----------|---------|
| Go into a child folder named "Documents" | `cd Documents` |
| Go into a folder named "Projects" inside Documents | `cd Documents/Projects` |
| Go up one level | `cd ..` |
| Go up two levels | `cd ../..` |

### Absolute Paths

An **absolute path** describes a location from the root of the filesystem — it always starts from the same place, no matter where you currently are.

On Windows, absolute paths start with a drive letter like `C:\`:

```
C:\Users\YourName\Documents
```

On macOS and Ubuntu, absolute paths start with a forward slash `/`:

```
/Users/YourName/Documents
```

Examples:

| Scenario | Windows | macOS / Ubuntu |
|----------|---------|----------------|
| Documents folder | `C:\Users\YourName\Documents` | `/Users/YourName/Documents` |
| Desktop folder | `C:\Users\YourName\Desktop` | `/Users/YourName/Desktop` |

### When to Use Which

- **Use relative paths** when you're moving around step by step (e.g., `cd Documents`)
- **Use absolute paths** when you need to go somewhere specific from anywhere (e.g., `cd C:\Users\YourName\Documents\Projects\Important`)

---

## Tab Completion

Here's a trick that will save you tons of time: **tab completion**.

Start typing the name of a folder or file, then press the `Tab` key. The terminal will automatically complete the name for you!

**Example:**

If you have a folder named `Documents`, type:

<details>
<summary>Windows (PowerShell or Git Bash)</summary>

```powershell
cd Doc
```

Then press `Tab`. It might auto-complete to `cd Documents\`.

</details>
<details>
<summary>macOS (Terminal)</summary>

```bash
cd Doc
```

Then press `Tab`. It will auto-complete to `cd Documents/`.

</details>
<details>
<summary>Ubuntu (Terminal)</summary>

```bash
cd Doc
```

Then press `Tab`. It will auto-complete to `cd Documents/`.

</details>

If there are multiple matches, press `Tab` twice to see all options.

This works for commands, file names, and paths — it's one of the most useful tricks in the terminal!

---

## Exercise

Practice what you learned with these exercises:

**[Open Exercise 2: Navigating Folders](../exercises/02-navigating-folders-exercises.html)**

---

## Key Takeaways

| Command | Windows | macOS | Ubuntu |
|---------|---------|-------|--------|
| Where am I? | `cd` | `pwd` | `pwd` |
| List files | `dir` | `ls` | `ls` |
| Change directory | `cd` | `cd` | `cd` |
| Parent folder | `cd ..` | `cd ..` | `cd ..` |
| Home folder | `cd ~` or `cd $env:USERPROFILE` | `cd ~` | `cd ~` |

- The terminal always has a **current working directory**
- **Relative paths** describe location from where you are; **absolute paths** start from the root
- The `~` symbol always means your home folder
- The `..` means the parent folder (one level up)
- **Tab completion** saves time by auto-completing file and folder names

---

Next: [Lesson 3: File Operations — Creating and Managing Files](../lessons/03-file-operations.md)
