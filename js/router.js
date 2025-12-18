// Router Modülü
// Sayfa içeriğini değiştirir ve gerekli modülleri tetikler.

import { initMap, destroyMap } from './map.js';

const appContainer = document.getElementById('app-container');

export function loadPage(pageName) {
    console.log(`Router: ${pageName} sayfasına geçiliyor.`);

    // Eğer harita sayfasından çıkıyorsak haritayı temizle
    if (pageName !== 'map') {
        destroyMap();
    }

    // Sayfa içeriğini belirle
    switch (pageName) {
        case 'home':
            renderHome();
            break;
        case 'map':
            renderMap();
            break;
        case 'profile':
        case 'parties':
        case 'parliament':
        case 'trade':
        case 'hangar':
        case 'messages':
        case 'social':
            renderPlaceholder(pageName);
            break;
        default:
            renderHome();
    }
}

function renderHome() {
    appContainer.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100%; flex-direction:column; gap:15px; text-align:center;">
            <div style="font-size: 4rem; color: var(--primary); opacity: 0.2;">
                <i class="fa-solid fa-earth-europe"></i>
            </div>
            <h1 style="color:var(--text-light); font-size: 2rem;">NOMOS</h1>
            <p style="color:var(--text-dim);">Devlet Yönetim Paneline Hoşgeldiniz.</p>
            <div style="margin-top:20px; padding:20px; background:var(--bg-card); border-radius:8px; border:1px solid var(--border); max-width:400px;">
                <h3 style="color:var(--text-light); margin-bottom:10px;">Gündem</h3>
                <p style="color:var(--text-dim); font-size:0.9rem;">Seçimler yaklaşıyor. Enerji piyasalarında dalgalanma bekleniyor.</p>
            </div>
        </div>
    `;
}

function renderMap() {
    // Harita için boş bir div oluştur
    appContainer.innerHTML = `<div id="game-map"></div>`;
    
    // Haritayı başlat (DOM render edildikten hemen sonra)
    setTimeout(() => {
        initMap('game-map');
    }, 50);
}

function renderPlaceholder(title) {
    const titles = {
        profile: 'Oyuncu Profili',
        parties: 'Siyasi Partiler',
        parliament: 'Millet Meclisi',
        trade: 'Ticaret Borsası',
        hangar: 'Askeri Hangar',
        messages: 'Gelen Kutusu',
        social: 'Sosyal Akış'
    };

    const displayTitle = titles[title] || title.toUpperCase();

    appContainer.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100%; flex-direction:column; gap:10px;">
            <h1 style="color:var(--text-dim); font-size: 3rem; opacity: 0.1;">${title.toUpperCase()}</h1>
            <h2 style="color:var(--text-light);">${displayTitle}</h2>
            <p style="color:var(--text-dim); font-size:0.9rem;">Bu modül geliştirme aşamasındadır.</p>
        </div>
    `;
}