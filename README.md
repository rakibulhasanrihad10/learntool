# GitVerse

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Tests-260%20Passing-success?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20বাংলা-purple)](#-bilingual-support)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An interactive Git and GitHub learning and reference platform. 

GitVerse helps developers move beyond memorizing commands by visualizing Git’s underlying content-addressed mental model through a deterministic simulation engine, real-time commit DAG graphs, hands-on practice labs, recovery recipes, and technical interview preparation.

---

## 🌟 Key Features

- **Interactive Git Simulation Engine**: A deterministic, in-memory state reducer that models branches, commits, the index (staging area), and working tree in real time without touching the local filesystem.
- **Visual DAG Commit Graph**: Interactive SVG graphs showing fast-forward merges, merge commits, detached HEAD states, and rebase commit identity rewriting (`C'` hashes).
- **GitHub PR & Collaboration Simulator**: Step through the entire Pull Request lifecycle — branch creation, pushes, draft PRs, code reviews, change requests, automated checks, and merge strategies.
- **Git Internals Explorer**: Inspect blobs, trees, commit objects, tags, and reference pointers (`HEAD`, branch tips, `origin/main`) with an interactive "Follow the Pointer" traversal tool.
- **Practice Labs with State Validation**: 30 hands-on exercises that validate the resulting repository state (branch pointers, commit ancestry, staged status) rather than brittle typed-string matching.
- **Diagnostic Skill Assessment**: 18 diagnostic questions across 6 core competency areas generating an educational readiness breakdown.
- **Troubleshooting & Recovery Cookbook**: 20 battle-tested recovery guides for common Git mishaps (committed to the wrong branch, detached HEAD, botched hard reset, merge conflicts, lost commits with reflog).
- **Technical Interview Preparation**: 80 curated interview questions with concise short answers, deep explanations, interviewer tips, common pitfalls, and configurable mock interviews.
- **Structured Learning Paths**: Three guided roadmaps (Beginner, Intermediate, Advanced) orchestrating lessons, practice exercises, and checkpoint assessments into a unified progression.



## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/rakibulhasanrihad10/learnos.git
cd learnos

# 2. Install dependencies
npm install

# 3. Start local development server (http://localhost:3000)
npm run dev

# 4. Run automated tests (260 tests)
npm test

# 5. Type-check and build production bundle
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
