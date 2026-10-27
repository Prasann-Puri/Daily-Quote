# Quotely — Daily Quotes & Inspiration 📖✨

A responsive, accessible web application for discovering, favoriting, and sharing daily inspiring quotes across multiple categories.

## ✨ Features

- **Curated Wisdom**: Handpicked quotes across categories including **Motivation**, **Life**, **Success**, and **Humor**.
- **Save Favorites**: Click the heart button on the quote card to save your favorite quotes instantly to `localStorage`.
- **Favorites Collection**: Filter quotes by the **Favorites** category to browse only your saved quotes. Includes a friendly empty-state screen if no favorites are saved yet.
- **Smart Share & Copy**: Uses the native **Web Share API** on supported devices, with seamless automatic fallback to clipboard copy.
- **Dark & Light Mode**: Sleek theme toggle with automatic system preference detection.
- **Keyboard Shortcuts**: Press <kbd>Space</kbd> or <kbd>Enter</kbd> to shuffle and view a new quote.
- **Full Accessibility (a11y)**:
  - Real-time quote announcements via `aria-live="polite"`.
  - Accessible touch targets and focus rings.
  - Descriptive `aria-label` attributes on all icon-only buttons.
  - High-contrast typography with smooth micro-animations.

## 🚀 Getting Started

Simply open `index.html` in any modern web browser, or serve it locally:

```bash
# Using Python
python -m http.server 3000

# Or using Node.js
npx serve .
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Built With

- **HTML5**: Semantic and accessible document structure.
- **CSS3**: Custom design tokens, glassmorphism, responsive CSS grid/flexbox, smooth micro-animations.
- **Vanilla JavaScript**: Zero dependencies, LocalStorage persistence, Clipboard & Web Share API integrations.

## 📄 License

MIT License. Free to use for personal and commercial projects.
