import { BackLink } from "@/app/components/back-link";
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
  return (
    <>
      <header
        className="border-b p-4"
        style={{ gridArea: "header", gridColumn: 1 }}
      >
        <div className="flex items-center gap-4">
          <BackLink />
        </div>
      </header>
      {children}
    </>
  );
};

export default RecipeLayout;
