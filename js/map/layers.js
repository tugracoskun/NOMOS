// KATMAN YÖNETİMİ
import { dataUrls, detailedCountries } from './config.js';
import { getBaseCountryStyle, getProvinceStyle, getInternationalBorderStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';

let countryLayer = null;
let provinceLayers = [];
let borderLayer = null;

export async function loadLayers(mapInstance) {
    // Pane Ayarları
    if (!mapInstance.getPane('basePane')) { mapInstance.createPane('basePane'); mapInstance.getPane('basePane').style.zIndex = 300; }
    if (!mapInstance.getPane('detailPane')) { mapInstance.createPane('detailPane'); mapInstance.getPane('detailPane').style.zIndex = 400; }
    if (!mapInstance.getPane('borderPane')) { mapInstance.createPane('borderPane'); mapInstance.getPane('borderPane').style.zIndex = 500; mapInstance.getPane('borderPane').style.pointerEvents = 'none'; }

    // --- 1. DÜNYA ZEMİNİ (DETAYLILAR HARİÇ) ---
    try {
        const resWorld = await fetch(dataUrls.world);
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            
            if (countryLayer) mapInstance.removeLayer(countryLayer);
            if (borderLayer) mapInstance.removeLayer(borderLayer);

            // FİLTRELEME FONKSİYONU (Debug özellikli)
            const excludeDetailed = (feature) => {
                const name = feature.properties.NAME || feature.properties.ADMIN || feature.properties.name;
                
                // Listemizde bu isim var mı?
                const isDetailed = Object.keys(detailedCountries).includes(name);
                
                // Eğer detaylıysa FALSE döndür (Çizme), değilse TRUE döndür (Çiz)
                return !isDetailed;
            };

            // Zemin Katmanı
            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane',
                style: getBaseCountryStyle,
                filter: excludeDetailed, // Filtreyi uygula
                interactive: false 
            }).addTo(mapInstance);

            // Sınır Katmanı
            borderLayer = L.geoJSON(worldData, {
                pane: 'borderPane',
                style: getInternationalBorderStyle,
                filter: excludeDetailed,
                interactive: false
            }).addTo(mapInstance);
        }
    } catch (e) { console.error("Zemin Hatası:", e); }

    // --- 2. DETAYLI ÜLKELERİ YÜKLE ---
    provinceLayers.forEach(l => mapInstance.removeLayer(l));
    provinceLayers = [];

    for (const [countryName, url] of Object.entries(detailedCountries)) {
        loadSingleCountry(mapInstance, countryName, url);
    }
}

async function loadSingleCountry(mapInstance, countryName, url) {
    try {
        console.log(`Map: ${countryName} indiriliyor...`);
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            
            // A. Eyaletler
            const layer = L.geoJSON(data, {
                pane: 'detailPane',
                style: (feature) => getProvinceStyle(feature, countryName),
                onEachFeature: (feature, layer) => onProvinceInteraction(feature, layer, mapInstance)
            }).addTo(mapInstance);
            provinceLayers.push(layer);

            // B. Dış Sınır (Simsiyah Çerçeve)
            const border = L.geoJSON(data, {
                pane: 'borderPane',
                style: { color: '#000', weight: 2, fill: false, opacity: 1 },
                interactive: false
            }).addTo(mapInstance);
            provinceLayers.push(border);
            
            console.log(`Map: ${countryName} eklendi.`);
        } else {
            console.warn(`Map: ${countryName} verisi hatalı (${response.status})`);
        }
    } catch (e) {
        console.error(`${countryName} yüklenirken hata:`, e);
    }
}