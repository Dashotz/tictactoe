import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn-tactile inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#00E5FF] text-[#0B0F19] font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_4px_14px_-2px_rgba(0,229,255,0.38)] hover:bg-[#26EAFF] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_6px_20px_-2px_rgba(0,229,255,0.5)]",
        coral:
          "bg-[#FF553E] text-white font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_4px_14px_-2px_rgba(255,85,62,0.4)] hover:bg-[#FF6954]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-white/10 bg-white/[0.04] text-[#F1F5F9] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:bg-white/[0.08] hover:border-white/20",
        secondary:
          "bg-[#1A2133] text-[#E2E8F0] border border-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:bg-[#232C42] hover:border-white/15",
        ghost:
          "text-[#94A3B8] hover:bg-white/[0.06] hover:text-[#F1F5F9]",
        link: "text-[#00E5FF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

