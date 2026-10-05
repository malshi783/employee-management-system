import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./LeaveRequest.css";

function LeaveRequest() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        leaveType: "ANNUAL",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const fetchLeaveRequests = async () => {
        try {
            const response = await api.get("/leaves/me");
            setLeaveRequests(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load leave requests.");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (formData.endDate < formData.startDate) {
            setError("End date cannot be before start date.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/leaves", formData);

            setMessage("Leave request submitted successfully.");

            setFormData({
                leaveType: "ANNUAL",
                startDate: "",
                endDate: "",
                reason: ""
            });

            fetchLeaveRequests();
        } catch (err) {
            console.error(err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to submit leave request.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === "APPROVED") return "approved";
        if (status === "REJECTED") return "rejected";
        return "pending";
    };

    return (
        <div className="leave-page">

            <div className="leave-header">
                <div>
                    <h1>Leave Management</h1>
                    <p>Apply for leave and track your requests</p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>
            </div>

            <div className="leave-container">

                {/* Leave Application Form */}
                <div className="leave-card">
                    <h2>Apply for Leave</h2>

                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Leave Type</label>

                            <select
                                name="leaveType"
                                value={formData.leaveType}
                                onChange={handleChange}
                                required
                            >
                                <option value="ANNUAL">Annual Leave</option>
                                <option value="CASUAL">Casual Leave</option>
                                <option value="MEDICAL">Medical Leave</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="date-row">

                            <div className="form-group">
                                <label>Start Date</label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label>Reason</label>

                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Enter reason for leave"
                                maxLength="500"
                                rows="4"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Leave Request"}
                        </button>

                    </form>
                </div>

                {/* Leave History */}
                <div className="leave-card">

                    <h2>My Leave Requests</h2>

                    {leaveRequests.length === 0 ? (
                        <div className="empty-state">
                            No leave requests found.
                        </div>
                    ) : (
                        <div className="leave-table-wrapper">

                            <table className="leave-table">

                                <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                </tr>
                                </thead>

                                <tbody>

                                {leaveRequests.map((leave) => (
                                    <tr key={leave.id}>

                                        <td>{leave.leaveType}</td>

                                        <td>{leave.startDate}</td>

                                        <td>{leave.endDate}</td>

                                        <td>{leave.reason}</td>

                                        <td>
                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        leave.status
                                                    )}`}
                                                >
                                                    {leave.status}
                                                </span>
                                        </td>

                                    </tr>
                                ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default LeaveRequest;