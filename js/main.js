// Main Modülü
// Giriş noktası. Event listener'ları tanımlar.

import { loadPage } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("NOMOS System Initialized (Modular).");

    // Navigasyon Linklerini Seç
    const navLinks = document.querySelectorAll('.header-bottom a');

    // Tıklama Olayları
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Aktif sınıfını güncelle
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Sayfayı yükle
            const pageName = link.getAttribute('data-page');
            loadPage(pageName);
        });
    });

    // Varsayılan olarak Ana Sayfayı aç
    // (İstersen 'map' yaparak doğrudan haritayla açılmasını sağlayabilirsin)
    loadPage('home');
});