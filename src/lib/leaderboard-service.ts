import { AvatarConfig, LeaderboardEntry, MarkId } from "@/types/game";

export type MatchResultType = "win" | "loss" | "draw";

const MAX_STORED_PLAYERS = 100;

/**
 * Sorts leaderboard entries by wins desc, draws desc, losses asc, updatedAt desc.
 * Stores up to 100 players in the pool so players at 1 win are NOT deleted before they reach Top 10!
 * (The UI slices the Top 10 for display.)
 */
export function sortLeaderboardPool(
  entries: LeaderboardEntry[],
  limit = MAX_STORED_PLAYERS
): LeaderboardEntry[] {
  return entries
    .filter(
      (e) => e?.username && e.username.trim().toLowerCase() !== "skribblbot"
    )
    .map((e) => ({
      ...e,
      losses: e.losses ?? 0,
      draws: e.draws ?? 0,
      gamesPlayed:
        e.gamesPlayed ?? (e.wins ?? 0) + (e.losses ?? 0) + (e.draws ?? 0),
    }))
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if ((b.draws ?? 0) !== (a.draws ?? 0))
        return (b.draws ?? 0) - (a.draws ?? 0);
      if ((a.losses ?? 0) !== (b.losses ?? 0))
        return (a.losses ?? 0) - (b.losses ?? 0);
      return b.updatedAt - a.updatedAt;
    })
    .slice(0, limit);
}

/**
 * Merges two leaderboard lists without losing progress when a serverless instance cold-starts.
 */
export function mergeLeaderboards(
  primary: LeaderboardEntry[],
  secondary: LeaderboardEntry[]
): LeaderboardEntry[] {
  const map = new Map<string, LeaderboardEntry>();

  for (const item of [...secondary, ...primary]) {
    if (!item?.username) continue;
    const clean = item.username.trim();
    const key = clean.toLowerCase();
    if (!key || key === "skribblbot") continue;

    const normalized: LeaderboardEntry = {
      ...item,
      username: clean,
      wins: item.wins ?? 0,
      losses: item.losses ?? 0,
      draws: item.draws ?? 0,
      gamesPlayed:
        item.gamesPlayed ??
        (item.wins ?? 0) + (item.losses ?? 0) + (item.draws ?? 0),
      updatedAt: item.updatedAt ?? 0,
    };

    const existing = map.get(key);
    if (!existing) {
      map.set(key, normalized);
    } else {
      const existingTotal =
        existing.wins + (existing.losses ?? 0) + (existing.draws ?? 0);
      const incomingTotal =
        normalized.wins + (normalized.losses ?? 0) + (normalized.draws ?? 0);

      if (
        normalized.wins > existing.wins ||
        (normalized.wins === existing.wins && incomingTotal > existingTotal) ||
        (normalized.wins === existing.wins &&
          incomingTotal === existingTotal &&
          normalized.updatedAt > existing.updatedAt)
      ) {
        map.set(key, normalized);
      }
    }
  }

  return sortLeaderboardPool(Array.from(map.values()));
}

/**
 * Upserts a player's match result (win, loss, or draw) into the leaderboard pool.
 * Keeps up to 100 players in the pool so new players accumulate 1 -> 2 -> 3+ wins instead of being dropped at 1 win!
 */
export function upsertLeaderboardEntry(
  entries: LeaderboardEntry[],
  payload: {
    username: string;
    markId: MarkId;
    avatar: AvatarConfig;
    result?: MatchResultType;
    didWin?: boolean;
    minWins?: number;
    minLosses?: number;
    minDraws?: number;
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
    const nextWins = Math.max(
      current.wins + (outcome === "win" ? 1 : 0),
      payload.minWins ?? 0
    );
    const nextLosses = Math.max(
      (current.losses ?? 0) + (outcome === "loss" ? 1 : 0),
      payload.minLosses ?? 0
    );
    const nextDraws = Math.max(
      (current.draws ?? 0) + (outcome === "draw" ? 1 : 0),
      payload.minDraws ?? 0
    );

    list[existingIdx] = {
      ...current,
      username: cleanName,
      wins: nextWins,
      losses: nextLosses,
      draws: nextDraws,
      gamesPlayed: nextWins + nextLosses + nextDraws,
      markId: payload.markId,
      avatar: payload.avatar,
      updatedAt: now,
    };
  } else {
    const nextWins = Math.max(outcome === "win" ? 1 : 0, payload.minWins ?? 0);
    const nextLosses = Math.max(
      outcome === "loss" ? 1 : 0,
      payload.minLosses ?? 0
    );
    const nextDraws = Math.max(
      outcome === "draw" ? 1 : 0,
      payload.minDraws ?? 0
    );

    list.push({
      username: cleanName,
      wins: nextWins,
      losses: nextLosses,
      draws: nextDraws,
      gamesPlayed: nextWins + nextLosses + nextDraws,
      markId: payload.markId,
      avatar: payload.avatar,
      updatedAt: now,
    });
  }

  return sortLeaderboardPool(list);
}
