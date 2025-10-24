import { CollectionList } from "@/components/collections/collection-list-container";
import type { User } from "@/lib/domain/user/user";
import type { ListQueryOptions } from "@/lib/dal/utils";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { findCollections } from "@/lib/utils/collection/find-collections";
import type { Metadata } from "next";
import { AddButton } from "../components/AddButton";

export const metadata: Metadata = {
  title: "Collections",
};

const Page = async (props: { searchParams: Promise<{ q?: string }> }) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await validateSession();
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q;

  return (
    <>
      <main className="flex-1">
        <SearchResults user={user} query={searchQuery} />
      </main>
      {user && <AddButton href="/collections/add" />}
    </>
  );
};

const SearchResults = async ({
  query,
  user,
}: {
  query?: string;
  user: User | null;
}) => {
  const queryOptions: ListQueryOptions = {
    search: query ? { query } : undefined,
  };

  const collections = await findCollections(queryOptions, user);

  return <CollectionList title="Search Results" collections={collections} />;
};

export default Page;
