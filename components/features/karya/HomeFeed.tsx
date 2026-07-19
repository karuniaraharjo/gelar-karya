"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
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

  const fetchKarya = async ({ pageParam }: { pageParam?: string }) => {
    return fetchFeedKarya(supabase as any, { pageParam, activeCategory });
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["karya", "feed", activeCategory],
    queryFn: fetchKarya,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].createdAt;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  const allKarya = data.pages.flat();

  if (allKarya.length === 0) {
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

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-8">
      {allKarya.map((item) => (
        <KaryaCard
          key={item.id}
          id={item.id}
          judul={item.judul}
          namaMahasiswa={item.namaMahasiswa}
          prodi={item.prodi}
          kategori={item.kategori}
          thumbnailUrl={item.thumbnailUrl}
          viewCount={item.viewCount}
        />
      ))}
      
      {/* Infinite Scroll trigger element */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage ? (
          <Skeleton variant="line" width="60%" className="mx-auto" />
        ) : hasNextPage ? (
          <div className="text-text-secondary text-sm">Memuat lagi...</div>
        ) : (
          <div className="text-text-secondary text-sm">Sudah menampilkan semua karya</div>
        )}
      </div>
    </div>
  );
}
