"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Heart, Shield, Sparkles } from "lucide-react";

interface BpmItem {
  id: string;
  question: string;
  icon: string;
  points: number;
  category: "higiene" | "seguridad" | "calidad";
}

interface BpmChecklistProps {
  checkedIds: string[];
  onToggleItem: (id: string) => void;
  medalsEarned: string[];
}

const BPM_ITEMS: BpmItem[] = [
  {
    id: "hands",
    question: "Antes de preparar tu producto, ¿te lavaste muy bien las manos con agua y jabón?",
    icon: "🧼",
    points: 20,
    category: "higiene",
  },
  {
    id: "table",
    question: "¿Tu mesa de trabajo o cocina está limpia, ordenada y lista para preparar alimentos?",
    icon: "✨",
    points: 20,
    category: "calidad",
  },
  {
    id: "hair",
    question: "¿Te pusiste gorro de chef o recogiste tu cabello para proteger el alimento?",
    icon: "🧑‍🍳",
    points: 20,
    category: "seguridad",
  },
  {
    id: "ingredients",
    question: "¿Revisaste que todos tus ingredientes estén frescos y en buen estado?",
    icon: "🍏",
    points: 20,
    category: "calidad",
  },
  {
    id: "utensils",
    question: "¿Lavaste tus utensilios antes de usarlos?",
    icon: "🥣",
    points: 20,
    category: "higiene",
  },
];

export default function BpmChecklist({
  checkedIds,
  onToggleItem,
  medalsEarned,
}: BpmChecklistProps) {
  const isChecked = (id: string) => checkedIds.includes(id);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="text-center md:text-left">
          <h5 className="text-xl font-bold text-heading mb-1">Tus medallas de calidad</h5>
          <p className="text-sm text-text-secondary">Cumple las reglas de higiene para ganarlas todas.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <motion.div
            animate={medalsEarned.includes("higiene") ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${
              medalsEarned.includes("higiene")
                ? "bg-brand-green/10 border-brand-green text-brand-green"
                : "bg-gray-50 border-gray-200 text-gray-300"
            }`}
          >
            <Sparkles className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider">Higiene</span>
          </motion.div>

          <motion.div
            animate={medalsEarned.includes("seguridad") ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${
              medalsEarned.includes("seguridad")
                ? "bg-primary/10 border-primary text-primary"
                : "bg-gray-50 border-gray-200 text-gray-300"
            }`}
          >
            <Shield className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider">Seguridad</span>
          </motion.div>

          <motion.div
            animate={medalsEarned.includes("calidad") ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${
              medalsEarned.includes("calidad")
                ? "bg-brand-yellow/20 border-brand-yellow text-heading"
                : "bg-gray-50 border-gray-200 text-gray-300"
            }`}
          >
            <Heart className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider">Calidad</span>
          </motion.div>
        </div>
      </div>

      <div className="space-y-4">
        {BPM_ITEMS.map((item) => {
          const checked = isChecked(item.id);
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onToggleItem(item.id)}
              className={`p-5 rounded-3xl border-2 flex items-center justify-between gap-6 cursor-pointer select-none transition-all duration-300 ${
                checked
                  ? "bg-brand-green/10 border-brand-green text-heading shadow-sm"
                  : "bg-white border-border-soft hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <p className="text-base font-extrabold text-heading md:text-lg leading-snug">
                  {item.question}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    checked
                      ? "bg-brand-green/20 text-heading"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  +{item.points} pts
                </span>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-3 transition-all ${
                    checked
                      ? "bg-brand-green border-brand-green text-white"
                      : "border-gray-200 bg-white text-transparent"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[4]" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
