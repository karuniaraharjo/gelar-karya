import { ReelsFeed } from "@/components/features/karya/ReelsFeed";

export default function ReelsPage() {
  return (
    // Max-w-md or lg to simulate mobile view on desktop if desired, 
    // but typically reels is full width of its container.
    <div className="w-full max-w-md mx-auto">
      <ReelsFeed />
    </div>
  );
}
