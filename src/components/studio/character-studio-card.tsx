"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Dices, Sparkles, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkribblAvatar } from "@/components/skribbl-avatar";
import { MarkIcon } from "@/components/mark-icon";
import {
  AVATAR_COLORS,
  AVATAR_EYES,
  AVATAR_HATS,
  AVATAR_MOUTHS,
  MARKS,
} from "@/constants/game-constants";
import { AvatarConfig, MarkId, PlayerId, PlayerProfile } from "@/types/game";
import { cn } from "@/lib/utils";

interface CharacterStudioCardProps {
  p1: PlayerProfile;
  p2: PlayerProfile;
  vsBot: boolean;
  activeStudioTab: PlayerId;
  onSelectStudioTab: (tab: PlayerId) => void;
  onUpdateUsername: (playerId: PlayerId, username: string) => void;
  onUpdateMark: (playerId: PlayerId, markId: MarkId) => void;
  onCycleTrait: (
    playerId: PlayerId,
    trait: keyof AvatarConfig,
    delta: number,
    max: number
  ) => void;
  onRandomizePlayer: (playerId: PlayerId, includeName?: boolean) => void;
  onDoneMobile?: () => void;
}

export function CharacterStudioCard({
  p1,
  p2,
  vsBot,
  activeStudioTab,
  onSelectStudioTab,
  onUpdateUsername,
  onUpdateMark,
  onCycleTrait,
  onRandomizePlayer,
  onDoneMobile,
}: CharacterStudioCardProps) {
  return (
    <Card className="overflow-hidden border-white/[0.08]">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-white/[0.06] bg-white/[0.01]">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            <span>Character Studio</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Customize username, avatar & board mark
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4">
        <Tabs
          value={activeStudioTab}
          onValueChange={(v) => onSelectStudioTab(v as PlayerId)}
        >
          <TabsList className="grid grid-cols-2 w-full h-11">
            <TabsTrigger value="p1" className="gap-2 h-9">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] shrink-0" />
              <span className="truncate max-w-[110px]">
                P1: {p1.username || "Player 1"}
              </span>
            </TabsTrigger>
            <TabsTrigger value="p2" className="gap-2 h-9">
              <span className="w-2 h-2 rounded-full bg-[#FF553E] shrink-0" />
              <span className="truncate max-w-[110px]">
                {vsBot ? "Bot: " : "P2: "}
                {p2.username || "Player 2"}
              </span>
            </TabsTrigger>
          </TabsList>

          {(["p1", "p2"] as const).map((pid) => {
            const profile = pid === "p1" ? p1 : p2;
            const otherProfile = pid === "p1" ? p2 : p1;

            return (
              <TabsContent key={pid} value={pid} className="space-y-4">
                {/* 1. Username Input + Dice Randomizer */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`username-${pid}`}
                      className="text-xs font-semibold uppercase tracking-[0.06em] text-[#94A3B8]"
                    >
                      {pid === "p1"
                        ? "Player 1 Username"
                        : vsBot
                          ? "Bot Rival Name"
                          : "Player 2 Username"}
                    </label>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      {profile.username.length}/16
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id={`username-${pid}`}
                      value={profile.username}
                      maxLength={16}
                      placeholder="Enter username..."
                      className="h-11 sm:h-10"
                      onChange={(e) => onUpdateUsername(pid, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="shrink-0 h-11 w-11 sm:h-10 sm:w-10"
                      onClick={() => onRandomizePlayer(pid, true)}
                      title="Randomize Username & Character"
                    >
                      <Dices className="w-4 h-4 text-[#00E5FF]" />
                    </Button>
                  </div>
                </div>

                {/* 2. Skribbl.io Interactive Avatar Stage */}
                <div className="rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] p-3.5 sm:p-4 flex flex-col items-center gap-3 relative overflow-hidden">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B]">
                      {AVATAR_COLORS[profile.avatar.colorIndex].name}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRandomizePlayer(pid, false)}
                      className="btn-tactile inline-flex items-center gap-1 text-xs font-semibold text-[#00E5FF] hover:underline py-1 px-2 rounded-lg"
                    >
                      <Dices className="w-3.5 h-3.5" />
                      <span>Shuffle Look</span>
                    </button>
                  </div>

                  <div className="my-0.5 flex items-center justify-center relative">
                    <SkribblAvatar
                      config={profile.avatar}
                      size="xl"
                      mood="active"
                    />
                    <div
                      className="absolute -bottom-1 -right-2 w-9 h-9 rounded-xl bg-[#151C2E] border border-white/15 flex items-center justify-center shadow-lg"
                      title={`Selected Mark: ${profile.markId}`}
                    >
                      <MarkIcon
                        markId={profile.markId}
                        avatar={profile.avatar}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Touch-Friendly Trait Cyclers */}
                  <div className="w-full space-y-1.5 pt-1">
                    {(
                      [
                        {
                          key: "hatIndex" as const,
                          label: "Topper",
                          valueName: AVATAR_HATS[profile.avatar.hatIndex],
                          max: AVATAR_HATS.length,
                        },
                        {
                          key: "eyesIndex" as const,
                          label: "Eyes",
                          valueName: AVATAR_EYES[profile.avatar.eyesIndex],
                          max: AVATAR_EYES.length,
                        },
                        {
                          key: "mouthIndex" as const,
                          label: "Mouth",
                          valueName: AVATAR_MOUTHS[profile.avatar.mouthIndex],
                          max: AVATAR_MOUTHS.length,
                        },
                        {
                          key: "colorIndex" as const,
                          label: "Color",
                          valueName:
                            AVATAR_COLORS[profile.avatar.colorIndex].name,
                          max: AVATAR_COLORS.length,
                        },
                      ] as const
                    ).map((row) => (
                      <div
                        key={row.key}
                        className="flex items-center justify-between bg-[#131929] rounded-xl px-2 py-1.5 border border-white/[0.05]"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onCycleTrait(pid, row.key, -1, row.max)
                          }
                          className="btn-tactile w-9 h-9 sm:w-7 sm:h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] flex items-center justify-center text-[#CBD5E1]"
                          aria-label={`Previous ${row.label}`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="text-center px-2">
                          <span className="text-[10px] uppercase tracking-[0.08em] text-[#64748B] block leading-none">
                            {row.label}
                          </span>
                          <span className="text-xs font-semibold text-[#F1F5F9]">
                            {row.valueName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onCycleTrait(pid, row.key, 1, row.max)
                          }
                          className="btn-tactile w-9 h-9 sm:w-7 sm:h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] flex items-center justify-center text-[#CBD5E1]"
                          aria-label={`Next ${row.label}`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Choose Board Mark ("X", "O", Icons, or Custom Doodle Stamp) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#94A3B8]">
                      Choose Your Board Mark
                    </span>
                    <span className="text-[11px] text-[#00E5FF] font-medium">
                      {MARKS.find((m) => m.id === profile.markId)?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {MARKS.map((mark) => {
                      const isSelected = profile.markId === mark.id;
                      const isTakenByOpponent =
                        mark.id !== "avatar-stamp" &&
                        otherProfile.markId === mark.id;

                      return (
                        <button
                          key={mark.id}
                          type="button"
                          disabled={isTakenByOpponent}
                          onClick={() => onUpdateMark(pid, mark.id)}
                          title={
                            isTakenByOpponent
                              ? `${mark.label} is currently used by ${otherProfile.username}`
                              : mark.label
                          }
                          className={cn(
                            "btn-tactile relative flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl border transition-all min-h-[70px]",
                            isSelected
                              ? "bg-[#1A243B] border-[#00E5FF] shadow-[0_0_16px_-3px_rgba(0,229,255,0.4)]"
                              : "bg-[#0B0F19]/75 border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04]",
                            isTakenByOpponent &&
                            "opacity-30 cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-center justify-center w-6 h-6 shrink-0">
                            <MarkIcon
                              markId={mark.id}
                              avatar={profile.avatar}
                              size="sm"
                            />
                          </div>
                          <span className="text-[10px] leading-none font-medium text-[#CBD5E1] truncate max-w-full">
                            {mark.label.split(" ")[1] || mark.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Quick Return CTA */}
                {onDoneMobile && (
                  <div className="pt-2 lg:hidden">
                    <Button
                      type="button"
                      onClick={onDoneMobile}
                      className="w-full h-11 font-bold"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save & Back to 3×3 Arena</span>
                    </Button>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}

