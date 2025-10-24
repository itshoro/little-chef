import type { Connection } from "@/drizzle/db";
import { collectionPreferences } from "@/drizzle/schema";
import type { Result } from "@/lib/domain/shared/result";
import type { CollectionPreferences } from "@/lib/domain/user/collection-preferences";
import { CollectionPreferencesRepository } from "@/lib/domain/user/collection-preferences-repository";
import { eq } from "drizzle-orm";

export class DrizzleCollectionPreferencesRepository
  implements CollectionPreferencesRepository
{
  constructor(private readonly connection: Connection) {}

  async findById(id: number): Promise<CollectionPreferences> {
    const [preferences] = await this.connection
      .select()
      .from(collectionPreferences)
      .where(eq(collectionPreferences.id, id))
      .limit(1);

    return preferences satisfies CollectionPreferences;
  }

  async create(dto: CollectionPreferences): Promise<CollectionPreferences> {
    const [preferences] = await this.connection
      .insert(collectionPreferences)
      .values(dto)
      .returning();

    return preferences satisfies CollectionPreferences;
  }

  async update(dto: CollectionPreferences): Promise<Result<void, Error>> {
    await this.connection
      .update(collectionPreferences)
      .set(dto)
      .where(eq(collectionPreferences.id, dto.id));

    return { ok: true, value: undefined };
  }
}
