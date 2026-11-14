import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");

    const isAdmin = role === "ADMIN";

    const displayName =
        name ||
        email?.split("@")[0] ||
        "User";

    const getInitial = () => {
        return displayName.charAt(0).toUpperCase();
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="app-sidebar">

            {/* BRAND */}
            <div className="sidebar-brand">

                <div className="sidebar-brand-logo">
                    EMS
                </div>

                <div className="sidebar-brand-text">
                    <strong>Employee</strong>
                    <span>Management System</span>
                </div>

            </div>

            {/* NAVIGATION */}
            <nav className="app-navigation">

                <div className="navigation-label">
                    MAIN
                </div>

                {/* DASHBOARD */}
                <button
                    className={`sidebar-link ${
                        isActive("/dashboard") ? "active" : ""
                    }`}
                    onClick={() => navigate("/dashboard")}
                >
                    <span className="sidebar-icon">▣</span>
                    <span>Dashboard</span>
                </button>


                {/* ADMIN MENU */}
                {isAdmin && (
                    <>
                        <button
                            className={`sidebar-link ${
                                isActive("/users") ? "active" : ""
                            }`}
                            onClick={() => navigate("/users")}
                        >
                            <span className="sidebar-icon">♙</span>
                            <span>Employees</span>
                        </button>

                        <button
                            className={`sidebar-link ${
                                isActive("/leave-management")
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate("/leave-management")
                            }
                        >
                            <span className="sidebar-icon">▤</span>
                            <span>Leave Management</span>
                        </button>

                        <button
                            className={`sidebar-link ${
                                isActive("/support-management")
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate("/support-management")
                            }
                        >
                            <span className="sidebar-icon">?</span>
                            <span>Support Management</span>
                        </button>
                    </>
                )}


                {/* EMPLOYEE MENU */}
                {!isAdmin && (
                    <>
                        <button
                            className={`sidebar-link ${
                                isActive("/attendance")
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate("/attendance")
                            }
                        >
                            <span className="sidebar-icon">✓</span>
                            <span>My Attendance</span>
                        </button>

                        <button
                            className={`sidebar-link ${
                                isActive("/leave")
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate("/leave")
                            }
                        >
                            <span className="sidebar-icon">▤</span>
                            <span>My Leave</span>
                        </button>

                        <button
                            className={`sidebar-link ${
                                isActive("/support")
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate("/support")
                            }
                        >
                            <span className="sidebar-icon">?</span>
                            <span>My Support</span>
                        </button>
                    </>
                )}


                {/* PERSONAL */}
                <div className="navigation-label personal-label">
                    PERSONAL
                </div>

                <button
                    className={`sidebar-link ${
                        isActive("/profile") ? "active" : ""
                    }`}
                    onClick={() => navigate("/profile")}
                >
                    <span className="sidebar-icon">◉</span>
                    <span>My Profile</span>
                </button>

            </nav>


            {/* FOOTER */}
            <div className="sidebar-footer">

                <div className="sidebar-user">

                    <div className="sidebar-user-avatar">
                        {getInitial()}
                    </div>

                    <div className="sidebar-user-details">
                        <strong>{displayName}</strong>
                        <span>{role}</span>
                    </div>

                </div>

                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;