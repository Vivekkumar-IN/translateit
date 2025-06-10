
interface StoredTranslationData {
  translations: { [key: string]: string };
  index: number;
  language: string;
  timestamp: number;
}

class StorageService {
  private getStorageKey(languageCode: string): string {
    return `yaml_translations_${languageCode}`;
  }

  saveTranslations(languageCode: string, data: Omit<StoredTranslationData, 'timestamp'>): void {
    try {
      const storageData: StoredTranslationData = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.getStorageKey(languageCode), JSON.stringify(storageData));
    } catch (error) {
      console.error('Failed to save translations:', error);
    }
  }

  loadTranslations(languageCode: string): StoredTranslationData | null {
    try {
      const stored = localStorage.getItem(this.getStorageKey(languageCode));
      if (!stored) return null;
      
      const data: StoredTranslationData = JSON.parse(stored);
      
      // Check if data is older than 7 days
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (data.timestamp < sevenDaysAgo) {
        this.clearTranslations(languageCode);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to load translations:', error);
      return null;
    }
  }

  clearTranslations(languageCode: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(languageCode));
    } catch (error) {
      console.error('Failed to clear translations:', error);
    }
  }

  getAllStoredLanguages(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith('yaml_translations_'))
        .map(key => key.replace('yaml_translations_', ''));
    } catch (error) {
      console.error('Failed to get stored languages:', error);
      return [];
    }
  }
}

export const storageService = new StorageService();
