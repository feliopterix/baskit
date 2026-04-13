import { describe, expect, it, vi } from "vitest";

import { migrateDatabase } from "../../src/db/migrations";
import { SCHEMA_ITEMS, SCHEMA_RECIPES } from "../../src/db/schemas";

type FakeRowList<T> = {
  _array: T[];
  item: (index: number) => T;
};

const createRows = <T,>(rows: T[]): FakeRowList<T> => ({
  _array: rows,
  item: (index: number) => rows[index],
});

const createResult = <T,>(rows: T[] = []) => ({
  insertId: null,
  rowsAffected: 0,
  rows: createRows(rows),
});

describe("migrateDatabase", () => {
  it("creates tables, adds missing item columns and normalizes legacy rows", async () => {
    const createTables = vi.fn().mockResolvedValue([]);
    const executeQuery = vi.fn(async (query: string) => {
      if (query === "PRAGMA user_version") {
        return createResult([{ user_version: 0 }]);
      }

      if (query === "PRAGMA table_info(items)") {
        return createResult([{ name: "id" }, { name: "name" }, { name: "unit" }]);
      }

      return createResult();
    });

    await migrateDatabase({
      createTables,
      executeQuery,
    } as any);

    expect(createTables).toHaveBeenCalledWith([SCHEMA_RECIPES, SCHEMA_ITEMS]);
    expect(executeQuery).toHaveBeenCalledWith(
      "ALTER TABLE items ADD COLUMN basketGroupId TEXT NOT NULL DEFAULT ''"
    );
    expect(executeQuery).toHaveBeenCalledWith(
      "ALTER TABLE items ADD COLUMN sourceKind TEXT NOT NULL DEFAULT 'recipe'"
    );
    expect(executeQuery).toHaveBeenCalledWith(
      "ALTER TABLE items ADD COLUMN sourceRecipeId TEXT"
    );
    expect(executeQuery).toHaveBeenCalledWith(
      "ALTER TABLE items ADD COLUMN sourceRecipeTitle TEXT"
    );
    expect(executeQuery).toHaveBeenCalledWith(
      "ALTER TABLE items ADD COLUMN sourceRecipeDeleted INTEGER NOT NULL DEFAULT 0"
    );
    expect(executeQuery).toHaveBeenCalledWith(
      "ALTER TABLE items ADD COLUMN checked INTEGER NOT NULL DEFAULT 0"
    );
    expect(executeQuery).toHaveBeenCalledWith(
      "ALTER TABLE items ADD COLUMN markedAsDeleted INTEGER NOT NULL DEFAULT 0"
    );
    expect(executeQuery).toHaveBeenCalledWith(
      "ALTER TABLE items ADD COLUMN createdAt INTEGER NOT NULL DEFAULT 0"
    );

    const calledQueries = executeQuery.mock.calls.map(([query]) => query);
    expect(
      calledQueries.some((query: string) =>
        query.includes("UPDATE items") && query.includes("SET sourceKind = CASE")
      )
    ).toBe(true);
    expect(
      calledQueries.some((query: string) =>
        query.includes("UPDATE items") && query.includes("SET basketGroupId = CASE")
      )
    ).toBe(true);
    expect(calledQueries).toContain("PRAGMA user_version = 2");
  });

  it("skips legacy migration work when schema is already current", async () => {
    const createTables = vi.fn().mockResolvedValue([]);
    const executeQuery = vi.fn(async (query: string) => {
      if (query === "PRAGMA user_version") {
        return createResult([{ user_version: 2 }]);
      }

      return createResult();
    });

    await migrateDatabase({
      createTables,
      executeQuery,
    } as any);

    expect(createTables).toHaveBeenCalledWith([SCHEMA_RECIPES, SCHEMA_ITEMS]);
    const calledQueries = executeQuery.mock.calls.map(([query]) => query);
    expect(calledQueries).toEqual(["PRAGMA user_version", "PRAGMA user_version = 2"]);
  });
});
