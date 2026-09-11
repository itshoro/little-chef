import { RecipeList } from "@/components/recipes/recipe-list-container";
import { NoLikedRecipes } from "@/components/recipes/fallbacks/no-liked-recipes";
import type { LikedListOptions } from "@/lib/application/abstractions/recipe/recipe-like-repository";
import type { User } from "@/lib/domain/user/user";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { findLikedRecipes } from "@/lib/utils/recipe/find-liked-recipes";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Liked Recipes",
};

const Page = async (props: { searchParams: Promise<{ q?: string }> }) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await validateSession();
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q;

  if (!user) redirect("/login");

  return (
    <main>
      <LikedResults user={user} query={searchQuery} />
    </main>
  );
};

const LikedResults = async ({
  user,
  query,
}: {
  user: User;
  query?: string;
}) => {
  const queryOptions: LikedListOptions = {
    search: query ? { query } : undefined,
  };

  const result = await findLikedRecipes(user, queryOptions);
  if (!result.ok) throw result.error;

  return (
    <RecipeList
      recipes={result.value}
      title="Liked Recipes"
      empty={<NoLikedRecipes />}
    />
  );
};

export default Page;
