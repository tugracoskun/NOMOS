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

    // --- GLOBAL SEARCH SHORTCUT (/) ---
    document.addEventListener('keydown', (e) => {
        // Eğer bir input/textarea içinde değilsek ve '/' basalırsa
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const searchInput = document.getElementById('global-search-input-compact');
            if (searchInput) {
                searchInput.focus();
            }
        }
        // ESC ile aramadan çık
        if (e.key === 'Escape' && document.activeElement.id === 'global-search-input-compact') {
            document.activeElement.blur();
        }
    });

    // Sayfa ilk açıldığında veya F5 atıldığında URL'e göre doğru yeri aç
    handleInitialLoad();
});