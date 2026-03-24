# Student Wellbeing Platform

A full-stack web application providing mental health resources, mood tracking, 
and support services for university students. Built by a 4-person Agile team 
over 12 weeks at Western Sydney University.

**275 commits · 4-person team · Agile sprints · CI/CD pipeline**

---

## My Contributions

I was the highest contributor on this project, responsible for:

- **Docker & DevOps** — Authored the Docker and Docker Compose configuration, 
  reducing new developer environment setup from 2 hours to under 10 minutes
- **CI/CD Pipeline** — Built GitHub Actions workflow with automated test runs 
  and branch protection rules enforcing PR review before any merge to main
- **Database Architecture** — Designed the PostgreSQL schema using the 
  migration runner pattern with destroy/migrate scripts for reproducible 
  environments; wrote seed data for consistent test states
- **Authentication integration** — Connected user authentication to the alert 
  system ensuring alerts were scoped per-user rather than hardcoded

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 5 (ES Modules) |
| Templating | EJS |
| Database | PostgreSQL |
| Testing | Node.js built-in test runner |
| DevOps | Docker, Docker Compose, GitHub Actions |
| Dev Environment | GitHub Codespaces / Dev Containers |

---

## Features

- Student mood and wellbeing check-ins
- Alert system that flags students who may need support
- Resource directory for mental health services
- User authentication with session-scoped data
- Admin dashboard for viewing student wellbeing trends

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### With Docker
```bash
docker compose up --build
```

### Without Docker

1. Clone the repo and install dependencies:
```bash
git clone https://github.com/
