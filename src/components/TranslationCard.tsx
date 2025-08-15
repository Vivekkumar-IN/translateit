import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Save,
  CheckCircle,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

interface TranslationCardProps {
  keyName: string;
  originalText: string;
  currentTranslation: string;
  existingTranslation?: string;
  targetLanguage: string;
  onSave: (translation: string) => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
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
  canGoPrevious,
  isTranslated,
}) => {
  const [translation, setTranslation] = useState(currentTranslation);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // If there's an existing translation and no current translation, use the existing one
    if (existingTranslation && !currentTranslation) {
      setTranslation(existingTranslation);
    } else {
      setTranslation(currentTranslation);
    }
  }, [currentTranslation, existingTranslation, keyName]);

  const handleSave = () => {
    // Always save what's currently in the textarea, even if it's empty
    // If empty, we'll let the parent component decide what to do
    onSave(translation);
  };

  const handleCopyOriginal = async () => {
    try {
      await navigator.clipboard.writeText(originalText);
      setCopied(true);

      // Reset the check mark after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Silent copy failure
    }
  };

  const getTranslationLabel = () => {
    return existingTranslation && !currentTranslation
      ? "Existing Translation:"
      : "Your translation:";
  };

  const getTranslationPlaceholder = () => {
    if (existingTranslation && !currentTranslation) {
      return "Edit the existing translation or keep it as is...";
    }
    return "Enter your translation here...";
  };

  const getSaveButtonText = () => {
    if (translation.trim()) {
      return "Save & Continue";
    }
    // Show what will be used as default when no custom translation is provided
    if (existingTranslation) {
      return "Use Existing & Continue";
    }
    return "Use Original & Continue";
  };

  // Format text for display, preserving newlines
  const formatTextForDisplay = (text: string) => {
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <code className="bg-muted px-2 py-1 rounded text-xs sm:text-sm break-all">
              {keyName}
            </code>
            {isTranslated && (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
            )}
          </CardTitle>
          <Badge
            variant={isTranslated ? "default" : "secondary"}
            className="text-xs"
          >
            {isTranslated ? "Translated" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Original text with copy button inside the box */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Original (English):
          </h4>
          <div className="bg-muted p-3 rounded-md relative">
            <p className="text-sm italic break-words pr-8 whitespace-pre-wrap">
              {formatTextForDisplay(originalText)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyOriginal}
              className="absolute top-2 right-2 h-6 w-6 p-0 cursor-pointer"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Translation input - merged with existing translation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{getTranslationLabel()}</h4>
          <Textarea
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder={getTranslationPlaceholder()}
            className="min-h-[80px] sm:min-h-[100px] resize-none text-sm whitespace-pre-wrap"
            autoFocus
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="flex-1 cursor-pointer"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
          </div>
          <Button
            onClick={handleSave}
            className="w-full cursor-pointer"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {getSaveButtonText()}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationCard;
