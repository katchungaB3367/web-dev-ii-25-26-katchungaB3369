# Student bio schema for review

Status: migration `001` applied successfully to the configured local database after an empty-table inspection. See [the migration record](database-migration-record.md). Registration means creating a student bio record. There is no login, account table, password, or authentication workflow.

## Frontend and server

The frontend is a React single-page application written in JavaScript. TanStack Query (React Query) will manage API requests, cached student records, loading/error states, mutations, and refreshing records after saves. Zustand will manage shared interface state such as the selected student, filters, and form visibility. Database records should remain in the Query cache rather than being duplicated in Zustand.

The CommonJS Express backend validates requests and queries MySQL. The frontend libraries and browser-based profile CRUD are implemented. The MySQL connection and Express profile endpoints are now implemented and integration-tested. See [the frontend iteration record](frontend-iteration.md).

## Registration and profile pages

Both implemented pages are client-side views within the same React SPA; switching between them does not reload the application. The app uses hash URLs so refreshing a profile does not require server-side page routes. There is no login page.

| View | Planned behaviour |
| --- | --- |
| Registration (`#/register`) | Form to create a student record; after a successful save, open the new profile |
| Profile (`#/profiles/:id`) | Display the saved bio, edit and save changes, or delete the record after confirmation |
| Profile selection | List saved students so an existing profile can be reopened after a refresh or a later visit |

Registration provides **Create**; the profile page provides **Read**, **Update**, and **Delete** (CRUD). The existing single-table schema supports all four operations without additional tables. Profile selection can sit within the profile area rather than requiring a third page.

### Implemented API contract

| Method | Endpoint | Behaviour |
| --- | --- | --- |
| `POST` | `/api/students` | Validate and create a record; return `201` and the created student |
| `GET` | `/api/students` | List student summaries for profile selection |
| `GET` | `/api/students/:id` | Read one complete student profile |
| `PUT` | `/api/students/:id` | Validate and replace editable profile fields; return the saved student |
| `DELETE` | `/api/students/:id` | Delete the student record; return `204` |

Invalid data should return `400`, duplicate email/student number `409`, and an unknown student ID `404`. IDs and automatic timestamps are read-only. Blank optional fields should become `NULL`; omitted optional fields in a full `PUT` replacement should also become `NULL`.

React Query will cache the student list and individual profiles. Successful creation or updates should refresh the list and affected profile. Successful deletion should remove the profile from the cache, refresh the list, and return to profile selection. Zustand will manage shared filters and interface state; local component state can hold unsaved form input. The profile ID in the URL allows the selected record to survive a refresh.

Without authentication, the API cannot distinguish record owners: anyone with access to it can read, update, or delete these records. This behaviour matches the current shared application scope; a profile ID is not proof of ownership.

## Applied table: student_profiles

| Column | MySQL type | Rules / purpose |
| --- | --- | --- |
| `id` | `INT UNSIGNED` | Auto-increment primary key |
| `student_number` | `VARCHAR(50)` | Optional, unique when supplied |
| `first_name` | `VARCHAR(100)` | Required |
| `last_name` | `VARCHAR(100)` | Required |
| `email` | `VARCHAR(254)` | Required, unique contact email |
| `course` | `VARCHAR(150)` | Optional course name |
| `year_of_study` | `TINYINT UNSIGNED` | Optional; proposed API validation: 1–10 |
| `bio` | `TEXT` | Optional; proposed API limit: 2,000 characters |
| `created_at` | `TIMESTAMP` | Automatically set on creation |
| `updated_at` | `TIMESTAMP` | Automatically updated when values change |

This is a single independent table with no foreign keys. Email identifies a contact record; it does not grant access or establish ownership. Unique email assumes one student record per email address. Optional student numbers should be stored as `NULL` when blank, allowing multiple records without a student number. Required fields must also be checked for blank strings in Express.

The collation `utf8mb4_unicode_ci` compares text without case or accent sensitivity, including unique email and student number checks. Review this behaviour if your institution uses identifiers distinguished by accents. SQL storage types do not enforce the proposed year and bio limits; the backend must validate them and use parameterised queries.

## Migration files

- `server/database/migrations/001_create_student_profiles.up.sql`: canonical schema and forward migration, creating the table above.
- `server/database/migrations/001_create_student_profiles.down.sql`: destructive rollback, dropping the table and all its records.

The initial migration has been revised because it was still at the review stage. If you already applied the earlier two-table version yourself, do not run this script over it: that existing structure needs a separate data-preserving migration after its current data is inspected.

## Apply after review

1. Open MySQL Workbench and select the existing database matching `DB_NAME` in `server/.env.development`.
2. Run `SELECT DATABASE();` and confirm the intended database is selected.
3. Check whether `student_profiles` already exists. The script intentionally fails on a table name collision rather than silently accepting a different structure.
4. Open and execute the forward SQL script once.
5. Record migration `001` and its execution date in your project change record. Alternatively, on a fresh empty database run `npm run db:migrate` from `server/`. The initial runner refuses to overwrite existing tables. There is no general migration-history engine; execution is recorded in the migration record.

Verify the result:

```sql
SELECT DATABASE();
SHOW CREATE TABLE student_profiles;
SELECT COUNT(*) AS student_count FROM student_profiles;
```

A fresh table should contain zero records. Live integration checks verified profile creation, reading, updating, deletion, duplicate email handling, invalid input, and missing records. A direct MySQL query verified the updated bio. Disposable integration data was removed afterwards.

MySQL DDL commits implicitly. Rollback deletes records permanently, so export a backup before running the down script. Subsequent changes should use new numbered migrations once this schema is applied.
