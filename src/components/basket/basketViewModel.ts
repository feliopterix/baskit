import { createIngredientAggregateKey } from "../../helper/NormalizeIngredient";
import { IBaskitIngredient } from "../../types";

export type BasketSectionKey = "open" | "checked" | "deleted";

export type BasketDisplayGroup = {
  id: string;
  aggregateKey: string;
  sectionKey: BasketSectionKey;
  aggregate: IBaskitIngredient;
  sourceRows: IBaskitIngredient[];
  sourceGroupCount: number;
  subtitle: string;
};

export type BasketSection = {
  key: BasketSectionKey;
  title: string;
  subtitle: string;
  data: BasketDisplayGroup[];
};

const SECTION_META: Record<
  BasketSectionKey,
  { title: string; subtitle: string }
> = {
  open: {
    title: "Offen",
    subtitle: "Noch zu kaufen",
  },
  checked: {
    title: "Erledigt",
    subtitle: "Bereits abgehakt",
  },
  deleted: {
    title: "Geloescht",
    subtitle: "Ausgeblendete Positionen",
  },
};

const getSectionKey = (item: IBaskitIngredient): BasketSectionKey => {
  if (item.markedAsDeleted) return "deleted";
  if (item.checked) return "checked";
  return "open";
};

const countGroups = (items: IBaskitIngredient[]) =>
  new Set(items.map((item) => item.basketGroupId)).size;

const buildSubtitle = (items: IBaskitIngredient[]) => {
  const distinctTitles = Array.from(
    new Set(
      items
        .map((item) => item.sourceRecipeTitle?.trim())
        .filter((title): title is string => Boolean(title))
    )
  );

  if (distinctTitles.length === 0) return "Eigen";
  if (distinctTitles.length === 1) return distinctTitles[0];
  return `${distinctTitles.length} Quellen`;
};

const createAggregate = (
  bucketId: string,
  sectionKey: BasketSectionKey,
  rows: IBaskitIngredient[]
): IBaskitIngredient => {
  const first = rows[0];
  const countValues = rows
    .map((item) => item.count)
    .filter((count): count is number => typeof count === "number");

  return {
    ...first,
    id: bucketId,
    count:
      countValues.length > 0
        ? countValues.reduce((sum, value) => sum + value, 0)
        : null,
    checked: sectionKey === "checked",
    markedAsDeleted: sectionKey === "deleted",
  };
};

export const buildBasketSections = (items: IBaskitIngredient[]): BasketSection[] => {
  const buckets = new Map<string, IBaskitIngredient[]>();

  items.forEach((item) => {
    const bucketKey = `${getSectionKey(item)}::${createIngredientAggregateKey(item)}`;
    const existing = buckets.get(bucketKey);
    if (existing) {
      existing.push(item);
      return;
    }
    buckets.set(bucketKey, [item]);
  });

  const sections = new Map<BasketSectionKey, BasketSection>();
  (Object.keys(SECTION_META) as BasketSectionKey[]).forEach((key) => {
    sections.set(key, { key, ...SECTION_META[key], data: [] });
  });

  buckets.forEach((rows, bucketId) => {
    const sectionKey = getSectionKey(rows[0]);
    const section = sections.get(sectionKey);
    if (!section) return;

    section.data.push({
      id: bucketId,
      aggregateKey: createIngredientAggregateKey(rows[0]),
      sectionKey,
      aggregate: createAggregate(bucketId, sectionKey, rows),
      sourceRows: rows,
      sourceGroupCount: countGroups(rows),
      subtitle: buildSubtitle(rows),
    });
  });

  return Array.from(sections.values())
    .map((section) => ({
      ...section,
      data: section.data.sort((left, right) =>
        left.aggregate.name.localeCompare(right.aggregate.name, "de")
      ),
    }))
    .filter((section) => section.data.length > 0);
};

