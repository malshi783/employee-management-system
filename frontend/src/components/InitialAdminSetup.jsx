import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "./Login.css";
import "./InitialAdminSetup.css";

function InitialAdminSetup() {
    const [status, setStatus] = useState("checking");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/auth/initial-admin/status")
            .then(({ data }) => setStatus(data.setupRequired ? "available" : "complete"))
            .catch(() => setStatus("unavailable"));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("The passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/initial-admin", { name, email, password });
            setStatus("created");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            const responseMessage = error.response?.data?.detail
                || error.response?.data?.message
                || error.response?.data;
            setMessage(typeof responseMessage === "string"
                ? responseMessage
                : "Setup could not be completed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <div className="login-container setup-container">
                <section className="login-brand-panel setup-brand-panel">
                    <div className="brand-content">
                        <div className="brand-logo">EMS</div>
                        <span className="brand-label">EMPLOYEE MANAGEMENT SYSTEM</span>
                        <h1>Set up your <span>administrator.</span></h1>
                        <p>Create the first account to manage employees, attendance, leave and support requests.</p>
                    </div>
                    <div className="brand-footer">Employee Management System</div>
                </section>

                <section className="login-area">
                    <div className="login-card">
                        <div className="mobile-logo">EMS</div>
                        {status === "checking" && (
                            <div className="login-header">
                                <span className="login-label">SECURE SETUP</span>
                                <h2>Checking setup</h2>
                                <p>Please wait while we check whether an administrator is needed.</p>
                            </div>
                        )}

                        {status === "available" && (
                            <>
                                <header className="login-header">
                                    <span className="login-label">FIRST-TIME SETUP</span>
                                    <h2>Create administrator</h2>
                                    <p>This one-time setup closes automatically after the first account is created.</p>
                                </header>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="admin-name">Full name</label>
                                        <input id="admin-name" type="text" autoComplete="name" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="admin-email">Email address</label>
                                        <input id="admin-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="admin-password">Password (16–72 characters)</label>
                                        <input id="admin-password" type="password" autoComplete="new-password" minLength={16} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="admin-password-confirm">Confirm password</label>
                                        <input id="admin-password-confirm" type="password" autoComplete="new-password" minLength={16} maxLength={72} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
                                    </div>
                                    {message && <div className="login-error" role="alert"><span>!</span><p>{message}</p></div>}
                                    <button className="login-button" type="submit" disabled={loading}>
                                        {loading ? "Creating account..." : "Create administrator"}
                                    </button>
                                </form>
                            </>
                        )}

                        {status === "created" && (
                            <div className="login-header setup-result" role="status">
                                <span className="login-label">SETUP COMPLETE</span>
                                <h2>Administrator created</h2>
                                <p>You can now sign in with the email and password you just created.</p>
                                <Link className="login-button setup-action" to="/">Go to sign in</Link>
                            </div>
                        )}

                        {status === "complete" && (
                            <div className="login-header setup-result">
                                <span className="login-label">SETUP COMPLETE</span>
                                <h2>An account already exists</h2>
                                <p>First-time administrator setup is closed for this system.</p>
                                <Link className="setup-admin-link" to="/">Return to sign in</Link>
                            </div>
                        )}

                        {status === "unavailable" && (
                            <div className="login-header setup-result">
                                <span className="login-label">SETUP UNAVAILABLE</span>
                                <h2>Could not reach the server</h2>
                                <p>Please try again shortly or contact your system administrator.</p>
                                <Link className="setup-admin-link" to="/">Return to sign in</Link>
                            </div>
                        )}

                        <div className="login-footer">Employee Management System</div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default InitialAdminSetup;
