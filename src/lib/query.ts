import type { LanguageCode, SelectionState } from "./types";

export const defaultSelectionState: SelectionState = {
  sourceLanguage: null,
  targetLanguage: null,
  allergies: [],
  foodRestrictions: [],
  medicineAllergies: [],
  medicalConditions: [],
  phobias: [],
};

const parseLanguage = (value: string | null): LanguageCode | null => {
  if (
    value === "en" ||
    value === "es" ||
    value === "zh-Hant" ||
    value === "zh-Hans"
  ) {
    return value;
  }

  return null;
};

const parseNumberArray = (params: URLSearchParams, key: string): number[] => {
  return params
    .getAll(key)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value));
};

export const getViewFromSearch = (search: string): AppView => {
  const params = new URLSearchParams(search);
  return params.get("view") === "card" ? "card" : "maker";
};

export const getSelectionsFromSearch = (search: string): SelectionState => {
  const params = new URLSearchParams(search);

  return {
    sourceLanguage: parseLanguage(params.get("source")),
    targetLanguage: parseLanguage(params.get("target")),
    allergies: parseNumberArray(params, "allergies"),
    foodRestrictions: parseNumberArray(params, "foodRestrictions"),
    medicineAllergies: parseNumberArray(params, "medicineAllergies"),
    medicalConditions: parseNumberArray(params, "medicalConditions"),
    phobias: parseNumberArray(params, "phobias"),
  };
};

export const buildSearchFromSelections = (
  selections: SelectionState,
): string => {
  const params = new URLSearchParams();

  if (selections.sourceLanguage) {
    params.set("source", selections.sourceLanguage);
  }

  if (selections.targetLanguage) {
    params.set("target", selections.targetLanguage);
  }

  const addValues = (key: string, values: number[]) => {
    values.forEach((value) => params.append(key, String(value)));
  };

  addValues("allergies", selections.allergies);
  addValues("foodRestrictions", selections.foodRestrictions);
  addValues("medicineAllergies", selections.medicineAllergies);
  addValues("medicalConditions", selections.medicalConditions);
  addValues("phobias", selections.phobias);

  return params.toString();
};
