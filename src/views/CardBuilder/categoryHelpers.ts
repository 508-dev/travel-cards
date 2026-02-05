import { languageDataById } from "../../lib/data";
import type { CategoryKey, OptionEntry } from "../../lib/types";

const englishData = languageDataById.en as unknown as {
  categories: Record<CategoryKey, { label: string; options: OptionEntry[] }>;
};

export const getCategoryOptions = (key: CategoryKey): OptionEntry[] => {
  return englishData.categories[key].options;
};
