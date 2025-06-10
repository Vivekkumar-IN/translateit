
interface YamlData {
  [key: string]: string;
}

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
      
      // Simple YAML parser for key: value format
      const yamlData: YamlData = {};
      const lines = text.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes(':')) {
          const colonIndex = trimmedLine.indexOf(':');
          const key = trimmedLine.substring(0, colonIndex).trim();
          let value = trimmedLine.substring(colonIndex + 1).trim();
          
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          if (key && value) {
            yamlData[key] = value;
          }
        }
      }
      
      if (Object.keys(yamlData).length === 0) {
        throw new Error('No valid YAML key-value pairs found');
      }
      
      return yamlData;
    } catch (error) {
      console.error(`Error loading YAML for ${languageCode}:`, error);
      if (languageCode !== 'en') {
        throw new Error(`${languageCode}.yml not found`);
      }
      throw new Error(`Failed to load YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  generateYamlString(translations: { [key: string]: string }): string {
    return Object.entries(translations)
      .map(([key, value]) => `${key}: "${value.replace(/"/g, '\\"')}"`)
      .join('\n');
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
