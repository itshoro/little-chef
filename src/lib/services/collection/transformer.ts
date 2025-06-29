import type { DrizzleCollection } from "@/drizzle/schema";
import type { CollectionOutputPublicDTO } from "./types";

export function toCollectionOutputPublicDTO(
  collection: DrizzleCollection,
): CollectionOutputPublicDTO {
  return {
    isCustom: collection.isCustom,
    itemCount: collection.itemCount,
    likes: collection.likes,
    name: collection.name,
    publicId: collection.publicId,
    slug: collection.slug,
    visibility: collection.visibility,
  };
}
