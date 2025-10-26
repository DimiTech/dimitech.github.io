/**
 * Theme Toggle Functionality
 * Handles switching between light and dark themes
 */

(function () {
  "use strict";

  // Theme configuration
  const THEME_KEY = "blog-theme";
  const DEFAULT_THEME = "dark"; // Set dark as default
  const THEMES = {
    light: "light",
    dark: "dark",
  };

  // Theme toggle button HTML
  const THEME_TOGGLE_HTML = `
    <div class="theme-toggle-container">
      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
        <span class="theme-icon">🌙</span>
      </button>
    </div>
  `;

  // Theme icons
  const THEME_ICONS = {
    light: "🌙", // Moon for light theme (click to go dark)
    dark: "☀️", // Sun for dark theme (click to go light)
  };

  /**
   * Get the current theme from localStorage or return default
   */
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme && Object.values(THEMES).includes(savedTheme)
      ? savedTheme
      : DEFAULT_THEME;
  }

  /**
   * Save theme to localStorage
   */
  function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }

  /**
   * Apply theme to the document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // Update theme icon
    const themeIcon = document.querySelector(".theme-icon");
    if (themeIcon) {
      themeIcon.textContent = THEME_ICONS[theme];
    }

    // Update button title
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.title = `Switch to ${
        theme === THEMES.light ? "dark" : "light"
      } theme`;
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === THEMES.light ? THEMES.dark : THEMES.light;

    applyTheme(newTheme);
    saveTheme(newTheme);
  }

  /**
   * Initialize theme functionality
   */
  function initTheme() {
    // Apply the current theme
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    // Add theme toggle button below navigation
    const header = document.querySelector("header");
    if (header) {
      const themeToggleContainer = document.createElement("div");
      themeToggleContainer.innerHTML = THEME_TOGGLE_HTML;
      header.appendChild(themeToggleContainer);

      // Add click event listener
      const themeToggle = document.getElementById("theme-toggle");
      if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);

        // Prevent blue highlight on iOS
        themeToggle.addEventListener(
          "touchstart",
          function (e) {
            e.preventDefault();
            this.classList.add("active");
          },
          { passive: false }
        );

        themeToggle.addEventListener(
          "touchend",
          function (e) {
            e.preventDefault();
            this.classList.remove("active");
            toggleTheme();
          },
          { passive: false }
        );
      }
    }
  }

  /**
   * Handle system theme preference changes
   */
  function handleSystemThemeChange() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // Only apply system preference if no user preference is saved
      if (!localStorage.getItem(THEME_KEY)) {
        const systemTheme = mediaQuery.matches ? THEMES.dark : THEMES.light;
        applyTheme(systemTheme);
      }

      // Listen for system theme changes
      mediaQuery.addEventListener("change", function (e) {
        if (!localStorage.getItem(THEME_KEY)) {
          const systemTheme = e.matches ? THEMES.dark : THEMES.light;
          applyTheme(systemTheme);
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initTheme();
      handleSystemThemeChange();
    });
  } else {
    initTheme();
    handleSystemThemeChange();
  }

  // Expose toggleTheme function globally for potential external use
  window.toggleTheme = toggleTheme;
})();
