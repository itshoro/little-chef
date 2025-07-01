import type { CollectionPreviewDTO } from "@/lib/services/collection/types";
import { Section } from "../ui/section";
import { NoMoreCollections } from "./fallbacks/empty";
import { CollectionCard } from "./collection-card";

type CollectionListProps = {
  title: string;
  collections: CollectionPreviewDTO[];
};

const CollectionList = ({ collections, title }: CollectionListProps) => {
  return (
    <Section title={title}>
      <Contents collections={collections} />
    </Section>
  );
};

const Contents = ({ collections }: { collections: CollectionPreviewDTO[] }) => {
  if (collections.length === 0) return <NoMoreCollections />;

  return (
    <ul>
      {collections.map((dto) => (
        <li key={dto.collection.publicId}>
          <CollectionCard
            collection={dto.collection}
            maintainers={dto.maintainers}
          />
        </li>
      ))}
    </ul>
  );
};

export { CollectionList };
