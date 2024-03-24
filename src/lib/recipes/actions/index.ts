"use server";
import "server-only";

import { AddRecipeValidator, UpdateRecipeValidator } from "../validators";
import { createRecipeEntity } from "./create";
import { updateRecipeEntity } from "./update";
import { z } from "zod";

async function updateRecipe(formData: FormData) {
  const recipeDto = recipeDtoFromFormData(formData, UpdateRecipeValidator);

  if (!recipeDto.success) {
    return { success: false, error: recipeDto.error.flatten().fieldErrors };
  }

  updateRecipeEntity(recipeDto.data);
}

async function createRecipe(formData: FormData) {
  const recipeDto = recipeDtoFromFormData(formData, AddRecipeValidator);

  if (!recipeDto.success) {
    console.log(recipeDto.error.flatten());
    return { success: false, error: recipeDto.error.flatten().fieldErrors };
  }

  try {
    createRecipeEntity(recipeDto.data);
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Object).toString() };
  }
}

function recipeDtoFromFormData<TValidator extends z.AnyZodObject>(
  formData: FormData,
  validator: TValidator,
) {
  const ingredientClientIds = formData.getAll("ingredient.uuid");
  const ingredients = ingredientClientIds.map((id) => ({
    publicId: formData.get(`ingredient.${id}.publicId`),
    measurement: {
      amount: formData.get(`ingredient.${id}.measurement.amount`),
      unit: formData.get(`ingredient.${id}.measurement.unit`),
    },
  }));

  const stepUuids = formData.getAll("step.uuid");
  const steps = stepUuids.map((uuid) => ({
    uuid,
    description: formData.get(`step.${uuid}`),
  }));

  const dto = {
    publicId: formData.get("publicId") ?? undefined,
    name: formData.get("name"),
    servings: formData.get("servings"),
    totalDuration: formData.get("totalDuration"),
    ingredients,
    steps,
  };

  console.log(dto.ingredients);

  return validator.safeParse(dto) as ReturnType<TValidator["safeParse"]>;
}

export { createRecipe, updateRecipe };
