export type LanguageCode = "en" | "es" | "zh-Hant" | "zh-Hans";

export type CategoryKey =
  | "allergies"
  | "foodRestrictions"
  | "medicineAllergies"
  | "medicalConditions"
  | "phobias";

export type OptionEntry = {
  id: number;
  label: string;
};

export type CategoryData = {
  label: string;
  options: OptionEntry[];
};

export type LanguageSummary = {
  id: LanguageCode;
  label: string;
};

export type LanguageData = {
  id: LanguageCode;
  label: string;
  categories: Record<CategoryKey, CategoryData>;
};

export type SelectionState = {
  sourceLanguage: LanguageCode | null;
  targetLanguage: LanguageCode | null;
  allergies: number[];
  foodRestrictions: number[];
  medicineAllergies: number[];
  medicalConditions: number[];
  phobias: number[];
};
