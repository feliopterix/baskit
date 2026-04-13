import { IIngredient } from "../types";

const normalizeText = (value: string | null | undefined) => {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
};

export const normalizeIngredient = (
  ingredient: IIngredient
): IIngredient | null => {
  const name = normalizeText(ingredient.name);
  if (!name) return null;

  const unit = normalizeText(ingredient.unit);
  const count =
    typeof ingredient.count === "number" &&
    Number.isFinite(ingredient.count) &&
    ingredient.count > 0
      ? ingredient.count
      : null;

  return {
    name,
    unit,
    count,
  };
};

export const normalizeIngredientNameKey = (value: string | null | undefined) =>
  (normalizeText(value) ?? "").toLocaleLowerCase();

export const normalizeIngredientUnitKey = (value: string | null | undefined) =>
  (normalizeText(value) ?? "").toLocaleLowerCase();

export const createIngredientAggregateKey = (
  ingredient: Pick<IIngredient, "name" | "unit">
) =>
  `${normalizeIngredientNameKey(ingredient.name)}::${normalizeIngredientUnitKey(
    ingredient.unit
  )}`;
