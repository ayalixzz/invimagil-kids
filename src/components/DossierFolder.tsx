"use client";

import {
  Candy,
  ChefHat,
  CheckCircle,
  Cookie,
  FileText,
  FolderOpen,
  GlassWater,
  IceCream,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import { Ingredient, getUtensilById } from "./RecipeBuilder";

interface DossierFolderProps {
  company: {
    name: string;
    slogan: string;
    members: string;
    city?: string;
    factoryPlace?: string;
    logoIcon: string;
    logoColor: string;
  };
  product: {
    name: string;
    type: string;
    eatOrDrink: string;
    packaging: string;
    flavor: string;
    derivatives?: string;
    riskLevel?: string;
    storageCondition?: string;
    shelfLifeDays?: string;
    allergenWarning?: string;
    sensory?: {
      flavor: string;
      smell: string;
      color: string;
      texture: string;
    };
    ingredients: Ingredient[];
    recipeSteps: string[];
  };
  bpmScore: number;
  medalsEarned: string[];
}

const LOGO_ICONS: Record<string, LucideIcon> = {
  cookie: Cookie,
  icecream: IceCream,
  juice: GlassWater,
  candy: Candy,
  chef: ChefHat,
};

export default function DossierFolder({
  company,
  product,
  bpmScore,
  medalsEarned,
}: DossierFolderProps) {
  const LogoComponent = LOGO_ICONS[company.logoIcon] || Cookie;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border-4 border-brand-yellow shadow-lg max-w-4xl mx-auto my-4 relative overflow-hidden">
      <div className="absolute top-0 left-8 bg-brand-yellow text-heading font-black text-xs px-6 py-2 rounded-b-2xl uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
        <FolderOpen className="w-3.5 h-3.5 stroke-[3]" />
        <span>Expediente de Registro Sanitario</span>
      </div>

      <div className="pt-6 space-y-8">
        <div className="border-b-4 border-dashed border-border-soft pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: company.logoColor || "#0091B3" }}
            >
              <LogoComponent className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-heading leading-tight">
                {company.name || "Mi Super Empresa"}
              </h4>
              <p className="text-xs font-bold text-text-secondary italic">
                &ldquo;{company.slogan || "El mejor sabor"}&rdquo;
              </p>
              <p className="text-xs font-black text-primary mt-1">
                {company.city || "Ciudad pendiente"} - {company.factoryPlace || "Lugar de fabricacion pendiente"}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-xs uppercase font-black tracking-widest text-primary block mb-1">
              Estado del tramite
            </span>
            <span className="bg-primary/10 text-heading font-black text-xs px-4 py-1.5 rounded-full border border-primary/30">
              Listo para evaluacion
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <h5 className="text-lg font-black text-heading flex items-center gap-2 border-b-2 border-border-soft pb-1">
              <FileText className="w-5 h-5 text-primary" />
              <span>Ficha del producto</span>
            </h5>
            <div className="space-y-2 text-sm">
              <Info label="Nombre" value={product.name} />
              <Info label="Tipo" value={product.type} />
              <Info label="Consumo" value={`Para ${product.eatOrDrink}`} />
              <Info label="Riesgo sanitario" value={product.riskLevel || "Pendiente"} />
              <Info label="Derivados" value={product.derivatives || "Sin derivados"} />
            </div>
          </section>

          <section className="space-y-4">
            <h5 className="text-lg font-black text-heading flex items-center gap-2 border-b-2 border-border-soft pb-1">
              <PackageCheck className="w-5 h-5 text-brand-green" />
              <span>Empaque y almacenamiento</span>
            </h5>
            <div className="space-y-2 text-sm">
              <Info label="Empaque" value={product.packaging} />
              <Info label="Almacenamiento" value={product.storageCondition || "Pendiente"} />
              <Info label="Vencimiento" value={product.shelfLifeDays || "Pendiente"} />
              <Info label="Advertencias" value={product.allergenWarning || "Sin advertencias"} />
              <Info label="Ciudad" value={company.city || "Pendiente"} />
            </div>
          </section>
        </div>

        <section className="bg-primary/5 p-4 rounded-3xl border border-primary/15 space-y-3">
          <h5 className="text-base font-black text-heading">Ingredientes de mayor a menor peso:</h5>
          <div className="flex flex-wrap gap-2">
            {product.ingredients.map((ing, idx) => {
              const u = getUtensilById(ing.utensil);
              return (
                <span
                  key={ing.id}
                  className="bg-white border border-border-soft px-3 py-1.5 rounded-2xl text-xs font-black text-heading shadow-xs"
                >
                  {idx + 1}. {ing.name} — {u.emoji} {ing.quantity} {u.label} ({ing.totalGrams}g / {ing.percentage}%)
                </span>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-primary/5 p-4 rounded-3xl border border-primary/15 space-y-2">
            <h5 className="text-base font-black text-heading">Analisis organoleptico:</h5>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-text-secondary">
              <span>Sabor: {product.sensory?.flavor || "Pendiente"}</span>
              <span>Olor: {product.sensory?.smell || "Pendiente"}</span>
              <span>Color: {product.sensory?.color || "Pendiente"}</span>
              <span>Textura: {product.sensory?.texture || "Pendiente"}</span>
            </div>
          </section>

          <section className="bg-primary/5 p-4 rounded-3xl border border-primary/15 space-y-2">
            <h5 className="text-base font-black text-heading">BPM y equipo:</h5>
            <div className="space-y-2 text-xs font-bold text-text-secondary">
              <p>Equipo: {company.members || "Pendiente"}</p>
              <p>
                Puntaje BPM: <span className="text-brand-green font-black">{bpmScore} / 100 pts</span>
              </p>
              <p>Medallas: {medalsEarned.length > 0 ? medalsEarned.join(", ") : "Aun sin medallas"}</p>
            </div>
          </section>
        </div>

        <section className="bg-primary/5 p-4 rounded-3xl border border-primary/15 space-y-2">
          <h5 className="text-base font-black text-heading">Pasos de preparacion:</h5>
          <ol className="list-decimal pl-5 text-sm font-bold text-text-secondary space-y-1">
            {product.recipeSteps.map((recipeStep, idx) => (
              <li key={`${recipeStep}-${idx}`}>{recipeStep}</li>
            ))}
          </ol>
        </section>

        <div className="flex items-center gap-3 bg-brand-green/10 p-4 rounded-3xl border border-brand-green/25 text-sm text-heading font-bold">
          <CheckCircle className="w-5 h-5 text-brand-green stroke-[3] flex-shrink-0" />
          <span>Etiqueta completa, BPM revisadas y expediente listo para que InviBot emita el Registro Sanitario educativo.</span>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 font-bold py-1 border-b border-border-soft/50">
      <span className="text-text-secondary">{label}:</span>
      <span className="text-heading font-extrabold text-right capitalize">{value}</span>
    </div>
  );
}
