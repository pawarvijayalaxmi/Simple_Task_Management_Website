# Simple Task Management Web App

Simple Task Management Web App — built for the Global Trend internship assessment.

## Features

- Responsive frontend with HTML/CSS and vanilla JavaScript
- REST API with Express
- SQLite persistent storage (file-based) using `better-sqlite3`
- CRUD for tasks (title, description, status)

## Prerequisites

- Node.js (16+ recommended)

## Quick start

1. Install dependencies

```powershell
npm install
```

2. (Optional) Seed the database with sample tasks

```powershell
npm run seed
```

3. Start the server (default port `3000`)

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser. To run on a different port, set `PORT` before starting:

```powershell
$env:PORT = 3001; npm run dev
```

## Database (SQLite)

- The app uses `better-sqlite3` and stores the database file at `data/db.sqlite`.
- No external DB server or Docker is required — SQLite is file-based and portable.
- If you prefer a GUI, open `data/db.sqlite` with DB Browser for SQLite: https://sqlitebrowser.org/

If `npm install` fails on Windows due to native build tools for `better-sqlite3`, tell me and I can switch the project to use the `sqlite3` package or provide install steps for the required build tools.

## API Endpoints

- `GET /api/tasks` — list tasks
- `GET /api/tasks/:id` — get task
- `POST /api/tasks` — create task (JSON body: `title`, `description`, `status`)
- `PUT /api/tasks/:id` — update task
- `DELETE /api/tasks/:id` — delete task

## Demo & Submission Tips

- Run `npm run seed` to populate sample data before demoing.
- If you want reviewers to see working data immediately, include `data/db.sqlite` in the repository; otherwise keep it in `.gitignore` and rely on `npm run seed`.
- Suggested commit message is in `COMMIT_MESSAGE.md`.

## Next Steps / Ideas

- Add authentication (JWT)
- Add server-side validation and tests
- Deploy to Render / another hosting provider

  
**Project Structure :**

Global_Trend/
├── server.js              # Express server entry point
├── routes/tasks.js        # REST API routes (CRUD operations)
├── db/sqlite.js           # SQLite database helper
├── public/                # Frontend files
│   ├── index.html         # Main UI
│   ├── app.js             # Client-side logic
│   └── styles.css         # Styling
├── scripts/seed.js        # Populate sample data
├── data/db.sqlite         # SQLite database file
├── package.json           # Dependencies
└── README.md              # This file

Tech Stack — Clear technology list:
- Backend: Node.js, Express
- Database: SQLite (better-sqlite3)
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Tools: npm, Nodemon (development)

Features — Expand what's included:
- Create, Read, Update, Delete tasks
- Task status management (todo, in-progress, done)
- Search and filter functionality
- Responsive, mobile-friendly UI
- Toast notifications for user feedback
- Undo delete functionality
- Persistent SQLite storage

How to Test/Demo:
 # Install and seed
npm install
npm run seed

# Start
npm run dev

# Test in browser at http://localhost:3000
# Try: create task, update status, search, delete with undo


---

© Project generated for the Global Trend internship assessment.
