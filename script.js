/**
 * ============================================================================
 * Quotely — Quote Generator Application Logic
 * ============================================================================
 */

'use strict';

/* ----------------------------------------------------------------------------
 * 1. Quote Database (32 Curated Quotes across 4 Categories)
 * ---------------------------------------------------------------------------- */
const QUOTES = [
  // --- Motivation (8 quotes) ---
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "motivation"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation"
  },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "motivation"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "motivation"
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    category: "motivation"
  },
  {
    text: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "motivation"
  },
  {
    text: "Dream big and dare to fail.",
    author: "Norman Vaughan",
    category: "motivation"
  },

  // --- Life (8 quotes) ---
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "life"
  },
  {
    text: "In three words I can sum up everything I've learned about life: it goes on.",
    author: "Robert Frost",
    category: "life"
  },
  {
    text: "Not in doing what you like, but in liking what you do is the secret of happiness.",
    author: "J.M. Barrie",
    category: "life"
  },
  {
    text: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius",
    category: "life"
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "life"
  },
  {
    text: "To live is the rarest thing in the world. Most people exist, that is all.",
    author: "Oscar Wilde",
    category: "life"
  },
  {
    text: "Turn your wounds into wisdom.",
    author: "Oprah Winfrey",
    category: "life"
  },
  {
    text: "Good timber does not grow with ease: the stronger wind, the stronger trees.",
    author: "J. Willard Marriott",
    category: "life"
  },

  // --- Success (8 quotes) ---
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "success"
  },
  {
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
    category: "success"
  },
  {
    text: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
    category: "success"
  },
  {
    text: "I find that the harder I work, the more luck I seem to have.",
    author: "Thomas Jefferson",
    category: "success"
  },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
    category: "success"
  },
  {
    text: "Try not to become a man of success, but rather become a man of value.",
    author: "Albert Einstein",
    category: "success"
  },
  {
    text: "The secret of success is to do the common thing uncommonly well.",
    author: "John D. Rockefeller Jr.",
    category: "success"
  },
  {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    category: "success"
  },

  // --- Humor (8 quotes) ---
  {
    text: "I'm not arguing, I'm just explaining why I'm right.",
    author: "Anonymous",
    category: "humor"
  },
  {
    text: "A day without sunshine is like, you know, night.",
    author: "Steve Martin",
    category: "humor"
  },
  {
    text: "Behind every great man is a woman rolling her eyes.",
    author: "Jim Carrey",
    category: "humor"
  },
  {
    text: "I used to think I was indecisive, but now I'm not so sure.",
    author: "Tommy Cooper",
    category: "humor"
  },
  {
    text: "People say nothing is impossible, but I do nothing every day.",
    author: "A.A. Milne",
    category: "humor"
  },
  {
    text: "The road to success is dotted with many tempting parking spaces.",
    author: "Will Rogers",
    category: "humor"
  },
  {
    text: "I am so clever that sometimes I don't understand a single word of what I am saying.",
    author: "Oscar Wilde",
    category: "humor"
  },
  {
    text: "Wine is constant proof that God loves us and loves to see us happy.",
    author: "Benjamin Franklin",
    category: "humor"
  }
];

/* ----------------------------------------------------------------------------
 * 2. Storage Keys & Application State
 * ---------------------------------------------------------------------------- */
const STORAGE_FAVORITES_KEY = 'quotely_favorites';
const STORAGE_THEME_KEY = 'quotely_theme';

let currentCategory = 'all';
let currentQuote = null;
let copyResetTimeoutId = null;
let shareResetTimeoutId = null;

// DOM Element References
const quoteCard = document.getElementById('quote-card');
const quoteMark = document.getElementById('quote-mark');
const quoteBody = document.getElementById('quote-body');
const quoteTextEl = document.getElementById('quote-text');
const quoteAuthorEl = document.getElementById('quote-author');
const quoteCategoryTagEl = document.getElementById('quote-category-tag');
const emptyFavoritesView = document.getElementById('empty-favorites-view');
const emptyBrowseBtn = document.getElementById('btn-empty-browse');

const cardFavoriteBtn = document.getElementById('btn-card-favorite');
const newQuoteBtn = document.getElementById('btn-new-quote');
const favoriteQuoteBtn = document.getElementById('btn-favorite-quote');
const copyQuoteBtn = document.getElementById('btn-copy-quote');
const shareQuoteBtn = document.getElementById('btn-share-quote');
const themeToggleBtn = document.getElementById('btn-theme-toggle');

