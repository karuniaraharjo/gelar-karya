"use client";

import { useState } from "react";
import Image from "next/image";

interface Media {
  id: string;
  url: string;
  tipe: string;
  thumbnail_url?: string | null;
}

export function MediaCarousel({ media }: { media: Media[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-bg-elevated text-text-secondary">
        Tidak ada media
      </div>
    );
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div 
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onScroll={handleScroll}
      >
        {media.map((item, idx) => (
          <div key={item.id} className="w-full h-full shrink-0 snap-center relative bg-black">
            {item.tipe === "video" ? (
              <video
                src={item.url}
                poster={item.thumbnail_url || undefined}
                className="w-full h-full object-contain"
                controls
                playsInline
              />
            ) : (
              <Image
                src={item.url}
                alt={`Media ${idx + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={idx === 0}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Pagination Dots */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {media.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                idx === activeIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
