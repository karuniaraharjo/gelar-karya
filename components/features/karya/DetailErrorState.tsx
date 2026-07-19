"use client";

import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/ui/ErrorState";

export function DetailErrorState({ message }: { message: string }) {
  const router = useRouter();
  
  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] w-full">
      <ErrorState 
        message={message} 
        onRetry={() => router.back()} 
        retryLabel="Kembali" 
      />
    </div>
  );
}
