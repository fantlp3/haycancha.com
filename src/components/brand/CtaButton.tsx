import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** When true, the styles are merged onto the single child (e.g. a <Link>). */
  asChild?: boolean;
}

export const CtaButton = forwardRef<HTMLButtonElement, CtaButtonProps>(
  ({ variant = "primary", className, asChild = false, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold text-[14px] uppercase tracking-[1px] rounded-md px-7 py-3 transition-all duration-200 focus:outline-none focus-visible:shadow-focus-orange disabled:opacity-50 disabled:pointer-events-none";
    const styles =
      variant === "primary"
        ? "bg-orange text-white hover:brightness-90 hover:scale-[1.02] active:scale-100"
        : "bg-transparent border-2 border-orange text-orange hover:bg-orange hover:text-white";
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(base, styles, className)} {...props} />;
  }
);
CtaButton.displayName = "CtaButton";
