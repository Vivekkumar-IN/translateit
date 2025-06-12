
import { CONFIG } from '@/config/appConfig';
import { yamlService } from '@/services/yamlService';
import { languageService } from '@/services/languageService';

class TelegramService {
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly apiBaseUrl: string;

  constructor() {
    this.botToken = CONFIG.TELEGRAM.BOT_TOKEN;
    this.chatId = CONFIG.TELEGRAM.CHAT_ID;
    this.apiBaseUrl = CONFIG.TELEGRAM.API_BASE;
  }

  async sendTranslations(translations: { [key: string]: string }, languageCode: string): Promise<void> {
    if (!this.botToken || !this.chatId) {
      console.warn('Telegram bot token or chat ID not configured. Skipping send to Telegram.');
      return;
    }

    const yamlContent = yamlService.generateYamlString(translations);

    const formData = new FormData();
    formData.append('chat_id', this.chatId);
    formData.append('document', new Blob([yamlContent], { type: 'text/plain' }), `${languageCode}.yml`);
    
    const languageName = languageService.getLanguageName(languageCode);
    const caption = `YukkiMusic Translation - ${languageName} (${languageCode.toUpperCase()})`;
    
    formData.append('caption', caption);

    try {
      const url = `${this.apiBaseUrl}/bot${this.botToken}/sendDocument`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to send to Telegram: ${response.status} - ${errorBody}`);
      }

      console.log('Translations sent to Telegram successfully!');
    } catch (error) {
      console.error('Error sending translations to Telegram:', error);
      throw error;
    }
  }
}

export const telegramService = new TelegramService();
