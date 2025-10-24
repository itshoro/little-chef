import type { Collaborator } from "../shared/collaborator";
import type { FileReference } from "../shared/file-reference";
import type { Visibility } from "../shared/visibility";
import type { Step } from "./step";

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
  readonly collaborators: Collaborator[];
}

export interface RecipeDetail extends Recipe {
  readonly steps: Step[];
}

export const PERMISSION_ROLES = [
  "owner",
  "maintainer",
  "editor",
  "viewer",
] as const;
