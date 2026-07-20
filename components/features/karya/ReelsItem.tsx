"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Volume2, VolumeX, Play } from "lucide-react";

interface ReelsItemProps {
  id: string;
  judul: string;
  namaMahasiswa: string;
  media: { url: string; tipe: string; thumbnailUrl?: string }[];
}

export function ReelsItem({ id, judul, namaMahasiswa, media }: ReelsItemProps) {
  const { ref, inView } = useInView({ threshold: 0.6 });
  const [hasMounted, setHasMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (inView && !hasMounted) {
      setHasMounted(true);
    }
  }, [inView, hasMounted]);

  useEffect(() => {
    media.forEach((item, index) => {
      if (item.tipe === "video" && videoRefs.current[index]) {
        if (inView && index === activeIndex && isPlaying) {
          videoRefs.current[index]?.play().catch((err) => {
            console.warn("Autoplay blocked:", err);
            setIsPlaying(false);
          });
        } else {
          videoRefs.current[index]?.pause();
        }
      }
    });
  }, [inView, activeIndex, isPlaying, media]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    const activeMedia = media[activeIndex];
    if (activeMedia?.tipe !== "video") return;
    
    if (isPlaying) {
      videoRefs.current[activeIndex]?.pause();
      setIsPlaying(false);
    } else {
      videoRefs.current[activeIndex]?.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const index = Math.round(target.scrollLeft / target.clientWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const hasMultipleMedia = media && media.length > 1;

  return (
    <div
      ref={ref}
      className="relative w-full h-[calc(100dvh-80px)] snap-center snap-always bg-black flex items-center justify-center overflow-hidden shrink-0"
    >
      {hasMounted ? (
        <>
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory w-full h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onScroll={handleScroll}
            onClick={togglePlay}
          >
            {media.map((item, index) => (
              <div key={index} className="relative w-full h-full shrink-0 snap-center snap-always">
                {item.tipe === "video" ? (
                  <>
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      src={item.url}
                      poster={item.thumbnailUrl}
                      className="absolute inset-0 w-full h-full object-contain"
                      loop
                      playsInline
                      muted={isMuted}
                      autoPlay={inView && index === activeIndex}
                    />
                    {!isPlaying && index === activeIndex && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10">
                        <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                          <Play size={32} className="ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Image
                    src={item.url}
                    alt={`${judul} - Media ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={inView && index === 0}
                  />
                )}
              </div>
            ))}
          </div>



          {/* Mute toggle button - only show if active media is video */}
          {media[activeIndex]?.tipe === "video" && (
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-bg-elevated animate-pulse" />
      )}

      {/* Overlay Info (Gradient bottom) */}
      <div className="absolute inset-x-0 bottom-0 pt-32 pb-6 px-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 pointer-events-none flex flex-col justify-end">
        <div className="pointer-events-auto flex flex-col gap-1 items-start">
          {/* Dots Indicator */}
          {hasMultipleMedia && (
            <div className="flex gap-1.5 z-20 pointer-events-none mb-2">
              {media.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          )}
          <h2 className="text-xl font-bold text-white line-clamp-2">{judul}</h2>
          <p className="text-sm text-gray-300 font-medium mb-3">{namaMahasiswa}</p>
          <Link 
            href={`/karya/${id}`}
            className="inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-colors px-4 py-2 text-sm bg-accent-primary text-white hover:bg-accent-primary-hover shadow-lg shadow-black/20"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
