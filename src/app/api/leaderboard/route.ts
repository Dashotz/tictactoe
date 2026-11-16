import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { INITIAL_LEADERBOARD } from "@/constants/game-constants";
import {
  MatchResultType,
  mergeLeaderboards,
  sortLeaderboardPool,
  upsertLeaderboardEntry,
} from "@/lib/leaderboard-service";
import { AvatarConfig, LeaderboardEntry, MarkId } from "@/types/game";

// Disable Vercel static/edge caching so GET always returns live state
export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, "leaderboard.json");
const TMP_DATA_FILE = path.join(os.tmpdir(), "tictactoe-leaderboard.json");

declare global {
  // eslint-disable-next-line no-var
  var __tictactoeLeaderboard: LeaderboardEntry[] | undefined;
}

function getMemoryStore(): LeaderboardEntry[] {
  if (!globalThis.__tictactoeLeaderboard) {
    globalThis.__tictactoeLeaderboard = sortLeaderboardPool([
      ...INITIAL_LEADERBOARD,
    ]);
  }
  return globalThis.__tictactoeLeaderboard;
}

function setMemoryStore(entries: LeaderboardEntry[]) {
  globalThis.__tictactoeLeaderboard = sortLeaderboardPool(entries);
}

async function readLeaderboard(): Promise<LeaderboardEntry[]> {
  let current = getMemoryStore();

  // 1. Check writable /tmp store first (works on Vercel serverless)
  try {
    const tmpRaw = await fs.readFile(TMP_DATA_FILE, "utf-8");
    const tmpParsed = JSON.parse(tmpRaw);
    if (Array.isArray(tmpParsed) && tmpParsed.length > 0) {
      current = mergeLeaderboards(tmpParsed, current);
    }
  } catch {
    // No /tmp file yet
  }

  // 2. Check project data/leaderboard.json (works in local dev)
  try {
    const localRaw = await fs.readFile(LOCAL_DATA_FILE, "utf-8");
    const localParsed = JSON.parse(localRaw);
    if (Array.isArray(localParsed) && localParsed.length > 0) {
      current = mergeLeaderboards(localParsed, current);
    }
  } catch {
    // Ignore if missing
  }

  setMemoryStore(current);
  return getMemoryStore();
}

async function writeLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
  const pool = sortLeaderboardPool(entries);
  setMemoryStore(pool);
  const serialized = JSON.stringify(pool, null, 2);

  // Always write to os.tmpdir() (writable on Vercel)
  try {
    await fs.writeFile(TMP_DATA_FILE, serialized, "utf-8");
  } catch {
    // Ignore
  }

  // Also write to local data/leaderboard.json when running locally
  try {
    await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
    await fs.writeFile(LOCAL_DATA_FILE, serialized, "utf-8");
  } catch {
    // Expected on Vercel's read-only /var/task directory
  }
}

export async function GET() {
  const entries = await readLeaderboard();
  return NextResponse.json(
    {
      leaderboard: entries,
      updatedAt: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      markId?: MarkId;
      avatar?: AvatarConfig;
      result?: MatchResultType;
      didWin?: boolean;
      players?: Array<{
        username: string;
        markId: MarkId;
        avatar: AvatarConfig;
        result: MatchResultType;
        minWins?: number;
        minLosses?: number;
        minDraws?: number;
      }>;
      snapshot?: LeaderboardEntry[];
    };

    let updated = await readLeaderboard();

    // Merge client's snapshot first so a cold-started serverless instance never loses existing wins
    if (Array.isArray(body.snapshot) && body.snapshot.length > 0) {
      updated = mergeLeaderboards(body.snapshot, updated);
    }

    if (Array.isArray(body.players) && body.players.length > 0) {
      for (const p of body.players) {
        if (p.username && p.username.trim()) {
          updated = upsertLeaderboardEntry(updated, {
            username: p.username,
            markId: p.markId || "classic-x",
            avatar: p.avatar || {
              colorIndex: 0,
              eyesIndex: 0,
              mouthIndex: 0,
              hatIndex: 0,
            },
            result: p.result,
            minWins: p.minWins,
            minLosses: p.minLosses,
            minDraws: p.minDraws,
          });
        }
      }
    } else if (body.username && body.username.trim()) {
      updated = upsertLeaderboardEntry(updated, {
        username: body.username,
        markId: body.markId || "classic-x",
        avatar: body.avatar || {
          colorIndex: 0,
          eyesIndex: 0,
          mouthIndex: 0,
          hatIndex: 0,
        },
        result: body.result ?? (body.didWin ? "win" : "loss"),
      });
    } else if (!Array.isArray(body.snapshot)) {
      return NextResponse.json(
        { error: "Player payload or snapshot is required" },
        { status: 400 }
      );
    }

    await writeLeaderboard(updated);

    return NextResponse.json(
      {
        leaderboard: updated,
        updatedAt: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
