import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Login from "../features/auth/components/Login";
import JobForm from '../features/jobs/components/JobForm';
import JobList from '../features/jobs/components/JobList';

export default function App() {
    return (
        <div style={{ padding: 20 }}>
            <nav style={{ marginBottom: 20 }}>
                <Link to="/" style={{ marginRight: 10 }}>Jobs</Link>
                <Link to="/create">Create Job</Link>
            </nav>
            <Routes>
                <Route path="/*" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/create/*" element={ <ProtectedRoute><JobForm /></ProtectedRoute>}/>
            </Routes>
        </div>
    );
}