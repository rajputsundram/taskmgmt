"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext"; // ✅ Import AuthContext

const Signup = () => {
    const router = useRouter();
    const { setIsAuthenticated, checkAuth } = useAuth(); // ✅ Use checkAuth for updating state
    
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.name || !credentials.email || !credentials.password) {
            toast.error("All fields are required!");
            return;
        }

        if (!isValidEmail(credentials.email)) {
            toast.error("Invalid email format!");
            return;
        }

        try {
            const response = await axios.post("/api/signup", credentials);

            if (response.data.success) {
                toast.success("Signup successful! Redirecting...");
                
                // ✅ Update authentication state and fetch user info
                setIsAuthenticated(true);
                await checkAuth();

                setCredentials({ name: "", email: "", password: "" });

                setTimeout(() => {
                    router.push("/"); 
                    router.refresh(); // ✅ Ensures UI updates properly
                }, 1000);
            } else {
                toast.error(response.data.msg || "Signup failed. Try again.");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="container w-full max-w-md">
                <form
                    onSubmit={handleSubmit}
                    className="bg-black text-gray-200 rounded-lg shadow-2xl px-8 pt-6 pb-8"
                >
                    <div className="mb-4">
                        <label htmlFor="name" className="font-bold mb-2">Name</label>
                        <input
                            onChange={handleChange}
                            required
                            name="name"
                            placeholder="Enter your name"
                            type="text"
                            value={credentials.name}
                            className="shadow border-gray-300 rounded w-full py-2 px-3 text-gray-900"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={handleChange}
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            value={credentials.email}
                            className="shadow border-gray-300 rounded w-full py-2 px-3 text-gray-900"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={handleChange}
                            required
                            name="password"
                            type="password"
                            placeholder="******"
                            value={credentials.password}
                            className="shadow border-gray-300 rounded w-full py-2 px-3 text-gray-900"
                        />
                    </div>
                   
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="border font-bold border-gray-400 rounded mr-2 p-2 hover:bg-orange-500 text-white"
                        >
                            Sign Up
                        </button>
                        <Link href="/login">
                            <button
                                type="button"
                                className="border font-bold border-gray-400 rounded mr-2 p-2 hover:bg-orange-500 text-white"
                            >
                                Already a user?
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;