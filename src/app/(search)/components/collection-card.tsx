import * as Card from "./link-card";
import { AvatarStack } from "@/app/components/header/avatar-stack";
import {
  getCollection,
  getCreatorsAndMaintainers,
} from "@/lib/dal/collections";

type CollectionSubscriptionCardProps = {
  id: number;
  publicId: string;
  displayLanguage: string;
  role?: string;
};

const CollectionSubscriptionCard = async ({
  id,
  displayLanguage,
}: CollectionSubscriptionCardProps) => {
  const [collectionResult, collaboratorsResult] = await Promise.allSettled([
    getCollection(id, displayLanguage),
    getCreatorsAndMaintainers(id),
  ]);

  if (collectionResult.status === "rejected") return null;

  const collection = collectionResult.value;
  const collaborators =
    collaboratorsResult.status === "fulfilled" ? collaboratorsResult.value : [];

  return (
    <Card.Root>
      <Card.Link
        href={`/collections/${collection.slug.value}-${collection.collections.publicId}`}
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
                {collection.collections.itemCount} recipes
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
