// Small helper functions used by the React app.

// Smooth scrolling between sections for a SPA-like feel.
window.setupSmoothScroll = function setupSmoothScroll() {
    const links = document.querySelectorAll('.nav-link[href^="#"]');
    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Log ROM plays to the backend (Node + SQLite). Fails silently on error.
// Security: Input validation and sanitization
window.logRomPlay = function logRomPlay(romName) {
    if (!romName || typeof romName !== 'string') return;

    // Sanitize input before sending
    const sanitizedName = String(romName)
        .replace(/[<>\"']/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();

    if (!sanitizedName || sanitizedName.length === 0 || sanitizedName.length > 255) {
        console.error('Invalid ROM name for logging');
        return;
    }

    // Validate it's a .gba file
    if (!sanitizedName.toLowerCase().endsWith('.gba')) {
        console.error('Invalid file type');
        return;
    }

    fetch('/api/rom-play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ romName: sanitizedName }),
    }).catch((error) => {
        // Logging failures shouldn't break gameplay, but log for debugging
        // In development, show the error; in production, log silently
        if (window.console && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            console.warn('Failed to log ROM play event (non-critical):', error.message);
        }
        // Game can still be played even if logging fails
    });
}
