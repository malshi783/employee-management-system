import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import UserList from "./components/UserList";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/users"
                    element={<UserList />}
                />
                <Route
                    path="/users/add"
                    element={<AddEmployee />}
                />

                 <Route
                                    path="/users/edit/:id"
                                    element={<EditEmployee />}
                                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;