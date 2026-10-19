# Employee Management System

Full-stack employee management system built with React, Spring Boot, MySQL, JWT authentication, and role-based access control.

## Deploy on Railway

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete Railway setup, including database, API, frontend, environment variables, persistent photo storage, and first-admin setup.

The repository contains separate Dockerfiles for the backend and frontend. Deploy them as separate Railway services, each configured to use its respective `backend` or `frontend` root directory.

## Local development

- Backend: run `.\mvnw.cmd spring-boot:run` from the `backend` directory after configuring the database and `JWT_SECRET` environment variables.
- Frontend: run `npm ci` and then `npm run dev` from the `frontend` directory. In development, Vite proxies `/api` and `/uploads` to the backend at `http://localhost:8080`; leave `VITE_API_BASE_URL` empty to use this proxy. The backend must be running separately.

## Validation

- Backend tests: run `.\mvnw.cmd clean test` from the `backend` directory.
- Frontend production build: run `npm ci` and `npm run build` from the `frontend` directory.
- Frontend lint: run `npm run lint` from the `frontend` directory.
