import { languageDataById } from "../../lib/data";
import type { CategoryKey, LanguageCode, OptionEntry } from "../../lib/types";

type LanguageSummary = { id: LanguageCode; label: string };

const englishData = languageDataById.en as unknown as {
  categories: Record<CategoryKey, { label: string; options: OptionEntry[] }>;
};

export const languageOptions: LanguageSummary[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Spanish" },
  { id: "zh-Hant", label: "Mandarin Chinese (Traditional)" },
  { id: "zh-Hans", label: "Mandarin Chinese (Simplified)" },
];

type CategoryEntry = { key: CategoryKey; label: string };

export const categoryEntries: CategoryEntry[] = (
  Object.keys(englishData.categories) as CategoryKey[]
).map((key) => ({
  key,
  label: englishData.categories[key].label,
}));
