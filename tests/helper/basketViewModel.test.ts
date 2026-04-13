import { describe, expect, it } from "vitest";
import { buildBasketSections } from "../../src/components/basket/basketViewModel";

const baseRow = {
  basketGroupId: "group-1",
  sourceKind: "recipe" as const,
  sourceRecipeId: "recipe-1",
  sourceRecipeTitle: "Pasta",
  sourceRecipeDeleted: false,
  checked: false,
  markedAsDeleted: false,
  recipeId: "recipe-1" as const,
};

describe("buildBasketSections", () => {
  it("aggregates equal name and unit pairs across source groups", () => {
    const sections = buildBasketSections([
      {
        ...baseRow,
        id: "item-1",
        basketGroupId: "group-1",
        name: "Paprika",
        unit: "Stk",
        count: 1,
      },
      {
        ...baseRow,
        id: "item-2",
        basketGroupId: "group-2",
        sourceRecipeId: "recipe-2",
        sourceRecipeTitle: "Shakshuka",
        recipeId: "recipe-2",
        name: "Paprika",
        unit: "Stk",
        count: 2,
      },
    ]);

    expect(sections).toHaveLength(1);
    expect(sections[0].data).toHaveLength(1);
    expect(sections[0].data[0].aggregate.count).toBe(3);
    expect(sections[0].data[0].sourceGroupCount).toBe(2);
  });

  it("separates checked and deleted rows into different sections", () => {
    const sections = buildBasketSections([
      {
        ...baseRow,
        id: "open-item",
        name: "Milch",
        unit: "l",
        count: 1,
      },
      {
        ...baseRow,
        id: "checked-item",
        basketGroupId: "group-2",
        name: "Milch",
        unit: "l",
        count: 1,
        checked: true,
      },
      {
        ...baseRow,
        id: "deleted-item",
        basketGroupId: "group-3",
        name: "Butter",
        unit: null,
        count: 1,
        markedAsDeleted: true,
      },
    ]);

    expect(sections.map((section) => section.key)).toEqual([
      "open",
      "checked",
      "deleted",
    ]);
  });
});
