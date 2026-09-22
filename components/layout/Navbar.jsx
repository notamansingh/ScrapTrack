import React from 'react';

export default function Navbar({ online = false }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-emerald-500/20">
            ST
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Scrap<span className="text-emerald-400">Track</span>
          </span>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}></span>
            {online ? 'API Online' : 'API Unreachable'}
          </span>
        </div>
      </div>
    </header>
  );
}