import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "./Sidebar";
import "./Support.css";

function Support() {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const loadRequests = async () => {
        try {
            const response = await api.get("/support/me");
            setRequests(response.data);
        } catch (error) {
            console.error(
                "Error loading support requests:",
                error
            );
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject.trim() || !description.trim()) {
            setMessage("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            await api.post("/support", {
                subject,
                description
            });

            setSubject("");
            setDescription("");

            setMessage(
                "Support request submitted successfully."
            );

            await loadRequests();

        } catch (error) {
            console.error(
                "Error submitting support request:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to submit support request."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="support-layout">

            {/* Sidebar */}

            <Sidebar />


            {/* Main Content */}

            <main className="support-main">

                {/* =================================
                    PAGE HEADER
                ================================= */}

                <div className="support-header">

                    <span className="support-page-label">
                        EMPLOYEE SELF SERVICE
                    </span>

                    <h1>
                        My Support
                    </h1>

                    <p>
                        Submit a support request and track your requests.
                    </p>

                </div>


                {/* =================================
                    SUPPORT FORM
                ================================= */}

                <div className="support-form-card">

                    <div className="support-card-header">

                        <div className="support-card-icon">
                            ?
                        </div>

                        <div>

                            <h2>
                                Submit a Support Request
                            </h2>

                            <p>
                                Tell us about the issue you are experiencing.
                            </p>

                        </div>

                    </div>


                    {/* Message */}

                    {message && (
                        <div className="support-message">
                            {message}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        {/* Subject */}

                        <div className="support-form-group">

                            <label>
                                Subject
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your issue"
                                value={subject}
                                onChange={(e) =>
                                    setSubject(e.target.value)
                                }
                                maxLength="150"
                                required
                            />

                        </div>


                        {/* Description */}

                        <div className="support-form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Describe your issue..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                maxLength="1000"
                                rows="6"
                                required
                            />

                            <small>
                                Maximum 1000 characters
                            </small>

                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            className="support-submit-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Submitting..."
                                : "Submit Support Request"}
                        </button>

                    </form>

                </div>


                {/* =================================
                    SUPPORT HISTORY
                ================================= */}

                <div className="support-list-card">

                    <div className="support-history-header">

                        <div>

                            <span className="support-section-label">
                                RECORDS
                            </span>

                            <h2>
                                My Support Requests
                            </h2>

                            <p>
                                View the status of your submitted support requests.
                            </p>

                        </div>

                        <span className="support-request-count">

                            {requests.length}{" "}

                            {requests.length === 1
                                ? "request"
                                : "requests"}

                        </span>

                    </div>


                    {/* Empty State */}

                    {requests.length === 0 ? (

                        <div className="support-empty-state">

                            <div className="support-empty-icon">
                                ?
                            </div>

                            <h3>
                                No support requests
                            </h3>

                            <p>
                                Your submitted support requests
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        /* Request Table */

                        <div className="support-table-wrapper">

                            <table className="support-table">

                                <thead>

                                <tr>

                                    <th>
                                        SUBJECT
                                    </th>

                                    <th>
                                        DESCRIPTION
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                    <th>
                                        CREATED
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {requests.map((request) => (

                                    <tr key={request.id}>

                                        <td className="support-subject">
                                            {request.subject}
                                        </td>

                                        <td className="support-description">
                                            {request.description}
                                        </td>

                                        <td>

                                                <span
                                                    className={
                                                        request.status === "RESOLVED"
                                                            ? "support-status resolved"
                                                            : "support-status pending"
                                                    }
                                                >

                                                    <span className="support-status-dot">
                                                        ●
                                                    </span>

                                                    {request.status}

                                                </span>

                                        </td>

                                        <td className="support-created">

                                            {request.createdAt
                                                ? new Date(
                                                    request.createdAt
                                                ).toLocaleString()
                                                : "-"}

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default Support;