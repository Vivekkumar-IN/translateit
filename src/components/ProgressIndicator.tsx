
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Save, Timer, Globe } from 'lucide-react';
import { languageService } from '@/services/languageService';
import { CONFIG } from '@/config/appConfig';

interface ProgressIndicatorProps {
  translated: number;
  total: number;
  currentIndex: number;
  language: string;
  lastSaved?: Date;
  autoSaveEnabled?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  translated,
  total,
  currentIndex,
  language,
  lastSaved,
  autoSaveEnabled = true
}) => {
  const percentage = Math.round((translated / total) * 100);
  const remaining = total - translated;
  // Use configurable ETA time from config (in seconds), convert to minutes
  const estimated = remaining * (CONFIG.TRANSLATION.ETA_SECONDS / 60);
  const languageName = languageService.getLanguageName(language);

  const formatTime = (minutes: number) => {
    if (minutes < 1) return '< 1m';
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <Card className="border-l-4 border-l-blue-500 shadow-lg bg-gradient-to-r from-background via-background/95 to-muted/30">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Translation Progress
              </h3>
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-800">
              {languageName} ({language.toUpperCase()})
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{translated} of {total} completed</span>
              <span className="font-semibold text-primary">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:via-blue-500 [&>div]:to-purple-500 shadow-inner" />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1 p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-300">Done</span>
              </div>
              <p className="text-lg font-bold text-green-600">{translated}</p>
            </div>

            <div className="space-y-1 p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-orange-600" />
                <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">Left</span>
              </div>
              <p className="text-lg font-bold text-orange-600">{remaining}</p>
            </div>

            <div className="space-y-1 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-1">
                <Timer className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">ETA</span>
              </div>
              <p className="text-lg font-bold text-blue-600">
                {remaining === 0 ? '🎉 Done!' : formatTime(estimated)}
              </p>
            </div>
          </div>

          {autoSaveEnabled && lastSaved && (
            <div className="flex items-center justify-center gap-2 pt-2 border-t bg-gradient-to-r from-muted/50 to-muted/30 rounded-md p-3">
              <Save className="w-3 h-3 text-green-600" />
              <span className="text-xs text-muted-foreground">
                Auto-saved {formatLastSaved(lastSaved)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressIndicator;
