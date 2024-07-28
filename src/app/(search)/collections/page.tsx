import { validateRequest } from "@/lib/auth/lucia";
import type { User } from "lucia";
import { AddButton } from "../components/AddButton";
import { CollectionSubscriptionCard } from "../components/collection-card";
import { findPublicCollections, getSubscriptions } from "@/lib/dal/collections";

const Page = async (props: { searchParams: { q: string } }) => {
  const { user } = await validateRequest();

  return (
    <main>
      <CollectionList user={user} />
      <CollectionSearchResults user={user} query={props.searchParams.q} />
      <AddButton href="/collections/add" />
    </main>
  );
};

const CollectionList = async ({ user }: { user: User | null }) => {
  if (!user) return null;
  const subscriptions = await getSubscriptions(user.id);

  return (
    <section>
      <header className="px-4 py-5">
        <h1 className="flex items-center">
          <span className="mr-2.5 inline-block size-2 rounded-full bg-lime-500" />{" "}
          <span className="text-sm font-medium">Your Saved Collections</span>
        </h1>
      </header>
      <ul className="grid gap-3 px-4">
        {subscriptions.map((subscription) => {
          return (
            <li key={subscription.id} className="">
              <CollectionSubscriptionCard {...subscription} />
            </li>
          );
        })}
      </ul>
    </section>
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
    <section>
      <header className="px-4 py-5">
        <h1 className="flex items-center">
          <span className="mr-2.5 inline-block size-2 rounded-full bg-lime-500" />
          <span className="text-sm font-medium">Public Collections</span>
        </h1>
      </header>
      <ul className="grid gap-3 px-4">
        {collections.map((collection) => {
          return (
            <li key={collection.id}>
              <CollectionSubscriptionCard {...collection} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Page;
