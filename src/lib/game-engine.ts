import { WINNING_LINES } from "@/constants/game-constants";
import { CellValue, PlayerId, WinResult } from "@/types/game";

export function checkWinner(board: CellValue[]): WinResult {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: "draw", line: null };
  }
  return { winner: null, line: null };
}

/**
 * Tactical AI bot for Solo mode:
 * 1. Wins immediately if 2-in-a-row exists
 * 2. Blocks opponent's 2-in-a-row threat
 * 3. Controls center cell (index 4)
 * 4. Picks available corner, then edge
 */
export function getBestBotMove(
  board: CellValue[],
  botId: PlayerId = "p2"
): number {
  const humanId: PlayerId = botId === "p2" ? "p1" : "p2";
  const emptyIndices = board
    .map((val, idx) => (val === null ? idx : -1))
    .filter((idx) => idx !== -1);

  if (emptyIndices.length === 0) return -1;

  for (const idx of emptyIndices) {
    const copy = [...board];
    copy[idx] = botId;
    if (checkWinner(copy).winner === botId) return idx;
  }

  for (const idx of emptyIndices) {
    const copy = [...board];
    copy[idx] = humanId;
    if (checkWinner(copy).winner === humanId) return idx;
  }

  if (board[4] === null) return 4;

  const corners = [0, 2, 6, 8].filter((idx) => board[idx] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

