import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, Music, Globe, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";
import SocialFooter from "./SocialFooter";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="relative">
            {/* Main hero icon */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Music className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Static floating elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-xl">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent leading-tight">
              YukkiMusic
            </h1>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground/90">
              Translation Gateway
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform YukkiMusic into any language with our powerful,
              user-friendly translation tool. Make music accessible to everyone,
              everywhere.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/translate">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white shadow-2xl"
              >
                Start Translating
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Languages,
              title: "Multi-Language Support",
              description:
                "Translate YukkiMusic into dozens of languages with our comprehensive language database and intelligent translation system.",
              gradient: "from-blue-500 to-indigo-600",
              textGradient: "from-blue-600 to-indigo-600",
            },
            {
              icon: Sparkles,
              title: "Easy to Use",
              description:
                "Simple, intuitive interface that makes translation accessible to everyone. No technical knowledge required.",
              gradient: "from-green-500 to-emerald-600",
              textGradient: "from-green-600 to-emerald-600",
            },
            {
              icon: Globe,
              title: "Growing Community",
              description:
                "Join our growing community making YukkiMusic accessible to music lovers worldwide.",
              gradient: "from-purple-500 to-pink-600",
              textGradient: "from-purple-600 to-pink-600",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-lg"
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle
                  className={`text-xl bg-gradient-to-r ${feature.textGradient} bg-clip-text text-transparent`}
                >
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it Works Section */}
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
              How It Works
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with translating YukkiMusic in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose Language",
                description:
                  "Select your target language from our extensive list of supported languages",
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "2",
                title: "Start Translating",
                description:
                  "Work through the translation keys at your own pace with our intuitive interface",
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "3",
                title: "Export & Share",
                description:
                  "Download your completed translation or send it directly to the development team",
                color: "from-green-500 to-emerald-500",
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}
                >
                  <span className="text-2xl font-bold text-white">
                    {item.step}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action - Mobile optimized */}
        <div className="mt-16 mb-8">
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-purple-500/20 text-center">
            <h4 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
              Ready to Make YukkiMusic Global?
            </h4>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our community of translators and help bring the joy of music
              to people around the world in their native language.
            </p>
            <div className="flex justify-center">
              <Link to="/translate">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white shadow-2xl rounded-xl"
                >
                  Begin Translation Journey
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SocialFooter />
    </div>
  );
};

export default HomePage;
