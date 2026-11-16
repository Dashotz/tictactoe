"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AVATAR_COLORS,
  AVATAR_EYES,
  AVATAR_HATS,
  AVATAR_MOUTHS,
  DEFAULT_P1,
  DEFAULT_P2,
  LOCAL_STORAGE_PROFILES_KEY,
  MARKS,
  RANDOM_SKRIBBL_NAMES,
} from "@/constants/game-constants";
import { playTactileSound } from "@/lib/sound-fx";
import { AvatarConfig, MarkId, PlayerId, PlayerProfile } from "@/types/game";

export function usePlayerProfiles(soundEnabled: boolean) {
  const [p1, setP1] = useState<PlayerProfile>(DEFAULT_P1);
  const [p2, setP2] = useState<PlayerProfile>(DEFAULT_P2);
  const [activeStudioTab, setActiveStudioTab] = useState<PlayerId>("p1");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.p1) setP1(parsed.p1);
        if (parsed.p2) setP2(parsed.p2);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_PROFILES_KEY,
        JSON.stringify({ p1, p2 })
      );
    } catch {
      // Ignore storage errors
    }
  }, [p1, p2]);

  const updateUsername = useCallback((playerId: PlayerId, username: string) => {
    const setter = playerId === "p1" ? setP1 : setP2;
    setter((prev) => ({ ...prev, username }));
  }, []);

  const updateMark = useCallback(
    (playerId: PlayerId, markId: MarkId) => {
      playTactileSound("click", soundEnabled);
      const setter = playerId === "p1" ? setP1 : setP2;
      setter((prev) => ({ ...prev, markId }));
    },
    [soundEnabled]
  );

  const cycleAvatarTrait = useCallback(
    (
      playerId: PlayerId,
      trait: keyof AvatarConfig,
      delta: number,
      max: number
    ) => {
      playTactileSound("click", soundEnabled);
      const setter = playerId === "p1" ? setP1 : setP2;
      setter((prev) => ({
        ...prev,
        avatar: {
          ...prev.avatar,
          [trait]: (prev.avatar[trait] + delta + max) % max,
        },
      }));
    },
    [soundEnabled]
  );

  const randomizePlayer = useCallback(
    (playerId: PlayerId, includeName = false) => {
      playTactileSound("click", soundEnabled);
      const setter = playerId === "p1" ? setP1 : setP2;
      const otherPlayer = playerId === "p1" ? p2 : p1;
      const availableMarks = MARKS.filter(
        (m) => m.id === "avatar-stamp" || m.id !== otherPlayer.markId
      );
      const randomMark =
        availableMarks[Math.floor(Math.random() * availableMarks.length)];
      const randomName =
        RANDOM_SKRIBBL_NAMES[
          Math.floor(Math.random() * RANDOM_SKRIBBL_NAMES.length)
        ];

      setter((prev) => ({
        ...prev,
        username: includeName ? randomName : prev.username,
        markId: randomMark.id,
        avatar: {
          colorIndex: Math.floor(Math.random() * AVATAR_COLORS.length),
          eyesIndex: Math.floor(Math.random() * AVATAR_EYES.length),
          mouthIndex: Math.floor(Math.random() * AVATAR_MOUTHS.length),
          hatIndex: Math.floor(Math.random() * AVATAR_HATS.length),
        },
      }));
    },
    [soundEnabled, p1, p2]
  );

  const swapMarks = useCallback(() => {
    playTactileSound("click", soundEnabled);
    const p1Mark = p1.markId;
    const p2Mark = p2.markId;
    setP1((prev) => ({ ...prev, markId: p2Mark }));
    setP2((prev) => ({ ...prev, markId: p1Mark }));
  }, [soundEnabled, p1.markId, p2.markId]);

  return {
    p1,
    p2,
    setP1,
    setP2,
    activeStudioTab,
    setActiveStudioTab,
    updateUsername,
    updateMark,
    cycleAvatarTrait,
    randomizePlayer,
    swapMarks,
  };
}

