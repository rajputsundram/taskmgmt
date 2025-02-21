"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = async () => {
        try {
            const response = await axios.get("/api/auth");

            if (response.data.isAuthenticated) {
                setUser(response.data.user);
                setIsAuthenticated(true); // ✅ Update authentication state
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/logout"); // ✅ Ensure session is cleared
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        checkAuth(); // ✅ Run on component mount
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
