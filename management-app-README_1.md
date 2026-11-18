# Management App

A full-stack project management platform. Teams can organise projects and tasks and view them as a Kanban board, a list, a table or a Gantt timeline.

**Live demo:** https://management-app-chi.vercel.app/

**Demo account:** `alice@example.com` / `123456`

All data in the demo is fake seed data and may be reset at any time.

<!-- Add screenshots here, then uncomment:
![Dashboard](docs/dashboard.png)
![Gantt timeline](docs/timeline.png)
-->

## Features

- **Four project views:** Kanban board with drag and drop, list, table, and a Gantt timeline built with dhtmlx-gantt
- **Projects, tasks, teams and users** with task assignment, progress, priority, start and due dates
- **Search** across the workspace and **user profiles**
- **Authentication:** signup, login, logout, email verification and password reset (emails sent with Resend)
- **Security basics:** JWT stored in HttpOnly cookies, bcrypt password hashing, Zod request validation, Helmet and CORS
- **Relational data model** with comments, attachments and task assignments

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js (App Router), React, TypeScript, Redux Toolkit, React Hook Form, Zod, Tailwind CSS, Material UI, dhtmlx-gantt, react-dnd |
| Backend | Node.js, Express, TypeScript, Prisma ORM, Zod, JWT, bcrypt, Helmet, Resend |
| Database | PostgreSQL |
| Hosting | Vercel (client), Railway (API), Neon (database) |

## Project Structure

```
management-app/
├── client/                     # Next.js application
│   └── app/
│       ├── (auth)/             # login, signup, verify email, reset password
│       ├── (dashboard)/        # projects, timeline, teams, users, search, profile
│       ├── components/
│       ├── store/              # Redux Toolkit store and API layer
│       └── schemas/            # Zod schemas
└── backend/                    # Express API
    ├── prisma/                 # schema, migrations, seed script and seed data
    └── src/
        ├── application/        # auth use cases, service and repository interfaces
        ├── infrastructure/     # Prisma repository, bcrypt, JWT and Resend implementations
        ├── controllers/
        ├── routes/
        ├── middleware/         # token verification, error handling
        └── validators/         # Zod validation schemas
```

The authentication module follows a layered design: use cases depend on interfaces (repository, password hashing, token and email services), and the `infrastructure` folder provides the Prisma, bcrypt, JWT and Resend implementations, wired together in a small dependency-injection container.

## Data Model

`User`, `Team`, `Project`, `ProjectTeam`, `Task`, `TaskAssignment`, `Comment` and `Attachment`, managed with Prisma migrations.

## Getting Started

### Prerequisites

- Node.js (LTS)
- A PostgreSQL database (local, or a free one on Neon)
- A Resend API key (only needed for the email features)

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret
RESEND_API_KEY=your-resend-key
CLIENT_URL=http://localhost:3000
```

<!-- TODO: make these variable names match backend/src/config/env.ts -->

Generate the Prisma client, apply the migrations, seed the demo data and start the API:

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

> **Warning:** `npm run seed` deletes all existing rows in the app's tables before inserting the demo data. Only run it against a development database.

### 2. Client

```bash
cd client
npm install
```

Create a `.env.local` file in `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

<!-- TODO: make this variable name match the one used in client/app/store/api.ts -->

```bash
npm run dev
```

Open http://localhost:3000 and sign in with the demo account above.

## Roadmap

- Apply the layered architecture used in the auth module to the project, task and team modules
- Add a CI pipeline (lint and build checks) with GitHub Actions
- Restrict data access per user and team
- More features for task and project management

## Author

**Abubakr Ali Mahmoud**, junior full-stack developer

[LinkedIn](https://www.linkedin.com/in/abubakr-ali-689272255/) | [GitHub](https://github.com/bkar-ali) | [Portfolio](https://my-portfolio-jade-seven-41.vercel.app/)
