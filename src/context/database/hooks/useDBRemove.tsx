import { useCallback, useContext } from "react";
import { DBContext } from "../DBContextProvider";
import { ISQLiteWhere } from "../../../types/db";
import type { SQLResultSet } from "../../../db/database";

export default function useDBRemove(dbName: string) {
  const database = useContext(DBContext);

  const remove = useCallback(async (where: ISQLiteWhere): Promise<SQLResultSet> => {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject(new Error("Database not available in useDBRemove. Aborting..."));
        return;
      }
      const sql = `DELETE FROM ${dbName} WHERE ${where.field}${where.conditional}?;`;
      database
        .executeQuery(sql, [where.value])
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, [database, dbName]);

  return remove;
}
