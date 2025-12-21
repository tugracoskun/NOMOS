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

// ... (Üst kısımdaki initMap ve destroyMap aynı kalsın) ...

// --- STİLLER VE RENKLENDİRME ---

// 1. ZEMİN KATMANI STİLİ (Detayı olmayan ülkeler için: Türkiye, Avrupa vb.)
function getBaseCountryStyle(feature) {
    // Ülke ismine göre renk üret
    const name = feature.properties.NAME || feature.properties.ADMIN || "Unknown";
    const color = stringToColor(name);
    
    return {
        fillColor: color,     // Canlı renk kullan
        weight: 1,            // Sınır kalınlığı
        opacity: 1,           // Sınır çizgisi netliği
        color: '#475569',     // Sınır rengi (Açık gri) - Siyah yerine bunu kullanıyoruz
        fillOpacity: 0.8      // DOLGUYU ARTIRDIK (Eskiden 0.5'ti, karanlık duruyordu)
    };
}

// 2. DETAY KATMANI STİLİ (Eyaleti olanlar için: ABD, Rusya vb.)
function getProvinceStyle(feature) {
    const admin = feature.properties.admin || "Unknown";
    const color = stringToColor(admin); // Ülkesiyle aynı tonu alsın
    
    return {
        fillColor: color,
        weight: 0.5,          // Eyalet sınırları daha ince olsun
        opacity: 1,
        color: '#ffffff',     // Eyalet sınırları BEYAZ olsun (ayırıcı özellik)
        fillOpacity: 0.9      // Detaylı yerler biraz daha parlak olsun
    };
}

// RENK ÜRETİCİ (HASH FONKSİYONU)
function stringToColor(str) {
    if (!str) return "#334155"; // İsimsizse varsayılan gri
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // HSL (Hue, Saturation, Lightness) kullanarak daha dengeli renkler üretelim
    // Hue: İsime göre değişsin (0-360)
    // Saturation: %60 (Canlı ama göz yormayan)
    // Lightness: %40 (Koyu tema uyumlu)
    
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 60%, 40%)`; 
}

// --- ETKİLEŞİMLER (AYNI KALSIN) ---

// Zemin Etkileşimi
function onBaseInteraction(feature, layer) {
    const name = feature.properties.NAME || feature.properties.ADMIN;
    
    layer.on('click', (e) => {
        L.popup().setLatLng(e.latlng)
            .setContent(`<div style="text-align:center; color:#0f172a"><b>${name}</b><br><small>Bölge verisi yok</small></div>`)
            .openOn(mapInstance);
    });
    
    // Hover efekti
    layer.on('mouseover', (e) => {
        e.target.setStyle({ fillOpacity: 1, weight: 2, color: '#fff' });
    });
    layer.on('mouseout', (e) => {
        // Eski stiline geri döndür
        const style = getBaseCountryStyle(feature);
        e.target.setStyle(style);
    });
}

// Detay Etkileşimi
function onProvinceInteraction(feature, layer) {
    const name = feature.properties.name;
    const admin = feature.properties.admin;
    
    layer.on({
        mouseover: (e) => {
            e.target.setStyle({ weight: 2, color: '#fff', fillOpacity: 1 });
            e.target.bringToFront();
        },
        mouseout: (e) => {
            // Eski stiline geri döndür
            const style = getProvinceStyle(feature);
            e.target.setStyle(style);
        },
        click: (e) => {
            L.DomEvent.stopPropagation(e);
            mapInstance.fitBounds(e.target.getBounds());
            L.popup().setLatLng(e.latlng)
                .setContent(`<div style="text-align:center; color:#0f172a"><b>${name}</b><br><small>${admin}</small><br><button style="margin-top:5px; cursor:pointer;">Yönet</button></div>`)
                .openOn(mapInstance);
        }
    });
}