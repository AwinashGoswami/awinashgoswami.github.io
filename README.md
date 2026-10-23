# CS Moodle by Awi

Free computer science study resources for students — O Level, A Level, Sindh Board, Federal Board, and University notes, timed practice quizzes, curated video tutorials, books library, and blog.

Deploys to: [https://awinashgoswami.github.io/](https://awinashgoswami.github.io/)

---

## Features

- **Classrooms:** Curated curriculum notes and topic navigation for Sindh Board (9th–12th), Federal Board (9th–12th), Cambridge (O/A Level), and University.
- **Study Notes:** Topic-by-topic notes viewer with live PDF availability detection and mobile-friendly document preview.
- **Practice Quizzes:** 30-second per-question timed quizzes with instant feedback, audio cues, progress saving/resuming, and downloadable report cards.
- **CS Books:** Curated collection of open/free computer science books with direct PDF downloads and category filtering.
- **Searchable Glossary:** Instant search across CS terms and definitions, with supplementary Wikipedia search fallback.
- **Video Tutorials:** Curated YouTube video lessons and curriculum playlists.
- **Blog:** Study strategies, concept breakdowns, and CS teaching insights.
- **Resume / Portfolio:** Personal CV of CS instructor Awinash Goswami available at `/resume`.

---

## Tech Stack & Architecture

- **Framework:** [Astro](https://astro.build/) (Static Site Generation, `output: 'static'`)
- **Styling:** Bootstrap 5.3 + custom stylesheets (`/assets/css/home.css`, `/assets/css/notes.css`)
- **Interactions:** Vanilla JavaScript client scripts with resilient `localStorage` state management
- **Testing:** Node.js native test runner (`node --test`)
- **Hosting:** GitHub Pages (User site served from the domain root `/`)

---

## Getting Started

### Prerequisites

- **Node.js:** `>= 20.0.0` (matching `.nvmrc` and `package.json` engines)
- **npm:** `>= 10.0.0`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/AwinashGoswami/awinashgoswami.github.io.git
cd awinashgoswami.github.io
npm install
```

### Development Server

Start the local Astro development server:

```bash
npm run dev
```

The site will be available locally at `http://localhost:4321/`.

### Running Tests

Run the native test suite:

```bash
npm test
```

### Building for Production

Compile the static production build to `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment to GitHub Pages

The repository uses a GitHub Actions workflow targeting GitHub Pages:

1. In repository settings (**Settings → Pages → Source**), select **GitHub Actions**.
2. When changes are pushed to `main`, GitHub Actions automatically:
   - Sets up Node.js 20.
   - Installs dependencies with `npm ci`.
   - Runs `npm run build` to generate static output in `dist/`.
   - Uploads `dist/` as the Pages artifact and deploys it to `https://awinashgoswami.github.io/`.
