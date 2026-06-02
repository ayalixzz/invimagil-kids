"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from "lucide-react";

export interface Ingredient {
  id: string;
  name: string;
  percentage: number;
}

interface RecipeBuilderProps {
  ingredients: Ingredient[];
  onChangeIngredients: (newIngredients: Ingredient[]) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function RecipeBuilder({
  ingredients,
  onChangeIngredients,
  onValidationChange,
}: RecipeBuilderProps) {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState(25);

  // Add ingredient
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newIng: Ingredient = {
      id: crypto.randomUUID(),
      name: name.trim(),
      percentage: Number(percentage),
    };
    const updated = [...ingredients, newIng];
    onChangeIngredients(updated);
    setName("");
    // Check validation on next step
    validateOrder(updated);
  };

  // Remove ingredient
  const handleRemove = (id: string) => {
    const updated = ingredients.filter((ing) => ing.id !== id);
    onChangeIngredients(updated);
    validateOrder(updated);
  };

  // Move ingredient up/down
  const moveIngredient = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ingredients.length) return;

    const updated = [...ingredients];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onChangeIngredients(updated);
    validateOrder(updated);
  };

  // Validate that ingredients are ordered from highest to lowest
  const validateOrder = (list: Ingredient[]) => {
    if (list.length < 2) {
      onValidationChange(list.length > 0);
      return;
    }
    let valid = true;
    for (let i = 0; i < list.length - 1; i++) {
      if (list[i].percentage < list[i + 1].percentage) {
        valid = false;
        break;
      }
    }
    const totalPercentage = list.reduce((sum, ing) => sum + ing.percentage, 0);
    onValidationChange(valid && totalPercentage === 100);
  };

  // Check order status of a specific index
  const isIndexOutOfOrder = (index: number) => {
    if (index === 0) return false;
    return ingredients[index].percentage > ingredients[index - 1].percentage;
  };

  const totalSum = ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
  
  // Magical balance tool (redistributes percentages to sum 100% proportionally)
  const handleMagicalAdjust = () => {
    if (ingredients.length === 0) return;
    const currentSum = totalSum === 0 ? 1 : totalSum;
    const adjusted = ingredients.map((ing) => ({
      ...ing,
      percentage: Math.round((ing.percentage / currentSum) * 100),
    }));
    
    // Adjust rounding difference
    const newSum = adjusted.reduce((sum, ing) => sum + ing.percentage, 0);
    if (newSum !== 100 && adjusted.length > 0) {
      adjusted[0].percentage += (100 - newSum);
    }

    onChangeIngredients(adjusted);
    validateOrder(adjusted);
  };

  // Check if order is fully correct (excluding sum)
  const isOrderCorrect = () => {
    if (ingredients.length < 2) return true;
    for (let i = 0; i < ingredients.length - 1; i++) {
      if (ingredients[i].percentage < ingredients[i + 1].percentage) return false;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h5 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
          <span>Añade los ingredientes:</span>
          <span className="text-xs text-text-secondary font-medium bg-gray-100 px-3 py-1 rounded-full">
            Suma actual: {totalSum}%
          </span>
        </h5>

        {/* Input Form */}
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

          <div className="w-full sm:w-48">
            <label className="block text-sm font-bold text-text-secondary mb-1">
              Cantidad: <span className="text-primary font-black">{percentage}%</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
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

        {/* Status Alerts */}
        <div className="space-y-2 mb-6">
          {totalSum !== 100 && ingredients.length > 0 && (
            <div className="bg-brand-pink/10 border border-brand-pink/20 text-brand-pink p-3 rounded-2xl text-sm font-bold flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>Advertencia: La suma de tus ingredientes es del {totalSum}%. ¡Debe ser exactamente el 100%!</span>
              <button
                type="button"
                onClick={handleMagicalAdjust}
                className="bg-brand-pink text-white px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shadow-sm cursor-pointer hover:bg-opacity-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>¡Ajuste Mágico!</span>
              </button>
            </div>
          )}

          {!isOrderCorrect() && ingredients.length >= 2 && (
            <div className="bg-brand-yellow/10 border border-brand-yellow/30 text-heading p-3 rounded-2xl text-sm font-bold">
              <span>Advertencia: ¡Espera! Los ingredientes no están ordenados de mayor a menor. Usa las flechas (subir/bajar) para organizarlos correctamente.</span>
            </div>
          )}

          {isOrderCorrect() && totalSum === 100 && ingredients.length >= 1 && (
            <div className="bg-brand-green/10 border border-brand-green/20 text-brand-green p-3 rounded-2xl text-sm font-bold">
              <span>Listo: la receta está lista, suma 100% y los ingredientes están ordenados correctamente.</span>
            </div>
          )}
        </div>

        {/* Ingredients List */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {ingredients.length === 0 ? (
              <div className="text-center py-8 text-gray-300 font-bold border-2 border-dashed border-gray-100 rounded-3xl">
                ¿Qué lleva tu receta secreta? Agrega un ingrediente arriba.
              </div>
            ) : (
              ingredients.map((ing, index) => {
                const outOfOrder = isIndexOutOfOrder(index);
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
                        <span className="text-sm font-bold text-text-secondary">Proporción: {ing.percentage}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Navigation buttons */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveIngredient(index, "up")}
                        className="p-2 rounded-xl bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:hover:bg-gray-55"
                      >
                        <ArrowUp className="w-4 h-4 stroke-[3]" />
                      </button>
                      <button
                        type="button"
                        disabled={index === ingredients.length - 1}
                        onClick={() => moveIngredient(index, "down")}
                        className="p-2 rounded-xl bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:hover:bg-gray-55"
                      >
                        <ArrowDown className="w-4 h-4 stroke-[3]" />
                      </button>

                      {/* Remove button */}
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

