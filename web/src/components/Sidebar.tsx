"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  User,
  LogOut,
  Settings,
  Upload,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Offers", href: "/offers", icon: ShoppingBag },
  { name: "Buying Pools", href: "/pools", icon: Users2 },
  { name: "Recommendations", href: "/recommendations", icon: Sparkles },
  { name: "Trust & Reputation", href: "/trust", icon: ShieldCheck },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Profile", href: "/profile", icon: User },
];

const toolNav = [
  { name: "Upload Offer", href: "/offers/upload", icon: Upload },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
  mobile?: boolean;
}

export default function Sidebar({ onClose, mobile }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-zinc-950 border-r border-white/[0.06]",
        mobile ? "w-full" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-white/[0.06] flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Users2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Pro<span className="text-indigo-400">cura</span>
          </span>
        </Link>
        {mobile && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <div className="mb-2 px-3">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Main</p>
        </div>
        {mainNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative",
                active
                  ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent"
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  active ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"
                )}
              />
              {item.name}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-indigo-500" />}
            </Link>
          );
        })}

        <div className="my-3 px-3">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Tools</p>
        </div>
        {toolNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border",
                active
                  ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                  : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60 border-transparent"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active ? "text-indigo-400" : "text-zinc-700 group-hover:text-zinc-500"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/60 transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            RK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-200 truncate">Rahul Kumar</p>
            <p className="text-xs text-zinc-600 truncate">rahul@procura.app</p>
          </div>
          <LogOut className="w-3.5 h-3.5 text-zinc-700 group-hover:text-rose-400 transition-colors flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
