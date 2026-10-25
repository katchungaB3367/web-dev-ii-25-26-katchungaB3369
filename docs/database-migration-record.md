# Database migration and integration record

Date: 25 October 2026.

## Applied schema

The configured MySQL database was inspected using `SHOW TABLES` and returned an empty result. The reviewed `001_create_student_profiles.up.sql` script was then applied using `npm run db:migrate`. It created the single `student_profiles` table. No existing tables or records were replaced, and no demonstration students were imported.

The migration runner uses a database advisory lock and checks for existing `student_profiles` or `users` tables before creation. It refuses to overwrite either table. It is an initial-schema runner, not a general versioned migration engine. The down SQL is manual and destructive; it has not been executed.

## Implemented integration

- `server/config/database.js`: MySQL connection pool using the server environment file.
- `server/models/studentModel.js`: parameterised list/read/create/update/delete queries.
- `server/middleware/studentValidation.js`: required fields, normalised email, text limits, optional null values, study year, read-only fields, and numeric ID validation.
- `server/controllers/studentController.js`: HTTP request handling.
- `frontend/src/data.js`: HTTP adapter replacing browser persistence.
- `frontend/vite.config.js`: development proxy from `/api` to Express on port 5001.

Port 5000 was occupied by another process, so this project's environment and proxy use 5001. Credentials remained in the ignored server environment file and were not printed or copied to the frontend.

## Verification

The live API was tested through `http://127.0.0.1:5173/api/students`, exercising the same Vite proxy used by the frontend.

| Operation | Result |
| --- | --- |
| Create disposable student | `201`, generated ID returned |
| Read generated ID | `200` |
| Duplicate email | `409` |
| Invalid email | `400` |
| Update bio | `200` |
| Direct MySQL read of updated bio | Matched the submitted text |
| Read unknown ID | `404` |
| Delete disposable record | `204` |
| Read deleted ID | `404` |
| Final row count | Zero; test data cleaned up |

The three Node validation tests also passed. The frontend browser CRUD interactions were visually verified during the earlier browser-storage stage. The final integrated app's API/proxy and persistence were verified programmatically; a final visual recheck was unavailable because computer use could no longer find the Chrome window.

## Running the connected web app

```sh
# Terminal 1
cd server
npm install
npm run dev
```

```sh
# Terminal 2, starting from the project root
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`. The directory starts empty. Registration creates a MySQL record, then opens its profile. Use edit/save and delete confirmation to manage it. For production, configure `/api` routing to Express; the Vite development proxy is not part of the production build.

Database access is shared because the requested app has no login or ownership system. The initial schema is now applied: use a new numbered migration for later schema changes rather than editing and rerunning `001`.
