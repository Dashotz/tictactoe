"use client";

import React from "react";
import { Gamepad2, Sparkles, Trophy } from "lucide-react";
import { MobileTab } from "@/types/game";
import { cn } from "@/lib/utils";

interface MobileNavBarProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  topLeaderWins?: number;
}

export function MobileNavBar({
  activeTab,
  onSelectTab,
  topLeaderWins,
}: MobileNavBarProps) {
  const navItems: {
    id: MobileTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: "arena",
      label: "3×3 Arena",
      icon: Gamepad2,
    },
    {
      id: "studio",
      label: "Character Studio",
      icon: Sparkles,
    },
    {
      id: "leaderboard",
      label: "Top 10",
      icon: Trophy,
    },
  ];

  return (
    <nav
      aria-label="Mobile Section Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#0B0F19]/95 backdrop-blur-xl px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={cn(
                "btn-tactile relative flex flex-col items-center justify-center py-2 px-2 rounded-xl border text-xs font-semibold transition-all min-h-[48px]",
                isActive
                  ? "bg-[#172036] border-[#00E5FF]/50 text-[#00E5FF] shadow-[0_0_16px_-4px_rgba(0,229,255,0.4)]"
                  : "bg-white/[0.02] border-transparent text-[#94A3B8] hover:text-white"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-4 h-4" />
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#FFB800]/20 text-[#FFD059] border border-[#FFB800]/30">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

