// Router Modülü
import { initMap, destroyMap } from './map.js';
import { setupChat, initFakeChat } from './chat.js';

const appContainer = document.getElementById('app-container');

export function loadPage(pageName) {
    console.log(`Router: ${pageName} sayfasına geçiliyor.`);

    // Harita temizliği
    if (pageName !== 'map') { destroyMap(); }

    // SAYFA YÖNLENDİRME MANTIĞI
    switch (pageName) {
        case 'home':
            renderHome();
            break;
        case 'map':
            renderMap();
            break;
        case 'parties':
            renderParties(); // Artık özel fonksiyonu var
            break;
        
        // Diğer sayfalar şimdilik placeholder'a gidecek
        case 'profile':
        case 'parliament':
        case 'trade':
        case 'hangar':
        case 'messages':
        case 'social':
            renderPlaceholder(pageName);
            break;
            
        default:
            // BUG FİX: Bilinmeyen sayfa gelirse Ana Sayfa yerine Hata/Placeholder göster
            renderPlaceholder(pageName); 
    }
}

// --- ANA SAYFA ---
function renderHome() {
    appContainer.innerHTML = `
        <div class="home-layout">
            <div class="news-feed">
                <div class="news-card">
                    <div class="news-title">📢 Seçimler Yaklaşıyor!</div>
                    <span class="news-meta">Devlet Haber Ajansı • 10 dk önce</span>
                    <div class="news-body">Yüksek Seçim Kurulu, 15. Dönem Başkanlık seçimlerinin önümüzdeki hafta başlayacağını duyurdu.</div>
                </div>
                 <div class="news-card">
                    <div class="news-title">📉 Petrol Fiyatlarında Düşüş</div>
                    <span class="news-meta">Ekonomi Bakanlığı • 1 saat önce</span>
                    <div class="news-body">Küresel piyasalardaki durgunluk sebebiyle varil fiyatları %5 düştü.</div>
                </div>
            </div>

            <div class="chat-widget">
                <div class="chat-header">
                    <span><i class="fa-solid fa-earth-europe"></i> Global Chat</span>
                    <span class="online-count"><i class="fa-solid fa-circle"></i> 1,240 Online</span>
                </div>
                <div id="chat-messages" class="chat-messages"></div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Bir mesaj yaz..." maxlength="140">
                    <button id="chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
    setupChat();
    initFakeChat();
}

// --- PARTİLER SAYFASI (YENİ) ---
function renderParties() {
    // Byjus Listesinden Alınan İdeolojiler
    const ideologies = [
        { 
            name: "Anarşizm", 
            desc: "Devleti ve otoriteyi reddeden, gönüllü işbirliğine dayalı toplumu savunan ideoloji.", 
            icon: "fa-solid fa-a", 
            color: "color-yellow" 
        },
        { 
            name: "Mutlakiyet (Absolutism)", 
            desc: "Tüm gücün tek bir hükümdarda veya liderde toplandığı yönetim biçimi.", 
            icon: "fa-solid fa-crown", 
            color: "color-dark" 
        },
        { 
            name: "Liberalizm", 
            desc: "Bireysel özgürlükleri, hukukun üstünlüğünü ve serbest piyasayı temel alan görüş.", 
            icon: "fa-solid fa-dove", 
            color: "color-blue" 
        },
        { 
            name: "Muhafazakarlık", 
            desc: "Geleneksel sosyal kurumların korunmasını ve kademeli değişimi savunan siyaset.", 
            icon: "fa-solid fa-scale-balanced", 
            color: "color-gray" 
        },
        { 
            name: "Sosyalizm", 
            desc: "Üretim araçlarının toplumsal mülkiyetini ve daha eşit bir gelir dağılımını hedefler.", 
            icon: "fa-solid fa-users", 
            color: "color-red" 
        },
        { 
            name: "Komünizm", 
            desc: "Sınıfsız, parasız ve devletsiz bir toplumsal düzeni amaçlayan devrimci ideoloji.", 
            icon: "fa-solid fa-hammer", 
            color: "color-red" 
        },
        { 
            name: "Milliyetçilik", 
            desc: "Ulusun çıkarlarını her şeyin üstünde tutan ve ulusal egemenliği savunan görüş.", 
            icon: "fa-solid fa-flag", 
            color: "color-dark" 
        },
        { 
            name: "Faşizm", 
            desc: "Otoriter liderlik, aşırı milliyetçilik ve devletin toplum üzerindeki sıkı kontrolü.", 
            icon: "fa-solid fa-hand-fist", 
            color: "color-dark" 
        },
        { 
            name: "Feminizm", 
            desc: "Cinsiyetler arası siyasi, ekonomik ve sosyal eşitliği savunan hareket.", 
            icon: "fa-solid fa-venus", 
            color: "color-purple" 
        },
        { 
            name: "Çevrecilik (Yeşil Siyaset)", 
            desc: "Ekolojik sürdürülebilirliği ve çevrenin korunmasını merkeze alan ideoloji.", 
            icon: "fa-solid fa-leaf", 
            color: "color-green" 
        }
    ];

    // Kartları oluştur
    let cardsHtml = ideologies.map(item => `
        <div class="ideology-card ${item.color}">
            <div class="card-header">
                <div class="ideology-icon"><i class="${item.icon}"></i></div>
                <div class="ideology-name">${item.name}</div>
            </div>
            <div class="ideology-desc">${item.desc}</div>
        </div>
    `).join('');

    appContainer.innerHTML = `
        <div class="parties-layout">
            <div class="page-header">
                <h2 class="page-title">Siyasi Partiler ve İdeolojiler</h2>
                <div class="page-subtitle">NOMOS dünyasında bir parti kurarken seçebileceğiniz yönetim biçimleri.</div>
            </div>
            
            <div class="ideology-grid">
                ${cardsHtml}
            </div>
        </div>
    `;
}

// --- HARİTA ---
function renderMap() {
    appContainer.innerHTML = `<div id="game-map"></div>`;
    setTimeout(() => { initMap('game-map'); }, 50);
}

// --- BOŞ SAYFALAR ---
function renderPlaceholder(title) {
    // Türkçe başlıklar
    const titles = {
        profile: 'Oyuncu Profili',
        parliament: 'Millet Meclisi',
        trade: 'Ticaret Borsası',
        hangar: 'Askeri Hangar',
        messages: 'Gelen Kutusu',
        social: 'Sosyal Medya Akışı'
    };

    const displayTitle = titles[title] || title.toUpperCase();

    appContainer.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100%; flex-direction:column; gap:15px; text-align:center;">
            <div style="font-size:3rem; color:var(--text-dim); opacity:0.3;">
                <i class="fa-solid fa-screwdriver-wrench"></i>
            </div>
            <h2 style="color:var(--text-light); font-size:1.5rem;">${displayTitle}</h2>
            <p style="color:var(--text-dim);">Bu modül henüz aktif edilmedi.</p>
        </div>
    `;
}