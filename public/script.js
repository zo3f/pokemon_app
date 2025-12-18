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
window.logRomPlay = function logRomPlay(romName) {
    if (!romName) return;

    fetch('/api/rom-play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ romName }),
    }).catch(() => {
        // Ignore logging failures so the game can still be played.
    });
}
