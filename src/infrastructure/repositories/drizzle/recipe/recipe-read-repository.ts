import type { Recipe, RecipeDetail } from "@/domain/recipe/recipe";
import type {
  RecipeListOptions,
  RecipeReadRepository,
} from "@/application/abstractions/recipe/recipe-read-repository";
import type { Step } from "@/domain/recipe/step";
import type { Collaborator } from "@/domain/shared/collaborator";
import type { FileReference } from "@/domain/shared/file-reference";
import type { User } from "@/domain/user/user";
import type { Connection } from "@/drizzle/db";
import {
  fileReference,
  recipes,
  recipeSteps,
  recipeUserPermissions,
  users,
  type RecipeIdentifier,
} from "@/drizzle/schema";
import { and, eq, inArray, like, or } from "drizzle-orm";

export class DrizzleRecipeReadRepository implements RecipeReadRepository {
  constructor(private readonly db: Connection) {}

  async list(options: RecipeListOptions, user: User | null): Promise<Recipe[]> {
    options.pagination ??= { page: 1, pageSize: 20 };

    const whereConditions: any[] = [
      or(
        inArray(recipes.visibility, ["public", "unlisted"]),
        user?.id ? eq(recipeUserPermissions.userId, user.id) : undefined,
      ),
    ];

    if (options.search?.query) {
      const q = `%${options.search.query}%`;
      whereConditions.push(
        or(like(recipes.name, q), like(recipes.description, q)),
      );
    }

    const recipesResult = await this.db
      .selectDistinct()
      .from(recipes)
      .leftJoin(
        recipeUserPermissions,
        eq(recipes.id, recipeUserPermissions.recipeId),
      )
      .where(and(...whereConditions))
      .offset((options.pagination.page - 1) * options.pagination.pageSize)
      .limit(options.pagination.pageSize);

    if (recipesResult.length === 0) return [];

    const recipeIds = recipesResult.map((r) => r.recipes.id);
    const coverIds = recipesResult
      .map((r) => r.recipes.coverId)
      .filter((c) => c !== null);

    const [collaboratorsByRecipe, stepsByRecipe, fileReferencesMap] =
      await Promise.all([
        this.findCollaborators(recipeIds),
        this.findSteps(recipeIds),
        this.findFileReferences(coverIds),
      ]);

    return recipesResult.map((r) => ({
      ...r.recipes,
      cover: r.recipes.coverId
        ? (fileReferencesMap.get(r.recipes.coverId) ?? null)
        : null,
      collaborators: collaboratorsByRecipe.get(r.recipes.id) ?? [],
      steps: stepsByRecipe.get(r.recipes.id) ?? [],
    }));
  }

  async findByIdentifier(
    identifier: RecipeIdentifier,
    user?: User | null,
  ): Promise<RecipeDetail | null> {
    const [result] = await this.db
      .select()
      .from(recipes)
      .leftJoin(
        recipeUserPermissions,
        and(eq(recipes.id, recipeUserPermissions.recipeId)),
      )
      .where(
        and(
          "id" in identifier
            ? eq(recipes.id, identifier.id)
            : eq(recipes.publicId, identifier.publicId),
          or(
            inArray(recipes.visibility, ["public", "unlisted"]),
            user?.id ? eq(recipeUserPermissions.userId, user.id) : undefined,
          ),
        ),
      );

    if (!result) return null;

    const [collaborators, steps, cover] = await Promise.all([
      this.findCollaborators([result.recipes.id]),
      this.findSteps([result.recipes.id]),
      result.recipes.coverId
        ? this.findFileReferences([result.recipes.coverId]).then(
            (map) => map.get(result.recipes.coverId!) ?? null,
          )
        : Promise.resolve(null),
    ]);

    return {
      ...result.recipes,
      cover,
      collaborators: collaborators.get(result.recipes.id) ?? [],
      steps: steps.get(result.recipes.id) ?? [],
    };
  }

  private async findCollaborators(
    recipeIds: Recipe["id"][],
  ): Promise<Map<Recipe["id"], Collaborator[]>> {
    const collaboratorsResult = await this.db
      .select({
        recipeId: recipeUserPermissions.recipeId,
        role: recipeUserPermissions.role,
        user: users,
      })
      .from(recipeUserPermissions)
      .innerJoin(users, eq(recipeUserPermissions.userId, users.id))
      .where(
        and(
          inArray(recipeUserPermissions.recipeId, recipeIds),
          inArray(recipeUserPermissions.role, [
            "owner",
            "editor",
            "maintainer",
          ]),
        ),
      );

    const collaboratorsByRecipe = new Map<Recipe["id"], Collaborator[]>();
    for (const c of collaboratorsResult) {
      const arr = collaboratorsByRecipe.get(c.recipeId) ?? [];
      arr.push({ role: c.role, user: c.user as User });
      collaboratorsByRecipe.set(c.recipeId, arr);
    }

    return collaboratorsByRecipe;
  }

  private async findSteps(
    recipeIds: Recipe["id"][],
  ): Promise<Map<Recipe["id"], Step[]>> {
    const stepsResult = await this.db
      .select()
      .from(recipeSteps)
      .where(inArray(recipeSteps.recipeId, recipeIds));

    const stepsByRecipe = new Map<Recipe["id"], Step[]>();
    for (const s of stepsResult) {
      const arr = stepsByRecipe.get(s.recipeId) ?? [];
      arr.push({ description: s.description, order: s.order });
      stepsByRecipe.set(s.recipeId, arr);
    }
    return stepsByRecipe;
  }

  private async findFileReferences(
    fileReferenceIds: FileReference["id"][],
  ): Promise<Map<FileReference["id"], FileReference>> {
    const fileReferencesMap = new Map<FileReference["id"], FileReference>();
    if (fileReferenceIds.length > 0) {
      const fileReferences = await this.db
        .select()
        .from(fileReference)
        .where(inArray(fileReference.id, fileReferenceIds));
      for (const f of fileReferences) fileReferencesMap.set(f.id, f);
    }

    return fileReferencesMap;
  }
}
