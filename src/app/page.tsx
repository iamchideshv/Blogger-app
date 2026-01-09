"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

interface Post {
  id: string;
  text: string;
  username: string;
  name: string;
  profileImage: string;
  timestamp: any;
  likes: number;
  comments: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-2 sticky top-0 bg-white z-10">
        <h1 className="text-4xl text-pink-400 font-display">Blogger</h1>
        <button className="p-2 transition-transform active:scale-95">
          <Image
            src="/direct.png"
            alt="Direct Messages"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No posts yet. Be the first to post!
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={post.profileImage}
                    alt={post.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{post.name}</h3>
                  <p className="text-xs text-gray-500">@{post.username}</p>
                </div>
              </div>
              <p className="text-gray-800 text-sm mb-3 whitespace-pre-wrap">{post.text}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 text-gray-500 text-xs">
                <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                  </svg>
                  <span>{post.comments}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
