import {
  LeaderboardEntry,
  MarkDefinition,
  PlayerProfile,
} from "@/types/game";

export const LOCAL_STORAGE_LEADERBOARD_KEY = "skribbl_tictactoe_leaderboard_v2";
export const LOCAL_STORAGE_PROFILES_KEY = "skribbl_tictactoe_profiles_v1";
export const BROADCAST_CHANNEL_NAME = "skribbl_tictactoe_live_lb";

export const AVATAR_COLORS = [
  { name: "Electric Cyan", fill: "#00E5FF", shade: "#0099B8", outline: "#062530" },
  { name: "Arcade Coral", fill: "#FF553E", shade: "#C82D19", outline: "#2B0C08" },
  { name: "Solar Gold", fill: "#FFB800", shade: "#CC8800", outline: "#2B1D00" },
  { name: "Acid Lime", fill: "#7CFC00", shade: "#47A800", outline: "#0F2600" },
  { name: "Hyper Violet", fill: "#A855F7", shade: "#7E22CE", outline: "#1F0933" },
  { name: "Bubblegum Pink", fill: "#FF4D94", shade: "#C91860", outline: "#2E0617" },
  { name: "Tangerine", fill: "#FF8A00", shade: "#C45B00", outline: "#2B1400" },
  { name: "Frost Titanium", fill: "#E2E8F0", shade: "#94A3B8", outline: "#0F172A" },
] as const;

export const AVATAR_EYES = [
  "Classic Doodle",
  "Deal With It Shades",
  "Starstruck",
  "Fierce Rival",
  "Cheeky Wink",
  "Cyber Visor",
  "Hypno Swirl",
  "Laser Focus",
] as const;

export const AVATAR_MOUTHS = [
  "Cheeky Grin",
  "Confident Smirk",
  "Cat Whiskers :3",
  "Big Laugh",
  "Tongue Out",
  "Grit Teeth",
  "Dapper Mustache",
  "Whistle O",
] as const;

export const AVATAR_HATS = [
  "None",
  "Royal Crown",
  "Artist Beret",
  "Devil Horns",
  "Angel Halo",
  "Pro Headset",
  "Wizard Cone",
  "Viking Horns",
] as const;

export const MARKS: MarkDefinition[] = [
  {
    id: "classic-x",
    label: "Laser X",
    shortLabel: "X",
    color: "#00E5FF",
    glow: "rgba(0, 229, 255, 0.45)",
  },
  {
    id: "classic-o",
    label: "Pulse O",
    shortLabel: "O",
    color: "#FF553E",
    glow: "rgba(255, 85, 62, 0.45)",
  },
  {
    id: "bolt",
    label: "Volt Strike",
    shortLabel: "⚡",
    color: "#FFB800",
    glow: "rgba(255, 184, 0, 0.45)",
  },
  {
    id: "flame",
    label: "Nova Flame",
    shortLabel: "🔥",
    color: "#FF6B2B",
    glow: "rgba(255, 107, 43, 0.45)",
  },
  {
    id: "crown",
    label: "Kingmaker",
    shortLabel: "👑",
    color: "#FFD059",
    glow: "rgba(255, 208, 89, 0.45)",
  },
  {
    id: "swords",
    label: "Duelist",
    shortLabel: "⚔️",
    color: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.45)",
  },
  {
    id: "star",
    label: "Supernova",
    shortLabel: "★",
    color: "#A855F7",
    glow: "rgba(168, 85, 247, 0.45)",
  },
  {
    id: "ghost",
    label: "Phantom",
    shortLabel: "👻",
    color: "#7CFC00",
    glow: "rgba(124, 252, 0, 0.45)",
  },
  {
    id: "rocket",
    label: "Overdrive",
    shortLabel: "🚀",
    color: "#FF4D94",
    glow: "rgba(255, 77, 148, 0.45)",
  },
  {
    id: "avatar-stamp",
    label: "My Doodle",
    shortLabel: "😊",
    color: "#00E5FF",
    glow: "rgba(0, 229, 255, 0.45)",
  },
];

export const RANDOM_SKRIBBL_NAMES = [
  "DoodleKing",
  "PixelBandit",
  "InkSlinger",
  "SketchyFox",
  "NeonMochi",
  "ChalkKnight",
  "TurboScribble",
  "WaffleWizard",
  "CrayonSamurai",
  "GlitchPanda",
  "HyperDoodle",
  "CaptainQuirk",
];

