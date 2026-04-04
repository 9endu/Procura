"use client";

import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Sidebar from "@/components/Sidebar";

export default function TopNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-14 bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 flex-shrink-0">
        {/* Left: mobile burger + search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative hidden sm:block max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-3.5 w-3.5 text-zinc-600" />
            </div>
            <input
              type="search"
              placeholder="Search pools, offers..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-0.5 text-[10px] text-zinc-700 font-mono">
              <span>⌘K</span>
            </kbd>
          </div>
        </div>

        {/* Right: notifications + user */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-colors">
            <Bell className="h-4 h-4" />
            <span className="absolute top-2 right-2 block h-1.5 w-1.5 rounded-full bg-indigo-500 ring-2 ring-zinc-950" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800 ml-1">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-zinc-200 leading-none">Rahul Kumar</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Gold Member</p>
            </div>
            <Avatar name="Rahul Kumar" size="sm" />
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72">
            <Sidebar onClose={() => setMobileOpen(false)} mobile />
          </div>
        </div>
      )}
    </>
  );
}
