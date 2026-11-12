# Employee Management System — Frontend

The React frontend for the Employee Management System. It provides administrator and employee views for employee profiles, attendance, leave requests, and support requests.

## Development

```powershell
npm ci
npm run dev
```

Vite proxies `/api` and `/uploads` to `http://localhost:8080` during local development. Start the Spring Boot backend as described in the [project README](../README.md).

## Checks

```powershell
npm run lint
npm run build
```

## Production configuration

Set `VITE_API_BASE_URL` to the public API origin when building the production image. See the [deployment guide](../DEPLOYMENT.md) for the Railway setup.
