"use client";

import React from "react";
import { Flame, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SkribblAvatar } from "@/components/skribbl-avatar";
import { MarkIcon } from "@/components/mark-icon";
import {
  GameScores,
  GameStreaks,
  PlayerId,
  PlayerProfile,
  WinResult,
} from "@/types/game";
import { cn } from "@/lib/utils";

interface ScoreboardBannerProps {
  p1: PlayerProfile;
  p2: PlayerProfile;
  turn: PlayerId;
  vsBot: boolean;
  winState: WinResult;
  scores: GameScores;
  streaks: GameStreaks;
  onSelectPlayerStudio: (playerId: PlayerId) => void;
}

export function ScoreboardBanner({
  p1,
  p2,
  turn,
  vsBot,
  winState,
  scores,
  streaks,
  onSelectPlayerStudio,
}: ScoreboardBannerProps) {
  const activeProfile = turn === "p1" ? p1 : p2;
  const p1Losses = scores.p2;
  const p2Losses = scores.p1;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* LIVE VERSUS SCOREBOARD WITH WINS, DRAWS & LOSSES */}
      <div className="grid grid-cols-11 gap-1.5 sm:gap-2.5 items-stretch">
        {/* Player 1 Score Card */}
        <button
          type="button"
          onClick={() => onSelectPlayerStudio("p1")}
          className={cn(
            "col-span-4 card-tactile p-2.5 sm:p-3.5 text-left transition-all border group flex flex-col justify-between",
            turn === "p1" && !winState.winner
              ? "border-[#00E5FF]/60 shadow-[0_0_24px_-6px_rgba(0,229,255,0.35)]"
              : "border-white/[0.07]",
            winState.winner === "p1" &&
            "border-[#FFB800] shadow-[0_0_28px_-4px_rgba(255,184,0,0.45)]"
          )}
        >
          <div className="flex items-center justify-between gap-1.5">
            <SkribblAvatar
              config={p1.avatar}
              size="sm"
              className="sm:w-11 sm:h-11"
              mood={
                winState.winner === "p1"
                  ? "win"
                  : turn === "p1"
                    ? "active"
                    : "idle"
              }
            />
            <div className="text-right">
              <span className="font-mono text-xl sm:text-2xl font-extrabold tabular-nums text-[#00E5FF] block leading-none">
                {scores.p1}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                WINS
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-1">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#F1F5F9] truncate flex items-center gap-1">
                <span className="truncate">{p1.username || "Player 1"}</span>
                <Pencil className="w-2.5 h-2.5 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </p>
              {streaks.p1 >= 2 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#FFB800]">
                  <Flame className="w-3 h-3 fill-[#FFB800]" />
                  {streaks.p1}
                </span>
              )}
            </div>
            <MarkIcon markId={p1.markId} avatar={p1.avatar} size="sm" />
          </div>

          {/* W / D / L Breakdown Row */}
          <div className="mt-2 pt-1.5 border-t border-white/[0.06] grid grid-cols-3 gap-1 text-center font-mono text-[9px] sm:text-[10px] tabular-nums">
            <div className="rounded bg-[#00E5FF]/10 text-[#00E5FF] py-0.5">
              <span className="font-bold">{scores.p1}</span>W
            </div>
            <div className="rounded bg-white/[0.05] text-[#CBD5E1] py-0.5">
              <span className="font-bold">{scores.draws}</span>D
            </div>
            <div className="rounded bg-[#FF553E]/10 text-[#FF715E] py-0.5">
              <span className="font-bold">{p1Losses}</span>L
            </div>
          </div>
        </button>

        {/* Center Draws & Total Rounds Card */}
        <div className="col-span-3 card-tactile p-2 sm:p-3 flex flex-col items-center justify-between text-center border border-white/[0.07]">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.08em] text-[#94A3B8]">
            DRAWS
          </span>
          <span className="font-mono text-xl sm:text-2xl font-extrabold tabular-nums text-[#F1F5F9] my-0.5">
            {scores.draws}
          </span>
          <div className="w-full pt-1.5 border-t border-white/[0.06] flex flex-col gap-0.5 text-[9px] sm:text-[10px] font-mono text-[#64748B] tabular-nums">
            <span>P1 L: {p1Losses}</span>
            <span>P2 L: {p2Losses}</span>
          </div>
        </div>

        {/* Player 2 Score Card */}
        <button
          type="button"
          onClick={() => onSelectPlayerStudio("p2")}
          className={cn(
            "col-span-4 card-tactile p-2.5 sm:p-3.5 text-left transition-all border group flex flex-col justify-between",
            turn === "p2" && !winState.winner
              ? "border-[#FF553E]/60 shadow-[0_0_24px_-6px_rgba(255,85,62,0.35)]"
              : "border-white/[0.07]",
            winState.winner === "p2" &&
            "border-[#FFB800] shadow-[0_0_28px_-4px_rgba(255,184,0,0.45)]"
          )}
        >
          <div className="flex items-center justify-between gap-1.5">
            <SkribblAvatar
              config={p2.avatar}
              size="sm"
              className="sm:w-11 sm:h-11"
              mood={
                winState.winner === "p2"
                  ? "win"
                  : turn === "p2"
                    ? "active"
                    : "idle"
              }
            />
            <div className="text-right">
              <span className="font-mono text-xl sm:text-2xl font-extrabold tabular-nums text-[#FF553E] block leading-none">
                {scores.p2}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                WINS
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-1">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#F1F5F9] truncate flex items-center gap-1">
                <span className="truncate">{p2.username || "Player 2"}</span>
                <Pencil className="w-2.5 h-2.5 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </p>
              {streaks.p2 >= 2 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#FFB800]">
                  <Flame className="w-3 h-3 fill-[#FFB800]" />
                  {streaks.p2}
                </span>
              )}
            </div>
            <MarkIcon markId={p2.markId} avatar={p2.avatar} size="sm" />
          </div>

          {/* W / D / L Breakdown Row */}
          <div className="mt-2 pt-1.5 border-t border-white/[0.06] grid grid-cols-3 gap-1 text-center font-mono text-[9px] sm:text-[10px] tabular-nums">
            <div className="rounded bg-[#00E5FF]/10 text-[#00E5FF] py-0.5">
              <span className="font-bold">{scores.p2}</span>W
            </div>
            <div className="rounded bg-white/[0.05] text-[#CBD5E1] py-0.5">
              <span className="font-bold">{scores.draws}</span>D
            </div>
            <div className="rounded bg-[#FF553E]/10 text-[#FF715E] py-0.5">
              <span className="font-bold">{p2Losses}</span>L
            </div>
          </div>
        </button>
      </div>

      {/* TURN / WINNER ANNOUNCEMENT BANNER */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "card-tactile px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 border transition-all",
          winState.winner === "p1" || winState.winner === "p2"
            ? "border-[#FFB800]/50 bg-[#FFB800]/10"
            : winState.winner === "draw"
              ? "border-white/20 bg-white/[0.04]"
              : "border-white/[0.08]"
        )}
      >
        {winState.winner === "p1" || winState.winner === "p2" ? (
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <SkribblAvatar
              config={winState.winner === "p1" ? p1.avatar : p2.avatar}
              size="sm"
              mood="win"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="gold">WINNER</Badge>
                <span className="font-display text-sm sm:text-base font-extrabold text-white truncate">
                  {(winState.winner === "p1" ? p1.username : p2.username) ||
                    "Player"}{" "}
                  Wins!
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#CBD5E1] truncate">
                +1 Win &amp; +1 Loss synced to the Live Top 10 Leaderboard
              </p>
            </div>
          </div>
        ) : winState.winner === "draw" ? (
          <div className="flex items-center justify-between w-full gap-2">
            <div>
              <span className="font-display text-sm sm:text-base font-extrabold text-white block">
                It&apos;s a Draw! Deadlock on the Grid
              </span>
              <p className="text-[11px] sm:text-xs text-[#94A3B8]">
                +1 Draw recorded for both players. Start a New Game!
              </p>
            </div>
            <Badge variant="secondary">DRAW</Badge>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <SkribblAvatar
                config={activeProfile.avatar}
                size="sm"
                mood="active"
              />
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block">
                  {vsBot && turn === "p2" ? "BOT THINKING..." : "CURRENT TURN"}
                </span>
                <span className="font-display text-sm sm:text-base font-bold text-white truncate block">
                  {activeProfile.username ||
                    (turn === "p1" ? "Player 1" : "Player 2")}
                  &apos;s Turn
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0B0F19]/80 border border-white/10 shrink-0">
              <MarkIcon
                markId={activeProfile.markId}
                avatar={activeProfile.avatar}
                size="sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
