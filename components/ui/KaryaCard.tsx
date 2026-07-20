"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useInView } from "react-intersection-observer";
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
  media?: {
    url: string;
    tipe: string;
    thumbnailUrl?: string;
  }[];
}

export function KaryaCard({
  id,
  judul,
  namaMahasiswa,
  prodi,
  kategori,
  thumbnailUrl,
  viewCount,
  media,
}: KaryaCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  const hasMultipleMedia = media && media.length > 1;

  useEffect(() => {
    if (!media) return;
    
    media.forEach((item, index) => {
      const videoEl = videoRefs.current[index];
      if (item.tipe === "video" && videoEl) {
        if (inView && index === activeIndex) {
          videoEl.play().catch((err) => {
            console.warn("Autoplay blocked:", err);
          });
        } else {
          videoEl.pause();
        }
      }
    });
  }, [inView, activeIndex, media]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const index = Math.round(target.scrollLeft / target.clientWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const renderMedia = () => {
    if (media && media.length > 0) {
      if (hasMultipleMedia) {
        return (
          <>
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory w-full h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              onScroll={handleScroll}
            >
              {media.map((item, index) => (
                <div key={index} className="relative w-full h-full shrink-0 snap-center snap-always">
                  {item.tipe === "video" ? (
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      src={item.url}
                      poster={item.thumbnailUrl || thumbnailUrl}
                      className="object-cover w-full h-full"
                      controls
                      preload="auto"
                      playsInline
                      muted
                      loop
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <Link href={`/karya/${id}`} className="block relative w-full h-full">
                      <Image
                        src={item.url || thumbnailUrl}
                        alt={`${judul} - Media ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {media.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        );
      }

      // Single media
      const singleMedia = media[0];
      if (singleMedia.tipe === "video") {
        return (
          <video
            ref={(el) => { videoRefs.current[0] = el; }}
            src={singleMedia.url}
            poster={singleMedia.thumbnailUrl || thumbnailUrl}
            className="object-cover w-full h-full"
            controls
            preload="auto"
            playsInline
            muted
            loop
            onClick={(e) => e.stopPropagation()}
          />
        );
      }
      
      return (
        <Link href={`/karya/${id}`} className="block relative w-full h-full">
          <Image
            src={singleMedia.url || thumbnailUrl}
            alt={`Thumbnail untuk ${judul}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </Link>
      );
    }

    // Fallback to original thumbnailUrl if no media array is provided
    return (
      <Link href={`/karya/${id}`} className="block relative w-full h-full">
        <Image
          src={thumbnailUrl}
          alt={`Thumbnail untuk ${judul}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </Link>
    );
  };

  return (
    <Card hoverable padding="none" className="overflow-hidden bg-bg-elevated border-border-subtle" ref={ref}>
      <div className="relative w-full aspect-[4/3] bg-bg-base">
        {renderMedia()}
      </div>
      <Link href={`/karya/${id}`} className="block p-4">
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
      </Link>
    </Card>
  );
}
