"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";

interface CharacterBubbleProps {
  message: string;
  expression?: "happy" | "thinking" | "checking" | "excited";
}

const QUICK_TIPS = [
  "Tip de InviBot: en una etiqueta real, los ingredientes se listan de mayor a menor cantidad.",
  "Tip de higiene: manos limpias, mesa limpia y utensilios limpios hacen un producto más seguro.",
  "Tip de marca: un nombre corto y fácil de recordar ayuda a que tu producto se vea más profesional.",
  "Tip de receta: si la suma no da 100%, ajusta los porcentajes antes de enviar el expediente.",
];

export default function CharacterBubble({ message, expression = "happy" }: CharacterBubbleProps) {
  const [tipIndex, setTipIndex] = useState<number | null>(null);

  const invibotVariants: Variants = {
    happy: {
      y: [0, -8, 0],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
    },
    thinking: {
      y: [0, -5, 0],
      rotate: [0, -2, 2, 0],
      transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
    },
    checking: {
      y: [0, -6, 0],
      scale: [1, 1.025, 1],
      transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
    },
    excited: {
      y: [0, -12, 0],
      scale: [1, 1.06, 1],
      transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
    },
  };

  const displayedMessage = tipIndex === null ? message : QUICK_TIPS[tipIndex];

  const showNextTip = () => {
    setTipIndex((current) => (current === null ? 0 : (current + 1) % QUICK_TIPS.length));
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 bg-white/95 border-2 border-primary/15 rounded-[2rem] p-5 sm:p-6 shadow-[0_18px_45px_-28px_rgba(0,47,108,0.55)] max-w-4xl mx-auto my-6 relative overflow-hidden">
      <motion.button
        type="button"
        aria-label="Pedir un consejo a InviBot"
        className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 cursor-pointer rounded-[2rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
        variants={invibotVariants}
        animate={expression}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={showNextTip}
      >
        <Image
          src="/invibot.png"
          alt="InviBot, asistente virtual de Invimágil Kids"
          fill
          sizes="(min-width: 768px) 160px, 128px"
          className="object-contain drop-shadow-xl"
          priority
        />
      </motion.button>

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2 mb-3">
          <h4 className="text-xl font-extrabold text-heading flex items-center justify-center md:justify-start gap-2">
            <span>InviBot</span>
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-green shadow-[0_0_0_5px_rgba(139,197,63,0.18)]" />
          </h4>
          <span className="text-[10px] uppercase tracking-[0.18em] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Asistente activo
          </span>
        </div>

        <motion.p
          key={displayedMessage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-lg text-text-secondary leading-relaxed font-semibold"
        >
          {displayedMessage}
        </motion.p>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
          <button
            type="button"
            onClick={showNextTip}
            className="bg-primary text-white text-sm font-black px-4 py-2.5 rounded-full shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-300"
          >
            Dame una pista
          </button>
          {tipIndex !== null && (
            <button
              type="button"
              onClick={() => setTipIndex(null)}
              className="text-sm font-black text-heading px-4 py-2.5 rounded-full hover:bg-primary/10 active:scale-[0.98] transition-all duration-300"
            >
              Volver al paso
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
