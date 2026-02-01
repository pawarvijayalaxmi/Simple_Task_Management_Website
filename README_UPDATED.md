# Global Trend — Task Management App

Simple full-stack task management app built for the Global Trend Full Stack Development internship assignment.

**Features**
- Responsive frontend with HTML/CSS/vanilla JS
- REST API (Express)
- SQLite persistent storage (file-based)
- CRUD for tasks (Title, Description, Status)

**Prerequisites**
- Node.js (16+ recommended)

**Quick start**

1. Install dependencies

```powershell
npm install
```

2. (Optional) Seed the database with sample tasks

```powershell
npm run seed
```

3. Start the server

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser.

**SQLite details**
- The app uses `better-sqlite3` and stores the DB file at `data/db.sqlite`.
- No server or Docker is required — SQLite is file-based and provides a real SQL database engine.
- If you want a GUI to view the DB, install **DB Browser for SQLite** (https://sqlitebrowser.org/) and open `data/db.sqlite`.

If `npm install` fails due to native build tools on Windows, tell me and I will switch the code to use the `sqlite3` package instead.

**API Endpoints**
- `GET /api/tasks` — list tasks
- `GET /api/tasks/:id` — get task
- `POST /api/tasks` — create task (JSON body: title, description, status)
- `PUT /api/tasks/:id` — update task
- `DELETE /api/tasks/:id` — delete task

**Demo & Submission tips**
- Run `npm run seed` to create sample data, then `npm run dev` and open the app.
- Open `data/db.sqlite` with DB Browser for SQLite to show the `tasks` table during evaluation.
- Suggested commit message in `COMMIT_MESSAGE.md` for your submission.

**Next steps / Bonus ideas**
- Add authentication (JWT)
- Add server-side validation and tests
- Deploy to Render / Heroku / DigitalOcean
