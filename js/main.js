// Main Modülü
// Uygulamanın giriş noktası ve global olay dinleyicisi

import { navigateTo, handleInitialLoad } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("NOMOS System Initialized.");

    // --- GLOBAL EVENT DELEGATION ---
    // Sayfadaki herhangi bir tıklamayı dinler
    document.body.addEventListener('click', (e) => {
        // Tıklanan elementin kendisi veya üst ebeveyni bir "data-page" içeriyor mu?
        // (Örn: Butonun içindeki ikona tıklansa bile butonu bulur)
        const target = e.target.closest('[data-page]');
        
        if (target) {
            e.preventDefault(); // Sayfanın yenilenmesini engelle
            
            const page = target.getAttribute('data-page');
            const view = target.getAttribute('data-view') || null; // Alt sayfa (create, detail)
            const id = target.getAttribute('data-id') || null;     // ID (1, 2, 5)

            // Router üzerinden git (Geçmişe kaydeder)
            navigateTo(page, view, id);
        }
    });

    // Sayfa ilk açıldığında veya F5 atıldığında URL'e göre doğru yeri aç
    handleInitialLoad();
});