import { HomeFeed } from "@/components/features/karya/HomeFeed";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { fetchFeedKarya } from "@/lib/api/karya";

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: ["karya", "feed", null],
    queryFn: () => fetchFeedKarya(supabase as any, { activeCategory: null }),
  });

  return (
    <div className="w-full pt-6">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeFeed />
      </HydrationBoundary>
    </div>
  );
}
