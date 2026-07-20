"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { createClient } from "@/lib/supabase/client";
import { fetchFeedKarya } from "@/lib/api/karya";
import { ReelsItem } from "./ReelsItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCategory } from "@/components/providers/CategoryProvider";

export function ReelsFeed() {
  const { activeCategory } = useCategory();
  const supabase = createClient();
  const { ref, inView } = useInView();

  const [visibleCount, setVisibleCount] = useState(5);
  const [shuffledWorks, setShuffledWorks] = useState<any[]>([]);

  const { data, status, error } = useQuery({
    queryKey: ["karya", "feed", activeCategory],
    queryFn: () => fetchFeedKarya(supabase as any, { activeCategory }),
  });

  // Shuffle data once when loaded
  useEffect(() => {
    if (data && data.length > 0) {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setShuffledWorks(shuffled);
    } else {
      setShuffledWorks([]);
    }
  }, [data]);

  // Infinite loop logic
  useEffect(() => {
    if (inView && shuffledWorks.length > 0) {
      setVisibleCount((prev) => prev + 5);
    }
  }, [inView, shuffledWorks.length]);

  if (status === "pending") {
    return (
      <div className="w-full h-[calc(100dvh-80px)] bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text-secondary text-sm">Memuat Reels...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-[calc(100dvh-80px)] bg-black flex flex-col items-center justify-center p-8 text-center text-danger">
        <p>Gagal memuat reels: {(error as Error).message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[calc(100dvh-80px)] bg-black flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 mb-4 opacity-20 text-text-secondary">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM15 16H5V8h10v8z"/></svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">Belum Ada Karya</h3>
        <p className="text-gray-400 max-w-sm">
          {activeCategory 
            ? "Belum ada karya yang diterbitkan di kategori ini."
            : "Belum ada karya yang diterbitkan saat ini."}
        </p>
      </div>
    );
  }

  const displayItems = Array.from({ length: visibleCount }).map((_, i) => {
    return shuffledWorks[i % shuffledWorks.length];
  }).filter(Boolean);

  return (
    // The container is exactly the available height and hides scrollbars
    <div className="w-full h-[calc(100dvh-80px)] overflow-y-scroll snap-y snap-mandatory bg-black [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {displayItems.map((item, index) => (
        <ReelsItem
          key={`${item.id}-${index}`}
          id={item.id}
          judul={item.judul}
          namaMahasiswa={item.namaMahasiswa}
          media={item.media}
        />
      ))}
      
      {/* Infinite Scroll trigger element */}
      {shuffledWorks.length > 0 && (
        <div 
          ref={ref} 
          className="w-full h-32 snap-center flex items-center justify-center bg-black shrink-0"
        >
          <div className="w-8 h-8 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
