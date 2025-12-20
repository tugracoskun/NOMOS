// ROUTER MODÜLÜ
// Sayfa geçişlerini ve URL yönetimini sağlar.

import { initMap, destroyMap } from './map.js';
import { setupChat, initFakeChat } from './chat.js';
import { renderPartiesPage } from './parties/main.js';
import { renderParliamentPage } from './parliament/main.js';

const appContainer = document.getElementById('app-container');

// 1. SAYFA YÜKLEME (View Render)
export function loadPage(pageName, subView = null, id = null) {
    // Harita temizliği (Bellek sızıntısını önler)
    if (pageName !== 'map') { destroyMap(); }
    
    // Menüdeki aktif ışığını güncelle
    updateActiveMenu(pageName);

    console.log(`Router: ${pageName} (View: ${subView}, ID: ${id})`);

    switch (pageName) {
        case 'home':
            renderHome();
            break;
            
        case 'map':
            renderMap();
            break;
            
        case 'parties':
            renderPartiesPage(appContainer, subView, id);
            break;
            
        case 'parliament':
            renderParliamentPage(appContainer);
            break;

        // Henüz yapılmamış sayfalar için Placeholder çağır
        case 'profile':
        case 'trade':
        case 'hangar':
        case 'messages':
        case 'social':
            renderPlaceholder(pageName);
            break;
            
        // Bilinmeyen bir sayfa gelirse de Placeholder göster
        default:
            renderPlaceholder(pageName);
    }
}

// 2. GLOBAL YÖNLENDİRME (History API)
export function navigateTo(pageName, subView = null, id = null) {
    let hash = pageName;
    if (subView) hash += `/${subView}`;
    if (id) hash += `/${id}`;

    // Aynı sayfadaysak işlem yapma
    const currentHash = window.location.hash.substring(1);
    if (currentHash === hash) return;

    history.pushState({ page: pageName, view: subView, id: id }, null, `#${hash}`);
    loadPage(pageName, subView, id);
}

// 3. TARAYICI GEÇMİŞİ DİNLEYİCİSİ
window.addEventListener('popstate', (event) => {
    handleInitialLoad();
});

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

// YARDIMCI: Menü Aktifliği
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
    appContainer.innerHTML = `
        <div class="home-layout">
            <div class="news-feed">
                <div class="news-card">
                    <div class="news-title">📢 Sistem Mesajı</div>
                    <div class="news-body">NOMOS Yönetim Paneline hoşgeldiniz. Geliştirmeler devam ediyor.</div>
                </div>
            </div>
            <div class="chat-widget">
                <div class="chat-header">Global Chat</div>
                <div id="chat-messages" class="chat-messages"></div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Mesaj...">
                    <button id="chat-send-btn">></button>
                </div>
            </div>
        </div>
    `;
    setupChat();
    initFakeChat();
}

function renderMap() { 
    appContainer.innerHTML = `<div id="game-map"></div>`; 
    setTimeout(() => initMap('game-map'), 50); 
}

// DİĞER SAYFALAR İÇİN BOŞ ŞABLON
function renderPlaceholder(title) {
    // Türkçe başlık eşleştirmesi
    const titles = {
        profile: 'Oyuncu Profili',
        trade: 'Ticaret Borsası',
        hangar: 'Askeri Hangar',
        messages: 'Gelen Kutusu',
        social: 'Sosyal Medya'
    };
    
    const displayTitle = titles[title] || title.toUpperCase();

    appContainer.innerHTML = `
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center; color:var(--text-dim);">
            <div style="font-size:3rem; margin-bottom:20px; opacity:0.2;">
                <i class="fa-solid fa-person-digging"></i>
            </div>
            <h2 style="color:var(--text-light); font-size:1.5rem; margin-bottom:10px;">${displayTitle}</h2>
            <p>Bu modül şu anda geliştirme aşamasındadır.</p>
            <p style="font-size:0.8rem; margin-top:5px;">Yakında hizmetinizde olacak.</p>
        </div>
    `;
}