import { cn } from "@/lib/utils/cn";
import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content inside the card */
  children: ReactNode;
  /** Padding preset: "none" removes padding, "sm"/"md"/"lg" add increasing padding */
  padding?: "none" | "sm" | "md" | "lg";
  /** Adds a subtle hover lift effect */
  hoverable?: boolean;
}

const paddingClasses: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  padding = "md",
  hoverable = false,
  className,
  ...rest
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-bg-elevated border border-border-subtle",
        "rounded-[var(--radius-lg)] overflow-hidden",
        hoverable &&
          "transition-transform duration-[var(--transition-normal)] ease-[var(--transition-ease)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20",
        paddingClasses[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";
