// Simple integration with EmulatorJS using the official embed globals.
// This expects the public EmulatorJS CDN at https://cdn.emulatorjs.org.

function setupRomPlayer() {
    const playButton = document.getElementById('playButton');
    const romInput = document.getElementById('romInput');
    const gameArea = document.getElementById('gameArea');

    if (!playButton || !romInput || !gameArea) {
        return;
    }

    playButton.addEventListener('click', () => {
        const romFile = romInput.files && romInput.files[0];

        if (!romFile) {
            alert('Please select a .gba ROM file first.');
            return;
        }

        if (!romFile.name.toLowerCase().endsWith('.gba')) {
            alert('Please select a valid Game Boy Advance (.gba) ROM file.');
            return;
        }

        // Create an object URL for the selected ROM so EmulatorJS can load it.
        const romUrl = URL.createObjectURL(romFile);

        // Clear any previous emulator instance from the container.
        gameArea.innerHTML = '';

        // These globals are how EmulatorJS is configured.
        // See https://emulatorjs.org/docs/getting-started/ for details.
        window.EJS_player = '#gameArea';
        window.EJS_core = 'gba';
        window.EJS_gameUrl = romUrl;
        window.EJS_fullscreenOnLoaded = false;
        // Path to EmulatorJS assets on the public CDN
        window.EJS_pathtodata = 'https://cdn.emulatorjs.org/latest/';

        // Remove any previously injected EmulatorJS script so we can reload cleanly.
        const existingScript = document.getElementById('emulatorjs-loader');
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.id = 'emulatorjs-loader';
        script.src = 'https://cdn.emulatorjs.org/latest/emulator.js';
        script.onerror = () => {
            alert('Failed to load EmulatorJS. Please check your internet connection.');
        };

        document.body.appendChild(script);
    });
}

function setupSmoothScroll() {
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

window.addEventListener('DOMContentLoaded', () => {
    setupRomPlayer();
    setupSmoothScroll();
});
