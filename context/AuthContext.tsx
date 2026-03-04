"use client";

import { createContext, useContext, useEffect } from "react";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket } from "@/app/socket";

interface AuthContextType {
    user: any;
    loading: boolean;
    login: (data: { email: string; password: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    // 👤 USER BİLGİSİ
    const { data: user, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await api.get("/auth/me");
            return res.data;
        },
        retry: false,
    });

    // 🔐 LOGIN
    const loginMutation = useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            await api.post("/auth/login", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });

    // 🚪 LOGOUT
    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post("/auth/logout");
        },
        onSuccess: () => {
            disconnectSocket(); // 🔥 logout olunca socket kapat
            queryClient.removeQueries({ queryKey: ["me"] });
        },
    });

    // 🔥 USER GELİNCE SOCKET BAĞLA
    useEffect(() => {
        if (user) {
            connectSocket({
                userId: user._id,
                username: user.username ?? user.email ?? "User",
                role: user.role,
            });
        }
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading: isLoading,
                login: loginMutation.mutate,
                logout: logoutMutation.mutate,
            }}
        >
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