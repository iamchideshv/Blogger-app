
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
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
      <main className="flex-1 px-6 py-4">
        {/* Placeholder for content */}
      </main>
    </div>
  );
}
