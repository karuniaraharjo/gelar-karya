"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { createClient } from "@/lib/supabase/client";
import { ReelsItem } from "./ReelsItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCategory } from "@/components/providers/CategoryProvider";

export function ReelsFeed() {
  const { activeCategory } = useCategory();
  const supabase = createClient();
  const { ref, inView } = useInView();

  const fetchReels = async ({ pageParam }: { pageParam?: string }) => {
    let query = supabase
      .from("karya")
      .select(`
        id,
        judul,
        nama_mahasiswa,
        created_at,
        kategori:kategori_id(nama, slug),
        karya_media(url, tipe, thumbnail_url, urutan)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(5);

    if (activeCategory) {
      query = query.eq("kategori.slug", activeCategory);
    }

    if (pageParam) {
      query = query.lt("created_at", pageParam);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const processedData = data.map((item: any) => {
      // For reels, we want to play videos if possible, or show images.
      // If there's a video, prefer the first video. Otherwise first media.
      const sortedMedia = item.karya_media?.sort((a: any, b: any) => a.urutan - b.urutan) || [];
      let primaryMedia = sortedMedia.find((m: any) => m.tipe === "video");
      if (!primaryMedia) {
        primaryMedia = sortedMedia[0];
      }
      
      const defaultMedia = {
        url: "https://placehold.co/600x900/16161C/9A9AA5.webp?text=No+Media",
        tipe: "image",
      };

      return {
        id: item.id,
        judul: item.judul,
        namaMahasiswa: item.nama_mahasiswa,
        kategori: item.kategori?.nama || "Kategori",
        media: primaryMedia ? {
          url: primaryMedia.url,
          tipe: primaryMedia.tipe,
          thumbnail_url: primaryMedia.thumbnail_url,
        } : defaultMedia,
        createdAt: item.created_at,
      };
    });

    if (activeCategory) {
      return processedData.filter((item) => item.kategori !== "Kategori" && item.kategori != null);
    }

    return processedData;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["karya", "reels", activeCategory],
    queryFn: fetchReels,
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
      <div className="w-full h-[calc(100dvh-176px)] bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text-secondary text-sm">Memuat Reels...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-[calc(100dvh-176px)] bg-black flex flex-col items-center justify-center p-8 text-center text-danger">
        <p>Gagal memuat reels: {(error as Error).message}</p>
      </div>
    );
  }

  const allReels = data.pages.flat();

  if (allReels.length === 0) {
    return (
      <div className="w-full h-[calc(100dvh-176px)] bg-black flex flex-col items-center justify-center p-8 text-center">
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

  return (
    // The container is exactly the available height and hides scrollbars
    <div className="w-full h-[calc(100dvh-176px)] overflow-y-scroll snap-y snap-mandatory bg-black [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {allReels.map((item) => (
        <ReelsItem
          key={item.id}
          id={item.id}
          judul={item.judul}
          namaMahasiswa={item.namaMahasiswa}
          media={item.media}
        />
      ))}
      
      {/* Infinite Scroll trigger element */}
      <div 
        ref={ref} 
        className="w-full h-32 snap-center flex items-center justify-center bg-black shrink-0"
      >
        {isFetchingNextPage ? (
          <div className="w-8 h-8 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
        ) : hasNextPage ? (
          <div className="text-text-secondary text-sm">Scroll untuk memuat...</div>
        ) : (
          <div className="text-text-secondary text-sm">Sudah menampilkan semua reels</div>
        )}
      </div>
    </div>
  );
}
