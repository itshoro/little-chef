import { validateRequest } from "@/lib/auth/lucia";
import type { User as LuciaUser } from "lucia";
import { AddButton } from "../components/AddButton";
import { CollectionSubscriptionCard } from "../components/collection-card";
import { findPublicIds, getSubscriptions } from "@/lib/dal/collections";
import { getAppPreferences } from "@/lib/dal/app";

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

const CollectionList = async ({ user }: { user: LuciaUser | null }) => {
  if (!user) return null;

  const appPreferences = await getAppPreferences(user.id);
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
              <CollectionSubscriptionCard
                {...subscription}
                displayLanguage={appPreferences.displayLanguageCode}
              />
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
  user: LuciaUser | null;
}) => {
  if (!user) return null;

  const appPreferences = await getAppPreferences(user.id);
  const collections = await findPublicIds(
    query ?? "",
    appPreferences.displayLanguageCode,
  );

  return (
    <section>
      <header className="px-4 py-5">
        <h1 className="flex items-center">
          <span className="mr-2.5 inline-block size-2 rounded-full bg-lime-500" />{" "}
          <span className="text-sm font-medium">Public Collections</span>
        </h1>
      </header>
      <ul className="grid gap-3 px-4">
        {collections.map((collection) => {
          return (
            <li key={collection.id}>
              <CollectionSubscriptionCard
                {...collection}
                displayLanguage={appPreferences.displayLanguageCode}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Page;
