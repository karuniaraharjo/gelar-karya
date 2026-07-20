"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchExploreKarya } from "@/lib/api/karya";
import { Skeleton } from "@/components/ui/Skeleton";
import { useInView } from "react-intersection-observer";

export function ExploreGrid() {
  const supabase = createClient();
  const { ref, inView } = useInView({
    rootMargin: "400px",
  });

  const [visibleCount, setVisibleCount] = useState(15);
  const [shuffledWorks, setShuffledWorks] = useState<any[]>([]);

  const { data, status, error } = useQuery({
    queryKey: ["karya", "explore", "all"],
    queryFn: () => fetchExploreKarya(supabase as any, {}),
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
      setVisibleCount((prev) => prev + 15);
    }
  }, [inView, shuffledWorks.length]);

  // Helper to get varied aspect ratio
  const getAspectRatio = (index: number) => {
    const ratios = [
      "aspect-square", 
      "aspect-[3/4]", 
      "aspect-[4/5]", 
      "aspect-[4/3]",
      "aspect-[1/1]"
    ];
    // Deterministic pseudo-random based on index
    const hash = (index * 137) % ratios.length;
    return ratios[hash];
  };

  const displayItems = Array.from({ length: visibleCount }).map((_, i) => {
    return shuffledWorks[i % shuffledWorks.length];
  }).filter(Boolean);

  return (
    <div className="w-full">
      {status === "pending" ? (
        <div className="columns-2 md:columns-3 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`w-full mb-1 break-inside-avoid ${getAspectRatio(i)}`}>
              <Skeleton variant="rect" className="w-full h-full rounded-[4px]" />
            </div>
          ))}
        </div>
      ) : status === "error" ? (
        <div className="p-8 text-center text-danger">
          <p>Gagal memuat explore: {(error as Error).message}</p>
        </div>
      ) : shuffledWorks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
          <div className="w-24 h-24 mb-4 opacity-20 text-text-secondary">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/></svg>
          </div>
          <h3 className="text-xl font-medium text-text-primary mb-2">Belum Ada Karya</h3>
          <p className="text-text-secondary text-sm max-w-sm">
            Karya yang dipublikasikan akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-1">
          {displayItems.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={`/karya/${item.id}`}
              className={`relative block w-full mb-1 bg-bg-elevated overflow-hidden group rounded-[4px] break-inside-avoid ${getAspectRatio(index)}`}
            >
              {item.tipe === "video" && item.videoUrl ? (
                <video
                  src={item.videoUrl}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={item.thumbnailUrl}
                  alt="Thumbnail"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index < 8}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                {item.kategori && (
                  <span className="text-[10px] font-medium px-2 py-1 bg-accent-primary text-white rounded-full self-start">
                    {item.kategori.nama}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Infinite Scroll Trigger */}
      {shuffledWorks.length > 0 && (
        <div ref={ref} className="py-6 flex justify-center w-full">
          <div className="w-6 h-6 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
