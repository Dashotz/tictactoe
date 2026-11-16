"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  BROADCAST_CHANNEL_NAME,
  INITIAL_LEADERBOARD,
  LOCAL_STORAGE_LEADERBOARD_KEY,
} from "@/constants/game-constants";
import {
  MatchResultType,
  mergeLeaderboards,
  upsertLeaderboardEntry,
} from "@/lib/leaderboard-service";
import { GameScores, LeaderboardEntry, PlayerProfile } from "@/types/game";

interface UseLeaderboardOptions {
  onToast?: (title: string, subtitle: string) => void;
}

function readLocalLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return INITIAL_LEADERBOARD;
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return mergeLeaderboards(parsed, INITIAL_LEADERBOARD);
      }
    }
  } catch {
    // Ignore storage errors
  }
  return INITIAL_LEADERBOARD;
}

export function useLeaderboard({ onToast }: UseLeaderboardOptions = {}) {
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("Live");
  const [highlightedUser, setHighlightedUser] = useState<string | null>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    const localEntries = readLocalLeaderboard();

    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.leaderboard)) {
          // Merge full player pool so players with 1-2 wins are never dropped before reaching Top 10
          const merged = mergeLeaderboards(localEntries, data.leaderboard);
          setLeaderboard(merged);
          localStorage.setItem(
            LOCAL_STORAGE_LEADERBOARD_KEY,
            JSON.stringify(merged)
          );
          setLastSyncedAt(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
          return;
        }
      }
    } catch {
      // Offline fallback to localEntries
    }

    setLeaderboard(localEntries);
  }, []);

  useEffect(() => {
    setLeaderboard(readLocalLeaderboard());
    fetchLeaderboard();

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const ch = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      ch.onmessage = (event) => {
        if (event.data?.leaderboard) {
          setLeaderboard((prev) => {
            const merged = mergeLeaderboards(event.data.leaderboard, prev);
            try {
              localStorage.setItem(
                LOCAL_STORAGE_LEADERBOARD_KEY,
                JSON.stringify(merged)
              );
            } catch {
              // Ignore
            }
            return merged;
          });
          setLastSyncedAt("Just now");
        }
      };
      broadcastRef.current = ch;
    }

    const interval = setInterval(fetchLeaderboard, 5000);
    return () => {
      clearInterval(interval);
      broadcastRef.current?.close();
    };
  }, [fetchLeaderboard]);

  const syncMatchOutcomes = useCallback(
    async (
      outcomes: Array<{
        profile: PlayerProfile;
        result: MatchResultType;
        minWins?: number;
        minLosses?: number;
        minDraws?: number;
      }>
    ) => {
      const playersPayload = outcomes.map(
        ({ profile, result, minWins, minLosses, minDraws }) => ({
          username: profile.username.trim() || "AnonDoodler",
          markId: profile.markId,
          avatar: profile.avatar,
          result,
          minWins,
          minLosses,
          minDraws,
        })
      );

      let optimisticSnapshot: LeaderboardEntry[] = [];

      // Frame-0 optimistic update on full pool (never slice(0, 10) on the pool!)
      setLeaderboard((prev) => {
        let next = mergeLeaderboards(prev, readLocalLeaderboard());
        for (const p of playersPayload) {
          next = upsertLeaderboardEntry(next, p);
        }
        optimisticSnapshot = next;
        try {
          localStorage.setItem(
            LOCAL_STORAGE_LEADERBOARD_KEY,
            JSON.stringify(next)
          );
          broadcastRef.current?.postMessage({ leaderboard: next });
        } catch {
          // Ignore storage error
        }

        const winEntry = playersPayload.find((p) => p.result === "win");
        if (winEntry && onToast) {
          const rank =
            next.findIndex(
              (e) =>
                e.username.toLowerCase() === winEntry.username.toLowerCase()
            ) + 1;
          if (rank > 0) {
            const item = next[rank - 1];
            const rankLabel =
              rank <= 10 ? `Ranked #${rank} in Top 10` : `Rank #${rank}`;
            onToast(
              `${winEntry.username} recorded a Victory!`,
              `${rankLabel} • ${item.wins}W / ${item.draws ?? 0}D / ${
                item.losses ?? 0
              }L`
            );
          }
        }
        return next;
      });

      const primaryUser =
        playersPayload.find((p) => p.result === "win")?.username ??
        playersPayload[0]?.username;
      if (primaryUser) {
        setHighlightedUser(primaryUser.toLowerCase());
      }
      setLastSyncedAt("Just now");

      try {
        const res = await fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            snapshot: optimisticSnapshot,
            players: playersPayload,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.leaderboard)) {
            const merged = mergeLeaderboards(
              optimisticSnapshot,
              data.leaderboard
            );
            setLeaderboard(merged);
            localStorage.setItem(
              LOCAL_STORAGE_LEADERBOARD_KEY,
              JSON.stringify(merged)
            );
            broadcastRef.current?.postMessage({ leaderboard: merged });
          }
        }
      } catch {
        // Optimistic update already applied in localStorage
      }
    },
    [onToast]
  );

  const recordWin = useCallback(
    async (
      winnerProfile: PlayerProfile,
      loserProfile: PlayerProfile,
      nextScores: GameScores
    ) => {
      const winnerIsP1 = winnerProfile.id === "p1";
      await syncMatchOutcomes([
        {
          profile: winnerProfile,
          result: "win",
          minWins: winnerIsP1 ? nextScores.p1 : nextScores.p2,
          minLosses: winnerIsP1 ? nextScores.p2 : nextScores.p1,
          minDraws: nextScores.draws,
        },
        {
          profile: loserProfile,
          result: "loss",
          minWins: winnerIsP1 ? nextScores.p2 : nextScores.p1,
          minLosses: winnerIsP1 ? nextScores.p1 : nextScores.p2,
          minDraws: nextScores.draws,
        },
      ]);
    },
    [syncMatchOutcomes]
  );

  const recordDraw = useCallback(
    async (
      p1Profile: PlayerProfile,
      p2Profile: PlayerProfile,
      nextScores: GameScores
    ) => {
      await syncMatchOutcomes([
        {
          profile: p1Profile,
          result: "draw",
          minWins: nextScores.p1,
          minLosses: nextScores.p2,
          minDraws: nextScores.draws,
        },
        {
          profile: p2Profile,
          result: "draw",
          minWins: nextScores.p2,
          minLosses: nextScores.p1,
          minDraws: nextScores.draws,
        },
      ]);
    },
    [syncMatchOutcomes]
  );

  return {
    leaderboard,
    lastSyncedAt,
    highlightedUser,
    recordWin,
    recordDraw,
    refreshLeaderboard: fetchLeaderboard,
  };
}