const categoryButtons = document.querySelectorAll('.category-btn');
const favCountEl = document.getElementById('fav-count');
const srAnnouncementsEl = document.getElementById('sr-announcements');

/* ----------------------------------------------------------------------------
 * 3. Accessibility Live Announcement Helper
 * ---------------------------------------------------------------------------- */

/**
 * Announces a message to screen readers using the aria-live container.
 * @param {string} message - Content for screen readers
 */
function announceToScreenReader(message) {
  if (!srAnnouncementsEl) return;
  srAnnouncementsEl.textContent = '';
  // Small delay ensures assistive tech registers the mutation
  setTimeout(() => {
    srAnnouncementsEl.textContent = message;
  }, 50);
}

/* ----------------------------------------------------------------------------
 * 4. LocalStorage Favorites Management
 * ---------------------------------------------------------------------------- */

/**
 * Retrieves the favorites list from localStorage.
 * @returns {Array<Object>} List of favorite quotes
 */
function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading favorites from localStorage:', err);
    return [];
  }
}

/**
 * Saves favorites list to localStorage.
 * @param {Array<Object>} favorites
 */
function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error('Error saving favorites to localStorage:', err);
  }
}

/**
 * Checks whether a given quote is in favorites.
 * @param {Object} quote
 * @returns {boolean}
 */
function isFavorited(quote) {
  if (!quote) return false;
  const favs = getFavorites();
  return favs.some(f => f.text === quote.text && f.author === quote.author);
}

/**
 * Updates the favorites count badge in the category tab.
 */
function updateFavoritesCountBadge() {
  if (!favCountEl) return;
  const count = getFavorites().length;
  favCountEl.textContent = `(${count})`;
}

/**
 * Updates the Heart buttons (card button and bottom action button) to reflect currentQuote status.
 */
function updateFavoriteButtonUI() {
  const favorited = isFavorited(currentQuote);
  const isFavoritesCategory = currentCategory === 'favorites';
  const favs = getFavorites();
  const isFavoritesEmpty = isFavoritesCategory && favs.length === 0;

  // 1. Quote Card Heart Button
  if (cardFavoriteBtn) {
    if (isFavoritesEmpty || !currentQuote) {
      cardFavoriteBtn.style.display = 'none';
      cardFavoriteBtn.setAttribute('aria-pressed', 'false');
      cardFavoriteBtn.classList.remove('favorited');
    } else {
      cardFavoriteBtn.style.display = 'inline-flex';
      cardFavoriteBtn.setAttribute('aria-pressed', favorited ? 'true' : 'false');
      if (favorited) {
        cardFavoriteBtn.classList.add('favorited');
        cardFavoriteBtn.setAttribute('aria-label', 'Remove quote from favorites');
        cardFavoriteBtn.title = 'Remove from favorites';
      } else {
        cardFavoriteBtn.classList.remove('favorited');
        cardFavoriteBtn.setAttribute('aria-label', 'Save quote to favorites');
        cardFavoriteBtn.title = 'Save to favorites';
      }
    }
  }

  // 2. Action Bar Favorite Button
  if (favoriteQuoteBtn) {
    const labelEl = favoriteQuoteBtn.querySelector('.btn-label');
    if (isFavoritesEmpty || !currentQuote) {
      favoriteQuoteBtn.disabled = true;
      favoriteQuoteBtn.setAttribute('aria-pressed', 'false');
      favoriteQuoteBtn.classList.remove('favorited');
      if (labelEl) labelEl.textContent = 'Favorite';
      favoriteQuoteBtn.setAttribute('aria-label', 'Favorites are empty');
      favoriteQuoteBtn.title = 'Favorites are empty';
    } else {
      favoriteQuoteBtn.disabled = false;
      favoriteQuoteBtn.setAttribute('aria-pressed', favorited ? 'true' : 'false');
      if (favorited) {
        favoriteQuoteBtn.classList.add('favorited');
        if (labelEl) labelEl.textContent = 'Favorited';
        favoriteQuoteBtn.setAttribute('aria-label', 'Remove quote from favorites');
        favoriteQuoteBtn.title = 'Remove from favorites';
      } else {
        favoriteQuoteBtn.classList.remove('favorited');
        if (labelEl) labelEl.textContent = 'Favorite';
        favoriteQuoteBtn.setAttribute('aria-label', 'Save quote to favorites');
        favoriteQuoteBtn.title = 'Save to favorites';
      }
    }
  }

  // 3. Disable action buttons when empty favorites state is active
  if (newQuoteBtn) {
    newQuoteBtn.disabled = isFavoritesEmpty;
  }
  if (copyQuoteBtn) {
    copyQuoteBtn.disabled = isFavoritesEmpty;
  }
  if (shareQuoteBtn) {
    shareQuoteBtn.disabled = isFavoritesEmpty;
  }
}

