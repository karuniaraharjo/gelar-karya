import { ExploreGrid } from "@/components/features/karya/ExploreGrid";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { fetchExploreKarya } from "@/lib/api/karya";

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function ExplorePage() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: ["karya", "explore", "all"],
    queryFn: () => fetchExploreKarya(supabase as any, {}),
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExploreGrid />
      </HydrationBoundary>
    </div>
  );
}
