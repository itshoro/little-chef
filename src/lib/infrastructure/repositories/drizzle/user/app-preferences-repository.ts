import type { Connection } from "@/drizzle/db";
import { appPreferences } from "@/drizzle/schema";
import type { AppPreferences } from "@/lib/domain/user/app-preferences";
import { AppPreferencesRepository } from "@/lib/domain/user/app-preferences-repository";
import { eq } from "drizzle-orm";

export class DrizzleAppPreferencesRepository
  implements AppPreferencesRepository
{
  constructor(private readonly connection: Connection) {}

  async findById(id: number): Promise<AppPreferences> {
    const [preferences] = await this.connection
      .select()
      .from(appPreferences)
      .where(eq(appPreferences.id, id))
      .limit(1);

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
