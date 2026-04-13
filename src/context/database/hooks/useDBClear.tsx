import { useCallback, useContext } from "react";
import { DBContext } from "../DBContextProvider";
import type { SQLResultSet } from "../../../db/database";

export default function useDBClear(dbName: string) {
  const database = useContext(DBContext);

  const clear = useCallback(async (): Promise<SQLResultSet> => {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject(new Error("Database not available in useDBClear. Aborting..."));
        return;
      }
      const sql = `DELETE FROM ${dbName}`;
      database
        .executeQuery(sql, [])
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, [database, dbName]);

  return clear;
}
