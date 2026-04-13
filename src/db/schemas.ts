export const SCHEMA_RECIPES = `
  create table if not exists recipes(
      id text primary key,
      title text not null,
      image text,
      ingredients text not null,
      description text,
      instructions text
  );
`;

export const SCHEMA_ITEMS = `
  create table if not exists items(
      id text primary key,
      name text not null,
      unit text,
      count real,
      recipeId text,
      basketGroupId text not null,
      sourceKind text not null default 'recipe',
      sourceRecipeId text,
      sourceRecipeTitle text,
      sourceRecipeDeleted integer not null default 0,
      checked integer not null default 0,
      markedAsDeleted integer not null default 0,
      createdAt integer not null default 0
  );
`;
