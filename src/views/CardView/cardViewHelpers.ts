import { languageDataById } from "../../lib/data";
import type {
  CategoryKey,
  LanguageData,
  OptionEntry,
  SelectionState,
  LanguageCode,
} from "../../lib/types";

type CategoryData = { label: string; options: OptionEntry[] };
type CategoryMap = Record<CategoryKey, CategoryData>;

export type LanguageDataShape = LanguageData & { categories: CategoryMap };

export type CardSection = {
  key: CategoryKey;
  label: string;
  options: OptionEntry[];
};

const categoryOrder: CategoryKey[] = [
  "allergies",
  "foodRestrictions",
  "medicineAllergies",
  "medicalConditions",
  "phobias",
];

export const getLanguageData = (
  language: LanguageCode | null,
): LanguageDataShape | null => {
  if (!language) {
    return null;
  }

  return (languageDataById[language] as unknown as LanguageDataShape) ?? null;
};

const getSelectedOptions = (
  data: LanguageDataShape,
  key: CategoryKey,
  selected: number[],
): OptionEntry[] => {
  const options = data.categories[key].options;
  const selectedSet = new Set(selected);
  return options.filter((option) => selectedSet.has(option.id));
};

export const buildCardSections = (
  data: LanguageDataShape | null,
  state: SelectionState,
): CardSection[] => {
  if (!data) return [];

  return categoryOrder
    .map((key) => ({
      key,
      label: data.categories[key].label,
      options: getSelectedOptions(data, key, state[key]),
    }))
    .filter((section) => section.options.length > 0);
};
