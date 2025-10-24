import type { Recipe } from "../recipe/recipe";
import type { Collaborator } from "../shared/collaborator";
import type { Visibility } from "../shared/visibility";

export interface Collection {
  id: number;
  publicId: string;
  slug: string;
  name: string;
  visibility: Visibility;
  collaborators: Collaborator[];
}

export interface CollectionDetail extends Collection {
  recipes: Recipe[];
}

export const PERMISSION_ROLES = [
  "owner",
  "maintainer",
  "editor",
  "viewer",
] as const;
