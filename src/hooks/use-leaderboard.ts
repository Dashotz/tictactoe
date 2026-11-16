"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  BROADCAST_CHANNEL_NAME,
  INITIAL_LEADERBOARD,
  LOCAL_STORAGE_LEADERBOARD_KEY,
} from "@/constants/game-constants";
import {
  MatchResultType,
  upsertLeaderboardEntry,
} from "@/lib/leaderboard-service";
import { LeaderboardEntry, PlayerProfile } from "@/types/game";

interface UseLeaderboardOptions {
  onToast?: (title: string, subtitle: string) => void;
}

export function useLeaderboard({ onToast }: UseLeaderboardOptions = {}) {
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("Live");
  const [highlightedUser, setHighlightedUser] = useState<string | null>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.leaderboard)) {
          const top10 = data.leaderboard.slice(0, 10);
          setLeaderboard(top10);
          localStorage.setItem(
            LOCAL_STORAGE_LEADERBOARD_KEY,
            JSON.stringify(top10)
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
      // Offline fallback to localStorage
    }

    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_KEY);
      if (cached) {
        setLeaderboard(JSON.parse(cached).slice(0, 10));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const ch = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      ch.onmessage = (event) => {
        if (event.data?.leaderboard) {
          setLeaderboard(event.data.leaderboard.slice(0, 10));
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
      }>
    ) => {
      const playersPayload = outcomes.map(({ profile, result }) => ({
        username: profile.username.trim() || "AnonDoodler",
        markId: profile.markId,
        avatar: profile.avatar,
        result,
      }));

      // Frame-0 optimistic update
      setLeaderboard((prev) => {
        let next = [...prev];
        for (const p of playersPayload) {
          next = upsertLeaderboardEntry(next, p);
        }
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
            onToast(
              `${winEntry.username} recorded a Victory!`,
              `Ranked #${rank} • ${item.wins}W / ${item.draws ?? 0}D / ${
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
          body: JSON.stringify({ players: playersPayload }),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.leaderboard)) {
            const top10 = data.leaderboard.slice(0, 10);
            setLeaderboard(top10);
            broadcastRef.current?.postMessage({ leaderboard: top10 });
          }
        }
      } catch {
        // Optimistic update already applied
      }
    },
    [onToast]
  );

  const recordWin = useCallback(
    async (winnerProfile: PlayerProfile, loserProfile?: PlayerProfile) => {
      const outcomes: Array<{
        profile: PlayerProfile;
        result: MatchResultType;
      }> = [{ profile: winnerProfile, result: "win" }];
      if (loserProfile) {
        outcomes.push({ profile: loserProfile, result: "loss" });
      }
      await syncMatchOutcomes(outcomes);
    },
    [syncMatchOutcomes]
  );

  const recordDraw = useCallback(
    async (p1Profile: PlayerProfile, p2Profile: PlayerProfile) => {
      await syncMatchOutcomes([
        { profile: p1Profile, result: "draw" },
        { profile: p2Profile, result: "draw" },
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
