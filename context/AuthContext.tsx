"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";

interface User {
    _id: string;
    role: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/me");
                setUser(res.data);
            } catch (err: any) {
                if (
                    err.response?.status === 401 ||
                    err.response?.status === 403
                ) {
                    setUser(null);
                } else {
                    console.log("ME axios error:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include",
        });

        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}