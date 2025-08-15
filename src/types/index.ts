export interface YamlData {
  [key: string]: string;
}

export interface TranslationData {
  translations: { [key: string]: string };
  index: number;
  language: string;
}

export interface SearchFilters {
  searchTerm: string;
  showOnlyUntranslated: boolean;
  showOnlyTranslated: boolean;
}
