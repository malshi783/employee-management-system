import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "./Sidebar";
import "./LeaveRequest.css";

function LeaveRequest() {

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

    const fetchLeaveRequests = async () => {
        try {
            const response = await api.get("/leaves/me");
            setLeaveRequests(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load leave requests.");
        }
    };

    useEffect(() => {
        const loadLeaveRequests = async () => {
            try {
                const response = await api.get("/leaves/me");
                setLeaveRequests(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load leave requests.");
            }
        };

        void loadLeaveRequests();
    }, []);

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

            setMessage(
                "Leave request submitted successfully."
            );

            setFormData({
                leaveType: "ANNUAL",
                startDate: "",
                endDate: "",
                reason: ""
            });

            await fetchLeaveRequests();

        } catch (err) {
            console.error(err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(
                    "Failed to submit leave request."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === "APPROVED") {
            return "approved";
        }

        if (status === "REJECTED") {
            return "rejected";
        }

        return "pending";
    };

    return (
        <div className="leave-layout">

            <Sidebar />

            <main className="leave-main">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="leave-header">

                    <div>

                        <span className="leave-page-label">
                            EMPLOYEE SELF SERVICE
                        </span>

                        <h1>
                            My Leave
                        </h1>

                        <p>
                            Apply for leave and track your requests.
                        </p>

                    </div>

                </div>


                {/* =================================
                    CONTENT
                ================================= */}

                <div className="leave-container">

                    {/* =================================
                        LEAVE APPLICATION
                    ================================= */}

                    <div className="leave-card">

                        <div className="leave-card-header">

                            <div className="leave-card-icon">
                                +
                            </div>

                            <div>

                                <h2>
                                    Apply for Leave
                                </h2>

                                <p>
                                    Submit a new leave request.
                                </p>

                            </div>

                        </div>


                        {/* MESSAGES */}

                        {message && (
                            <div className="success-message">
                                <span>✓</span>
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                <span>!</span>
                                {error}
                            </div>
                        )}


                        {/* FORM */}

                        <form onSubmit={handleSubmit}>

                            {/* Leave Type */}

                            <div className="form-group">

                                <label>
                                    Leave Type
                                </label>

                                <select
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="ANNUAL">
                                        Annual Leave
                                    </option>

                                    <option value="CASUAL">
                                        Casual Leave
                                    </option>

                                    <option value="MEDICAL">
                                        Medical Leave
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* Dates */}

                            <div className="date-row">

                                <div className="form-group">

                                    <label>
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* Reason */}

                            <div className="form-group">

                                <label>
                                    Reason
                                </label>

                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Enter reason for leave"
                                    maxLength="500"
                                    rows="5"
                                    required
                                />

                                <small>
                                    Maximum 500 characters
                                </small>

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Leave Request"}
                            </button>

                        </form>

                    </div>


                    {/* =================================
                        LEAVE HISTORY
                    ================================= */}

                    <div className="leave-card history-card">

                        <div className="history-card-header">

                            <div>

                                <span className="section-label">
                                    RECORDS
                                </span>

                                <h2>
                                    My Leave Requests
                                </h2>

                                <p>
                                    View the status of your previous requests.
                                </p>

                            </div>

                            <span className="request-count">
                                {leaveRequests.length}{" "}
                                {leaveRequests.length === 1
                                    ? "request"
                                    : "requests"}
                            </span>

                        </div>


                        {leaveRequests.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ▤
                                </div>

                                <h3>
                                    No leave requests
                                </h3>

                                <p>
                                    Your submitted leave requests
                                    will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="leave-table-wrapper">

                                <table className="leave-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            TYPE
                                        </th>

                                        <th>
                                            START
                                        </th>

                                        <th>
                                            END
                                        </th>

                                        <th>
                                            REASON
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                    </tr>

                                    </thead>

                                    <tbody>

                                    {leaveRequests.map(
                                        (leave) => (

                                            <tr
                                                key={leave.id}
                                            >

                                                <td>
                                                        <span className="leave-type">
                                                            {leave.leaveType}
                                                        </span>
                                                </td>

                                                <td>
                                                    {leave.startDate}
                                                </td>

                                                <td>
                                                    {leave.endDate}
                                                </td>

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

                                            </tr>

                                        )
                                    )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default LeaveRequest;