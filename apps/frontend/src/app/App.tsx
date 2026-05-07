import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Login from "../features/auth/components/Login";
import JobForm from '../features/jobs/components/JobForm';
import JobList from '../features/jobs/components/JobList';
import {useAuth} from "../features/auth/context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function App() {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate("/auth/login");
    };

    return (
        <div style={{ padding: 20 }}>
            <nav style={{ marginBottom: 20 }}>
                <Link to="/" style={{ marginRight: 10 }}>Jobs</Link>
                <Link to="/create">Create Job</Link>

                {auth.isAuthenticated && (
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </nav>
            <Routes>
                <Route path="/*" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/create/*" element={ <ProtectedRoute><JobForm /></ProtectedRoute>}/>
            </Routes>
        </div>
    );
}