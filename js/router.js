// ROUTER MODÜLÜ
// Sayfa geçişlerini, URL yönetimini ve Geçmiş (History) API'sini yönetir.

import { initMap, destroyMap } from './map/main.js';
import { renderHome } from './home.js';
import { renderPartiesPage } from './parties/main.js';
import { renderParliamentPage } from './parliament/main.js';
import { renderCityPage } from './city/main.js';
import { renderCountryPage } from './country/main.js';
import { renderTradePage } from './trade/main.js';
import { renderMessagesPage } from './messages/main.js';

const appContainer = document.getElementById('app-container');

// ========================================================
// 1. SAYFA YÜKLEME (View Render)
// ========================================================
// ========================================================
// 5. YÜKLEME ÇUBUĞU YÖNETİMİ
// ========================================================
let loadingInterval = null;

export function startLoading() {
    const bar = document.getElementById('global-progress-bar');
    if (!bar) return;

    // Önceki animasyonu temizle ve çubuğu sıfırla
    bar.style.transition = 'none';
    bar.style.width = '0%';
    bar.style.opacity = '1';

    // Reflow tetikle (Browser'ın değişikliği algılaması için)
    bar.offsetHeight;

    // Yavaşça %90'a kadar ilerle (CSS transition ile akıcı)
    // 10 saniyede %90'a varacak şekilde ayarla (Yükleme bitince hızlanacak)
    requestAnimationFrame(() => {
        bar.style.transition = 'width 10s cubic-bezier(0.2, 0.5, 0.3, 1)';
        bar.style.width = '90%';
    });
}

export function finishLoading() {
    const bar = document.getElementById('global-progress-bar');
    if (!bar) return;

    // Mevcut konumdan %100'e hızlıca tamamla
    bar.style.transition = 'width 0.4s ease-out';
    bar.style.width = '100%';

    // İşlem bitince gizle
    setTimeout(() => {
        bar.style.opacity = '0';
        setTimeout(() => {
            // Gelecek yükleme için sıfırla
            bar.style.transition = 'none';
            bar.style.width = '0%';
        }, 400); // Opacity transition süresi
    }, 400); // Width tamamlanma süresi
}

// ========================================================
// 1. SAYFA YÜKLEME (View Render)
// ========================================================
export function loadPage(pageName, subView = null, id = null) {
    // Yükleme Animasyonunu Başlat (Sadece Map dışı veya ilk yükleme için görsel güzellik)
    // Map kendi yüklemesini yönetebilir ama router geçişinde de tetikleyelim.
    startLoading();

    // Harita temizliği (Bellek sızıntısını önlemek için)
    if (pageName !== 'map') {
        destroyMap();
    }

    // Menüdeki aktif ışığını güncelle
    updateActiveMenu(pageName);

    console.log(`Router: ${pageName} (View: ${subView}, ID: ${id})`);

    // Kısa bir gecikme ile içeriği render et (UI thread'i bloklamamak için)
    setTimeout(() => {
        switch (pageName) {
            case 'home':
                renderHome(appContainer);
                finishLoading();
                break;

            case 'map':
                renderMap();
                // Map modülü kendi finishLoading'ini çağırabilir, ama şimdilik burada bitirelim
                // Gerçek map yüklemesi veri çekince bitmeli, oraya bağlayacağız.
                // finishLoading(); // Map içinde çağrılacak
                break;

            case 'parties':
                renderPartiesPage(appContainer, subView, id);
                finishLoading();
                break;

            case 'parliament':
                renderParliamentPage(appContainer);
                finishLoading();
                break;

            case 'city':
                renderCityPage(appContainer, subView);
                finishLoading();
                break;

            case 'country':
                renderCountryPage(appContainer, subView ? decodeURIComponent(subView) : null);
                finishLoading();
                break;

            case 'trade':
                renderTradePage(appContainer);
                finishLoading();
                break;

            case 'messages':
                renderMessagesPage(appContainer);
                finishLoading();
                break;

            case 'profile':
            case 'hangar':
            case 'social':
                renderPlaceholder(pageName);
                finishLoading();
                break;

            default:
                renderPlaceholder(pageName);
                finishLoading();
        }
    }, 50); // Minik render gecikmesi
}

// ========================================================
// 2. GLOBAL YÖNLENDİRME (History API)
// ========================================================
// Tıklamalarda bu fonksiyon çağrılır. URL'i günceller ve sayfayı yükler.
export function navigateTo(pageName, subView = null, id = null) {
    let hash = pageName;
    if (subView) hash += `/${subView}`;
    if (id) hash += `/${id}`;

    // Eğer zaten aynı sayfadaysak işlem yapma
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