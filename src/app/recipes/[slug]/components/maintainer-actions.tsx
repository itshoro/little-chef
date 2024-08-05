import { deleteRecipe } from "@/lib/dal/recipe";
import { DeleteButton } from "./buttons/delete-button";
import { EditButton } from "./buttons/edit-button";
import { redirect } from "next/navigation";
import { Section } from "./section";

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
    <Section title="Maintainer Actions">
      <div className="flex gap-4">
        <EditButton href={`/recipes/${slug}/edit`} />
        <DeleteButton
          deleteAction={async () => {
            "use server";

            await deleteRecipe(recipe.id);
            redirect("/recipes");
          }}
        />
      </div>
    </Section>
  );
};

export { MaintainerActions };
