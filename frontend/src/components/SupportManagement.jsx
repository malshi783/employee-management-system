import { useEffect, useState } from "react";

import api from "../api/api";
import Sidebar from "./Sidebar";

import "./SupportManagement.css";

function SupportManagement() {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");


    const loadRequests = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/support");

            setRequests(response.data);

        } catch (error) {

            console.error(
                "Error loading support requests:",
                error
            );

            setMessage(
                "Failed to load support requests."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadRequests();
    }, []);


    const handleResolve = async (id) => {

        try {

            await api.put(
                `/support/${id}/resolve`
            );

            setMessage(
                "Support request resolved successfully."
            );

            await loadRequests();

        } catch (error) {

            console.error(
                "Error resolving support request:",
                error
            );

            setMessage(
                "Failed to resolve support request."
            );
        }
    };


    const pendingCount =
        requests.filter(
            (request) =>
                request.status === "PENDING"
        ).length;


    const resolvedCount =
        requests.filter(
            (request) =>
                request.status === "RESOLVED"
        ).length;


    if (loading) {

        return (
            <div className="support-management-layout">

                <Sidebar />

                <main className="support-management-page">

                    <div className="support-loading">
                        Loading support requests...
                    </div>

                </main>

            </div>
        );
    }


    return (

        <div className="support-management-layout">

            <Sidebar />

            <main className="support-management-page">

                {/* HEADER */}
                <div className="support-management-header">

                    <div>

                        <div className="support-eyebrow">
                            ADMINISTRATION
                        </div>

                        <h1>
                            Support Management
                        </h1>

                        <p>
                            Review and manage employee support requests.
                        </p>

                    </div>

                </div>


                {/* MESSAGE */}
                {message && (

                    <div className="support-management-message">
                        {message}
                    </div>

                )}


                {/* SUMMARY */}
                <div className="support-summary">

                    <div className="support-summary-card">

                        <div className="support-summary-icon total">
                            ?
                        </div>

                        <div>
                            <span>
                                Total Requests
                            </span>

                            <strong>
                                {requests.length}
                            </strong>
                        </div>

                    </div>


                    <div className="support-summary-card">

                        <div className="support-summary-icon pending">
                            !
                        </div>

                        <div>
                            <span>
                                Pending
                            </span>

                            <strong>
                                {pendingCount}
                            </strong>
                        </div>

                    </div>


                    <div className="support-summary-card">

                        <div className="support-summary-icon resolved">
                            ✓
                        </div>

                        <div>
                            <span>
                                Resolved
                            </span>

                            <strong>
                                {resolvedCount}
                            </strong>
                        </div>

                    </div>

                </div>


                {/* TABLE CARD */}
                <div className="support-management-card">

                    {requests.length === 0 ? (

                        <div className="support-empty">

                            <div className="support-empty-icon">
                                ?
                            </div>

                            <h3>
                                No support requests
                            </h3>

                            <p>
                                There are currently no employee support requests.
                            </p>

                        </div>

                    ) : (

                        <div className="support-table-wrapper">

                            <table className="support-management-table">

                                <thead>

                                <tr>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Subject
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                                </thead>

                                <tbody>

                                {requests.map(
                                    (request) => (

                                        <tr
                                            key={request.id}
                                        >

                                            <td>

                                                <div className="support-employee">

                                                    <div className="support-avatar">

                                                        {request.employeeName
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                .toUpperCase() ||
                                                            "U"}

                                                    </div>

                                                    <span>
                                                            {request.employeeName}
                                                        </span>

                                                </div>

                                            </td>


                                            <td className="support-email">
                                                {request.employeeEmail}
                                            </td>


                                            <td className="support-subject">
                                                {request.subject}
                                            </td>


                                            <td className="support-description">
                                                {request.description}
                                            </td>


                                            <td>

                                                    <span
                                                        className={`support-management-status ${
                                                            request.status ===
                                                            "RESOLVED"
                                                                ? "resolved"
                                                                : "pending"
                                                        }`}
                                                    >
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


                                            <td>

                                                {request.status ===
                                                "PENDING" ? (

                                                    <button
                                                        className="resolve-button"
                                                        onClick={() =>
                                                            handleResolve(
                                                                request.id
                                                            )
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

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default SupportManagement;