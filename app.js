// NOMOS Client Side Logic

let mapInstance = null; 

document.addEventListener('DOMContentLoaded', () => {
    console.log("NOMOS System Initialized.");

    // Navigasyon Seçicileri güncellendi (.header-bottom içindekiler)
    const navLinks = document.querySelectorAll('.header-bottom a');
    
    // Varsayılan sayfa
    loadPage('home');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const page = link.getAttribute('data-page');
            loadPage(page);
        });
    });
});

function loadPage(pageName) {
    const container = document.getElementById('app-container');
    
    // Harita temizliği
    if (mapInstance && pageName !== 'map') {
        mapInstance.remove();
        mapInstance = null;
    }

    if (pageName === 'map') {
        container.innerHTML = `<div id="game-map"></div>`;
        initMap();
    } else if (pageName === 'home') {
        container.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:100%; flex-direction:column; gap:10px;">
                <h1 style="color:var(--text-dim); font-size: 2rem;">ANA SAYFA</h1>
                <p style="color:var(--text-dim);">Son Makaleler ve Gündem burada olacak.</p>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:100%; flex-direction:column;">
                <h1 style="color:var(--text-dim); font-size: 2rem; opacity: 0.3;">${pageName.toUpperCase()}</h1>
                <p style="color:var(--text-dim);">Yapım aşamasında.</p>
            </div>
        `;
    }
}

function initMap() {
    // "Sağlam" harita için temel:
    // Fazla detaylı "uydu" veya "sokak" haritası yerine,
    // üzerine veri işleyebileceğimiz sade bir zemin (Canvas) kullanacağız.
    
    mapInstance = L.map('game-map', {
        zoomControl: false,
        attributionControl: false,
        minZoom: 3,
        maxZoom: 6, // Çok içeri girmeyi engelliyoruz, strateji haritası bu.
        // Dünyanın tekrar etmesini engelle (opsiyonel, strateji oyunlarında iyidir)
        maxBoundsViscosity: 1.0 
    }).setView([39.0, 35.0], 5);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // BASEMAP SEÇİMİ:
    // Burası çok önemli. "CartoDB Dark Matter No Labels" kullanıyoruz.
    // Yani sadece kara parçalarının şekli var, üstünde yazı/yol yok.
    // Şehirleri ve sınırları biz kodla ekleyeceğiz.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mapInstance);

    // Şimdilik test için bir başkent ikonu koyalım
    // İleride buraya tüm şehirleri veritabanından çekeceğiz.
    const capitals = [
        { name: "Ankara", coords: [39.9334, 32.8597] },
        { name: "Londra", coords: [51.5074, -0.1278] },
        { name: "Moskova", coords: [55.7558, 37.6173] },
        { name: "Berlin", coords: [52.5200, 13.4050] }
    ];

    capitals.forEach(city => {
        L.circleMarker(city.coords, {
            color: '#3b82f6', // Mavi çerçeve
            fillColor: '#0f172a', // Koyu dolgu
            fillOpacity: 1,
            radius: 6
        }).addTo(mapInstance).bindPopup(`<b>${city.name}</b>`);
    });

    console.log("Harita motoru başlatıldı (Basitleştirilmiş Mod).");
}