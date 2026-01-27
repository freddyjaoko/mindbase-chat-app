import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("self-start text-[28px] font-extrabold uppercase tracking-tight leading-tight", className)}>{children}</div>;
}

import { Button as UIButton } from "@/components/ui/button";

export function Button({
  children,
  className,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <UIButton
      className={cn(
        "w-full text-md text-[16px] font-bold py-6 rounded-none border-2 border-transparent uppercase tracking-wider",
        "bg-black text-white hover:bg-gray-800",
        "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-black transition-all transform active:translate-y-[2px] active:translate-x-[2px] active:shadow-none",
        className
      )}
      disabled={disabled}
    >
      {children}
    </UIButton>
  );
}

export function Error({ error, className }: { error: string[] | undefined; className?: string }) {
  return (
    error && (
      <ul className={cn("mb-4", className)}>
        {error.map((e, i) => (
          <li key={i} className="text-red-500 text-center">
            {e}
          </li>
        ))}
      </ul>
    )
  );
}
