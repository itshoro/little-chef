import { validateRequest } from "@/lib/auth/lucia";
import { User } from "lucia";
import { AddButton } from "../components/AddButton";
import { RecipeCard } from "../components/recipe-card";
import { findPublicRecipeIds } from "@/lib/dal/recipe";
import { getSubcribedRecipes } from "@/lib/dal/user";
import type { Metadata } from "next";
import { Section } from "@/app/(default)/recipes/[slug]/components/section";

export const metadata: Metadata = {
  title: "Recipes",
};

const Page = async (props: { searchParams: Promise<{ q?: string }> }) => {
  const { user } = await validateRequest();

  return (
    <>
      <main className="flex-1">
        <YourCookbook user={user} query={(await props.searchParams).q} />
        <SearchResults query={(await props.searchParams).q} />
      </main>
      <AddButton href="/recipes/add" />
    </>
  );
};

const YourCookbook = async ({
  user,
  query,
}: {
  user: User | null;
  query?: string;
}) => {
  if (!user) return null;

  const subscriptions = await getSubcribedRecipes(user.id, query ?? "");

  return <SectionWithRecipes title="Your Cookbook" recipes={subscriptions} />;
};

const SearchResults = async ({ query }: { query?: string }) => {
  const recipes = await findPublicRecipeIds(query ?? "");

  return <SectionWithRecipes title="Public Recipes" recipes={recipes} />;
};

const SectionWithRecipes = ({
  title,
  recipes,
}: {
  title: string;
  recipes: { id: number; publicId: string }[];
}) => {
  return (
    <div className="my-12 px-4">
      <Section title={title}>
        <ul className="grid gap-3">
          {recipes.map((recipe) => {
            return (
              <li key={recipe.id} className="">
                <RecipeCard {...recipe} />
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
};

export default Page;
