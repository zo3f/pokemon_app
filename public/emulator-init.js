/**
 * EmulatorJS Initialization Script
 * Handles ROM URL validation and EmulatorJS setup
 * Extracted from emulator.html for better maintainability
 */

(function() {
  'use strict';

  /**
   * Sanitize and validate ROM URL parameter
   * @param {string} urlParam - URL parameter from query string
   * @returns {string|null} - Sanitized URL or null if invalid
   */
  function sanitizeRomUrl(urlParam) {
    if (!urlParam || typeof urlParam !== 'string') {
      return null;
    }

    // Validate and sanitize ROM URL
    const sanitizedUrl = String(urlParam)
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<script/gi, '')
      .trim();

    // Only allow URLs starting with /roms/ to prevent open redirect
    if (sanitizedUrl && sanitizedUrl.startsWith('/roms/')) {
      return sanitizedUrl;
    }

    return null;
  }

  /**
   * Display error message to user
   * @param {string} message - Error message to display
   */
  function showError(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
    document.body.innerHTML = '';
    document.body.appendChild(messageDiv);
  }

  /**
   * Initialize EmulatorJS with the provided ROM URL
   * @param {string} romUrl - Validated ROM URL
   */
  function initializeEmulator(romUrl) {
    window.EJS_player = '#game';
    window.EJS_gameUrl = romUrl;
    window.EJS_core = 'gba';
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';

    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.crossOrigin = 'anonymous';
    
    script.onerror = () => {
      showError('Failed to load EmulatorJS. Please check your internet connection.');
    };

    script.onload = () => {
      if (window.console && window.console.log) {
        console.log('EmulatorJS loaded successfully');
      }
    };

    document.body.appendChild(script);
  }

  /**
   * Main initialization function
   */
  function init() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const romUrlParam = urlParams.get('rom');

      if (!romUrlParam) {
        showError('No ROM specified. Please go back and choose a game.');
        return;
      }

      const sanitizedUrl = sanitizeRomUrl(romUrlParam);

      if (!sanitizedUrl) {
        showError('Invalid ROM URL. Please go back and choose a game.');
        return;
      }

      initializeEmulator(sanitizedUrl);
    } catch (error) {
      console.error('Error initializing emulator:', error);
      showError('An error occurred while initializing the emulator. Please try again.');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }
})();
