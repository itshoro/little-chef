import { getOverview } from "@/lib/recipes/actions/read";
import { CTALink } from "./components/CallToAction/Link";
import { SearchInput } from "./components/Search/Input";
import { RecipeOverview } from "./components/Recipe/Overview";
import Link from "next/link";

const Page = async () => {
  return (
    <div
      className="magic-grid h-[100svh]"
      style={{
        gridTemplateRows:
          "[header-start] min-content [header-end content-start] 1fr [content-end action-start] min-content [action-end]",
      }}
    >
      <header
        className="border-b"
        style={{ gridArea: "header", gridColumn: 1 }}
      >
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <SearchInput />
            <img
              src="/timnelke.jpg"
              className="rounded-full aspect-square w-10 border-2 border-white"
              alt=""
            />
          </div>
        </div>
      </header>
      <div className="p-2 overflow-y-auto h-full">
        <RecipeList />
      </div>
      <footer
        className="border-t w-full flex p-4"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <div className="ml-auto">
          <CTALink href="/recipes/add">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 opacity-50"
            >
              <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
            </svg>
            Add
          </CTALink>
        </div>
      </footer>
    </div>
  );
};

const NoRecipes = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full font-medium text-center gap-4 select-none">
      <div className="text-6xl">🍽️</div>
      <div className="text-lg">You haven't stored a recipe yet.</div>
      <hr className="bg-stone-200 w-24" />

      <Link className="underline text-green-600" href="/recipes/add">
        How about adding a new one?
      </Link>
    </div>
  );
};

const RecipeList = async () => {
  let recipeList = await getOverview();
  if (recipeList.length === 0) return <NoRecipes />;

  return (
    <ul>
      {recipeList.map((recipe) => (
        <li
          key={recipe.publicId}
          className="p-4 shadow-sm bg-white rounded-lg mb-2"
        >
          <RecipeOverview recipe={recipe} />
        </li>
      ))}
    </ul>
  );
};

export default Page;
