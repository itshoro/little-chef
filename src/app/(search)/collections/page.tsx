import { Section } from "@/app/(default)/recipes/[slug]/components/section";
import type { User } from "@/drizzle/schema";
import { validateRequest } from "@/lib/auth";
import { findPublicCollections, getSubscriptions } from "@/lib/dal/collections";
import { isRateLimitedGlobally } from "@/lib/rate-limit/global";
import type { Metadata } from "next";
import { AddButton } from "../components/AddButton";
import { CollectionSubscriptionCard } from "../components/collection-card";

export const metadata: Metadata = {
  title: "Collections",
};

const Page = async (props: { searchParams: Promise<{ q?: string }> }) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await validateRequest();

  return (
    <>
      <main className="flex-1">
        <CurrentUserCollections
          user={user}
          query={(await props.searchParams).q}
        />
        <CollectionSearchResults
          user={user}
          query={(await props.searchParams).q}
        />
      </main>
      {user && <AddButton href="/collections/add" />}
    </>
  );
};

const CurrentUserCollections = async ({
  user,
  query,
}: {
  user: User | null;
  query?: string;
}) => {
  if (!user) return null;
  const subscriptions = await getSubscriptions(user.id, query ?? "");

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
    <div className="my-12 px-4">
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
