import { NextResponse } from "next/server";

type IngredientInput = {
  id: string;
  name: string;
  percentage: number;
};

type ProjectRequest = {
  company?: {
    name: string;
    slogan?: string;
    members?: string;
    logoIcon?: string;
    logoColor?: string;
  };
  product?: {
    name: string;
    type?: string;
    eatOrDrink?: string;
    packaging?: string;
    flavor?: string;
    ingredients?: IngredientInput[];
    recipeSteps?: string[];
  };
  bpmScore?: number;
  levelReached?: string;
  score?: number;
};

export async function POST(req: Request) {
  try {
    const {
      company,
      product,
      bpmScore = 0,
      levelReached = "Mini Creador de Alimentos",
      score = 0,
    } = (await req.json()) as ProjectRequest;

    if (!company || !product) {
      return NextResponse.json(
        { error: "Datos de empresa o producto incompletos" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      savedInDb: false,
      message: "Proyecto guardado en modo demo. La persistencia real queda para la fase de backend.",
      companyPreview: company.name,
      productPreview: product.name,
      bpmScore,
      score,
      levelReached,
      registrationNo: `RSM-2026-KIDS-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  } catch (error: unknown) {
    console.error("Error saving project:", error);
    const message = error instanceof Error ? error.message : "";
    return NextResponse.json(
      {
        error: "Error al guardar el proyecto",
        details: message,
      },
      { status: 500 },
    );
  }
}
