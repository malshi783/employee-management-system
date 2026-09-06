import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    return (
        <div>

            <h1>Employee Management System</h1>

            <h2>Dashboard</h2>

            <p>
                Welcome, <strong>{email}</strong>
            </p>

            <p>
                Role: <strong>{role}</strong>
            </p>

            <button onClick={() => navigate("/users")}>
                Manage Employees
            </button>

            <button
                onClick={() => {
                    localStorage.clear();
                    navigate("/");
                }}
            >
                Logout
            </button>

        </div>
    );
}

export default Dashboard;