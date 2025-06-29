import { or, sql } from "drizzle-orm";

import { collections, recipes } from "@/drizzle/schema";
import type { SQLiteColumn, SQLiteSelect } from "drizzle-orm/sqlite-core";

type PaginationOptions = {
  page: number;
  pageSize: number;
};

type InternalSearchOptions = {
  query: string;
  columns: SQLiteColumn[];
};

export type SearchOptions = Omit<InternalSearchOptions, "columns">;

export type InternalListFilterOptions = {
  pagination?: PaginationOptions;
  search?: InternalSearchOptions;
};

export type ListQueryOptions = {
  pagination?: PaginationOptions;
  search?: SearchOptions;
};

export function withRecipeQueryOptions<T extends SQLiteSelect>(
  queryBuilder: T,
  options: ListQueryOptions,
): T {
  if (options.search) {
    queryBuilder = withSearch(queryBuilder, {
      ...options.search,
      columns: [recipes.name, recipes.description],
    });
  }

  const pagination = options.pagination ?? { page: 1, pageSize: 20 };
  queryBuilder = withPagination(queryBuilder, pagination);

  return queryBuilder;
}

export function withCollectionQueryOptions<T extends SQLiteSelect>(
  queryBuilder: T,
  options: ListQueryOptions,
) {
  if (options.search) {
    queryBuilder = withSearch(queryBuilder, {
      ...options.search,
      columns: [collections.name],
    });
  }

  const pagination = options.pagination ?? { page: 1, pageSize: 20 };
  queryBuilder = withPagination(queryBuilder, pagination);

  return queryBuilder;
}

export function withPagination<T extends SQLiteSelect>(
  queryBuilder: T,
  options: PaginationOptions,
): T {
  const limit = options.pageSize;
  const offset = (options.page - 1) * options.pageSize;

  return queryBuilder.limit(limit).offset(offset);
}

export function withSearch<T extends SQLiteSelect>(
  queryBuilder: T,
  options: InternalSearchOptions,
): T {
  const searchPattern = `%${options.query.toLowerCase()}%`;
  const conditions = options.columns.map(
    (col) => sql`lower(${col}) like ${searchPattern}`,
  );

  return queryBuilder.where(or(...conditions));
}
