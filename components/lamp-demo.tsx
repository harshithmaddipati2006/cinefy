"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "./ui/lamp";

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-b from-yellow-100 via-yellow-300 to-amber-500 py-4 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent md:text-7xl drop-shadow-[0_0_35px_rgba(234,179,8,0.4)]"
      >
        CINEFY <br /> Feel The Cinema
      </motion.h1>
    </LampContainer>
  );
}

export default LampDemo;
