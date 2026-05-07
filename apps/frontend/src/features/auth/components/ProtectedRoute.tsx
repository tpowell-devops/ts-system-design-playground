import jwtDecode from "jwt-decode";
import { Navigate } from "react-router-dom";

type Props = {
    children: JSX.Element;
};

function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export default function ProtectedRoute({ children }: Props) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    try {
        const payload = parseJwt(token);
        if (!payload || Date.now() >= payload.exp * 1000) {
            // Token expired
            localStorage.removeItem("token");
            return <Navigate to="/auth/login" replace />;
        }
    } catch {
        // Invalid token
        localStorage.removeItem("token");
        return <Navigate to="/auth/login" replace />;
    }

    return children;
}