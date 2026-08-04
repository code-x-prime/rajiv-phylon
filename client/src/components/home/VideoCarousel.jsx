"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function VideoSkeleton() {
  return (
    <div className="w-full">
      <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

function VideoCard({ video, isActive }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isActive) {
      el.play().catch(() => setIsPlaying(false));
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isActive]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setIsPlaying(true);
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={video.videoUrlResolved || video.videoUrl}
        className="w-full aspect-video object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
      />

      {/* Controls overlay - hover pr */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-black" />
            ) : (
              <Play className="h-5 w-5 text-black ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mute button - always visible */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors z-10"
      >
        {isMuted ? (
          <VolumeX className="h-3.5 w-3.5 text-white" />
        ) : (
          <Volume2 className="h-3.5 w-3.5 text-white" />
        )}
      </button>

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
        <h3 className="text-white font-semibold text-sm">{video.title}</h3>
        {video.description && (
          <p className="text-white/70 text-xs mt-1 line-clamp-1">{video.description}</p>
        )}
      </div>
    </div>
  );
}

export function VideoCarousel() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [
      autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/videos`);
        const data = await res.json();
        if (!cancelled) setVideos(data.data || []);
      } catch {
        if (!cancelled) setVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-site mx-auto px-6 lg:px-10">
          <div className="text-center mb-8">
            <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-3 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <VideoSkeleton />
            <VideoSkeleton className="hidden md:block" />
            <VideoSkeleton className="hidden lg:block" />
          </div>
        </div>
      </section>
    );
  }

  if (!videos.length) return null;

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="max-w-site mx-auto px-6 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <p className="type-overline text-[#F5B400] mb-3">Our Work</p>
          <h2 className="font-display font-medium text-[clamp(1.5rem,3vw,2.25rem)] text-[#111111] tracking-[-0.02em]">
            See Quality In Action
          </h2>
          <p className="text-[16px] text-gray-500 font-body mt-3">
            Watch our manufacturing process and product showcases
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Nav buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-5 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-200 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-5 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-200 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          {/* Embla viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <VideoCard
                    video={video}
                    isActive={index === selectedIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {videos.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "bg-[#F5B400] w-8"
                      : "bg-gray-300 hover:bg-gray-400 w-2"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
