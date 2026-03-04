"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Dışarı tıklayınca kapanma
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
        { code: "tr", label: "Türkçe", flag: "🇹🇷" },
        { code: "en", label: "English", flag: "🇬🇧" },
    ];

    const current = languages.find((l) => l.code === language);

    return (
        <div
            ref={dropdownRef}
            className="relative"
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 transition"
            >
                <span>{current?.flag}</span>
                <span>{current?.label}</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code as "tr" | "en");
                                setOpen(false);
                            }}
                            className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${language === lang.code ? "bg-gray-100 dark:bg-gray-700" : ""
                                }`}
                        >
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}