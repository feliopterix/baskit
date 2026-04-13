import { describe, expect, it, vi } from "vitest";

vi.mock("react-native-get-random-values", () => ({}));
vi.mock("uuid", () => ({
  v4: () => "fixed-id",
}));
vi.spyOn(Date, "now").mockReturnValue(1700000000000);

import { FromDBIngredient } from "../../src/helper/FromDBIngredient";
import { FromDBRecipe } from "../../src/helper/FromDBRecipe";
import { ToDBIngredient } from "../../src/helper/ToDBIngredient";
import { ToDBRecipe } from "../../src/helper/ToDBRecipe";

describe("DB transform helpers", () => {
  it("serializes recipes with deterministic IDs and JSON payloads", () => {
    expect(
      ToDBRecipe({
        title: "Pasta",
        image: "file://pasta.png",
        description: "Simple dinner",
        ingredients: [
          { name: "Pasta", count: 1, unit: "Packung" },
          { name: "Salz", count: null, unit: null },
        ],
        instructions: ["Wasser kochen", "Alles mischen"],
      }),
    ).toEqual({
      id: "fixed-id",
      title: "Pasta",
      image: "file://pasta.png",
      description: "Simple dinner",
      ingredients: JSON.stringify([
        { name: "Pasta", count: 1, unit: "Packung" },
        { name: "Salz", count: null, unit: null },
      ]),
      instructions: JSON.stringify(["Wasser kochen", "Alles mischen"]),
    });
  });

  it("serializes ingredients with deterministic IDs and basket flags", () => {
    expect(
      ToDBIngredient(
        {
          name: "Paprika",
          count: 2,
          unit: "Stk",
        },
        "recipe-123",
      ),
    ).toEqual({
      id: "fixed-id",
      name: "Paprika",
      unit: "Stk",
      count: 2,
      recipeId: "recipe-123",
      basketGroupId: "recipe-123",
      sourceKind: "recipe",
      sourceRecipeId: "recipe-123",
      sourceRecipeTitle: null,
      sourceRecipeDeleted: 0,
      checked: 0,
      markedAsDeleted: 0,
      createdAt: 1700000000000,
    });
  });

  it("hydrates ingredients from sqlite booleans", () => {
    expect(
      FromDBIngredient({
        id: "item-1",
        name: "Paprika",
        unit: "Stk",
        count: 2,
        recipeId: "recipe-123",
        checked: 0,
        markedAsDeleted: 1,
      }),
    ).toEqual({
      id: "item-1",
      name: "Paprika",
      unit: "Stk",
      count: 2,
      recipeId: "recipe-123",
      basketGroupId: "recipe-123",
      sourceKind: "recipe",
      sourceRecipeId: "recipe-123",
      sourceRecipeTitle: null,
      sourceRecipeDeleted: false,
      checked: false,
      markedAsDeleted: true,
    });
  });

  it("hydrates legacy ingredient rows with safe boolean defaults", () => {
    expect(
      FromDBIngredient({
        id: "item-2",
        name: "Brot",
        unit: null,
        count: null,
        recipeId: "__CUSTOM__",
        source_recipe_deleted: 0,
        marked_as_deleted: 0,
      }),
    ).toEqual({
      id: "item-2",
      name: "Brot",
      unit: null,
      count: null,
      recipeId: "__CUSTOM__",
      basketGroupId: "__CUSTOM__",
      sourceKind: "custom",
      sourceRecipeId: null,
      sourceRecipeTitle: "Eigen",
      sourceRecipeDeleted: false,
      checked: false,
      markedAsDeleted: false,
    });
  });

  it("hydrates recipes from sqlite JSON payloads", () => {
    expect(
      FromDBRecipe({
        id: "recipe-1",
        title: "Pasta",
        image: "file://pasta.png",
        description: "Simple dinner",
        ingredients: JSON.stringify([
          { name: "Pasta", count: 1, unit: "Packung" },
        ]),
        instructions: JSON.stringify(["Wasser kochen"]),
      }),
    ).toEqual({
      id: "recipe-1",
      title: "Pasta",
      image: "file://pasta.png",
      description: "Simple dinner",
      ingredients: [{ name: "Pasta", count: 1, unit: "Packung" }],
      instructions: ["Wasser kochen"],
    });
  });
});
