import { makeFindRecipes } from "@/application/use-case/recipe/find-recipes";
import { RecipeList } from "@/components/recipes/recipe-list-container";
import type { User } from "@/domain/user/user";
import { db } from "@/drizzle/db";
import { DrizzleRecipeReadRepository } from "@/infrastructure/repositories/drizzle/recipe/recipe-read-repository";
import { validateSession } from "@/lib/auth/validate-session";
import type { ListQueryOptions } from "@/lib/dal/utils";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import type { Metadata } from "next";
import { AddButton } from "../components/AddButton";

export const metadata: Metadata = {
  title: "Recipes",
};

const Page = async (props: { searchParams: Promise<{ q?: string }> }) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await validateSession();

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
  user: User | null;
}) => {
  const queryOptions: ListQueryOptions = {
    search: query ? { query } : undefined,
  };

  const findRecipes = makeFindRecipes(new DrizzleRecipeReadRepository(db));
  const recipes = await findRecipes(queryOptions, user);

  return <RecipeList recipes={recipes} title="Search Results" />;
};

export default Page;
