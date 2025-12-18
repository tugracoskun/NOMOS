// Router Modülü
import { initMap, destroyMap } from './map.js';
import { setupChat, initFakeChat } from './chat.js'; // Chat import edildi

const appContainer = document.getElementById('app-container');

export function loadPage(pageName) {
    // ... (Buradaki kodlar aynı kalsın) ...
    if (pageName !== 'map') { destroyMap(); }

    switch (pageName) {
        case 'home':
            renderHome();
            break;
        case 'map':
            renderMap();
            break;
        // ... diğer caseler aynı ...
        default:
            renderHome(); // renderPlaceholder yerine renderHome'a düşsün
    }
}

function renderHome() {
    appContainer.innerHTML = `
        <div class="home-layout">
            <!-- SOL: Haber Akışı -->
            <div class="news-feed">
                <div class="news-card">
                    <div class="news-title">📢 Seçimler Yaklaşıyor!</div>
                    <span class="news-meta">Devlet Haber Ajansı • 10 dk önce</span>
                    <div class="news-body">
                        Yüksek Seçim Kurulu, 15. Dönem Başkanlık seçimlerinin önümüzdeki hafta başlayacağını duyurdu. 
                        Parti liderleri hazırlıklara başladı.
                    </div>
                </div>

                <div class="news-card">
                    <div class="news-title">📉 Petrol Fiyatlarında Düşüş</div>
                    <span class="news-meta">Ekonomi Bakanlığı • 1 saat önce</span>
                    <div class="news-body">
                        Küresel piyasalardaki durgunluk sebebiyle varil fiyatları %5 düştü. 
                        Üretici ülkeler acil toplanma kararı aldı.
                    </div>
                </div>

                <div class="news-card">
                    <div class="news-title">⚔️ Sınır Gerginliği</div>
                    <span class="news-meta">Savunma Bakanlığı • 3 saat önce</span>
                    <div class="news-body">
                        Kuzey sınırında hareketlilik gözlendi. Tüm birlikler teyakkuz durumuna geçirildi.
                    </div>
                </div>
            </div>

            <!-- SAĞ: Global Chat -->
            <div class="chat-widget">
                <div class="chat-header">
                    <span><i class="fa-solid fa-earth-europe"></i> Global Chat</span>
                    <span class="online-count"><i class="fa-solid fa-circle"></i> 1,240 Online</span>
                </div>
                
                <div id="chat-messages" class="chat-messages">
                    <!-- Mesajlar JS ile buraya gelecek -->
                </div>

                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Bir mesaj yaz..." maxlength="140">
                    <button id="chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;

    // Chat sistemini başlat
    setupChat();
    initFakeChat();
}

function renderMap() {
    // ... (Eski kodlar aynı) ...
    appContainer.innerHTML = `<div id="game-map"></div>`;
    setTimeout(() => { initMap('game-map'); }, 50);
}

// ... renderPlaceholder ve diğerleri aynı kalabilir ...