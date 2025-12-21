// Harita Modülü
// Fix: Katman Sıralaması (Z-Index) ve Yüksek Çözünürlük

let mapInstance = null;
let countryLayer = null;
let provinceLayer = null;

export async function initMap(containerId) {
    if (mapInstance) destroyMap();

    const southWest = L.latLng(-85, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    mapInstance = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        minZoom: 3, 
        maxZoom: 10,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        preferCanvas: true
    }).setView([39.0, 35.0], 5); // Türkiye

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // --- ÖNEMLİ: KATMAN SIRALAMASI (PANE) OLUŞTURMA ---
    // Z-Index mantığı: Sayı ne kadar büyükse o kadar üstte görünür.
    
    // 1. Zemin Katmanı (En altta)
    mapInstance.createPane('basePane');
    mapInstance.getPane('basePane').style.zIndex = 400;

    // 2. Detay Katmanı (En üstte)
    mapInstance.createPane('detailPane');
    mapInstance.getPane('detailPane').style.zIndex = 450; 

    // -----------------------------------------------------

    // 1. ADIM: ZEMİN KATMANI (Ülkeler)
    // Sadece renk versin diye var.
    try {
        const resWorld = await fetch('./assets/world.json');
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane', // <-- EN ALTA ZORLA
                style: getBaseCountryStyle,
                onEachFeature: onBaseInteraction
            }).addTo(mapInstance);
        }
    } catch (e) { console.error(e); }

    // 2. ADIM: DETAY KATMANI (Eyaletler)
    // Sınırları çizsin diye var.
    // NOT: Kesin çözüm için ONLINE YÜKSEK ÇÖZÜNÜRLÜKLÜ veriyi çekiyoruz.
    // Eğer yereldeki 14MB'lık dosyan varsa './assets/provinces.json' yapabilirsin.
    try {
        console.log("Map: Detay verisi çekiliyor...");
        const resProv = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.json');
        
        if (resProv.ok) {
            const provData = await resProv.json();
            provinceLayer = L.geoJSON(provData, {
                pane: 'detailPane', // <-- EN ÜSTE ZORLA
                style: getProvinceStyle,
                onEachFeature: onProvinceInteraction
            }).addTo(mapInstance);
            console.log("Map: Detaylar çizildi.");
        }
    } catch (e) { console.error("Detay hatası:", e); }
}

export function destroyMap() {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
}

// --- STİLLER ---

// Zemin (Ülke) Rengi
function getBaseCountryStyle(feature) {
    const color = stringToColor(feature.properties.NAME || feature.properties.ADMIN);
    return {
        fillColor: color,
        weight: 1.5,          // Kalın dış sınır
        opacity: 1,
        color: '#000',        // Siyah ülke sınırı
        fillOpacity: 1        // Tam görünür
    };
}

// Detay (Eyalet) Sınırları
function getProvinceStyle(feature) {
    return {
        fillColor: 'transparent', // İÇİ BOŞ OLSUN (Alttaki ülkenin rengi görünsün)
        weight: 0.5,              // İnce sınır
        opacity: 1,
        color: 'rgba(0, 0, 0, 0.5)', // Yarı saydam siyah çizgiler
        fillOpacity: 0
    };
}

// Renk Üretici (Daha canlı renkler için HSL)
function stringToColor(str) {
    if(!str) return "#333";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 65%, 45%)`; 
}

// --- ETKİLEŞİMLER ---

function onBaseInteraction(feature, layer) {
    // Zemin etkileşimi (Gerekirse açabiliriz, şimdilik boş)
}

function onProvinceInteraction(feature, layer) {
    const name = feature.properties.name || feature.properties.NAME;
    const admin = feature.properties.admin || feature.properties.ADMIN;

    layer.on({
        mouseover: (e) => {
            // Üzerine gelince belirginleştir
            e.target.setStyle({ 
                weight: 1, 
                color: '#fff', 
                fillColor: '#fff', 
                fillOpacity: 0.2 
            });
        },
        mouseout: (e) => {
            // Eski haline döndür
            provinceLayer.resetStyle(e.target);
        },
        click: (e) => {
            L.DomEvent.stopPropagation(e);
            mapInstance.fitBounds(e.target.getBounds());
            L.popup().setLatLng(e.latlng)
                .setContent(`
                    <div style="text-align:center;">
                        <small style="color:#64748b; font-weight:bold;">${admin}</small><br>
                        <b style="font-size:1.1rem; color:#0f172a;">${name}</b><br>
                        <button style="margin-top:5px;">Yönet</button>
                    </div>
                `)
                .openOn(mapInstance);
        }
    });
}