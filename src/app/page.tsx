"use client";

import React, { useState, useCallback } from "react";
import { StudioHeader } from "@/components/layout/studio-header";
import { MobileNavBar } from "@/components/layout/mobile-nav-bar";
import { CharacterStudioCard } from "@/components/studio/character-studio-card";
import { ScoreboardBanner } from "@/components/arena/scoreboard-banner";
import { TactileBoard } from "@/components/arena/tactile-board";
import { LeaderboardCard } from "@/components/leaderboard/leaderboard-card";
import { ToastStack } from "@/components/feedback/toast-stack";
import { usePlayerProfiles } from "@/hooks/use-player-profiles";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useTicTacToeGame } from "@/hooks/use-tictactoe-game";
import { playTactileSound } from "@/lib/sound-fx";
import {
  GameScores,
  MobileTab,
  PlayerId,
  PlayerProfile,
  ToastNotification,
} from "@/types/game";
import { cn } from "@/lib/utils";

export default function SkribblTicTacToePage() {
  const [vsBot, setVsBot] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("arena");
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const pushToast = useCallback((title: string, subtitle: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [{ id, title, subtitle }, ...prev.slice(0, 2)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const {
    p1,
    p2,
    setP2,
    activeStudioTab,
    setActiveStudioTab,
    updateUsername,
    updateMark,
    cycleAvatarTrait,
    randomizePlayer,
    swapMarks,
  } = usePlayerProfiles(soundEnabled);

  const {
    leaderboard,
    lastSyncedAt,
    highlightedUser,
    recordWin,
    recordDraw,
  } = useLeaderboard({ onToast: pushToast });

  const handleDrawOutcome = useCallback(
    (
      p1Profile: PlayerProfile,
      p2Profile: PlayerProfile,
      nextScores: GameScores
    ) => {
      recordDraw(p1Profile, p2Profile, nextScores);
      pushToast(
        "Stalemate Draw!",
        "+1 Draw recorded for both players. Hit New Game!"
      );
    },
    [recordDraw, pushToast]
  );

  const {
    board,
    turn,
    winState,
    scores,
    streaks,
    handleCellClick,
    startNewGame,
    resetSeriesScores,
  } = useTicTacToeGame({
    p1,
    p2,
    vsBot,
    soundEnabled,
    onWin: recordWin,
    onDraw: handleDrawOutcome,
  });

  const handleSelectMode = useCallback(
    (nextVsBot: boolean) => {
      playTactileSound("click", soundEnabled);
      setVsBot(nextVsBot);
      if (nextVsBot) {
        setP2((prev) => ({
          ...prev,
          username:
            prev.username === "PixelBandit" || prev.username === "SkribblBot"
              ? "Bot"
              : prev.username,
        }));
      } else if (p2.username === "Bot" || p2.username === "SkribblBot") {
        setP2((prev) => ({ ...prev, username: "PixelBandit" }));
      }
    },
    [soundEnabled, p2.username, setP2]
  );

  const handleOpenPlayerStudio = useCallback(
    (playerId: PlayerId) => {
      playTactileSound("click", soundEnabled);
      setActiveStudioTab(playerId);
      setMobileTab("studio");
    },
    [soundEnabled, setActiveStudioTab]
  );

  const handleSelectMobileTab = useCallback(
    (tab: MobileTab) => {
      playTactileSound("click", soundEnabled);
      setMobileTab(tab);
    },
    [soundEnabled]
  );

  return (
    <div className="min-h-screen flex flex-col pb-24 lg:pb-10">
      {/* RESPONSIVE TOP STUDIO HEADER */}
      <StudioHeader
        vsBot={vsBot}
        soundEnabled={soundEnabled}
        onSelectMode={handleSelectMode}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* MODULAR 3-COLUMN DESKTOP / TABBED MOBILE WORKSPACE */}
      <main className="max-w-[1400px] w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* LEFT COLUMN (4 cols): CHARACTER & MARK STUDIO */}
        <section
          aria-label="Character and Mark Customizer"
          className={cn(
            "lg:col-span-4 flex-col gap-4",
            mobileTab === "studio" ? "flex" : "hidden lg:flex"
          )}
        >
          <CharacterStudioCard
            p1={p1}
            p2={p2}
            vsBot={vsBot}
            activeStudioTab={activeStudioTab}
            onSelectStudioTab={setActiveStudioTab}
            onUpdateUsername={updateUsername}
            onUpdateMark={updateMark}
            onCycleTrait={cycleAvatarTrait}
            onRandomizePlayer={randomizePlayer}
            onDoneMobile={() => handleSelectMobileTab("arena")}
          />
        </section>

        {/* CENTER COLUMN (5 cols): SCOREBOARD + 3x3 TACTILE ARENA */}
        <section
          aria-label="Tic-Tac-Toe Game Arena"
          className={cn(
            "lg:col-span-5 flex-col gap-3.5 sm:gap-4",
            mobileTab === "arena" ? "flex" : "hidden lg:flex"
          )}
        >
          <ScoreboardBanner
            p1={p1}
            p2={p2}
            turn={turn}
            vsBot={vsBot}
            winState={winState}
            scores={scores}
            streaks={streaks}
            onSelectPlayerStudio={handleOpenPlayerStudio}
          />

          <TactileBoard
            board={board}
            turn={turn}
            vsBot={vsBot}
            p1={p1}
            p2={p2}
            winState={winState}
            onCellClick={handleCellClick}
            onNewGame={startNewGame}
            onSwapMarks={swapMarks}
            onResetSeries={resetSeriesScores}
          />
        </section>

        {/* RIGHT COLUMN (3 cols): REAL-TIME TOP 10 LEADERBOARD */}
        <section
          aria-label="Real-Time Top 10 Leaderboard"
          className={cn(
            "lg:col-span-3 flex-col gap-4",
            mobileTab === "leaderboard" ? "flex" : "hidden lg:flex"
          )}
        >
          <LeaderboardCard
            leaderboard={leaderboard}
            lastSyncedAt={lastSyncedAt}
            highlightedUser={highlightedUser}
            p1={p1}
            p2={p2}
          />
        </section>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (< lg viewports) */}
      <MobileNavBar
        activeTab={mobileTab}
        onSelectTab={handleSelectMobileTab}
        topLeaderWins={leaderboard[0]?.wins}
      />

      {/* SONNER-STYLE STACKED SPRING TOAST NOTIFICATIONS */}
      <ToastStack toasts={toasts} />
    </div>
  );
}
