# Deborah University Workspace

A responsive React dashboard for Deborah University with separate administrator and student portals. The demo is technology-only: every programme, department, and course is in computing or a related field. All money is displayed in Nigerian naira (`₦`). There is no campus store, cart, wishlist, product catalogue, or order flow.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open <http://127.0.0.1:5173/>.

To create a production build:

```bash
npm run build
```

The build is written to `dist/index.html` as a single self-contained file. You can open it directly in Edge, Chrome, or another modern browser; no local server is required. Hash routing means URLs look like `index.html#/student`.

To preview the production build through Vite:

```bash
npm run preview
```

## Demo accounts

| Portal | Email | Password |
| --- | --- | --- |
| Student | `amara.okafor@deborah.edu` | `student123` |
| Administrator | `m.ellis@deborah.edu` | `admin123` |

Use the **Fill demo** button on the sign-in page to populate either set of credentials.

- Student: Amara Okafor, BSc Computer Science, Year 3
- Administrator: Dr. Maya Ellis, University Registrar

## Routes

| Route | Page |
| --- | --- |
| `#/` | Sign in |
| `#/admin` | Administrator overview |
| `#/admin/students` | Student directory |
| `#/admin/courses` | Course catalogue |
| `#/admin/finance` | Finance and payments |
| `#/student` | Student overview |
| `#/student/courses` | My courses |
| `#/student/courses/registration` | Course registration |
| `#/student/courses/grades` | Grades and results |
| `#/student/finance` | Fees and payment history |

## Technology programmes

Computer Science, Software Engineering, Cyber Security, Data Science, Artificial Intelligence, and Information Technology. Departments include Computing, Software Engineering, Cyber Security, Data Science, AI & Robotics, and Information Systems.

## Demo data and persistence

The app has no backend. Demo records live in `src/data.js`, while the current session and the student's finance state are saved in browser `localStorage`:

- `deborah.session.v2` — signed-in user session
- `deborah.finance.v2` — tuition payments, receipts, and outstanding balance

Clear those keys in the browser's developer tools to reset the demo. Payments, downloads, new students/courses, and admin payment records are client-side demo changes; some page-level changes reset on reload, while the student finance changes persist.

Downloads (receipts, statements, CSV exports) are generated in the browser. They work when the app is served locally or opened from `dist/index.html`.

## Project structure

```text
src/
  App.jsx              Route mapping, page titles, boot/route loaders
  data.js              Technology-only demo data
  components/          Layout, icons, shared UI, loader, charts
  context/             Session, routing, finance, notifications, toasts
  pages/admin/         Admin overview, students, courses, finance
  pages/student/       Student overview, courses, finance
  styles/              Tokens, shared components, page and responsive styles
```

## Responsive behaviour

- Mobile (< 760px): drawer navigation, stacked cards, card-style data tables, full-width forms and modals.
- Tablet (760–1024px): compact navigation and toolbar layouts, horizontally usable tables and charts.
- Desktop (> 1024px): persistent sidebar, multi-column dashboards, and a three-column student course grid.

The app uses the Google Fonts families Fraunces and Plus Jakarta Sans when online; system font fallbacks keep it usable offline.
