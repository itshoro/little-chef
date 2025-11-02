import { RecipeList } from "@/components/recipes/recipe-list-container";
import { db } from "@/drizzle/db";
import type { RecipeListOptions } from "@/lib/application/abstractions/recipe/recipe-read-repository";
import { makeFindRecipes } from "@/lib/application/use-case/recipe/find-recipes";
import type { User } from "@/lib/domain/user/user";
import { DrizzleRecipeReadRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-read-repository";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
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
  const queryOptions: RecipeListOptions = {
    search: query ? { query } : undefined,
  };

  const findRecipes = makeFindRecipes(new DrizzleRecipeReadRepository(db));
  const recipes = await findRecipes(queryOptions, user);
  if (!recipes.ok) throw recipes.error;

  return <RecipeList recipes={recipes.value} title="Search Results" />;
};

export default Page;
