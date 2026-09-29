import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./MyAttendance.css";

function MyAttendance() {
    const navigate = useNavigate();

    const [attendance, setAttendance] = useState([]);
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        late: 0,
        percentage: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const [attendanceResponse, statsResponse] =
                await Promise.all([
                    api.get("/attendance/me"),
                    api.get("/attendance/me/stats")
                ]);

            setAttendance(attendanceResponse.data);
            setStats(statsResponse.data);

        } catch (error) {
            console.error("Could not load attendance:", error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Could not load your attendance."
                );
            } else {
                setError("Could not connect to the backend.");
            }
        } finally {
            setLoading(false);
        }
    };


    const getStatusClass = (status) => {
        switch (status) {
            case "PRESENT":
                return "attendance-status present";

            case "ABSENT":
                return "attendance-status absent";

            case "LATE":
                return "attendance-status late";

            default:
                return "attendance-status";
        }
    };


    const formatStatus = (status) => {
        if (!status) return "-";

        return status.charAt(0) +
            status.slice(1).toLowerCase();
    };


    if (loading) {
        return (
            <div className="attendance-page">
                <div className="attendance-loading">
                    <div className="loading-spinner"></div>
                    <h2>Loading attendance...</h2>
                    <p>Please wait.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="attendance-page">

            <div className="attendance-container">

                {/* =========================
                    HEADER
                ========================= */}

                <header className="attendance-header">

                    <div>

                        <button
                            className="attendance-back-button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            ← Dashboard
                        </button>

                        <h1>My Attendance</h1>

                        <p>
                            View your attendance summary and history
                        </p>

                    </div>

                    <button
                        className="attendance-refresh-button"
                        onClick={fetchAttendance}
                    >
                        ↻ Refresh
                    </button>

                </header>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (
                    <div className="attendance-error">
                        {error}
                    </div>
                )}


                {/* =========================
                    STATISTICS
                ========================= */}

                <section className="attendance-stats">

                    <div className="attendance-stat-card">

                        <div className="attendance-stat-icon percentage">
                            %
                        </div>

                        <div>
                            <span>Attendance Rate</span>

                            <strong>
                                {Number(stats.percentage || 0).toFixed(1)}%
                            </strong>
                        </div>

                    </div>


                    <div className="attendance-stat-card">

                        <div className="attendance-stat-icon present-icon">
                            ✓
                        </div>

                        <div>
                            <span>Present</span>

                            <strong>
                                {stats.present}
                            </strong>
                        </div>

                    </div>


                    <div className="attendance-stat-card">

                        <div className="attendance-stat-icon late-icon">
                            !
                        </div>

                        <div>
                            <span>Late</span>

                            <strong>
                                {stats.late}
                            </strong>
                        </div>

                    </div>


                    <div className="attendance-stat-card">

                        <div className="attendance-stat-icon absent-icon">
                            ×
                        </div>

                        <div>
                            <span>Absent</span>

                            <strong>
                                {stats.absent}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* =========================
                    ATTENDANCE PROGRESS
                ========================= */}

                <section className="attendance-summary-card">

                    <div className="summary-header">

                        <div>
                            <h2>Attendance Overview</h2>

                            <p>
                                Your current attendance performance
                            </p>
                        </div>

                        <strong className="summary-percentage">
                            {Number(stats.percentage || 0).toFixed(1)}%
                        </strong>

                    </div>


                    <div className="progress-background">

                        <div
                            className="progress-fill"
                            style={{
                                width: `${Math.min(
                                    Number(stats.percentage || 0),
                                    100
                                )}%`
                            }}
                        ></div>

                    </div>

                </section>


                {/* =========================
                    ATTENDANCE HISTORY
                ========================= */}

                <section className="attendance-history-card">

                    <div className="history-header">

                        <div>
                            <h2>Attendance History</h2>

                            <p>
                                Your recent attendance records
                            </p>
                        </div>

                        <span className="record-count">
                            {attendance.length} records
                        </span>

                    </div>


                    {attendance.length === 0 ? (

                        <div className="empty-attendance">

                            <div className="empty-icon">
                                📅
                            </div>

                            <h3>No attendance records</h3>

                            <p>
                                Your attendance records will appear here
                                once they are added.
                            </p>

                        </div>

                    ) : (

                        <div className="attendance-table-wrapper">

                            <table className="attendance-table">

                                <thead>

                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>

                                </thead>

                                <tbody>

                                {attendance.map((record) => (

                                    <tr key={record.id}>

                                        <td>
                                            <div className="attendance-date">
                                                    <span className="calendar-icon">
                                                        📅
                                                    </span>

                                                {record.date}
                                            </div>
                                        </td>

                                        <td>

                                                <span
                                                    className={getStatusClass(
                                                        record.status
                                                    )}
                                                >
                                                    <span className="status-dot">
                                                        ●
                                                    </span>

                                                    {formatStatus(
                                                        record.status
                                                    )}
                                                </span>

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default MyAttendance;