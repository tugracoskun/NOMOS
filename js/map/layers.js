// KATMAN YÖNETİMİ (MULTI-COUNTRY SUPPORT)
import { dataUrls, detailedCountries } from './config.js';
import { getBaseCountryStyle, getProvinceStyle, getInternationalBorderStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';

let countryLayer = null;
let provinceLayers = []; // Artık bir dizi, birden fazla ülke olabilir
let borderLayer = null;

export async function loadLayers(mapInstance) {
    // Pane Ayarları (Sandviç)
    setupPanes(mapInstance);

    // --- 1. DÜNYA ZEMİNİ (DETAYLI ÜLKELER HARİÇ) ---
    try {
        const resWorld = await fetch(dataUrls.world);
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            
            // Temizlik
            if (countryLayer) mapInstance.removeLayer(countryLayer);
            if (borderLayer) mapInstance.removeLayer(borderLayer);

            // FİLTRELEME: Listede olan ülkeleri dünya haritasından çıkar
            const excludeDetailed = (feature) => {
                const name = feature.properties.NAME || feature.properties.ADMIN;
                // Eğer ülke detailedCountries listesinde varsa, false döndür (çizme)
                return !Object.keys(detailedCountries).includes(name);
            };

            // ZEMİN (Dolgu)
            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane',
                style: getBaseCountryStyle,
                filter: excludeDetailed, 
                interactive: false 
            }).addTo(mapInstance);

            // DIŞ SINIRLAR (Çerçeve)
            borderLayer = L.geoJSON(worldData, {
                pane: 'borderPane',
                style: getInternationalBorderStyle,
                filter: excludeDetailed,
                interactive: false
            }).addTo(mapInstance);
        }
    } catch (e) { console.error("Zemin Hatası:", e); }

    // --- 2. DETAYLI ÜLKELERİ YÜKLE (DÖNGÜ) ---
    // Listemizdeki her ülkeyi tek tek indirip ekler
    
    // Önceki detay katmanlarını temizle
    provinceLayers.forEach(layer => mapInstance.removeLayer(layer));
    provinceLayers = [];

    const countryNames = Object.keys(detailedCountries);
    
    // Her bir ülke için işlem yap
    for (const countryName of countryNames) {
        loadSingleCountry(mapInstance, countryName, detailedCountries[countryName]);
    }
}

async function loadSingleCountry(mapInstance, countryName, url) {
    try {
        console.log(`Map: ${countryName} verisi indiriliyor...`);
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            
            // A. Eyaletler (Orta Katman)
            const layer = L.geoJSON(data, {
                pane: 'detailPane',
                style: (feature) => getProvinceStyle(feature, countryName),
                onEachFeature: (feature, layer) => onProvinceInteraction(feature, layer, mapInstance)
            }).addTo(mapInstance);
            
            provinceLayers.push(layer);

            // B. O ülkenin Dış Sınırı (En Üst Katman)
            // Kendi detaylı verisinden kalın sınır çiziyoruz ki bütünlük bozulmasın
            const border = L.geoJSON(data, {
                pane: 'borderPane',
                style: { color: '#000', weight: 2, fill: false, opacity: 1 },
                interactive: false
            }).addTo(mapInstance);
            
            provinceLayers.push(border); // Temizlik için listeye ekle

        } else {
            console.warn(`Map: ${countryName} yüklenemedi.`);
        }
    } catch (e) {
        console.error(`${countryName} Hatası:`, e);
    }
}

function setupPanes(mapInstance) {
    if (!mapInstance.getPane('basePane')) {
        mapInstance.createPane('basePane'); mapInstance.getPane('basePane').style.zIndex = 300;
    }
    if (!mapInstance.getPane('detailPane')) {
        mapInstance.createPane('detailPane'); mapInstance.getPane('detailPane').style.zIndex = 400; 
    }
    if (!mapInstance.getPane('borderPane')) {
        mapInstance.createPane('borderPane'); mapInstance.getPane('borderPane').style.zIndex = 500; mapInstance.getPane('borderPane').style.pointerEvents = 'none';
    }
}