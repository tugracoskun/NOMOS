// KATMAN YÖNETİMİ (GLOBAL VORONOI)
import { dataUrls } from './config.js';
import { getBaseCountryStyle, getProvinceStyle, getInternationalBorderStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';
import { generateVoronoiRegions } from './generator.js';

let provinceLayer = null;
let borderLayer = null;

export async function loadLayers(mapInstance) {
    setupPanes(mapInstance);

    // Loader Yazısı
    const loaderText = document.querySelector('.loading-subtitle');
    if(loaderText) loaderText.innerText = "Dünya Haritası Oluşturuluyor...";

    try {
        // 1. DÜNYA SINIRLARINI ÇEK
        const res = await fetch(dataUrls.world);
        if (!res.ok) throw new Error("Dünya haritası yüklenemedi");
        
        const worldData = await res.json();
        const allGeneratedRegions = []; 

        console.log("Map: Tüm dünya işleniyor...");
        
        // 2. TÜM ÜLKELERİ DÖNGÜYE SOK
        // Antarktika (ATA) hariç hepsini al.
        const targetCountries = worldData.features.filter(f => f.properties.ISO_A3 !== 'ATA');

        targetCountries.forEach(country => {
            // HER ÜLKE İÇİN 5 ŞEHİR ÜRET
            const regions = generateVoronoiRegions(country, 5);
            allGeneratedRegions.push(...regions);
        });

        // 3. HARITAYA EKLE
        if (provinceLayer) mapInstance.removeLayer(provinceLayer);
        if (borderLayer) mapInstance.removeLayer(borderLayer);

        // A. Renkli Bölgeler (Voronoi Hücreleri)
        provinceLayer = L.geoJSON({ type: "FeatureCollection", features: allGeneratedRegions }, {
            pane: 'detailPane',
            style: getProvinceStyle,
            onEachFeature: (feature, l) => onProvinceInteraction(feature, l, mapInstance)
        }).addTo(mapInstance);

        // B. Ülke Dış Sınırları (Kalın Çerçeve)
        borderLayer = L.geoJSON({ type: "FeatureCollection", features: targetCountries }, {
            pane: 'borderPane',
            style: getInternationalBorderStyle,
            interactive: false
        }).addTo(mapInstance);

        console.log(`Map: ${allGeneratedRegions.length} bölge oluşturuldu.`);

    } catch (e) {
        console.error("Harita Oluşturma Hatası:", e);
    }
}

function setupPanes(mapInstance) {
    if (!mapInstance.getPane('detailPane')) { mapInstance.createPane('detailPane'); mapInstance.getPane('detailPane').style.zIndex = 400; }
    if (!mapInstance.getPane('borderPane')) { mapInstance.createPane('borderPane'); mapInstance.getPane('borderPane').style.zIndex = 500; mapInstance.getPane('borderPane').style.pointerEvents = 'none'; }
}