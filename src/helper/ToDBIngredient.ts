import { BasketSourceKind, IIngredient } from "../types";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { normalizeIngredient } from "./NormalizeIngredient";

type ToDBIngredientOptions =
  | string
  | {
      basketGroupId: string;
      sourceKind: BasketSourceKind;
      sourceRecipeId?: string | null;
      sourceRecipeTitle?: string | null;
      sourceRecipeDeleted?: boolean;
      recipeId?: string | "__CUSTOM__";
    };

export const ToDBIngredient = (
  data: IIngredient,
  options: ToDBIngredientOptions
): any => {
  const ingredient = normalizeIngredient(data);
  if (!ingredient) return null;

  const configuration =
    typeof options === "string"
      ? {
          basketGroupId: options,
          sourceKind: options === "__CUSTOM__" ? "custom" : "recipe",
          sourceRecipeId: options === "__CUSTOM__" ? null : options,
          sourceRecipeTitle: options === "__CUSTOM__" ? "Eigen" : null,
          sourceRecipeDeleted: false,
          recipeId: options,
        }
      : {
          basketGroupId: options.basketGroupId,
          sourceKind: options.sourceKind,
          sourceRecipeId: options.sourceRecipeId ?? null,
          sourceRecipeTitle: options.sourceRecipeTitle ?? null,
          sourceRecipeDeleted: options.sourceRecipeDeleted ?? false,
          recipeId:
            options.recipeId ??
            (options.sourceKind === "custom"
              ? "__CUSTOM__"
              : options.sourceRecipeId ?? ""),
        };

  return {
    id: v4(),
    name: ingredient.name,
    unit: ingredient.unit,
    count: ingredient.count,
    recipeId: configuration.recipeId,
    basketGroupId: configuration.basketGroupId,
    sourceKind: configuration.sourceKind,
    sourceRecipeId: configuration.sourceRecipeId,
    sourceRecipeTitle: configuration.sourceRecipeTitle,
    sourceRecipeDeleted: configuration.sourceRecipeDeleted ? 1 : 0,
    checked: 0,
    markedAsDeleted: 0,
    createdAt: Date.now(),
  };
};
