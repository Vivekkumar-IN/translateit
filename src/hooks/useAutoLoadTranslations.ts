
import { useEffect, useState } from 'react';
import { storageService } from '@/services/storageService';
import { TranslationData } from '@/types';

interface UseAutoLoadTranslationsReturn {
  isAutoLoading: boolean;
  foundTranslation: TranslationData | null;
  languageCode: string | null;
  handleAutoLoad: () => Promise<void>;
  skipAutoLoad: () => void;
  isInitializing: boolean;
}

export const useAutoLoadTranslations = (): UseAutoLoadTranslationsReturn => {
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [foundTranslation, setFoundTranslation] = useState<TranslationData | null>(null);
  const [languageCode, setLanguageCode] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing translations on app load
    const checkExistingTranslations = async () => {
      setIsInitializing(true);
      
      const currentLang = storageService.getCurrentLanguage();
      if (currentLang) {
        const savedData = storageService.loadTranslations(currentLang);
        if (savedData && Object.keys(savedData.translations).length > 0) {
          setFoundTranslation(savedData);
          setLanguageCode(currentLang);
          setIsAutoLoading(true);
        }
      }
      
      // Shorter delay to prevent flash
      setTimeout(() => {
        setIsInitializing(false);
      }, 300);
    };

    checkExistingTranslations();
  }, []);

  const handleAutoLoad = async () => {
    if (!languageCode || !foundTranslation) return;

    try {
      // Quick loading without notifications
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAutoLoading(false);
    } catch (error) {
      setIsAutoLoading(false);
      setFoundTranslation(null);
      setLanguageCode(null);
    }
  };

  const skipAutoLoad = () => {
    setIsAutoLoading(false);
    setFoundTranslation(null);
    setLanguageCode(null);
    // Clear the stored language
    if (languageCode) {
      storageService.clearTranslations(languageCode);
    }
  };

  return {
    isAutoLoading,
    foundTranslation,
    languageCode,
    handleAutoLoad,
    skipAutoLoad,
    isInitializing
  };
};
