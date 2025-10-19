import type { AppPreferences } from "@/domain/user/app-preferences";
import { AppPreferencesRepository } from "@/domain/user/app-preferences-repository";
import type { Connection } from "@/drizzle/db";
import { appPreferences } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export class DrizzleAppPreferencesRepository
  implements AppPreferencesRepository
{
  constructor(private readonly connection: Connection) {}

  async findById(id: number): Promise<AppPreferences | null> {
    const [preferences] = await this.connection
      .select()
      .from(appPreferences)
      .where(eq(appPreferences.id, id))
      .limit(1);

    if (!preferences) return null;
    return preferences satisfies AppPreferences;
  }

  async create(dto: AppPreferences): Promise<AppPreferences> {
    const [preferences] = await this.connection
      .insert(appPreferences)
      .values(dto)
      .returning();

    return preferences satisfies AppPreferences;
  }
}