export const DEFAULT_P1: PlayerProfile = {
  id: "p1",
  username: "SketchyFox",
  markId: "classic-x",
  avatar: { colorIndex: 0, eyesIndex: 1, mouthIndex: 0, hatIndex: 1 },
};

export const DEFAULT_P2: PlayerProfile = {
  id: "p2",
  username: "PixelBandit",
  markId: "classic-o",
  avatar: { colorIndex: 1, eyesIndex: 3, mouthIndex: 2, hatIndex: 3 },
};

export const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const LINE_COORDS: Record<
  string,
  { x1: number; y1: number; x2: number; y2: number }
> = {
  "0,1,2": { x1: 10, y1: 16.6, x2: 90, y2: 16.6 },
  "3,4,5": { x1: 10, y1: 50, x2: 90, y2: 50 },
  "6,7,8": { x1: 10, y1: 83.3, x2: 90, y2: 83.3 },
  "0,3,6": { x1: 16.6, y1: 10, x2: 16.6, y2: 90 },
  "1,4,7": { x1: 50, y1: 10, x2: 50, y2: 90 },
  "2,5,8": { x1: 83.3, y1: 10, x2: 83.3, y2: 90 },
  "0,4,8": { x1: 12, y1: 12, x2: 88, y2: 88 },
  "2,4,6": { x1: 88, y1: 12, x2: 12, y2: 88 },
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    username: "DoodleKing",
    wins: 14,
    losses: 2,
    draws: 2,
    gamesPlayed: 18,
    markId: "crown",
    avatar: { colorIndex: 2, eyesIndex: 1, mouthIndex: 1, hatIndex: 1 },
    updatedAt: 1731760000000,
  },
  {
    username: "InkSlinger",
    wins: 11,
    losses: 3,
    draws: 1,
    gamesPlayed: 15,
    markId: "classic-x",
    avatar: { colorIndex: 0, eyesIndex: 3, mouthIndex: 0, hatIndex: 5 },
    updatedAt: 1731750000000,
  },
  {
    username: "SketchyFox",
    wins: 9,
    losses: 3,
    draws: 2,
    gamesPlayed: 14,
    markId: "flame",
    avatar: { colorIndex: 1, eyesIndex: 2, mouthIndex: 2, hatIndex: 2 },
    updatedAt: 1731740000000,
  },
  {
    username: "NeonMochi",
    wins: 7,
    losses: 2,
    draws: 1,
    gamesPlayed: 10,
    markId: "star",
    avatar: { colorIndex: 5, eyesIndex: 4, mouthIndex: 4, hatIndex: 4 },
    updatedAt: 1731730000000,
  },
  {
    username: "ChalkKnight",
    wins: 6,
    losses: 2,
    draws: 1,
    gamesPlayed: 9,
    markId: "swords",
    avatar: { colorIndex: 4, eyesIndex: 5, mouthIndex: 5, hatIndex: 7 },
    updatedAt: 1731720000000,
  },
  {
    username: "TurboScribble",
    wins: 5,
    losses: 2,
    draws: 1,
    gamesPlayed: 8,
    markId: "bolt",
    avatar: { colorIndex: 3, eyesIndex: 7, mouthIndex: 3, hatIndex: 0 },
    updatedAt: 1731710000000,
  },
  {
    username: "WaffleWizard",
    wins: 4,
    losses: 2,
    draws: 1,
    gamesPlayed: 7,
    markId: "classic-o",
    avatar: { colorIndex: 6, eyesIndex: 6, mouthIndex: 6, hatIndex: 6 },
    updatedAt: 1731700000000,
  },
  {
    username: "GlitchPanda",
    wins: 3,
    losses: 1,
    draws: 1,
    gamesPlayed: 5,
    markId: "ghost",
    avatar: { colorIndex: 7, eyesIndex: 0, mouthIndex: 7, hatIndex: 3 },
    updatedAt: 1731690000000,
  },
  {
    username: "CrayonSamurai",
    wins: 2,
    losses: 1,
    draws: 1,
    gamesPlayed: 4,
    markId: "rocket",
    avatar: { colorIndex: 1, eyesIndex: 3, mouthIndex: 1, hatIndex: 1 },
    updatedAt: 1731680000000,
  },
  {
    username: "PixelBandit",
    wins: 1,
    losses: 1,
    draws: 1,
    gamesPlayed: 3,
    markId: "classic-x",
    avatar: { colorIndex: 0, eyesIndex: 1, mouthIndex: 0, hatIndex: 2 },
    updatedAt: 1731670000000,
  },
];
