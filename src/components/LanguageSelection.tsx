
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Sparkles, Music2 } from 'lucide-react';
import LanguageInput from './LanguageInput';
import Header from './Header';
import SocialFooter from './SocialFooter';

interface LanguageSelectionProps {
  loading: boolean;
  onStartTranslation: (data: { languageCode: string }) => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  loading,
  onStartTranslation
}) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4 shadow-2xl border-0 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-8">
              {/* Enhanced loading animation with floating elements */}
              <div className="relative">
                {/* Main icon with pulsing background */}
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-full animate-pulse blur-xl"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                    <Music2 className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
                
                {/* Floating elements around the main icon */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center animate-spin shadow-lg">
                  <Globe className="w-3 h-3 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
                
                {/* Orbiting rings */}
                <div className="absolute inset-0 w-32 h-32 -m-4">
                  <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-purple-500/30 to-pink-500/30 animate-spin" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-2 rounded-full border border-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  Preparing Translation Environment
                </h3>
                
                <div className="space-y-3">
                  <p className="text-base text-muted-foreground">
                    Setting up YukkiMusic language files...
                  </p>
                  
                  {/* Enhanced progress steps */}
                  <div className="space-y-2">
                    {['Loading language data', 'Initializing translator', 'Ready to translate'].map((step, index) => (
                      <div key={step} className="flex items-center justify-center gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-green-500 animate-pulse' : 
                          index === 1 ? 'bg-blue-500 animate-bounce' : 
                          'bg-purple-500 animate-ping'
                        }`}></div>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Enhanced animated progress bar */}
              <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full shadow-lg animate-pulse" 
                     style={{ 
                       width: '100%',
                       background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #ef4444, #8b5cf6)',
                       backgroundSize: '200% 100%',
                       animation: 'gradient-flow 3s ease-in-out infinite'
                     }}>
                </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <Header />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Globe className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                🎵 Translate YukkiMusic
              </CardTitle>
              <p className="text-muted-foreground text-base mt-2">
                Translate YukkiMusic language files with ease
              </p>
            </CardHeader>
            <CardContent>
              <LanguageInput onStart={onStartTranslation} loading={loading} />
            </CardContent>
          </Card>
          <SocialFooter />
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
