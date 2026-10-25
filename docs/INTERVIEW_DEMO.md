# Internship Interview Demo Guide

Use a local demo database with fictional accounts and sample data. Never show a real employee's personal information, passwords, JWTs, or database credentials.

## Before the interview

- [ ] Run the backend and frontend locally and confirm both start cleanly.
- [ ] Run backend tests, frontend lint, and the frontend production build.
- [ ] Create a demo administrator and at least one fictional employee.
- [ ] Add sample attendance, a leave request, and a support request so the pages are not empty.
- [ ] Sign in once as each role and confirm each role sees the expected pages.
- [ ] Close browser developer tools and clear any saved passwords or tokens from view.
- [ ] Keep the API and frontend terminals open; prepare a short screen recording or screenshots as a backup.
- [ ] Use a clean browser window and check the zoom level before sharing your screen.

## Suggested five-minute walkthrough

### 1. Explain the problem and users (30 seconds)

> “This is an employee management system with separate administrator and employee workflows. Admins manage employee records and HR requests; employees can see their own information and submit requests.”

### 2. Show the administrator workflow (about 2 minutes)

1. Sign in as the demo administrator.
2. Show the employee list and search.
3. Open attendance management, select a date, set a status, and save it.
4. Open leave management and show how a request is reviewed.
5. Open support management and show how a request is resolved.

Explain that attendance is recorded manually by an administrator; an unmarked day is not silently treated as an absence.

### 3. Show the employee workflow (about 1 minute)

1. Sign out and sign in as the fictional employee.
2. Show the employee's personal attendance history.
3. Show how the employee submits a leave or support request.
4. Point out that the employee view is scoped to the signed-in user.

### 4. Explain the implementation (about 1 minute)

Point to the React frontend, Spring Boot REST API, JPA repositories, and MySQL database. Explain that requests are authorized using JWT authentication and roles, and that passwords are BCrypt-hashed. The README architecture diagram and API overview can be used to keep this concise.

### 5. Close with testing and next steps (30 seconds)

Mention the backend tests, frontend lint, and production build. Be open about current scope: attendance is admin-entered, and there is no clock-in/clock-out or automated absence detection yet. State one practical next step, such as audit history or broader workflow tests.

## If the live demo fails

- Keep a short screen recording or a few screenshots from your own fictional demo data.
- Explain what was meant to happen, what failed, and what you would check (browser network request, API response/logs, then database state).
- Do not present a mockup as a working feature or claim a workflow that you have not tested.

## Questions to prepare for

- **Why separate admin and employee roles?** To restrict management operations and keep employee self-service scoped to the signed-in user.
- **How is the first admin created?** A one-time setup path is available only when the database has no accounts; after that, registration is closed.
- **How are passwords protected?** BCrypt hashes are stored instead of the original passwords.
- **What would you improve next?** Add attendance audit history, expand tests for role boundaries and request validation, and automate lint/build/test checks in CI.

Answer from the code you have actually implemented. If asked about a future feature, describe it as planned work rather than an existing capability.
