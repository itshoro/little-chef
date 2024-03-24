"use client";

import type { Recipe } from "@prisma/client";
import Link from "next/link";
import { DeleteWithDialogButton } from "../Button/DeleteWithDialogButton";
import { deleteRecipe } from "@/lib/recipes/actions/delete";

const Overview = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="flex justify-between">
      <Link
        className="inline-flex items-center gap-1 text-black hover:text-stone-500 motion-reduce:transition-none transition ease-out font-medium p-1"
        href={`/recipes/${recipe.publicId}/overview`}
      >
        {recipe.name}
      </Link>
      <div className="space-x-2">
        <Delete publicId={recipe.publicId} />
        <Edit publicId={recipe.publicId} />
      </div>
    </div>
  );
};

const Delete = ({ publicId }: { publicId: Recipe["publicId"] }) => (
  <DeleteWithDialogButton onDelete={async () => await deleteRecipe(publicId)} />
);

const Edit = ({ publicId }: { publicId: Recipe["publicId"] }) => {
  return (
    <Link
      className="inline-flex px-3 text-sm items-center gap-1 bg-stone-50 border hover:bg-stone-200 hover:shadow-inner text-stone-600 rounded-full transition ease-out motion-reduce:transition-none font-medium p-1"
      href={`/recipes/${publicId}/edit`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
      </svg>
      Edit
    </Link>
  );
};

export { Overview as RecipeOverview };
