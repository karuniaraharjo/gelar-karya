"use client";

import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

export type CategoryCircleSize = "sm" | "md" | "lg";

export interface CategoryCircleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Category label displayed below the circle */
  label: string;
  /** Optional icon/image URL inside the circle */
  iconUrl?: string;
  /** Whether this category is currently selected */
  isActive?: boolean;
  /** Circle size preset */
  size?: CategoryCircleSize;
}

const sizeConfig: Record<
  CategoryCircleSize,
  { outer: string; inner: string; ring: string; labelText: string }
> = {
  sm: {
    outer: "w-14 h-14",
    inner: "w-12 h-12",
    ring: "p-[2px]",
    labelText: "text-[10px]",
  },
  md: {
    outer: "w-[68px] h-[68px]",
    inner: "w-[60px] h-[60px]",
    ring: "p-[3px]",
    labelText: "text-[11px]",
  },
  lg: {
    outer: "w-20 h-20",
    inner: "w-[72px] h-[72px]",
    ring: "p-[3px]",
    labelText: "text-xs",
  },
};

/** Category icon placeholder when no iconUrl provided */
function CategoryIcon({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn("text-lg font-bold text-text-primary select-none", className)}
      aria-hidden="true"
    >
      {label.charAt(0).toUpperCase()}
    </span>
  );
}

export function CategoryCircle({
  label,
  iconUrl,
  isActive = false,
  size = "md",
  className,
  ...rest
}: CategoryCircleProps) {
  const config = sizeConfig[size];

  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none outline-none",
        "transition-transform duration-[var(--transition-normal)] ease-[var(--transition-ease)]",
        "hover:scale-105 focus-visible:scale-105",
        className
      )}
      aria-pressed={isActive}
      aria-label={`Kategori ${label}`}
      {...rest}
    >
      {/* Gradient ring wrapper */}
      <div
        className={cn(
          "rounded-full flex items-center justify-center shrink-0",
          config.outer,
          config.ring,
          isActive
            ? "bg-accent-gradient shadow-[0_0_12px_rgba(108,92,231,0.4)]"
            : "bg-border-subtle"
        )}
      >
        {/* Inner circle */}
        <div
          className={cn(
            "rounded-full bg-bg-elevated flex items-center justify-center overflow-hidden",
            config.inner
          )}
        >
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={`Ikon ${label}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <CategoryIcon label={label} />
          )}
        </div>
      </div>
      {/* Label */}
      <span
        className={cn(
          "font-medium truncate max-w-[72px] text-center",
          config.labelText,
          isActive ? "text-text-primary" : "text-text-secondary"
        )}
      >
        {label}
      </span>
    </button>
  );
}
