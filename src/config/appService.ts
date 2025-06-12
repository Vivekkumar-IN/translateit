
/**
 * Application Service Configuration
 * Central configuration service for the entire application
 */

export const AppService = {
  // Application metadata
  APP_NAME: "translateit",
  
  // Deployment configuration
  DEPLOYMENT: {
    // Base path - "/" for most environments, can be overridden by VITE_BASE_PATH
    BASE_PATH: import.meta.env.VITE_BASE_PATH || "/",
  },
  
  // GitHub Repository Links
  GITHUB: {
    SOURCE_REPO: "https://github.com/TheTeamVivek/YukkiMusic",
    TRANSLATOR_REPO: "https://github.com/Vivekkumar-IN/translateit"
  },
  
  // Telegram bot configuration
  TELEGRAM: {
    BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "7562982663:AAENI4ZqesghJp_jL2hFSd13vooWM4cHEr4",
    CHAT_ID: import.meta.env.VITE_TELEGRAM_CHAT_ID || "-1002146211959",
    API_BASE: "https://api.telegram.org",
  },

  // YAML formatting configuration
  YAML_FORMATTING: {
    MAX_NEWLINES_INLINE: 1,
    MAX_LENGTH_INLINE: 100,
  },

  // Social links configuration
  SOCIAL_LINKS: {
    TELEGRAM: "https://t.me/TheTeamVivek",
    GITHUB: "https://github.com/TheTeamVivek/YukkiMusic"
  },

  // Translation configuration
  TRANSLATION: {
    ETA_SECONDS: parseInt(import.meta.env.VITE_TRANSLATION_ETA_SECONDS || "30"),
  },

  // Translation warning configuration
  TRANSLATION_WARNING: {
    title: "⚠️ IMPORTANT:",
    description: "Do not edit content inside curly braces {...} - keep them as is. You can use Telegram-supported HTML formatting like <b>bold</b>, <i>italic</i>, <code>code</code>.",
    enabled: true,
    variant: "destructive" as const
  }
};
