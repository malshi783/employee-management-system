import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = role === "ADMIN";


    // =========================
    // LOAD DASHBOARD DATA
    // =========================

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                if (isAdmin) {

                    // =========================
                    // ADMIN
                    // =========================

                    const response = await api.get("/users");

                    setUsers(response.data);

                    // Find logged-in admin
                    const loggedInUser = response.data.find(
                        (user) => user.email === email
                    );

                    setCurrentUser(loggedInUser);

                } else {

                    // =========================
                    // EMPLOYEE
                    // =========================

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


    // =========================
    // ADMIN STATISTICS
    // =========================

    const adminCount = users.filter(
        (user) => user.role === "ADMIN"
    ).length;

    const employeeCount = users.filter(
        (user) => user.role === "EMPLOYEE"
    ).length;


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.clear();

        navigate("/");

    };


    return (

        <div className="dashboard-page">


            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="sidebar">

                <div className="sidebar-logo">

                    <div className="sidebar-logo-box">
                        EMS
                    </div>

                    <span>
                        Employee Management
                    </span>

                </div>


                <nav className="sidebar-nav">

                    {/* Dashboard */}

                    <button
                        className="nav-item active"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >

                        <span>▣</span>

                        Dashboard

                    </button>


                    {/* My Profile - EMPLOYEE ONLY */}

                    {!isAdmin && (

                        <button
                            className="nav-item"
                            onClick={() =>
                                navigate("/profile")
                            }
                        >

                            <span>👤</span>

                            My Profile

                        </button>

                    )}


                    {/* Employees - ADMIN ONLY */}

                    {isAdmin && (

                        <button
                            className="nav-item"
                            onClick={() =>
                                navigate("/users")
                            }
                        >

                            <span>☷</span>

                            Employees

                        </button>

                    )}
                    {!isAdmin && (
                        <button
                            className="nav-item"
                            onClick={() =>
                                navigate("/attendance")
                            }
                        >
                            <span>📊</span>
                            My Attendance
                        </button>
                    )}

                </nav>


                {/* =========================
                    SIDEBAR USER
                ========================= */}

                <div className="sidebar-bottom">

                    <div className="sidebar-user">

                        <div className="user-avatar">

                            {email
                                ?.charAt(0)
                                .toUpperCase()}

                        </div>


                        <div className="sidebar-user-info">

                            <strong>
                                {role}
                            </strong>

                            <small>
                                {email}
                            </small>

                        </div>

                    </div>


                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >

                        Logout

                    </button>

                </div>

            </aside>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="dashboard-main">


                {/* =========================
                    HEADER
                ========================= */}

                <header className="dashboard-header">

                    <div>

                        <h1>

                            {isAdmin
                                ? "Dashboard"
                                : "My Dashboard"}

                        </h1>

                        <p>
                            Welcome back, {email}
                        </p>

                    </div>


                    <div
                        className={
                            isAdmin
                                ? "header-role admin-role"
                                : "header-role employee-role"
                        }
                    >

                        {role}

                    </div>

                </header>


                {/* =====================================================
                    ADMIN DASHBOARD
                ===================================================== */}

                {isAdmin ? (

                    <>

                        {/* =========================
                            WELCOME
                        ========================= */}

                        <section className="welcome-card">

                            <div>

                                <h2>
                                    Welcome back! 👋
                                </h2>

                                <p>
                                    Here's an overview of your
                                    employee management system.
                                </p>

                            </div>


                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate("/users")
                                }
                            >

                                Manage Employees

                            </button>

                        </section>


                        {/* =========================
                            STATISTICS
                        ========================= */}

                        <section className="stats-grid">


                            {/* Total Employees */}

                            <div className="stat-card">

                                <div className="stat-icon">
                                    👥
                                </div>

                                <div>

                                    <p>
                                        Total Employees
                                    </p>

                                    <h2>

                                        {loading
                                            ? "..."
                                            : users.length}

                                    </h2>

                                </div>

                            </div>


                            {/* Administrators */}

                            <div className="stat-card">

                                <div className="stat-icon">
                                    🛡
                                </div>

                                <div>

                                    <p>
                                        Administrators
                                    </p>

                                    <h2>

                                        {loading
                                            ? "..."
                                            : adminCount}

                                    </h2>

                                </div>

                            </div>


                            {/* Employees */}

                            <div className="stat-card">

                                <div className="stat-icon">
                                    👤
                                </div>

                                <div>

                                    <p>
                                        Employees
                                    </p>

                                    <h2>

                                        {loading
                                            ? "..."
                                            : employeeCount}

                                    </h2>

                                </div>

                            </div>

                        </section>


                        {/* =========================
                            RECENT EMPLOYEES
                        ========================= */}

                        <section className="recent-card">

                            <div className="section-header">

                                <div>

                                    <h2>
                                        Employees
                                    </h2>

                                    <p>
                                        Recently available employee
                                        accounts
                                    </p>

                                </div>


                                <button
                                    className="view-all-button"
                                    onClick={() =>
                                        navigate("/users")
                                    }
                                >

                                    View All

                                </button>

                            </div>


                            {loading ? (

                                <div className="dashboard-loading">
                                    Loading employees...
                                </div>

                            ) : users.length === 0 ? (

                                <div className="dashboard-empty">
                                    No employees found.
                                </div>

                            ) : (

                                <div className="employee-preview">

                                    {users
                                        .slice(0, 4)
                                        .map((user) => (

                                            <div
                                                className="employee-row"
                                                key={user.id}
                                            >

                                                <div className="employee-info">

                                                    <div className="employee-avatar">

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


                                                <span className="role-badge">

                                                    {user.role}

                                                </span>

                                            </div>

                                        ))}

                                </div>

                            )}

                        </section>

                    </>

                ) : (

                    /* =====================================================
                       EMPLOYEE DASHBOARD
                    ===================================================== */

                    <>

                        {/* =========================
                            EMPLOYEE WELCOME
                        ========================= */}

                        <section className="employee-welcome-card">

                            <div className="employee-welcome-content">

                                <div className="employee-welcome-icon">
                                    👋
                                </div>

                                <div>

                                    <h2>
                                        Welcome back!
                                    </h2>

                                    <p>
                                        You are signed in as an
                                        Employee. Here's your
                                        account overview.
                                    </p>

                                </div>

                            </div>

                        </section>


                        {/* =========================
                            EMPLOYEE STATS
                        ========================= */}

                        <section className="stats-grid">


                            {/* Role */}

                            <div className="stat-card">

                                <div className="stat-icon">
                                    👤
                                </div>

                                <div>

                                    <p>
                                        My Role
                                    </p>

                                    <h2 className="stat-role">
                                        Employee
                                    </h2>

                                </div>

                            </div>


                            {/* Account Status */}

                            <div className="stat-card">

                                <div className="stat-icon">
                                    ✓
                                </div>

                                <div>

                                    <p>
                                        Account Status
                                    </p>

                                    <h2 className="active-status">
                                        Active
                                    </h2>

                                </div>

                            </div>


                            {/* Access Level */}

                            <div className="stat-card">

                                <div className="stat-icon">
                                    🔐
                                </div>

                                <div>

                                    <p>
                                        Access Level
                                    </p>

                                    <h2 className="stat-role">
                                        Standard
                                    </h2>

                                </div>

                            </div>

                        </section>


                        {/* =========================
                            MY ACCOUNT
                        ========================= */}

                        <section className="account-card">

                            <div className="section-header">

                                <div>

                                    <h2>
                                        My Account
                                    </h2>

                                    <p>
                                        Your employee account
                                        information
                                    </p>

                                </div>

                            </div>


                            <div className="account-details">


                                {/* =========================
                                    PROFILE AVATAR
                                ========================= */}

                                <div className="account-avatar">

                                    {currentUser?.profilePhotoUrl ? (

                                        <img
                                            src={`http://localhost:8080${currentUser.profilePhotoUrl}`}
                                            alt="Profile"
                                            className="account-avatar-image"
                                        />

                                    ) : (

                                        (
                                            currentUser?.name ||
                                            email ||
                                            "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()

                                    )}

                                </div>


                                {/* =========================
                                    ACCOUNT INFORMATION
                                ========================= */}

                                <div className="account-info">


                                    {/* Full Name */}

                                    <div className="account-item">

                                        <span>
                                            Full Name
                                        </span>

                                        <strong>
                                            {currentUser?.name ||
                                                "Employee"}
                                        </strong>

                                    </div>


                                    {/* Email */}

                                    <div className="account-item">

                                        <span>
                                            Email Address
                                        </span>

                                        <strong>
                                            {currentUser?.email ||
                                                email}
                                        </strong>

                                    </div>


                                    {/* Role */}

                                    <div className="account-item">

                                        <span>
                                            Role
                                        </span>

                                        <strong>
                                            {currentUser?.role ||
                                                role}
                                        </strong>

                                    </div>


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