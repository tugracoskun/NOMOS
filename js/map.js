// Harita Modülü
// Dual Layer System: Countries (Base) + Provinces (Overlay)

let mapInstance = null;
let countryLayer = null;  // Zemin (Ülkeler)
let provinceLayer = null; // Detay (Eyaletler)

export async function initMap(containerId) {
    if (mapInstance) destroyMap();

    // 1. Sınırlandırma
    const southWest = L.latLng(-85, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    // 2. Harita Motoru
    mapInstance = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        minZoom: 3, 
        maxZoom: 10,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        preferCanvas: true
    }).setView([39.0, 35.0], 4); 

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // --- KATMAN 1: ZEMİN (ÜLKELER) ---
    // Bu katman "boşlukları" dolduracak.
    try {
        const resWorld = await fetch('./assets/world.json');
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            countryLayer = L.geoJSON(worldData, {
                style: getBaseCountryStyle,
                onEachFeature: onBaseInteraction
            }).addTo(mapInstance);
            console.log("Map: Zemin katmanı (Ülkeler) yüklendi.");
        }
    } catch (e) { console.error("Zemin harita hatası:", e); }

    // --- KATMAN 2: DETAY (EYALETLER) ---
    // Bu katman var olan bölgeleri detaylandıracak.
    try {
        const resProv = await fetch('./assets/provinces.json');
        if (resProv.ok) {
            const provData = await resProv.json();
            provinceLayer = L.geoJSON(provData, {
                style: getProvinceStyle,
                onEachFeature: onProvinceInteraction
            }).addTo(mapInstance);
            console.log("Map: Detay katmanı (Eyaletler) yüklendi.");
        }
    } catch (e) { console.error("Detay harita hatası:", e); }
}

export function destroyMap() {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
}

// --- STİLLER ---

// 1. Zemin Stili (Sadece Ülke Sınırları)
function getBaseCountryStyle(feature) {
    // Ülke ismine göre renk üret
    const color = stringToColor(feature.properties.NAME || feature.properties.ADMIN);
    return {
        fillColor: color,
        weight: 1,
        opacity: 1,
        color: '#000', // Ülke sınırları siyah
        fillOpacity: 0.5 // Biraz daha soluk kalsın ki üstteki detay parlasın
    };
}

// 2. Eyalet Stili (Detaylı Sınırlar)
function getProvinceStyle(feature) {
    const admin = feature.properties.admin || "Unknown";
    const color = stringToColor(admin); // Aynı ülkenin eyaletleri aynı ton olsun
    return {
        fillColor: color,
        weight: 0.5,   // Eyalet sınırları daha ince
        opacity: 1,
        color: '#fff', // Eyalet sınırları beyaz/açık
        fillOpacity: 0.8 // Daha canlı
    };
}

// Renk Üretici
function stringToColor(str) {
    if(!str) return "#333";
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        value = Math.floor(value * 0.6); // Koyu tonlar
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

// --- ETKİLEŞİMLER ---

// Zemin Etkileşimi (Ülke Bazlı)
function onBaseInteraction(feature, layer) {
    const name = feature.properties.NAME || "Ülke";
    layer.on('click', (e) => {
        L.popup().setLatLng(e.latlng)
            .setContent(`<div style="text-align:center"><b>${name}</b><br><small>Bölge verisi yok</small></div>`)
            .openOn(mapInstance);
    });
}

// Detay Etkileşimi (Eyalet Bazlı)
function onProvinceInteraction(feature, layer) {
    const name = feature.properties.name || "Bölge";
    const admin = feature.properties.admin || "Ülke";
    
    layer.on({
        mouseover: (e) => {
            e.target.setStyle({ weight: 2, color: '#60a5fa', fillOpacity: 1 });
            e.target.bringToFront();
        },
        mouseout: (e) => {
            provinceLayer.resetStyle(e.target);
        },
        click: (e) => {
            L.DomEvent.stopPropagation(e); // Alttaki ülkeye tıklamayı engelle
            mapInstance.fitBounds(e.target.getBounds());
            L.popup().setLatLng(e.latlng)
                .setContent(`<div style="text-align:center"><b>${name}</b><br><small>${admin}</small><br><button>Yönet</button></div>`)
                .openOn(mapInstance);
        }
    });
}