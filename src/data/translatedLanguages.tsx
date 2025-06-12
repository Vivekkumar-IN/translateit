// Auto-generated file - DO NOT EDIT MANUALLY
// This file is generated during the build process

export const TRANSLATED_LANGUAGES: string[] = [
  "ar",
  "as",
  "en",
  "hi",
  "ku",
  "tr"
];

export const getTranslatedLanguages = (): string[] => {
  return TRANSLATED_LANGUAGES;
};

export const isLanguageTranslated = (code: string): boolean => {
  return TRANSLATED_LANGUAGES.includes(code.toLowerCase());
};
