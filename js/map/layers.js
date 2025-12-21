// KATMAN YÖNETİMİ
import { dataUrls, activeCountries } from './config.js';
import { getBaseCountryStyle, getProvinceStyle, getInternationalBorderStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';

let countryLayer = null;
let provinceLayer = null;
let borderLayer = null;

export async function loadLayers(mapInstance) {
    // Pane Ayarları
    if (!mapInstance.getPane('basePane')) { mapInstance.createPane('basePane'); mapInstance.getPane('basePane').style.zIndex = 300; }
    if (!mapInstance.getPane('detailPane')) { mapInstance.createPane('detailPane'); mapInstance.getPane('detailPane').style.zIndex = 400; }
    if (!mapInstance.getPane('borderPane')) { mapInstance.createPane('borderPane'); mapInstance.getPane('borderPane').style.zIndex = 500; mapInstance.getPane('borderPane').style.pointerEvents = 'none'; }

    // --- 1. ZEMİN (DÜNYA ÜLKELERİ) ---
    try {
        const resWorld = await fetch(dataUrls.world);
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            
            if (countryLayer) mapInstance.removeLayer(countryLayer);
            if (borderLayer) mapInstance.removeLayer(borderLayer);

            // Filtre: Detaylı göstereceğimiz ülkeleri zemin haritasından çıkarıyoruz (Çakışma olmasın)
            const excludeActive = (feature) => {
                const name = feature.properties.NAME || feature.properties.ADMIN;
                return !activeCountries.includes(name);
            };

            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane',
                style: getBaseCountryStyle,
                filter: excludeActive, 
                interactive: false 
            }).addTo(mapInstance);

            borderLayer = L.geoJSON(worldData, {
                pane: 'borderPane',
                style: getInternationalBorderStyle,
                filter: excludeActive,
                interactive: false
            }).addTo(mapInstance);
        }
    } catch (e) { console.error("Zemin Hatası:", e); }

    // --- 2. DETAYLAR (TÜM İLLER DOSYASINDAN SEÇMECE) ---
    try {
        console.log("Map: Eyalet verisi yükleniyor...");
        const resProv = await fetch(dataUrls.allProvinces);
        
        if (resProv.ok) {
            const allData = await resProv.json();
            
            if (provinceLayer) mapInstance.removeLayer(provinceLayer);

            // FİLTRE: Sadece listedeki ülkelerin illerini al
            const onlyActiveCountries = (feature) => {
                const admin = feature.properties.admin || feature.properties.ADMIN;
                return activeCountries.includes(admin);
            };

            provinceLayer = L.geoJSON(allData, {
                pane: 'detailPane',
                style: getProvinceStyle,
                filter: onlyActiveCountries, // Sadece Türkiye, Yunanistan vb. çiz
                onEachFeature: (feature, layer) => onProvinceInteraction(feature, layer, mapInstance)
            }).addTo(mapInstance);
            
            // Seçili ülkelerin kalın dış sınırını da çizelim
            L.geoJSON(allData, {
                pane: 'borderPane',
                style: { color: '#000', weight: 2, fill: false, opacity: 1 },
                filter: onlyActiveCountries,
                interactive: false
            }).addTo(mapInstance);

            console.log("Map: Seçili ülkeler yüklendi.");
        }
    } catch (e) { console.error("Detay Hatası:", e); }
}