"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface ConfettiProps {
  /** Number of confetti particles */
  count?: number;
}

const CONFETTI_COLORS = [
  "#0091B3", // primary
  "#8BC53F", // brand-green
  "#FFC800", // brand-yellow
  "#D80215", // brand-pink
  "#003189", // gov-blue
  "#FF6B9D", // pink
  "#00D4AA", // teal
  "#FFD700", // gold
];

const SHAPES = ["circle", "square", "triangle"] as const;

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  shape: (typeof SHAPES)[number];
  rotation: number;
}

export default function Confetti({ count = 50 }: ConfettiProps) {
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 10,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      rotation: Math.random() * 720 - 360,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: "-5vh",
            rotate: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            y: "110vh",
            rotate: p.rotation,
            opacity: [1, 1, 0.8, 0],
            scale: [1, 1.2, 0.8],
            x: `${p.x + (Math.random() * 20 - 10)}vw`,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.shape !== "triangle" ? p.color : "transparent",
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : 0,
            borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
            borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
            borderBottom: p.shape === "triangle" ? `${p.size}px solid ${p.color}` : undefined,
            ...(p.shape === "triangle" ? { width: 0, height: 0, backgroundColor: "transparent" } : {}),
          }}
        />
      ))}
    </div>
  );
}
