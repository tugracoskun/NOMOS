// Main Modülü
// Uygulamanın giriş noktası ve global olay dinleyicisi

import { navigateTo, handleInitialLoad } from './router.js';
import { loadState, startIncomeTicker } from './data/state.js';
import { initSettingsPanel } from './settings.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("NOMOS System Initialized.");
    loadState();
    startIncomeTicker();
    initSettingsPanel();

    // --- GLOBAL EVENT DELEGATION ---
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-page]');

        if (target) {
            e.preventDefault();

            const page = target.getAttribute('data-page');
            const view = target.getAttribute('data-view') || null;
            const id = target.getAttribute('data-id') || null;

            navigateTo(page, view, id);
        }
    });

    // Sayfa ilk açıldığında veya F5 atıldığında URL'e göre doğru yeri aç
    handleInitialLoad();
});