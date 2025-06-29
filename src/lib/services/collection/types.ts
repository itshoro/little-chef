import type {
  DrizzleCollection,
  DrizzleCollectionInsert,
} from "@/drizzle/schema";
import type { UserOutputPublicDTO } from "../user/types";
import type { RecipeOutputPublicDTO, RecipePreviewDTO } from "../recipe/types";

type CollectionInsertDTO = Omit<
  DrizzleCollectionInsert,
  "id" | "publicId" | "likes" | "itemCount" | "slug"
>;

type CollectionUpdateDTO = Omit<
  DrizzleCollectionInsert,
  "id" | "likes" | "itemCount" | "slug" | "isCustom"
>;

type CollectionOutputPublicDTO = Omit<DrizzleCollection, "id">;

type CollectionDetailsDTO = {
  collection: CollectionOutputPublicDTO;
  maintainers: UserOutputPublicDTO[];
  recipes: RecipePreviewDTO[];
};

type CollectionPreviewDTO = {
  collection: CollectionOutputPublicDTO;
  maintainers: UserOutputPublicDTO[];
};

export type {
  CollectionInsertDTO,
  CollectionUpdateDTO,
  CollectionOutputPublicDTO,
  CollectionDetailsDTO,
  CollectionPreviewDTO,
};
