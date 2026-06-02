import { NextResponse } from "next/server";

type IngredientInput = {
  name: string;
  percentage: number;
};

type InspectorRequest = {
  product?: {
    name: string;
    type: string;
    ingredients?: IngredientInput[];
  };
  bpmScore?: number;
};

const BANNED_INGREDIENTS = [
  "tierra", "piedra", "roca", "arena", "plastico", "vidrio", "juguete", "muñeco", "papel",
  "carton", "madera", "metal", "fierro", "hierro", "tornillo", "carbon", "basura",
  "pasto", "hojas", "cemento", "jabon", "detergente", "quimico", "veneno", "petroleo",
  "gasolina", "pila", "bateria", "insecto", "araña", "bicho", "caca", "popo", "pipi",
];

const LIQUIDS_VOCABULARY = [
  "agua", "leche", "jugo", "zumo", "nectar", "te", "cafe", "yogur", "yogurt", "soda",
  "gaseosa", "limonada", "caldo", "sopa", "aceite", "vinagre", "almibar",
];

export async function POST(req: Request) {
  try {
    const { product, bpmScore = 0 } = (await req.json()) as InspectorRequest;

    if (!product || !product.ingredients) {
      return NextResponse.json(
        { error: "Faltan los datos del producto o ingredientes" },
        { status: 400 },
      );
    }

    const ingredients = product.ingredients;
    const type = product.type;

    let isApproved = true;
    const feedback: string[] = [];

    if (ingredients.length === 0) {
      return NextResponse.json({
        approved: false,
        feedback: ["InviBot necesita ver al menos un ingrediente para revisar tu receta."],
      });
    }

    const totalPercentage = ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
    if (totalPercentage !== 100) {
      isApproved = false;
      feedback.push(
        `InviBot calculó ${totalPercentage}% en tu receta. Para aprobar, los ingredientes deben sumar exactamente 100%.`,
      );
    }

    let orderedCorrectly = true;
    for (let i = 0; i < ingredients.length - 1; i++) {
      if (ingredients[i].percentage < ingredients[i + 1].percentage) {
        orderedCorrectly = false;
        break;
      }
    }
    if (!orderedCorrectly) {
      isApproved = false;
      feedback.push(
        "InviBot detectó que la lista de ingredientes no está ordenada de mayor a menor porcentaje.",
      );
    }

    const foundBanned: string[] = [];
    ingredients.forEach((ing) => {
      const ingName = ing.name.toLowerCase();
      BANNED_INGREDIENTS.forEach((banned) => {
        if (ingName.includes(banned)) {
          foundBanned.push(ing.name);
        }
      });
    });

    if (foundBanned.length > 0) {
      isApproved = false;
      feedback.push(
        `InviBot encontró ingredientes que no son comida: ${foundBanned.join(", ")}. Cámbialos por alimentos reales y seguros.`,
      );
    }

    if (type === "liquido") {
      let hasLiquid = false;
      ingredients.forEach((ing) => {
        const ingName = ing.name.toLowerCase();
        LIQUIDS_VOCABULARY.forEach((liq) => {
          if (ingName.includes(liq)) hasLiquid = true;
        });
      });

      if (!hasLiquid) {
        isApproved = false;
        feedback.push(
          "InviBot ve que tu producto es líquido, pero la receta no incluye agua, leche, jugo u otro ingrediente líquido.",
        );
      }
    }

    if (bpmScore < 100) {
      isApproved = false;
      feedback.push(
        "InviBot todavía necesita que completes todas las reglas de higiene BPM antes de aprobar el registro.",
      );
    }

    if (isApproved) {
      feedback.push(
        `InviBot aprobó tu producto "${product.name}". La receta suma 100%, está ordenada y cumple las reglas de higiene.`,
      );
    }

    return NextResponse.json({
      approved: isApproved,
      feedback,
    });
  } catch (error) {
    console.error("Inspector API Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor en la validación" },
      { status: 500 },
    );
  }
}
