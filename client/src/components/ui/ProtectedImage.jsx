"use client";

import Image from "next/image";

/**
 * Wraps Next/Image and blocks right-click save and drag.
 * Image dikhai deti hai, lekin save/download asani se nahi ho sakta.
 * wrapperClassName = outer div (e.g. "relative w-full h-full"), className = Image class.
 */
export function ProtectedImage({ wrapperClassName = "", className, onContextMenu, onDragStart, ...imageProps }) {
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