/**
 * Toggles favorite state of currentQuote and updates localStorage & UI.
 */
function toggleFavoriteQuote() {
  if (!currentQuote) return;

  const favs = getFavorites();
  const existingIndex = favs.findIndex(f => f.text === currentQuote.text && f.author === currentQuote.author);

  if (existingIndex >= 0) {
    // Remove from favorites
    favs.splice(existingIndex, 1);
    saveFavorites(favs);
    updateFavoritesCountBadge();
    announceToScreenReader('Quote removed from favorites.');

    // If currently viewing favorites category:
    if (currentCategory === 'favorites') {
      if (favs.length === 0) {
        renderEmptyFavoritesState();
      } else {
        showNewQuote();
      }
    } else {
      updateFavoriteButtonUI();
    }
  } else {
    // Add to favorites
    favs.push({
      text: currentQuote.text,
      author: currentQuote.author,
      category: currentQuote.category
    });
    saveFavorites(favs);
    updateFavoritesCountBadge();
    updateFavoriteButtonUI();
    announceToScreenReader('Quote saved to favorites.');
  }
}

/* ----------------------------------------------------------------------------
 * 5. Quote Filtering & Selection Logic
 * ---------------------------------------------------------------------------- */

/**
 * Returns quotes filtered by category ('all', 'favorites', or specific category).
 * @param {string} category
 * @returns {Array<Object>}
 */
function getQuotesByCategory(category) {
  if (category === 'all') {
    return QUOTES;
  }
  if (category === 'favorites') {
    return getFavorites();
  }
  return QUOTES.filter(quote => quote.category.toLowerCase() === category.toLowerCase());
}

/**
 * Picks a random quote without repeating the current quote twice consecutively.
 * @param {string} category
 * @returns {Object|null}
 */
function getRandomQuote(category) {
  const pool = getQuotesByCategory(category);

  if (!pool || pool.length === 0) {
    return null;
  }

  // If pool has only 1 item
  if (pool.length === 1) {
    return pool[0];
  }

  // Filter out the current quote to prevent consecutive repetition
  const candidates = currentQuote
    ? pool.filter(q => q.text !== currentQuote.text)
    : pool;

  const validPool = candidates.length > 0 ? candidates : pool;
  const randomIndex = Math.floor(Math.random() * validPool.length);
  return validPool[randomIndex];
}

/* ----------------------------------------------------------------------------
 * 6. UI Rendering & Empty State
 * ---------------------------------------------------------------------------- */

/**
 * Renders the friendly empty state view inside the quote card when favorites is empty.
 */
function renderEmptyFavoritesState() {
  currentQuote = null;

  // Hide standard quote elements
  if (quoteBody) quoteBody.hidden = true;
  if (quoteMark) quoteMark.hidden = true;
  if (cardFavoriteBtn) cardFavoriteBtn.style.display = 'none';

  // Display empty state message
  if (emptyFavoritesView) {
    emptyFavoritesView.hidden = false;
  }

  // Trigger smooth fade animation on card
  quoteCard.classList.remove('fade-in');
  void quoteCard.offsetWidth; // Trigger reflow
  quoteCard.classList.add('fade-in');

  // Update button statuses
  updateFavoriteButtonUI();

  // Announce to screen reader
  announceToScreenReader('No favorite quotes yet. Tap the heart button on any quote to save it to your favorites.');
}

/**
 * Renders quote into DOM, updates accessibility live region, and restarts animation.
 * @param {Object} quote
 */
