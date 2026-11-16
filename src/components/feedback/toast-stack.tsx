"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { ToastNotification } from "@/types/game";

interface ToastStackProps {
  toasts: ToastNotification[];
}

export function ToastStack({ toasts }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 lg:bottom-5 right-3 sm:right-5 left-3 sm:left-auto z-50 flex flex-col gap-2 sm:max-w-sm w-auto sm:w-full pointer-events-none"
    >
      {toasts.map((t, index) => (
        <div
          key={t.id}
          style={{
            transform: `scale(${1 - index * 0.04}) translateY(${
              index * -4
            }px)`,
            opacity: 1 - index * 0.2,
          }}
          className="animate-toast-enter pointer-events-auto card-tactile px-4 py-3 border border-[#00E5FF]/35 flex items-start gap-3 shadow-2xl"
        >
          <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{t.title}</p>
            <p className="text-[11px] text-[#94A3B8] truncate">{t.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

