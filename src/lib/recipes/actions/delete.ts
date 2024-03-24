"use server";
import "server-only";

import { getPrismaClient } from "@/lib/prisma";

async function deleteRecipe(uuid: string) {
  const prisma = getPrismaClient();

  await prisma.recipe.delete({
    where: {
      publicId: uuid,
    },
  });
}

// async function deleteStepsOfRecipe(client: PrismaClient, uuid: string) {
//   await client.$transaction(async (tx) => {
//     await tx.recipeStep.deleteMany({
//       where: {
//         Recipe: { publicId: uuid },
//       },
//     });
//     await tx.step.deleteMany({
//       where: { publicId: { in: recipeDto.steps.map((step) => step.uuid) } },
//     });
//   });
// }

export { deleteRecipe };
