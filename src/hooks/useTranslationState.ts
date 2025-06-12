
import { useState, useEffect } from 'react';
import { YamlData } from '@/types';
import { storageService } from '@/services/storageService';

export const useTranslationState = () => {
  const [step, setStep] = useState<'language' | 'translating' | 'complete'>('language');
  const [yamlData, setYamlData] = useState<YamlData>({});
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLang, setUserLang] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingTranslations, setExistingTranslations] = useState<YamlData>({});
  const [existingTranslationPercentage, setExistingTranslationPercentage] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Enhanced auto-save with timestamp
  useEffect(() => {
    if (userLang && Object.keys(translations).length > 0) {
      storageService.saveTranslations(userLang, { translations, index: currentIndex, language: userLang });
      setLastSaved(new Date());
    }
  }, [translations, currentIndex, userLang]);

  // Calculate existing translation percentage
  useEffect(() => {
    if (Object.keys(existingTranslations).length > 0 && Object.keys(yamlData).length > 0) {
      const existingCount = Object.keys(existingTranslations).length;
      const totalKeys = Object.keys(yamlData).length;
      const percentage = Math.round((existingCount / totalKeys) * 100);
      setExistingTranslationPercentage(percentage);
    }
  }, [existingTranslations, yamlData]);

  return {
    step,
    setStep,
    yamlData,
    setYamlData,
    allKeys,
    setAllKeys,
    translations,
    setTranslations,
    currentIndex,
    setCurrentIndex,
    userLang,
    setUserLang,
    loading,
    setLoading,
    existingTranslations,
    setExistingTranslations,
    existingTranslationPercentage,
    lastSaved
  };
};
