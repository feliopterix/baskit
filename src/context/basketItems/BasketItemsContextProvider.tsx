import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { DBContext } from "../database/DBContextProvider";
import { FromDBIngredient } from "../../helper/FromDBIngredient";
import { normalizeIngredient } from "../../helper/NormalizeIngredient";
import { ToDBIngredient } from "../../helper/ToDBIngredient";
import { IBaskitIngredient, IBaskitRecipe, IIngredient, IRecipe } from "../../types";

type RecipeForBasket = IRecipe & { id?: string };

type BasketItemContextType = {
  basketItems: IBaskitIngredient[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addRecipeToBasket: (
    recipe: RecipeForBasket,
    selectedIngredients?: IIngredient[]
  ) => Promise<void>;
  markRecipeDeleted: (recipe: IBaskitRecipe) => Promise<void>;
  addItem: (ingredient: IIngredient) => Promise<void>;
  modifyItem: (overwriteIngredient: IBaskitIngredient) => Promise<void>;
  setGroupChecked: (
    ingredients: IBaskitIngredient[],
    checked: boolean
  ) => Promise<void>;
  clearAllItems: () => Promise<void>;
};

const BasketItemContext = createContext<BasketItemContextType | null>(null);

export const useBasketItemContext = () => {
  const value = useContext(BasketItemContext);
  if (!value) {
    throw new Error("BasketItemContext is not available.");
  }
  return value;
};

export function BasketItemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const database = useContext(DBContext);
  const [basketItems, setBasketItems] = useState<IBaskitIngredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!database) return;

    setLoading(true);
    setError(null);

    try {
      const result = await database.executeQuery(
        "SELECT * FROM items ORDER BY createdAt ASC, id ASC"
      );
      setBasketItems(result.rows._array.map((row) => FromDBIngredient(row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Basket konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [database]);

  useEffect(() => {
    reload();
  }, [reload]);

  const insertIngredientRow = useCallback(
    async (ingredient: IIngredient, recipe: RecipeForBasket | null) => {
      if (!database) {
        throw new Error("Database not available in BasketItemContextProvider.");
      }

      const normalizedIngredient = normalizeIngredient(ingredient);
      if (!normalizedIngredient) return;

      const basketGroupId = v4();
      const row = ToDBIngredient(normalizedIngredient, {
        basketGroupId,
        sourceKind: recipe ? "recipe" : "custom",
        sourceRecipeId: recipe?.id ?? null,
        sourceRecipeTitle: recipe?.title ?? "Eigen",
        recipeId: recipe?.id ?? "__CUSTOM__",
      });

      if (!row) return;

      await database.executeQuery(
        `
          INSERT INTO items (
            id,
            name,
            unit,
            count,
            recipeId,
            basketGroupId,
            sourceKind,
            sourceRecipeId,
            sourceRecipeTitle,
            sourceRecipeDeleted,
            checked,
            markedAsDeleted,
            createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          row.id,
          row.name,
          row.unit,
          row.count,
          row.recipeId,
          row.basketGroupId,
          row.sourceKind,
          row.sourceRecipeId,
          row.sourceRecipeTitle,
          row.sourceRecipeDeleted,
          row.checked,
          row.markedAsDeleted,
          row.createdAt,
        ]
      );
    },
    [database]
  );

  const addRecipeToBasket = useCallback(
    async (recipe: RecipeForBasket, selectedIngredients?: IIngredient[]) => {
      if (!database) return;

      const ingredients = (selectedIngredients ?? recipe.ingredients)
        .map((ingredient) => normalizeIngredient(ingredient))
        .filter((ingredient): ingredient is IIngredient => ingredient !== null);

      if (ingredients.length === 0) return;

      setError(null);

      try {
        for (const ingredient of ingredients) {
          await insertIngredientRow(ingredient, recipe);
        }
        await reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Rezept konnte nicht in den Basket uebernommen werden.");
      }
    },
    [database, insertIngredientRow, reload]
  );

  const addItem = useCallback(
    async (ingredient: IIngredient) => {
      if (!database) return;

      const normalizedIngredient = normalizeIngredient(ingredient);
      if (!normalizedIngredient) return;

      setError(null);

      try {
        await insertIngredientRow(normalizedIngredient, null);
        await reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Eigener Eintrag konnte nicht gespeichert werden.");
      }
    },
    [database, insertIngredientRow, reload]
  );

  const modifyItem = useCallback(
    async (overwriteIngredient: IBaskitIngredient) => {
      if (!database) return;

      try {
        await database.executeQuery(
          `
            UPDATE items
            SET checked = ?,
                markedAsDeleted = ?,
                sourceRecipeTitle = ?,
                sourceRecipeDeleted = ?
            WHERE id = ?
          `,
          [
            overwriteIngredient.checked ? 1 : 0,
            overwriteIngredient.markedAsDeleted ? 1 : 0,
            overwriteIngredient.sourceRecipeTitle,
            overwriteIngredient.sourceRecipeDeleted ? 1 : 0,
            overwriteIngredient.id,
          ]
        );
        await reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Basket-Eintrag konnte nicht aktualisiert werden.");
      }
    },
    [database, reload]
  );

  const setGroupChecked = useCallback(
    async (ingredients: IBaskitIngredient[], checked: boolean) => {
      if (!database || ingredients.length === 0) return;

      try {
        for (const ingredient of ingredients) {
          await database.executeQuery("UPDATE items SET checked = ? WHERE id = ?", [
            checked ? 1 : 0,
            ingredient.id,
          ]);
        }
        await reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Basket-Status konnte nicht aktualisiert werden.");
      }
    },
    [database, reload]
  );

  const markRecipeDeleted = useCallback(
    async (recipe: IBaskitRecipe) => {
      if (!database) return;

      try {
        await database.executeQuery(
          `
            UPDATE items
            SET sourceRecipeDeleted = 1,
                sourceRecipeTitle = ?
            WHERE sourceRecipeId = ?
          `,
          [`${recipe.title} (geloescht)`, recipe.id]
        );
        await reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Rezept-Snapshots konnten nicht aktualisiert werden.");
      }
    },
    [database, reload]
  );

  const clearAllItems = useCallback(async () => {
    if (!database) return;

    try {
      await database.executeQuery("DELETE FROM items");
      setBasketItems([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Basket konnte nicht geleert werden.");
    }
  }, [database]);

  const contextObject = useMemo(
    () => ({
      basketItems,
      loading,
      error,
      reload,
      addRecipeToBasket,
      markRecipeDeleted,
      addItem,
      modifyItem,
      setGroupChecked,
      clearAllItems,
    }),
    [
      basketItems,
      loading,
      error,
      reload,
      addRecipeToBasket,
      markRecipeDeleted,
      addItem,
      modifyItem,
      setGroupChecked,
      clearAllItems,
    ]
  );

  return (
    <BasketItemContext.Provider value={contextObject}>
      {children}
    </BasketItemContext.Provider>
  );
}
