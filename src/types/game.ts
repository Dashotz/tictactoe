export interface AvatarConfig {
  colorIndex: number;
  eyesIndex: number;
  mouthIndex: number;
  hatIndex: number;
}

export type MarkId =
  | "classic-x"
  | "classic-o"
  | "bolt"
  | "flame"
  | "crown"
  | "swords"
  | "star"
  | "ghost"
  | "rocket"
  | "avatar-stamp";

export interface MarkDefinition {
  id: MarkId;
  label: string;
  shortLabel: string;
  color: string;
  glow: string;
}

export type PlayerId = "p1" | "p2";

export interface PlayerProfile {
  id: PlayerId;
  username: string;
  markId: MarkId;
  avatar: AvatarConfig;
}

export interface LeaderboardEntry {
  username: string;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  markId: MarkId;
  avatar: AvatarConfig;
  updatedAt: number;
}

export type CellValue = PlayerId | null;

export interface WinResult {
  winner: PlayerId | "draw" | null;
  line: [number, number, number] | null;
}

export interface GameScores {
  p1: number;
  p2: number;
  draws: number;
}

export interface GameStreaks {
  p1: number;
  p2: number;
}

export interface ToastNotification {
  id: number;
  title: string;
  subtitle: string;
}

export type MobileTab = "arena" | "studio" | "leaderboard";
