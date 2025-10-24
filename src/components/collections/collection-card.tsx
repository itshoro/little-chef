import { AvatarStack } from "@/components/users/avatar-stack";
import type { Collection } from "@/lib/domain/collection/collection";
import { generateHandle } from "@/lib/slug";
import * as Card from "../ui/link-card";

const CollectionCard = async ({ collection }: { collection: Collection }) => {
  return (
    <Card.Root>
      <Card.Link
        href={`/collections/${generateHandle(collection.slug, collection.publicId)}`}
      >
        Overview of {collection.name}
      </Card.Link>
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="font-medium">{collection.name}</div>
          <AvatarStack users={collection.collaborators.map((c) => c.user)} />
        </div>
      </div>
    </Card.Root>
  );
};

export { CollectionCard };
