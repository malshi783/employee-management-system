import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "./Sidebar";
import "./AddEmployee.css";

function AddEmployee() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("EMPLOYEE");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const response = await api.post("/users", {
                name,
                email,
                password,
                role
            });

            console.log("Employee created:", response.data);

            setMessage("Employee account created successfully.");

            setName("");
            setEmail("");
            setPassword("");
            setRole("EMPLOYEE");

            setTimeout(() => {
                navigate("/users");
            }, 1000);

        } catch (error) {

            console.error("Error creating employee:", error);

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    error.response.data ||
                    "Failed to create employee."
                );

            } else {

                setError(
                    "Could not connect to the backend."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="add-employee-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <Sidebar />


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="add-employee-main">

                {/* Header */}

                <div className="add-employee-header">

                    <div>

                        <span className="page-label">
                            EMPLOYEE MANAGEMENT
                        </span>

                        <h1>
                            Add Employee
                        </h1>

                        <p>
                            Create a new employee account and
                            assign their system role.
                        </p>

                    </div>


                    <button
                        className="back-button"
                        onClick={() => navigate("/users")}
                    >
                        ← Back to Employees
                    </button>

                </div>


                {/* =========================
                    FORM
                ========================= */}

                <div className="add-employee-content">

                    <div className="form-card">

                        {/* Card Header */}

                        <div className="form-card-header">

                            <div className="form-card-icon">
                                +
                            </div>

                            <div>

                                <h2>
                                    Employee Information
                                </h2>

                                <p>
                                    Enter the employee's account
                                    details below.
                                </p>

                            </div>

                        </div>


                        {/* Messages */}

                        {message && (

                            <div className="success-message">

                                <span className="message-icon">
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Success
                                    </strong>

                                    <p>
                                        {message}
                                    </p>

                                </div>

                            </div>

                        )}


                        {error && (

                            <div className="error-message">

                                <span className="message-icon">
                                    !
                                </span>

                                <div>

                                    <strong>
                                        Unable to create account
                                    </strong>

                                    <p>
                                        {error}
                                    </p>

                                </div>

                            </div>

                        )}


                        <form onSubmit={handleSubmit}>

                            {/* =========================
                                NAME
                            ========================= */}

                            <div className="form-group">

                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    placeholder="e.g. Kasun Perera"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    required
                                />

                            </div>


                            {/* =========================
                                EMAIL
                            ========================= */}

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="employee@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>


                            {/* =========================
                                PASSWORD
                            ========================= */}

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create a secure password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    minLength="6"
                                    required
                                />

                                <small>
                                    Use at least 6 characters.
                                </small>

                            </div>


                            {/* =========================
                                ROLE
                            ========================= */}

                            <div className="form-group">

                                <label htmlFor="role">
                                    System Role
                                </label>

                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) =>
                                        setRole(e.target.value)
                                    }
                                >

                                    <option value="EMPLOYEE">
                                        Employee
                                    </option>

                                    <option value="ADMIN">
                                        Administrator
                                    </option>

                                </select>

                                <small>
                                    The role determines which
                                    areas of the system this
                                    user can access.
                                </small>

                            </div>


                            {/* =========================
                                ACTIONS
                            ========================= */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        navigate("/users")
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="create-button"
                                    disabled={loading}
                                >

                                    {loading ? (
                                        <>
                                            <span className="button-spinner"></span>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create Employee
                                            <span>→</span>
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>


                    {/* =========================
                        SIDE INFORMATION
                    ========================= */}

                    <div className="employee-info-panel">

                        <div className="info-panel-icon">
                            EMS
                        </div>

                        <span>
                            ACCOUNT SETUP
                        </span>

                        <h2>
                            Create a new team member
                        </h2>

                        <p>
                            Add an employee to the system
                            and give them the appropriate
                            access level.
                        </p>


                        <div className="info-points">

                            <div>
                                <span>✓</span>
                                Secure account creation
                            </div>

                            <div>
                                <span>✓</span>
                                Role-based access
                            </div>

                            <div>
                                <span>✓</span>
                                Centralized employee management
                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AddEmployee;