import { validateRequest } from "@/lib/auth/lucia";
import { User } from "lucia";
import { AddButton } from "../components/AddButton";
import { RecipeCard } from "../components/recipe-card";
import { findPublicRecipeIds } from "@/lib/dal/recipe";
import { getSubcribedRecipes } from "@/lib/dal/user";

const Page = async (props: { searchParams: { q: string } }) => {
  const { user } = await validateRequest();

  return (
    <>
      <main className="flex-1">
        <YourCookbook user={user} />
        <SearchResults query={props.searchParams.q} user={user} />
      </main>
      <AddButton href="/recipes/add" />
    </>
  );
};

const YourCookbook = async ({ user }: { user: User | null }) => {
  if (!user) return null;

  const subscriptions = await getSubcribedRecipes(user.id);

  return <Section title="Your Cookbook" recipes={subscriptions} />;
};

const SearchResults = async ({
  query,
  user,
}: {
  query?: string;
  user: User | null;
}) => {
  if (user === null) return null;

  const recipes = await findPublicRecipeIds(query ?? "");

  return <Section title="Public Recipes" recipes={recipes} />;
};

const Section = ({
  title,
  recipes,
}: {
  title: string;
  recipes: { id: number; publicId: string }[];
}) => {
  return (
    <section>
      <header className="px-4 py-5">
        <h1 className="flex items-center">
          <span className="mr-2.5 inline-block size-2 rounded-full bg-lime-500" />{" "}
          <span className="text-sm font-medium">{title}</span>
        </h1>
      </header>
      <ul className="grid gap-3 px-4">
        {recipes.map((recipe) => {
          return (
            <li key={recipe.id} className="">
              <RecipeCard {...recipe} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Page;
