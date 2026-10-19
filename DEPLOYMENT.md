# Railway Deployment

This repository deploys as three Railway services: a MySQL database, the Spring Boot API, and the React frontend.

## 1. Create the services

Create a Railway project from this GitHub repository and add a MySQL service. Add two services from the same repository:

- API service: set the root directory to `/backend` and expose a public domain.
- Frontend service: set the root directory to `/frontend` and expose a public domain.

Each application service uses its directory's Dockerfile.

The API Dockerfile builds and runs the backend on Java 25 (the current LTS release).

## 2. Configure the API service

Set these variables on the API service. Replace `MySQL` in the Railway references if your database service has a different name.

```text
DB_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
JWT_SECRET=<a random secret of at least 32 characters>
JWT_EXPIRATION=86400000
APP_CORS_ALLOWED_ORIGINS=<your frontend public URL>
```

Add a Railway volume to the API service and mount it at `/app/uploads`. Profile photos are stored there and need persistent storage to survive deploys.

## 3. Configure the frontend service

Set this build variable on the frontend service. Use the API's public URL without a trailing slash or `/api` suffix.

```text
VITE_API_BASE_URL=https://<your-api-domain>
```

After deploying the frontend, set `APP_CORS_ALLOWED_ORIGINS` on the API service to the frontend's exact public origin, then redeploy the API.

## 4. Verify

Open the frontend's public URL. On a new database, use the initial setup form to create the first administrator; this option is only available while the database has no accounts. Then sign in and test API-backed pages and profile photo uploads.

Keep `JWT_SECRET` private and use Railway's private MySQL connection values through the service references above. If deployment fails, check the API and frontend service logs for missing environment variables, database connection errors, or a CORS origin mismatch.