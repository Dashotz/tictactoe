import { AvatarConfig, LeaderboardEntry, MarkId } from "@/types/game";

export type MatchResultType = "win" | "loss" | "draw";

/**
 * Upserts a player's match result (win, loss, or draw) into the leaderboard
 * and strictly caps at Top 10 sorted by wins desc.
 */
export function upsertLeaderboardEntry(
  entries: LeaderboardEntry[],
  payload: {
    username: string;
    markId: MarkId;
    avatar: AvatarConfig;
    result?: MatchResultType;
    didWin?: boolean;
  }
): LeaderboardEntry[] {
  const cleanName = payload.username.trim().slice(0, 20) || "AnonDoodler";
  const normalizedKey = cleanName.toLowerCase();
  const now = Date.now();
  const outcome: MatchResultType =
    payload.result ?? (payload.didWin ? "win" : "loss");

  const list = entries.map((e) => ({
    ...e,
    losses: e.losses ?? 0,
    draws: e.draws ?? 0,
  }));

  const existingIdx = list.findIndex(
    (item) => item.username.toLowerCase() === normalizedKey
  );

  if (existingIdx >= 0) {
    const current = list[existingIdx];
    list[existingIdx] = {
      ...current,
      username: cleanName,
      wins: current.wins + (outcome === "win" ? 1 : 0),
      losses: (current.losses ?? 0) + (outcome === "loss" ? 1 : 0),
      draws: (current.draws ?? 0) + (outcome === "draw" ? 1 : 0),
      gamesPlayed: current.gamesPlayed + 1,
      markId: payload.markId,
      avatar: payload.avatar,
      updatedAt: now,
    };
  } else {
    list.push({
      username: cleanName,
      wins: outcome === "win" ? 1 : 0,
      losses: outcome === "loss" ? 1 : 0,
      draws: outcome === "draw" ? 1 : 0,
      gamesPlayed: 1,
      markId: payload.markId,
      avatar: payload.avatar,
      updatedAt: now,
    });
  }

  return list
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if ((b.draws ?? 0) !== (a.draws ?? 0)) return (b.draws ?? 0) - (a.draws ?? 0);
      if ((a.losses ?? 0) !== (b.losses ?? 0)) return (a.losses ?? 0) - (b.losses ?? 0);
      return b.updatedAt - a.updatedAt;
    })
    .slice(0, 10);
}
