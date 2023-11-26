import { getOverview } from "@/lib/recipes/actions/retrieve";
import Link from "next/link";

const Page = async () => {
  const recipes = await getOverview();
  return (
    <>
      <header className="shadow-sm px-4 py-2">
        <div className="flex justify-between items-center">
          <h1 className="text-lg">Recipes</h1>
          <Link
            href="/recipes/add"
            className="inline-flex items-center bg-black text-white p-2 pr-5 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
            </svg>
            Add
          </Link>
        </div>
      </header>
      <ul className="divide-y px-4 py-2">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="py-4">
            {recipe.name}
            <div>
              <Link
                className="inline-flex items-center gap-1 text-stone-600 hover:text-black motion-reduce:transition-none font-medium p-1 border"
                href={`/recipes/show/${recipe.id}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  <path
                    fillRule="evenodd"
                    d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                View
              </Link>
              <Link
                className="inline-flex items-center gap-1 text-stone-600 hover:text-black motion-reduce:transition-none font-medium p-1 border"
                href={`/recipes/edit/${recipe.id}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Page;
