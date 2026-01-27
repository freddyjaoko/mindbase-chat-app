import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("self-start text-[24px] font-bold", className)}>{children}</div>;
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
      className={cn("w-full text-md text-[16px] font-bold py-6", className)}
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
