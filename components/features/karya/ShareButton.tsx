"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Determine absolute URL for share target
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: fullUrl,
        });
      } catch (err) {
        // Fallback to copy link if sharing fails (e.g., user cancelled, or restricted context)
        copyToClipboard(fullUrl);
      }
    } else {
      // Fallback to copy link
      copyToClipboard(fullUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 shrink-0 rounded-full bg-bg-base border border-border-subtle text-text-primary hover:text-accent-primary hover:border-accent-primary transition-colors flex items-center justify-center cursor-pointer"
      aria-label="Bagikan"
      title="Bagikan"
    >
      {copied ? <Check size={18} className="text-success" /> : <Share2 size={18} />}
    </button>
  );
}
