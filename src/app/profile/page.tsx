"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface Post {
    id: string;
    text: string;
    timestamp: any;
}

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const derivedUsername = user?.email?.split('@')[0] || "user";

    const userData = {
        username: derivedUsername,
        name: user?.displayName || "Anonymous",
        profileImage: user?.photoURL || "/user.png",
        stats: {
            posts: posts.length,
            followers: 0,
            following: 0,
        },
        bio: "",
    };

    useEffect(() => {
        if (authLoading) return;
        if (!user) return; // Should potentially redirect or show empty

        const q = query(
            collection(db, "posts"),
            where("username", "==", derivedUsername),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Post[];
            setPosts(postsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, derivedUsername, authLoading]);

    if (authLoading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div></div>;

    if (!user) return null; // Or some other empty state

    return (
        <div className="flex flex-col min-h-screen text-black pb-24">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-1">
                    <h1 className="text-xl font-bold">{userData.username}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="active:opacity-70">
                        <Image
                            src="/post-office.png"
                            alt="Create"
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain"
                        />
                    </button>
                    <button className="active:opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="flex-1 px-4">
                {/* Profile Info Section */}
                <div className="flex items-start justify-between mb-6">
                    {/* Profile Image */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border border-gray-200 p-0.5">
                            <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden relative">
                                <Image
                                    src={userData.profileImage}
                                    alt={userData.username}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 flex justify-around items-center ml-4 mt-2">
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-lg">{userData.stats.posts}</span>
                            <span className="text-sm">posts</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-lg">{userData.stats.followers}</span>
                            <span className="text-sm">followers</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-lg">{userData.stats.following}</span>
                            <span className="text-sm">following</span>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mb-4 text-sm">
                    <h2 className="font-bold mb-1">{userData.name}</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{userData.bio || "No bio yet."}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-8">
                    <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-200 active:scale-95 transition-all">
                        Edit profile
                    </button>
                    <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-200 active:scale-95 transition-all">
                        Share profile
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-t border-gray-200">
                    <button className="flex-1 py-3 border-b-2 border-black flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                        </svg>
                    </button>
                    <button className="flex-1 py-3 flex justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex flex-col py-1">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-1">Not yet posted</h3>
                            <p className="text-gray-500 text-sm">Start capturing your moments to share with everyone.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-0.5">
                            {posts.map((post) => (
                                <div key={post.id} className="aspect-square bg-white border border-gray-100 relative p-2 flex items-center justify-center text-center">
                                    {/* In a real app with images, this would be an image. For now, text. */}
                                    <span className="text-[10px] text-gray-500 line-clamp-3 overflow-hidden">{post.text}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
