"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, glass = false, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border transition-all duration-200",
        glass
          ? "bg-zinc-900/60 backdrop-blur-xl border-white/[0.06]"
          : "bg-zinc-900 border-zinc-800",
        hover && "hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  gradient?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, gradient, className }: StatCardProps) {
  return (
    <Card className={cn("p-5 relative overflow-hidden", className)}>
      {gradient && (
        <div className={cn("absolute inset-0 opacity-10 rounded-2xl", gradient)} />
      )}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <div className={cn("flex items-center gap-1 mt-1.5 text-xs font-medium", trend.up ? "text-emerald-400" : "text-rose-400")}>
              <span>{trend.up ? "↑" : "↓"}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
