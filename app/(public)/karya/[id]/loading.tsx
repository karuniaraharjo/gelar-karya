import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function KaryaDetailLoading() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-176px)]">
      <div className="w-full max-w-2xl mx-auto bg-bg-elevated flex-1 shadow-lg border-x border-border-subtle">
        
        {/* Top Header / Back Navigation */}
        <div className="px-4 py-3 flex items-center border-b border-border-subtle bg-bg-elevated/80 sticky top-16 z-30">
          <Link href="/home" className="flex items-center gap-2 text-text-secondary">
            <ArrowLeft size={20} />
            <span className="font-medium text-sm">Kembali</span>
          </Link>
        </div>

        {/* Media Carousel Skeleton */}
        <div className="w-full aspect-[4/3] bg-black">
          <Skeleton variant="rect" width="100%" height="100%" className="rounded-none" />
        </div>

        {/* Main Content */}
        <div className="p-5">
          <div className="flex justify-between items-start gap-4 mb-4">
            <Skeleton variant="line" width="70%" height="32px" lines={1} />
            <Skeleton variant="circle" width="40px" height="40px" />
          </div>

          {/* Meta Information Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Skeleton variant="rect" width="80px" height="28px" className="rounded-full" />
            <Skeleton variant="rect" width="100px" height="28px" className="rounded-full" />
          </div>

          {/* Details Box */}
          <div className="bg-bg-base rounded-[var(--radius-lg)] p-4 border border-border-subtle mb-6 space-y-3">
            <div className="flex justify-between border-b border-border-subtle pb-2">
              <Skeleton variant="line" width="80px" lines={1} />
              <Skeleton variant="line" width="150px" lines={1} />
            </div>
            <div className="flex justify-between border-b border-border-subtle pb-2">
              <Skeleton variant="line" width="100px" lines={1} />
              <Skeleton variant="line" width="120px" lines={1} />
            </div>
            <div className="flex justify-between">
              <Skeleton variant="line" width="130px" lines={1} />
              <Skeleton variant="line" width="140px" lines={1} />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 space-y-4">
            <Skeleton variant="line" width="30%" height="24px" lines={1} />
            <Skeleton variant="line" lines={4} />
          </div>

          {/* Tech Stack */}
          <div className="mb-8 space-y-4">
            <Skeleton variant="line" width="20%" height="24px" lines={1} />
            <div className="flex gap-2">
              <Skeleton variant="rect" width="70px" height="28px" className="rounded-md" />
              <Skeleton variant="rect" width="90px" height="28px" className="rounded-md" />
              <Skeleton variant="rect" width="60px" height="28px" className="rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
