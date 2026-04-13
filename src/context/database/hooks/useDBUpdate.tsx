import { useCallback, useContext } from "react";
import { ISQLiteUpdate, ISQLiteWhere } from "../../../types/db";
import { DBContext } from "../DBContextProvider";
import type { SQLResultSet } from "../../../db/database";

export default function useDBUpdate(name: string) {
  const database = useContext(DBContext);

  const update = useCallback(async (
    newVal: ISQLiteUpdate,
    where: ISQLiteWhere
  ): Promise<SQLResultSet> => {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject(new Error("Database not available in useDBUpdate. Aborting..."));
        return;
      }
      const sql = `UPDATE ${name} SET ${newVal.column}=? WHERE ${where.field}${where.conditional}?;`;
      database
        .executeQuery(sql, [newVal.value, where.value])
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, [database, name]);

  return update;
}
