import { AvatarConfig, LeaderboardEntry, MarkId } from "@/types/game";

export type MatchResultType = "win" | "loss" | "draw";

/**
 * Sorts leaderboard entries by wins desc, draws desc, losses asc, updatedAt desc, capped at Top 10.
 */
export function sortAndCapTop10(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return entries
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
    .slice(0, 10);
}

/**
 * Merges two leaderboard lists without losing progress when a serverless instance cold-starts.
 * For each username, keeps the record with higher total games/wins or newer timestamp.
 */
export function mergeLeaderboards(
  primary: LeaderboardEntry[],
  secondary: LeaderboardEntry[]
): LeaderboardEntry[] {
  const map = new Map<string, LeaderboardEntry>();

  for (const item of [...secondary, ...primary]) {
    if (!item?.username) continue;
    const key = item.username.trim().toLowerCase();
    const normalized: LeaderboardEntry = {
      ...item,
      username: item.username.trim(),
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

  return sortAndCapTop10(Array.from(map.values()));
}

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

  return sortAndCapTop10(list);
}
