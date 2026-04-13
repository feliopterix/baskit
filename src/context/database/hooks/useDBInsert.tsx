import { useCallback, useContext } from "react";
import { DBContext } from "../DBContextProvider";
import type { SQLResultSet } from "../../../db/database";

export default function useDBInsert(dbName: string) {
  const database = useContext(DBContext);

  const insert = useCallback(async (
    fields: string[],
    variables: any[]
  ): Promise<SQLResultSet> => {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject(new Error("Database not available in useDBInsert. Aborting..."));
        return;
      }
      const sql = `
                INSERT INTO ${dbName} (${fields.join(",")}) 
                values (${fields.map(() => "?").join(",")});
            `;
      database
        .executeQuery(sql, variables)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, [database, dbName]);

  return insert;
}
