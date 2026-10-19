import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import heroIllustration from "../assets/hero.png";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [setupRequired, setSetupRequired] = useState(false);
    const [setupStatusChecked, setSetupStatusChecked] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        api.get("/auth/setup-status")
            .then((response) => {
                if (active) {
                    setSetupRequired(response.data.setupRequired === true);
                }
            })
            .catch(() => {
                if (active) {
                    setSetupRequired(false);
                }
            })
            .finally(() => {
                if (active) {
                    setSetupStatusChecked(true);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const completeLogin = (response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("role", response.data.role);
        navigate("/dashboard");
    };

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

            completeLogin(response);

        } catch (error) {

            if (error.response) {
                const responseData = error.response.data;
                const responseMessage =
                    typeof responseData === "string"
                        ? responseData
                        : responseData?.detail || responseData?.message;

                setMessage(
                    responseMessage ||
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

    const handleInitialAdminSignup = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/register-first-admin", {
                name,
                email,
                password
            });

            completeLogin(response);
        } catch (error) {
            if (error.response) {
                const responseData = error.response.data;
                const responseMessage =
                    typeof responseData === "string"
                        ? responseData
                        : responseData?.detail || responseData?.message;

                setMessage(responseMessage || "Unable to create the administrator account.");
            } else {
                setMessage("Unable to connect to the server. Please try again.");
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

                        <div className="brand-illustration" aria-hidden="true">
                            <img src={heroIllustration} alt="" />
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
                                {setupRequired ? "INITIAL ADMIN SETUP" : "ACCOUNT LOGIN"}
                            </span>

                            <h2>
                                {setupRequired ? "Create your admin account" : "Welcome back"}
                            </h2>

                            <p>
                                {setupRequired
                                    ? "Set up the first administrator for this system."
                                    : "Sign in to your Employee Management System"}
                            </p>

                        </div>



                        {/* =================================
                            LOGIN FORM
                        ================================= */}

                        {setupStatusChecked && setupRequired ? (
                            <form onSubmit={handleInitialAdminSignup}>
                                <div className="form-group">
                                    <label htmlFor="admin-name">Full Name</label>
                                    <input
                                        id="admin-name"
                                        type="text"
                                        autoComplete="name"
                                        maxLength={100}
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        maxLength={254}
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <div className="password-wrapper">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            minLength={16}
                                            maxLength={72}
                                            placeholder="At least 16 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        minLength={16}
                                        maxLength={72}
                                        placeholder="Enter your password again"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {message && (
                                    <div className="login-error" role="alert">
                                        <span>!</span>
                                        <p>{message}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="login-button"
                                    disabled={loading || !setupStatusChecked}
                                >
                                    {loading && <span className="login-spinner"></span>}
                                    {loading ? "Creating account..." : "Create Admin Account"}
                                </button>
                            </form>
                        ) : (
                        <form onSubmit={handleLogin}>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
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
                                        autoComplete="current-password"
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

                                <div className="login-error" role="alert">

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