# Student Wellbeing Platform

A full-stack web application built in a 4-person Agile team to support student mental health and wellbeing. The platform provides mood tracking, peer messaging, event discovery, and automated wellbeing alerts — all secured with JWT authentication and role-based access control.

[![Stack](https://img.shields.io/badge/Stack-Express%20%7C%20PostgreSQL%20%7C%20Docker-blue?style=flat-square)]()
[![Auth](https://img.shields.io/badge/Auth-JWT%20%7C%20bcrypt-green?style=flat-square)]()
[![Tests](https://img.shields.io/badge/Tests-Node%20Test%20Runner-yellow?style=flat-square)]()

---

## 🚀 Features

- **Mood Tracking** — students log daily mood entries with historical trend visualisation
- **Peer Messaging** — real-time messaging between students and wellbeing staff
- **Events** — discover and register for upcoming wellbeing events
- **Automated Alerts** — server-side alert system that flags at-risk students based on mood patterns
- **JWT Authentication** — secure login with bcrypt password hashing and cookie-based session management
- **Role-Based Access Control** — separate capabilities for students and administrators

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | EJS templating, CSS |
| Backend | Node.js, Express (ES Modules) |
| Database | PostgreSQL |
| Auth | JWT, bcrypt |
| DevOps | Docker, DevContainer |
| Testing | Node.js built-in test runner |

---

## 👨‍💻 My Contributions

- **Highest contributor** — 58 commits and 5 pull requests across the project lifecycle
- Established the **Docker devcontainer configuration** from scratch, reducing teammate environment setup from ~2 hours to under 10 minutes
- Built the **PostgreSQL connection pool and migration scripts** used by the entire team
- Implemented **JWT cookie authentication, bcrypt password hashing, and RBAC middleware** applied consistently across all authenticated routes
- Delivered backend features across mood tracking, messaging, events, and alert modules

---

## 🏃 Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker Desktop (optional)

### Setup
```bash
git clone https://github.com/Krishal-D/student-wellbeing-platform.git
cd student-wellbeing-platform
npm install
```

Copy the environment file:
```bash
cp .env.example .env
# Fill in your PostgreSQL credentials
```

Run migrations:
```bash
node config/migrationRunner.js destroy
node config/migrationRunner.js migrate
```

Start the server:
```bash
node app.js
```

### Run with Docker
```bash
docker compose up --build
```

### Testing
```bash
node --test
node --test --experimental-test-coverage
```

---

## 📁 Project Structure
```
student-wellbeing-platform/
├── config/          # Database connection and migration runner
├── controllers/     # Route handler logic
├── middleware/      # JWT auth and RBAC middleware
├── migrations/      # SQL migration files
├── routes/          # Express route definitions
├── tests/           # Test files
├── views/           # EJS templates
└── app.js           # Application entry point
```
