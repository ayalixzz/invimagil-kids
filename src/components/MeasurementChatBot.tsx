"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Scale } from "lucide-react";
import { UTENSILS } from "./RecipeBuilder";

/* ── Knowledge base for the chatbot ──────────────────────── */
interface BotResponse {
  keywords: string[];
  answer: string;
}

const RESPONSES: BotResponse[] = [
  {
    keywords: ["cucharita", "cucharadita", "pequeña", "postre"],
    answer: "🥄 ¡Una cucharita (de postre) equivale a unos 5 gramos! Es perfecta para medir polvitos como sal, canela o polvo para hornear.",
  },
  {
    keywords: ["cuchara", "cucharada", "grande", "sopera"],
    answer: "🥣 ¡Una cuchara grande (sopera) equivale a unos 15 gramos! Sirve para medir azúcar, miel, aceite o mantequilla derretida. Son 3 cucharitas en una cuchara grande.",
  },
  {
    keywords: ["pocillo", "tacita", "tinto", "café"],
    answer: "☕ ¡Un pocillo o tacita (de tinto) equivale a unos 60 gramos! Es 4 veces una cuchara grande. Perfecto para medir leche, jugo o harina.",
  },
  {
    keywords: ["jícara", "jicara", "chácara", "chacara", "tazón", "tazon", "mediano"],
    answer: "🍵 ¡Una jícara o chácara equivale a unos 120 gramos! Es como 2 pocillos juntos. Ideal para medir frutas picadas, arroz o cereales.",
  },
  {
    keywords: ["taza", "vaso"],
    answer: "🫙 ¡Una taza grande equivale a unos 240 gramos! Es la medida más grande. Son 2 jícaras, 4 pocillos o 16 cucharas grandes.",
  },
  {
    keywords: ["pizca", "pellizco", "poquito"],
    answer: "✨ ¡Una pizca es un pellizquito con los dedos, como 1 gramo! Se usa para sal, pimienta, especias o canela. ¡Poquito pero importante!",
  },
  {
    keywords: ["gramo", "gramos", "peso", "pesar", "balanza", "gramera", "bascula", "báscula"],
    answer: "⚖️ ¡Un gramo es la unidad de peso! Con una gramera o báscula puedes pesar exactamente. Pero aquí te enseñamos a medir con utensilios de cocina:\n\n✨ Pizca = 1g\n🥄 Cucharita = 5g\n🥣 Cuchara grande = 15g\n☕ Pocillo = 60g\n🍵 Jícara = 120g\n🫙 Taza = 240g",
  },
  {
    keywords: ["cuántas", "cuantas", "cuántos", "cuantos", "equivale", "equivalencia", "convertir", "conversión", "conversion"],
    answer: "📏 ¡Aquí van las equivalencias!\n\n1 taza 🫙 = 2 jícaras 🍵 = 4 pocillos ☕ = 16 cucharas 🥣 = 48 cucharitas 🥄 = 240 pizcas ✨\n\nO sea: cada medida grande tiene varias medidas pequeñas adentro. ¡Como las muñecas rusas! 🪆",
  },
  {
    keywords: ["harina"],
    answer: "🌾 ¡Para medir harina! Una taza de harina pesa unos 120g (es más liviana que el azúcar). Con una cuchara grande puedes medir unas 8g de harina. ¡No la aprietes en la cuchara, déjala suelta!",
  },
  {
    keywords: ["azúcar", "azucar", "dulce"],
    answer: "🍬 ¡Para medir azúcar! Una taza de azúcar pesa unos 200g. Una cuchara grande tiene unos 12g de azúcar. Una cucharita tiene unos 4g. ¡Recuerda que mucha azúcar no es buena para la salud!",
  },
  {
    keywords: ["sal"],
    answer: "🧂 ¡Para medir sal! Generalmente se usa una pizca (1g) o una cucharita (5g). ¡Poquita sal da mucho sabor! Demasiada sal no es saludable.",
  },
  {
    keywords: ["leche", "agua", "líquido", "liquido", "jugo"],
    answer: "💧 ¡Para medir líquidos! Una taza = 240ml (mililitros). Un pocillo = 60ml. Una cuchara grande = 15ml. Para los líquidos, los gramos y los mililitros son casi iguales. ¡Así que es fácil!",
  },
  {
    keywords: ["mantequilla", "margarina"],
    answer: "🧈 ¡Para medir mantequilla! Una cuchara grande de mantequilla pesa unos 14g. Una taza de mantequilla derretida pesa unos 227g. Puedes cortarla en cubitos y medirla con cucharas.",
  },
  {
    keywords: ["ayuda", "help", "qué puedo", "que puedo", "hola", "hi"],
    answer: "🤖 ¡Hola! Soy InviBot Medidor. Puedes preguntarme cosas como:\n\n• \"¿Cuántos gramos tiene una cucharita?\"\n• \"¿Cuántas cucharas hay en una taza?\"\n• \"¿Cómo mido harina?\"\n• \"¿Qué es una jícara?\"\n• \"¿Cuánto pesa una pizca de sal?\"\n\n¡Pregúntame lo que quieras sobre medidas de cocina! 🍳",
  },
  {
    keywords: ["miligramo", "miligramos", "mg"],
    answer: "🔬 ¡Un miligramo (mg) es super pequeñito! Son 1000 miligramos en 1 gramo. Una pizca de sal tiene unos 1000 mg (= 1 gramo). Es tan pequeño que necesitarías una balanza especial para medirlo. En la cocina casera usamos gramos con cucharitas y cucharas. 🥄",
  },
];

