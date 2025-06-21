import * as yaml from 'js-yaml';
import { AppService } from '@/config/appService';

interface YamlData {
  [key: string]: string;
}

class YamlService {
  private originalKeyOrder: string[] = [];

  async loadYamlFromGitHub(languageCode: string = 'en'): Promise<YamlData> {
    try {
      const jsonModule = await import(`@/data/langs/${languageCode}.json`);
      const jsonData = jsonModule.default || jsonModule;

      if (!jsonData || Object.keys(jsonData).length === 0) {
        throw new Error('No valid JSON key-value pairs found');
      }

      const processedData: YamlData = {};

      if (languageCode === 'en') {
        this.originalKeyOrder = Object.keys(jsonData);
      }

      for (const [key, value] of Object.entries(jsonData)) {
        processedData[key] = String(value);
      }

      return processedData;
    } catch (error) {
      throw new Error(`Failed to load translations for "${languageCode}"`);
    }
  }

  private getKeyPrefix(key: string): string {
    const match = key.match(/^([a-zA-Z]+)(?:_|[0-9])/);
    return match ? match[1] : key;
  }

  generateYamlString(translations: { [key: string]: string }): string {
    try {
      const yamlLines: string[] = [];
      let lastPrefix = '';

      const orderedKeys = this.originalKeyOrder.length > 0
        ? this.originalKeyOrder.filter((key) => key in translations)
        : Object.keys(translations);

      for (const key of orderedKeys) {
        const value = translations[key];
        if (value === undefined) continue;

        const currentPrefix = this.getKeyPrefix(key);

        if (lastPrefix && lastPrefix !== currentPrefix) {
          yamlLines.push('');
        }

        const escaped = value
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n');

        yamlLines.push(`${key}: "${escaped}"`);
        lastPrefix = currentPrefix;
      }

      return yamlLines.join('\n');
    } catch {
      return yaml.dump(translations, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
        forceQuotes: true,
      });
    }
  }

  downloadTranslations(translations: { [key: string]: string }, languageCode: string): void {
    const yamlContent = this.generateYamlString(translations);
    const blob = new Blob([yamlContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${languageCode}.yml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const yamlService = new YamlService();