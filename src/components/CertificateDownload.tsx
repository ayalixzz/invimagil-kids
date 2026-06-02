"use client";

import { Award, Download, Printer } from "lucide-react";
import InvimagilKidsLogo from "@/components/InvimagilKidsLogo";

interface CertificateDownloadProps {
  companyName: string;
  productName: string;
  registrationNumber: string;
  score: number;
  level: string;
  riskLevel: string;
  shelfLifeDays: string;
}

export default function CertificateDownload({
  companyName,
  productName,
  registrationNumber,
  score,
  level,
  riskLevel,
  shelfLifeDays,
}: CertificateDownloadProps) {
  const formattedDate = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
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

          <span className="text-brand-yellow text-3xl block mb-2 animate-bounce">★</span>

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
            formulo exitosamente su producto estrella y supero las pruebas de higiene,
            Buenas Practicas de Manufactura y calidad.
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

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs font-black text-heading">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3">
              Riesgo sanitario: <span className="uppercase text-primary">{riskLevel || "bajo"}</span>
            </div>
            <div className="bg-brand-green/10 border border-brand-green/20 rounded-2xl p-3">
              Vida util: <span className="text-brand-green">{shelfLifeDays || "definida"}</span>
            </div>
            <div className="bg-brand-yellow/15 border border-brand-yellow/30 rounded-2xl p-3">
              Valido por: <span className="text-heading">5 anos</span>
            </div>
          </div>

          <p className="text-[11px] text-text-secondary font-bold mt-4">
            Resolucion aplicada: 719 de 2015. Certificado educativo y simulado para aprender jugando.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mt-10">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-brand-yellow/10 border-4 border-dashed border-brand-yellow flex flex-col items-center justify-center text-brand-yellow font-black rotate-[-12deg] shadow-xs">
                <span className="text-xs uppercase leading-none">100%</span>
                <span className="text-[7px] uppercase tracking-wider leading-none">Seguro</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-serif italic text-lg text-heading tracking-wide font-medium leading-none mb-1">
                InviBOT
              </span>
              <div className="w-40 border-t-2 border-text-secondary/30 pt-1.5 text-center">
                <span className="text-xs font-black text-heading">InviBOT</span>
                <span className="text-[9px] font-bold text-text-secondary block">INVIMAGIL KIDS</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-extrabold text-heading mb-2">{formattedDate}</span>
              <div className="w-40 border-t-2 border-text-secondary/30 pt-1.5 text-center">
                <span className="text-xs font-black text-heading">Fecha de emision</span>
                <span className="text-[9px] font-bold text-text-secondary block">Cuidando lo que los ninos comen con amor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden">
        <button
          type="button"
          disabled
          title="La descarga en PDF queda para la siguiente fase."
          className="w-full sm:w-auto bg-primary/60 text-white font-black px-6 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-not-allowed"
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
          <span>PDF proximamente</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto bg-brand-green hover:bg-brand-green/90 text-white font-black px-6 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-lg transition-all"
        >
          <Printer className="w-5 h-5 stroke-[2.5]" />
          <span>Imprimir diploma</span>
        </button>
      </div>
    </div>
  );
}
