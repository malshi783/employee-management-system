import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import Sidebar from "./Sidebar";

import "./UserList.css";

function UserList() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadUsers = async () => {

        try {

            setLoading(true);

            const response = await api.get("/users");

            setUsers(response.data);

        } catch (error) {

            console.error(
                "Error loading users:",
                error
            );

            setMessage(
                "Failed to load employees."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadUsers();
    }, []);


    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/users/${id}`);

            setMessage(
                "Employee deleted successfully."
            );

            await loadUsers();

        } catch (error) {

            console.error(
                "Error deleting employee:",
                error
            );

            setMessage(
                "Failed to delete employee."
            );
        }
    };


    const filteredUsers = users.filter((user) => {

        const name =
            user.name?.toLowerCase() || "";

        const email =
            user.email?.toLowerCase() || "";

        const role =
            user.role?.toLowerCase() || "";

        const search =
            searchTerm.toLowerCase();

        return (
            name.includes(search) ||
            email.includes(search) ||
            role.includes(search)
        );
    });


    const getInitial = (name) => {

        if (!name) {
            return "U";
        }

        return name
            .charAt(0)
            .toUpperCase();
    };


    if (loading) {

        return (
            <div className="app-layout">

                <Sidebar />

                <main className="employee-page">

                    <div className="employee-loading">
                        Loading employees...
                    </div>

                </main>

            </div>
        );
    }


    return (

        <div className="app-layout">

            <Sidebar />

            <main className="employee-page">

                {/* HEADER */}
                <div className="employee-header">

                    <div>
                        <h1>
                            Employee Management
                        </h1>

                        <p>
                            Manage employees and their account information
                        </p>
                    </div>

                    <div className="header-actions">

                        <button
                            className="primary-btn"
                            onClick={() =>
                                navigate("/add-employee")
                            }
                        >
                            + Add Employee
                        </button>

                    </div>

                </div>


                {/* MESSAGE */}
                {message && (
                    <div className="message">
                        {message}
                    </div>
                )}


                {/* TOOLBAR */}
                <div className="toolbar">

                    <div className="search-box">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="employee-count">
                        {filteredUsers.length}{" "}
                        {filteredUsers.length === 1
                            ? "employee"
                            : "employees"}
                    </div>

                </div>


                {/* TABLE */}
                <div className="table-card">

                    {filteredUsers.length === 0 ? (

                        <div className="empty-state">

                            <h3>
                                No employees found
                            </h3>

                            <p>
                                Try changing your search.
                            </p>

                        </div>

                    ) : (

                        <div className="table-container">

                            <table>

                                <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>
                                        EMPLOYEE
                                    </th>

                                    <th>
                                        EMAIL
                                    </th>

                                    <th>
                                        ROLE
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                                </thead>

                                <tbody>

                                {filteredUsers.map(
                                    (user) => (

                                        <tr
                                            key={user.id}
                                        >

                                            <td>
                                                    <span className="employee-id">
                                                        #{user.id}
                                                    </span>
                                            </td>


                                            <td>

                                                <div className="employee-name">

                                                    <div className="avatar">
                                                        {getInitial(
                                                            user.name
                                                        )}
                                                    </div>

                                                    <div>

                                                        <div className="employee-name-text">
                                                            {user.name}
                                                        </div>

                                                        <div className="employee-role-text">
                                                            {user.role ===
                                                            "ADMIN"
                                                                ? "Administrator"
                                                                : "Employee"}
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>
                                                {user.email}
                                            </td>


                                            <td>

                                                    <span
                                                        className={`role ${
                                                            user.role?.toLowerCase() ||
                                                            "employee"
                                                        }`}
                                                    >
                                                        {user.role}
                                                    </span>

                                            </td>


                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/users/edit/${user.id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-btn"
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

export default UserList;