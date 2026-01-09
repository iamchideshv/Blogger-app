"use client";

import { useState, useEffect } from "react";
import { db, storage, auth } from "@/lib/firebase";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import Image from "next/image";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        name: string;
        username: string;
        bio: string;
        profileImage: string;
        uid: string;
    };
}

export default function EditProfileModal({ isOpen, onClose, initialData }: EditProfileModalProps) {
    const [name, setName] = useState(initialData.name);
    const [username, setUsername] = useState(initialData.username);
    const [bio, setBio] = useState(initialData.bio);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState(initialData.profileImage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset state when modal opens with new data
    useEffect(() => {
        if (isOpen) {
            setName(initialData.name);
            setUsername(initialData.username);
            setBio(initialData.bio);
            setPreviewUrl(initialData.profileImage);
            setImageFile(null);
            setError("");
        }
    }, [isOpen, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!name.trim() || !username.trim()) {
            setError("Name and Username are required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Not authenticated");

            // 1. Check Username Uniqueness (if changed)
            if (username !== initialData.username) {
                const q = query(collection(db, "users"), where("username", "==", username));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    throw new Error("Username is already taken.");
                }
            }

            let profileImageUrl = initialData.profileImage;

            // 2. Upload Image (if changed)
            if (imageFile) {
                const storageRef = ref(storage, `profile_images/${user.uid}`);
                await uploadBytes(storageRef, imageFile);
                profileImageUrl = await getDownloadURL(storageRef);
            }

            // 3. Update Firestore
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                name,
                username,
                bio,
                profileImage: profileImageUrl,
            });

            // 4. Update Auth Profile
            await updateProfile(user, {
                displayName: name,
                photoURL: profileImageUrl,
            });

            onClose();
        } catch (err: any) {
            console.error("Error updating profile:", err);
            setError(err.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2 group cursor-pointer border-2 border-gray-200">
                            <Image
                                src={previewUrl || "/user.png"}
                                alt="Profile Preview"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                </svg>
                            </div>
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <span className="text-sm text-blue-500 font-medium">Change Profile Photo</span>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Display Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 resize-none h-24"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Write something about yourself..."
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
