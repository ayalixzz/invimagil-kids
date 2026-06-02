"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award, ArrowLeft, ArrowRight, RefreshCw, ChefHat, Shield, Building2, ClipboardCheck, CookingPot } from "lucide-react";
import CharacterBubble from "@/components/CharacterBubble";
import LogoCreator from "@/components/LogoCreator";
import RecipeBuilder, { Ingredient } from "@/components/RecipeBuilder";
import BpmChecklist from "@/components/BpmChecklist";
import DossierFolder from "@/components/DossierFolder";
import CertificateDownload from "@/components/CertificateDownload";
import InvimagilKidsLogo from "@/components/InvimagilKidsLogo";

const FINAL_STEP = 12;

// BPM helper to extract medals
const getMedals = (ids: string[]): string[] => {
  const medals: string[] = [];
  if (ids.includes("hands") && ids.includes("utensils")) medals.push("higiene");
  if (ids.includes("hair")) medals.push("seguridad");
  if (ids.includes("table") && ids.includes("ingredients")) medals.push("calidad");
  return medals;
};

type InspectorExpression = "happy" | "thinking" | "checking" | "excited";

const getInspectorGuide = (
  step: number,
  evaluating: boolean,
  isApproved: boolean,
): { message: string; expression: InspectorExpression } => {
  if (step === 0) {
    return {
      message: "Hola, pequeño empresario. Soy InviBot, tu asistente virtual de Invimágil Kids. Hoy vamos a crear tu producto de alimentos para conseguir un Registro Sanitario Mágico.",
      expression: "excited",
    };
  }
  if (step === 1) {
    return {
      message: "Módulo 1: crea tu empresa. Elige nombre, eslogan, equipo, ciudad y lugar de fabricación. Es como armar la tarjeta de identidad de tu negocio.",
      expression: "happy",
    };
  }
  if (step === 2) {
    return {
      message: "Módulo 2: formula recetas. Define tu producto estrella, sus sabores derivados y el riesgo sanitario según cómo debe cuidarse.",
      expression: "happy",
    };
  }
  if (step === 3) {
    return {
      message: "Llegamos a la cocina. Escribe los ingredientes con porcentaje y ordenalos de mayor a menor.",
      expression: "thinking",
    };
  }
  if (step === 4) {
    return {
      message: "Cuentame los pasos de preparacion. Un buen producto tambien necesita instrucciones claras.",
      expression: "happy",
    };
  }
  if (step === 5) {
    return {
      message: "Ahora describe tu producto con los sentidos: sabor, olor, color y textura. En INVIMA esto se llama análisis organoléptico.",
      expression: "thinking",
    };
  }
  if (step === 6) {
    return {
      message: "Elige el empaque y cómo se debe guardar tu producto: nevera, congelador, temperatura ambiente o lejos del sol.",
      expression: "checking",
    };
  }
  if (step === 7) {
    return {
      message: "Módulo 3: normas BPM. Manos limpias, mesa limpia y utensilios limpios hacen un producto más seguro.",
      expression: "checking",
    };
  }
  if (step === 8) {
    return {
      message: "Tu producto necesita una etiqueta. Revisa que tenga nombre, empresa, ingredientes, contenido, vencimiento, almacenamiento, ciudad y advertencias.",
      expression: "thinking",
    };
  }
  if (step === 9) {
    return {
      message: "Revisa tu carpeta de registro. Si todo esta listo, la enviamos al laboratorio de evaluacion.",
      expression: "checking",
    };
  }
  if (step === 10 && evaluating) {
    return {
      message: "Analizando ingredientes, higiene y orden de la receta. Dame un momento mientras reviso tu expediente.",
      expression: "checking",
    };
  }
  if (step === 10 && isApproved) {
    return {
      message: "Fantástico. Tu producto fue aprobado por Invimágil Kids.",
      expression: "excited",
    };
  }
  if (step === 10) {
    return {
      message: "Detecte algunos detalles para corregir. Revisa las observaciones y lo intentamos otra vez.",
      expression: "thinking",
    };
  }
  if (step === 11) {
    return {
      message: "Aquí está tu Registro Sanitario Mágico. Por ahora puedes imprimir el diploma; el PDF queda para la siguiente fase.",
      expression: "excited",
    };
  }
  return {
    message: "Llegamos a la ceremonia final. Completaste el camino de emprendedor alimentario.",
    expression: "excited",
  };
};

