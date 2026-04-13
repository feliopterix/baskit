import { IBaskitIngredient } from "../types";

export const FromDBIngredient = (data: any): IBaskitIngredient => {
  const sourceRecipeId =
    data.sourceRecipeId ??
    data.source_recipe_id ??
    (data.recipeId === "__CUSTOM__" ? null : data.recipeId ?? null);
  const sourceKind =
    data.sourceKind ??
    data.source_kind ??
    (data.recipeId === "__CUSTOM__" ? "custom" : "recipe");
  const sourceRecipeTitle =
    data.sourceRecipeTitle ??
    data.source_recipe_title ??
    (sourceKind === "custom" ? "Eigen" : null);
  const checked = (data.checked ?? 0) !== 0;
  const markedAsDeleted =
    (data.markedAsDeleted ?? data.marked_as_deleted ?? 0) !== 0;

  return {
    id: data.id,
    name: data.name,
    unit: data.unit,
    count: data.count,
    recipeId:
      data.recipeId ??
      (sourceKind === "custom" ? "__CUSTOM__" : sourceRecipeId ?? ""),
    basketGroupId: data.basketGroupId ?? data.basket_group_id ?? data.recipeId,
    sourceKind,
    sourceRecipeId,
    sourceRecipeTitle,
    sourceRecipeDeleted:
      (data.sourceRecipeDeleted ?? data.source_recipe_deleted ?? 0) !== 0,
    checked,
    markedAsDeleted,
  };
};
