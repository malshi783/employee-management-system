import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "./Sidebar";
import "./AttendanceManagement.css";

const getToday = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${date.getFullYear()}-${month}-${day}`;
};

const getRequestErrorMessage = (requestError, fallback) => {
    const data = requestError.response?.data;
    if (typeof data === "string") {
        return data;
    }

    return data?.detail || data?.message || fallback;
};

function AttendanceManagement() {
    const role = localStorage.getItem("role");
    const [date, setDate] = useState(getToday);
    const [employees, setEmployees] = useState([]);
    const [statuses, setStatuses] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        let active = true;

        const loadAttendance = async () => {
            setLoading(true);
            setError("");
            setMessage("");

            try {
                const [usersResponse, attendanceResponse] = await Promise.all([
                    api.get("/users"),
                    api.get("/attendance", { params: { date } })
                ]);

                if (!active) {
                    return;
                }

                setEmployees(
                    usersResponse.data
                        .filter((user) => user.role?.toUpperCase() === "EMPLOYEE")
                        .sort((first, second) =>
                            (first.name || "").localeCompare(second.name || "")
                        )
                );

                setStatuses(
                    Object.fromEntries(
                        attendanceResponse.data.map((record) => [
                            record.userId,
                            record.status
                        ])
                    )
                );
            } catch (loadError) {
                console.error("Could not load attendance management data:", loadError);
                if (active) {
                    setError(
                        getRequestErrorMessage(
                            loadError,
                            "Could not load employees and attendance for this date."
                        )
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadAttendance();

        return () => {
            active = false;
        };
    }, [date]);

    const filteredEmployees = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return employees;
        }

        return employees.filter((employee) =>
            employee.name?.toLowerCase().includes(query) ||
            employee.email?.toLowerCase().includes(query)
        );
    }, [employees, search]);

    const summary = useMemo(() => {
        const values = Object.values(statuses);

        return {
            present: values.filter((status) => status === "PRESENT").length,
            late: values.filter((status) => status === "LATE").length,
            absent: values.filter((status) => status === "ABSENT").length,
            unmarked: Math.max(employees.length - values.length, 0)
        };
    }, [employees.length, statuses]);

    const handleStatusChange = (employeeId, status) => {
        setStatuses((current) => ({ ...current, [employeeId]: status }));
        setMessage("");
        setError("");
    };

    const saveAttendance = async (employeeId) => {
        const status = statuses[employeeId];
        if (!status) {
            setError("Choose an attendance status before saving.");
            return;
        }

        setSavingId(employeeId);
        setError("");
        setMessage("");

        try {
            await api.post("/attendance", {
                userId: employeeId,
                date,
                status
            });
            setMessage("Attendance saved.");
        } catch (saveError) {
            console.error("Could not save attendance:", saveError);
            setError(
                getRequestErrorMessage(
                    saveError,
                    "Could not save attendance. Please try again."
                )
            );
        } finally {
            setSavingId(null);
        }
    };

    if (role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="admin-attendance-layout">
            <Sidebar />
            <main className="admin-attendance-main">
                <header className="admin-attendance-header">
                    <div>
                        <span className="admin-attendance-eyebrow">EMPLOYEE MANAGEMENT</span>
                        <h1>Attendance Management</h1>
                        <p>Record and update each employee’s daily attendance.</p>
                    </div>
                    <label className="admin-attendance-date">
                        <span>Attendance date</span>
                        <input
                            type="date"
                            value={date}
                            max={getToday()}
                            onChange={(event) =>
                                setDate(event.target.value || getToday())
                            }
                        />
                    </label>
                </header>

                {error && <div className="admin-attendance-alert error" role="alert">{error}</div>}
                {message && <div className="admin-attendance-alert success" role="status">{message}</div>}

                <section className="admin-attendance-summary" aria-label="Attendance summary">
                    <div><span>Present</span><strong>{summary.present}</strong></div>
                    <div><span>Late</span><strong>{summary.late}</strong></div>
                    <div><span>Absent</span><strong>{summary.absent}</strong></div>
                    <div><span>Not marked</span><strong>{summary.unmarked}</strong></div>
                </section>

                <section className="admin-attendance-card">
                    <div className="admin-attendance-toolbar">
                        <div>
                            <h2>Daily attendance</h2>
                            <p>Choose a status and save it for each employee.</p>
                        </div>
                        <input
                            className="admin-attendance-search"
                            type="search"
                            placeholder="Search employees"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Search employees"
                        />
                    </div>

                    {loading ? (
                        <div className="admin-attendance-empty">Loading attendance...</div>
                    ) : employees.length === 0 ? (
                        <div className="admin-attendance-empty">
                            No employee accounts found. Add employees before recording attendance.
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="admin-attendance-empty">No employees match your search.</div>
                    ) : (
                        <div className="admin-attendance-table-wrap">
                            <table className="admin-attendance-table">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td className="admin-attendance-name">{employee.name}</td>
                                            <td>{employee.email}</td>
                                            <td>
                                                <select
                                                    value={statuses[employee.id] || ""}
                                                    onChange={(event) =>
                                                        handleStatusChange(employee.id, event.target.value)
                                                    }
                                                    aria-label={`Attendance status for ${employee.name}`}
                                                >
                                                    <option value="">Not marked</option>
                                                    <option value="PRESENT">Present</option>
                                                    <option value="LATE">Late</option>
                                                    <option value="ABSENT">Absent</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    className="admin-attendance-save"
                                                    type="button"
                                                    disabled={!statuses[employee.id] || savingId === employee.id}
                                                    onClick={() => void saveAttendance(employee.id)}
                                                >
                                                    {savingId === employee.id ? "Saving..." : "Save"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default AttendanceManagement;
