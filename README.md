# YukkiMusic Translation Tool

A modern, AI-powered web application for translating YukkiMusic language files with an intuitive interface built using React, TypeScript, and Tailwind CSS.

## ✨ Features

- 🌐 **Smart Language Detection**: Automatically detects and loads available translations
- 🎨 **Modern UI**: Beautiful, responsive interface with dark/light/auto theme support
- 📝 **Advanced Translation Interface**: Easy-to-use cards with smart formatting
- 🔍 **Powerful Search & Filter**: Real-time search with translation status filtering
- 💾 **Auto-save Progress**: Automatic saving with timestamp tracking
- 🚀 **Smart YAML Export**: Intelligent formatting with block literal style for multiline content
- 📱 **Mobile-First Design**: Fully responsive across all devices
- 🎯 **Progress Tracking**: Real-time statistics and completion indicators
- 🔄 **Session Management**: Smart browser navigation and session restoration
- 📤 **Multiple Export Options**: Download YAML or send directly to Telegram
- ⚡ **Performance Optimized**: Fast loading with efficient state management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm package manager

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/Vivekkumar-IN/translateit
cd translateit

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 🔧 Environment Configuration

### Required Variables (for Telegram integration)

```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_TELEGRAM_CHAT_ID=your_chat_id_here
```

### Optional Variables

```env
VITE_BASE_PATH=/                    # Base path for deployment
VITE_TRANSLATION_ETA_SECONDS=30     # Translation time estimate
```

### Platform-Specific Setup

#### GitHub Actions

Add to repository secrets:

- `VITE_TELEGRAM_BOT_TOKEN`
- `VITE_TELEGRAM_CHAT_ID`
- `VITE_BASE_PATH` (set to "/translateit/" for GitHub Pages)

#### Vercel/Netlify

Add environment variables in dashboard:

- Set `VITE_BASE_PATH` to "/"
- Add other required variables

## 📁 Project Architecture

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── YamlTranslator.tsx   # Main translation interface
│   ├── TranslationCard.tsx  # Individual translation card
│   ├── LanguageSelection.tsx # Language picker
│   ├── ThemeProvider.tsx    # Theme management
│   └── ...             # Other components
├── hooks/              # Custom React hooks
│   ├── useTranslationState.ts    # Translation state management
│   ├── useAutoLoadTranslations.ts # Auto-loading logic
│   └── ...             # Other hooks
├── services/           # External service integrations
│   ├── yamlService.ts  # YAML processing
│   ├── telegramService.ts # Telegram integration
│   ├── storageService.ts  # Local storage
│   └── languageService.ts # Language detection
├── config/             # Configuration management
│   └── appService.ts   # Centralized app configuration
├── types/              # TypeScript definitions
├── data/               # Language data and translations
└── pages/              # Route components
```

## 🎨 Theme System

The application features a sophisticated theme system with three modes:

- **Light Mode**: Clean, bright interface optimized for daylight use
- **Dark Mode**: Eye-friendly dark interface for low-light environments
- **Auto Mode**: Automatically follows system preference with smart detection

Toggle between themes using the enhanced theme button in the header.

## 🌐 Deployment Options

### 1. Lovable Platform (Recommended)

- One-click deployment via Lovable editor
- Automatic SSL and global CDN
- Built-in analytics and monitoring

### 2. Vercel

```bash
# Connect repository and deploy
vercel --prod
```

### 3. Netlify

```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### 4. GitHub Pages

- Automatic deployment via GitHub Actions
- Custom domain support
- Free hosting for public repositories

### 5. Self-Hosted

```bash
# Build for production
npm run build

# Upload dist/ folder to your server
# Configure web server for SPA routing
```

## ⚙️ Configuration

Customize the application by editing `src/config/appService.ts`:

```typescript
export const AppService = {
  APP_NAME: "YukkiMusic",

  DEPLOYMENT: {
    BASE_PATH: import.meta.env.VITE_BASE_PATH || "/",
  },

  TELEGRAM: {
    BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
    CHAT_ID: import.meta.env.VITE_TELEGRAM_CHAT_ID,
  },

  YAML_FORMATTING: {
    MAX_NEWLINES_INLINE: 3, // Use block style for multiline content
  },

  TRANSLATION_WARNING: {
    enabled: true, // Show translation guidelines
    variant: "destructive", // Warning style
  },
};
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

### Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui for consistent interface
- **State Management**: React hooks with context
- **YAML Processing**: js-yaml with intelligent formatting
- **Icons**: Lucide React for beautiful, consistent icons
- **Routing**: React Router for SPA navigation

## 🔄 Automated Updates

The project includes GitHub Actions for automated maintenance:

- **Language Data Sync**: Daily updates from YukkiMusic repository
- **ISO Code Updates**: Automatic language code synchronization
- **Dependency Updates**: Regular security and feature updates

## 🔒 Security & Privacy

- **No Server Dependencies**: Completely client-side application
- **Secure Environment Variables**: All sensitive data via environment variables
- **Local Storage**: Translation progress stored locally for privacy
- **HTTPS Required**: Secure connections for all external communications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [YukkiMusic](https://github.com/TheTeamVivek/YukkiMusic) - The amazing music bot this tool supports
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icon library

---

<div align="center">
  <p>Made with ❤️ for the YukkiMusic community</p>
  <p>
    <a href="https://t.me/TheTeamVivek">Telegram</a> •
    <a href="https://github.com/TheTeamVivek/YukkiMusic">GitHub</a>
  </p>
</div>
