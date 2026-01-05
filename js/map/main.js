// HARİTA MODÜLÜ ANA DOSYASI
import { mapConfig } from './config.js';
import { loadLayers } from './layers.js';
import { initEditor } from './editor.js';
import { closeCityPanel } from './cities.js';

let mapInstance = null;

export function initMap(containerId) {
    const container = document.getElementById(containerId);

    // Temizlik
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    // 1. Şık Loader'ı ve City Panel'i HTML'e Bas
    container.innerHTML = `
        <div id="actual-map-div" style="width:100%; height:100%;"></div>
        
        <div id="map-loader" class="map-loader-overlay">
            <div class="loader-content">
                <div class="ring-outer"></div>
                <div class="ring-middle"></div>
                <div class="ring-inner"></div>
            </div>
            <div class="loader-text-group">
                <div class="loading-title">UYDU BAĞLANTISI</div>
                <div class="loading-subtitle">Veriler İşleniyor...</div>
            </div>
        </div>

        <!-- Şehir Detay Paneli -->
        <div id="city-detail-panel">
            <div class="city-panel-header">
                <div class="city-panel-title">
                    <h2 id="city-name">Şehir Adı</h2>
                    <span class="city-country-label" id="city-country">Ülke</span>
                </div>
                <button class="city-panel-close" onclick="window.closeCityPanel()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="city-panel-body">
                <div class="city-stat">
                    <div class="city-stat-icon">👥</div>
                    <div class="city-stat-label">Nüfus</div>
                    <div class="city-stat-value" id="city-population">0</div>
                </div>
                <div class="city-stat">
                    <div class="city-stat-icon">💰</div>
                    <div class="city-stat-label">Ekonomi</div>
                    <div class="city-stat-value" id="city-economy">0</div>
                </div>
                <div class="city-stat resource-stat">
                    <div class="city-stat-icon" id="city-resource-icon"><i class="fa-solid fa-wheat-awn"></i></div>
                    <div class="city-stat-label">Kaynak</div>
                    <div class="city-stat-value" id="city-resource-name">-</div>
                </div>
            </div>
        </div>
    `;

    // 2. Haritayı Başlat
    // Çok geniş buffer - ekranın çok dışını da render et
    const wideRenderer = L.canvas({
        padding: 2.0  // Görünür alanın %200 fazlasını render et (5x alan)
    });

    mapInstance = L.map('actual-map-div', {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        wheelPxPerZoomLevel: 80,
        wheelDebounceTime: 40,
        minZoom: mapConfig.minZoom,
        maxZoom: mapConfig.maxZoom,
        maxBounds: mapConfig.maxBounds,
        maxBoundsViscosity: 1.0,
        preferCanvas: true,
        renderer: wideRenderer,  // Geniş buffer kullan
        smoothFactor: 2.0,
        inertia: true,
        inertiaDeceleration: 3000,
        inertiaMaxSpeed: 1500
    }).setView(mapConfig.startView, mapConfig.startZoom);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
    initEditor(mapInstance);

    // Şehir paneli kapatma fonksiyonunu global yap (onclick için)
    window.closeCityPanel = closeCityPanel;

    // DEV: Zoom seviyesi göstergesi (sağ alt)
    const zoomDisplay = L.control({ position: 'bottomright' });
    zoomDisplay.onAdd = function () {
        const div = L.DomUtil.create('div', 'zoom-level-display');
        div.innerHTML = `Zoom: ${mapInstance.getZoom().toFixed(1)}`;
        div.style.cssText = 'background: rgba(0,0,0,0.7); color: #4ade80; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 12px; margin-bottom: 5px;';
        return div;
    };
    zoomDisplay.addTo(mapInstance);

    // Zoom değiştiğinde güncelle
    mapInstance.on('zoomend', () => {
        const display = document.querySelector('.zoom-level-display');
        if (display) {
            display.innerHTML = `Zoom: ${mapInstance.getZoom().toFixed(1)}`;
        }
    });

    // 3. YÜKLEME VE BEKLEME MANTIĞI

    // A: Veri Yükleme İşlemi
    const dataLoading = loadLayers(mapInstance);

    // B: Minimum Bekleme Süresi (2 Saniye) - Tasarım görünsün ve render otursun diye
    const minWait = new Promise(resolve => setTimeout(resolve, 2000));

    // İkisi de bitince loader'ı kaldır
    Promise.all([dataLoading, minWait]).then(() => {
        const loader = document.getElementById('map-loader');
        if (loader) {
            // Yazıyı değiştir (Son dokunuş)
            loader.querySelector('.loading-title').innerText = "BAĞLANTI KURULDU";
            loader.querySelector('.loading-title').style.color = "#4ade80"; // Yeşil
            loader.querySelector('.loading-subtitle').innerText = "Harita Hazır";

            // Kısa bir süre sonra yok et
            setTimeout(() => {
                loader.classList.add('map-loader-hidden');
                setTimeout(() => loader.remove(), 800); // CSS transition süresi kadar bekle
            }, 500);
        }
    });
}

export function destroyMap() {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
}