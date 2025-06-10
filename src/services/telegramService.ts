
class TelegramService {
  private readonly BOT_TOKEN = "8050656956:AAGsJ8EniqZ1Bhe6F5xSelX08C43kzqboQI";
  private readonly CHAT_ID = "7706682472";
  private readonly API_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}`;

  async sendTranslations(translations: { [key: string]: string }, languageCode: string): Promise<void> {
    try {
      const yamlContent = Object.entries(translations)
        .map(([key, value]) => `${key}: "${value.replace(/"/g, '\\"')}"`)
        .join('\n');
      
      const blob = new Blob([yamlContent], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('chat_id', this.CHAT_ID);
      formData.append('document', blob, `${languageCode}.yml`);
      formData.append('caption', `🌍 Translation file for ${languageCode.toUpperCase()}\n📊 ${Object.keys(translations).length} translations`);

      const response = await fetch(`${this.API_URL}/sendDocument`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(result.description || 'Failed to send to Telegram');
      }
    } catch (error) {
      console.error('Telegram send error:', error);
      throw new Error(`Failed to send to Telegram: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const telegramService = new TelegramService();
