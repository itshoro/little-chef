import { validateRequest } from "@/lib/auth/lucia";
import type { User } from "lucia";
import { AddButton } from "../components/AddButton";
import { CollectionSubscriptionCard } from "../components/collection-card";
import { findPublicCollections, getSubscriptions } from "@/lib/dal/collections";
import type { Metadata } from "next";
import { Section } from "@/app/recipes/[slug]/components/section";

export const metadata: Metadata = {
  title: "Collections",
};

const Page = async (props: { searchParams: { q: string } }) => {
  const { user } = await validateRequest();

  return (
    <>
      <main className="flex-1">
        <CollectionList user={user} />
        <CollectionSearchResults user={user} query={props.searchParams.q} />
      </main>
      <AddButton href="/collections/add" />
    </>
  );
};

const CollectionList = async ({ user }: { user: User | null }) => {
  if (!user) return null;
  const subscriptions = await getSubscriptions(user.id);

  return (
    <SectionWithCollections
      title="Your Saved Collections"
      collections={subscriptions}
    />
  );
};

const CollectionSearchResults = async ({
  query,
  user,
}: {
  query?: string;
  user: User | null;
}) => {
  if (!user) return null;
  const collections = await findPublicCollections(query ?? "");

  return (
    <SectionWithCollections
      title="Public Collections"
      collections={collections}
    />
  );
};

const SectionWithCollections = ({
  title,
  collections,
}: {
  title: string;
  collections: { id: number; publicId: string }[];
}) => {
  return (
    <div className="px-4">
      <Section title={title}>
        <ul className="grid gap-3">
          {collections.map((collection) => {
            return (
              <li key={collection.id}>
                <CollectionSubscriptionCard {...collection} />
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
};

export default Page;
