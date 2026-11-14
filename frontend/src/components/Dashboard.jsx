import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "./Sidebar";

import "./Dashboard.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");


function Dashboard() {
    const navigate = useNavigate();

    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    const isAdmin = role === "ADMIN";

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* =====================================================
       LOAD DASHBOARD DATA
    ===================================================== */

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (isAdmin) {
                    // ADMIN
                    const response = await api.get("/users");

                    setUsers(response.data);

                    const loggedInUser = response.data.find(
                        (user) => user.email === email
                    );

                    setCurrentUser(loggedInUser);
                } else {
                    // EMPLOYEE
                    const response = await api.get("/profile/me");

                    setCurrentUser(response.data);
                }
            } catch (error) {
                console.error(
                    "Could not load dashboard data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [email, isAdmin]);


    /* =====================================================
       ADMIN STATISTICS
    ===================================================== */

    const totalUsers = users.length;

    const employeeCount = users.filter(
        (user) => user.role === "EMPLOYEE"
    ).length;

    const adminCount = users.filter(
        (user) => user.role === "ADMIN"
    ).length;


    /* =====================================================
       USER INFORMATION
    ===================================================== */

    const displayName =
        currentUser?.name ||
        email?.split("@")[0] ||
        "User";

    const initial =
        displayName.charAt(0).toUpperCase();


    /* =====================================================
       EMPLOYEE QUICK ACTIONS
    ===================================================== */

    const employeeActions = [
        {
            title: "My Profile",
            description: "View personal details",
            icon: "◉",
            path: "/profile"
        },
        {
            title: "Attendance",
            description: "Check attendance",
            icon: "✓",
            path: "/attendance"
        },
        {
            title: "My Leave",
            description: "Manage leave requests",
            icon: "▤",
            path: "/leave"
        },
        {
            title: "Support",
            description: "Get help and support",
            icon: "?",
            path: "/support"
        }
    ];


    /* =====================================================
       ADMIN QUICK ACTIONS
    ===================================================== */

    const adminActions = [
        {
            title: "Employees",
            description: "Manage employee records",
            icon: "♙",
            path: "/users"
        },

        {
            title: "Leave Management",
            description: "Review leave requests",
            icon: "▤",
            path: "/leave-management"
        },
        {
            title: "Support Management",
            description: "Manage support requests",
            icon: "?",
            path: "/support-management"
        }
    ];


    const quickActions = isAdmin
        ? adminActions
        : employeeActions;


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="dashboard-loading-page">

                <div className="dashboard-spinner"></div>

                <p>Loading dashboard...</p>

            </div>
        );
    }


    /* =====================================================
       MAIN DASHBOARD
    ===================================================== */

    return (
        <div className="dashboard-page">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar />


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="dashboard-main">


                {/* =================================================
                    TOP HEADER
                ================================================= */}

                <header className="dashboard-topbar">

                    <div className="dashboard-heading">

                        <span className="dashboard-label">
                            {isAdmin
                                ? "ADMIN DASHBOARD"
                                : "MY WORKSPACE"}
                        </span>

                        <h1>
                            Good morning, {displayName}
                            <span className="heading-wave">
                                👋
                            </span>
                        </h1>

                        <p>
                            {isAdmin
                                ? "Here's an overview of your employee management system."
                                : "Here's what's happening with your workspace today."}
                        </p>

                    </div>


                    <div className="dashboard-user-area">

                        <button
                            className="notification-button"
                            type="button"
                            aria-label="Notifications"
                        >
                            ♧

                            <span className="notification-dot"></span>
                        </button>


                        <div className="top-user">

                            <div className="top-user-avatar">

                                {currentUser?.profilePhotoUrl ? (
                                    <img
                                        src={`${BACKEND_URL}${currentUser.profilePhotoUrl}`}
                                        alt="Profile"
                                    />
                                ) : (
                                    initial
                                )}

                            </div>


                            <div className="top-user-info">

                                <strong>
                                    {displayName}
                                </strong>

                                <span>
                                    {role}
                                </span>

                            </div>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    ADMIN DASHBOARD
                ================================================= */}

                {isAdmin ? (

                    <>

                        {/* ================================
                            ADMIN WELCOME
                        ================================= */}

                        <section className="welcome-banner">

                            <div className="welcome-content">

                                <span className="welcome-label">
                                    MANAGEMENT OVERVIEW
                                </span>

                                <h2>
                                    Welcome back, {displayName}!
                                </h2>

                                <p>
                                    Manage employees, monitor
                                    attendance, review leave and
                                    handle support requests from
                                    one place.
                                </p>

                            </div>


                            <div className="welcome-avatar">

                                {currentUser?.profilePhotoUrl ? (
                                    <img
                                        src={`${BACKEND_URL}${currentUser.profilePhotoUrl}`}
                                        alt="Profile"
                                    />
                                ) : (
                                    initial
                                )}

                            </div>

                        </section>


                        {/* ================================
                            ADMIN STATISTICS
                        ================================= */}

                        <section className="statistics-section">

                            <div className="section-title">

                                <div>
                                    <span>OVERVIEW</span>

                                    <h2>
                                        System at a glance
                                    </h2>
                                </div>

                            </div>


                            <div className="statistics-grid">


                                {/* Total Users */}

                                <div className="stat-card">

                                    <div className="stat-card-icon">
                                        ♙
                                    </div>

                                    <div className="stat-card-content">

                                        <span>
                                            Total Users
                                        </span>

                                        <strong>
                                            {totalUsers}
                                        </strong>

                                        <small>
                                            Registered accounts
                                        </small>

                                    </div>

                                </div>


                                {/* Employees */}

                                <div className="stat-card green-stat">

                                    <div className="stat-card-icon">
                                        ✓
                                    </div>

                                    <div className="stat-card-content">

                                        <span>
                                            Employees
                                        </span>

                                        <strong>
                                            {employeeCount}
                                        </strong>

                                        <small>
                                            Active employees
                                        </small>

                                    </div>

                                </div>


                                {/* Administrators */}

                                <div className="stat-card">

                                    <div className="stat-card-icon">
                                        ◆
                                    </div>

                                    <div className="stat-card-content">

                                        <span>
                                            Administrators
                                        </span>

                                        <strong>
                                            {adminCount}
                                        </strong>

                                        <small>
                                            System administrators
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* ================================
                            ADMIN QUICK ACTIONS
                        ================================= */}

                        <section className="quick-section">

                            <div className="section-title">

                                <div>

                                    <span>
                                        QUICK ACTIONS
                                    </span>

                                    <h2>
                                        What would you like to manage?
                                    </h2>

                                </div>

                            </div>


                            <div className="quick-actions-grid">

                                {quickActions.map((action) => (

                                    <button
                                        key={action.path}
                                        className="quick-action-card"
                                        onClick={() =>
                                            navigate(action.path)
                                        }
                                    >

                                        <div className="quick-action-icon">
                                            {action.icon}
                                        </div>


                                        <div className="quick-action-content">

                                            <strong>
                                                {action.title}
                                            </strong>

                                            <span>
                                                {action.description}
                                            </span>

                                        </div>


                                        <span className="quick-action-arrow">
                                            →
                                        </span>

                                    </button>

                                ))}

                            </div>

                        </section>


                        {/* ================================
                            RECENT EMPLOYEES
                        ================================= */}

                        <section className="recent-section">

                            <div className="recent-card">

                                <div className="card-header">

                                    <div>

                                        <span>
                                            EMPLOYEE DIRECTORY
                                        </span>

                                        <h2>
                                            Recent employees
                                        </h2>

                                    </div>


                                    <button
                                        className="view-all-button"
                                        onClick={() =>
                                            navigate("/users")
                                        }
                                    >
                                        View all →
                                    </button>

                                </div>


                                <div className="employee-list">

                                    {users
                                        .slice(0, 5)
                                        .map((user) => (

                                            <div
                                                className="employee-row"
                                                key={user.id}
                                            >

                                                <div className="employee-row-user">

                                                    <div className="employee-row-avatar">

                                                        {user.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {user.name}
                                                        </strong>

                                                        <span>
                                                            {user.email}
                                                        </span>

                                                    </div>

                                                </div>


                                                <span className="employee-role-badge">

                                                    {user.role}

                                                </span>

                                            </div>

                                        ))}

                                </div>

                            </div>


                            {/* About card */}

                            <div className="about-dashboard-card">

                                <div className="about-icon">
                                    EMS
                                </div>

                                <span>
                                    EMPLOYEE MANAGEMENT SYSTEM
                                </span>

                                <h2>
                                    Simple. Secure. Organized.
                                </h2>

                                <p>
                                    Manage your organization's
                                    employees, attendance, leave
                                    requests and support activities
                                    from one centralized platform.
                                </p>

                            </div>

                        </section>

                    </>

                ) : (

                    /* =================================================
                       EMPLOYEE DASHBOARD
                    ================================================= */

                    <>


                        {/* ================================
                            EMPLOYEE WELCOME
                        ================================= */}

                        <section className="employee-welcome-banner">

                            <div>

                                <span>
                                    MY WORKSPACE
                                </span>

                                <h2>
                                    Welcome, {displayName}!
                                </h2>

                                <p>
                                    Access your profile, attendance,
                                    leave and support from one place.
                                </p>

                            </div>


                            <div className="employee-banner-avatar">

                                {currentUser?.profilePhotoUrl ? (
                                    <img
                                        src={`${BACKEND_URL}${currentUser.profilePhotoUrl}`}
                                        alt="Profile"
                                    />
                                ) : (
                                    initial
                                )}

                            </div>

                        </section>




                        {/* ================================
                            EMPLOYEE QUICK ACTIONS
                        ================================= */}

                        <section className="quick-section">

                            <div className="section-title">

                                <div>

                                    <span>
                                        QUICK ACCESS
                                    </span>

                                    <h2>
                                        Manage your workspace
                                    </h2>

                                </div>

                            </div>


                            <div className="quick-actions-grid">

                                {quickActions.map((action) => (

                                    <button
                                        key={action.path}
                                        className="quick-action-card"
                                        onClick={() =>
                                            navigate(action.path)
                                        }
                                    >

                                        <div className="quick-action-icon">
                                            {action.icon}
                                        </div>


                                        <div className="quick-action-content">

                                            <strong>
                                                {action.title}
                                            </strong>

                                            <span>
                                                {action.description}
                                            </span>

                                        </div>


                                        <span className="quick-action-arrow">
                                            →
                                        </span>

                                    </button>

                                ))}

                            </div>

                        </section>


                        {/* ================================
                            PERSONAL INFORMATION
                        ================================= */}

                        <section className="personal-section">

                            <div className="personal-card">

                                <div className="card-header">

                                    <div>

                                        <span>
                                            PERSONAL INFORMATION
                                        </span>

                                        <h2>
                                            My Profile
                                        </h2>

                                    </div>


                                    <button
                                        className="view-all-button"
                                        onClick={() =>
                                            navigate("/profile")
                                        }
                                    >
                                        View profile →
                                    </button>

                                </div>


                                <div className="profile-summary">

                                    <div className="profile-summary-avatar">

                                        {currentUser?.profilePhotoUrl ? (
                                            <img
                                                src={`${BACKEND_URL}${currentUser.profilePhotoUrl}`}
                                                alt="Profile"
                                            />
                                        ) : (
                                            initial
                                        )}

                                    </div>


                                    <div className="profile-summary-info">

                                        <h3>
                                            {currentUser?.name ||
                                                displayName}
                                        </h3>

                                        <p>
                                            {currentUser?.email ||
                                                email}
                                        </p>

                                        <span className="profile-role">
                                            EMPLOYEE
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* ================================
                            EMPLOYEE INFO CARDS
                        ================================= */}

                        <section className="employee-info-grid">

                            <div className="info-mini-card">

                                <div className="info-mini-icon green">
                                    ✓
                                </div>

                                <div>

                                    <span>
                                        ACCOUNT STATUS
                                    </span>

                                    <strong>
                                        Active
                                    </strong>

                                </div>

                            </div>


                            <div className="info-mini-card">

                                <div className="info-mini-icon">
                                    ◉
                                </div>

                                <div>

                                    <span>
                                        ACCESS LEVEL
                                    </span>

                                    <strong>
                                        Employee
                                    </strong>

                                </div>

                            </div>


                            <div className="info-mini-card">

                                <div className="info-mini-icon">
                                    #
                                </div>

                                <div>

                                    <span>
                                        ACCOUNT EMAIL
                                    </span>

                                    <strong>
                                        {currentUser?.email ||
                                            email}
                                    </strong>

                                </div>

                            </div>

                        </section>

                    </>
                )}

            </main>

        </div>
    );
}

export default Dashboard;