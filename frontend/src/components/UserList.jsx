import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./UserList.css";

function UserList() {

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN";

    // =========================
    // FETCH USERS
    // =========================

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setMessage("");

            const response = await api.get("/users");

            console.log("Users response:", response.data);

            setUsers(response.data);

        } catch (error) {

            console.error("Error fetching users:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                setMessage(
                    "Your login session is invalid or expired. Please login again."
                );
            } else {
                setMessage("Could not load employees.");
            }

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOAD USERS
    // =========================

    useEffect(() => {
        fetchUsers();
    }, []);


    // =========================
    // DELETE USER
    // =========================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/users/${id}`);

            setMessage("Employee deleted successfully.");

            fetchUsers();

        } catch (error) {

            console.error("Delete error:", error);

            setMessage("Could not delete employee.");

        }
    };


    // =========================
    // SEARCH
    // =========================

    const filteredUsers = users.filter((user) => {

        const searchText = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(searchText) ||
            user.email?.toLowerCase().includes(searchText) ||
            user.role?.toLowerCase().includes(searchText)
        );

    });


    return (

        <div className="users-page">

            <div className="users-container">

                {/* =========================
                    HEADER
                ========================= */}

                <header className="users-header">

                    <div>

                        <h1>
                            Employee Management
                        </h1>

                        <p>
                            Manage employees and their account information
                        </p>

                    </div>


                    <div className="users-header-actions">

                        <button
                            className="secondary-button"
                            onClick={() => navigate("/dashboard")}
                        >
                            ← Dashboard
                        </button>


                        {isAdmin && (

                            <button
                                className="primary-button"
                                onClick={() => navigate("/add-employee")}
                            >
                                + Add Employee
                            </button>

                        )}

                    </div>

                </header>


                {/* =========================
                    MESSAGE
                ========================= */}

                {message && (

                    <div className="users-message">
                        {message}
                    </div>

                )}


                {/* =========================
                    TOOLBAR
                ========================= */}

                <div className="users-toolbar">

                    <div className="search-wrapper">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>


                    <span className="employee-count">

                        {filteredUsers.length} employee
                        {filteredUsers.length !== 1 ? "s" : ""}

                    </span>

                </div>


                {/* =========================
                    TABLE CARD
                ========================= */}

                <div className="users-card">

                    {loading ? (

                        <div className="users-empty">

                            <div className="loading-spinner"></div>

                            <h2>
                                Loading employees...
                            </h2>

                            <p>
                                Please wait.
                            </p>

                        </div>

                    ) : filteredUsers.length === 0 ? (

                        <div className="users-empty">

                            <div className="empty-icon">
                                👥
                            </div>

                            <h2>
                                No employees found
                            </h2>

                            <p>

                                {search
                                    ? "Try a different search."
                                    : "There are currently no employees in the system."
                                }

                            </p>


                            {!search && isAdmin && (

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate("/add-employee")
                                    }
                                >
                                    + Add First Employee
                                </button>

                            )}

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="users-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>

                                        <th>Employee</th>

                                        <th>Email</th>

                                        <th>Role</th>

                                        {isAdmin && (
                                            <th>Actions</th>
                                        )}

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredUsers.map((user) => (

                                        <tr key={user.id}>

                                            <td>
                                                <span className="user-id">
                                                    #{user.id}
                                                </span>
                                            </td>


                                            <td>

                                                <div className="employee-cell">

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
                                                            Employee
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="email-text">
                                                    {user.email}
                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        user.role === "ADMIN"
                                                            ? "role-badge admin"
                                                            : "role-badge employee"
                                                    }
                                                >
                                                    {user.role}
                                                </span>

                                            </td>


                                            {isAdmin && (

                                                <td>

                                                    <div className="action-buttons">

                                                        <button
                                                            className="edit-button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/users/edit/${user.id}`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            )}

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

export default UserList;