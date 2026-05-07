import { http } from '../../../../shared/api/http';


export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
    // POST /auth/login via axios
    const res = await http.post("/auth/login", credentials); // returns an entire axios response JSON with multiple keys
    console.log("auth.api res", res);
    console.log("auth.api res.data", res.data);
    return res.data; //get the JSON object at key "data" from axios JSON
}

// export async function loginUser(credentials: {
//     username: string;
//     password: string;
// }) {
//     try {
//         const res = await http.post(`auth/login`, credentials, {
//             headers: {"Content-Type": "application/json"}
//         });
//         console.log("SUCCESS", res.data)
//         return res.data;
//     } catch(err) {
//         console.error("LOGIN FAILED", err);
//     }
//
//     // if (!response.ok) {
//     //     throw new Error("Invalid credentials");
//     // }
//     // ^ if using fetch instead of axios
//     ;
// }