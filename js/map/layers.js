// KATMAN YÖNETİMİ
import { dataUrls } from './config.js';
import { getBaseCountryStyle, getProvinceStyle, getInternationalBorderStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';

let countryLayer = null;
let provinceLayer = null;
let borderLayer = null;

export async function loadLayers(mapInstance) {
    // --- PANE (KATMAN) SIRALAMASI ---
    if (!mapInstance.getPane('basePane')) {
        mapInstance.createPane('basePane');
        mapInstance.getPane('basePane').style.zIndex = 300;
    }
    if (!mapInstance.getPane('detailPane')) {
        mapInstance.createPane('detailPane');
        mapInstance.getPane('detailPane').style.zIndex = 400; 
    }
    if (!mapInstance.getPane('borderPane')) {
        mapInstance.createPane('borderPane');
        mapInstance.getPane('borderPane').style.zIndex = 500;
        mapInstance.getPane('borderPane').style.pointerEvents = 'none';
    }

    // --- 1. DÜNYA ZEMİNİ VE SINIRLARI (TÜRKİYE HARİÇ) ---
    try {
        const resWorld = await fetch(dataUrls.world);
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            
            if (countryLayer) mapInstance.removeLayer(countryLayer);
            if (borderLayer) mapInstance.removeLayer(borderLayer);

            // FİLTRELEME FONKSİYONU
            // Türkiye'yi (veya ileride özel harita ekleyeceğin ülkeleri)
            // bu genel haritadan çıkartıyoruz ki çakışma olmasın.
            const excludeTurkey = (feature) => {
                const name = feature.properties.NAME || feature.properties.ADMIN;
                return name !== 'Turkey'; 
            };

            // KATMAN A: ZEMİN (Türkiye Hariç)
            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane',
                style: getBaseCountryStyle,
                filter: excludeTurkey, // <-- FİLTRE BURADA
                interactive: false 
            }).addTo(mapInstance);

            // KATMAN C: SİYAH KALIN SINIRLAR (Türkiye Hariç)
            // Türkiye'nin sınırlarını detaylı dosya kendi çizecek
            borderLayer = L.geoJSON(worldData, {
                pane: 'borderPane',
                style: getInternationalBorderStyle,
                filter: excludeTurkey, // <-- FİLTRE BURADA
                interactive: false
            }).addTo(mapInstance);
        }
    } catch (e) { console.error("Zemin Hatası:", e); }

    // --- 2. DETAYLI TÜRKİYE HARİTASI (MONTE EDİLİYOR) ---
    try {
        const resProv = await fetch(dataUrls.provinces);
        
        if (resProv.ok) {
            const provData = await resProv.json();
            
            if (provinceLayer) mapInstance.removeLayer(provinceLayer);

            // Türkiye İlleri
            provinceLayer = L.geoJSON(provData, {
                pane: 'detailPane',
                style: getProvinceStyle,
                onEachFeature: (feature, layer) => onProvinceInteraction(feature, layer, mapInstance, provinceLayer)
            }).addTo(mapInstance);
            
            // --- EKSTRA: TÜRKİYE İÇİN DIŞ SINIR ÇİZİMİ ---
            // Dünya haritasından Türkiye'yi sildiğimiz için, 
            // detaylı dosyanın etrafına biz manuel kalın sınır çekelim ki bütünlük bozulmasın.
            const turkeyBorder = L.geoJSON(provData, {
                pane: 'borderPane',
                style: {
                    color: '#000000',
                    weight: 2, // Kalın Siyah Dış Sınır
                    fill: false,
                    opacity: 1
                },
                interactive: false
            }).addTo(mapInstance);

            console.log("Map: Hibrit sistem yüklendi (Dünya + Detaylı Türkiye).");
        }
    } catch (e) { console.error("Detay Hatası:", e); }
}