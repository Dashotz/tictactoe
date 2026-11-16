import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-white/10 bg-[#0B0F19]/90 px-3.5 py-2 text-sm font-medium text-[#F1F5F9] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all placeholder:text-[#64748B] hover:border-white/20 focus-visible:border-[#00E5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/30 disabled:cursor-not-allowed disabled:opacity-45",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

