import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
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

            setMessage("Employee created successfully!");

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

        <div className="add-employee-page">

            <div className="add-employee-container">

                {/* Header */}

                <div className="form-header">

                    <button
                        className="back-button"
                        onClick={() => navigate("/users")}
                    >
                        ← Employees
                    </button>

                    <h1>
                        Add Employee
                    </h1>

                    <p>
                        Create a new employee account
                    </p>

                </div>


                {/* Form Card */}

                <div className="form-card">

                    {message && (

                        <div className="success-message">
                            {message}
                        </div>

                    )}


                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}


                    <form onSubmit={handleSubmit}>

                        {/* Name */}

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Enter employee name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Email */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter employee email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Password */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                minLength="6"
                                required
                            />

                            <small>
                                Password must contain at least 6 characters.
                            </small>

                        </div>


                        {/* Role */}

                        <div className="form-group">

                            <label htmlFor="role">
                                Role
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

                        </div>


                        {/* Buttons */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => navigate("/users")}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="create-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Employee"
                                }
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default AddEmployee;