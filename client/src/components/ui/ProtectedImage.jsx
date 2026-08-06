"use client";

import Image from "next/image";

/**
 * Wraps Next/Image and blocks right-click save and drag.
 * Adds lazy loading by default for better performance.
 */
export function ProtectedImage({ wrapperClassName = "", className, onContextMenu, onDragStart, loading, priority, unoptimized = true, ...imageProps }) {
  return (
    <div
      className={`select-none ${wrapperClassName}`.trim()}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e);
      }}
    >
      <Image
        {...imageProps}
        unoptimized={unoptimized}
        priority={priority}
        loading={priority ? undefined : (loading ?? "lazy")}
        className={className}
        draggable={false}
        onDragStart={(e) => {
          e.preventDefault();
          onDragStart?.(e);
        }}
      />
    </div>
  );
}
