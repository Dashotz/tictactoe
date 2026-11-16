"use client";

import React from "react";
import { AVATAR_COLORS, AvatarConfig } from "@/lib/game-data";
import { cn } from "@/lib/utils";

interface SkribblAvatarProps {
  config: AvatarConfig;
  size?: "sm" | "md" | "lg" | "xl";
  mood?: "idle" | "active" | "win" | "draw";
  className?: string;
}

const SIZE_MAP = {
  sm: "w-9 h-9",
  md: "w-12 h-12",
  lg: "w-20 h-20",
  xl: "w-28 h-28",
};

export function SkribblAvatar({
  config,
  size = "md",
  mood = "idle",
  className,
}: SkribblAvatarProps) {
  const palette =
    AVATAR_COLORS[config.colorIndex % AVATAR_COLORS.length] || AVATAR_COLORS[0];
  const eyesIdx = config.eyesIndex % 8;
  const mouthIdx = config.mouthIndex % 8;
  const hatIdx = config.hatIndex % 8;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none shrink-0",
        SIZE_MAP[size],
        mood === "active" && "animate-avatar-bob",
        mood === "win" && "animate-bounce",
        className
      )}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
      >
        {/* Ambient Ground Shadow */}
        <ellipse
          cx="60"
          cy="108"
          rx="32"
          ry="6"
          fill="rgba(0,0,0,0.38)"
        />

        {/* Skribbl-style hand-drawn wobbly blob head */}
        <path
          d="M24 66C22 40 37 25 60 25C83 25 98 40 96 66C94 90 81 101 60 101C39 101 26 90 24 66Z"
          fill={palette.fill}
          stroke="#0B0F19"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom crescent shading for 3D doodle volume */}
        <path
          d="M29 74C34 91 45 97 60 97C75 97 86 91 91 74C84 84 73 89 60 89C47 89 36 84 29 74Z"
          fill={palette.shade}
          opacity="0.7"
        />

        {/* Top Gloss Highlight */}
        <path
          d="M38 38C44 33 52 31 60 31"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Blush cheeks */}
        <ellipse cx="36" cy="70" rx="6" ry="3.5" fill="#FF5577" opacity="0.45" />
        <ellipse cx="84" cy="70" rx="6" ry="3.5" fill="#FF5577" opacity="0.45" />

        {/* EYES LAYER (8 Skribbl Variations) */}
        {eyesIdx === 0 && (
          <g>
            <circle cx="45" cy="57" r="6.5" fill="#0B0F19" />
            <circle cx="75" cy="57" r="6.5" fill="#0B0F19" />
            <circle cx="43" cy="54.5" r="2.2" fill="white" />
            <circle cx="73" cy="54.5" r="2.2" fill="white" />
          </g>
        )}
        {eyesIdx === 1 && (
          /* Deal With It Shades */
          <g>
            <path
              d="M26 52H94M32 50H56V63C56 65 54 66 51 66H37C34 66 32 64 32 61V50ZM64 50H88V61C88 64 86 66 83 66H69C66 66 64 65 64 63V50Z"
              fill="#0B0F19"
              stroke="#0B0F19"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path d="M36 54L42 62M68 54L74 62" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}
        {eyesIdx === 2 && (
          /* Starstruck */
          <g fill="#FFB800" stroke="#0B0F19" strokeWidth="2">
            <path d="M45 47L47.5 53.5L54.5 54L49 58.5L51 65L45 61L39 65L41 58.5L35.5 54L42.5 53.5L45 47Z" />
            <path d="M75 47L77.5 53.5L84.5 54L79 58.5L81 65L75 61L69 65L71 58.5L65.5 54L72.5 53.5L75 47Z" />
          </g>
        )}
        {eyesIdx === 3 && (
          /* Fierce Rival */
          <g>
            <circle cx="45" cy="58" r="6" fill="#0B0F19" />
            <circle cx="75" cy="58" r="6" fill="#0B0F19" />
            <circle cx="44" cy="56" r="2" fill="white" />
            <circle cx="74" cy="56" r="2" fill="white" />
            <path
              d="M35 47L53 53M85 47L67 53"
              stroke="#0B0F19"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </g>
        )}
        {eyesIdx === 4 && (
          /* Cheeky Wink */
          <g>
            <circle cx="45" cy="57" r="6.5" fill="#0B0F19" />
            <circle cx="43" cy="54.5" r="2.2" fill="white" />
            <path
              d="M67 57C70 52 79 52 82 57"
              stroke="#0B0F19"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </g>
        )}
        {eyesIdx === 5 && (
          /* Cyber Visor */
          <g>
            <rect
              x="31"
              y="49"
              width="58"
              height="15"
              rx="7.5"
              fill="#0B0F19"
              stroke="#00E5FF"
              strokeWidth="2.5"
            />
            <path
              d="M38 56.5H82"
              stroke="#00E5FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        )}
        {eyesIdx === 6 && (
          /* Hypno Swirl */
          <g stroke="#0B0F19" strokeWidth="3" strokeLinecap="round">
            <circle cx="45" cy="57" r="8" fill="white" />
            <circle cx="75" cy="57" r="8" fill="white" />
            <circle cx="46" cy="57" r="3" fill="#0B0F19" />
            <circle cx="74" cy="57" r="3" fill="#0B0F19" />
          </g>
        )}
        {eyesIdx === 7 && (
          /* Laser Focus */
          <g>
            <circle cx="45" cy="57" r="7" fill="#0B0F19" />
            <circle cx="75" cy="57" r="7" fill="#0B0F19" />
            <circle cx="45" cy="57" r="3.2" fill="#FF553E" />
            <circle cx="75" cy="57" r="3.2" fill="#FF553E" />
          </g>
        )}

        {/* MOUTH LAYER (8 Skribbl Variations) */}
        {mouthIdx === 0 && (
          <path
            d="M45 75C50 83 70 83 75 75"
            stroke="#0B0F19"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        )}
        {mouthIdx === 1 && (
          /* Confident Smirk */
          <path
            d="M47 78C56 78 68 74 75 69"
            stroke="#0B0F19"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        )}
        {mouthIdx === 2 && (
          /* Cat Mouth :3 */
          <path
            d="M44 75C48 81 56 81 60 75C64 81 72 81 76 75"
            stroke="#0B0F19"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {mouthIdx === 3 && (
          /* Big Laugh */
          <g>
            <path
              d="M43 73H77C77 84 69 90 60 90C51 90 43 84 43 73Z"
              fill="#0B0F19"
              stroke="#0B0F19"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M51 84C54 81 66 81 69 84"
              stroke="#FF5577"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        )}
        {mouthIdx === 4 && (
          /* Tongue Out */
          <g>
            <path
              d="M45 75C52 80 68 80 75 75"
              stroke="#0B0F19"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M55 78V85C55 88 65 88 65 85V78"
              fill="#FF5577"
              stroke="#0B0F19"
              strokeWidth="3.5"
            />
          </g>
        )}
        {mouthIdx === 5 && (
          /* Grit Teeth */
          <g>
            <rect
              x="43"
              y="73"
              width="34"
              height="11"
              rx="5.5"
              fill="white"
              stroke="#0B0F19"
              strokeWidth="3.5"
            />
            <path d="M54 73V84M66 73V84" stroke="#0B0F19" strokeWidth="3" />
          </g>
        )}
        {mouthIdx === 6 && (
          /* Dapper Mustache */
          <path
            d="M60 74C53 70 42 72 37 78C45 80 54 79 60 76C66 79 75 80 83 78C78 72 67 70 60 74Z"
            fill="#0B0F19"
          />
        )}
        {mouthIdx === 7 && (
          /* Whistle O */
          <circle
            cx="62"
            cy="78"
            r="6"
            fill="#0B0F19"
            stroke="#0B0F19"
            strokeWidth="2"
          />
        )}

        {/* HAT / ACCESSORY LAYER (8 Skribbl Toppers) */}
        {hatIdx === 1 && (
          /* Royal Crown */
          <path
            d="M34 31L39 12L51 22L60 9L69 22L81 12L86 31H34Z"
            fill="#FFB800"
            stroke="#0B0F19"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        )}
        {hatIdx === 2 && (
          /* Artist Beret */
          <g>
            <path
              d="M32 30C30 18 52 12 75 16C88 18 92 27 84 32H32Z"
              fill="#FF553E"
              stroke="#0B0F19"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M60 15L63 8" stroke="#0B0F19" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
        {hatIdx === 3 && (
          /* Devil Horns */
          <g fill="#FF3B30" stroke="#0B0F19" strokeWidth="4" strokeLinejoin="round">
            <path d="M35 30C27 20 28 10 38 12C39 20 43 24 46 27Z" />
            <path d="M85 30C93 20 92 10 82 12C81 20 77 24 74 27Z" />
          </g>
        )}
        {hatIdx === 4 && (
          /* Angel Halo */
          <ellipse
            cx="60"
            cy="13"
            rx="22"
            ry="5.5"
            stroke="#FFD059"
            strokeWidth="5"
            fill="none"
          />
        )}
        {hatIdx === 5 && (
          /* Pro Headset */
          <g>
            <path
              d="M23 60C23 32 38 19 60 19C82 19 97 32 97 60"
              stroke="#0B0F19"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <rect
              x="16"
              y="50"
              width="11"
              height="22"
              rx="5"
              fill="#00E5FF"
              stroke="#0B0F19"
              strokeWidth="3.5"
            />
            <rect
              x="93"
              y="50"
              width="11"
              height="22"
              rx="5"
              fill="#00E5FF"
              stroke="#0B0F19"
              strokeWidth="3.5"
            />
          </g>
        )}
        {hatIdx === 6 && (
          /* Wizard Cone */
          <g>
            <path
              d="M26 31L60 4L94 31H26Z"
              fill="#A855F7"
              stroke="#0B0F19"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M22 31H98"
              stroke="#0B0F19"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        )}
        {hatIdx === 7 && (
          /* Viking Horns */
          <g stroke="#0B0F19" strokeWidth="4" strokeLinejoin="round">
            <path d="M35 28C20 24 16 12 24 8C26 17 33 20 40 22Z" fill="#F8FAFC" />
            <path d="M85 28C100 24 104 12 96 8C94 17 87 20 80 22Z" fill="#F8FAFC" />
            <path d="M36 30C42 20 78 20 84 30H36Z" fill="#64748B" />
          </g>
        )}
      </svg>
    </div>
  );
}

