import {
  toPublicRecipe,
  type PublicRecipe,
  type Recipe,
} from "../recipe/recipe";
import {
  toPublicCollaborator,
  type Collaborator,
  type PublicCollaborator,
} from "../shared/collaborator";
import type { Visibility } from "../shared/visibility";

export type PublicCollection = Omit<Collection, "id" | "collaborators"> & {
  collaborators: PublicCollaborator[];
  id?: never;
};

export interface Collection {
  readonly id: number;
  readonly publicId: string;
  slug: string;
  name: string;
  visibility: Visibility;
  collaborators: Collaborator[];
}

export interface CollectionDetail extends Collection {
  recipes: Recipe[];
}

export interface PublicCollectionDetail extends PublicCollection {
  recipes: PublicRecipe[];
}

export const PERMISSION_ROLES = [
  "owner",
  "maintainer",
  "editor",
  "viewer",
] as const;

export function toPublicCollection(collection: Collection): PublicCollection {
  return {
    publicId: collection.publicId,
    slug: collection.slug,
    name: collection.name,
    visibility: collection.visibility,
    collaborators: collection.collaborators.map(toPublicCollaborator),
  };
}

export function toPublicCollectionDetail(
  collectionDetail: CollectionDetail,
): PublicCollectionDetail {
  return {
    publicId: collectionDetail.publicId,
    slug: collectionDetail.slug,
    name: collectionDetail.name,
    visibility: collectionDetail.visibility,
    collaborators: collectionDetail.collaborators.map(toPublicCollaborator),
    recipes: collectionDetail.recipes.map(toPublicRecipe),
  };
}
