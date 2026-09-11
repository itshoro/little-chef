import { RecipeList } from "@/components/recipes/recipe-list-container";
import { NoHistory } from "@/components/recipes/fallbacks/no-history";
import type { HistoryListOptions } from "@/lib/application/abstractions/user/history-repository";
import type { User } from "@/lib/domain/user/user";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { findHistoryRecipes } from "@/lib/utils/recipe/find-history-recipes";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "History",
};

const Page = async (props: { searchParams: Promise<{ q?: string }> }) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await validateSession();
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q;

  if (!user) redirect("/login");

  return (
    <main>
      <HistoryResults user={user} query={searchQuery} />
    </main>
  );
};

const HistoryResults = async ({
  user,
  query,
}: {
  user: User;
  query?: string;
}) => {
  const queryOptions: HistoryListOptions = {
    search: query ? { query } : undefined,
  };

  const result = await findHistoryRecipes(user, queryOptions);
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
