import * as yaml from 'js-yaml';
import { CONFIG } from '@/config/appConfig';

interface YamlData {
  [key: string]: string;
}

class YamlService {
  async loadYamlFromGitHub(languageCode: string = 'en'): Promise<YamlData> {
    try {
      const jsonModule = await import(`@/data/langs/${languageCode}.json`);
      const jsonData = jsonModule.default || jsonModule;

      if (!jsonData || Object.keys(jsonData).length === 0) {
        throw new Error('No valid JSON key-value pairs found');
      }

      const processedData: YamlData = {};
      for (const [key, value] of Object.entries(jsonData)) {
        processedData[key] = String(value);
      }

      return processedData;
    } catch (error) {
      throw new Error(`Failed to load translations for "${languageCode}"`);
    }
  }

  private shouldUseLiteralBlock(value: string): boolean {
    const newlineCount = (value.match(/\n/g) || []).length;
    return (
      newlineCount > CONFIG.YAML_FORMATTING.MAX_NEWLINES_INLINE ||
      value.length > CONFIG.YAML_FORMATTING.MAX_LENGTH_INLINE
    );
  }

  generateYamlString(translations: { [key: string]: string }): string {
    try {
      const yamlLines: string[] = [];

      for (const [key, value] of Object.entries(translations)) {
        if (this.shouldUseLiteralBlock(value)) {
          yamlLines.push(`${key}: |`);
          const lines = value.split('\n');
          for (const line of lines) {
            yamlLines.push(`  ${line}`);
          }
        } else {
          const escapedValue = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
          yamlLines.push(`${key}: "${escapedValue}"`);
        }
      }

      return yamlLines.join('\n');
    } catch {
      return yaml.dump(translations, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
        forceQuotes: false,
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