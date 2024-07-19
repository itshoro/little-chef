import { validateRequest } from "@/lib/auth/lucia";
import { getRecipe } from "@/lib/dal/recipe";
import { extractParts } from "@/lib/slug";
import NextLink from "next/link";

const RecipeLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const { session } = await validateRequest();

  const { publicId } = extractParts(params.slug);
  const recipe = await getRecipe({ publicId }, session?.id);

  return (
    <>
      <header
        className="border-b p-4"
        style={{ gridArea: "header", gridColumn: 1 }}
      >
        <div className="flex items-center gap-4">
          <NextLink href="/">
            <div className="rounded-lg bg-white p-1 ring-1 ring-black/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </div>
          </NextLink>
          <h1 className="font-medium">{recipe.name}</h1>
        </div>
      </header>
      {children}
    </>
  );
};

export default RecipeLayout;
