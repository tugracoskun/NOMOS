// KATMAN YÖNETİMİ (MAIN)
import { dataUrls } from './config.js';
import { getBaseCountryStyle, getProvinceStyle, getInternationalBorderStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';
import { setupMapPanes } from './layer-setup.js'; // Yeni
import { filterBaseLayer, filterNeighborLayer } from './layer-filters.js'; // Yeni

// Global Referanslar (Temizlik için)
let countryLayer = null;
let provinceLayerGroup = null; // Grup yaptık, içine ekleyeceğiz
let borderLayer = null;

export async function loadLayers(mapInstance) {
    // 1. Pane Ayarlarını Yap
    setupMapPanes(mapInstance);

    // Detay Grubu Hazırla
    if (provinceLayerGroup) {
        mapInstance.removeLayer(provinceLayerGroup);
    }
    provinceLayerGroup = L.layerGroup().addTo(mapInstance);


    // --- ADIM 1: DÜNYA ZEMİNİ (BASE) ---
    try {
        const res = await fetch(dataUrls.world);
        if (res.ok) {
            const data = await res.json();
            
            // Temizlik
            if (countryLayer) mapInstance.removeLayer(countryLayer);
            if (borderLayer) mapInstance.removeLayer(borderLayer);

            // Zemin (Dolgu)
            countryLayer = L.geoJSON(data, {
                pane: 'basePane',
                style: getBaseCountryStyle,
                filter: filterBaseLayer, // filter-logic.js'den geliyor
                interactive: false 
            }).addTo(mapInstance);

            // Sınırlar (Çerçeve)
            borderLayer = L.geoJSON(data, {
                pane: 'borderPane',
                style: getInternationalBorderStyle,
                filter: filterBaseLayer,
                interactive: false
            }).addTo(mapInstance);
        }
    } catch (e) { console.error("Zemin Yükleme Hatası:", e); }


    // --- ADIM 2: DETAYLI ÜLKELER (HİBRİT) ---

    // A. TÜRKİYE (Yüksek Detay - Yerel)
    // Filtre: Hepsini al (True)
    loadGeoJsonFile(mapInstance, dataUrls.turkey, () => true);

    // B. KOMŞULAR (Orta Detay - Büyük Dosya)
    // Filtre: Sadece listedekiler
    loadGeoJsonFile(mapInstance, dataUrls.neighbors, filterNeighborLayer);
}

// Dosya Yükleyici Yardımcı Fonksiyon
async function loadGeoJsonFile(mapInstance, url, filterFn) {
    try {
        console.log(`Veri yükleniyor: ${url}`);
        const res = await fetch(url);
        
        if (res.ok) {
            const data = await res.json();
            
            // 1. Renkli Eyaletler
            const layer = L.geoJSON(data, {
                pane: 'detailPane',
                style: getProvinceStyle,
                filter: filterFn,
                onEachFeature: (feature, l) => onProvinceInteraction(feature, l, mapInstance)
            });
            provinceLayerGroup.addLayer(layer);

            // 2. Siyah Kalın Sınırlar (Ülke bütünlüğü için)
            const borders = L.geoJSON(data, {
                pane: 'borderPane',
                style: { color: '#000', weight: 2, fill: false, opacity: 1 },
                filter: filterFn,
                interactive: false
            });
            provinceLayerGroup.addLayer(borders);
            
            console.log(`Tamamlandı: ${url}`);
        } else {
            console.warn(`Dosya bulunamadı: ${url}`);
        }
    } catch (e) { 
        console.error(`Hata (${url}):`, e); 
    }
}