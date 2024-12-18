import { DeleteButton } from "./buttons/delete-button";
import { EditButton } from "./buttons/edit-button";

type MaintainerActionsProps = {
  slug: string;
  maintainers: { publicId: string }[];
  recipe: { id: number };
  user: { publicId: string } | null;
};

const MaintainerActions = ({
  maintainers,
  recipe,
  slug,
  user,
}: MaintainerActionsProps) => {
  const hasMaintainership = maintainers
    .map((maintainer) => maintainer.publicId)
    // @ts-expect-error
    .includes(user?.publicId);

  if (!hasMaintainership) return null;

  return (
    <>
      <EditButton href={`/recipes/${slug}/edit`} />
      <DeleteButton recipeId={recipe.id} />
    </>
  );
};

export { MaintainerActions };
