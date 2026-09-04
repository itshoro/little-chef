import type { Role } from "@/lib/domain/shared/role";
import { parseHandle } from "@/lib/slug";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { getRecipeDetail } from "@/lib/utils/recipe/get-recipe-detail";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { CollaboratorRow } from "./collaborator-row";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import { Button } from "@/components/ui/buttons/button";

const Page = async (props: { params: Promise<{ handle: string }> }) => {
  const params = await props.params;

  const { user } = await validateSession();
  if (!user) unauthorized();

  const { publicId } = parseHandle(params.handle);
  const recipeResult = await getRecipeDetail({ publicId }, user);
  if (!recipeResult.ok) notFound();

  const userPermissions = recipeResult.value.collaborators.find(
    (c) => c.user.publicId === user.publicId,
  ) as CurrentCollaborator | undefined;
  if (
    !userPermissions ||
    (["viewer", "editor"] satisfies Role[] as Role[]).includes(
      userPermissions.role,
    )
  ) {
    forbidden();
  }

  return (
    <main className="">
      <header className="mb-2 flex items-center justify-between px-4">
        <h1 className="text-sm font-medium text-stone-400">Permissions</h1>
        <Button variant="secondary">Add new user</Button>
      </header>
      <hr className="text-white/5" />
      <table className="w-full table-auto">
        <thead className="border-b border-white/5">
          <tr>
            <th className="py-2 pl-4 text-left text-sm font-normal text-stone-400">
              User
            </th>
            <th className="py-2 text-left text-sm font-normal text-stone-400">
              Role
            </th>
            <th className="sr-only py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipeResult.value.collaborators.map((c) => (
            <tr key={c.user.publicId}>
              <CollaboratorRow
                collaborator={c}
                modifiable={canModify(userPermissions, c)}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

// branded type so that we don't pass the regular collaborator as first parameter on accident when refactoring.
type CurrentCollaborator = Collaborator & { __brand: "CurrentCollaborator" };

function canModify(
  userPermissions: CurrentCollaborator,
  collaborator: Collaborator,
) {
  if (collaborator.role === "owner") return false;
  if (userPermissions.role === "owner" || userPermissions.role === "maintainer")
    return true;

  return true;
}

export default Page;
