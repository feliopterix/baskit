import { IIngredient } from "../general/IIngredient.types";

export type BasketSourceKind = "recipe" | "custom";

export type IBaskitIngredient = IIngredient & {
    id: string;
    recipeId: string | "__CUSTOM__";
    basketGroupId: string;
    sourceKind: BasketSourceKind;
    sourceRecipeId: string | null;
    sourceRecipeTitle: string | null;
    sourceRecipeDeleted: boolean;
    checked: boolean;
    markedAsDeleted: boolean;
};
