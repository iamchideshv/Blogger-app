"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
            <nav className="bg-white rounded-[2rem] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-8 h-18 flex items-center justify-between relative w-full max-w-sm pointer-events-auto">
                {/* Home Tab */}
                <Link href="/" className="flex flex-col items-center justify-center w-12 h-12">
                    <Image
                        src="/home.png"
                        alt="Home"
                        width={32}
                        height={32}
                        className={`w-8 h-8 object-contain ${pathname === '/' ? 'opacity-100' : 'opacity-50 hover:opacity-100 transition-opacity'}`}
                    />
                </Link>

                {/* Post Tab (Center) */}
                <button className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 -top-6 group">
                    {/* "POST" Label Container */}
                    <div className="bg-white border-2 border-black px-1.5 py-0.5 mb-[-2px] z-10 transition-transform group-active:scale-95">
                        <span className="font-bold text-xs tracking-wider font-sans text-black">POST</span>
                    </div>
                    {/* Icon */}
                    <div className="relative z-10 bg-white group-active:scale-95 transition-transform">
                        <Image
                            src="/post-office.png"
                            alt="Post"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                </button>

                {/* User Profile Tab */}
                <Link href="/profile" className="flex flex-col items-center justify-center w-12 h-12">
                    <Image
                        src="/user.png"
                        alt="Profile"
                        width={32}
                        height={32}
                        className={`w-8 h-8 object-contain rounded-full border border-black p-0.5 ${pathname === '/profile' ? 'opacity-100 ring-1 ring-black' : 'opacity-100'}`}
                    />
                </Link>
            </nav>
        </div>
    );
}
