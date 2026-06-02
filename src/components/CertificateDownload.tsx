"use client";

import React, { useState } from "react";
import { Award, Download, Printer, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import InvimagilKidsLogo from "@/components/InvimagilKidsLogo";

interface CertificateDownloadProps {
  companyName: string;
  productName: string;
  registrationNumber: string;
  score: number;
  level: string;
  riskLevel: string;
  shelfLifeDays: string;
  city?: string;
  packaging?: string;
  medalsEarned?: string[];
}

export default function CertificateDownload({
  companyName,
  productName,
  registrationNumber,
  score,
  level,
  riskLevel,
  shelfLifeDays,
  city = "",
  packaging = "",
  medalsEarned = [],
}: CertificateDownloadProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  const formattedDate = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    setPdfError("");
    try {
      // Dynamic import to avoid SSR issues — @react-pdf/renderer is browser-only
      const [{ pdf }, { default: CertificatePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/CertificatePDF"),
      ]);

      const doc = (
        <CertificatePDF
          companyName={companyName || "Mi Empresa"}
          productName={productName || "Mi Producto"}
          registrationNumber={registrationNumber}
          score={score}
          level={level}
          date={formattedDate}
          riskLevel={riskLevel}
          shelfLifeDays={shelfLifeDays}
          city={city}
          packaging={packaging}
          medalsEarned={medalsEarned}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Registro_Sanitario_${(companyName || "empresa").replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setPdfError("No se pudo generar el PDF. Intenta imprimir el certificado.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-8 print:p-0">
      <div className="bg-white p-8 rounded-[2rem] border-8 border-double border-border-soft shadow-xl text-center max-w-4xl mx-auto select-none relative overflow-hidden print:border-none print:shadow-none print:bg-white">
        <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center pointer-events-none">
          <Award className="w-96 h-96 text-heading" />
        </div>

        <div className="border-2 border-primary rounded-2xl p-6 sm:p-10 relative">
          <div className="flex justify-center mb-6">
            <InvimagilKidsLogo height={64} />
          </div>

          <motion.span
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-brand-yellow text-3xl block mb-2"
          >
            ★
          </motion.span>

          <h2 className="text-3xl sm:text-4xl font-black text-heading uppercase tracking-wide mb-1">
            Certificado de Registro Sanitario
          </h2>
          <span className="text-xs uppercase font-black tracking-[0.25em] text-brand-pink bg-brand-pink/10 px-4 py-1 rounded-full border border-brand-pink/20">
            Invimagil Kids Colombia
          </span>

          <p className="text-base text-text-secondary font-bold mt-8 max-w-lg mx-auto">
            El presente documento certifica que la empresa de alimentos imaginaria
          </p>

          <h3 className="text-2xl sm:text-3xl font-black text-primary my-3">
            {companyName || "Dulce Aventura"}
          </h3>

          <p className="text-sm text-text-secondary font-bold max-w-md mx-auto">
            formuló exitosamente su producto estrella y superó las pruebas de higiene,
            Buenas Prácticas de Manufactura y calidad.
          </p>

          <div className="my-6 bg-brand-green/10 border-4 border-dashed border-brand-green p-4 rounded-3xl max-w-md mx-auto shadow-sm glow-primary">
            <h4 className="text-xl sm:text-2xl font-black text-heading">
              {productName || "Galletas Estelares"}
            </h4>
            <span className="text-xs font-black text-primary block mt-1 tracking-widest uppercase">
              Registro Sanitario No. {registrationNumber}
            </span>
          </div>

          <p className="text-xs text-text-secondary font-bold">
            Puntaje final: <span className="text-brand-green font-black">{score} puntos</span> | Nivel:{" "}
            <span className="text-brand-yellow font-black bg-heading px-3 py-1 rounded-full">{level}</span>
          </p>

          {/* Details Grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto text-xs font-black text-heading">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3">
              Riesgo: <span className="uppercase text-primary block">{riskLevel || "bajo"}</span>
            </div>
            <div className="bg-brand-green/10 border border-brand-green/20 rounded-2xl p-3">
              Vida útil: <span className="text-brand-green block">{shelfLifeDays || "definida"}</span>
            </div>
            <div className="bg-brand-yellow/15 border border-brand-yellow/30 rounded-2xl p-3">
              Válido: <span className="text-heading block">5 años</span>
            </div>
            <div className="bg-brand-pink/10 border border-brand-pink/20 rounded-2xl p-3">
              Empaque: <span className="text-brand-pink block capitalize">{packaging || "definido"}</span>
            </div>
            <div className="bg-gov-blue/10 border border-gov-blue/20 rounded-2xl p-3">
              Ciudad: <span className="text-gov-blue block">{city || "Colombia"}</span>
            </div>
          </div>

          {/* Medals */}
          {medalsEarned.length > 0 && (
            <div className="mt-5 flex justify-center gap-4 flex-wrap">
              {medalsEarned.includes("higiene") && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-green/20 border-2 border-brand-green flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-brand-green" />
                  </div>
                  <span className="text-[9px] font-black text-brand-green mt-1 uppercase">Higiene</span>
                </motion.div>
              )}
              {medalsEarned.includes("seguridad") && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <span className="text-[9px] font-black text-primary mt-1 uppercase">Seguridad</span>
                </motion.div>
              )}
              {medalsEarned.includes("calidad") && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-yellow/20 border-2 border-brand-yellow flex items-center justify-center">
                    <span className="text-xl">❤️</span>
                  </div>
                  <span className="text-[9px] font-black text-heading mt-1 uppercase">Calidad</span>
                </motion.div>
              )}
            </div>
          )}

          <p className="text-[11px] text-text-secondary font-bold mt-4">
            Resolución aplicada: 719 de 2015. Certificado educativo y simulado para aprender jugando.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mt-10">
            {/* Holographic Seal */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  rotate: [0, 3, -3, 0],
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 10px rgba(255,200,0,0.3)",
                    "0 0 20px rgba(0,145,179,0.4)",
                    "0 0 10px rgba(139,197,63,0.3)",
                    "0 0 10px rgba(255,200,0,0.3)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-yellow/20 via-primary/10 to-brand-green/20 border-4 border-dashed border-brand-yellow flex flex-col items-center justify-center"
              >
                <span className="text-xs uppercase leading-none font-black text-heading">100%</span>
                <span className="text-[7px] uppercase tracking-wider leading-none font-black text-primary">Seguro</span>
              </motion.div>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-serif italic text-lg text-heading tracking-wide font-medium leading-none mb-1">
                InviBOT
              </span>
              <div className="w-40 border-t-2 border-text-secondary/30 pt-1.5 text-center">
                <span className="text-xs font-black text-heading">InviBOT</span>
                <span className="text-[9px] font-bold text-text-secondary block">INVIMÁGIL KIDS</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-extrabold text-heading mb-2">{formattedDate}</span>
              <div className="w-40 border-t-2 border-text-secondary/30 pt-1.5 text-center">
                <span className="text-xs font-black text-heading">Fecha de emisión</span>
                <span className="text-[9px] font-bold text-text-secondary block">Cuidando lo que los niños comen con amor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          className={`w-full sm:w-auto text-white font-black px-6 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-lg transition-all ${
            pdfLoading
              ? "bg-primary/60 cursor-wait"
              : "bg-primary hover:bg-primary-hover"
          }`}
        >
          <Download className={`w-5 h-5 stroke-[2.5] ${pdfLoading ? "animate-bounce" : ""}`} />
          <span>{pdfLoading ? "Generando PDF..." : "Descargar PDF"}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto bg-brand-green hover:bg-brand-green/90 text-white font-black px-6 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-lg transition-all"
        >
          <Printer className="w-5 h-5 stroke-[2.5]" />
          <span>Imprimir diploma</span>
        </motion.button>
      </div>

      {pdfError && (
        <p className="text-center text-sm font-bold text-brand-pink">{pdfError}</p>
      )}
    </div>
  );
}
