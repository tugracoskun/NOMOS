// KATMAN YÖNETİMİ
import { dataUrls } from './config.js';
import { getBaseCountryStyle, getProvinceStyle, getInternationalBorderStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';

let countryLayer = null;  // En Alt (Dolgu)
let provinceLayer = null; // Orta (İller)
let borderLayer = null;   // En Üst (Siyah Sınırlar)

export async function loadLayers(mapInstance) {
    // --- PANE (KATMAN) SIRALAMASI ---
    
    // 1. Zemin (Dolgu)
    if (!mapInstance.getPane('basePane')) {
        mapInstance.createPane('basePane');
        mapInstance.getPane('basePane').style.zIndex = 300;
    }
    // 2. Detay (İller)
    if (!mapInstance.getPane('detailPane')) {
        mapInstance.createPane('detailPane');
        mapInstance.getPane('detailPane').style.zIndex = 400; 
    }
    // 3. Sınır (Çerçeve) - EN ÜSTTE OLACAK
    if (!mapInstance.getPane('borderPane')) {
        mapInstance.createPane('borderPane');
        mapInstance.getPane('borderPane').style.zIndex = 500; // En yüksek Z-Index
        mapInstance.getPane('borderPane').style.pointerEvents = 'none'; // Tıklamayı engelle
    }

    // --- 1 & 3. DÜNYA VERİSİNİ ÇEK (Hem Zemin Hem Sınır İçin) ---
    try {
        const resWorld = await fetch(dataUrls.world);
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            
            // Temizlik
            if (countryLayer) mapInstance.removeLayer(countryLayer);
            if (borderLayer) mapInstance.removeLayer(borderLayer);

            // KATMAN A: ZEMİN DOLGUSU (En Alt)
            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane',
                style: getBaseCountryStyle,
                interactive: false 
            }).addTo(mapInstance);

            // KATMAN C: ULUSLARARASI SINIRLAR (En Üst)
            // Aynı veriyi tekrar yüklüyoruz ama sadece siyah çizgiler için
            borderLayer = L.geoJSON(worldData, {
                pane: 'borderPane',
                style: getInternationalBorderStyle,
                interactive: false
            }).addTo(mapInstance);
        }
    } catch (e) { console.error("Zemin Hatası:", e); }

    // --- 2. DETAYI YÜKLE (TÜRKİYE İLLERİ - Orta Katman) ---
    try {
        const resProv = await fetch(dataUrls.provinces);
        
        if (resProv.ok) {
            const provData = await resProv.json();
            
            if (provinceLayer) mapInstance.removeLayer(provinceLayer);

            provinceLayer = L.geoJSON(provData, {
                pane: 'detailPane',
                style: getProvinceStyle,
                onEachFeature: (feature, layer) => onProvinceInteraction(feature, layer, mapInstance, provinceLayer)
            }).addTo(mapInstance);
            
            console.log("Map: Katmanlar (Zemin > İller > Sınırlar) yüklendi.");
        }
    } catch (e) { console.error("Detay Hatası:", e); }
}