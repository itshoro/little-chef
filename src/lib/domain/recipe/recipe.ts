import {
  toPublicCollaborator,
  type Collaborator,
  type PublicCollaborator,
} from "../shared/collaborator";
import {
  toPublicFileReference,
  type FileReference,
  type PublicFileReference,
} from "../shared/file-reference";
import type { Visibility } from "../shared/visibility";
import type { Step } from "./step";

export type PublicRecipe = Omit<Recipe, "cover" | "id" | "collaborators"> & {
  cover: PublicFileReference | null;
  collaborators: PublicCollaborator[];
  id?: never;
};

export interface Recipe {
  readonly id: number;
  readonly publicId: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: Visibility;
  recommendedServingSize: number;
  cookingTime: number;
  preparationTime: number;
  likes: number;
  collaborators: Collaborator[];
  cover: FileReference | null;
}

export interface PublicRecipeDetail extends PublicRecipe {
  steps: Step[];
}

export interface RecipeDetail extends Recipe {
  steps: Step[];
}

export const PERMISSION_ROLES = [
  "owner",
  "maintainer",
  "editor",
  "viewer",
] as const;

export function toPublicRecipe(recipe: Recipe): PublicRecipe {
  return {
    publicId: recipe.publicId,
    name: recipe.name,
    slug: recipe.slug,
    description: recipe.description,
    cover: recipe.cover ? toPublicFileReference(recipe.cover) : null,
    visibility: recipe.visibility,
    recommendedServingSize: recipe.recommendedServingSize,
    cookingTime: recipe.cookingTime,
    preparationTime: recipe.preparationTime,
    likes: recipe.likes,
    collaborators: recipe.collaborators.map(toPublicCollaborator),
  };
}

export function toPublicRecipeDetail(detail: RecipeDetail): PublicRecipeDetail {
  const { steps, ...recipe } = detail;
  return {
    ...toPublicRecipe(recipe),
    steps,
  };
}
