
interface YamlData {
  [key: string]: string;
}

import YAML from 'yaml';

class YamlService {
  private readonly BASE_URL = "https://raw.githubusercontent.com/TheTeamVivek/YukkiMusic/master/strings/langs";

  async loadYamlFromGitHub(languageCode: string = 'en'): Promise<YamlData> {
    const yamlUrl = `${this.BASE_URL}/${languageCode}.yml`;

    try {
      const response = await fetch(yamlUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const parsed: YamlData = YAML.parse(text);

      if (!parsed || Object.keys(parsed).length === 0) {
        throw new Error('No valid YAML content found');
      }

      return parsed;
    } catch (error) {
      console.error(`Error loading YAML for ${languageCode}:`, error);
      throw new Error(`Failed to load YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  generateYamlString(translations: { [key: string]: string }): string {
    return YAML.stringify(translations);
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