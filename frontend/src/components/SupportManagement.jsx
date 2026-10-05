import { useEffect, useState } from "react";
import api from "../api/api";
import "./SupportManagement.css";

function SupportManagement() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadRequests = async () => {
        try {
            const response = await api.get("/support");
            setRequests(response.data);
        } catch (error) {
            console.error("Error loading support requests:", error);
            setMessage("Failed to load support requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleResolve = async (id) => {
        try {
            await api.put(`/support/${id}/resolve`);

            setMessage("Support request resolved successfully.");

            await loadRequests();
        } catch (error) {
            console.error("Error resolving support request:", error);
            setMessage("Failed to resolve support request.");
        }
    };

    if (loading) {
        return (
            <div className="support-management-container">
                <h2>Support Management</h2>
                <p>Loading support requests...</p>
            </div>
        );
    }

    return (
        <div className="support-management-container">

            <h2>Support Management</h2>

            {message && (
                <p className="support-management-message">
                    {message}
                </p>
            )}

            {requests.length === 0 ? (
                <div className="support-management-card">
                    <p>No support requests found.</p>
                </div>
            ) : (
                <div className="support-management-card">

                    <div className="support-management-table-wrapper">

                        <table className="support-management-table">

                            <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>

                            {requests.map((request) => (
                                <tr key={request.id}>

                                    <td>{request.employeeName}</td>

                                    <td>{request.employeeEmail}</td>

                                    <td>{request.subject}</td>

                                    <td>{request.description}</td>

                                    <td>
                                            <span
                                                className={
                                                    request.status === "RESOLVED"
                                                        ? "support-status resolved"
                                                        : "support-status pending"
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

                                    <td>
                                        {request.status === "PENDING" ? (
                                            <button
                                                className="resolve-button"
                                                onClick={() =>
                                                    handleResolve(request.id)
                                                }
                                            >
                                                Resolve
                                            </button>
                                        ) : (
                                            <span className="resolved-text">
                                                    Resolved
                                                </span>
                                        )}
                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

        </div>
    );
}

export default SupportManagement;