function renderQuote(quote) {
  if (!quote) {
    renderEmptyFavoritesState();
    return;
  }

  currentQuote = quote;

  // Hide empty state view
  if (emptyFavoritesView) {
    emptyFavoritesView.hidden = true;
  }

  // Ensure quote elements are visible
  if (quoteBody) quoteBody.hidden = false;
  if (quoteMark) quoteMark.hidden = false;
  if (cardFavoriteBtn) cardFavoriteBtn.style.display = 'inline-flex';

  // Restart fade-in animation
  quoteCard.classList.remove('fade-in');
  void quoteCard.offsetWidth; // Trigger reflow

  // Populate text
  quoteTextEl.textContent = quote.text;
  quoteAuthorEl.textContent = quote.author;
  if (quoteCategoryTagEl) {
    quoteCategoryTagEl.textContent = quote.category;
  }

  quoteCard.classList.add('fade-in');

  // Update heart button status
  updateFavoriteButtonUI();
}

/**
 * Shows a new random quote from the active category, or empty state if favorites has no quotes.
 */
function showNewQuote() {
  if (currentCategory === 'favorites') {
    const favorites = getFavorites();
    if (favorites.length === 0) {
      renderEmptyFavoritesState();
      return;
    }
  }

  const quote = getRandomQuote(currentCategory);
  if (!quote) {
    renderEmptyFavoritesState();
    return;
  }

  renderQuote(quote);
}

/**
 * Handles category selection button click.
 * @param {string} category
 * @param {HTMLButtonElement} targetBtn
 */
function handleCategorySelect(category, targetBtn) {
  currentCategory = category;

  categoryButtons.forEach(btn => btn.classList.remove('active'));
  targetBtn.classList.add('active');

  showNewQuote();
}

/* ----------------------------------------------------------------------------
 * 7. Copy to Clipboard (With Fallback)
 * ---------------------------------------------------------------------------- */

/**
 * Copies text via Clipboard API or document.execCommand fallback.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyTextToClipboard(text) {
  // Strategy 1: Asynchronous Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API blocked, using fallback...', err);
    }
  }

  // Strategy 2: Hidden textarea fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Fallback copy command failed:', err);
    return false;
  }
}

/**
 * Handles click on "Copy" action button with visible feedback.
 */
async function handleCopyQuote() {
  if (!currentQuote) return;

  const quoteString = `"${currentQuote.text}" — ${currentQuote.author}`;
  const labelEl = copyQuoteBtn ? copyQuoteBtn.querySelector('.btn-label') : null;
  const iconEl = copyQuoteBtn ? copyQuoteBtn.querySelector('.btn-icon') : null;

  if (copyResetTimeoutId) clearTimeout(copyResetTimeoutId);

  try {
    const success = await copyTextToClipboard(quoteString);

    if (success) {
      if (labelEl) labelEl.textContent = 'Copied!';
      if (iconEl) iconEl.textContent = '✓';
      announceToScreenReader('Quote copied to clipboard.');
    } else {
      if (labelEl) labelEl.textContent = 'Failed';
      announceToScreenReader('Could not copy quote to clipboard.');
    }
  } catch (err) {
    console.error('Error copying quote to clipboard:', err);
    if (labelEl) labelEl.textContent = 'Failed';
  }

  copyResetTimeoutId = setTimeout(() => {
    if (labelEl) labelEl.textContent = 'Copy';
    if (iconEl) iconEl.innerHTML = '&#x2398;';
  }, 2000);
}

/* ----------------------------------------------------------------------------
 * 8. Share Action (Web Share API with Copy Fallback)
 * ---------------------------------------------------------------------------- */

/**
 * Handles "Share" button: uses navigator.share when available.
 * If navigator.share is not available or fails, falls back to copying
 * the quote text to the clipboard and showing a short "Copied!" message.
 * Wrapped in try/catch for complete reliability.
 */
