# Studentfolio — Student Profile Web App

A React single-page web app for registering students and managing their biographical profiles. Students can be created, viewed, edited, and deleted. The app has no login page.

The frontend uses JavaScript, React, TanStack Query (React Query), and Zustand. The backend uses JavaScript, CommonJS, Express, and MySQL.

## Requirements

- Node.js 20 or newer, with npm.
- A running MySQL server and a MySQL user with permission to create tables and read/write records in the application database.
- MySQL Workbench or another MySQL client for creating the database. Workbench is a management tool; the MySQL server must also be installed and running.

## Setup after cloning from GitHub

GitHub includes the source code and database migration, but does not include the developer's local database, student records, or private credentials. Each person testing the app must create their own database and environment file. No database export is needed for a fresh installation.

### 1. Clone the repository

Clone this repository using its GitHub URL, then open a terminal in the project root—the folder containing `frontend`, `server`, and this README.

### 2. Create an empty MySQL database

Connect to your MySQL server in Workbench and execute:

```sql
CREATE DATABASE student_profiles
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

If you use a different database name, enter that name as `DB_NAME` in the next step. If the database already exists, inspect it before proceeding instead of recreating it.

### 3. Configure the backend environment

From the project root, copy the example file:

```sh
cp server/.env.development.example server/.env.development
```

On Windows Command Prompt, use:

```bat
copy server\.env.development.example server\.env.development
```

Edit `server/.env.development` and fill in your own MySQL connection details:

```dotenv
NODE_ENV=development
PORT=5001
CLIENT_ORIGIN=http://127.0.0.1:5173

DB_HOST=localhost
DB_PORT=3306
DB_NAME=student_profiles
DB_USER=your_mysql_user
DB_PASSWORD="your_mysql_password"
```

Use the same host, port, username, and password that work in your Workbench connection. Replace the placeholder credentials; do not copy someone else's local settings. Quote passwords containing spaces or `#`. Keep this file private—it is ignored by Git. The example file contains placeholders and should be committed.

### 4. Install backend dependencies and run the migration

From the project root:

```sh
cd server
npm install
npm run db:migrate
```

The migration creates the `student_profiles` table inside the database you created. It does not create the database itself or add sample students.

Run the migration **once per fresh database**, not every time you start the server. It refuses to overwrite existing `student_profiles` or `users` tables. If you already migrated your database, skip this command and start the server. If an existing table has a different structure, review it before making changes; do not drop it simply to rerun setup.

### 5. Start the backend

In the same terminal, inside `server`:

```sh
npm run dev
```

The API runs at `http://localhost:5001`. Leave this terminal open.

### 6. Start the frontend

Open a second terminal in the project root:

```sh
cd frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5173/**, or the local URL printed by Vite. Leave both terminals open while testing. Stop either server with `Ctrl+C` in its terminal.

Vite forwards `/api` requests to Express on port 5001. If you change the backend port, also update the proxy target in `frontend/vite.config.js`. If Vite selects another port, use its printed URL and update `CLIENT_ORIGIN` to match when making direct cross-origin API requests.

## Test the app

1. Open **Register student** and enter a first name, last name, and valid email. Other fields are optional.
2. Save the registration. The new student profile should open and appear in the directory.
3. Edit the profile, change the bio, and save.
4. Refresh the browser and confirm the saved information remains.
5. Search the directory by student name or course.
6. Delete a test profile and confirm that it disappears.

A new database starts empty. Register your own test student; no sample-data import is required. Data is saved in MySQL, so your records remain when you restart the app. Earlier browser-preview records are not imported into the database.

Backend validation tests:

```sh
cd server
npm test
```

Frontend production build:

```sh
cd frontend
npm run build
```

Run these commands from the project root in separate terminals, or adjust your current directory first. The frontend production build requires a hosting setup that routes `/api` requests to Express; Vite's development proxy is not included in the build.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| MySQL connection refused | Start the MySQL server and check `DB_HOST` and `DB_PORT`. |
| Access denied | Check `DB_USER`, `DB_PASSWORD`, and the user's permissions on the database. |
| Unknown database | Create the database and match its name to `DB_NAME`. |
| Student table missing | Run `npm run db:migrate` inside `server` against the intended database. |
| Migration reports existing tables | It may already be applied. Inspect the table; do not rerun or drop existing data blindly. |
| Frontend cannot load students | Confirm Express is running on port 5001 and the Vite proxy points to it. |
| Port already in use | Stop your previous instance or change the port and related configuration. |
| Duplicate email or student number | Use a different value or edit the existing record. |

`http://localhost:5001/api/health` checks that Express is running. `/api/students` also exercises the database connection. There is no authentication or record ownership system; this is a shared student directory.

## Pages and API

The registration (`#/register`) and profile (`#/profiles/:id`) views run within one React application. React Query manages API data and mutation updates; Zustand manages shared search and notification state.

| Method | Endpoint | Action |
| --- | --- | --- |
| `GET` | `/api/students` | List students |
| `GET` | `/api/students/:id` | Read one profile |
| `POST` | `/api/students` | Register a student |
| `PUT` | `/api/students/:id` | Update a profile |
| `DELETE` | `/api/students/:id` | Delete a profile |

The backend validates input and uses parameterised queries. Invalid input returns `400`, missing profiles return `404`, and duplicate email/student number conflicts return `409`.

## Project structure and documentation

```text
frontend/
  src/                     React interface, API adapter, Zustand store, CSS
  evidence/                Original desktop CSS and browser-storage prototype
  vite.config.js           Development API proxy
server/
  config/                  Environment settings and MySQL pool
  controllers/             HTTP request handlers
  models/                  Parameterised database queries
  routes/                  API endpoints
  middleware/              Validation and error handling
  database/migrations/     Forward and rollback SQL
  scripts/migrate.js       Initial schema migration runner
  tests/                   Validation tests
  app.js                   Express application
  server.js                Server startup
docs/                      Development documentation and screenshots
```

- [1,500-word development document](docs/development.md)
- [Desktop and mobile design iteration with screenshots](docs/frontend-iteration.md)
- [Table schema and migration guidance](docs/database-schema.md)
- [Original development database migration and integration checks](docs/database-migration-record.md)

The migration record describes the original developer's environment. It does not mean the database has been created on a new tester's machine. Follow the setup steps above for each fresh installation.

The rollback SQL removes the student table and all its records. It is not part of normal setup or testing. The assessment brief requires the development document to be submitted as Word or PDF, plus a demonstration video.

Commit source files, documentation, migration SQL, environment examples, and both package lockfiles. Keep actual environment files, `node_modules`, and generated `dist` folders excluded through `.gitignore`.
