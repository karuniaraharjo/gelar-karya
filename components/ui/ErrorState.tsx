"use client";

import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";

export interface ErrorStateProps {
  /** Error heading */
  title?: string;
  /** Error message displayed to the user — never a stack trace (§3.5) */
  message: string;
  /** Callback for the retry button */
  onRetry: () => void;
  /** Custom retry button label */
  retryLabel?: string;
  /** Extra class names for the wrapper */
  className?: string;
}

/** Error icon — circle with exclamation mark */
function ErrorIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="mx-auto"
    >
      <circle cx="28" cy="28" r="26" fill="var(--bg-elevated)" stroke="var(--danger)" strokeWidth="1.5" opacity="0.8" />
      {/* Exclamation body */}
      <rect x="26" y="16" width="4" height="16" rx="2" fill="var(--danger)" />
      {/* Exclamation dot */}
      <circle cx="28" cy="38" r="2.5" fill="var(--danger)" />
    </svg>
  );
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  message,
  onRetry,
  retryLabel = "Coba Lagi",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6",
        className
      )}
      role="alert"
    >
      <div className="mb-4">
        <ErrorIcon />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-[280px] leading-relaxed mb-5">
        {message}
      </p>
      <Button variant="primary" size="sm" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}