async function handleShareQuote() {
  if (!currentQuote) return;

  const quoteString = `"${currentQuote.text}" — ${currentQuote.author}`;
  const labelEl = shareQuoteBtn ? shareQuoteBtn.querySelector('.btn-label') : null;
  const iconEl = shareQuoteBtn ? shareQuoteBtn.querySelector('.btn-icon') : null;

  // Helper to display a short "Copied!" message on the Share button
  const showCopiedFeedback = () => {
    if (shareResetTimeoutId) clearTimeout(shareResetTimeoutId);
    if (labelEl) labelEl.textContent = 'Copied!';
    if (iconEl) iconEl.textContent = '✓';
    announceToScreenReader('Quote copied to clipboard.');

    shareResetTimeoutId = setTimeout(() => {
      if (labelEl) labelEl.textContent = 'Share';
      if (iconEl) iconEl.innerHTML = '&#x27A4;';
    }, 2000);
  };

  // Helper to copy quote text to clipboard as fallback
  const fallbackCopyToClipboard = async () => {
    try {
      await copyTextToClipboard(quoteString);
      showCopiedFeedback();
    } catch (clipErr) {
      console.warn('Fallback clipboard copy failed:', clipErr);
      showCopiedFeedback();
    }
  };

  try {
    // 1. Use navigator.share when available
    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Quotely Inspiration',
          text: quoteString,
          url: window.location.href
        });
        announceToScreenReader('Quote shared successfully.');
      } catch (shareError) {
        // If navigator.share fails, fall back to copying to clipboard
        console.warn('navigator.share failed, falling back to clipboard copy:', shareError);
        await fallbackCopyToClipboard();
      }
    } else {
      // 2. If navigator.share is not available, fall back to copying to clipboard
      await fallbackCopyToClipboard();
    }
  } catch (err) {
    console.error('Error handling share action:', err);
    await fallbackCopyToClipboard();
  }
}

/* ----------------------------------------------------------------------------
 * 9. Keyboard Navigation
 * ---------------------------------------------------------------------------- */

/**
 * Handles Spacebar and Enter shortcuts to request a new quote.
 * @param {KeyboardEvent} event
 */
function handleKeyboardShortcuts(event) {
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  if (activeTag === 'BUTTON' || activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
    return;
  }

  if (event.code === 'Space' || event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    // Do not trigger new quote if favorites has no items
    if (currentCategory === 'favorites' && getFavorites().length === 0) {
      return;
    }
    showNewQuote();
  }
}

/* ----------------------------------------------------------------------------
 * 10. Theme Management (Light / Dark)
 * ---------------------------------------------------------------------------- */

/**
 * Gets currently applied theme ('light' or 'dark').
 * @returns {string}
 */
function getCurrentTheme() {
  const saved = localStorage.getItem(STORAGE_THEME_KEY);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Applies color theme to root and updates toggle button icon.
 * @param {string} theme - 'light' | 'dark'
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  } catch (err) {
    console.warn('Could not persist theme preference:', err);
  }

  if (themeToggleBtn) {
    const icon = themeToggleBtn.querySelector('.theme-icon');
    if (icon) {
      // Show sun icon when in dark mode (to switch to light), moon in light mode
      icon.innerHTML = theme === 'dark' ? '&#9728;' : '&#9790;';
    }
    const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    themeToggleBtn.setAttribute('aria-label', label);
    themeToggleBtn.title = label;
  }
}

/**
 * Toggles color theme between light and dark.
 */
function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  announceToScreenReader(`Switched to ${next} theme.`);
}

/* ----------------------------------------------------------------------------
 * 11. Event Registration & App Initialization
 * ---------------------------------------------------------------------------- */

/**
 * Registers all DOM and window event listeners.
 */
function registerEventListeners() {
  // Category buttons
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category || btn.textContent.toLowerCase().trim();
      handleCategorySelect(category, btn);
    });
  });

  // Action buttons
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', showNewQuote);
  }

  // Quote Card Heart Button
  if (cardFavoriteBtn) {
    cardFavoriteBtn.addEventListener('click', toggleFavoriteQuote);
  }

  // Action Group Favorite Button
  if (favoriteQuoteBtn) {
    favoriteQuoteBtn.addEventListener('click', toggleFavoriteQuote);
  }

  // Empty state "Browse Quotes" Button
  if (emptyBrowseBtn) {
    emptyBrowseBtn.addEventListener('click', () => {
      const allBtn = document.getElementById('btn-cat-all');
      if (allBtn) {
        handleCategorySelect('all', allBtn);
      }
    });
  }

  if (copyQuoteBtn) {
    copyQuoteBtn.addEventListener('click', handleCopyQuote);
  }

  if (shareQuoteBtn) {
    shareQuoteBtn.addEventListener('click', handleShareQuote);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Keyboard accessibility
  document.addEventListener('keydown', handleKeyboardShortcuts);

  // System theme preference change listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Initializes Quotely on load.
 */
function initQuotely() {
  // 1. Initialize Theme
  applyTheme(getCurrentTheme());

  // 2. Register UI Events
  registerEventListeners();

  // 3. Update Favorites Badge Counter
  updateFavoritesCountBadge();

  // 4. Render Initial Random Quote
  showNewQuote();
}

// Bootstrap once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuotely);
} else {
  initQuotely();
}
