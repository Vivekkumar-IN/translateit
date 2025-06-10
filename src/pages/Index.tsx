
import React, { useEffect } from 'react';
import YamlTranslator from '../components/YamlTranslator';

const Index = () => {
  useEffect(() => {
    // Ensure theme is properly applied on initial load
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto py-8">
        <YamlTranslator />
      </div>
    </div>
  );
};

export default Index;
