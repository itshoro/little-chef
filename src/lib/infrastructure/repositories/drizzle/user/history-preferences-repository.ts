import type { Connection } from "@/drizzle/db";
import { historyPreferences } from "@/drizzle/schema";
import type { HistoryPreferencesRepository } from "@/lib/application/abstractions/user/history-preferences-repository";
import type { Result } from "@/lib/domain/shared/result";
import type { HistoryPreferences } from "@/lib/domain/user/history-preferences";
import { eq, type InferInsertModel } from "drizzle-orm";

export class DrizzleHistoryPreferencesRepository implements HistoryPreferencesRepository {
  constructor(private readonly db: Connection) {}

  async findById(id: number): Promise<Result<HistoryPreferences>> {
    const [preferences] = await this.db
      .select()
      .from(historyPreferences)
      .where(eq(historyPreferences.id, id))
      .limit(1);

    if (!preferences) {
      return {
        ok: false,
        error: new Error("History preferences not found"),
      };
    }

    return { ok: true, value: preferences };
  }

  async findByUserId(id: number): Promise<Result<HistoryPreferences>> {
    const [preferences] = await this.db
      .select()
      .from(historyPreferences)
      .where(eq(historyPreferences.userId, id))
      .limit(1);

    if (!preferences) {
      return {
        ok: false,
        error: new Error("History preferences not found"),
      };
    }

    return { ok: true, value: preferences };
  }

  async create(
    dto: Omit<HistoryPreferences, "id">,
  ): Promise<Result<HistoryPreferences>> {
    const [preferences] = await this.db
      .insert(historyPreferences)
      .values(dto)
      .returning();

    if (!preferences) {
      return {
        ok: false,
        error: new Error("Failed to create history preferences"),
      };
    }

    return { ok: true, value: preferences };
  }

  async update(preferences: HistoryPreferences): Promise<Result<void>> {
    const dto: Omit<
      Required<InferInsertModel<typeof historyPreferences>>,
      "id" | "userId"
    > = {
      recipeTrackingEnabled: preferences.recipeTrackingEnabled,
    };

    await this.db
      .update(historyPreferences)
      .set(dto)
      .where(eq(historyPreferences.id, preferences.id));

    return { ok: true, value: undefined };
  }
}
