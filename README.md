# Employee Management System

A full-stack Employee Management System developed to simplify employee information management through a modern web interface, RESTful APIs and a relational database.

**Project Status:** In Progress

## Project Overview

The Employee Management System is a web-based application designed to help organisations manage employee information through a centralised platform.

The application follows a frontend-backend architecture, using React.js for the user interface, Java Spring Boot for backend services and MySQL for data storage.

## Key Features

- **Employee Management:** Manage employee-related information.
- **User Authentication:** JWT-based authentication.
- **Role-Based Access Control:** Manage access according to user roles.
- **RESTful APIs:** Connect frontend components with backend services.
- **Database Management:** Store and manage application data using MySQL.
- **Responsive Interface:** Build an accessible user interface with React.js.

*Note: Features are under development. Refer to the current implementation for completed functionality.*

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Backend | Java, Spring Boot |
| Database | MySQL |
| Authentication | JSON Web Tokens (JWT) |
| API Architecture | REST APIs |
| Version Control | Git, GitHub |
| Containerisation | Docker, Docker Compose |

## Project Architecture

The application follows a three-layer architecture:

```text
              USER
                |
                v
       REACT.JS FRONTEND
                |
                v
         REST API REQUESTS
                |
                v
       SPRING BOOT BACKEND
                |
                v
           MYSQL DATABASE
```

## Project Structure

```text
employee-management-system/
│
├── backend/
│   └── Spring Boot application
│
├── frontend/
│   └── React application
│
├── docs/
│   └── Project documentation
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── DEPLOYMENT.md
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Java Development Kit (JDK)
- Maven
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/malshi783/employee-management-system.git
```

### 2. Navigate to the Project

```bash
cd employee-management-system
```

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure your database connection and required environment variables using the provided example configuration.

Run the Spring Boot application using the Maven wrapper:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Configure the frontend API URL according to your backend configuration.

### 5. Database Configuration

Create the required MySQL database and configure the database connection details in your backend environment.

For additional configuration and deployment instructions, refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## Security

- JWT-based authentication.
- Role-based access control.
- Environment-based configuration for sensitive values.
- Sensitive configuration files should not be committed to the repository.

## Future Improvements

- Complete and test all employee management operations.
- Improve authentication and authorization workflows.
- Add automated backend and frontend tests.
- Improve validation and error handling.
- Complete cloud deployment.

## Learning Outcomes

Through this project, I am developing practical experience in:

- Full-stack application development.
- Java and Spring Boot backend development.
- React.js frontend development.
- REST API integration.
- Relational database management.
- JWT authentication and authorization.
- Git and GitHub version control.
- Application configuration and deployment preparation.

## Author

**Malshi Dewmini**

BSc (Hons) Software Engineering Undergraduate  
NSBM Green University, Sri Lanka

- GitHub: https://github.com/malshi783
- LinkedIn: https://linkedin.com/in/malshidewmini
- Email: malshi783@gmail.com

---

*This project is being developed as part of my continuous learning journey in software engineering.*
