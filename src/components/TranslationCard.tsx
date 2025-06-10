import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Save, CheckCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranslationCardProps {
  keyName: string;
  originalText: string;
  currentTranslation: string;
  existingTranslation?: string;
  targetLanguage: string;
  onSave: (translation: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isTranslated: boolean;
}

const TranslationCard: React.FC<TranslationCardProps> = ({
  keyName,
  originalText,
  currentTranslation,
  existingTranslation,
  targetLanguage,
  onSave,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isTranslated
}) => {
  const [translation, setTranslation] = useState(currentTranslation);
  const { toast } = useToast();

  useEffect(() => {
    setTranslation(currentTranslation);
  }, [currentTranslation, keyName]);

  const handleSave = () => {
    onSave(translation);
  };

  const handleCopyOriginal = async () => {
    try {
      await navigator.clipboard.writeText(originalText);
      toast({
        title: "Copied!",
        description: "Original text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (canGoPrevious) onPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (canGoNext) onNext();
      }
    }
  };

  const getTranslationPlaceholder = () => {
    if (existingTranslation) {
      return `Existing: ${existingTranslation.substring(0, 50)}${existingTranslation.length > 50 ? '...' : ''}\n\nEnter your improved translation here...`;
    }
    return `Please translate this to ${targetLanguage}...`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <code className="bg-muted px-2 py-1 rounded text-xs sm:text-sm break-all">{keyName}</code>
            {isTranslated && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />}
          </CardTitle>
          <Badge variant={isTranslated ? "default" : "secondary"} className="text-xs">
            {isTranslated ? "Translated" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Original text with copy button */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Original (English):</h4>
          <div className="bg-muted p-3 rounded-md relative group cursor-pointer" onClick={handleCopyOriginal}>
            <p className="text-sm italic pr-8 break-words">{originalText}</p>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Click to copy original text</p>
        </div>

        {/* Existing translation if available - minimized */}
        {existingTranslation && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-orange-600">Existing ({targetLanguage}):</h4>
            <div className="bg-orange-50 dark:bg-orange-950 p-2 rounded-md border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-700 dark:text-orange-300">
                {existingTranslation.substring(0, 100)}
                {existingTranslation.length > 100 && '...'}
              </p>
            </div>
          </div>
        )}

        {/* Translation input */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Your translation:</h4>
          <Textarea
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder={getTranslationPlaceholder()}
            className="min-h-[80px] sm:min-h-[100px] resize-none text-sm"
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            Tip: Use Ctrl+Enter to save, Ctrl+← → to navigate
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="flex-1"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={onNext}
              disabled={!canGoNext}
              className="flex-1"
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <Button
            onClick={handleSave}
            className="w-full"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {translation.trim() ? 'Save & Next' : 'Use Default & Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationCard;
