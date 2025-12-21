// KATMAN YÖNETİMİ
// Harita verilerini çeker, filtreler ve katman (Pane) sırasına göre dizer.

import { dataUrls, detailedCountries } from './config.js';
import { getBaseCountryStyle, getProvinceStyle, getInternationalBorderStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';

// Global değişkenler (Temizlik için)
let countryLayer = null;
let borderLayer = null;
let provinceLayers = []; // Birden fazla detaylı ülke olduğu için dizi

export async function loadLayers(mapInstance) {
    // --- PANE (KATMAN) AYARLARI ---
    // 1. Zemin (Dolgu) - En Alt
    if (!mapInstance.getPane('basePane')) {
        mapInstance.createPane('basePane');
        mapInstance.getPane('basePane').style.zIndex = 300;
    }
    // 2. Detay (Eyaletler/İller) - Orta
    if (!mapInstance.getPane('detailPane')) {
        mapInstance.createPane('detailPane');
        mapInstance.getPane('detailPane').style.zIndex = 400; 
    }
    // 3. Sınır (Kalın Çerçeveler) - En Üst
    if (!mapInstance.getPane('borderPane')) {
        mapInstance.createPane('borderPane');
        mapInstance.getPane('borderPane').style.zIndex = 500;
        mapInstance.getPane('borderPane').style.pointerEvents = 'none'; // Tıklamayı engelle, sadece görsellik
    }

    // --- 1. DÜNYA ZEMİNİ VE ANA SINIRLAR ---
    try {
        const resWorld = await fetch(dataUrls.world);
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            
            // Önceki katmanları temizle
            if (countryLayer) mapInstance.removeLayer(countryLayer);
            if (borderLayer) mapInstance.removeLayer(borderLayer);

            // FİLTRELEME FONKSİYONU
            // Detaylı yükleyeceğimiz ülkeleri (Türkiye, Yunanistan vb.) bu ana haritadan çıkarıyoruz.
            const excludeDetailed = (feature) => {
                const name = feature.properties.NAME || feature.properties.ADMIN || feature.properties.name;
                // Eğer ülke listemizde varsa FALSE döndür (Çizme)
                return !Object.keys(detailedCountries).includes(name);
            };

            // KATMAN A: ZEMİN (Detaylı ülkeler hariç)
            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane',
                style: getBaseCountryStyle,
                filter: excludeDetailed, 
                interactive: false 
            }).addTo(mapInstance);

            // KATMAN C: SİYAH KALIN SINIRLAR (Detaylı ülkeler hariç)
            borderLayer = L.geoJSON(worldData, {
                pane: 'borderPane',
                style: getInternationalBorderStyle,
                filter: excludeDetailed,
                interactive: false
            }).addTo(mapInstance);
        }
    } catch (e) { console.error("Zemin Hatası:", e); }

    // --- 2. DETAYLI ÜLKELERİ YÜKLE ---
    // Önceki detay katmanlarını temizle
    provinceLayers.forEach(l => mapInstance.removeLayer(l));
    provinceLayers = [];

    // Listemizdeki her ülke için döngü (TR, GR, BG...)
    for (const [countryName, url] of Object.entries(detailedCountries)) {
        loadSingleCountry(mapInstance, countryName, url);
    }
}

// Tek bir ülkeyi yükleyip monte eden fonksiyon
async function loadSingleCountry(mapInstance, countryName, url) {
    try {
        console.log(`Map: ${countryName} verisi yükleniyor...`);
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            
            // A. Eyaletler (Orta Katman - Renkli ve Etkileşimli)
            const layer = L.geoJSON(data, {
                pane: 'detailPane',
                style: (feature) => getProvinceStyle(feature),
                onEachFeature: (feature, layer) => onProvinceInteraction(feature, layer, mapInstance)
            }).addTo(mapInstance);
            
            provinceLayers.push(layer);

            // B. O Ülkenin Dış Sınırı (En Üst Katman - Siyah Çerçeve)
            // Bütünlüğü sağlamak için kendi verisinden sınır çiziyoruz
            const border = L.geoJSON(data, {
                pane: 'borderPane',
                style: { 
                    color: '#000000', 
                    weight: 2, 
                    fill: false, 
                    opacity: 1 
                },
                interactive: false
            }).addTo(mapInstance);
            
            provinceLayers.push(border); // Temizlik listesine ekle

        } else {
            console.warn(`Map: ${countryName} verisi bulunamadı (${url})`);
        }
    } catch (e) {
        console.error(`${countryName} Yükleme Hatası:`, e);
    }
}