"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const ROUTES = ["/home", "/reels", "/explore"];

export function SwipeNavigation({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Don't intercept swipe if touching a carousel or horizontal scroll element
      if ((e.target as HTMLElement).closest('.no-swipe')) {
        return;
      }
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      
      // Don't intercept swipe if touching a carousel or horizontal scroll element
      if ((e.target as HTMLElement).closest('.no-swipe')) {
        touchStart.current = null;
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchStart.current.x - touchEndX;
      const deltaY = touchStart.current.y - touchEndY;

      // Check if horizontal swipe is dominant and significant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        // Find current index
        // Treat "/" as "/home"
        const currentPath = pathname === "/" ? "/home" : pathname;
        const currentIndex = ROUTES.indexOf(currentPath);

        if (currentIndex !== -1) {
          if (deltaX > 0 && currentIndex < ROUTES.length - 1) {
            // Swipe left -> go next
            router.push(ROUTES[currentIndex + 1]);
          } else if (deltaX < 0 && currentIndex > 0) {
            // Swipe right -> go prev
            router.push(ROUTES[currentIndex - 1]);
          }
        }
      }

      touchStart.current = null;
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pathname, router]);

  return (
    <main className={`flex-1 overflow-x-hidden pb-20 ${pathname === "/reels" ? "pt-0" : "pt-24"}`}>
      {children}
    </main>
  );
}
