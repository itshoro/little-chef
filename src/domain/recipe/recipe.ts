import type { Collaborator } from "../../application/abstractions/auth/resource-guard";
import type { FileReference } from "../shared/file-reference";
import type { Visibility } from "../shared/visibility";
import type { Step } from "./step";

export type RecipeInsert = {
  id: number;
  publicId: string;
  name: string;
  description: string | null;
  recommendedServingSize: number;
  cookingTime: number;
  preparationTime: number;
  visibility: Visibility;
  slug: string;
  likes: number;
  steps: string[];
  cover: FileReference | null;
};

export interface Recipe {
  readonly id: number;
  readonly publicId: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly cover: FileReference | null;

  readonly visibility: Visibility;
  readonly recommendedServingSize: number;
  readonly cookingTime: number;
  readonly preparationTime: number;
  readonly likes: number;
}

export interface RecipeDetail extends Recipe {
  readonly collaborators: Collaborator[];
  readonly steps: Step[];
}
