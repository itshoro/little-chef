import { RecipeList } from "@/components/recipes/recipe-list-container";
import { NoHistory } from "@/components/recipes/fallbacks/no-history";
import type { User } from "@/lib/domain/user/user";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { findHistoryRecipes } from "@/lib/utils/recipe/find-history-recipes";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "History",
};

const Page = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await validateSession();

  if (!user) redirect("/login");

  return (
    <main>
      <HistoryResults user={user} />
    </main>
  );
};

const HistoryResults = async ({ user }: { user: User }) => {
  const result = await findHistoryRecipes(user);
  if (!result.ok) throw result.error;

  return (
    <RecipeList
      recipes={result.value}
      title="Recently Viewed"
      empty={<NoHistory />}
    />
  );
};

export default Page;
