import Database from "./database";
import { SCHEMA_ITEMS, SCHEMA_RECIPES } from "./schemas";

export const DB_SCHEMA_VERSION = 2;

type TableColumn = {
  name: string;
  definition: string;
};

const ITEM_COLUMNS: TableColumn[] = [
  { name: "recipeId", definition: "TEXT" },
  { name: "basketGroupId", definition: "TEXT NOT NULL DEFAULT ''" },
  { name: "sourceKind", definition: "TEXT NOT NULL DEFAULT 'recipe'" },
  { name: "sourceRecipeId", definition: "TEXT" },
  { name: "sourceRecipeTitle", definition: "TEXT" },
  { name: "sourceRecipeDeleted", definition: "INTEGER NOT NULL DEFAULT 0" },
  { name: "checked", definition: "INTEGER NOT NULL DEFAULT 0" },
  { name: "markedAsDeleted", definition: "INTEGER NOT NULL DEFAULT 0" },
  { name: "createdAt", definition: "INTEGER NOT NULL DEFAULT 0" },
];

const getUserVersion = async (db: Database) => {
  const result = await db.executeQuery("PRAGMA user_version");
  return Number(result.rows.item(0)?.user_version ?? 0);
};

const setUserVersion = async (db: Database, version: number) => {
  await db.executeQuery(`PRAGMA user_version = ${version}`);
};

const ensureColumn = async (db: Database, tableName: string, column: TableColumn) => {
  const tableInfo = await db.executeQuery(`PRAGMA table_info(${tableName})`);
  const exists = tableInfo.rows._array.some(
    (item) => item.name === column.name
  );

  if (exists) return;
  await db.executeQuery(
    `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.definition}`
  );
};

const normalizeLegacyItems = async (db: Database) => {
  await db.executeQuery(`
    UPDATE items
    SET sourceKind = CASE
      WHEN COALESCE(sourceKind, '') != '' THEN sourceKind
      WHEN recipeId = '__CUSTOM__' THEN 'custom'
      ELSE 'recipe'
    END
  `);

  await db.executeQuery(`
    UPDATE items
    SET sourceRecipeId = CASE
      WHEN COALESCE(sourceRecipeId, '') != '' THEN sourceRecipeId
      WHEN recipeId = '__CUSTOM__' THEN NULL
      ELSE recipeId
    END
  `);

  await db.executeQuery(`
    UPDATE items
    SET sourceRecipeTitle = CASE
      WHEN COALESCE(sourceRecipeTitle, '') != '' THEN sourceRecipeTitle
      WHEN sourceKind = 'custom' THEN 'Eigen'
      ELSE sourceRecipeTitle
    END
  `);

  await db.executeQuery(`
    UPDATE items
    SET sourceRecipeDeleted = CASE
      WHEN sourceRecipeDeleted IN (1, '1', true) THEN 1
      ELSE 0
    END
  `);

  await db.executeQuery(`
    UPDATE items
    SET checked = CASE
      WHEN checked IN (1, '1', true) THEN 1
      ELSE 0
    END
  `);

  await db.executeQuery(`
    UPDATE items
    SET markedAsDeleted = CASE
      WHEN markedAsDeleted IN (1, '1', true) THEN 1
      ELSE 0
    END
  `);

  await db.executeQuery(`
    UPDATE items
    SET basketGroupId = CASE
      WHEN COALESCE(basketGroupId, '') != '' THEN basketGroupId
      WHEN COALESCE(recipeId, '') != '' THEN recipeId
      ELSE id
    END
  `);

  await db.executeQuery(`
    UPDATE items
    SET createdAt = CASE
      WHEN createdAt > 0 THEN createdAt
      ELSE CAST(strftime('%s', 'now') AS INTEGER)
    END
  `);
};

export const migrateDatabase = async (db: Database) => {
  await db.createTables([SCHEMA_RECIPES, SCHEMA_ITEMS]);

  const version = await getUserVersion(db);

  if (version < 2) {
    for (const column of ITEM_COLUMNS) {
      await ensureColumn(db, "items", column);
    }

    await normalizeLegacyItems(db);
    await setUserVersion(db, DB_SCHEMA_VERSION);
    return;
  }

  await setUserVersion(db, DB_SCHEMA_VERSION);
};
