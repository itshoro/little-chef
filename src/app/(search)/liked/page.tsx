import { RecipeList } from "@/components/recipes/recipe-list-container";
import { NoLikedRecipes } from "@/components/recipes/fallbacks/no-liked-recipes";
import type { User } from "@/lib/domain/user/user";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { findLikedRecipes } from "@/lib/utils/recipe/find-liked-recipes";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Liked Recipes",
};

const Page = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await validateSession();

  if (!user) redirect("/login");

  return (
    <main>
      <LikedResults user={user} />
    </main>
  );
};

const LikedResults = async ({ user }: { user: User }) => {
  const result = await findLikedRecipes(user);
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
