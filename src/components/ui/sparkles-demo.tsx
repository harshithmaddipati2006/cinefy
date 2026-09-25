"use client";
import React from "react";
import { SparklesCore } from "./sparkles";

export function SparklesDemo() {
  return (
    <div className="h-[40rem] w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden rounded-md relative">
      <h1 className="md:text-7xl text-4xl lg:text-9xl font-extrabold text-center text-white tracking-wider relative z-20 bg-gradient-to-b from-yellow-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(234,179,8,0.5)]">
        CINEFY
      </h1>
      <div className="w-[40rem] max-w-full h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-amber-300 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FACC15"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-slate-950 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}

export default SparklesDemo;
