import {
  IngredientValidator,
  createIngredient,
} from "@/lib/ingredients/actions/create";
import { selectIngredients } from "@/lib/ingredients/actions/read";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const ingredients = await selectIngredients(
    params.get("searchTerm") ?? "",
    params.get("language") ?? undefined,
  );

  return NextResponse.json(ingredients);
}

async function POST(request: NextRequest) {
  const body = await request.json();

  const ingredientDto = IngredientValidator.safeParse(body);
  if (!ingredientDto.success)
    return NextResponse.json(
      { error: ingredientDto.error.message },
      { status: 400 },
    );

  const ingredient = await createIngredient(body);
  return NextResponse.json(ingredient);
}

export { GET, POST };
