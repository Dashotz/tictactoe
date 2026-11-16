"use client";

import React from "react";
import Image from "next/image";
import { Users, Bot, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudioHeaderProps {
  vsBot: boolean;
  soundEnabled: boolean;
  onSelectMode: (vsBot: boolean) => void;
  onToggleSound: () => void;
}

export function StudioHeader({
  vsBot,
  soundEnabled,
  onSelectMode,
  onToggleSound,
}: StudioHeaderProps) {
  return (
    <header className="border-b border-white/[0.08] bg-[#0B0F19]/85 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-[1400px] mx-auto px-2.5 sm:px-6 h-13 sm:h-16 py-2 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Standalone Tic-Tac-Toe Logo Image + Full Title (fits down to 320px) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Image
            src="/logo.svg"
            alt="Tic-Tac-Toe Logo"
            width={40}
            height={40}
            priority
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl shrink-0 shadow-[0_0_20px_-4px_rgba(0,229,255,0.35)]"
          />
          <h1 className="font-sans sm:font-display text-[13px] sm:text-xl font-extrabold tracking-tight sm:tracking-[-0.03em] text-white whitespace-nowrap">
            TIC-TAC-TOE
          </h1>
        </div>

        {/* Mode Switcher & Audio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div
            role="group"
            aria-label="Game Mode Switcher"
            className="inline-flex rounded-xl bg-[#121726] p-0.5 sm:p-1 border border-white/[0.08]"
          >
            <button
              type="button"
              onClick={() => onSelectMode(false)}
              className={cn(
                "btn-tactile flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap",
                !vsBot
                  ? "bg-[#00E5FF] text-[#0B0F19] shadow-sm font-bold"
                  : "text-[#94A3B8] hover:text-white"
              )}
            >
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>2P</span>
              <span className="hidden sm:inline">Versus</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectMode(true)}
              className={cn(
                "btn-tactile flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap",
                vsBot
                  ? "bg-[#FF553E] text-white shadow-sm font-bold"
                  : "text-[#94A3B8] hover:text-white"
              )}
            >
              <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="sm:hidden">Bot</span>
              <span className="hidden sm:inline">vs Bot</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onToggleSound}
            aria-label={
              soundEnabled ? "Mute sound effects" : "Unmute sound effects"
            }
            title={soundEnabled ? "Sound FX On" : "Sound FX Muted"}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E5FF]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#64748B]" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
