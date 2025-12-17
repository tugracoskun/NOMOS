// NOMOS Client Side Logic

// Global değişkenler
let mapInstance = null; 

document.addEventListener('DOMContentLoaded', () => {
    console.log("NOMOS System Initialized.");

    // Navigasyon Mantığı
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Varsayılan olarak Ana Sayfa yükle
    loadPage('home');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Aktif sınıfını değiştir
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const page = link.getAttribute('data-page');
            loadPage(page);
        });
    });
});

function loadPage(pageName) {
    const container = document.getElementById('app-container');
    console.log(`Sayfa yükleniyor: ${pageName}`);
    
    // Harita varsa ve başka sayfaya geçiyorsak haritayı temizle (bellek yönetimi)
    if (mapInstance && pageName !== 'map') {
        mapInstance.remove();
        mapInstance = null;
    }

    if (pageName === 'map') {
        // Harita Konteynerini Oluştur
        container.innerHTML = `<div id="game-map"></div>`;
        initMap();
    } else if (pageName === 'home') {
        container.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:100%; flex-direction:column;">
                <h1 style="color:var(--text-dim); font-size: 3rem; opacity: 0.2;">NOMOS</h1>
                <p style="color:var(--text-dim);">Devlet Yönetim Paneline Hoşgeldiniz.</p>
            </div>
        `;
    } else {
        // Diğer sayfalar için placeholder
        container.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:100%; flex-direction:column;">
                <h1 style="color:var(--text-dim); font-size: 3rem; opacity: 0.2;">${pageName.toUpperCase()}</h1>
                <p style="color:var(--text-dim);">Bu modül yapım aşamasında.</p>
            </div>
        `;
    }
}

function initMap() {
    // Haritayı başlat (Türkiye odaklı)
    // Koordinatlar: [Enlem, Boylam], Zoom Seviyesi: 6
    mapInstance = L.map('game-map', {
        zoomControl: false, // Zoom butonlarını elle ekleyeceğiz veya kapalı tutacağız
        attributionControl: false 
    }).setView([39.0, 35.0], 6);

    // Zoom butonunu sağ alta ekleyelim (Tasarım tercihi)
    L.control.zoom({
        position: 'bottomright'
    }).addTo(mapInstance);

    // KARANLIK TEMA HARİTA KATMANI (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(mapInstance);

    // Örnek bir işaretçi (Ankara)
    const marker = L.marker([39.9334, 32.8597]).addTo(mapInstance);
    marker.bindPopup("<b>Başkent Ankara</b><br>Yönetim Merkezi").openPopup();
    
    console.log("Harita başarıyla yüklendi.");
}