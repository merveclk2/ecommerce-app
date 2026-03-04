"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function ProfilePage() {

    const { user } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");



    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await api.get("/api/users/profile");

                setName(res.data.name);
                setEmail(res.data.email);
                setPhone(res.data.phone || "");
                setAddress(res.data.address || "");

            } catch (err) {

                toast.error("Profil yüklenemedi");

            }

        };

        fetchProfile();

    }, []);




    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const selected = e.target.files?.[0];
        if (!selected) return;

        setFile(selected);

        const url = URL.createObjectURL(selected);
        setPreview(url);

    };

    /* PROFİL KAYDET */

    const handleSave = async () => {

        try {

            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("address", address);

            if (file) {
                formData.append("avatar", file);
            }

            await api.put("/api/users/profile", formData);

            toast.success("Profil güncellendi");

        } catch (err) {

            toast.error("Profil güncellenemedi");

        }

    };
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-start pt-20">

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">

                {/* HEADER */}

                <h1 className="text-2xl font-bold text-center mb-6">
                    👤 Profilim
                </h1>

                {/* PROFILE IMAGE */}

                <div className="flex flex-col items-center mb-6">

                    <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-3">

                        {preview || user?.avatar ? (
                            <img
                                src={
                                    preview
                                        ? preview
                                        : `http://localhost:5000${user?.avatar}`
                                }
                                className="w-full h-full object-cover"
                                alt="Profil"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500">
                                Foto
                            </div>
                        )}

                    </div>

                    <label className="text-sm cursor-pointer text-indigo-500 hover:underline">

                        Fotoğraf Değiştir

                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                    </label>

                </div>

                {/* FORM */}

                <div className="space-y-4">

                    {/* NAME */}

                    <div>

                        <label className="text-sm text-gray-500">
                            Ad
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700"
                        />

                    </div>

                    {/* EMAIL */}

                    <div>

                        <label className="text-sm text-gray-500">
                            Email
                        </label>

                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700"
                        />

                    </div>

                    <div>
                        <label className="text-sm text-gray-500">
                            Telefon
                        </label>

                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">
                            Adres
                        </label>

                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700"
                        />
                    </div>

                    {/* BUTTON */}

                    <button
                        onClick={handleSave}
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                    >
                        Bilgileri Güncelle
                    </button>

                </div>

            </div>

        </div>
    );
}