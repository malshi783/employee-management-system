# Employee Management System — Setup & Deployment

## Backend (Railway) environment variables

Configure these on the Spring Boot backend service:

| Variable | Value |
|---|---|
| `DB_URL` | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `JWT_SECRET` | Newly generated private random secret (at least 32 random bytes) |
| `JWT_EXPIRATION` | `86400000` |
| `APP_CORS_ALLOWED_ORIGINS` | `https://YOUR-VERCEL-DOMAIN.vercel.app` |

The Railway database service must be named `MySQL` for the references above. If it has a different name, update the references. Never commit real credentials.

## Frontend (Vercel) environment variable

Set `VITE_API_URL` to the backend root URL, e.g. `https://YOUR-RAILWAY-BACKEND-DOMAIN` (without `/api`). Redeploy after changing environment variables.

## Local development

1. Create a MySQL database named `employee_management`.
2. Set `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET` in your local environment.
3. From `backend`, run `mvnw.cmd spring-boot:run` on Windows (or `./mvnw spring-boot:run` on macOS/Linux).
4. From `frontend`, run `npm install`, then `npm run dev`. Optionally set `VITE_API_URL=http://localhost:8080` in `frontend/.env.local`.

## Important

- Rotate any database password or JWT secret previously committed, shared, or included in an archive.
- This source archive excludes database contents and user accounts. Existing production data remains in the deployed database.
- Test login, employee management, attendance, leave requests, profile updates/uploads, and support requests after deployment.
