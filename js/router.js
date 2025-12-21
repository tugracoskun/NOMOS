// ROUTER MODÜLÜ
// Sayfa geçişlerini, URL yönetimini ve Geçmiş (History) API'sini yönetir.

import { initMap, destroyMap } from './map/main.js';
import { renderHome } from './home.js';
import { renderPartiesPage } from './parties/main.js';
import { renderParliamentPage } from './parliament/main.js';

const appContainer = document.getElementById('app-container');

// ========================================================
// 1. SAYFA YÜKLEME (View Render)
// ========================================================
export function loadPage(pageName, subView = null, id = null) {
    // Harita temizliği (Bellek sızıntısını önlemek için)
    if (pageName !== 'map') { 
        destroyMap(); 
    }
    
    // Menüdeki aktif ışığını güncelle
    updateActiveMenu(pageName);

    console.log(`Router: ${pageName} (View: ${subView}, ID: ${id})`);

    switch (pageName) {
        case 'home':
            // Ana Sayfa ve Chat modülü
            renderHome(appContainer);
            break;
            
        case 'map':
            // Harita Modülü
            renderMap();
            break;
            
        case 'parties':
            // Partiler Modülü (Liste, Oluşturma veya Detay)
            renderPartiesPage(appContainer, subView, id);
            break;
            
        case 'parliament':
            // Meclis Modülü
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
            
        // Bilinmeyen bir sayfa gelirse Ana Sayfaya atma, Placeholder göster
        default:
            renderPlaceholder(pageName);
    }
}

// ========================================================
// 2. GLOBAL YÖNLENDİRME (History API)
// ========================================================
// Tıklamalarda bu fonksiyon çağrılır. URL'i günceller ve sayfayı yükler.
export function navigateTo(pageName, subView = null, id = null) {
    let hash = pageName;
    if (subView) hash += `/${subView}`;
    if (id) hash += `/${id}`;

    // Eğer zaten aynı sayfadaysak işlem yapma (Gereksiz history şişirme)
    const currentHash = window.location.hash.substring(1);
    if (currentHash === hash) return;

    // URL'i güncelle ve geçmişe kaydet
    history.pushState({ page: pageName, view: subView, id: id }, null, `#${hash}`);
    
    // Sayfayı yükle
    loadPage(pageName, subView, id);
}

// ========================================================
// 3. TARAYICI GEÇMİŞİ DİNLEYİCİSİ (Geri/İleri Tuşları)
// ========================================================
window.addEventListener('popstate', (event) => {
    handleInitialLoad();
});

// Sayfa ilk açıldığında veya F5 atıldığında URL'i analiz et
export function handleInitialLoad() {
    const hash = window.location.hash.substring(1); // # işaretini at
    
    // Hash yoksa ana sayfaya git
    if (!hash) {
        navigateTo('home');
        return;
    }

    // Hash'i parçala (örn: parties/detail/5 -> ['parties', 'detail', '5'])
    const parts = hash.split('/');
    const page = parts[0];
    const subView = parts[1] || null;
    const id = parts[2] || null;

    loadPage(page, subView, id);
}

// ========================================================
// 4. YARDIMCI FONKSİYONLAR
// ========================================================

// Menüdeki aktif sınıfını güncelle
function updateActiveMenu(pageName) {
    document.querySelectorAll('.header-bottom a').forEach(link => {
        link.classList.remove('active');
        // data-page özelliği eşleşen linki bul
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
}

// Harita için kapsayıcı oluşturup başlatma
function renderMap() { 
    appContainer.innerHTML = `<div id="game-map"></div>`; 
    // DOM oluştuktan hemen sonra haritayı çiz
    setTimeout(() => initMap('game-map'), 50); 
}

// Henüz yapılmamış sayfalar için "Yapım Aşamasında" ekranı
function renderPlaceholder(title) {
    // İngilizce ID'leri Türkçe Başlıklara Çevir
    const titles = {
        profile: 'Oyuncu Profili',
        trade: 'Ticaret Borsası',
        hangar: 'Askeri Hangar',
        messages: 'Gelen Kutusu',
        social: 'Sosyal Medya Akışı'
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