const findResponse = (input: string): string => {
  const lower = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const r of RESPONSES) {
    for (const kw of r.keywords) {
      const kwNorm = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (lower.includes(kwNorm)) return r.answer;
    }
  }
  return "🤔 ¡Hmm! No estoy seguro de esa pregunta. Intenta preguntarme sobre cucharitas, cucharas, tazas, pocillos, jícaras, gramos o ingredientes específicos como harina, azúcar o leche. ¡Escribe \"ayuda\" para ver qué puedo hacer!";
};

/* ── Chat message type ───────────────────────────────────── */
interface ChatMessage {
  id: string;
  from: "user" | "bot";
  text: string;
}

/* ── Component ───────────────────────────────────────────── */
export default function MeasurementChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      from: "bot",
      text: "👋 ¡Hola! Soy InviBot Medidor. Pregúntame cuántos gramos tiene una cucharita, una taza o cualquier utensilio de cocina. ¡Estoy aquí para ayudarte a medir tus ingredientes! 🍳",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      from: "user",
      text: input.trim(),
    };

    const botAnswer = findResponse(input);
    const botMsg: ChatMessage = {
      id: crypto.randomUUID(),
      from: "bot",
      text: botAnswer,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* ── Floating toggle button ────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-brand-green text-white shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer"
            aria-label="Abrir chat de medidas"
          >
            <div className="relative">
              <Scale className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-yellow rounded-full animate-pulse" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat window ───────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl border-2 border-border-soft shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "min(520px, calc(100vh - 3rem))" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-brand-green px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h6 className="text-white font-black text-sm">InviBot Medidor</h6>
                  <p className="text-white/70 text-[10px] font-bold">Pregúntame sobre medidas</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            {/* Quick utensil chips */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 shrink-0 overflow-x-auto">
              <div className="flex gap-1.5">
                {UTENSILS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      const userMsg: ChatMessage = { id: crypto.randomUUID(), from: "user", text: `¿Cuánto pesa ${u.label.toLowerCase()}?` };
                      const botMsg: ChatMessage = { id: crypto.randomUUID(), from: "bot", text: findResponse(u.id) };
                      setMessages((prev) => [...prev, userMsg, botMsg]);
                    }}
                    className="shrink-0 text-[10px] font-bold bg-white border border-gray-200 px-2.5 py-1 rounded-full hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {u.emoji} {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-bold whitespace-pre-line ${
                      msg.from === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-gray-100 text-heading rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-100 shrink-0 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta sobre medidas..."
                className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-border-soft focus:border-primary focus:outline-none font-bold text-heading text-sm placeholder:text-gray-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 stroke-[3]" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
