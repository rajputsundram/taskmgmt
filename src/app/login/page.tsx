"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; 
import { useAuth } from "../../context/Authcontext";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const { setIsAuthenticated, checkAuth } = useAuth();
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "/api/login",
                credentials,
                { withCredentials: true } // ✅ Ensures cookies are sent
            );

            if (response.data.success) {
                toast.success("Login successful!");
                setIsAuthenticated(true); // ✅ Mark as authenticated
                await checkAuth(); // ✅ Fetch user data after login
                router.push("/"); // ✅ Redirect after login
            } else {
                toast.error("Invalid credentials");
            }
        } catch (error) {
            toast.error("An error occurred, please try again.");
        }
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex mt-4 justify-center min-h-[300px]">
            <div className="container w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-700 font-bold mb-2">Email</label>
                        <input
                            onChange={handleChange}
                            required
                            name="email"
                            type="email"
                            value={credentials.email}
                            placeholder="Enter your email"
                            className="border-gray-300 rounded w-full py-2 px-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 font-bold mb-2">Password</label>
                        <input
                            onChange={handleChange}
                            required
                            name="password"
                            type="password"
                            value={credentials.password}
                            placeholder="******"
                            className="border-gray-300 rounded w-full py-2 px-3"
                        />
                    </div>

                    <button type="submit" className="border rounded p-2 hover:bg-green-500 hover:text-white w-full">
                        Log in
                    </button>

                    <div className="text-center mt-4">
                        <Link href="/signup">
                            <span className="text-blue-500 cursor-pointer">New User? Sign Up</span>
                        </Link>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Login;