
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Send, RotateCcw } from 'lucide-react';
import ProgressStats from './ProgressStats';

interface TranslationCompleteProps {
  translatedCount: number;
  totalCount: number;
  userLang: string;
  loading: boolean;
  onDownloadYaml: () => void;
  onSendToTelegram: () => void;
  onReset: () => void;
}

const TranslationComplete: React.FC<TranslationCompleteProps> = ({
  translatedCount,
  totalCount,
  userLang,
  loading,
  onDownloadYaml,
  onSendToTelegram,
  onReset
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl text-green-600">
              🎉 Translation Complete!
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Congratulations! You have successfully completed all translations
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressStats 
              translated={translatedCount}
              total={totalCount}
              language={userLang}
              isComplete={true}
            />
            <div className="flex flex-col gap-3">
              <Button onClick={onDownloadYaml} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download YAML
              </Button>
              <Button onClick={onSendToTelegram} disabled={loading} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Sending...' : 'Send to Telegram'}
              </Button>
            </div>
            <Button variant="outline" onClick={onReset} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Translation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranslationComplete;
