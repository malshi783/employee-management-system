import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function EditEmployee() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("EMPLOYEE");

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Load existing employee
    useEffect(() => {

        const loadEmployee = async () => {

            try {

                const response = await api.get(`/users/${id}`);

                const employee = response.data;

                setName(employee.name);
                setEmail(employee.email);
                setRole(employee.role);

            } catch (error) {

                console.error("Error loading employee:", error);

                if (error.response) {
                    setError(
                        error.response.data?.message ||
                        error.response.data ||
                        "Failed to load employee."
                    );
                } else {
                    setError("Could not connect to the backend.");
                }

            } finally {
                setLoading(false);
            }
        };

        loadEmployee();

    }, [id]);


    // Update employee
    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            await api.put(`/users/${id}`, {
                name: name,
                email: email,
                password: password,
                role: role
            });

            setMessage("Employee updated successfully!");

            setTimeout(() => {
                navigate("/users");
            }, 1000);

        } catch (error) {

            console.error("Error updating employee:", error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    error.response.data ||
                    "Failed to update employee."
                );
            } else {
                setError("Could not connect to the backend.");
            }
        }
    };


    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <h2>Loading employee...</h2>
            </div>
        );
    }


    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#f5f7fb",
            padding: "40px"
        }}>

            <div style={{
                maxWidth: "700px",
                margin: "0 auto",
                backgroundColor: "white",
                padding: "35px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>

                <h1>Edit Employee</h1>

                <p>
                    Update employee account information
                </p>


                {message && (
                    <div style={{
                        padding: "12px",
                        marginBottom: "20px",
                        backgroundColor: "#d1fae5",
                        color: "#047857",
                        borderRadius: "6px"
                    }}>
                        {message}
                    </div>
                )}


                {error && (
                    <div style={{
                        padding: "12px",
                        marginBottom: "20px",
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c",
                        borderRadius: "6px"
                    }}>
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div style={{ marginBottom: "20px" }}>

                        <label>
                            <strong>Name</strong>
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter employee name"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>


                    {/* Email */}
                    <div style={{ marginBottom: "20px" }}>

                        <label>
                            <strong>Email</strong>
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter employee email"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>


                    {/* Password */}
                    <div style={{ marginBottom: "20px" }}>

                        <label>
                            <strong>New Password</strong>
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            minLength="6"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>


                    {/* Role */}
                    <div style={{ marginBottom: "25px" }}>

                        <label>
                            <strong>Role</strong>
                        </label>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px"
                            }}
                        >

                            <option value="EMPLOYEE">
                                EMPLOYEE
                            </option>

                            <option value="ADMIN">
                                ADMIN
                            </option>

                        </select>

                    </div>


                    {/* Buttons */}
                    <div>

                        <button
                            type="submit"
                            style={{
                                padding: "12px 25px",
                                marginRight: "10px",
                                backgroundColor: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}
                        >
                            Update Employee
                        </button>


                        <button
                            type="button"
                            onClick={() => navigate("/users")}
                            style={{
                                padding: "12px 25px",
                                backgroundColor: "#e5e7eb",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditEmployee;