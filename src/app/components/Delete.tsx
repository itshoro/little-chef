"use client";

import type { Recipe } from "@prisma/client";
import { DeleteWithDialogButton } from "./Button/DeleteWithDialogButton";
import { deleteRecipe } from "@/lib/recipes/actions/delete";

type DeleteProps = {
  publicId: Recipe["publicId"];
};

const Delete = ({ publicId }: DeleteProps) => (
  <DeleteWithDialogButton onDelete={async () => await deleteRecipe(publicId)} />
);

export { Delete };
