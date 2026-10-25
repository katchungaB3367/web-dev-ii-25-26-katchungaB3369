# Multi-Device Application Development Document

## Brief

This project will deliver a single page application with a responsive React frontend and an Express backend. Students will create records on a registration page, then read, update, or delete bio information on a profile page, with MySQL storage. The required experience must work on phone and desktop devices and include meaningful data transfer between browser and server. The implemented frontend uses React Query and Zustand, while the Express backend uses JavaScript and CommonJS. The interface was first verified using browser-based CRUD with fictional sample records. MySQL migration and backend integration were then completed. This document records both development stages and identifies remaining verification limits.

## Current Scope and Requirements

The assignment prioritises quality, responsive design, and iterative improvement over application size. A successful implementation should help users complete a clear task through an understandable interface. Before designing individual screens, the project should define the student bio fields, registration requirements, and information students need to manage. These decisions will determine the primary workflow and prevent unnecessary features from distracting from the assessment requirements.

The repository now contains a working React frontend and an Express starter. Registration creates student records, and the profile view reads, updates, and deletes them. A searchable directory allows existing records to be reopened. Browser storage initially preserved demonstration records after refresh. The final adapter sends HTTP requests through the development proxy to Express. The reviewed schema was migrated into the empty MySQL database. CRUD now transfers data between the frontend and backend, and direct database verification confirmed persistence.

## Development Breakdown: Server Organisation

The backend follows a conventional separation between configuration, routes, controllers, and middleware. The startup file opens the HTTP listener, while the application file configures Express and attaches middleware. Keeping these responsibilities separate makes request behaviour easier to inspect without automatically opening a network port whenever the application module is imported. All backend files use require and module.exports, matching the requested CommonJS approach without introducing TypeScript compilation or additional build configuration.

Routes describe the available URLs and connect incoming requests to controllers. Controllers contain request handling logic and produce responses. The initial health controller returns a small JSON object confirming that the API is running. Future functionality should follow this pattern, with related endpoints grouped clearly. MySQL queries now live in a dedicated model using parameterised statements and a connection pool. Controllers validate incoming data and return meaningful statuses. Duplicate identifiers return conflict responses instead of exposing database errors.

Shared middleware handles unknown routes and errors consistently. Unknown URLs receive a JSON response with a 404 status. Unexpected server failures receive a generic message, while server logs retain diagnostic information. JSON request bodies have a size limit to avoid accepting unnecessarily large payloads. These choices establish useful defaults, but they do not replace feature specific validation. Student endpoints check required fields, permitted values, text lengths, and valid IDs before processing submitted data.

## Development Breakdown: Environment Configuration

Local settings belong in server/.env.development. The starter provides NODE_ENV, PORT, CLIENT_ORIGIN, and MySQL connection settings so the developer can adjust runtime behaviour without editing application logic. The local server port is 5001, and the anticipated frontend origin is localhost on port 5173. Vite now provides the frontend development server. The frontend proxy forwards API requests to Express on port 5001 because port 5000 was occupied on this machine.

The environment loader resolves its file relative to the configuration module. This avoids dependence on the directory from which the developer starts Node. It loads the development file when the runtime mode is development or unspecified; other environments should supply their settings externally. Port validation catches invalid values early and produces an understandable error. Existing process variables take precedence over file values, allowing local tooling or deployment settings to provide appropriate overrides.

An example environment file records the expected structure for future checkouts. The actual development file is ignored by Git because configuration may eventually contain credentials. DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD describe the MySQL server connection. These settings now configure the MySQL connection pool. Any secret used by a future integration must remain on the backend. Browser code should receive only the public information needed for its interface, because values shipped to a frontend can be inspected by users.

## Development Breakdown: Responsive Interface Planning

The React SPA has registration and profile views, using React Query for CRUD and Zustand for interface state. The desktop design combines a sidebar, directory cards, profile details, and a two-column form. Muted greens, cream backgrounds, and white panels establish hierarchy. Initial avatars avoid unnecessary image uploads. The original stylesheet is retained in the evidence folder, and screenshots document its appearance before responsive corrections.

The initial body had a minimum width of 1,200 pixels. A narrow Chrome viewport exposed the problem: the sidebar occupied much of the phone screen while the profile extended outside it. Fitting the desktop layout into the preview made text too small. The saved before screenshot records the original stylesheet at a 390-pixel viewport. This provided a concrete reason to change the layout rather than simply assuming that desktop styling would work everywhere.

The corrected stylesheet removes the desktop minimum width and introduces progressive breakpoints. On phones, navigation moves above the content, the directory and profile stack, and registration fields use one column. Supporting promotional content disappears to prioritise the form. Input text increases to 16 pixels, buttons gain comfortable heights, and long email addresses wrap. The after screenshots show the overview, profile, and registration form. These are browser viewport checks rather than physical device tests or peer feedback.

## Validation and Development Workflow

The first verification step is installing the dependencies declared in the server package file and starting the API through its development command. The health URL should return successful JSON, while an unknown URL should return a consistent 404 response. Configuration should also be checked with an alternative valid port and an invalid port. These checks establish that the foundation behaves predictably before application logic introduces additional sources of failure.

Browser verification created a disposable student, opened its profile, updated its bio, and confirmed persistence after refresh. Deleting that test record through the confirmation dialog returned the directory to three sample students. Desktop and mobile screenshots record visible results. The production build passed, and package installation reported zero vulnerabilities after a compatible Vite patch. Subsequent live proxy checks verified database CRUD, duplicate email conflicts, invalid input, and missing records. A direct MySQL query confirmed the updated bio. Disposable database records were removed after testing. Final browser verification became unavailable when computer use lost the Chrome window.

## Critical Reflection

The foundation benefits from its understandable scope. CommonJS keeps the backend aligned with the requested development style, while separate modules make responsibilities visible. Configuration is documented and editable, and the example file helps another developer reproduce the setup. Consistent responses also provide a starting point for frontend error handling. These are architectural benefits of the starter, rather than measured evidence of improved user satisfaction or completed assessment outcomes.

Database persistence is implemented, but the final connected interface still needs broader browser and device checks. Browser storage helped isolate design verification before the API existed. The applied schema now supports the CRUD endpoints. React Query already manages cached records and mutations, while Zustand holds search and notification state. Unsaved form values remain local to components. Registration creates bio records without login, so this remains a shared directory concept rather than a private ownership system. Each additional dependency creates implementation and maintenance responsibilities.

A further limitation concerns evidence. Meaningful reflection requires observations from development, not retrospective claims that every decision worked well. The developer should keep short notes about confusing failures, rejected layouts, and feedback that changed the implementation. Recording these details during the process will make the final account more accurate. Personal development should focus on tracing requests across frontend and backend, explaining status codes, improving accessible forms, and using browser tools to investigate problems systematically instead of changing unrelated code until an error disappears.

## Next Steps and Submission

The migration, Express CRUD endpoints, and HTTP adapter are complete. The next priority is to verify the connected interface on physical devices, obtain peer feedback, and refine the final submission evidence. Replace the planning language in this document with explanations of the final implementation and genuine iteration evidence. The submitted account should retain clear distinctions between achieved features, known limitations, and future improvements.

The final repository must include source code, required assets, and complete dependency declarations while excluding installed modules and private credentials. The Markdown document must be converted to Word or PDF for submission, as specified by the brief. A short demonstration video should show the key workflow and behaviour at both required screen sizes. Before submission, repeat setup from documented instructions and confirm that another person can run the project successfully.

Record additional usability feedback and device observations during testing to support an accurate final reflection.

The iteration record preserves screenshots, design decisions, observed checks, and verification limitations.
