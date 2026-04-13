import { describe, expect, it } from "vitest";

import { AssembleIngredient } from "../../src/helper/AssembleIngredient";

describe("AssembleIngredient", () => {
  it("renders name only when count is missing", () => {
    expect(
      AssembleIngredient({
        name: "Paprika",
        count: null,
        unit: null,
      }),
    ).toBe("Paprika");
  });

  it("renders count, unit and name when all values exist", () => {
    expect(
      AssembleIngredient({
        name: "Paprika",
        count: 2,
        unit: "Stk",
      }),
    ).toBe("2 Stk Paprika");
  });

  it("renders count and name when no unit exists", () => {
    expect(
      AssembleIngredient({
        name: "Paprika",
        count: 3,
        unit: null,
      }),
    ).toBe("3 Paprika");
  });
});
