import { describe, expect, it } from "vitest";
import {
  createIngredientAggregateKey,
  normalizeIngredient,
} from "../../src/helper/NormalizeIngredient";

describe("normalizeIngredient", () => {
  it("trims text fields and keeps valid counts", () => {
    expect(
      normalizeIngredient({
        name: "  Paprika  ",
        unit: " Stk ",
        count: 2,
      })
    ).toEqual({
      name: "Paprika",
      unit: "Stk",
      count: 2,
    });
  });

  it("drops invalid amounts and empty units", () => {
    expect(
      normalizeIngredient({
        name: "Paprika",
        unit: " ",
        count: 0,
      })
    ).toEqual({
      name: "Paprika",
      unit: null,
      count: null,
    });
  });

  it("returns null for empty ingredient names", () => {
    expect(
      normalizeIngredient({
        name: "   ",
        unit: "TL",
        count: 1,
      })
    ).toBeNull();
  });
});

describe("createIngredientAggregateKey", () => {
  it("normalizes name and unit for aggregation", () => {
    expect(
      createIngredientAggregateKey({
        name: "  Paprika  ",
        unit: " stk ",
      })
    ).toBe("paprika::stk");
  });
});
