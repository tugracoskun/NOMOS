// KATMAN YÖNETİMİ (GLOBAL VORONOI)
import { dataUrls } from './config.js';
import { getBaseCountryStyle, getProvinceStyle, getInternationalBorderStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';
import { generateVoronoiRegions } from './generator.js';
import { setupLabelPane, createCountryLabels, updateCountryLabelsOpacity } from './labels.js';
import { setupCityPane, createCityMarkers, updateCityMarkersVisibility } from './cities.js';
import { mapModes } from './modes.js';

let provinceLayer = null;
let borderLayer = null;
let mapRef = null; // Harita referansı

// --- MOD DEĞİŞİKLİĞİ DİNLEYİCİSİ ---
window.addEventListener('mapModeChanged', (e) => {
    console.log(`Layers: Mod değişti -> ${e.detail.mode}`);
    refreshMapStyles();
    updateLegend(e.detail.mode);
});

// Tüm bölgelerin stilini güncelle
function refreshMapStyles() {
    if (!provinceLayer) return;

    // Performans optimizasyonu: requestAnimationFrame ile batch güncelleme
    requestAnimationFrame(() => {
        provinceLayer.eachLayer(layer => {
            if (layer.feature) {
                layer.setStyle(getProvinceStyle(layer.feature));
            }
        });
    });
}

// Lejant güncelleme
function updateLegend(modeId) {
    const legendEl = document.getElementById('map-legend');
    const mode = mapModes[modeId];

    if (!mode || modeId === 'default') {
        // Varsayılan modda lejant gizle
        if (legendEl) legendEl.style.display = 'none';
        return;
    }

    // Lejant yoksa oluştur
    if (!legendEl) {
        const legend = document.createElement('div');
        legend.id = 'map-legend';
        legend.className = 'map-legend';
        document.getElementById('game-map')?.appendChild(legend);
    }

    const el = document.getElementById('map-legend');
    if (!el) return;

    el.style.display = 'block';
    el.innerHTML = generateLegendHTML(modeId);
}

// Moda göre lejant HTML'i oluştur
function generateLegendHTML(modeId) {
    const legends = {
        infrastructure: {
            title: 'Altyapı Seviyesi',
            items: [
                { color: '#ef4444', label: 'Seviye 1-2 (Düşük)' },
                { color: '#f59e0b', label: 'Seviye 3-4' },
                { color: '#84cc16', label: 'Seviye 5-6' },
                { color: '#22c55e', label: 'Seviye 7-8' },
                { color: '#0ea5e9', label: 'Seviye 9-10 (Yüksek)' }
            ]
        },
        population: {
            title: 'Nüfus Yoğunluğu',
            items: [
                { color: '#dbeafe', label: '< 100K' },
                { color: '#60a5fa', label: '100K - 1M' },
                { color: '#3b82f6', label: '1M - 5M' },
                { color: '#1d4ed8', label: '> 5M (Mega)' }
            ]
        },
        buildings: {
            title: 'Bina Sayısı',
            items: [
                { color: '#fef3c7', label: 'Hiç yok' },
                { color: '#fde047', label: '1-2 bina' },
                { color: '#a3e635', label: '3-5 bina' },
                { color: '#22c55e', label: '6+ bina' }
            ]
        },
        technology: {
            title: 'Teknoloji İndeksi',
            items: [
                { color: '#fecaca', label: 'Düşük (< 0.3)' },
                { color: '#fde68a', label: 'Orta (0.3-0.5)' },
                { color: '#bfdbfe', label: 'İyi (0.5-0.7)' },
                { color: '#a78bfa', label: 'Yüksek (> 0.7)' }
            ]
        },
        wars: {
            title: 'Savaş Durumu',
            items: [
                { color: '#ef4444', label: 'Savaşta' },
                { color: '#64748b', label: 'Barış' }
            ]
        },
        statistics: {
            title: 'Eyalet Değeri',
            items: [
                { color: '#94a3b8', label: 'Düşük' },
                { color: '#fbbf24', label: 'Orta' },
                { color: '#22c55e', label: 'İyi' },
                { color: '#8b5cf6', label: 'Mükemmel' }
            ]
        },
        alliances: {
            title: 'İttifaklar',
            items: [
                { color: '#3b82f6', label: 'Ülkeye göre renklenir' }
            ]
        }
    };

    const legend = legends[modeId];
    if (!legend) return '';

    return `
        <div class="legend-header">
            <i class="${mapModes[modeId]?.icon || 'fa-solid fa-map'}"></i>
            <span>${legend.title}</span>
        </div>
        <ul class="legend-items">
            ${legend.items.map(item => `
                <li>
                    <span class="color-box" style="background: ${item.color}"></span>
                    <span>${item.label}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

export async function loadLayers(mapInstance) {
    mapRef = mapInstance; // Referansı sakla
    setupPanes(mapInstance);
    setupLabelPane(mapInstance);

    const loaderText = document.querySelector('.loading-subtitle');
    if (loaderText) loaderText.innerText = "Dünya Haritası Oluşturuluyor...";

    try {
        const res = await fetch(dataUrls.world);
        if (!res.ok) throw new Error("Dünya haritası yüklenemedi");

        const worldData = await res.json();
        const allGeneratedRegions = [];
        let globalRegionCounter = 0;

        console.log("Map: Tüm dünya işleniyor...");

        const targetCountries = worldData.features.filter(f => f.properties.ISO_A3 !== 'ATA');

        targetCountries.forEach(country => {
            const regions = generateVoronoiRegions(country, 5, globalRegionCounter);
            globalRegionCounter += regions.length;
            allGeneratedRegions.push(...regions);
        });

        if (provinceLayer) mapInstance.removeLayer(provinceLayer);
        if (borderLayer) mapInstance.removeLayer(borderLayer);

        // A. Renkli Bölgeler
        provinceLayer = L.geoJSON({ type: "FeatureCollection", features: allGeneratedRegions }, {
            pane: 'detailPane',
            style: getProvinceStyle,
            onEachFeature: (feature, l) => onProvinceInteraction(feature, l, mapInstance),
            bubblingMouseEvents: false
        }).addTo(mapInstance);

        // B. Ülke Dış Sınırları
        borderLayer = L.geoJSON({ type: "FeatureCollection", features: targetCountries }, {
            pane: 'borderPane',
            style: getInternationalBorderStyle,
            interactive: false,
            bubblingMouseEvents: false
        }).addTo(mapInstance);

        // C. Etiketler
        if (loaderText) loaderText.innerText = "Etiketler Ekleniyor...";
        createCountryLabels(targetCountries, mapInstance);

        // D. Şehir Marker'ları
        if (loaderText) loaderText.innerText = "Şehirler Yerleştiriliyor...";
        setupCityPane(mapInstance);
        createCityMarkers(allGeneratedRegions, mapInstance);

        // Zoom olayları
        mapInstance.on('zoomend', () => {
            updateCountryLabelsOpacity(mapInstance.getZoom());
            updateCityMarkersVisibility(mapInstance.getZoom());
        });

        updateCountryLabelsOpacity(mapInstance.getZoom());
        updateCityMarkersVisibility(mapInstance.getZoom());

        console.log(`Map: ${allGeneratedRegions.length} bölge oluşturuldu.`);

    } catch (e) {
        console.error("Harita Oluşturma Hatası:", e);
    }
}

function setupPanes(mapInstance) {
    if (!mapInstance.getPane('detailPane')) {
        mapInstance.createPane('detailPane');
        mapInstance.getPane('detailPane').style.zIndex = 400;
    }
    if (!mapInstance.getPane('borderPane')) {
        mapInstance.createPane('borderPane');
        mapInstance.getPane('borderPane').style.zIndex = 500;
        mapInstance.getPane('borderPane').style.pointerEvents = 'none';
    }
}

// Dışarıdan çağrılabilir refresh fonksiyonu
export function forceRefreshStyles() {
    refreshMapStyles();
}