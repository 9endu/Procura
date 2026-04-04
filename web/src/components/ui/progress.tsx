"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PoolProgressProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

function getProgressColor(value: number) {
  if (value >= 90) return "from-emerald-500 to-emerald-400";
  if (value >= 60) return "from-indigo-500 to-violet-500";
  if (value >= 30) return "from-blue-500 to-indigo-500";
  return "from-zinc-600 to-zinc-500";
}

export function PoolProgress({ value, className, showLabel = false, animate = true, size = "md" }: PoolProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium">
          <span className="text-zinc-500">Pool Progress</span>
          <span className={cn(clampedValue >= 90 ? "text-emerald-400" : "text-indigo-400")}>
            {clampedValue}%
          </span>
        </div>
      )}
      <div className={cn("w-full bg-zinc-800 rounded-full overflow-hidden relative", sizeMap[size])}>
        {animate ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className={cn("h-full rounded-full bg-gradient-to-r relative", getProgressColor(clampedValue))}
          >
            {clampedValue > 10 && (
              <div className="absolute inset-0 bg-white/10 rounded-full" />
            )}
          </motion.div>
        ) : (
          <div
            style={{ width: `${clampedValue}%` }}
            className={cn("h-full rounded-full bg-gradient-to-r", getProgressColor(clampedValue))}
          />
        )}
      </div>
    </div>
  );
}

// Circular progress ring
interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function CircularProgress({ value, size = 80, strokeWidth = 6, className, children }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v >= 90) return "#10b981";
    if (v >= 70) return "#6366f1";
    if (v >= 50) return "#3b82f6";
    return "#71717a";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
