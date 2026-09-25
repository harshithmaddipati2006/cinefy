"use client";
import React from "react";
import { Button } from "@/components/ui/moving-border";

export default function MovingBorderDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
        variant="cyan"
        hoverOnly={true}
      >
        Hover over me!
      </Button>
    </div>
  );
}
