# Beaconn frontend

The Beaconn frontend is an Angular 22 standalone application for the student
portal. It provides login, a responsive dashboard, live meal-token loading, and
leave application.

## Run locally

From this directory:

```bash
npm install
npm start
```

Open `http://localhost:4200/`. Start the Go backend separately on
`http://localhost:8080`. The repository root `.env` should contain:

```env
APP_ENV=development
PORT=8080
CLIENT_DOMAIN=hostel.ac.in
ALLOWED_DOMAIN=http://localhost:4200
```

## Useful commands

```bash
npm start                 # Development server with live reload
npm run build             # Production build
npm test -- --watch=false # One test run
```

## Project structure

```text
src/app/
  core/
    auth/       # Login models and session service
    token/      # Live-token API service and models
    leave/      # Leave API service and models
  features/
    auth/login/ # Login page component and local styles
    dashboard/ # Dashboard component and local styles
  app.routes.ts
  app.config.ts
src/styles.css             # Global design tokens and reset
```

## Angular concepts used here

- **Standalone components:** Components import their own dependencies in the
  `@Component({ imports: [...] })` metadata. There is no `NgModule`.
- **Signals:** `signal()` stores small pieces of reactive UI state. Read a
  signal in TypeScript with `value()` and update it with `.set()` or `.update()`.
- **Reactive forms:** `FormBuilder` creates typed form controls. The template
  connects them with `[formGroup]` and `formControlName`.
- **Router guards:** The dashboard route checks `AuthService` and redirects
  unauthenticated users to `/login`.
- **HTTP services:** `AuthService`, `TokenService`, and `LeaveService` keep API
  calls out of components. They use Angular `HttpClient` and RxJS
  `Observable`s.

## Customizing the UI

Global colors are CSS variables in `src/styles.css`:

```css
:root {
  --bg: #0c111c;
  --surface: #121a28;
  --accent: #6ea8fe;
}
```

Change these tokens first when adjusting the theme. Component-specific layout
and styling lives beside the component:

- `src/app/features/auth/login/login.component.css`
- `src/app/features/dashboard/dashboard.component.css`

The dashboard switches from two cards to one card at `760px`, so mobile changes
should usually be made inside that component's media query.

## Backend API calls

The frontend currently calls:

- `POST /auth/login` with `{ rollno, password }`
- `POST /token` with the signed-in credentials
- `POST /leave/apply` with quick or custom date data

The session is stored in `sessionStorage`, which means it is cleared when the
browser tab is closed. The existing backend requires credentials for token and
leave requests, so the session service keeps them available for that tab.
