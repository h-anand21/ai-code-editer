import * as React from "react";
import { cn } from "@/lib/utils";

export const Kbd = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  return (
    <kbd
      ref={ref}
      className={cn(
        "pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[12px] font-medium text-muted-foreground opacity-100",
        className
      )}
      {...props}
    />
  );
});
Kbd.displayName = "Kbd";