export default function PlayPage() {
  // Navigation State
  // 0: Welcome, 1: Company, 2: Product, 3: Ingredients, 4: Recipe Steps, 5: BPM, 6: Dossier, 7: Submission/Analysis, 8: Certificate/Diploma, 9: Ceremonia
  const [step, setStep] = useState(0);

  // Phase 1: Company details
  const [companyName, setCompanyName] = useState("");
  const [companySlogan, setCompanySlogan] = useState("");
  const [companyMembers, setCompanyMembers] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [factoryPlace, setFactoryPlace] = useState("");
  const [logoIcon, setLogoIcon] = useState("cookie");
  const [logoColor, setLogoColor] = useState("#0091B3");

  // Phase 2: Product details
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("solido"); // solido, liquido
  const [eatOrDrink, setEatOrDrink] = useState("comer"); // comer, tomar
  const [packagingType, setPackagingType] = useState("bolsa"); // bolsa, caja, botella, frasco
  const [flavor, setFlavor] = useState("");
  const [productDerivatives, setProductDerivatives] = useState("");
  const [riskLevel, setRiskLevel] = useState("bajo");

  // Phase 3: Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientsValid, setIngredientsValid] = useState(false);

  // Phase 4: Recipe details
  const [recipeStepInput, setRecipeStepInput] = useState("");
  const [recipeSteps, setRecipeSteps] = useState<string[]>([]);
  const [prepTime, setPrepTime] = useState("20 minutos");
  const [sensoryFlavor, setSensoryFlavor] = useState("");
  const [sensorySmell, setSensorySmell] = useState("");
  const [sensoryColor, setSensoryColor] = useState("");
  const [sensoryTexture, setSensoryTexture] = useState("");
  const [storageCondition, setStorageCondition] = useState("ambiente");
  const [shelfLifeDays, setShelfLifeDays] = useState("");
  const [allergenWarning, setAllergenWarning] = useState("");
  const [labelCheckedIds, setLabelCheckedIds] = useState<string[]>([]);

  // Phase 5: BPM
  const [bpmCheckedIds, setBpmCheckedIds] = useState<string[]>([]);

  // Submitting / Processing State
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [notice, setNotice] = useState("");

  // Final Results
  const [registrationNumber, setRegistrationNumber] = useState("RSM-2026-KIDS-0001");
  const [points, setPoints] = useState(0);
  const [levelReached, setLevelReached] = useState("Novato");

  const bpmScore = bpmCheckedIds.length * 20;
  const medalsEarned = getMedals(bpmCheckedIds);
  const { message: inspectorMessage, expression: inspectorExpression } = getInspectorGuide(step, evaluating, isApproved);

  const showNotice = (message: string) => {
    setNotice(message);
  };

  const advanceTo = (nextStep: number) => {
    setNotice("");
    setStep(nextStep);
  };

  // Handle navigation validations
  const handleNext = async () => {
    if (step === 0) {
      advanceTo(1);
    } else if (step === 1) {
      if (!companyName.trim()) {
        showNotice("Escribe el nombre de tu empresa para continuar.");
        return;
      }
      if (!companyCity.trim() || !factoryPlace.trim()) {
        showNotice("Agrega la ciudad y el lugar donde fabricarás tu producto.");
        return;
      }
      advanceTo(2);
    } else if (step === 2) {
      if (!productName.trim()) {
        showNotice("Escribe el nombre de tu producto estrella para continuar.");
        return;
      }
      advanceTo(3);
    } else if (step === 3) {
      if (ingredients.length === 0) {
        showNotice("Agrega al menos un ingrediente a tu receta.");
        return;
      }
      if (!ingredientsValid) {
        showNotice("La receta debe sumar exactamente 100% y estar ordenada de mayor a menor.");
        return;
      }
      advanceTo(4);
    } else if (step === 4) {
      if (recipeSteps.length === 0) {
        showNotice("Escribe al menos un paso de preparación.");
        return;
      }
      advanceTo(5);
    } else if (step === 5) {
      if (!sensoryFlavor.trim() || !sensorySmell.trim() || !sensoryColor.trim() || !sensoryTexture.trim()) {
        showNotice("Completa sabor, olor, color y textura para el análisis organoléptico.");
        return;
      }
      advanceTo(6);
    } else if (step === 6) {
      if (!shelfLifeDays.trim()) {
        showNotice("Indica cuántos días dura tu producto antes de vencer.");
        return;
      }
      advanceTo(7);
    } else if (step === 7) {
      advanceTo(8);
    } else if (step === 8) {
      if (labelCheckedIds.length < 8) {
        showNotice("Marca todos los datos obligatorios de la etiqueta antes de revisar el expediente.");
        return;
      }
      advanceTo(9);
    } else if (step === 9) {
      // Start Submit / Evaluation
      advanceTo(10);
      setEvaluating(true);
      
      try {
        const res = await fetch("/api/inspector", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: { name: companyName, slogan: companySlogan, members: companyMembers, city: companyCity, factoryPlace, logoIcon, logoColor },
            product: { name: productName, type: productType, eatOrDrink, packaging: packagingType, flavor, derivatives: productDerivatives, riskLevel, storageCondition, shelfLifeDays, allergenWarning, ingredients, recipeSteps },
            bpmScore: bpmScore
          })
        });
        const data = await res.json();
        
        // Wait 3 seconds to show magical evaluation simulation
        setTimeout(async () => {
          setEvaluating(false);
          setIsApproved(data.approved);
          setEvaluationFeedback(data.feedback);

          if (data.approved) {
            // Save to PostgreSQL backend
            const saveRes = await fetch("/api/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                company: { name: companyName, slogan: companySlogan, members: companyMembers, city: companyCity, factoryPlace, logoIcon, logoColor },
                product: { name: productName, type: productType, eatOrDrink, packaging: packagingType, flavor, derivatives: productDerivatives, riskLevel, storageCondition, shelfLifeDays, allergenWarning, ingredients, recipeSteps },
                bpmScore: bpmScore,
                levelReached: getScoreLevel(bpmScore, ingredients.length),
                score: bpmScore + 50 // base bonus points
              })
            });
            const saveData = await saveRes.json();
            setRegistrationNumber(saveData.registrationNo);
            setPoints(bpmScore + 50);
            setLevelReached(getScoreLevel(bpmScore, ingredients.length));
          }
        }, 3000);

      } catch (error) {
        console.error("Error evaluating recipe:", error);
        setEvaluating(false);
        setIsApproved(false);
        setEvaluationFeedback(["Hubo un pequeño problema de conexión con el laboratorio. ¡Inténtalo de nuevo!"]);
      }
    } else if (step === 10) {
      if (isApproved) {
        advanceTo(11);
      } else {
        // Go back to the step that needs correction
        // If BPM not checked, go to step 5. If ingredients out of order, go to step 3.
        let outOfOrder = false;
        for (let i = 0; i < ingredients.length - 1; i++) {
          if (ingredients[i].percentage < ingredients[i + 1].percentage) outOfOrder = true;
        }
        const totalPct = ingredients.reduce((s, ing) => s + ing.percentage, 0);

        if (totalPct !== 100 || outOfOrder) {
          advanceTo(3);
        } else if (bpmScore < 100) {
          advanceTo(7);
        } else {
          advanceTo(1); // default fallback
        }
      }
    } else if (step === 11) {
      advanceTo(12);
    }
  };

  const handleBack = () => {
    if (step > 0) advanceTo(step - 1);
  };

  const getScoreLevel = (bpm: number, ingCount: number) => {
    const total = bpm + (ingCount * 10);
    if (total >= 140) return "Súper Chef de Calidad";
    if (total >= 100) return "Emprendedor Estrella Estrella";
    return "Mini Creador de Alimentos";
  };

  const addRecipeStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeStepInput.trim()) return;
    setRecipeSteps([...recipeSteps, recipeStepInput.trim()]);
    setRecipeStepInput("");
  };

  const removeRecipeStep = (index: number) => {
    setRecipeSteps(recipeSteps.filter((_, idx) => idx !== index));
  };

  const resetGame = () => {
    setStep(0);
    setCompanyName("");
    setCompanySlogan("");
    setCompanyMembers("");
    setCompanyCity("");
    setFactoryPlace("");
    setLogoIcon("cookie");
    setLogoColor("#0091B3");
    setProductName("");
    setProductType("solido");
    setEatOrDrink("comer");
    setPackagingType("bolsa");
    setFlavor("");
    setProductDerivatives("");
    setRiskLevel("bajo");
    setIngredients([]);
    setIngredientsValid(false);
    setRecipeSteps([]);
    setSensoryFlavor("");
    setSensorySmell("");
    setSensoryColor("");
    setSensoryTexture("");
    setStorageCondition("ambiente");
    setShelfLifeDays("");
    setAllergenWarning("");
    setLabelCheckedIds([]);
    setBpmCheckedIds([]);
    setIsApproved(false);
    setNotice("");
  };

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen">
      <header className="w-full bg-white border-b-2 border-border-soft py-4 px-4 shadow-xs select-none print:hidden">
        <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <InvimagilKidsLogo height={56} />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-text-secondary">
              Simulador de Registro Sanitario de Alimentos
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Wrap */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-10 flex flex-col justify-between">
      
      {/* Top Header & Progress Bar */}
      {step > 0 && (
        <header className="mb-6 space-y-3 print:hidden">
          <div className="flex justify-between items-center text-heading font-black">
            <span className="flex items-center gap-1 bg-white px-4 py-2 rounded-full border-2 border-border-soft text-sm">
              {companyName || "Mi Empresa"}
            </span>
            <span className="text-sm bg-white px-4 py-2 rounded-full border-2 border-border-soft flex items-center gap-1.5 text-brand-yellow">
              <Trophy className="w-4 h-4 fill-brand-yellow" />
              <span>{bpmScore} Puntos</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-text-secondary font-black">
              <span>Fase {step} de {FINAL_STEP}: {
                step === 1 ? "Crea tu Empresa" :
                step === 2 ? "Producto y Riesgo Sanitario" :
                step === 3 ? "La Receta Secreta" :
                step === 4 ? "Instrucciones de Cocina" :
                step === 5 ? "Análisis Organoléptico" :
                step === 6 ? "Empaque y Almacenamiento" :
                step === 7 ? "Reglas de Higiene (BPM)" :
                step === 8 ? "Etiqueta del Producto" :
                step === 9 ? "Revisión de Carpeta" :
                step === 10 ? "Evaluación del INVIMA" :
                step === 11 ? "Registro Sanitario Mágico" : "Ceremonia Final"
              }</span>
              <span>{Math.round((step / FINAL_STEP) * 100)}% Completado</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-brand-green"
                initial={{ width: 0 }}
                animate={{ width: `${(step / FINAL_STEP) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </header>
      )}

      {/* Main Guidance Bubble of InviBot */}
      <CharacterBubble message={inspectorMessage} expression={inspectorExpression} />

      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto w-full bg-brand-yellow/20 border-2 border-brand-yellow text-heading px-5 py-3 rounded-2xl font-extrabold text-sm text-center print:hidden"
        >
          {notice}
        </motion.div>
      )}

      {/* Main Wizard Area */}
      <main className="flex-1 my-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {/* STEP 0: Welcome Landing */}
            {step === 0 && (
              <div className="text-center space-y-8 py-10 max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <InvimagilKidsLogo height={96} />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-heading leading-tight mt-2">
                    Simulador de <span className="text-primary">Registro Sanitario</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-text-secondary font-bold">
                    ¡El simulador de registro de alimentos más divertido! Aprende a emprender e higiene alimentaria jugando.
                  </p>
                </motion.div>

                <div className="flex justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                      <Building2 className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-black text-heading mt-2">Crea tu Empresa</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-brand-yellow/20 rounded-2xl flex items-center justify-center text-heading shadow-sm">
                      <CookingPot className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-black text-heading mt-2">Formula Recetas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-brand-green/15 rounded-2xl flex items-center justify-center text-brand-green shadow-sm">
                      <ClipboardCheck className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-black text-heading mt-2">Normas BPM</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0] }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary-hover text-white text-xl font-black px-12 py-5 rounded-full shadow-lg hover:shadow-xl cursor-pointer transition-all"
                >
                  ¡Iniciar Aventura!
                </motion.button>
              </div>
            )}

            {/* STEP 1: Company details */}
            {step === 1 && (
              <div className="kid-card-outer">
                <div className="kid-card-inner space-y-6">
                  <h3 className="text-2xl font-black text-heading border-b-4 border-dashed border-border-soft pb-2">
                    Fase 1: Crea tu Empresa
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">
                          ¿Cómo se llamará tu fábrica de alimentos?
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Ej. Dulce Aventura, Super Jugos"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">
                          ¿Cuál es tu slogan (lema de la empresa)?
                        </label>
                        <input
                          type="text"
                          value={companySlogan}
                          onChange={(e) => setCompanySlogan(e.target.value)}
                          placeholder="Ej. Sabores que hacen sonreír"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">
                          Integrantes de tu equipo:
                        </label>
                        <input
                          type="text"
                          value={companyMembers}
                          onChange={(e) => setCompanyMembers(e.target.value)}
                          placeholder="Ej. Martín y su mamá, o yo solo"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-bold text-text-secondary mb-1">
                            Ciudad de fabricación:
                          </label>
                          <input
                            type="text"
                            value={companyCity}
                            onChange={(e) => setCompanyCity(e.target.value)}
                            placeholder="Ej. Bogotá, Cali, Medellín"
                            className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-text-secondary mb-1">
                            Lugar de fabricación:
                          </label>
                          <input
                            type="text"
                            value={factoryPlace}
                            onChange={(e) => setFactoryPlace(e.target.value)}
                            placeholder="Ej. Cocina del colegio"
                            className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                          />
                        </div>
                      </div>
                    </div>

                    <LogoCreator
                      companyName={companyName}
                      selectedIcon={logoIcon}
                      selectedColor={logoColor}
                      onChangeIcon={setLogoIcon}
                      onChangeColor={setLogoColor}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Product details */}
            {step === 2 && (
              <div className="kid-card-outer">
                <div className="kid-card-inner space-y-6">
                  <h3 className="text-2xl font-black text-heading border-b-4 border-dashed border-border-soft pb-2">
                    Fase 2: Tu Producto Estrella
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">
                          ¿Cómo se llama tu producto estrella?
                        </label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="Ej. Galletas Estelares, Chocobombas"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-text-secondary mb-1">
                            ¿Es sólido o líquido?
                          </label>
                          <select
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                          >
                            <option value="solido">Sólido</option>
                            <option value="liquido">Líquido</option>
                            <option value="semisolido">Semisólido</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-text-secondary mb-1">
                            ¿Comer o Tomar?
                          </label>
                          <select
                            value={eatOrDrink}
                            onChange={(e) => setEatOrDrink(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                          >
                            <option value="comer">Para Comer</option>
                            <option value="tomar">Para Tomar</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">
                          ¿Cuál es su empaque principal?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["bolsa", "caja", "botella", "frasco"].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setPackagingType(item)}
                              className={`py-3 rounded-2xl font-bold border-2 transition-all capitalize text-sm ${
                                packagingType === item
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-gray-200 bg-white text-text-secondary"
                              }`}
                            >
                              {item === "bolsa" ? " Bolsa" :
                               item === "caja" ? " Caja" :
                               item === "botella" ? " Botella" : " Frasco"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">
                          ¿Qué sabor tiene?
                        </label>
                        <input
                          type="text"
                          value={flavor}
                          onChange={(e) => setFlavor(e.target.value)}
                          placeholder="Ej. Fresa y Vainilla, Chocolate doble"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">
                          Productos derivados o sabores:
                        </label>
                        <textarea
                          value={productDerivatives}
                          onChange={(e) => setProductDerivatives(e.target.value)}
                          placeholder="Ej. Fresa, vainilla, chocolate; tamaño mini y familiar"
                          rows={3}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2">
                          Clasificación de riesgo sanitario:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            { id: "bajo", label: "Bajo", text: "Secos, harinas, confites" },
                            { id: "mediano", label: "Mediano", text: "Horneados, mermeladas" },
                            { id: "alto", label: "Alto", text: "Lácteos, carnes, jugos" },
                          ].map((risk) => (
                            <button
                              key={risk.id}
                              type="button"
                              onClick={() => setRiskLevel(risk.id)}
                              className={`rounded-2xl border-2 p-3 text-left transition-all ${
                                riskLevel === risk.id
                                  ? "border-primary bg-primary/10 text-heading"
                                  : "border-gray-200 bg-white text-text-secondary"
                              }`}
                            >
                              <span className="block text-sm font-black">{risk.label}</span>
                              <span className="block text-[11px] font-bold leading-snug mt-1">{risk.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-primary/5 p-6 rounded-3xl border border-primary/10 shadow-inner">
                      <div className="w-20 h-20 rounded-3xl bg-white border border-border-soft flex items-center justify-center text-primary mb-4 shadow-sm">
                        <CookingPot className="w-10 h-10 stroke-[2.5]" />
                      </div>
                      <span className="text-2xl font-black text-heading">{productName || "Mi Producto"}</span>
                      <p className="text-sm font-bold text-text-secondary mt-1 text-center max-w-xs">
                        Producto de riesgo <span className="text-primary font-black uppercase">{riskLevel}</span>, con sabor a <span className="text-brand-pink font-black">{flavor || "sabores mágicos"}</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Ingredients Formulation */}
            {step === 3 && (
              <div className="kid-card-outer">
                <div className="kid-card-inner space-y-4">
                  <h3 className="text-2xl font-black text-heading border-b-4 border-dashed border-border-soft pb-2">
                    Fase 3: La Receta Secreta
                  </h3>
                  <RecipeBuilder
                    ingredients={ingredients}
                    onChangeIngredients={setIngredients}
                    onValidationChange={setIngredientsValid}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Cooking instructions */}
            {step === 4 && (
              <div className="kid-card-outer">
                <div className="kid-card-inner space-y-6">
                  <h3 className="text-2xl font-black text-heading border-b-4 border-dashed border-border-soft pb-2">
                    Fase 4: Receta e Instrucciones de Cocina
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <form onSubmit={addRecipeStep} className="space-y-2">
                        <label className="block text-sm font-bold text-text-secondary">
                          Añade un paso de elaboración:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={recipeStepInput}
                            onChange={(e) => setRecipeStepInput(e.target.value)}
                            placeholder="Ej. Mezclar la harina con la leche"
                            className="flex-1 px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                          />
                          <button
                            type="submit"
                            className="bg-primary hover:bg-primary-hover text-white px-5 rounded-2xl font-black cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </form>

                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">
                          ¿Cuánto tiempo tardas en prepararlo?
                        </label>
                        <input
                          type="text"
                          value={prepTime}
                          onChange={(e) => setPrepTime(e.target.value)}
                          placeholder="Ej. 15 minutos, 1 hora"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                        />
                      </div>
                    </div>

                    <div className="bg-[#F6F9FB] p-5 rounded-3xl border border-gray-150 shadow-inner space-y-3 max-h-[300px] overflow-y-auto">
                      <h5 className="font-extrabold text-heading">Pasos registrados:</h5>
                      {recipeSteps.length === 0 ? (
                        <p className="text-xs text-gray-400 font-bold text-center py-8">
                          ¡No has agregado pasos de preparación aún! Escríbelos a la izquierda.
                        </p>
                      ) : (
                        <ol className="list-decimal pl-5 space-y-2 text-sm font-bold text-text-secondary">
                          {recipeSteps.map((stepItem, index) => (
                            <li key={index} className="relative group">
                              <span className="pr-8 block">{stepItem}</span>
                              <button
                                type="button"
                                onClick={() => removeRecipeStep(index)}
                                className="absolute right-0 top-0 text-brand-pink text-xs hover:underline cursor-pointer"
                              >
                                Quitar
                              </button>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Organoleptic analysis */}
            {step === 5 && (
              <div className="kid-card-outer">
                <div className="kid-card-inner space-y-6">
                  <h3 className="text-2xl font-black text-heading border-b-4 border-dashed border-border-soft pb-2">
                    Fase 5: Análisis Organoléptico
                  </h3>
                  <p className="text-sm font-bold text-text-secondary">
                    Describe tu producto con los sentidos. Esto ayuda a entender cómo se verá, olerá y se sentirá cuando alguien lo pruebe.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Sabor", value: sensoryFlavor, setter: setSensoryFlavor, placeholder: "Dulce, salado, ácido..." },
                      { label: "Olor", value: sensorySmell, setter: setSensorySmell, placeholder: "A vainilla, fruta, chocolate..." },
                      { label: "Color", value: sensoryColor, setter: setSensoryColor, placeholder: "Rojo fresa, amarillo mango..." },
                      { label: "Textura", value: sensoryTexture, setter: setSensoryTexture, placeholder: "Crujiente, cremoso, suave..." },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-sm font-bold text-text-secondary mb-1">{field.label}</label>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Packaging and storage */}
            {step === 6 && (
              <div className="kid-card-outer">
                <div className="kid-card-inner space-y-6">
                  <h3 className="text-2xl font-black text-heading border-b-4 border-dashed border-border-soft pb-2">
                    Fase 6: Empaque y Almacenamiento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2">Tipo de empaque:</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["bolsa", "caja", "frasco", "botella", "biodegradable", "vaso"].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setPackagingType(item)}
                              className={`rounded-2xl border-2 p-3 text-sm font-black capitalize transition-all ${
                                packagingType === item ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-white text-text-secondary"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2">Condición de almacenamiento:</label>
                        <select
                          value={storageCondition}
                          onChange={(e) => setStorageCondition(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                        >
                          <option value="nevera">En nevera (0-4°C)</option>
                          <option value="congelador">En congelador (-18°C)</option>
                          <option value="ambiente">A temperatura ambiente</option>
                          <option value="sin-sol">Lejos de la luz del sol</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4 bg-primary/5 border border-primary/10 rounded-3xl p-5">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">¿Cuántos días dura?</label>
                        <input
                          type="text"
                          value={shelfLifeDays}
                          onChange={(e) => setShelfLifeDays(e.target.value)}
                          placeholder="Ej. 5 días, 2 semanas, 1 mes"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">Advertencias o alérgenos:</label>
                        <textarea
                          value={allergenWarning}
                          onChange={(e) => setAllergenWarning(e.target.value)}
                          placeholder="Ej. Contiene leche, gluten o nueces"
                          rows={4}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: BPM Checklist */}
            {step === 7 && (
              <div className="kid-card-outer">
                <div className="kid-card-inner space-y-4">
                  <h3 className="text-2xl font-black text-heading border-b-4 border-dashed border-border-soft pb-2">
                    Fase 7: Buenas Prácticas de Manufactura (BPM)
                  </h3>
                  <BpmChecklist
                    checkedIds={bpmCheckedIds}
                    onToggleItem={(id) => {
                      if (bpmCheckedIds.includes(id)) {
                        setBpmCheckedIds(bpmCheckedIds.filter((x) => x !== id));
                      } else {
                        setBpmCheckedIds([...bpmCheckedIds, id]);
                      }
                    }}
                    medalsEarned={medalsEarned}
                  />
                </div>
              </div>
            )}

            {/* STEP 8: Label checklist */}
            {step === 8 && (
              <div className="kid-card-outer">
                <div className="kid-card-inner space-y-6">
                  <h3 className="text-2xl font-black text-heading border-b-4 border-dashed border-border-soft pb-2">
                    Fase 8: Etiqueta del Producto
                  </h3>
                  <p className="text-sm font-bold text-text-secondary">
                    Según la Resolución 719 de 2015, tu etiqueta debe reunir estos datos básicos.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      ["product", "Nombre del producto"],
                      ["company", "Nombre de la empresa"],
                      ["ingredients", "Ingredientes de mayor a menor"],
                      ["net", "Contenido neto"],
                      ["date", "Fecha de vencimiento"],
                      ["storage", "Condiciones de almacenamiento"],
                      ["city", "Ciudad de fabricación"],
                      ["warnings", "Advertencias o alérgenos"],
                    ].map(([id, label]) => {
                      const checked = labelCheckedIds.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setLabelCheckedIds(checked ? labelCheckedIds.filter((x) => x !== id) : [...labelCheckedIds, id]);
                          }}
                          className={`rounded-2xl border-2 p-4 text-left font-black transition-all ${
                            checked ? "border-brand-green bg-brand-green/10 text-heading" : "border-border-soft bg-white text-text-secondary"
                          }`}
                        >
                          {checked ? "✓ " : ""}{label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Dossier preview */}
            {step === 9 && (
              <div className="space-y-4">
                <DossierFolder
                  company={{ name: companyName, slogan: companySlogan, members: companyMembers, city: companyCity, factoryPlace, logoIcon, logoColor }}
                  product={{ name: productName, type: productType, eatOrDrink, packaging: packagingType, flavor, derivatives: productDerivatives, riskLevel, storageCondition, shelfLifeDays, allergenWarning, ingredients, recipeSteps, sensory: { flavor: sensoryFlavor, smell: sensorySmell, color: sensoryColor, texture: sensoryTexture } }}
                  bpmScore={bpmScore}
                  medalsEarned={medalsEarned}
                />
              </div>
            )}

            {/* STEP 10: Submitting / Evaluating Animation */}
            {step === 10 && (
              <div className="kid-card-outer">
                <div className="kid-card-inner flex flex-col items-center justify-center py-12 text-center space-y-6">
                  {evaluating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="text-primary"
                      >
                        <RefreshCw className="w-20 h-20 stroke-[3]" />
                      </motion.div>
                      <h4 className="text-2xl font-black text-heading">
                        Sometiendo expediente a Invimágil Kids... 
                      </h4>
                      <p className="text-sm font-bold text-text-secondary max-w-sm">
                        InviBot está revisando ingredientes, receta e higiene para evaluar la seguridad de tu producto.
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-6xl">{isApproved ? "" : "Advertencia:"}</span>
                      <h4 className="text-3xl font-black text-heading">
                        {isApproved ? "¡APROBADO POR INVIMÁGIL KIDS!" : "Observaciones de InviBot"}
                      </h4>
                      <div className="bg-[#F6F9FB] p-5 rounded-3xl border border-gray-100 max-w-lg text-left space-y-2">
                        {evaluationFeedback.map((fb, idx) => (
                          <p key={idx} className="text-sm font-bold text-text-secondary leading-relaxed">
                            {fb}
                          </p>
                        ))}
                      </div>

                      {!isApproved && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleNext}
                          className="bg-brand-pink hover:bg-opacity-95 text-white font-black px-8 py-3.5 rounded-full shadow-md cursor-pointer"
                        >
                          Ir a corregir
                        </motion.button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* STEP 11: Certificate/PDF display */}
            {step === 11 && (
              <div className="space-y-4">
                <CertificateDownload
                  companyName={companyName}
                  productName={productName}
                  registrationNumber={registrationNumber}
                  score={points}
                  level={levelReached}
                  riskLevel={riskLevel}
                  shelfLifeDays={shelfLifeDays}
                />
              </div>
            )}

            {/* STEP 12: Ceremonia Emprendedor Infantil */}
            {step === 12 && (
              <div className="kid-card-outer max-w-xl mx-auto">
                <div className="kid-card-inner text-center space-y-6 py-8">
                  <span className="text-5xl"></span>
                  <h3 className="text-3xl font-black text-heading">
                    ¡Felicidades Súper Emprendedor!
                  </h3>
                  
                  <div className="space-y-4 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 max-w-sm mx-auto">
                    <p className="text-sm font-bold text-text-secondary">
                      Has completado el proceso de obtención de tu Registro Sanitario simulado. Aquí tienes tus recompensas finales:
                    </p>

                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-brand-yellow fill-brand-yellow" />
                        <span className="text-sm font-black text-heading">Puntaje Final: {points} pts</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ChefHat className="w-6 h-6 text-primary" />
                        <span className="text-sm font-black text-heading">Nivel: {levelReached}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-brand-green" />
                        <span className="text-sm font-black text-heading">Insignia: Inspector de Calidad</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="bg-primary hover:bg-primary-hover text-white font-black px-10 py-4 rounded-full shadow-md cursor-pointer text-lg"
                  >
                    ¡Jugar otra vez!
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation Buttons */}
      {step > 0 && step !== 10 && step !== 12 && (
        <footer className="mt-8 flex justify-between items-center print:hidden">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 bg-white hover:bg-gray-50 border-2 border-border-soft text-heading font-black px-6 py-3.5 rounded-full cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Atrás</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 bg-primary hover:bg-primary-hover text-white font-black px-8 py-3.5 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <span>{
              step === 1 ? "¡Guardar Empresa!" :
              step === 2 ? "¡Guardar Producto!" :
              step === 3 ? "¡Guardar Receta!" :
              step === 4 ? "¡Guardar Cocina!" :
              step === 5 ? "¡Guardar Sentidos!" :
              step === 6 ? "¡Guardar Almacenamiento!" :
              step === 7 ? "¡Revisar Etiqueta!" :
              step === 8 ? "¡Revisar Carpeta!" :
              step === 9 ? "¡Someter al INVIMA!" : "Siguiente"
            }</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </footer>
      )}

      {/* Quick correction step 10 button */}
      {step === 10 && !evaluating && !isApproved && (
        <footer className="mt-8 flex justify-center print:hidden">
          <button
            type="button"
            onClick={handleNext}
            className="bg-brand-pink hover:bg-opacity-95 text-white font-black px-10 py-4 rounded-full shadow-md cursor-pointer"
          >
            <span>Corregir mi proyecto</span>
          </button>
        </footer>
      )}

      {/* Step 11 navigation to ceremony */}
      {step === 11 && (
        <footer className="mt-8 flex justify-end print:hidden">
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-black px-10 py-4 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <span>Ir a la Ceremonia Final</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </footer>
      )}
    </div>
  </div>
  );
}



