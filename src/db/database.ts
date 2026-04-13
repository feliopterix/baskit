import {
  openDatabaseAsync,
  type SQLiteDatabase,
  type SQLiteRunResult,
} from "expo-sqlite";

export type SQLResultSetRowList<T = any> = {
  _array: T[];
  length: number;
  item: (index: number) => T;
};

export type SQLResultSet<T = any> = {
  insertId: number | null;
  rowsAffected: number;
  rows: SQLResultSetRowList<T>;
};

export type SQLError = Error;

const createRowList = <T>(rows: T[]): SQLResultSetRowList<T> => ({
  _array: rows,
  length: rows.length,
  item: (index: number) => rows[index],
});

const createResult = <T>(
  rows: T[] = [],
  runResult?: Partial<SQLiteRunResult>
): SQLResultSet<T> => ({
  insertId: runResult?.lastInsertRowId ?? null,
  rowsAffected: runResult?.changes ?? 0,
  rows: createRowList(rows),
});

export default class Database {
  private name: string;
  private version: string;
  private DB: SQLiteDatabase | null = null;
  private storedRequests: {
    query: string;
    values?: any[];
    resolve: (value: SQLResultSet | PromiseLike<SQLResultSet>) => void;
    reject: (reason?: any) => void;
  }[] = [];

  constructor(name: string, version: string) {
    this.name = name;
    this.version = version;
  }

  public async InitDB(): Promise<SQLiteDatabase> {
    this.DB = await openDatabaseAsync(this.name + this.version);
    return this.DB;
  }

  public OnReady(): void {
    const pendingRequests = [...this.storedRequests];
    this.storedRequests = [];

    pendingRequests.forEach(({ query, values, resolve, reject }) => {
      this.executeQuery(query, values).then(resolve).catch(reject);
    });
  }

  async createTables(queries: string[]): Promise<SQLResultSet[]> {
    return Promise.all(
      queries.map(async (query) => {
        return new Promise<SQLResultSet>((resolve, reject) => {
          this.executeQuery(query, [])
            .then((response) => resolve(response))
            .catch((err) => reject(err));
        });
      })
    );
  }

  async executeQuery(
    query: string,
    values?: any[]
  ): Promise<SQLResultSet> {
    return new Promise(async (resolve, reject) => {
      if (!this.DB) {
        console.log("Database not initialized yet. Storing request...");
        this.storedRequests.push({ query, values, resolve, reject });
        return;
      }

      try {
        const normalizedQuery = query.trim();
        const parameters = values || [];

        if (/^(SELECT|PRAGMA)/i.test(normalizedQuery)) {
          const rows = await this.DB.getAllAsync(normalizedQuery, parameters);
          resolve(createResult(rows));
          return;
        }

        const result = await this.DB.runAsync(normalizedQuery, parameters);
        resolve(createResult([], result));
      } catch (err) {
        reject(err);
      }
    });
  }
}
