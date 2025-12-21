// KATMAN YÖNETİMİ
import { dataUrls } from './config.js';
import { getBaseCountryStyle, getProvinceStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';

let countryLayer = null;
let provinceLayer = null;

export async function loadLayers(mapInstance) {
    // Pane Ayarları
    if (!mapInstance.getPane('basePane')) {
        mapInstance.createPane('basePane');
        mapInstance.getPane('basePane').style.zIndex = 300;
    }
    if (!mapInstance.getPane('detailPane')) {
        mapInstance.createPane('detailPane');
        mapInstance.getPane('detailPane').style.zIndex = 400; 
    }

    // 1. ZEMİNİ YÜKLE (GÜVENLİK AĞI)
    // Bu dosya yerelde (assets/world.json) olduğu için anında açılır.
    try {
        const resWorld = await fetch('./assets/world.json');
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            
            if (countryLayer) mapInstance.removeLayer(countryLayer);

            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane',
                style: getBaseCountryStyle, // Artık görünür stili var
                interactive: false 
            }).addTo(mapInstance);
            console.log("Map: Zemin katmanı yüklendi.");
        } else {
            console.error("Map: assets/world.json bulunamadı!");
        }
    } catch (e) { console.error("Zemin Hatası:", e); }

    // 2. DETAYI YÜKLE (EYALETLER)
    // Bu dosya internetten gelir, geç gelebilir veya hata verebilir.
    try {
        console.log("Map: Detay verisi indiriliyor...");
        const resProv = await fetch(dataUrls.provinces);
        
        if (resProv.ok) {
            const provData = await resProv.json();
            
            if (provinceLayer) mapInstance.removeLayer(provinceLayer);

            provinceLayer = L.geoJSON(provData, {
                pane: 'detailPane',
                style: getProvinceStyle,
                onEachFeature: (feature, layer) => onProvinceInteraction(feature, layer, mapInstance, provinceLayer)
            }).addTo(mapInstance);
            console.log("Map: Detaylar başarıyla çizildi.");
        } else {
            console.warn("Map: Detaylı harita indirilemedi, zemin haritası kullanılıyor.");
        }
    } catch (e) { 
        console.error("Detay Hatası:", e); 
    }
}