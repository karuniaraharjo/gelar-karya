"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Reels", href: "/reels", icon: Film },
    { name: "Explore", href: "/explore", icon: LayoutGrid },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-elevated border-t border-border-subtle pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/home");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1",
                isActive
                  ? "text-accent-primary"
                  : "text-text-secondary hover:text-text-primary transition-colors"
              )}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-primary" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
