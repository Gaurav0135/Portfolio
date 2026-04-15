# Admin App

Standalone admin dashboard for managing portfolio content.

## Features

- Admin login with JWT token
- Manage projects (create, update, delete)
- Manage skills (create, update, delete)
- Manage certificates/marksheets/education entries (create, update, delete)

## Run Locally

1. Install dependencies

```bash
npm install
```

2. (Optional) create `.env` based on `.env.example`

```bash
VITE_API_URL=http://localhost:5000/api
VITE_PORTFOLIO_URL=http://localhost:5173
```

3. Start admin app

```bash
npm run dev
```

Default local URL: `http://localhost:5174`

## Admin ID and Password

Set these values in backend `.env` (see `backend/.env.example`):

```bash
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123
```

Use the same email and password on the admin login screen.
