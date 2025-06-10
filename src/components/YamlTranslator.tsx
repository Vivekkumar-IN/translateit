
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Download, Send, ChevronLeft, ChevronRight, Search, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LanguageInput from './LanguageInput';
import TranslationCard from './TranslationCard';
import ProgressStats from './ProgressStats';
import { yamlService } from '../services/yamlService';
import { telegramService } from '../services/telegramService';
import { storageService } from '../services/storageService';

interface YamlData {
  [key: string]: string;
}

interface TranslationData {
  translations: { [key: string]: string };
  index: number;
  language: string;
}

const YamlTranslator = () => {
  const [step, setStep] = useState<'language' | 'translating' | 'complete'>('language');
  const [yamlData, setYamlData] = useState<YamlData>({});
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLang, setUserLang] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUntranslated, setShowOnlyUntranslated] = useState(false);
  const { toast } = useToast();

  const filteredKeys = allKeys.filter(key => {
    const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         yamlData[key]?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !showOnlyUntranslated || !translations[key];
    return matchesSearch && matchesFilter;
  });

  const currentKey = filteredKeys[currentIndex];
  const progress = (Object.keys(translations).length / allKeys.length) * 100;
  const translatedCount = Object.keys(translations).length;
  const totalCount = allKeys.length;

  useEffect(() => {
    // Auto-save translations
    if (userLang && Object.keys(translations).length > 0) {
      storageService.saveTranslations(userLang, { translations, index: currentIndex, language: userLang });
    }
  }, [translations, currentIndex, userLang]);

  const handleStartTranslation = async (languageCode: string) => {
    setLoading(true);
    setUserLang(languageCode);

    try {
      // Check for saved progress
      const saved = storageService.loadTranslations(languageCode);
      if (saved && Object.keys(saved.translations).length > 0) {
        const resume = window.confirm(
          `Found previous translation progress for ${languageCode} (${Object.keys(saved.translations).length} translations). Resume?`
        );
        if (resume) {
          setTranslations(saved.translations);
          setCurrentIndex(saved.index || 0);
        }
      }

      // Load YAML data
      const data = await yamlService.loadYamlFromGitHub();
      setYamlData(data);
      setAllKeys(Object.keys(data));
      setStep('translating');

      toast({
        title: "YAML loaded successfully!",
        description: `Found ${Object.keys(data).length} translation keys`,
      });
    } catch (error) {
      toast({
        title: "Error loading YAML",
        description: error instanceof Error ? error.message : "Failed to load translation data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTranslation = (translation: string) => {
    if (translation.trim() && currentKey) {
      setTranslations(prev => ({
        ...prev,
        [currentKey]: translation.trim()
      }));
    }
    handleNext();
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < filteredKeys.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (filteredKeys.length === allKeys.length) {
      setStep('complete');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleGoToKey = (keyIndex: number) => {
    const actualIndex = allKeys.indexOf(filteredKeys[keyIndex]);
    if (actualIndex !== -1) {
      setCurrentIndex(keyIndex);
    }
  };

  const handleDownloadYaml = () => {
    try {
      yamlService.downloadTranslations(translations, userLang);
      toast({
        title: "Download started!",
        description: `${userLang}.yml file is being downloaded`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to generate YAML file",
        variant: "destructive",
      });
    }
  };

  const handleSendToTelegram = async () => {
    setLoading(true);
    try {
      await telegramService.sendTranslations(translations, userLang);
      toast({
        title: "Sent to Telegram!",
        description: "Your translations have been sent successfully",
      });
      // Clear saved data after successful send
      storageService.clearTranslations(userLang);
    } catch (error) {
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Unable to send to Telegram",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all translations? This cannot be undone.")) {
      storageService.clearTranslations(userLang);
      setTranslations({});
      setCurrentIndex(0);
      setStep('language');
      setUserLang('');
      setSearchTerm('');
      setShowOnlyUntranslated(false);
    }
  };

  if (step === 'language') {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">🌍 YAML Translator</CardTitle>
            <p className="text-muted-foreground">
              Translate YAML files from GitHub repositories with ease
            </p>
          </CardHeader>
          <CardContent>
            <LanguageInput onStart={handleStartTranslation} loading={loading} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">✅ Translation Complete!</CardTitle>
            <p className="text-muted-foreground">
              You've successfully translated {translatedCount} out of {totalCount} keys
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressStats 
              translated={translatedCount}
              total={totalCount}
              language={userLang}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleDownloadYaml} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download YAML
              </Button>
              <Button onClick={handleSendToTelegram} disabled={loading} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Sending...' : 'Send to Telegram'}
              </Button>
            </div>
            <Button variant="outline" onClick={handleReset} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Translation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Translating to: <Badge variant="secondary">{userLang.toUpperCase()}</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Key {currentIndex + 1} of {filteredKeys.length} 
                {filteredKeys.length !== allKeys.length && ` (filtered from ${allKeys.length})`}
              </p>
            </div>
            <Button variant="outline" onClick={handleReset} size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress: {translatedCount}/{totalCount} translated</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search keys or values..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showOnlyUntranslated ? "default" : "outline"}
                onClick={() => setShowOnlyUntranslated(!showOnlyUntranslated)}
                size="sm"
              >
                Untranslated only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Card */}
      {currentKey ? (
        <TranslationCard
          keyName={currentKey}
          originalText={yamlData[currentKey]}
          currentTranslation={translations[currentKey] || ''}
          onSave={handleSaveTranslation}
          onSkip={handleSkip}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex < filteredKeys.length - 1}
          isTranslated={!!translations[currentKey]}
        />
      ) : (
        <Alert>
          <AlertDescription>
            No keys match your current filter. Try adjusting your search or filter settings.
          </AlertDescription>
        </Alert>
      )}

      {/* Action buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleDownloadYaml} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download YAML ({translatedCount} keys)
            </Button>
            <Button 
              onClick={handleSendToTelegram} 
              disabled={loading || translatedCount === 0}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : `Send to Telegram (${translatedCount} keys)`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YamlTranslator;
