# 🧭 ASD Directory – GitHub Setup and Project Organization Log

This file combines all detailed steps and AI guidance covering:
1. The complete GitHub connection and version control setup (Part 1)
2. The full project organization and cleanup summary (Part 2)

---

## 🧩 PART 1 — FULL DETAILED THREAD (GitHub Setup Phase)

### 1️⃣ Git Initialization and First Commit

Error seen:
> fatal: not a git repository (or any of the parent directories): .git

Resolution steps:

```powershell
cd C:\Projects\ASD-Directory
git init
git add .
git commit -m "Initial commit – clean project setup"
git status
```

Once initialized, future pushes follow:
```powershell
git add .
git commit -m "message"
git push
```

---

### 2️⃣ First Screenshot Confirmation

Outcome:
- ✅ `.gitignore` and `requirements.txt` added
- ✅ Initial commit confirmed
- ✅ Local repo functional (branch `master`)

Routine commands:
```powershell
git add .
git commit -m "describe what you changed"
git push
```

---

### 3️⃣ Creating the GitHub Repository

Steps on GitHub:
- Repo name: `asd-directory`
- Visibility: public or private
- **DO NOT** add README, .gitignore, or license on creation
- Click **Create Repository**

Then connect local to remote:

```powershell
cd C:\Projects\ASD-Directory
git remote add origin https://github.com/tromblyk1/asd-directory.git
git branch -M main
git push -u origin main
```

Verification:
- `.gitignore`, `requirements.txt`, and `README.md` visible on GitHub

---

### 4️⃣ Successful Push Confirmation

Git output should show:
```
branch 'main' set up to track 'origin/main'
```

You are now fully version-controlled and synced with GitHub.

---

### 5️⃣ PowerShell Git Project Bootstrap Script

Reusable setup script provided: `setup_git_project.ps1`

Purpose:
- Creates `.gitignore` and `README.md`
- Initializes Git
- Makes first commit
- Optionally links to remote GitHub repo

Usage:
```powershell
powershell -ExecutionPolicy Bypass -File "setup_git_project.ps1" -ProjectPath "C:\Projects\MyProject" -RepoURL "https://github.com/YourUsername/MyProject.git"
```

---

## 🧱 PART 2 — SUMMARY (Project Organization Phase)

### Folder Consolidation Summary

You previously had two major folders:
1. `Autism Directory`
2. `Scrapers`

They were merged into one unified structure:

```
C:\Projects\ASD-Directory\
├─ src\
├─ scripts\
├─ data\
├─ assets\
├─ supabase\
├─ venv\
├─ .gitignore
├─ requirements.txt
├─ README.md
└─ PowerShell Helpers:
     ├─ organize_asd_directory.ps1
     └─ setup_git_project.ps1
```

---

### Move Actions

- `.py` files → `/scripts`
- `.csv`, `.json`, `.xlsx` → `/data`
- `.webp`, `.jpg`, `.png` → `/assets`
- `.env`, `requirements.txt` → project root
- Vite frontend → `/src`

The PowerShell script `organize_asd_directory.ps1` automated this process.

---

### Environment Setup

Python environment created:
```powershell
python -m venv venv
.env\Scriptsctivate
pip install pandas requests beautifulsoup4 selenium tqdm
pip freeze > requirements.txt
```

Supabase & GitHub integrated; environment is locked.

---

### Result

✅ One organized root project  
✅ Environment reproducible via `requirements.txt`  
✅ GitHub repo connected and clean  
✅ PowerShell scripts automate future setups  

---

**Final Advice**
Keep this file in `/docs/` as a permanent reference for:
- How the GitHub connection was set up
- How your folders were consolidated
- Which scripts manage organization and initialization
