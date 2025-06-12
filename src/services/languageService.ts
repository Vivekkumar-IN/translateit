import languageData from '@/data/iso639-1.json';
import { TRANSLATED_LANGUAGES, getTranslatedLanguages, isLanguageTranslated } from '@/data/translatedLanguages';

// Popular languages list (constant 15 languages)
const POPULAR_LANGUAGE_CODES = [
  'es', // Spanish
  'fr', // French
  'de', // German
  'it', // Italian
  'pt', // Portuguese
  'ru', // Russian
  'ja', // Japanese
  'ko', // Korean
  'zh', // Chinese
  'nl', // Dutch
  'pl', // Polish
  'sv', // Swedish
  'da', // Danish
  'no', // Norwegian
  'fi'  // Finnish
];

class LanguageService {
  private languageNames: Record<string, string> = {};
  
  constructor() {
    try {
      this.languageNames = languageData;
    } catch (error) {
      console.warn('Failed to load ISO language data');
      // Provide a minimal fallback for critical languages
      this.languageNames = {
        'en': 'English',
        'hi': 'Hindi',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'ja': 'Japanese',
        'zh': 'Chinese',
        'ru': 'Russian',
        'ar': 'Arabic'
      };
    }
  }

  getLanguageName(code: string): string {
    const lowerCode = code.toLowerCase();
    return this.languageNames[lowerCode] || code.toUpperCase();
  }

  isValidLanguageCode(code: string): boolean {
    return Object.keys(this.languageNames).includes(code.toLowerCase());
  }

  getAllSupportedLanguages(): { code: string; name: string }[] {
    return Object.entries(this.languageNames)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  searchLanguages(query: string): { code: string; name: string }[] {
    const lowerQuery = query.toLowerCase();
    
    return this.getAllSupportedLanguages().filter(lang => 
      lang.name.toLowerCase().includes(lowerQuery) ||
      lang.code.toLowerCase().includes(lowerQuery)
    );
  }

  validateLanguageCode(code: string): { 
    isValid: boolean;
    name?: string 
  } {
    const lowerCode = code.toLowerCase();
    const isValid = this.isValidLanguageCode(lowerCode);
    
    return {
      isValid,
      name: isValid ? this.getLanguageName(lowerCode) : undefined
    };
  }

  // Fast synchronous method using the generated file
  getTranslatedLanguages(): string[] {
    return getTranslatedLanguages();
  }

  isLanguageTranslated(code: string): boolean {
    return isLanguageTranslated(code);
  }

  getTranslatedLanguageDetails(): { code: string; name: string }[] {
    const translatedLanguages = this.getTranslatedLanguages();
    const allLanguages = this.getAllSupportedLanguages();
    
    return allLanguages.filter(lang => translatedLanguages.includes(lang.code));
  }

  getUntranslatedLanguages(): { code: string; name: string }[] {
    const translatedLanguages = this.getTranslatedLanguages();
    const allLanguages = this.getAllSupportedLanguages();
    
    return allLanguages.filter(lang => !translatedLanguages.includes(lang.code));
  }

  // Get popular languages excluding already translated ones, limited to 10 for display
  getPopularUntranslatedLanguages(): { code: string; name: string }[] {
    const translatedLanguages = this.getTranslatedLanguages();
    const popularLanguages = POPULAR_LANGUAGE_CODES
      .filter(code => !translatedLanguages.includes(code))
      .map(code => ({
        code,
        name: this.getLanguageName(code)
      }))
      .filter(lang => this.isValidLanguageCode(lang.code))
      .slice(0, 10); // Limit to 10 for display
    
    return popularLanguages;
  }

  // Get all popular languages (including translated ones, but marked)
  getAllPopularLanguages(): { code: string; name: string; isTranslated: boolean }[] {
    return POPULAR_LANGUAGE_CODES
      .map(code => ({
        code,
        name: this.getLanguageName(code),
        isTranslated: this.isLanguageTranslated(code)
      }))
      .filter(lang => this.isValidLanguageCode(lang.code));
  }

  // Get all languages with translation status
  getAllLanguagesWithStatus(): { code: string; name: string; isTranslated: boolean }[] {
    return this.getAllSupportedLanguages().map(lang => ({
      ...lang,
      isTranslated: this.isLanguageTranslated(lang.code)
    }));
  }
}

export const languageService = new LanguageService();
