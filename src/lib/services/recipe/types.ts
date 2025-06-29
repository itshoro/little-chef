import type {
  DrizzleRecipe,
  DrizzleRecipeInsert,
  DrizzleRecipeStep,
  DrizzleRecipeStepsInsert,
} from "@/drizzle/schema";
import type { UserOutputPublicDTO } from "../user/types";

type Prettify<T> = { [K in keyof T]: T[K] };

type RecipeInsertDTO = Prettify<
  Omit<
    DrizzleRecipeInsert,
    "id" | "publicId" | "coverSrc" | "likes" | "slug"
  > & { cover: RecipeCoverUpdate; steps: string[] }
>;
type RecipeUpdateDTO = Omit<
  DrizzleRecipeInsert,
  "id" | "coverSrc" | "likes" | "slug"
> & {
  cover: RecipeCoverUpdate;
  steps: Record<string, string>; // publicId -> description
};

type RecipeStepsInsertDTO = Omit<DrizzleRecipeStepsInsert, "id" | "publicId">;
type RecipeStepsUpdateDTO = Omit<DrizzleRecipeStepsInsert, "id">;

type RecipeCoverUpdate =
  | { update: false }
  | { update: true; file: File | null };

type RecipeOutputPublicDTO = Omit<DrizzleRecipe, "id">;

type RecipeStepOutputPublicDTO = Omit<DrizzleRecipeStep, "id">;

type RecipePreviewDTO = {
  recipe: RecipeOutputPublicDTO;
  maintainers: UserOutputPublicDTO[];
};

type RecipeDetailsDTO = {
  recipe: RecipeOutputPublicDTO;
  maintainers: UserOutputPublicDTO[];
  steps: RecipeStepOutputPublicDTO[];
};

export type {
  RecipeInsertDTO,
  RecipeOutputPublicDTO,
  RecipeStepOutputPublicDTO,
  RecipeStepsInsertDTO,
  RecipeStepsUpdateDTO,
  RecipeUpdateDTO,
  RecipePreviewDTO,
  RecipeDetailsDTO,
};
