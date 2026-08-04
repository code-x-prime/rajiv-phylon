"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Maximize, X } from "lucide-react";

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

function VideoModal({ video, isOpen, onClose }) {
  const modalVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        const el = modalVideoRef.current;
        if (el) {
          el.muted = true;
          el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      }, 100);
    } else {
      document.body.style.overflow = "";
      const el = modalVideoRef.current;
      if (el) {
        el.pause();
        el.currentTime = 0;
        setIsPlaying(false);
      }
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") { e.preventDefault(); handleTogglePlay(); }
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handleTogglePlay = () => {
    const el = modalVideoRef.current;
    if (!el) return;
    if (el.paused) { el.play().then(() => setIsPlaying(true)).catch(() => {}); }
    else { el.pause(); setIsPlaying(false); }
  };

  const handleToggleMute = () => {
    const el = modalVideoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(!isMuted);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all duration-200 group/close"
            >
              <X className="h-5 w-5 text-white group-hover/close:rotate-90 transition-transform duration-200" />
            </button>

            {/* Video */}
            <video
              ref={modalVideoRef}
              src={video.videoUrlResolved || video.videoUrl}
              className="w-full max-h-[80vh] object-contain bg-black"
              loop
              muted={isMuted}
              playsInline
              controls={false}
            />

            {/* Controls overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/10">
              <button
                onClick={handleTogglePlay}
                className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110"
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black ml-1" />
                )}
              </button>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between z-10">
              {/* Title */}
              <div className="flex-1 min-w-0">
                {video.title && (
                  <h3 className="text-white font-semibold text-base drop-shadow-lg truncate">{video.title}</h3>
                )}
                {video.description && (
                  <p className="text-white/70 text-sm mt-0.5 line-clamp-1 drop-shadow-lg">{video.description}</p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleToggleMute}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-white" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function VideoCard({ video, isActive }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div className="relative group rounded-2xl overflow-hidden bg-black shadow-md hover:shadow-xl transition-shadow duration-300">
        <video
          ref={videoRef}
          src={video.videoUrlResolved || video.videoUrl}
          className="w-full aspect-video object-contain bg-black"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
        />

        {/* Center play/pause button - hover */}
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

        {/* Bottom left controls */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5 text-white" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-white" />
            )}
          </button>

          {/* Fullscreen button */}
          <button
            onClick={openModal}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <Maximize className="h-3.5 w-3.5 text-white" />
          </button>
        </div>

        {/* Badge - top right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Video
          </span>
        </div>
      </div>

      {/* Modal */}
      <VideoModal video={video} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
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
