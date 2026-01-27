"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    colorClassName?: string;
    heightClassName?: string;
    widthClassName?: string;
  }
>(
  (
    { className, colorClassName = "bg-primary", heightClassName = "h-5", widthClassName = "w-[200px]", ...props },
    ref,
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex touch-none select-none items-center", heightClassName, widthClassName, className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[6px] grow rounded-none bg-black/20 border-2 border-black/10">
        <SliderPrimitive.Range className="absolute h-full rounded-none bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={cn("block size-5 rounded-none border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none", colorClassName)} />
    </SliderPrimitive.Root>
  ),
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
