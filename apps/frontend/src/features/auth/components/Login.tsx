import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
    const { mutate, isPending, error } = useLogin();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutate({
            username,
            password,
        },
        {

            onSuccess: (data) => {
               console.log("SUCCESS", data);
               console.log("Login component data.token", data.token);
            },


            onError: (err) => {
               console.error("LOGIN ERROR", err);
               },

        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            <button type="submit" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
            </button>
            {error && <p>Login failed. Check Readme.md for credentials. {error.message}</p>}
        </form>
    );
}
// const handleLogin = async () => {
//     const res = await fetch("/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//     });
//
//     const data = await res.json();
//     localStorage.setItem("token", data.token);
//
//     navigate("/"); // or wherever
// };