import type { Connection } from "@/drizzle/db";
import { appPreferences } from "@/drizzle/schema";
import { AppPreferencesRepository } from "@/lib/application/abstractions/user/app-preferences-repository";
import type { Result } from "@/lib/domain/shared/result";
import type { AppPreferences } from "@/lib/domain/user/app-preferences";
import { eq } from "drizzle-orm";

export class DrizzleAppPreferencesRepository implements AppPreferencesRepository {
  constructor(private readonly connection: Connection) {}

  async findById(id: number): Promise<Result<AppPreferences>> {
    const [preferences] = await this.connection
      .select()
      .from(appPreferences)
      .where(eq(appPreferences.id, id))
      .limit(1);

    if (!preferences) {
      return {
        ok: false,
        error: new Error("App preferences not found"),
      };
    }

    return { ok: true, value: preferences };
  }

  async findByUserId(id: number): Promise<Result<AppPreferences>> {
    const [preferences] = await this.connection
      .select()
      .from(appPreferences)
      .where(eq(appPreferences.id, id))
      .limit(1);

    if (!preferences) {
      return {
        ok: false,
        error: new Error("App preferences not found"),
      };
    }

    return { ok: true, value: preferences };
  }

  async create(dto: AppPreferences): Promise<Result<AppPreferences>> {
    const [preferences] = await this.connection
      .insert(appPreferences)
      .values(dto)
      .returning();

    if (!preferences) {
      return {
        ok: false,
        error: new Error("Failed to create app preferences"),
      };
    }

    return { ok: true, value: preferences };
  }
}
