interface StoredTranslationData {
  translations: { [key: string]: string };
  index: number;
  language: string;
  timestamp: number;
  keysHash?: string; // Add hash to detect key changes
}

class StorageService {
  private getStorageKey(languageCode: string): string {
    return `yaml_translations_${languageCode}`;
  }

  private getCurrentLanguageKey(): string {
    return 'current_language_key';
  }

  // Generate a hash that preserves the original order of keys
  private generateKeysHash(keys: string[]): string {
    // Don't sort the keys - keep their original order for the hash
    return keys.join('|');
  }

  saveTranslations(languageCode: string, data: Omit<StoredTranslationData, 'timestamp' | 'keysHash'>, currentKeys?: string[]): void {
    try {
      const storageData: StoredTranslationData = {
        ...data,
        timestamp: Date.now(),
        keysHash: currentKeys ? this.generateKeysHash(currentKeys) : undefined
      };
      localStorage.setItem(this.getStorageKey(languageCode), JSON.stringify(storageData));
      // Also save the current language key
      this.saveCurrentLanguage(languageCode);
    } catch (error) {
      console.error('Failed to save translations:', error);
    }
  }

  saveCurrentLanguage(languageCode: string): void {
    try {
      localStorage.setItem(this.getCurrentLanguageKey(), languageCode);
    } catch (error) {
      console.error('Failed to save current language:', error);
    }
  }

  getCurrentLanguage(): string | null {
    try {
      return localStorage.getItem(this.getCurrentLanguageKey());
    } catch (error) {
      console.error('Failed to get current language:', error);
      return null;
    }
  }

  loadTranslations(languageCode: string, currentKeys?: string[]): StoredTranslationData | null {
    try {
      const stored = localStorage.getItem(this.getStorageKey(languageCode));
      if (!stored) return null;
      
      const data: StoredTranslationData = JSON.parse(stored);
      
      // Check if data is older than 7 days
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (data.timestamp < sevenDaysAgo) {
        console.log('Cache expired, clearing translations for', languageCode);
        this.clearTranslations(languageCode);
        return null;
      }

      // Check if keys have changed (invalidate cache if keys are different)
      if (currentKeys && data.keysHash) {
        const currentKeysHash = this.generateKeysHash(currentKeys);
        if (data.keysHash !== currentKeysHash) {
          console.log('Translation keys have changed, clearing cache for', languageCode);
          this.clearTranslations(languageCode);
          return null;
        }
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
      // Clear current language if it matches
      if (this.getCurrentLanguage() === languageCode) {
        localStorage.removeItem(this.getCurrentLanguageKey());
      }
    } catch (error) {
      console.error('Failed to clear translations:', error);
    }
  }

  clearAllCache(): void {
    try {
      // Clear all translation data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('yaml_translations_')) {
          localStorage.removeItem(key);
        }
      });
      // Clear current language
      localStorage.removeItem(this.getCurrentLanguageKey());
      console.log('All cache cleared');
    } catch (error) {
      console.error('Failed to clear all cache:', error);
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
