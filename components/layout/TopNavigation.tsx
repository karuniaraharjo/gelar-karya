"use client";

import { usePathname } from "next/navigation";
import { CategoryCircle } from "@/components/ui/CategoryCircle";
import { useCategory } from "@/components/providers/CategoryProvider";

type CategoryData = {
  id: string;
  nama: string;
  slug: string;
  icon_url: string | null;
  urutan: number;
};

export function TopNavigation({ categories }: { categories: CategoryData[] }) {
  const { activeCategory, setActiveCategory } = useCategory();
  const pathname = usePathname();

  if (pathname === "/reels") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-subtle">
      <div className="flex items-center gap-4 overflow-x-auto px-4 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <CategoryCircle
          label="Semua"
          isActive={activeCategory === null}
          onClick={() => setActiveCategory(null)}
          size="sm"
        />
        {categories.map((cat) => (
          <CategoryCircle
            key={cat.id}
            label={cat.nama}
            iconUrl={cat.icon_url || undefined}
            isActive={activeCategory === cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            size="sm"
          />
        ))}
      </div>
    </header>
  );
}
