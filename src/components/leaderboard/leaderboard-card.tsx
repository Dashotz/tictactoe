"use client";

import React from "react";
import { Trophy, Crown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkribblAvatar } from "@/components/skribbl-avatar";
import { MarkIcon } from "@/components/mark-icon";
import { LeaderboardEntry, PlayerProfile } from "@/types/game";
import { cn } from "@/lib/utils";

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
  lastSyncedAt: string;
  highlightedUser: string | null;
  p1: PlayerProfile;
  p2: PlayerProfile;
}

export function LeaderboardCard({
  leaderboard,
  lastSyncedAt,
  highlightedUser,
  p1,
  p2,
}: LeaderboardCardProps) {
  return (
    <Card className="border-white/[0.08] overflow-hidden">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#FFB800]" />
          <CardTitle className="text-base">Top 10 Leaderboard</CardTitle>
        </div>
        <CardDescription className="text-[11px]">
          Top 10 players ranked by wins
        </CardDescription>
      </CardHeader>

      <CardContent className="p-2.5 sm:p-3">
        <div className="space-y-1.5">
          {leaderboard.slice(0, 10).map((entry, idx) => {
            const rank = idx + 1;
            const isCurrentP1 =
              entry.username.toLowerCase() ===
              p1.username.trim().toLowerCase();
            const isCurrentP2 =
              entry.username.toLowerCase() ===
              p2.username.trim().toLowerCase();
            const isRecentlyUpdated =
              highlightedUser === entry.username.toLowerCase();

            return (
              <div
                key={entry.username}
                className={cn(
                  "flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl border transition-all",
                  isRecentlyUpdated
                    ? "bg-[#00E5FF]/12 border-[#00E5FF]/50 shadow-[0_0_16px_-4px_rgba(0,229,255,0.4)]"
                    : isCurrentP1 || isCurrentP2
                    ? "bg-white/[0.05] border-white/15"
                    : "bg-[#0B0F19]/60 border-white/[0.04] hover:border-white/10"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Rank Badge */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 tabular-nums",
                      rank === 1
                        ? "bg-[#FFB800]/20 text-[#FFD059] border border-[#FFB800]/40"
                        : rank === 2
                        ? "bg-[#E2E8F0]/15 text-[#F1F5F9] border border-white/25"
                        : rank === 3
                        ? "bg-[#FF8A00]/20 text-[#FFAE42] border border-[#FF8A00]/35"
                        : "bg-white/[0.04] text-[#64748B]"
                    )}
                  >
                    {rank === 1 ? (
                      <Crown className="w-3.5 h-3.5 text-[#FFD059]" />
                    ) : (
                      rank
                    )}
                  </div>

                  {/* Player Avatar */}
                  <SkribblAvatar
                    config={entry.avatar}
                    size="sm"
                    className="w-7 h-7 sm:w-8 sm:h-8"
                  />

                  {/* Username & Mark */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#F1F5F9] truncate">
                        {entry.username}
                      </span>
                      {(isCurrentP1 || isCurrentP2) && (
                        <span className="text-[9px] font-mono uppercase px-1 py-0.2 bg-[#00E5FF]/15 text-[#00E5FF] rounded shrink-0">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                      <span>Mark:</span>
                      <MarkIcon
                        markId={entry.markId}
                        avatar={entry.avatar}
                        size="sm"
                        className="w-3.5 h-3.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Wins / Draws / Losses Telemetry */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 font-mono tabular-nums">
                  <div className="px-1.5 py-1 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-center min-w-[32px]">
                    <span className="text-xs font-extrabold text-[#00E5FF] block leading-none">
                      {entry.wins}
                    </span>
                    <span className="text-[8px] uppercase text-[#00E5FF]/80">
                      W
                    </span>
                  </div>
                  <div className="px-1.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-center min-w-[28px]">
                    <span className="text-xs font-bold text-[#CBD5E1] block leading-none">
                      {entry.draws ?? 0}
                    </span>
                    <span className="text-[8px] uppercase text-[#64748B]">
                      D
                    </span>
                  </div>
                  <div className="px-1.5 py-1 rounded-lg bg-[#FF553E]/10 border border-[#FF553E]/20 text-center min-w-[28px]">
                    <span className="text-xs font-bold text-[#FF715E] block leading-none">
                      {entry.losses ?? 0}
                    </span>
                    <span className="text-[8px] uppercase text-[#FF715E]/80">
                      L
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
