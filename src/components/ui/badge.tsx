import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-[#00E5FF]/30 bg-[#00E5FF]/12 text-[#00E5FF]",
        coral:
          "border border-[#FF553E]/30 bg-[#FF553E]/12 text-[#FF715E]",
        gold:
          "border border-[#FFB800]/35 bg-[#FFB800]/15 text-[#FFD059]",
        secondary:
          "border border-white/10 bg-white/[0.05] text-[#CBD5E1]",
        outline:
          "border border-white/15 text-[#94A3B8]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

