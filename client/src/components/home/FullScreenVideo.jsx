"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export function FullScreenVideo() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/videos/fullscreen`);
        const data = await res.json();
        if (!cancelled && data.data) {
          setVideo(data.data);
        }
      } catch {
        if (!cancelled) setVideo(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // IntersectionObserver: Play video when visible in viewport, pause when scrolled away
  useEffect(() => {
    const el = videoRef.current;
    const container = containerRef.current;
    if (!el || !container || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
          el.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [video]);

  const togglePlay = () => {
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

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  if (loading || !video || !video.videoUrl) return null;

  const src = video.videoUrlResolved || video.videoUrl;

  return (
    <section ref={containerRef} className="w-full bg-[#0A0A0A] py-8 sm:py-12 md:py-16 overflow-hidden">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Heading (if title exists) */}
        {video.title && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-6 sm:mb-8"
          >
            <p className="type-overline text-[#F5B400] mb-2 uppercase tracking-widest text-xs font-bold">
              Featured Showcase
            </p>
            <h2 className="font-display font-medium text-[clamp(1.5rem,3vw,2.25rem)] text-white tracking-[-0.02em]">
              {video.title}
            </h2>
            {video.description && (
              <p className="text-[15px] text-gray-400 font-body mt-2 max-w-2xl mx-auto">
                {video.description}
              </p>
            )}
          </motion.div>
        )}

        {/* Full Width Video Container */}
        <div className="relative group rounded-2xl sm:rounded-3xl bg-black overflow-hidden shadow-2xl border border-white/10 aspect-video md:aspect-[21/9]">
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
          />

          {/* Gradient Overlay for Text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Center Play / Pause Action Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <button
              onClick={togglePlay}
              type="button"
              className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F5B400] hover:bg-[#e0a300] text-black flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="h-7 w-7 sm:h-8 sm:w-8 fill-black" />
              ) : (
                <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-black ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Left Controls & Title Info */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 flex items-center gap-3">
            <button
              onClick={toggleMute}
              type="button"
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </button>

            {!video.title && video.description && (
              <span className="text-white/80 text-xs sm:text-sm font-medium line-clamp-1">
                {video.description}
              </span>
            )}
          </div>

          {/* Top Right Badge */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <span className="bg-[#F5B400] text-black text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Featured HD Video
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
