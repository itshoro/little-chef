import { IngredientFormElement } from "@/app/recipes/components/RecipeForm/elements/ingredient";
import { getPrismaClient } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { IngredientTextFormElement } from "./IngredientTextFormElement";

const IngredientsOverview = async () => {
  // const prisma = getPrismaClient();

  return (
    <div>
      <LanguageSelect />
      <Table />
    </div>
  );
};

const LanguageSelect = () => {
  const requestHeaders = headers();

  return <div>{requestHeaders.get("Accept-Language")}</div>;
};

const Table = async () => {
  const prisma = getPrismaClient();

  const ingredients = await prisma.ingredient.findMany({
    include: { name: { include: { language: true } } },
  });

  return (
    <>
      <div className="m-8">
        <IngredientFormElement />
        <hr />
        <IngredientTextFormElement ingredients={ingredients} />
      </div>
      <table className="text-left text-sm">
        <thead>
          <tr className="">
            <th className="p-4 font-medium text-neutral-400">id</th>
            <th className="p-4 font-medium text-neutral-400">Name</th>
            <th className="p-4 font-medium text-neutral-400">publicId</th>
            <th className="p-4 font-medium text-neutral-400">
              Supported Languages
            </th>
            <th className="p-4 font-medium text-neutral-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <TableRow key={ingredient.id} {...ingredient} />
          ))}
        </tbody>
      </table>
    </>
  );
};

const TableRow = ({
  id,
  publicId,
  name,
}: Prisma.IngredientGetPayload<{
  include: { name: { include: { language: true } } };
}>) => {
  const highlightCount = 2;
  const highlightedLanguages = name
    .slice(0, highlightCount)
    .map((lang) => lang.language);
  const hasRemainingLanguages = name.length - highlightCount > 0;

  const preferredName =
    name.find((name) => name.language.code === "de")?.name ?? name.pop()?.name;

  return (
    <tr className="border-t">
      <td className="p-4">{id}</td>
      <td className="p-4">{preferredName}</td>
      <td className="p-4">{publicId}</td>
      <td className="p-4">
        <div className="flex flex-wrap">
          {highlightedLanguages.map((lang) => (
            <div
              className="py-1 px-2 rounded-2xl text-white bg-black text-xs font-medium"
              key={lang.code}
            >
              {lang.name}
            </div>
          ))}
          {hasRemainingLanguages && (
            <div className="py-1 px-2 rounded-2xl text-white bg-black text-xs font-medium">
              +{name.length} more
            </div>
          )}
        </div>
      </td>
      <td className="p-4">
        <button className="focus:underline hover:underline font-medium">
          View Details
        </button>
      </td>
    </tr>
  );
};

export default IngredientsOverview;
