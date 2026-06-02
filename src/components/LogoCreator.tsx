"use client";

import React from "react";
import { motion } from "framer-motion";
import { Candy, ChefHat, Cookie, GlassWater, IceCream } from "lucide-react";

interface LogoCreatorProps {
  companyName: string;
  selectedIcon: string;
  selectedColor: string;
  onChangeIcon: (iconName: string) => void;
  onChangeColor: (colorHex: string) => void;
}

const ICONS = [
  { name: "cookie", label: "Galleta", icon: Cookie },
  { name: "icecream", label: "Helado", icon: IceCream },
  { name: "juice", label: "Jugo", icon: GlassWater },
  { name: "candy", label: "Dulce", icon: Candy },
  { name: "chef", label: "Chef", icon: ChefHat },
];

const COLORS = [
  { name: "azul", value: "#0091B3", label: "Azul Invimágil" },
  { name: "verde", value: "#8BC53F", label: "Verde Institucional" },
  { name: "amarillo", value: "#FFC800", label: "Amarillo Bandera" },
  { name: "rojo", value: "#D80215", label: "Rojo Bandera" },
  { name: "azul-bandera", value: "#003189", label: "Azul GOV.CO" },
];

export default function LogoCreator({
  companyName,
  selectedIcon,
  selectedColor,
  onChangeIcon,
  onChangeColor,
}: LogoCreatorProps) {
  const getInitials = (name: string) => {
    if (!name) return "EA";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const activeIconObj = ICONS.find((i) => i.name === selectedIcon) || ICONS[0];
  const ActiveIconComponent = activeIconObj.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#F6F9FB] p-6 rounded-3xl border-2 border-border-soft">
      <div className="space-y-6">
        <div>
          <h5 className="text-lg font-bold text-heading mb-3">1. Escoge un dibujo para tu marca:</h5>
          <div className="flex flex-wrap gap-3">
            {ICONS.map((item) => {
              const Icon = item.icon;
              const isSelected = item.name === selectedIcon;
              return (
                <motion.button
                  key={item.name}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onChangeIcon(item.name)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 font-bold transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-gray-200 bg-white text-text-secondary hover:border-primary/40"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <h5 className="text-lg font-bold text-heading mb-3">2. Escoge tu color favorito:</h5>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((item) => {
              const isSelected = item.value === selectedColor;
              return (
                <motion.button
                  key={item.name}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onChangeColor(item.value)}
                  className="w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center"
                  style={{
                    backgroundColor: item.value,
                    borderColor: isSelected ? "#002F6C" : "transparent",
                    boxShadow: isSelected ? "0 0 10px rgba(0, 47, 108, 0.2)" : "none",
                  }}
                  title={item.label}
                >
                  {isSelected && (
                    <span className="text-white text-xs font-black shadow-sm">✓</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-inner">
        <h5 className="text-sm font-black text-text-secondary uppercase tracking-widest mb-4">
          Vista previa de tu logotipo
        </h5>

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-40 h-40 rounded-full flex flex-col items-center justify-center text-white relative shadow-lg"
          style={{ backgroundColor: selectedColor }}
        >
          <div className="absolute inset-2 rounded-full border-2 border-white/20 pointer-events-none" />

          <ActiveIconComponent className="w-14 h-14 mb-1 drop-shadow-md text-white" />
          <span className="text-2xl font-black tracking-wider drop-shadow-md">
            {getInitials(companyName)}
          </span>
        </motion.div>

        <span className="text-xl font-bold text-heading mt-4 text-center">
          {companyName || "Mi Súper Empresa"}
        </span>
        <span className="text-sm italic text-text-secondary text-center mt-1">
          {companyName ? "¡Excelente elección!" : "¡Escribe un nombre arriba!"}
        </span>
      </div>
    </div>
  );
}
