import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "./Sidebar";
import "./LeaveManagement.css";

function LeaveManagement() {

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLeaveRequests = async () => {

        try {

            const response = await api.get("/leaves");

            console.log(
                "LEAVE API RESPONSE:",
                JSON.stringify(response.data, null, 2)
            );

            setLeaveRequests(response.data);
            setError("");

        } catch (err) {

            console.error(err);

            setError("Failed to load leave requests.");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        const loadLeaveRequests = async () => {
            try {
                const response = await api.get("/leaves");
                setLeaveRequests(response.data);
                setError("");
            } catch (err) {
                console.error(err);
                setError("Failed to load leave requests.");
            } finally {
                setLoading(false);
            }
        };

        void loadLeaveRequests();
    }, []);


    const updateStatus = async (id, status) => {

        try {

            await api.put(
                `/leaves/${id}/status?status=${status}`
            );

            setLoading(true);
            await fetchLeaveRequests();

        } catch (err) {

            console.error(err);

            alert("Failed to update leave status.");

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

        <div className="leave-management-layout">

            <Sidebar />


            <main className="leave-management-main">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="leave-management-header">

                    <div>

                        <span className="page-label">
                            ADMINISTRATION
                        </span>

                        <h1>
                            Leave Management
                        </h1>

                        <p>
                            Review and manage employee leave requests.
                        </p>

                    </div>

                </div>


                {/* =========================
                    SUMMARY
                ========================= */}

                {!loading && !error && (

                    <div className="leave-summary">

                        <div className="summary-card">

                            <div className="summary-icon">
                                ▤
                            </div>

                            <div>

                                <span>
                                    TOTAL REQUESTS
                                </span>

                                <strong>
                                    {leaveRequests.length}
                                </strong>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon pending-icon">
                                !
                            </div>

                            <div>

                                <span>
                                    PENDING
                                </span>

                                <strong>
                                    {
                                        leaveRequests.filter(
                                            leave =>
                                                leave.status === "PENDING"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon approved-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    APPROVED
                                </span>

                                <strong>
                                    {
                                        leaveRequests.filter(
                                            leave =>
                                                leave.status === "APPROVED"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon rejected-icon">
                                ×
                            </div>

                            <div>

                                <span>
                                    REJECTED
                                </span>

                                <strong>
                                    {
                                        leaveRequests.filter(
                                            leave =>
                                                leave.status === "REJECTED"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                )}


                {/* =========================
                    TABLE CARD
                ========================= */}

                <div className="admin-leave-card">

                    <div className="table-card-header">

                        <div>

                            <h2>
                                Leave Requests
                            </h2>

                            <p>
                                Review employee leave applications
                                and update their status.
                            </p>

                        </div>

                    </div>


                    {loading ? (

                        <div className="state-container">

                            <div className="loading-spinner"></div>

                            <h3>
                                Loading leave requests
                            </h3>

                            <p>
                                Please wait while we retrieve
                                the latest requests.
                            </p>

                        </div>

                    ) : error ? (

                        <div className="error-state">

                            <span>
                                !
                            </span>

                            <div>

                                <strong>
                                    Unable to load requests
                                </strong>

                                <p>
                                    {error}
                                </p>

                            </div>

                        </div>

                    ) : leaveRequests.length === 0 ? (

                        <div className="state-container">

                            <div className="empty-icon">
                                ▤
                            </div>

                            <h3>
                                No leave requests
                            </h3>

                            <p>
                                There are currently no employee
                                leave requests to review.
                            </p>

                        </div>

                    ) : (

                        <div className="leave-table-wrapper">

                            <table className="admin-leave-table">

                                <thead>

                                <tr>

                                    <th>
                                        EMPLOYEE
                                    </th>

                                    <th>
                                        EMAIL
                                    </th>

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

                                    <th>
                                        ACTION
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {leaveRequests.map((leave) => (

                                    <tr key={leave.id}>

                                        <td>

                                            <div className="employee-cell">

                                                <div className="employee-avatar">
                                                    {leave.employeeName
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <strong>
                                                    {leave.employeeName}
                                                </strong>

                                            </div>

                                        </td>


                                        <td className="email-cell">
                                            {leave.employeeEmail}
                                        </td>


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

            </main>

        </div>
    );
}

export default LeaveManagement;