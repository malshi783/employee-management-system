import { useEffect, useState } from "react";
import api from "../api/api";
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
            console.error("Error loading support requests:", error);
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
            setMessage("Support request submitted successfully.");

            await loadRequests();
        } catch (error) {
            console.error("Error submitting support request:", error);
            setMessage(
                error.response?.data?.message ||
                "Failed to submit support request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="support-container">

            <h2>Support</h2>

            <div className="support-form-card">
                <h3>Submit a Support Request</h3>

                <form onSubmit={handleSubmit}>

                    <label>Subject</label>
                    <input
                        type="text"
                        placeholder="Enter your issue"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        maxLength="150"
                    />

                    <label>Description</label>
                    <textarea
                        placeholder="Describe your issue..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength="1000"
                        rows="5"
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>

                </form>

                {message && (
                    <p className="support-message">
                        {message}
                    </p>
                )}
            </div>

            <div className="support-list-card">
                <h3>My Support Requests</h3>

                {requests.length === 0 ? (
                    <p>No support requests found.</p>
                ) : (
                    <div className="support-table-wrapper">
                        <table className="support-table">
                            <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created</th>
                            </tr>
                            </thead>

                            <tbody>
                            {requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.subject}</td>
                                    <td>{request.description}</td>
                                    <td>
                                            <span
                                                className={
                                                    request.status === "RESOLVED"
                                                        ? "status resolved"
                                                        : "status pending"
                                                }
                                            >
                                                {request.status}
                                            </span>
                                    </td>
                                    <td>
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

        </div>
    );
}

export default Support;