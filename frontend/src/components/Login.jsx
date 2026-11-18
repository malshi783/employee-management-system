import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [setupRequired, setSetupRequired] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        api.get("/auth/initial-admin/status")
            .then(({ data }) => {
                if (!cancelled) {
                    setSetupRequired(Boolean(data.setupRequired));
                }
            })
            .catch(() => {
                if (!cancelled) setSetupRequired(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);


    // =========================================
    // LOGIN
    // =========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const response = await api.post("/auth/login", {
                email: email,
                password: password
            });

            console.log(
                "Login successful:",
                response.data
            );


            // Store JWT
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


            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

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

            <div className="login-container">


                {/* =================================
                    LEFT BRAND PANEL
                ================================= */}

                <div className="login-brand-panel">

                    <div className="brand-content">

                        <div className="brand-logo">
                            EMS
                        </div>


                        <span className="brand-label">
                            EMPLOYEE MANAGEMENT SYSTEM
                        </span>


                        <h1>
                            Manage your
                            <br />
                            workforce
                            <br />
                            <span>smarter.</span>
                        </h1>


                        <p>
                            A centralized platform for managing
                            employees, attendance, leave and
                            support requests.
                        </p>


                        {/* FEATURES */}

                        <div className="brand-features">

                            <div>
                                <span>✓</span>
                                Employee management
                            </div>

                            <div>
                                <span>✓</span>
                                Attendance tracking
                            </div>

                            <div>
                                <span>✓</span>
                                Leave & support management
                            </div>

                        </div>

                    </div>


                    {/* BRAND FOOTER */}

                    <div className="brand-footer">
                        Employee Management System
                    </div>

                </div>



                {/* =================================
                    LOGIN AREA
                ================================= */}

                <div className="login-area">

                    <div className="login-card">


                        {/* MOBILE LOGO */}

                        <div className="mobile-logo">
                            EMS
                        </div>


                        {/* =================================
                            LOGIN HEADER
                        ================================= */}

                        <div className="login-header">

                            <span className="login-label">
                                ACCOUNT LOGIN
                            </span>

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Sign in to your Employee
                                Management System
                            </p>

                        </div>



                        {/* =================================
                            LOGIN FORM
                        ================================= */}

                        <form onSubmit={handleLogin}>


                            {/* EMAIL */}

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



                            {/* PASSWORD */}

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
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>



                            {/* =================================
                                ERROR MESSAGE
                            ================================= */}

                            {message && (

                                <div className="login-error">

                                    <span>!</span>

                                    <p>
                                        {message}
                                    </p>

                                </div>

                            )}



                            {/* =================================
                                LOGIN BUTTON
                            ================================= */}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading && (
                                    <span className="login-spinner"></span>
                                )}

                                {loading
                                    ? "Signing in..."
                                    : "Sign In"}

                            </button>

                        </form>

                        {setupRequired && (
                            <Link className="setup-admin-link" to="/setup-admin">
                                Set up the first administrator
                            </Link>
                        )}



                        {/* =================================
                            FOOTER
                        ================================= */}

                        <div className="login-footer">

                            Employee Management System

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
