"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { createClient } from "@/lib/supabase/client";
import { fetchFeedKarya } from "@/lib/api/karya";
import { KaryaCard } from "@/components/ui/KaryaCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCategory } from "@/components/providers/CategoryProvider";

export function HomeFeed() {
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
      <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center p-8 text-danger">
        <p>Gagal memuat feed: {(error as Error).message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <div className="w-24 h-24 mb-4 opacity-20 text-text-secondary">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3C2 3 1 4 1 5v14c0 1 1 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zM5 17l3.5-4.5 2.5 3 3.5-4.5 4.5 6H5z"/></svg>
        </div>
        <h3 className="text-xl font-medium text-text-primary mb-2">Belum Ada Karya</h3>
        <p className="text-text-secondary max-w-sm">
          {activeCategory 
            ? "Belum ada karya yang diterbitkan di kategori ini."
            : "Belum ada karya yang diterbitkan saat ini."}
        </p>
      </div>
    );
  }

  // To support infinite scroll loop, we generate items up to visibleCount
  // by looping over shuffledWorks
  const displayItems = Array.from({ length: visibleCount }).map((_, i) => {
    return shuffledWorks[i % shuffledWorks.length];
  }).filter(Boolean); // filter out undefined during initial render before shuffle

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-8">
      {displayItems.map((item, index) => (
        <KaryaCard
          key={`${item.id}-${index}`}
          id={item.id}
          judul={item.judul}
          namaMahasiswa={item.namaMahasiswa}
          prodi={item.prodi}
          kategori={item.kategori}
          thumbnailUrl={item.thumbnailUrl}
          media={item.media}
          viewCount={item.viewCount}
        />
      ))}
      
      {/* Infinite Scroll trigger element */}
      {shuffledWorks.length > 0 && (
        <div ref={ref} className="h-10 flex items-center justify-center">
          <Skeleton variant="line" width="60%" className="mx-auto" />
        </div>
      )}
    </div>
  );
}
