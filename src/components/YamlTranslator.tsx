import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Send,
  AlertTriangle,
  Loader2,
  Music,
  Globe,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslationState } from "@/hooks/useTranslationState";
import { useBackButtonHandler } from "@/hooks/useBackButtonHandler";
import { useTranslationFlow } from "@/hooks/useTranslationFlow";
import { useAutoLoadTranslations } from "@/hooks/useAutoLoadTranslations";
import TranslationCard from "./TranslationCard";
import ProgressIndicator from "./ProgressIndicator";
import AdvancedSearch from "./AdvancedSearch";
import LanguageSelection from "./LanguageSelection";
import TranslationComplete from "./TranslationComplete";
import SocialFooter from "./SocialFooter";
import Header from "./Header";
import { yamlService } from "../services/yamlService";
import { telegramService } from "../services/telegramService";
import { storageService } from "../services/storageService";
import { CONFIG } from "../config/appConfig";
import { SearchFilters, TranslationData } from "@/types";
import RestartConfirmationDialog from "./RestartConfirmationDialog";

const YamlTranslator = () => {
  const {
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
    lastSaved,
  } = useTranslationState();

  useBackButtonHandler();

  const { handleStartTranslation, proceedWithTranslation } = useTranslationFlow(
    {
      setLoading,
      setUserLang,
      setYamlData,
      setAllKeys,
      setTranslations,
      setCurrentIndex,
      setExistingTranslations,
      setStep,
    },
  );

  const {
    isAutoLoading,
    foundTranslation,
    languageCode,
    handleAutoLoad,
    skipAutoLoad,
    isInitializing,
  } = useAutoLoadTranslations();

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    showOnlyUntranslated: false,
    showOnlyTranslated: false,
  });

  const [showRestartDialog, setShowRestartDialog] = useState(false);

  const { toast } = useToast();

  // Handle auto-loading of existing translations - prevent homepage flash
  useEffect(() => {
    if (isAutoLoading && foundTranslation && languageCode) {
      const loadExistingTranslation = async () => {
        await handleAutoLoad();
        // Proceed with the found translation without showing language selection
        await proceedWithTranslation(languageCode, foundTranslation);
      };
      loadExistingTranslation();
    }
  }, [isAutoLoading, foundTranslation, languageCode]);

  // Show enhanced loading screen for initialization or auto-loading
  if (isInitializing || (isAutoLoading && foundTranslation && languageCode)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4 shadow-2xl border-0 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-8">
              {/* Enhanced loading animation with floating elements */}
              <div className="relative">
                {/* Main icon with pulsing background */}
                <div className="relative w-28 h-28 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-full animate-pulse blur-2xl scale-150"></div>
                  <div className="relative w-28 h-28 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                    <Music className="w-14 h-14 text-white drop-shadow-lg animate-pulse" />
                  </div>
                </div>

                {/* Floating elements around the main icon */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center animate-spin shadow-xl">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>

                {/* Multiple orbiting rings */}
                <div className="absolute inset-0 w-40 h-40 -m-6">
                  <div
                    className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin"
                    style={{ animationDuration: "4s" }}
                  ></div>
                  <div
                    className="absolute inset-3 rounded-full border border-pink-500/20 animate-spin"
                    style={{
                      animationDuration: "3s",
                      animationDirection: "reverse",
                    }}
                  ></div>
                  <div
                    className="absolute inset-6 rounded-full border border-blue-500/15 animate-spin"
                    style={{ animationDuration: "2s" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  {isInitializing
                    ? "Initializing YukkiMusic Translator"
                    : "Restoring Previous Translation"}
                </h3>

                {foundTranslation && languageCode ? (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">
                        Previous translation found!
                      </span>
                    </div>
                    <p className="text-base text-muted-foreground">
                      Restoring{" "}
                      <strong className="text-primary font-semibold">
                        {languageCode.toUpperCase()}
                      </strong>{" "}
                      translation
                    </p>
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                        <span>
                          <strong>
                            {Object.keys(foundTranslation.translations).length}
                          </strong>{" "}
                          translations completed
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Restoring your progress...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-base text-muted-foreground">
                      Preparing your translation environment...
                    </p>

                    {/* Loading steps animation */}
                    <div className="space-y-2">
                      {[
                        "Loading YAML files",
                        "Setting up translator",
                        "Initializing interface",
                      ].map((step, index) => (
                        <div
                          key={step}
                          className="flex items-center justify-center gap-3 text-sm"
                        >
                          <div
                            className={`w-2 h-2 rounded-full transition-all duration-500 ${
                              index === 0
                                ? "bg-blue-500 animate-bounce"
                                : index === 1
                                  ? "bg-purple-500 animate-pulse"
                                  : "bg-pink-500 animate-ping"
                            }`}
                          ></div>
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced animated progress bar with gradient animation */}
              <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full shadow-lg animate-pulse"
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg, #8b5cf6, #ec4899, #ef4444, #8b5cf6)",
                    backgroundSize: "200% 100%",
                    animation: "gradient-flow 3s ease-in-out infinite",
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <style>{`
          @keyframes gradient-flow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      </div>
    );
  }

  const filteredKeys = allKeys.filter((key) => {
    const keyLower = key.toLowerCase();

    // Search only by key name
    if (searchFilters.searchTerm) {
      const searchLower = searchFilters.searchTerm.toLowerCase();
      if (!keyLower.includes(searchLower)) {
        return false;
      }
    }

    // Translation status filters
    const isTranslated = !!translations[key];
    if (searchFilters.showOnlyUntranslated && isTranslated) return false;
    if (searchFilters.showOnlyTranslated && !isTranslated) return false;

    return true;
  });

  const currentKey = filteredKeys[currentIndex];
  const translatedCount = Object.keys(translations).length;
  const totalCount = allKeys.length;

  const handleSaveTranslation = (translation: string) => {
    if (currentKey) {
      // Save the actual translation provided by the user
      if (translation.trim()) {
        // User provided a custom translation
        setTranslations((prev) => ({
          ...prev,
          [currentKey]: translation.trim(),
        }));
      } else {
        // User didn't provide a translation, use existing or original as fallback
        const fallbackTranslation =
          existingTranslations[currentKey] || yamlData[currentKey];
        setTranslations((prev) => ({
          ...prev,
          [currentKey]: fallbackTranslation,
        }));
      }
    }
    handleNext();
  };

  const handleNext = () => {
    // Move to next translation without overriding what was just saved
    if (currentIndex < filteredKeys.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (filteredKeys.length === allKeys.length) {
      setStep("complete");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleDownloadYaml = async () => {
    setDownloadLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for UX
      yamlService.downloadTranslations(translations, userLang);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to generate YAML file",
        variant: "destructive",
      });
    } finally {
      setDownloadLoading(false);
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
        description:
          error instanceof Error ? error.message : "Unable to send to Telegram",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestartConfirm = () => {
    // Clear all cache including current language
    storageService.clearAllCache();
    setTranslations({});
    setCurrentIndex(0);
    setStep("language");
    setUserLang("");
    setSearchFilters({
      searchTerm: "",
      showOnlyUntranslated: false,
      showOnlyTranslated: false,
    });
    setExistingTranslations({});
    setShowRestartDialog(false);
  };

  const handleReset = () => {
    setShowRestartDialog(true);
  };

  const handleStartNew = () => {
    // Clear all state and go directly to language selection
    setTranslations({});
    setCurrentIndex(0);
    setStep("language");
    setUserLang("");
    setSearchFilters({
      searchTerm: "",
      showOnlyUntranslated: false,
      showOnlyTranslated: false,
    });
    setExistingTranslations({});
  };

  if (step === "language") {
    return (
      <LanguageSelection
        loading={loading}
        onStartTranslation={handleStartTranslation}
      />
    );
  }

  if (step === "complete") {
    return (
      <TranslationComplete
        translatedCount={translatedCount}
        totalCount={totalCount}
        userLang={userLang}
        loading={loading}
        downloadLoading={downloadLoading}
        onDownloadYaml={handleDownloadYaml}
        onSendToTelegram={handleSendToTelegram}
        onReset={handleReset}
        onStartNew={handleStartNew}
      />
    );
  }

  return (
    <div className="bg-background">
      <Header />
      <div className="container mx-auto max-w-4xl p-4 space-y-6">
        {CONFIG.TRANSLATION_WARNING.enabled && (
          <Alert className="relative overflow-hidden border-0 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-red-950/30 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/10 to-red-400/10" />
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-red-500" />
            <div className="relative flex items-start gap-3 p-4">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-grow space-y-2">
                <div className="font-bold text-base text-amber-900 dark:text-amber-100">
                  {CONFIG.TRANSLATION_WARNING.title}
                </div>
                <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  {CONFIG.TRANSLATION_WARNING.description}
                </div>
              </div>
            </div>
          </Alert>
        )}

        <ProgressIndicator
          translated={translatedCount}
          total={totalCount}
          currentIndex={currentIndex}
          language={userLang}
          lastSaved={lastSaved}
          autoSaveEnabled={true}
        />

        <AdvancedSearch
          filters={searchFilters}
          onFiltersChange={setSearchFilters}
          totalKeys={allKeys.length}
          filteredKeys={filteredKeys.length}
          translatedKeys={translatedCount}
          allKeys={allKeys}
          yamlData={yamlData}
          translations={translations}
        />

        <div className="space-y-6">
          {currentKey ? (
            <TranslationCard
              keyName={currentKey}
              originalText={yamlData[currentKey]}
              currentTranslation={translations[currentKey] || ""}
              existingTranslation={existingTranslations[currentKey] || ""}
              targetLanguage={userLang}
              onSave={handleSaveTranslation}
              onPrevious={handlePrevious}
              canGoPrevious={currentIndex > 0}
              isTranslated={!!translations[currentKey]}
            />
          ) : (
            <Alert>
              <AlertDescription>
                No keys match your current filter. Try adjusting your search or
                filter settings.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <Button
                onClick={handleDownloadYaml}
                variant="outline"
                className="w-full"
                disabled={downloadLoading}
              >
                {downloadLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download YAML ({translatedCount} keys)
                  </>
                )}
              </Button>
              <Button
                onClick={handleSendToTelegram}
                disabled={loading || translatedCount === 0}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading
                  ? "Sending..."
                  : `Send to Telegram (${translatedCount} keys)`}
              </Button>
              <Button
                onClick={handleReset}
                className="w-full rounded-md text-white transition-colors bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Translation
              </Button>
            </div>
          </CardContent>
        </Card>

        <SocialFooter />

        <RestartConfirmationDialog
          open={showRestartDialog}
          onOpenChange={setShowRestartDialog}
          onConfirmRestart={handleRestartConfirm}
        />
      </div>
    </div>
  );
};

export default YamlTranslator;
