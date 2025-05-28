# Jhole Nepali Shabda - Nepali Vocabulary Learning App

A modern web application for learning Nepali vocabulary using spaced repetition techniques. Built with Next.js, React, and TypeScript.

## 🌟 Features

- **Spaced Repetition Learning**: SM-2 algorithm for optimal vocabulary retention
- **Three Difficulty Levels**: Easy (everyday words), Medium (intermediate), Difficult (advanced)
- **Intelligent Timer System**: Configurable thinking time per word (5-20 seconds)
- **Progress Tracking**: Real-time statistics and learning progress
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Keyboard Navigation**: Hotkeys for faster interaction (Y/N for assessments)
- **Local Storage Persistence**: Your progress is saved automatically

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd guess-the-word

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:9002 in your browser
```

### Production Build
```bash
npm run build
npm start
```

## 📚 How to Use

1. **Choose Difficulty**: Select from Easy (सजिलो), Medium (मध्यम), or Difficult (कठिन)
2. **Set Timer**: Choose thinking time per word (5-20 seconds)
3. **Learn**: Study each Nepali word and assess your knowledge
4. **Track Progress**: Monitor your learning statistics and accuracy

## 🏗️ Architecture

```
src/
├── app/                 # Next.js 13+ app directory
├── components/
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── enhanced/       # Application-specific components
│   └── app/            # App-level components
├── data/               # Word database
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## 🧠 Learning Algorithm

Uses the SM-2 spaced repetition algorithm:
- **Initial Interval**: 1 day for new words
- **Ease Factor**: Adjusts based on recall difficulty (1.3-2.5)
- **Smart Selection**: 70% review words, 30% new words
- **Progress Tracking**: Separate statistics per difficulty level

## 🗣️ Word Database

- **Easy**: 20 common everyday words (घर, पानी, खाना...)
- **Medium**: 20 intermediate vocabulary (शिक्षा, स्वास्थ्य, समाज...)
- **Difficult**: 20 advanced terms (किंकर्तव्यविमूढ, अनिर्वचनीय...)

Each word includes:
- Nepali script (Devanagari)
- Roman transliteration
- Nepali meaning
- English translation

## 🛠️ Development

### Tech Stack
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks + localStorage

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript checking
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Nepali language community for vocabulary curation
- SM-2 algorithm by SuperMemo
- shadcn/ui for component library
