// KATMAN YÖNETİMİ
import { dataUrls } from './config.js';
import { getBaseCountryStyle, getProvinceStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';

let countryLayer = null;
let provinceLayer = null;

export async function loadLayers(mapInstance) {
    // --- PANE (KATMAN) SIRALAMASI ---
    // Zemin (Ülkeler) altta, Detay (Eyaletler) üstte
    mapInstance.createPane('basePane');
    mapInstance.getPane('basePane').style.zIndex = 400;

    mapInstance.createPane('detailPane');
    mapInstance.getPane('detailPane').style.zIndex = 450; 

    // 1. ZEMİNİ YÜKLE
    try {
        const resWorld = await fetch(dataUrls.world);
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane',
                style: getBaseCountryStyle,
                interactive: false // Ülkelere tıklanmasın, sadece renklendirsin
            }).addTo(mapInstance);
        }
    } catch (e) { console.error("Zemin Katman Hatası:", e); }

    // 2. DETAYI YÜKLE (VORONOI)
    try {
        console.log("Map: Detay verisi çekiliyor...");
        const resProv = await fetch(dataUrls.provinces);
        
        if (resProv.ok) {
            const provData = await resProv.json();
            provinceLayer = L.geoJSON(provData, {
                pane: 'detailPane',
                style: getProvinceStyle,
                onEachFeature: (feature, layer) => onProvinceInteraction(feature, layer, mapInstance, provinceLayer)
            }).addTo(mapInstance);
            console.log("Map: Eyaletler yüklendi.");
        }
    } catch (e) { console.error("Detay Katman Hatası:", e); }
}