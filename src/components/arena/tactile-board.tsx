"use client";

import React from "react";
import { RotateCcw, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkIcon } from "@/components/mark-icon";
import { LINE_COORDS } from "@/constants/game-constants";
import {
  CellValue,
  PlayerId,
  PlayerProfile,
  WinResult,
} from "@/types/game";
import { cn } from "@/lib/utils";

interface TactileBoardProps {
  board: CellValue[];
  turn: PlayerId;
  vsBot: boolean;
  p1: PlayerProfile;
  p2: PlayerProfile;
  winState: WinResult;
  onCellClick: (index: number) => void;
  onNewGame: () => void;
  onSwapMarks: () => void;
  onResetSeries: () => void;
}

export function TactileBoard({
  board,
  turn,
  vsBot,
  p1,
  p2,
  winState,
  onCellClick,
  onNewGame,
  onSwapMarks,
  onResetSeries,
}: TactileBoardProps) {
  const activeProfile = turn === "p1" ? p1 : p2;
  const winLineCoords = winState.line
    ? LINE_COORDS[winState.line.join(",")]
    : null;

  return (
    <div className="card-tactile p-3.5 sm:p-6 relative">
      <div
        role="grid"
        aria-label="3 by 3 Tic-Tac-Toe Board"
        className="grid grid-cols-3 gap-2.5 sm:gap-4 aspect-square w-full max-w-[350px] sm:max-w-[420px] mx-auto relative"
      >
        {board.map((cell, idx) => {
          const isWinningCell = winState.line?.includes(idx) ?? false;
          const cellOwner =
            cell === "p1" ? p1 : cell === "p2" ? p2 : null;

          return (
            <button
              key={idx}
              type="button"
              role="gridcell"
              aria-label={`Board cell ${idx + 1}, ${
                cellOwner ? `marked by ${cellOwner.username}` : "empty"
              }`}
              disabled={
                cell !== null ||
                winState.winner !== null ||
                (vsBot && turn === "p2")
              }
              onClick={() => onCellClick(idx)}
              className={cn(
                "btn-tactile group relative rounded-2xl border flex items-center justify-center aspect-square transition-all select-none overflow-hidden",
                cell === null && winState.winner === null
                  ? "bg-[#0B0F19]/85 border-white/[0.08] hover:border-[#00E5FF]/40 hover:bg-[#131B2E]/90 cursor-pointer"
                  : "bg-[#0F1523]/95 border-white/[0.1] cursor-default",
                isWinningCell &&
                  "bg-[#FFB800]/15 border-[#FFB800] shadow-[inset_0_0_24px_rgba(255,184,0,0.25),0_0_20px_-4px_rgba(255,184,0,0.4)]"
              )}
            >
              {/* Subtle Corner Coordinate Index */}
              <span className="absolute top-1.5 left-2 sm:top-2 sm:left-2.5 font-mono text-[9px] sm:text-[10px] text-white/15 pointer-events-none">
                0{idx + 1}
              </span>

              {/* Placed Mark with Emil Kowalski Spring Bounce */}
              {cellOwner && (
                <div className="animate-mark-in flex items-center justify-center scale-90 sm:scale-100">
                  <MarkIcon
                    markId={cellOwner.markId}
                    avatar={cellOwner.avatar}
                    size="lg"
                  />
                </div>
              )}

              {/* Ghost Hover Preview for Empty Cell */}
              {cell === null &&
                winState.winner === null &&
                !(vsBot && turn === "p2") && (
                  <div className="opacity-0 group-hover:opacity-25 transition-opacity duration-150 pointer-events-none scale-75 sm:scale-90">
                    <MarkIcon
                      markId={activeProfile.markId}
                      avatar={activeProfile.avatar}
                      size="lg"
                    />
                  </div>
                )}
            </button>
          );
        })}

        {/* Animated SVG Winning Strike Line Overlay */}
        {winLineCoords && (
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          >
            <line
              x1={winLineCoords.x1}
              y1={winLineCoords.y1}
              x2={winLineCoords.x2}
              y2={winLineCoords.y2}
              stroke="#FFB800"
              strokeWidth="4.5"
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 0 12px rgba(255, 184, 0, 0.85))",
              }}
            />
          </svg>
        )}
      </div>

      {/* ACTION BAR: NEW GAME + SWAP MARKS + RESET SCORES */}
      <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2">
        <Button
          size="lg"
          onClick={onNewGame}
          className="flex-1 min-w-[140px] h-11 sm:h-12 text-sm font-extrabold tracking-wide"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Game</span>
        </Button>

        <Button
          variant="secondary"
          onClick={onSwapMarks}
          title="Swap Player 1 and Player 2 marks"
          className="h-11 sm:h-10"
        >
          <ArrowLeftRight className="w-4 h-4 text-[#00E5FF]" />
          <span>Swap Marks</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onResetSeries}
          className="text-xs text-[#94A3B8] hover:text-white h-10 px-3"
        >
          Reset Series
        </Button>
      </div>
    </div>
  );
}

