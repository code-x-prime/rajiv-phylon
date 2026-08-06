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
      <div className="h-[200px] sm:h-[240px] md:h-[280px] lg:h-[360px] xl:h-[420px] bg-gray-200 rounded-2xl animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

function VideoCard({ video, isVisible }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isVisible) {
      el.play().catch(() => setIsPlaying(false));
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isVisible]);

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
    <div className="relative group rounded-2xl bg-black shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <video
        ref={videoRef}
        src={video.videoUrlResolved || video.videoUrl}
        className="w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[360px] xl:h-[420px] object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="auto"
      />

      {/* Center play/pause button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <button
          onClick={togglePlay}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 backdrop-blur-sm"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-black" />
          ) : (
            <Play className="h-6 w-6 text-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* Title - bottom right */}
      {(video.title || video.description) && (
        <div className="absolute bottom-0 right-0 p-4 text-right z-10">
          {video.title && (
            <h3 className="text-white font-semibold text-sm drop-shadow-lg">{video.title}</h3>
          )}
          {video.description && (
            <p className="text-white/80 text-xs mt-0.5 line-clamp-1 drop-shadow-lg">{video.description}</p>
          )}
        </div>
      )}

      {/* Mute button - bottom left */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 z-10 backdrop-blur-sm"
      >
        {isMuted ? (
          <VolumeX className="h-3.5 w-3.5 text-white" />
        ) : (
          <Volume2 className="h-3.5 w-3.5 text-white" />
        )}
      </button>

      {/* Badge - top right */}
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          Video
        </span>
      </div>
    </div>
  );
}

export function VideoCarousel({
  section = "1",
  overline = section === "2" ? "Highlights" : "Our Work",
  title = section === "2" ? "Featured Videos" : "See Quality In Action",
  description = section === "2" ? "Explore our product demonstrations and technology highlights" : "Watch our manufacturing process and product showcases"
}) {
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
  const [visibleSlides, setVisibleSlides] = useState([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setVisibleSlides(emblaApi.slidesInView());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("slidesInView", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("slidesInView", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/videos?section=${section}`);
        const data = await res.json();
        if (!cancelled) setVideos(data.data || []);
      } catch {
        if (!cancelled) setVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [section]);

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
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-site mx-auto px-6 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          {overline && <p className="type-overline text-[#F5B400] mb-3">{overline}</p>}
          {title && (
            <h2 className="font-display font-medium text-[clamp(1.5rem,3vw,2.25rem)] text-[#111111] tracking-[-0.02em]">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[16px] text-gray-500 font-body mt-3">
              {description}
            </p>
          )}
        </motion.div>

        {/* Carousel */}
        <div className="relative group/carousel">
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
                    isVisible={visibleSlides.includes(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row: dots + nav buttons */}
          <div className="flex items-center justify-between mt-6">
            {/* Dots */}
            {videos.length > 1 ? (
              <div className="flex justify-center gap-2">
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
            ) : <div />}

            {/* Nav buttons - bottom right */}
            {videos.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollPrev}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg hover:border-[#F5B400] flex items-center justify-center transition-all duration-200"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={scrollNext}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg hover:border-[#F5B400] flex items-center justify-center transition-all duration-200"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
