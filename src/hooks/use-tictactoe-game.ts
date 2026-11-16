"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { checkWinner, getBestBotMove } from "@/lib/game-engine";
import { playTactileSound } from "@/lib/sound-fx";
import {
  CellValue,
  GameScores,
  GameStreaks,
  PlayerId,
  PlayerProfile,
  WinResult,
} from "@/types/game";

interface UseTicTacToeGameOptions {
  p1: PlayerProfile;
  p2: PlayerProfile;
  vsBot: boolean;
  soundEnabled: boolean;
  onWin: (
    winnerProfile: PlayerProfile,
    loserProfile: PlayerProfile,
    nextScores: GameScores
  ) => void;
  onDraw: (
    p1Profile: PlayerProfile,
    p2Profile: PlayerProfile,
    nextScores: GameScores
  ) => void;
}

export function useTicTacToeGame({
  p1,
  p2,
  vsBot,
  soundEnabled,
  onWin,
  onDraw,
}: UseTicTacToeGameOptions) {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<PlayerId>("p1");
  const [startingPlayer, setStartingPlayer] = useState<PlayerId>("p1");
  const [winState, setWinState] = useState<WinResult>({
    winner: null,
    line: null,
  });
  const [scores, setScores] = useState<GameScores>({ p1: 0, p2: 0, draws: 0 });
  const [streaks, setStreaks] = useState<GameStreaks>({ p1: 0, p2: 0 });

  const fireWinConfetti = useCallback((winnerId: PlayerId) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const color = winnerId === "p1" ? "#00E5FF" : "#FF553E";
    confetti({
      particleCount: 55,
      spread: 68,
      origin: { y: 0.62 },
      colors: [color, "#FFB800", "#FFFFFF"],
    });
  }, []);

  const handleCellClick = useCallback(
    (index: number, isBotMove = false) => {
      if (board[index] !== null || winState.winner !== null) return;
      if (vsBot && turn === "p2" && !isBotMove) return;

      const nextBoard = [...board];
      nextBoard[index] = turn;
      setBoard(nextBoard);

      playTactileSound(
        turn === "p1" ? "place-p1" : "place-p2",
        soundEnabled
      );

      const result = checkWinner(nextBoard);
      if (result.winner) {
        setWinState(result);

        if (result.winner === "p1" || result.winner === "p2") {
          const winnerId = result.winner;
          const winnerProfile = winnerId === "p1" ? p1 : p2;
          const loserProfile = winnerId === "p1" ? p2 : p1;
          const nextScores: GameScores = {
            ...scores,
            [winnerId]: scores[winnerId] + 1,
          };

          playTactileSound("win", soundEnabled);
          fireWinConfetti(winnerId);

          setScores(nextScores);
          setStreaks((prev) => ({
            p1: winnerId === "p1" ? prev.p1 + 1 : 0,
            p2: winnerId === "p2" ? prev.p2 + 1 : 0,
          }));

          onWin(winnerProfile, loserProfile, nextScores);
        } else {
          const nextScores: GameScores = {
            ...scores,
            draws: scores.draws + 1,
          };
          playTactileSound("draw", soundEnabled);
          setScores(nextScores);
          setStreaks({ p1: 0, p2: 0 });
          onDraw(p1, p2, nextScores);
        }
      } else {
        setTurn(turn === "p1" ? "p2" : "p1");
      }
    },
    [
      board,
      winState.winner,
      vsBot,
      turn,
      soundEnabled,
      p1,
      p2,
      scores,
      fireWinConfetti,
      onWin,
      onDraw,
    ]
  );

  // Trigger smart bot move when vsBot is active
  useEffect(() => {
    if (!vsBot || turn !== "p2" || winState.winner !== null) return;
    const timer = setTimeout(() => {
      const moveIdx = getBestBotMove(board, "p2");
      if (moveIdx !== -1) {
        handleCellClick(moveIdx, true);
      }
    }, 420);
    return () => clearTimeout(timer);
  }, [vsBot, turn, winState.winner, board, handleCellClick]);

  const startNewGame = useCallback(() => {
    playTactileSound("click", soundEnabled);
    const nextStarter: PlayerId = startingPlayer === "p1" ? "p2" : "p1";
    setStartingPlayer(nextStarter);
    setBoard(Array(9).fill(null));
    setTurn(nextStarter);
    setWinState({ winner: null, line: null });
  }, [soundEnabled, startingPlayer]);

  const resetSeriesScores = useCallback(() => {
    playTactileSound("click", soundEnabled);
    setScores({ p1: 0, p2: 0, draws: 0 });
    setStreaks({ p1: 0, p2: 0 });
    setBoard(Array(9).fill(null));
    setTurn("p1");
    setStartingPlayer("p1");
    setWinState({ winner: null, line: null });
  }, [soundEnabled]);

  return {
    board,
    turn,
    winState,
    scores,
    streaks,
    handleCellClick,
    startNewGame,
    resetSeriesScores,
  };
}
