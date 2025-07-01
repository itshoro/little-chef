import { AvatarStack } from "@/components/users/avatar-stack";
import type { CollectionPreviewDTO } from "@/lib/services/collection/types";
import { generateHandle } from "@/lib/slug";
import * as Card from "../ui/link-card";

const CollectionCard = async ({
  collection,
  maintainers,
}: CollectionPreviewDTO) => {
  return (
    <Card.Root>
      <Card.Link
        href={`/collections/${generateHandle(collection.slug, collection.publicId)}`}
      >
        Overview of {collection.name}
      </Card.Link>
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="font-medium">
            <span>{collection.name} </span>
            <span className="text-sm font-normal">
              <span className="text-stone-400">&middot;</span>{" "}
              <span className="text-lime-500">
                {collection.itemCount} recipes
              </span>
            </span>
          </div>
          <AvatarStack users={maintainers} />
        </div>
      </div>
    </Card.Root>
  );
};

export { CollectionCard };
