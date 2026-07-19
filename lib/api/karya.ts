import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/types";

export const fetchFeedKarya = async (
  supabase: SupabaseClient<Database>,
  { pageParam, activeCategory }: { pageParam?: string; activeCategory?: string | null }
) => {
  let query = supabase
    .from("karya")
    .select(`
      id,
      judul,
      nama_mahasiswa,
      prodi,
      view_count,
      created_at,
      kategori:kategori_id(nama, slug),
      karya_media(url, tipe, thumbnail_url, urutan)
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5);

  if (activeCategory) {
    // Note: this assumes inner join if possible, but PostgREST filter on nested needs caution.
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
    const firstMedia = item.karya_media?.sort((a: any, b: any) => a.urutan - b.urutan)[0];
    const thumbnailUrl = firstMedia?.tipe === "video" ? firstMedia.thumbnail_url : firstMedia?.url;
    
    return {
      id: item.id,
      judul: item.judul,
      namaMahasiswa: item.nama_mahasiswa,
      prodi: item.prodi,
      kategori: item.kategori?.nama || "Kategori",
      thumbnailUrl: thumbnailUrl || "https://placehold.co/600x400/16161C/9A9AA5.webp?text=No+Image",
      viewCount: item.view_count || 0,
      createdAt: item.created_at,
    };
  });

  if (activeCategory) {
    return processedData.filter((item) => item.kategori !== "Kategori" && item.kategori != null);
  }

  return processedData;
};

export const fetchExploreKarya = async (
  supabase: SupabaseClient<Database>,
  { pageParam }: { pageParam?: string }
) => {
  let query = supabase
    .from("karya")
    .select(`
      id,
      created_at,
      kategori:kategori_id(nama, slug),
      karya_media(url, tipe, thumbnail_url, urutan)
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(30);

  if (pageParam) {
    query = query.lt("created_at", pageParam);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item: any) => {
    const sortedMedia = item.karya_media?.sort((a: any, b: any) => a.urutan - b.urutan) || [];
    const primaryMedia = sortedMedia[0];
    const thumbnailUrl = primaryMedia?.tipe === "video" ? primaryMedia.thumbnail_url : primaryMedia?.url;
    
    return {
      id: item.id,
      thumbnailUrl: thumbnailUrl || "https://placehold.co/300x300/16161C/9A9AA5.webp?text=No+Image",
      kategori: item.kategori,
      createdAt: item.created_at,
    };
  });
};

