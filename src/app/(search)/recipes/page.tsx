import { RecipeList } from "@/components/recipes/recipe-list-container";
import type { ListQueryOptions } from "@/lib/dal/utils";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import type { AuthenticatedUser } from "@/lib/services/auth/types";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { findRecipes } from "@/lib/services/recipe";
import type { Metadata } from "next";
import { AddButton } from "../components/AddButton";

export const metadata: Metadata = {
  title: "Recipes",
};

const Page = async (props: { searchParams: Promise<{ q?: string }> }) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await getAuthenticatedUserFromRequest();

  return (
    <>
      <main>
        <SearchResults user={user} query={(await props.searchParams).q} />
      </main>
      <AddButton href="/recipes/add" />
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

  const recipes = await findRecipes(queryOptions, user);
  return <RecipeList recipes={recipes} title="Search Results" />;
};

export default Page;
