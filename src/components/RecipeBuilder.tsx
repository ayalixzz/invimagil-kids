"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowUp, ArrowDown, Scale } from "lucide-react";

/* ── Utensil definitions ─────────────────────────────────── */
export interface Utensil {
  id: string;
  label: string;
  emoji: string;
  grams: number;
  description: string;
}

export const UTENSILS: Utensil[] = [
  { id: "pizca",    label: "Pizca",           emoji: "✨",  grams: 1,   description: "Un pellizquito con los dedos" },
  { id: "cucharita",label: "Cucharita",       emoji: "🥄",  grams: 5,   description: "Cuchara pequeña de postre" },
  { id: "cuchara",  label: "Cuchara grande",  emoji: "🥣",  grams: 15,  description: "Cuchara sopera grande" },
  { id: "pocillo",  label: "Pocillo / Tacita",emoji: "☕",  grams: 60,  description: "Taza chiquita de tinto" },
  { id: "jicara",   label: "Jícara / Chácara",emoji: "🍵",  grams: 120, description: "Tazón mediano" },
  { id: "taza",     label: "Taza",            emoji: "🫙",  grams: 240, description: "Taza grande estándar" },
];

export const getUtensilById = (id: string): Utensil =>
  UTENSILS.find((u) => u.id === id) || UTENSILS[1];

/* ── Ingredient type ─────────────────────────────────────── */
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  utensil: string;      // utensil id
  /** Auto-calculated: quantity × utensil grams */
  totalGrams: number;
  /** Auto-calculated percentage of total recipe weight */
  percentage: number;
}

/* ── Props ───────────────────────────────────────────────── */
interface RecipeBuilderProps {
  ingredients: Ingredient[];
  onChangeIngredients: (newIngredients: Ingredient[]) => void;
  onValidationChange: (isValid: boolean) => void;
}

/* ── Helpers ─────────────────────────────────────────────── */
const recalcPercentages = (list: Ingredient[]): Ingredient[] => {
  const totalWeight = list.reduce((s, i) => s + i.totalGrams, 0);
  if (totalWeight === 0) return list;
  return list.map((ing) => ({
    ...ing,
    percentage: Math.round((ing.totalGrams / totalWeight) * 100),
  }));
};

