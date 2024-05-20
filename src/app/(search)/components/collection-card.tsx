import * as Card from "./link-card";
import { AvatarStack } from "@/app/components/header/avatar-stack";
import {
  getCollection,
  getCreatorsAndMaintainers,
} from "@/lib/dal/collections";

type CollectionSubscriptionCardProps = {
  id: number;
  publicId: string;
  role?: string;
  displayLanguage: string;
};

const CollectionSubscriptionCard = async ({
  id,
  displayLanguage,
}: CollectionSubscriptionCardProps) => {
  const [collection, collaborators] = await Promise.all([
    getCollection(id, displayLanguage),
    getCreatorsAndMaintainers(id),
  ]);

  if (
    collection === undefined ||
    collection.slug === undefined ||
    collection.name === undefined
  )
    return null;

  return (
    <Card.Root>
      <Card.Link
        href={`/collections/${collection.slug.value}-${collection.publicId}`}
      >
        Overview of {collection.name.value}
      </Card.Link>
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="font-medium">
            <span>{collection.name.value} </span>
            <span className="text-sm font-normal">
              <span className="text-stone-400">&middot;</span>{" "}
              <span className="text-lime-500">
                {collection.itemCount} recipes
              </span>
            </span>
          </div>
          <AvatarStack users={collaborators} />
        </div>
      </div>
    </Card.Root>
  );
};

export { CollectionSubscriptionCard };
