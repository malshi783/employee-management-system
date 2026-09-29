import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Login.css";

function Login() {

    // Store the values entered by the user
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Control password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Display login errors
    const [message, setMessage] = useState("");

    // Control the loading state of the login button
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleLogin = async (e) => {

        // Stop the browser from refreshing the page
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            // Send login details to Spring Boot
            const response = await api.post("/auth/login", {
                email: email,
                password: password
            });

            console.log("Login successful:", response.data);


            // Store authentication information
            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "email",
                response.data.email
            );

            localStorage.setItem(
                "role",
                response.data.role
            );


            // Go to Dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            if (error.response) {

                setMessage(
                    error.response.data ||
                    "Invalid email or password."
                );

            } else {

                setMessage(
                    "Unable to connect to the server. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <div className="login-card">

                {/* Logo and heading */}

                <div className="login-header">

                    <div className="logo">
                        EMS
                    </div>

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Sign in to your Employee Management System
                    </p>

                </div>


                {/* Login form */}

                <form onSubmit={handleLogin}>

                    {/* Email */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
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

                        <div className="password-wrapper">

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>


                    {/* Error message */}

                    {message && (

                        <div className="login-error">
                            {message}
                        </div>

                    )}


                    {/* Login button */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"}

                    </button>

                </form>


                {/* Footer */}

                <div className="login-footer">

                    Employee Management System

                </div>

            </div>

        </div>
    );
}

export default Login;