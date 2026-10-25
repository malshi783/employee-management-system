import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import UserList from "./components/UserList";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";
import ProtectedRoute from "./components/ProtectedRoute";
import MyProfile from "./components/MyProfile";
import MyAttendance from "./components/MyAttendance";
import AttendanceManagement from "./components/AttendanceManagement";
import LeaveRequest from "./components/LeaveRequest";
import LeaveManagement from "./components/LeaveManagement";
import Support from "./components/Support";
import SupportManagement from "./components/SupportManagement";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <UserList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add-employee"
                    element={
                        <ProtectedRoute>
                            <AddEmployee />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditEmployee />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <MyProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/attendance"
                    element={
                        <ProtectedRoute>
                            <MyAttendance />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/attendance-management"
                    element={
                        <ProtectedRoute>
                            <AttendanceManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/leave"
                    element={
                        <ProtectedRoute>
                            <LeaveRequest />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/leave-management"
                    element={
                        <ProtectedRoute>
                            <LeaveManagement />
                        </ProtectedRoute>
                    }
                />
                <Route path="/support"
                       element={<ProtectedRoute>
                           <Support />
                       </ProtectedRoute>} />
                <Route
                    path="/support-management"
                    element={
                        <ProtectedRoute>
                            <SupportManagement />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;