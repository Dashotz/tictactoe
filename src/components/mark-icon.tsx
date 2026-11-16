"use client";

import React from "react";
import { AvatarConfig, MarkId, MARKS } from "@/lib/game-data";
import { SkribblAvatar } from "@/components/skribbl-avatar";
import { cn } from "@/lib/utils";

interface MarkIconProps {
  markId: MarkId;
  avatar?: AvatarConfig;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MarkIcon({
  markId,
  avatar,
  size = "md",
  className,
}: MarkIconProps) {
  const def = MARKS.find((m) => m.id === markId) || MARKS[0];

  const dim =
    size === "sm" ? "w-5 h-5" : size === "md" ? "w-8 h-8" : "w-14 h-14";

  if (markId === "avatar-stamp" && avatar) {
    const avatarDim =
      size === "sm"
        ? "w-6 h-6"
        : size === "md"
          ? "w-9 h-9"
          : "w-14 h-14";
    return (
      <SkribblAvatar
        config={avatar}
        size={size === "lg" ? "lg" : size === "md" ? "md" : "sm"}
        className={cn(avatarDim, className)}
      />
    );
  }

  if (markId === "classic-x") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={cn(dim, className)}
        style={{ filter: `drop-shadow(0 0 10px ${def.glow})` }}
      >
        <path
          d="M16 16L48 48M48 16L16 48"
          stroke={def.color}
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (markId === "classic-o") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={cn(dim, className)}
        style={{ filter: `drop-shadow(0 0 10px ${def.glow})` }}
      >
        <circle
          cx="32"
          cy="32"
          r="18"
          stroke={def.color}
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (markId === "bolt") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={cn(dim, className)}
        style={{ filter: `drop-shadow(0 0 10px ${def.glow})` }}
      >
        <path
          d="M36 8L14 36H31L27 56L50 28H33L36 8Z"
          fill={def.color}
          stroke="#0B0F19"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (markId === "flame") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={cn(dim, className)}
        style={{ filter: `drop-shadow(0 0 10px ${def.glow})` }}
      >
        <path
          d="M33 8C33 8 49 21 49 37C49 47.5 41 55 32 55C23 55 15 47.5 15 37C15 29 20 22 23 19C23 24 27 26 27 26C26 17 33 8 33 8Z"
          fill={def.color}
          stroke="#0B0F19"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M32 32C32 32 39 38 39 44C39 48 36 51 32 51C28 51 25 48 25 44C25 39 32 32 32 32Z"
          fill="#FFD059"
        />
      </svg>
    );
  }

  if (markId === "crown") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={cn(dim, className)}
        style={{ filter: `drop-shadow(0 0 10px ${def.glow})` }}
      >
        <path
          d="M10 46L15 20L27 31L32 15L37 31L49 20L54 46H10Z"
          fill={def.color}
          stroke="#0B0F19"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (markId === "swords") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={cn(dim, className)}
        style={{ filter: `drop-shadow(0 0 10px ${def.glow})` }}
      >
        <path
          d="M14 50L50 14M12 42L22 52M50 50L14 14M42 52L52 42"
          stroke={def.color}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (markId === "star") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={cn(dim, className)}
        style={{ filter: `drop-shadow(0 0 10px ${def.glow})` }}
      >
        <path
          d="M32 9L38.9 23.3L54.7 25.5L43.2 36.6L46 52.3L32 44.8L18 52.3L20.8 36.6L9.3 25.5L25.1 23.3L32 9Z"
          fill={def.color}
          stroke="#0B0F19"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (markId === "ghost") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={cn(dim, className)}
        style={{ filter: `drop-shadow(0 0 10px ${def.glow})` }}
      >
        <path
          d="M16 32C16 20 23 12 32 12C41 12 48 20 48 32V52L42 47L37 52L32 47L27 52L22 47L16 52V32Z"
          fill={def.color}
          stroke="#0B0F19"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <circle cx="26" cy="29" r="3.5" fill="#0B0F19" />
        <circle cx="38" cy="29" r="3.5" fill="#0B0F19" />
      </svg>
    );
  }

  // rocket or fallback
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn(dim, className)}
      style={{ filter: `drop-shadow(0 0 10px ${def.glow})` }}
    >
      <path
        d="M32 10C41 18 44 30 44 41H20C20 30 23 18 32 10Z"
        fill={def.color}
        stroke="#0B0F19"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="28" r="5" fill="#0B0F19" />
      <path
        d="M20 36L13 45H20M44 36L51 45H44M27 46L32 55L37 46"
        stroke={def.color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

