import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Card } from "./Card";
import { Badge } from "./Badge";

interface KaryaCardProps {
  id: string;
  judul: string;
  namaMahasiswa: string;
  prodi?: string | null;
  kategori: string;
  thumbnailUrl: string;
  viewCount: number;
}

export function KaryaCard({
  id,
  judul,
  namaMahasiswa,
  prodi,
  kategori,
  thumbnailUrl,
  viewCount,
}: KaryaCardProps) {
  return (
    <Link href={`/karya/${id}`} className="block">
      <Card hoverable padding="none" className="overflow-hidden bg-bg-elevated border-border-subtle">
        <div className="relative w-full aspect-[4/3] bg-bg-base">
          <Image
            src={thumbnailUrl}
            alt={`Thumbnail untuk ${judul}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-semibold text-text-primary text-base line-clamp-2">
              {judul}
            </h3>
            <Badge size="sm" variant="outline" className="shrink-0 mt-0.5 border-accent-primary text-accent-primary">
              {kategori}
            </Badge>
          </div>
          
          <div className="flex flex-col text-sm text-text-secondary mb-3">
            <span className="font-medium text-text-primary">{namaMahasiswa}</span>
            {prodi && <span>{prodi}</span>}
          </div>

          <div className="flex items-center text-xs text-text-secondary gap-1.5 pt-3 border-t border-border-subtle">
            <Eye size={14} />
            <span>{viewCount} tayangan</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
