"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
    user: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const res = await fetch("/api/auth/me", {
                credentials: "include", // Ensure cookies are sent
            });
            const data = await res.json();
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Ensure cookies are sent
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        // Update user state immediately
        setUser(data.user);
        
        // Verify the user was set correctly
        if (!data.user) {
            throw new Error("Login failed. Please try again.");
        }
        
        return data.user;
    }

    async function register(name, email, password) {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setUser(data.user);
        return data.user;
    }

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/");
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
