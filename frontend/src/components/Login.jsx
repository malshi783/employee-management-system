import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await api.post("/auth/login", {
                email: email,
                password: password
            });

            console.log("Login response:", response.data);

            // Save JWT token
            localStorage.setItem("token", response.data.token);

            // Save user information
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("role", response.data.role);

            setMessage("Login successful!");

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                setMessage(
                    error.response.data || "Invalid email or password"
                );
            } else {
                setMessage("Could not connect to the backend.");
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
}

export default Login;