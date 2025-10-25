"use client";

export default function ControlHeader() {
  return (
    <header className="sticky top-0 z-20 bg-[#12152c]/80 backdrop-blur text-white border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-3 h-[60px]">
        <h1 className="text-sm font-semibold tracking-wider uppercase text-white/70">
          NORO CONTROL PLANE
        </h1>
        <button className="rounded-md bg-white/10 px-3 py-1 text-sm hover:bg-white/20">Admin</button>
      </div>
    </header>
  );
}
