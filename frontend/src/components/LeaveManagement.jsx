import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./LeaveManagement.css";

function LeaveManagement() {
    const navigate = useNavigate();

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);

            const response = await api.get("/leaves");

            console.log("LEAVE API RESPONSE:",JSON.stringify(response.data,null,2));
            setLeaveRequests(response.data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load leave requests.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/leaves/${id}/status?status=${status}`);

            await fetchLeaveRequests();
        } catch (err) {
            console.error(err);
            alert("Failed to update leave status.");
        }
    };

    const getStatusClass = (status) => {
        if (status === "APPROVED") return "approved";
        if (status === "REJECTED") return "rejected";
        return "pending";
    };

    return (
        <div className="leave-management-page">

            <div className="leave-management-header">

                <div>
                    <h1>Leave Management</h1>
                    <p>Review and manage employee leave requests</p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </div>

            <div className="admin-leave-card">

                {loading ? (
                    <div className="loading-message">
                        Loading leave requests...
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : leaveRequests.length === 0 ? (
                    <div className="empty-state">
                        No leave requests found.
                    </div>
                ) : (

                    <div className="leave-table-wrapper">

                        <table className="admin-leave-table">

                            <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>

                            {leaveRequests.map((leave) => (

                                <tr key={leave.id}>

                                    <td>{leave.employeeName}</td>

                                    <td>{leave.employeeEmail}</td>

                                    <td>{leave.leaveType}</td>

                                    <td>{leave.startDate}</td>

                                    <td>{leave.endDate}</td>

                                    <td className="reason-cell">
                                        {leave.reason}
                                    </td>

                                    <td>
                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    leave.status
                                                )}`}
                                            >
                                                {leave.status}
                                            </span>
                                    </td>

                                    <td>

                                        {leave.status === "PENDING" ? (
                                            <div className="action-buttons">

                                                <button
                                                    className="approve-button"
                                                    onClick={() =>
                                                        updateStatus(
                                                            leave.id,
                                                            "APPROVED"
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="reject-button"
                                                    onClick={() =>
                                                        updateStatus(
                                                            leave.id,
                                                            "REJECTED"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </div>
                                        ) : (
                                            <span className="completed-text">
                                                    Completed
                                                </span>
                                        )}

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

export default LeaveManagement;