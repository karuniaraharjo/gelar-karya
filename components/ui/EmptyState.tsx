import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  /** Heading text */
  title: string;
  /** Descriptive text below the heading */
  description: string;
  /** Optional CTA button label */
  actionLabel?: string;
  /** Callback for the CTA button */
  onAction?: () => void;
  /** Optional custom icon/illustration override */
  icon?: ReactNode;
  /** Extra class names for the wrapper */
  className?: string;
}

/** Default empty state illustration — abstract shapes (inline SVG, no external asset) */
function DefaultEmptyIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="mx-auto"
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="var(--bg-elevated)" stroke="var(--border-subtle)" strokeWidth="1.5" />
      {/* Abstract folder shape */}
      <rect x="32" y="46" width="56" height="38" rx="6" fill="var(--bg-skeleton)" stroke="var(--border-subtle)" strokeWidth="1.5" />
      <path d="M32 52C32 48.6863 34.6863 46 38 46H50L56 38H82C85.3137 38 88 40.6863 88 44V46H32V52Z" fill="var(--bg-skeleton-shimmer)" stroke="var(--border-subtle)" strokeWidth="1.5" />
      {/* Accent dot */}
      <circle cx="60" cy="64" r="6" fill="var(--accent-primary)" opacity="0.6" />
      {/* Small accent line */}
      <rect x="48" y="76" width="24" height="3" rx="1.5" fill="var(--border-subtle)" />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6",
        className
      )}
      role="status"
    >
      <div className="mb-5">{icon ?? <DefaultEmptyIllustration />}</div>
      <h3 className="text-base font-semibold text-text-primary mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-[280px] leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
