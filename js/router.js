// Router Modülü
import { initMap, destroyMap } from './map.js';
import { setupChat, initFakeChat } from './chat.js';
import { renderPartiesPage } from './parties.js'; // <--- YENİ IMPORT

const appContainer = document.getElementById('app-container');

export function loadPage(pageName) {
    if (pageName !== 'map') { destroyMap(); }

    switch (pageName) {
        case 'home':
            renderHome();
            break;
        case 'map':
            renderMap();
            break;
        case 'parties':
            renderPartiesPage(appContainer); // <--- YENİ KULLANIM
            break;
        default:
            renderPlaceholder(pageName);
    }
}


// --- DİĞER FONKSİYONLAR (AYNI) ---
function renderHome() {
    // Mevcut kodlar...
    appContainer.innerHTML = `
        <div class="home-layout">
            <div class="news-feed">
                <div class="news-card"><div class="news-title">📢 Seçimler</div><div class="news-body">Seçimler yaklaşıyor.</div></div>
            </div>
            <div class="chat-widget">
                <div class="chat-header">Global Chat</div>
                <div id="chat-messages" class="chat-messages"></div>
                <div class="chat-input-area"><input type="text" id="chat-input"><button id="chat-send-btn">></button></div>
            </div>
        </div>`;
    setupChat(); initFakeChat();
}
function renderMap() { appContainer.innerHTML = `<div id="game-map"></div>`; setTimeout(() => initMap('game-map'), 50); }
function renderPlaceholder(t) { appContainer.innerHTML = `<div style="padding:50px;text-align:center;"><h2>${t}</h2></div>`; }