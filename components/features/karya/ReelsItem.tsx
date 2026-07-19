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
  media: { url: string; tipe: string; thumbnail_url?: string };
}

export function ReelsItem({ id, judul, namaMahasiswa, media }: ReelsItemProps) {
  // Intersection observer to track if this specific reel is active in the viewport
  const { ref, inView } = useInView({
    threshold: 0.6, // Active when at least 60% visible
  });

  const [hasMounted, setHasMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy mount: once it comes into view, mount it and keep it mounted
  useEffect(() => {
    if (inView && !hasMounted) {
      setHasMounted(true);
    }
  }, [inView, hasMounted]);

  // Video playback control based on viewport visibility
  useEffect(() => {
    if (media.tipe === "video" && videoRef.current) {
      if (inView) {
        if (isPlaying) {
          videoRef.current.play().catch((err) => {
            console.warn("Autoplay blocked:", err);
            setIsPlaying(false);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView, media.tipe, isPlaying]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    if (media.tipe !== "video" || !videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-[calc(100dvh-176px)] snap-center bg-black flex items-center justify-center overflow-hidden shrink-0"
      onClick={togglePlay}
    >
      {/* Media Layer */}
      {hasMounted ? (
        media.tipe === "video" ? (
          <>
            <video
              ref={videoRef}
              src={media.url}
              poster={media.thumbnail_url}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              playsInline
              muted={isMuted}
            />
            {/* Play/Pause overlay indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10">
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                  <Play size={32} className="ml-1" fill="currentColor" />
                </div>
              </div>
            )}
            {/* Mute toggle button */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </>
        ) : (
          <Image
            src={media.url}
            alt={judul}
            fill
            sizes="100vw"
            className="object-cover"
            priority={inView} // Only add priority if currently in view
          />
        )
      ) : (
        // Fallback placeholder while lazy mounting
        <div className="absolute inset-0 bg-bg-elevated animate-pulse" />
      )}

      {/* Overlay Info (Gradient bottom) */}
      <div className="absolute inset-x-0 bottom-0 pt-32 pb-6 px-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 pointer-events-none flex flex-col justify-end">
        <div className="pointer-events-auto flex flex-col gap-1 items-start">
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
