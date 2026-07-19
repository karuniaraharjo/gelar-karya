import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "default" | "outline" | "solid";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual style */
  variant?: BadgeVariant;
  /** Size preset */
  size?: BadgeSize;
  /** Badge content (text label) */
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-accent-primary-muted text-accent-primary border border-transparent",
  outline:
    "bg-transparent text-text-secondary border border-border-subtle",
  solid:
    "bg-accent-primary text-white border border-transparent",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] leading-4",
  md: "px-2.5 py-1 text-xs leading-4",
};

export function Badge({
  variant = "default",
  size = "md",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium whitespace-nowrap",
        "rounded-[var(--radius-full)]",
        "transition-colors duration-[var(--transition-fast)]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