/* ── Component ───────────────────────────────────────────── */
export default function RecipeBuilder({
  ingredients,
  onChangeIngredients,
  onValidationChange,
}: RecipeBuilderProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedUtensil, setSelectedUtensil] = useState("cuchara");

  /* ── Add ──────────────────────────────────────────────── */
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const u = getUtensilById(selectedUtensil);
    const totalGrams = quantity * u.grams;
    const newIng: Ingredient = {
      id: crypto.randomUUID(),
      name: name.trim(),
      quantity,
      utensil: selectedUtensil,
      totalGrams,
      percentage: 0,
    };
    const updated = recalcPercentages([...ingredients, newIng]);
    onChangeIngredients(updated);
    setName("");
    setQuantity(1);
    validate(updated);
  };

  /* ── Remove ──────────────────────────────────────────── */
  const handleRemove = (id: string) => {
    const updated = recalcPercentages(ingredients.filter((i) => i.id !== id));
    onChangeIngredients(updated);
    validate(updated);
  };

  /* ── Move ────────────────────────────────────────────── */
  const moveIngredient = (index: number, dir: "up" | "down") => {
    const t = dir === "up" ? index - 1 : index + 1;
    if (t < 0 || t >= ingredients.length) return;
    const updated = [...ingredients];
    [updated[index], updated[t]] = [updated[t], updated[index]];
    onChangeIngredients(updated);
    validate(updated);
  };

  /* ── Validate ────────────────────────────────────────── */
  const validate = (list: Ingredient[]) => {
    if (list.length < 2) {
      onValidationChange(list.length > 0);
      return;
    }
    let ordered = true;
    for (let i = 0; i < list.length - 1; i++) {
      if (list[i].totalGrams < list[i + 1].totalGrams) {
        ordered = false;
        break;
      }
    }
    onValidationChange(ordered);
  };

  const isOutOfOrder = (idx: number) =>
    idx > 0 && ingredients[idx].totalGrams > ingredients[idx - 1].totalGrams;

  const isOrderCorrect = () => {
    if (ingredients.length < 2) return true;
    for (let i = 0; i < ingredients.length - 1; i++) {
      if (ingredients[i].totalGrams < ingredients[i + 1].totalGrams) return false;
    }
    return true;
  };

  const totalWeight = ingredients.reduce((s, i) => s + i.totalGrams, 0);
  const currentUtensil = getUtensilById(selectedUtensil);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h5 className="text-xl font-bold text-heading mb-1 flex items-center gap-2">
          <span>Añade los ingredientes:</span>
          <span className="text-xs text-text-secondary font-medium bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" />
            Peso total: {totalWeight} g
          </span>
        </h5>
        <p className="text-xs font-bold text-text-secondary mb-5">
          Usa utensilios de cocina para medir tus ingredientes. InviBot calcula los gramos automáticamente.
        </p>

        {/* ── Utensil selector ───────────────────────────── */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-text-secondary mb-2">
            Elige tu utensilio de medida:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {UTENSILS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setSelectedUtensil(u.id)}
                className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all text-center ${
                  selectedUtensil === u.id
                    ? "border-primary bg-primary/10 text-heading shadow-sm"
                    : "border-gray-200 bg-white text-text-secondary hover:border-gray-300"
                }`}
              >
                <span className="text-2xl mb-1">{u.emoji}</span>
                <span className="text-[10px] font-black leading-tight">{u.label}</span>
                <span className="text-[9px] font-bold text-primary mt-0.5">{u.grams}g</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Input form ─────────────────────────────────── */}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end mb-6">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-text-secondary mb-1">
              Nombre del ingrediente:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Harina de Trigo, Chocolate, Azúcar"
              className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading placeholder:text-gray-300"
            />
          </div>

          <div className="w-full sm:w-40">
            <label className="block text-sm font-bold text-text-secondary mb-1">
              Cantidad: <span className="text-primary font-black">{quantity} {currentUtensil.emoji}</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 text-heading font-black text-lg hover:bg-gray-200 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="w-16 text-center px-2 py-2 rounded-xl border-2 border-border-soft focus:border-primary focus:outline-none font-black text-heading"
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(50, quantity + 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 text-heading font-black text-lg hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-[10px] font-bold text-primary mt-1 block text-center">
              = {quantity * currentUtensil.grams} gramos
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-black px-6 py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Agregar</span>
          </motion.button>
        </form>

        {/* ── Status alerts ──────────────────────────────── */}
        <div className="space-y-2 mb-6">
          {!isOrderCorrect() && ingredients.length >= 2 && (
            <div className="bg-brand-yellow/10 border border-brand-yellow/30 text-heading p-3 rounded-2xl text-sm font-bold">
              ⚠️ ¡Los ingredientes deben ir de mayor a menor peso! Usa las flechas para organizarlos.
            </div>
          )}

          {isOrderCorrect() && ingredients.length >= 2 && (
            <div className="bg-brand-green/10 border border-brand-green/20 text-brand-green p-3 rounded-2xl text-sm font-bold">
              ✅ ¡Receta lista! Los ingredientes están ordenados correctamente. Peso total: {totalWeight}g
            </div>
          )}
        </div>

        {/* ── Equivalences mini-table ────────────────────── */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6">
          <h6 className="text-xs font-black text-heading mb-2">📏 Tabla de equivalencias rápida:</h6>
          <div className="flex flex-wrap gap-2">
            {UTENSILS.map((u) => (
              <span key={u.id} className="text-[10px] font-bold text-text-secondary bg-white px-2 py-1 rounded-lg border border-gray-100">
                {u.emoji} {u.label} = {u.grams}g
              </span>
            ))}
          </div>
        </div>

        {/* ── Ingredients list ────────────────────────────── */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {ingredients.length === 0 ? (
              <div className="text-center py-8 text-gray-300 font-bold border-2 border-dashed border-gray-100 rounded-3xl">
                🍳 ¿Qué lleva tu receta secreta? Elige un utensilio y agrega ingredientes.
              </div>
            ) : (
              ingredients.map((ing, index) => {
                const outOfOrder = isOutOfOrder(index);
                const u = getUtensilById(ing.utensil);
                return (
                  <motion.div
                    key={ing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      outOfOrder
                        ? "border-brand-pink/40 bg-brand-pink/5"
                        : "border-border-soft bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-gray-100 text-heading font-black flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <h6 className="font-extrabold text-heading text-lg">{ing.name}</h6>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-text-secondary">
                            {u.emoji} {ing.quantity} {u.label}
                          </span>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {ing.totalGrams}g
                          </span>
                          <span className="text-xs font-bold text-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">
                            {ing.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveIngredient(index, "up")}
                        className="p-2 rounded-xl bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4 stroke-[3]" />
                      </button>
                      <button
                        type="button"
                        disabled={index === ingredients.length - 1}
                        onClick={() => moveIngredient(index, "down")}
                        className="p-2 rounded-xl bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4 stroke-[3]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(ing.id)}
                        className="p-2 rounded-xl bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
