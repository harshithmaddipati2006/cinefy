"use client";
import React, { useId, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export const SparklesCore = ({
  id,
  className,
  background,
  minSize = 0.4,
  maxSize = 1.2,
  speed = 1,
  particleColor = "#FFF",
  particleDensity = 120,
}) => {
  const generatedId = useId();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    // Generate particles
    let particles = [];
    const count = Math.floor((width * height) / 10000) * (particleDensity / 10);
    const totalCount = Math.max(30, Math.min(count, 400));

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < totalCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() - 0.5) * 0.4 * speed,
          speedY: (Math.random() - 0.5) * 0.4 * speed,
          opacity: Math.random() * 0.8 + 0.2,
          opacitySpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        });
      }
    };

    initParticles();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Twinkle
        p.opacity += p.opacitySpeed;
        if (p.opacity > 1 || p.opacity < 0.1) {
          p.opacitySpeed = -p.opacitySpeed;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.shadowBlur = 4;
        ctx.shadowColor = particleColor;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [minSize, maxSize, speed, particleColor, particleDensity]);

  return (
    <div
      className={cn("relative h-full w-full", className)}
      style={{
        background: background || "transparent",
      }}
    >
      <canvas
        ref={canvasRef}
        id={id || generatedId}
        className="h-full w-full block"
      />
    </div>
  );
};
