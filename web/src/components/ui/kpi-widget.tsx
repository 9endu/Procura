"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPIWidgetProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  icon: React.ReactNode;
  iconColor?: string;
  className?: string;
  accent?: string;
}

export function KPIWidget({
  label,
  value,
  subtitle,
  trend,
  icon,
  iconColor = "text-indigo-400",
  className,
  accent,
}: KPIWidgetProps) {
  const trendColor =
    trend?.direction === "up"
      ? "text-emerald-400"
      : trend?.direction === "down"
      ? "text-rose-400"
      : "text-zinc-400";

  return (
    <div
      className={cn(
        "relative bg-zinc-900 rounded-2xl border border-zinc-800 p-5 overflow-hidden hover:border-zinc-700 transition-all duration-200 group",
        className
      )}
    >
      {/* Accent glow */}
      {accent && (
        <div className={cn("absolute top-0 left-0 right-0 h-px", accent)} />
      )}

      {/* Background gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-3xl font-bold text-white truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-zinc-600 mt-1 truncate">{subtitle}</p>
          )}
          {trend && (
            <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", trendColor)}>
              {trend.direction === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend.direction === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              <span>{trend.value}</span>
              {trend.label && <span className="text-zinc-600">{trend.label}</span>}
            </div>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200", iconColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
