import type { Connection } from "@/drizzle/db";
import { collectionPreferences } from "@/drizzle/schema";
import { CollectionPreferencesRepository } from "@/lib/application/abstractions/user/collection-preferences-repository";
import type { Result } from "@/lib/domain/shared/result";
import type { CollectionPreferences } from "@/lib/domain/user/collection-preferences";
import { eq, type InferInsertModel } from "drizzle-orm";

export class DrizzleCollectionPreferencesRepository implements CollectionPreferencesRepository {
  constructor(private readonly connection: Connection) {}

  async findById(id: number): Promise<Result<CollectionPreferences>> {
    const [preferences] = await this.connection
      .select()
      .from(collectionPreferences)
      .where(eq(collectionPreferences.id, id))
      .limit(1);

    if (!preferences) {
      return {
        ok: false,
        error: new Error("Collection preferences not found"),
      };
    }

    return { ok: true, value: preferences };
  }

  async findByUserId(id: number): Promise<Result<CollectionPreferences>> {
    const [preferences] = await this.connection
      .select()
      .from(collectionPreferences)
      .where(eq(collectionPreferences.id, id))
      .limit(1);

    if (!preferences) {
      return {
        ok: false,
        error: new Error("Collection preferences not found"),
      };
    }

    return { ok: true, value: preferences };
  }

  async create(
    dto: CollectionPreferences,
  ): Promise<Result<CollectionPreferences>> {
    const [preferences] = await this.connection
      .insert(collectionPreferences)
      .values(dto)
      .returning();

    if (!preferences) {
      return {
        ok: false,
        error: new Error("Collection preferences not found"),
      };
    }

    return { ok: true, value: preferences };
  }

  async update(preferences: CollectionPreferences): Promise<Result<void>> {
    const dto: Omit<
      Required<InferInsertModel<typeof collectionPreferences>>,
      "id" | "userId"
    > = {
      defaultVisibility: preferences.defaultVisibility,
    };

    await this.connection
      .update(collectionPreferences)
      .set(dto)
      .where(eq(collectionPreferences.id, preferences.id));

    return { ok: true, value: undefined };
  }
}
