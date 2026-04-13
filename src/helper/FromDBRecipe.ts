import { IBaskitRecipe } from "../types";

export const FromDBRecipe = (data: any): IBaskitRecipe => {
  const parseList = (value: unknown) => {
    if (typeof value !== "string" || value.trim().length === 0) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return {
    id: data.id,
    title: data.title,
    image: data.image,
    description: data.description,
    ingredients: parseList(data.ingredients),
    instructions: parseList(data.instructions),
  };
};
