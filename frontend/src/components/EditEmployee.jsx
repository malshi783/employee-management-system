import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "./EditEmployee.css";

function EditEmployee() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("EMPLOYEE");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =========================
    // LOAD EMPLOYEE
    // =========================

    useEffect(() => {

        const fetchEmployee = async () => {

            try {

                const response = await api.get(`/users/${id}`);

                const user = response.data;

                setName(user.name || "");
                setEmail(user.email || "");
                setRole(user.role || "EMPLOYEE");

            } catch (error) {

                console.error(
                    "Error loading employee:",
                    error
                );

                setError(
                    "Could not load employee information."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchEmployee();

    }, [id]);


    // =========================
    // UPDATE EMPLOYEE
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {

            const employeeData = {
                name,
                email,
                role
            };

            // Only send password if user entered a new one
            if (password.trim() !== "") {
                employeeData.password = password;
            }

            await api.put(
                `/users/${id}`,
                employeeData
            );

            setMessage(
                "Employee updated successfully!"
            );

            setPassword("");

            setTimeout(() => {
                navigate("/users");
            }, 1000);

        } catch (error) {

            console.error(
                "Error updating employee:",
                error
            );

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    error.response.data ||
                    "Failed to update employee."
                );

            } else {

                setError(
                    "Could not connect to the backend."
                );

            }

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="edit-employee-page">

                <div className="edit-loading">

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading employee...
                    </h2>

                    <p>
                        Please wait.
                    </p>

                </div>

            </div>

        );
    }


    return (

        <div className="edit-employee-page">

            <div className="edit-employee-container">

                {/* Header */}

                <div className="edit-header">

                    <button
                        className="back-button"
                        onClick={() => navigate("/users")}
                    >
                        ← Employees
                    </button>

                    <h1>
                        Edit Employee
                    </h1>

                    <p>
                        Update employee account information
                    </p>

                </div>


                {/* Form Card */}

                <div className="edit-form-card">

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

                        {/* Employee ID */}

                        <div className="employee-id-display">

                            <span>
                                Employee ID
                            </span>

                            <strong>
                                #{id}
                            </strong>

                        </div>


                        {/* Name */}

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter employee name"
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
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter employee email"
                                required
                            />

                        </div>


                        {/* Password */}

                        <div className="form-group">

                            <label htmlFor="password">
                                New Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Leave blank to keep current password"
                                minLength="6"
                            />

                            <small>
                                Only enter a password if you want to change it.
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
                                onClick={() =>
                                    navigate("/users")
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"
                                }
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default EditEmployee;