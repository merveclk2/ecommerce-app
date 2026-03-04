"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {

    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
        >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
    );
}