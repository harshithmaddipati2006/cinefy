"use client";
import React, { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface MovingBorderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  variant?: "cyan" | "rose" | "amber" | "purple" | "emerald" | "default";
  hoverOnly?: boolean;
  [key: string]: any;
}

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 2500,
  className,
  variant = "default",
  hoverOnly = true,
  style,
  onMouseEnter,
  onMouseLeave,
  ...otherProps
}: MovingBorderButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const gradientColor =
    variant === "rose"
      ? "#f43f5e"
      : variant === "amber" || variant === "yellow"
      ? "#facc15"
      : variant === "purple"
      ? "#a855f7"
      : variant === "emerald"
      ? "#10b981"
      : variant === "cyan"
      ? "#eab308"
      : "#eab308";

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  };

  const showBorder = !hoverOnly || isHovered;

  return (
    <Component
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden bg-transparent p-[1.5px] text-base transition-all duration-300 active:scale-[0.98] cursor-pointer",
        !containerClassName?.includes("h-") && !containerClassName?.includes("py-") && "h-14 sm:h-16",
        !containerClassName?.includes("w-") && "w-auto min-w-[140px]",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
        ...style,
      }}
      {...otherProps}
    >
      {/* Animated Moving Border Wrapper */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300 pointer-events-none",
          showBorder ? "opacity-100" : "opacity-0"
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%" active={showBorder}>
          <div
            className={cn(
              "h-28 w-28 opacity-100 filter blur-[1px]",
              borderClassName
            )}
            style={{
              background: `radial-gradient(${gradientColor} 35%, rgba(234, 179, 8, 0.4) 60%, transparent 80%)`,
            }}
          />
        </MovingBorder>
      </div>

      {/* Button Content Container */}
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center gap-2 border border-slate-800/90 bg-slate-900/[0.88] px-6 py-3 text-sm font-bold text-white antialiased backdrop-blur-xl transition-all duration-300 group-hover:bg-slate-900/95 group-hover:border-slate-700/60 shadow-lg",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2500,
  rx,
  ry,
  active = true,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  active?: boolean;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    if (!active) return;
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default Button;
