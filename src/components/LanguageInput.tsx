
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, Globe, Languages, Star, Sparkles } from 'lucide-react';
import { languageService } from '../services/languageService';

interface LanguageInputProps {
  onStart: (data: { languageCode: string }) => void;
  loading: boolean;
}

const LanguageInput: React.FC<LanguageInputProps> = ({ onStart, loading }) => {
  const [languageCode, setLanguageCode] = useState('');
  const [validation, setValidation] = useState<{
    isValid: boolean;
    name?: string;
  } | null>(null);

  // Get language categories synchronously (fast loading)
  const translatedLanguages = languageService.getTranslatedLanguageDetails();
  const popularUntranslatedLanguages = languageService.getPopularUntranslatedLanguages();
  const allLanguagesWithStatus = languageService.getAllLanguagesWithStatus();

  useEffect(() => {
    if (languageCode.trim()) {
      const result = languageService.validateLanguageCode(languageCode.trim());
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [languageCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (languageCode.trim() && validation?.isValid) {
      onStart({ 
        languageCode: languageCode.trim().toLowerCase()
      });
    }
  };

  const handleLanguageSelect = (code: string) => {
    setLanguageCode(code);
  };

  const truncateName = (name: string, maxLength: number = 12) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="langCode" className="text-sm font-medium flex items-center gap-2">
          <Languages className="w-4 h-4" />
          Enter your language code (ISO 639-1)
        </Label>
        <Input
          id="langCode"
          type="text"
          placeholder="e.g., hi, fr, es, de..."
          value={languageCode}
          onChange={(e) => setLanguageCode(e.target.value)}
          className="text-center"
          disabled={loading}
        />
        
        {/* Validation feedback */}
        {validation && (
          <div className="space-y-2">
            {validation.isValid ? (
              <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                  Valid language: <strong>{validation.name}</strong>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-sm text-red-800 dark:text-red-200">
                  Invalid language code. Please use a valid ISO 639-1 code.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          Use 2-letter ISO codes like 'hi' for Hindi, 'fr' for French, etc.
        </p>
      </div>

      {/* Currently Translated Languages */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-green-200 dark:border-green-800">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
            Currently Translated Languages ({translatedLanguages.length})
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {translatedLanguages.map((lang) => (
            <Badge
              key={lang.code}
              variant={languageCode === lang.code ? "default" : "secondary"}
              className={`cursor-pointer justify-center py-2 text-xs transition-all duration-200 ${
                languageCode === lang.code 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-105" 
                  : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-200 border-green-200 dark:border-green-800 hover:scale-105"
              }`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              {lang.code.toUpperCase()} • {truncateName(lang.name, 8)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Popular Languages Available for Translation */}
      {popularUntranslatedLanguages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-200 dark:border-amber-800">
            <Star className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Popular Languages Available ({popularUntranslatedLanguages.length})
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {popularUntranslatedLanguages.map((lang) => (
              <Badge
                key={lang.code}
                variant={languageCode === lang.code ? "default" : "outline"}
                className={`cursor-pointer justify-center py-2 text-xs transition-all duration-200 ${
                  languageCode === lang.code 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-105" 
                    : "hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 dark:hover:from-amber-900/20 dark:hover:to-yellow-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:scale-105"
                }`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                {lang.code.toUpperCase()} • {truncateName(lang.name, 8)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* All Available Languages */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-semibold">
            All Available Languages ({allLanguagesWithStatus.length})
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto rounded-lg border border-border bg-gradient-to-br from-muted/30 via-background/50 to-muted/30 p-4 shadow-inner">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allLanguagesWithStatus.map((lang) => (
              <div
                key={lang.code}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                  languageCode === lang.code 
                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md scale-[1.02]" 
                    : "hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:shadow-sm hover:scale-[1.01]"
                }`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {lang.isTranslated && (
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  )}
                  <span className="text-xs font-mono font-semibold bg-muted/50 px-2 py-1 rounded flex-shrink-0">
                    {lang.code.toUpperCase()}
                  </span>
                  <span className="text-sm truncate font-medium">
                    {lang.name}
                  </span>
                </div>
                {languageCode === lang.code && (
                  <Sparkles className="w-3 h-3 text-primary-foreground/70 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!languageCode.trim() || loading || !validation?.isValid} 
        className="w-full py-3 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading YAML...
          </>
        ) : (
          <>
            <Languages className="w-4 h-4 mr-2" />
            Start Translating
          </>
        )}
      </Button>
    </form>
  );
};

export default LanguageInput;
