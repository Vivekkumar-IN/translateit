
import { useToast } from '@/hooks/use-toast';
import { yamlService } from '@/services/yamlService';
import { storageService } from '@/services/storageService';

interface UseTranslationFlowProps {
  setLoading: (loading: boolean) => void;
  setUserLang: (lang: string) => void;
  setYamlData: (data: any) => void;
  setAllKeys: (keys: string[]) => void;
  setTranslations: (translations: any) => void;
  setCurrentIndex: (index: number) => void;
  setExistingTranslations: (translations: any) => void;
  setStep: (step: 'language' | 'translating' | 'complete') => void;
}

export const useTranslationFlow = ({
  setLoading,
  setUserLang,
  setYamlData,
  setAllKeys,
  setTranslations,
  setCurrentIndex,
  setExistingTranslations,
  setStep
}: UseTranslationFlowProps) => {
  const { toast } = useToast();

  const handleStartTranslation = async (data: { languageCode: string }) => {
    await proceedWithTranslation(data.languageCode);
  };

  const proceedWithTranslation = async (languageCode: string, existingData?: any) => {
    setLoading(true);
    setUserLang(languageCode);

    try {
      // Load default English YAML data
      const data = await yamlService.loadYamlFromGitHub();
      setYamlData(data);
      setAllKeys(Object.keys(data));

      // Load existing data if provided
      if (existingData) {
        setTranslations(existingData.translations);
        setCurrentIndex(existingData.index || 0);
      }

      // Try to load existing translations for the target language
      try {
        const existingData = await yamlService.loadYamlFromGitHub(languageCode);
        setExistingTranslations(existingData);
      } catch (error) {
        console.log(`No existing ${languageCode}.yml found, starting fresh`);
        setExistingTranslations({});
      }

      setStep('translating');
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error loading YAML",
        description: error instanceof Error ? error.message : "Failed to load translation data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return {
    handleStartTranslation,
    proceedWithTranslation
  };
};
