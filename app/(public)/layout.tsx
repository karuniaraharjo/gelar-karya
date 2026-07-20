import { createClient } from "@/lib/supabase/server";
import { CategoryProvider } from "@/components/providers/CategoryProvider";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { SwipeNavigation } from "@/components/layout/SwipeNavigation";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Fetch categories that have at least one published karya
  // Using an inner join with karya where status is 'published'
  const { data: categories, error } = await supabase
    .from("kategori")
    .select("id, nama, slug, icon_url, urutan, karya!inner(id)")
    .eq("karya.status", "published")
    .order("urutan", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  // Map to clean categories, removing the nested karya array from the payload
  const cleanCategories =
    categories?.map((cat) => ({
      id: cat.id,
      nama: cat.nama,
      slug: cat.slug,
      icon_url: cat.icon_url,
      urutan: cat.urutan,
    })) || [];

  return (
    <CategoryProvider>
      <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">
        <TopNavigation categories={cleanCategories} />
        <SwipeNavigation>
          {children}
        </SwipeNavigation>
        <BottomNavigation />
      </div>
    </CategoryProvider>
  );
}

