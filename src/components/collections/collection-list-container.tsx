import type { Collection } from "@/domain/collection/collection";
import { Section } from "../ui/section";
import { CollectionCard } from "./collection-card";
import { NoMoreCollections } from "./fallbacks/empty";

type CollectionListProps = {
  title: string;
  collections: Collection[];
};

const CollectionList = ({ collections, title }: CollectionListProps) => {
  return (
    <Section title={title}>
      <Contents collections={collections} />
    </Section>
  );
};

const Contents = ({ collections }: { collections: Collection[] }) => {
  if (collections.length === 0) return <NoMoreCollections />;

  return (
    <ul className="grid gap-4">
      {collections.map((dto) => (
        <li key={dto.publicId}>
          <CollectionCard collection={dto} />
        </li>
      ))}
    </ul>
  );
};

export { CollectionList };
