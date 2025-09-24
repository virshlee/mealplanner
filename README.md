# Meal Planner

A simple Meal Planner built with React (Vite) and Firebase (Auth, Firestore, Hosting).

## Stack
- React + Vite
- Firebase Authentication (Google), Firestore, Hosting
- Tailwind CSS

## Prerequisites
- Node 18+
- Firebase CLI (`npm i -g firebase-tools`)
- A Firebase project (Europe region recommended)

## Project Conventions
- Single entry `index.html` at repo root. Production serves `dist/` via Firebase Hosting.
- Authorized domains (Firebase Auth → Settings): add `localhost`, `127.0.0.1`, `[::1]`, and any LAN IP you use.
- Firestore rules restrict to user namespace: `users/{uid}/{document=**}`.

## Setup
1) Install dependencies
```bash
npm install
```

2) Configure Firebase (see `src/contexts/AuthContext.jsx`)
- Ensure `projectId` matches your Firebase project.
- Enable Google provider in Firebase Authentication.
- Add authorized domains as above.

3) Dev server
```bash
npm run dev
# Optional:
# npm run dev -- --host localhost --port 5173
```

4) Production build
```bash
npm run build
```
Output in `dist/`.

## Firestore Rules & Hosting
`firebase.json` includes Hosting and Firestore targets.

Deploy rules only (PowerShell quoting for --only):
```bash
firebase use <your-project-id>
firebase deploy --only "firestore"
```

Deploy Hosting + rules:
```bash
firebase use <your-project-id>
firebase deploy --only "hosting,firestore"
```

Preview channel URL:
```bash
firebase hosting:channel:deploy preview-$(Get-Date -Format yyyyMMdd-HHmm)
```

## App Features
- Sign in with Google.
- Meals: import recipe by URL; categorized list (Breakfasts, Dinners, Snacks); delete meals.
- Plans: generate N-day plan by type; calendar view; delete plans.
- Offline-friendly (Firestore persistence).

## Git: How to Commit and Push
Initialize (if new repo):
```bash
git init
git add .
git commit -m "chore: initial commit"
```

Typical workflow:
```bash
# Make changes
# Optional: npm run lint

# Review
git status
git diff

# Stage and commit
git add -A
git commit -m "feat: add plans generator and deploy config"

# First-time remote
git remote add origin https://github.com/<your-username>/<your-repo>.git

# Push
git push -u origin main  # or: git push -u origin <branch>
```

Branching:
```bash
git checkout -b feature/short-description
# ... work, commit ...
git push -u origin feature/short-description
# Open a Pull Request and merge
```

Sync latest main:
```bash
git checkout main
git pull --rebase
```

Common .gitignore (already typical):
- `node_modules/`
- `dist/`
- `.env`, `.env.local` (if used)

## Troubleshooting
- Auth domain errors: ensure `localhost`, `127.0.0.1`, `[::1]` in Authorized domains.
- Permissions: deploy `firestore.rules`; ensure you’re signed in; paths under `users/{uid}/...`.
- Build chunk size warnings: OK for now; consider code-splitting later.

---

MIT License
