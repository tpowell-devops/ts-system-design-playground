import { Navigate } from "react-router-dom";
import {useAuth} from "../context/AuthProvider";

type Props = {
    children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
    const auth = useAuth();

    if (!auth.isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }
    return children;
}