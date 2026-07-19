import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton variant="line" width="200px" height="32px" lines={1} className="mb-2" />
          <Skeleton variant="line" width="300px" height="16px" lines={1} />
        </div>
        <Skeleton variant="rect" width="140px" height="40px" className="rounded-md" />
      </div>

      <div className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden">
        {/* Filter Bar Skeleton */}
        <div className="p-4 border-b border-border-subtle bg-bg-base/30 flex flex-col sm:flex-row gap-4">
          <Skeleton variant="rect" width="100%" height="40px" className="sm:max-w-xs rounded-md" />
          <Skeleton variant="rect" width="160px" height="40px" className="rounded-md" />
        </div>

        {/* Table Skeleton */}
        <div className="p-4 space-y-4">
          <div className="border-b border-border-subtle pb-4 flex gap-4">
            <Skeleton variant="line" width="30%" lines={1} />
            <Skeleton variant="line" width="20%" lines={1} />
            <Skeleton variant="line" width="15%" lines={1} />
            <Skeleton variant="line" width="15%" lines={1} />
            <Skeleton variant="line" width="20%" lines={1} />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-border-subtle pb-4 last:border-0 flex gap-4 items-center">
              <div className="w-[30%]">
                <Skeleton variant="line" width="80%" lines={1} />
              </div>
              <div className="w-[20%]">
                <Skeleton variant="line" width="60%" lines={1} />
              </div>
              <div className="w-[15%]">
                <Skeleton variant="rect" width="70px" height="24px" className="rounded-full" />
              </div>
              <div className="w-[15%]">
                <Skeleton variant="line" width="80%" lines={1} />
              </div>
              <div className="w-[20%] flex justify-end gap-2">
                <Skeleton variant="line" width="40px" lines={1} />
                <Skeleton variant="line" width="40px" lines={1} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
