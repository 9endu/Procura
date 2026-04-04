"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  src?: string;
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getGradient(name: string) {
  const gradients = [
    "from-indigo-600 to-violet-600",
    "from-blue-600 to-indigo-600",
    "from-violet-600 to-fuchsia-600",
    "from-emerald-600 to-teal-600",
    "from-rose-600 to-pink-600",
    "from-amber-600 to-orange-600",
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export function Avatar({ name, size = "md", src, className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover ring-2 ring-zinc-800", sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 bg-gradient-to-br ring-2 ring-zinc-800",
        sizeMap[size],
        getGradient(name),
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}

interface AvatarGroupProps {
  names: string[];
  max?: number;
  size?: "xs" | "sm" | "md";
}

export function AvatarGroup({ names, max = 4, size = "sm" }: AvatarGroupProps) {
  const visible = names.slice(0, max);
  const extra = names.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((name, i) => (
        <Avatar key={i} name={name} size={size} />
      ))}
      {extra > 0 && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-bold text-zinc-400 bg-zinc-800 ring-2 ring-zinc-900 text-xs flex-shrink-0",
            sizeMap[size]
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
