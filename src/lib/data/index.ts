import languages from "./languages.json";
import en from "./en.json";
import es from "./es.json";
import zhHans from "./zh-Hans.json";
import zhHant from "./zh-Hant.json";
import type { LanguageData, LanguageSummary, LanguageCode } from "../types";

export const languageList = languages as LanguageSummary[];

export const languageDataById: Record<LanguageCode, LanguageData> = {
  en: en as LanguageData,
  es: es as LanguageData,
  "zh-Hant": zhHant as LanguageData,
  "zh-Hans": zhHans as LanguageData
};
