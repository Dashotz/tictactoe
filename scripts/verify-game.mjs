import assert from "node:assert/strict";

// Pure verification check for 3x3 win/draw logic & Top-10 Leaderboard pruning (ponytail self-check)
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board) {
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

function upsertTop10(entries, { username, winsToAdd = 1 }) {
  const list = [...entries];
  const idx = list.findIndex(
    (e) => e.username.toLowerCase() === username.toLowerCase()
  );
  if (idx >= 0) {
    list[idx] = { ...list[idx], wins: list[idx].wins + winsToAdd };
  } else {
    list.push({ username, wins: winsToAdd });
  }
  return list.sort((a, b) => b.wins - a.wins).slice(0, 10);
}

// 1. Verify all 8 winning lines
for (const line of WINNING_LINES) {
  const board = Array(9).fill(null);
  board[line[0]] = "p1";
  board[line[1]] = "p1";
  board[line[2]] = "p1";
  const res = checkWinner(board);
  assert.equal(res.winner, "p1", `Expected p1 win on line ${line}`);
}

// 2. Verify draw detection
const drawBoard = ["p1", "p2", "p1", "p1", "p2", "p2", "p2", "p1", "p1"];
assert.equal(checkWinner(drawBoard).winner, "draw");

// 3. Verify Top-10 leaderboard cap & sorting
let lb = Array.from({ length: 10 }, (_, i) => ({
  username: `Player${i + 1}`,
  wins: 10 - i,
}));
lb = upsertTop10(lb, { username: "NewChallenger", winsToAdd: 25 });
assert.equal(lb.length, 10, "Leaderboard must strictly cap at 10 entries");
assert.equal(lb[0].username, "NewChallenger", "Highest wins must be rank #1");

console.log("✅ All game engine and Top-10 leaderboard checks passed.");

