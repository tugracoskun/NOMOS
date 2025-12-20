// Router Modülü
import { renderParliamentPage } from './parliament/main.js';
import { initMap, destroyMap } from './map.js';
import { setupChat, initFakeChat } from './chat.js';
import { renderPartiesPage } from './parties/main.js';

const appContainer = document.getElementById('app-container');

// Sayfa Yükleme (Geçmişe eklemeden çalışır - Geri/İleri tuşları için)
export function loadPage(pageName, subView = null, id = null) {
    // Harita temizliği
    if (pageName !== 'map') { destroyMap(); }
    
    // Menüdeki aktif ışığını güncelle
    updateActiveMenu(pageName);

    console.log(`Router: ${pageName} > ${subView} > ${id}`);

    switch (pageName) {
        case 'home':
            renderHome();
            break;
        case 'map':
            renderMap();
            break;
        case 'parties':
            // Partiler sayfasına ID'yi de gönderiyoruz
            renderPartiesPage(appContainer, subView, id);
            break;
        default:
            renderPlaceholder(pageName);
        case 'parliament':
            renderParliamentPage(appContainer);
            break;    
    }
}

// YENİ: Global Yönlendirme Fonksiyonu
// navigateTo('parties', 'detail', 5) -> #parties/detail/5
export function navigateTo(pageName, subView = null, id = null) {
    let hash = pageName;
    if (subView) hash += `/${subView}`;
    if (id) hash += `/${id}`;

    // Eğer zaten aynı yerdeysek işlem yapma (Gereksiz history şişirme)
    const currentHash = window.location.hash.substring(1);
    if (currentHash === hash) return;

    history.pushState({ page: pageName, view: subView, id: id }, null, `#${hash}`);
    loadPage(pageName, subView, id);
}

// Tarayıcı Geri/İleri Tuşunu Dinle
window.addEventListener('popstate', (event) => {
    // URL'den durumu çöz (Kullanıcı dışarıdan linkle gelmiş de olabilir)
    handleInitialLoad();
});

// URL Çözümleyici (Hash Parser)
export function handleInitialLoad() {
    const hash = window.location.hash.substring(1); // # işaretini at
    
    if (!hash) {
        navigateTo('home');
        return;
    }

    const parts = hash.split('/');
    const page = parts[0];
    const subView = parts[1] || null;
    const id = parts[2] || null;

    loadPage(page, subView, id);
}

// Yardımcı: Menü Işığı
function updateActiveMenu(pageName) {
    document.querySelectorAll('.header-bottom a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
}

// --- RENDER FONKSİYONLARI ---
function renderHome() {
    appContainer.innerHTML = `<div class="home-layout"><div class="news-feed"><div class="news-card"><div class="news-title">📢 Sistem</div><div class="news-body">Hoşgeldiniz.</div></div></div><div class="chat-widget"><div class="chat-header">Global Chat</div><div id="chat-messages" class="chat-messages"></div><div class="chat-input-area"><input type="text" id="chat-input"><button id="chat-send-btn">></button></div></div></div>`;
    setupChat(); initFakeChat();
}
function renderMap() { appContainer.innerHTML = `<div id="game-map"></div>`; setTimeout(() => initMap('game-map'), 50); }
function renderPlaceholder(t) { appContainer.innerHTML = `<div style="padding:50px; text-align:center;"><h2>${t.toUpperCase()}</h2><p>Yapım aşamasında.</p></div>`; }