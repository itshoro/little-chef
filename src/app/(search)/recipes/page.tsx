import { validateRequest } from "@/lib/auth/lucia";
import { User } from "lucia";
import { AddButton } from "../components/AddButton";
import { RecipeCard } from "../components/recipe-card";
import { findPublicIds, getSubscriptions } from "@/lib/dal/recipe";
import { getAppPreferences } from "@/lib/dal/app";

const Page = async (props: { searchParams: { q: string } }) => {
  const { user } = await validateRequest();

  return (
    <>
      <main>
        <SubscribedList user={user} />
        <SearchResults query={props.searchParams.q} user={user} />
      </main>
      <AddButton href="/recipes/add" />
    </>
  );
};

const SubscribedList = async ({ user }: { user: User | null }) => {
  if (!user) return null;

  const appPreferences = await getAppPreferences(user.id);
  const subscriptions = await getSubscriptions(user.id);

  return (
    <section>
      <header className="px-4 py-5">
        <h1 className="flex items-center">
          <span className="mr-2.5 inline-block size-2 rounded-full bg-lime-500" />{" "}
          <span className="text-sm font-medium">Your Saved Recipes</span>
        </h1>
      </header>
      <ul className="px-4">
        {subscriptions.map((subcription) => (
          <li key={subcription.id}>
            <RecipeCard
              {...subcription}
              displayLanguage={appPreferences.displayLanguageCode}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

const SearchResults = async ({
  query,
  user,
}: {
  query?: string;
  user: User | null;
}) => {
  if (user === null) return null;

  const appPreferences = await getAppPreferences(user.id);
  const recipes = await findPublicIds(
    query ?? "",
    appPreferences.displayLanguageCode,
  );

  return (
    <>
      <section>
        <header className="px-4 py-5">
          <h1 className="flex items-center">
            <span className="mr-2.5 inline-block size-2 rounded-full bg-lime-500" />{" "}
            <span className="text-sm font-medium">Public Recipes</span>
          </h1>
        </header>
        <ul className="grid gap-3 px-4">
          {recipes.map((recipe) => {
            return (
              <li key={recipe.id} className="">
                <RecipeCard
                  {...recipe}
                  displayLanguage={appPreferences.displayLanguageCode}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default Page;
