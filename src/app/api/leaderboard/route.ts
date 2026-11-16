import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { INITIAL_LEADERBOARD } from "@/constants/game-constants";
import {
  MatchResultType,
  upsertLeaderboardEntry,
} from "@/lib/leaderboard-service";
import { AvatarConfig, LeaderboardEntry, MarkId } from "@/types/game";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leaderboard.json");

let memoryLeaderboard: LeaderboardEntry[] = [...INITIAL_LEADERBOARD];

function normalizeEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return entries
    .map((e) => ({
      ...e,
      losses: e.losses ?? 0,
      draws: e.draws ?? 0,
    }))
    .sort((a, b) => b.wins - a.wins || b.updatedAt - a.updatedAt)
    .slice(0, 10);
}

async function readLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryLeaderboard = normalizeEntries(parsed);
      return memoryLeaderboard;
    }
  } catch {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(
        DATA_FILE,
        JSON.stringify(memoryLeaderboard, null, 2),
        "utf-8"
      );
    } catch {
      // Read-only filesystem fallback
    }
  }
  return normalizeEntries(memoryLeaderboard);
}

async function writeLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
  const top10 = normalizeEntries(entries);
  memoryLeaderboard = top10;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(top10, null, 2), "utf-8");
  } catch {
    // Ignore on read-only serverless
  }
}

export async function GET() {
  const entries = await readLeaderboard();
  return NextResponse.json({
    leaderboard: entries.slice(0, 10),
    updatedAt: Date.now(),
  });
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
      }>;
    };

    let updated = await readLeaderboard();

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
    } else {
      return NextResponse.json(
        { error: "Player payload is required" },
        { status: 400 }
      );
    }

    await writeLeaderboard(updated);

    return NextResponse.json({
      leaderboard: updated,
      updatedAt: Date.now(),
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
