import { CollectionList } from "@/components/collections/collection-list-container";
import type { ListQueryOptions } from "@/lib/dal/utils";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import type { AuthenticatedUser } from "@/lib/services/auth/types";
import { findCollections } from "@/lib/services/collection";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import type { Metadata } from "next";
import { AddButton } from "../components/AddButton";

export const metadata: Metadata = {
  title: "Collections",
};

const Page = async (props: { searchParams: Promise<{ q?: string }> }) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await getAuthenticatedUserFromRequest();
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
  user: AuthenticatedUser | null;
}) => {
  const queryOptions: ListQueryOptions = {
    search: query ? { query } : undefined,
  };

  const collections = await findCollections(queryOptions, user);

  return <CollectionList title="Search Results" collections={collections} />;
};

export default Page;
