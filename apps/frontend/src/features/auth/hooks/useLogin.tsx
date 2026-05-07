import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser, LoginCredentials } from "../api/auth.api";
import {useAuth} from "../context/AuthProvider";

export function useLogin() {
    const navigate = useNavigate();
    const auth = useAuth();
    return useMutation({
        mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
        onSuccess: (data) => {
            console.log("useLogin data", data);
            console.log("useLogin data.token", data.token);
            auth.login(data.accessToken);
            navigate("/"); // redirect to homepage or dashboard
        },
    });
}

// export function useLogin() {
//     return useMutation({
//         mutationFn: loginUser,
//
//         onSuccess: (data) => {
//             localStorage.setItem("token", data.token);
//         },
//
//         onError: (error) => {
//             console.error("Login failed", error);
//         },
//     });
// }