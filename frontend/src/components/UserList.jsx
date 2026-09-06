import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function UserList() {

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setMessage("");

            const response = await api.get("/users");

            console.log("Users response:", response.data);

            setUsers(response.data);

        } catch (error) {

            console.error("Error fetching users:", error);

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);

            if (error.response?.status === 401 ||
                error.response?.status === 403) {

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

    useEffect(() => {

        fetchUsers();

    }, []);

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

    const filteredUsers = users.filter((user) => {

        const searchText = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(searchText) ||
            user.email?.toLowerCase().includes(searchText) ||
            user.role?.toLowerCase().includes(searchText)
        );
    });

    return (

        <div style={styles.page}>

            <div style={styles.container}>

                {/* Header */}

                <div style={styles.header}>

                    <div>

                        <h1 style={styles.title}>
                            Employee Management
                        </h1>

                        <p style={styles.subtitle}>
                            Manage employees and their account information
                        </p>

                    </div>

                    <div style={styles.headerButtons}>

                        <button
                            style={styles.secondaryButton}
                            onClick={() => navigate("/dashboard")}
                        >
                            ← Dashboard
                        </button>

                        <button
                            style={styles.primaryButton}
                            onClick={() => navigate("/users/add")}
                        >
                            + Add Employee
                        </button>

                    </div>

                </div>


                {/* Message */}

                {message && (

                    <div style={styles.message}>
                        {message}
                    </div>

                )}


                {/* Search */}

                <div style={styles.toolbar}>

                    <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.search}
                    />

                    <span style={styles.count}>
                        {filteredUsers.length} employee
                        {filteredUsers.length !== 1 ? "s" : ""}
                    </span>

                </div>


                {/* Employee Table */}

                <div style={styles.card}>

                    {loading ? (

                        <div style={styles.empty}>
                            <h2>Loading employees...</h2>
                            <p>Please wait.</p>
                        </div>

                    ) : filteredUsers.length === 0 ? (

                        <div style={styles.empty}>

                            <div style={styles.icon}>
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

                            {!search && (

                                <button
                                    style={styles.primaryButton}
                                    onClick={() =>
                                        navigate("/users/add")
                                    }
                                >
                                    + Add First Employee
                                </button>

                            )}

                        </div>

                    ) : (

                        <table style={styles.table}>

                            <thead>

                                <tr>

                                    <th style={styles.th}>
                                        ID
                                    </th>

                                    <th style={styles.th}>
                                        Employee
                                    </th>

                                    <th style={styles.th}>
                                        Email
                                    </th>

                                    <th style={styles.th}>
                                        Role
                                    </th>

                                    <th style={styles.th}>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        <td style={styles.td}>
                                            #{user.id}
                                        </td>

                                        <td style={styles.td}>

                                            <div style={styles.employee}>

                                                <div style={styles.avatar}>
                                                    {user.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <strong>
                                                    {user.name}
                                                </strong>

                                            </div>

                                        </td>

                                        <td style={styles.td}>
                                            {user.email}
                                        </td>

                                        <td style={styles.td}>

                                            <span style={styles.role}>
                                                {user.role}
                                            </span>

                                        </td>

                                        <td style={styles.td}>

                                            <button
                                                style={styles.editButton}
                                                onClick={() =>
                                                    navigate(
                                                        `/users/edit/${user.id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                style={styles.deleteButton}
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </div>
    );
}


const styles = {

    page: {
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif"
    },

    container: {
        maxWidth: "1200px",
        margin: "0 auto"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "35px"
    },

    title: {
        margin: 0,
        fontSize: "36px",
        color: "#1f2937"
    },

    subtitle: {
        color: "#6b7280",
        marginTop: "8px",
        fontSize: "16px"
    },

    headerButtons: {
        display: "flex",
        gap: "12px"
    },

    primaryButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600"
    },

    secondaryButton: {
        background: "white",
        color: "#374151",
        border: "1px solid #d1d5db",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "15px"
    },

    message: {
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
        color: "#047857",
        padding: "15px 18px",
        borderRadius: "8px",
        marginBottom: "22px"
    },

    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },

    search: {
        width: "400px",
        padding: "13px 16px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "15px",
        outline: "none"
    },

    count: {
        color: "#6b7280",
        fontSize: "14px"
    },

    card: {
        background: "white",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    th: {
        textAlign: "left",
        padding: "18px",
        background: "#f9fafb",
        color: "#374151",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "14px"
    },

    td: {
        padding: "18px",
        borderBottom: "1px solid #f1f5f9",
        color: "#4b5563"
    },

    employee: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#111827"
    },

    avatar: {
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        background: "#dbeafe",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold"
    },

    role: {
        background: "#eff6ff",
        color: "#2563eb",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600"
    },

    editButton: {
        background: "#f3f4f6",
        color: "#374151",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        marginRight: "8px"
    },

    deleteButton: {
        background: "#fee2e2",
        color: "#dc2626",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    empty: {
        textAlign: "center",
        padding: "80px 20px"
    },

    icon: {
        fontSize: "45px",
        marginBottom: "10px"
    }
};

export default UserList;