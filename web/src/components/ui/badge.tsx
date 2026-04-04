"use client";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "active"
  | "filling"
  | "completed"
  | "expired"
  | "pending"
  | "success"
  | "warning"
  | "danger"
  | "indigo"
  | "purple"
  | "blue"
  | "emerald"
  | "orange"
  | "green";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-300 border-zinc-700",
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  filling: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  completed: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  expired: "bg-zinc-700/50 text-zinc-500 border-zinc-700",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  purple: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  green: "bg-green-500/15 text-green-400 border-green-500/30",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-zinc-500",
  active: "bg-emerald-400",
  filling: "bg-amber-400",
  completed: "bg-indigo-400",
  expired: "bg-zinc-600",
  pending: "bg-yellow-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-rose-400",
  indigo: "bg-indigo-400",
  purple: "bg-violet-400",
  blue: "bg-blue-400",
  emerald: "bg-emerald-400",
  orange: "bg-orange-400",
  green: "bg-green-400",
};

export function Badge({ variant = "default", children, className, dot = false, size = "sm" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    Active: "active",
    "Filling Fast": "filling",
    Completed: "completed",
    Expired: "expired",
    Pending: "pending",
    Processing: "pending",
    Shipped: "indigo",
    Delivered: "success",
    Delayed: "warning",
    Ordered: "blue",
    Disputed: "danger",
    Approved: "success",
    Rejected: "danger",
    "Under Review": "warning",
    "In Stock": "success",
    "Low Stock": "warning",
    "Out of Stock": "danger",
    Inactive: "default",
  };
  return <Badge variant={map[status] ?? "default"} dot>{status}</Badge>;
}
