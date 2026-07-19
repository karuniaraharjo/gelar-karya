import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export type SkeletonVariant = "line" | "circle" | "rect" | "card";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape/preset of the skeleton */
  variant?: SkeletonVariant;
  /** Width — accepts any CSS value (e.g. "100%", "200px") */
  width?: string;
  /** Height — accepts any CSS value */
  height?: string;
  /** Number of lines to render (only for variant="line") */
  lines?: number;
}

const variantDefaults: Record<SkeletonVariant, { width: string; height: string }> = {
  line: { width: "100%", height: "14px" },
  circle: { width: "48px", height: "48px" },
  rect: { width: "100%", height: "200px" },
  card: { width: "100%", height: "auto" },
};

function SkeletonPrimitive({
  width,
  height,
  rounded,
  className,
}: {
  width: string;
  height: string;
  rounded: string;
  className?: string;
}) {
  return (
    <div
      className={cn("bg-bg-skeleton", rounded, className)}
      style={{
        width,
        height,
        backgroundImage:
          "linear-gradient(90deg, var(--bg-skeleton) 25%, var(--bg-skeleton-shimmer) 50%, var(--bg-skeleton) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
      aria-hidden="true"
    />
  );
}

/** Card-shaped skeleton with header, image area, and text lines */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-bg-elevated border border-border-subtle rounded-[var(--radius-lg)] overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <SkeletonPrimitive width="100%" height="180px" rounded="" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <SkeletonPrimitive width="70%" height="16px" rounded="rounded-[var(--radius-sm)]" />
        <SkeletonPrimitive width="50%" height="12px" rounded="rounded-[var(--radius-sm)]" />
        <div className="flex gap-2 pt-1">
          <SkeletonPrimitive width="60px" height="22px" rounded="rounded-[var(--radius-full)]" />
          <SkeletonPrimitive width="60px" height="22px" rounded="rounded-[var(--radius-full)]" />
        </div>
      </div>
    </div>
  );
}

export function Skeleton({
  variant = "line",
  width,
  height,
  lines = 3,
  className,
  ...rest
}: SkeletonProps) {
  const defaults = variantDefaults[variant];
  const w = width ?? defaults.width;
  const h = height ?? defaults.height;

  if (variant === "card") {
    return <SkeletonCard className={className} {...rest} />;
  }

  if (variant === "line" && lines > 1) {
    return (
      <div className={cn("space-y-2.5", className)} aria-hidden="true" {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonPrimitive
            key={i}
            width={i === lines - 1 ? "60%" : w}
            height={h}
            rounded="rounded-[var(--radius-sm)]"
          />
        ))}
      </div>
    );
  }

  return (
    <SkeletonPrimitive
      width={w}
      height={h}
      rounded={
        variant === "circle"
          ? "rounded-full"
          : "rounded-[var(--radius-sm)]"
      }
      className={className}
      {...rest}
    />
  );
}
