// HARİTA MODÜLÜ ANA DOSYASI
import { mapConfig } from './config.js';
import { loadLayers } from './layers.js';
import { initEditor } from './editor.js';
import { closeCityPanel } from './cities.js';
import { createModePanelHTML, initModePanelEvents } from './modes.js';
import { initFlightTracking, stopFlightTracking } from './flights.js';
import { initAirports, clearAirports } from './airports.js';
import { initShipTracking, stopShipTracking, getActiveShips } from './ships.js';
import { initPorts, clearPorts } from './ports.js';
import { initSeaRoutes, clearSeaRoutes } from './routes.js';
import { initWorldStatsPanel } from './world-stats.js';

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
        <link rel="stylesheet" href="css/mode-slider.css">
        <link rel="stylesheet" href="css/world-stats.css">
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
                <!-- Üst Satır: Temel İstatistikler -->
                <div class="city-stat">
                    <div class="city-stat-icon"><i class="fa-solid fa-users"></i></div>
                    <div class="city-stat-label">Nüfus</div>
                    <div class="city-stat-value" id="city-population">0</div>
                </div>
                <div class="city-stat">
                    <div class="city-stat-icon"><i class="fa-solid fa-coins"></i></div>
                    <div class="city-stat-label">Ekonomi</div>
                    <div class="city-stat-value" id="city-economy">0</div>
                </div>
                <div class="city-stat resource-stat">
                    <div class="city-stat-icon" id="city-resource-icon"><i class="fa-solid fa-wheat-awn"></i></div>
                    <div class="city-stat-label">Kaynak</div>
                    <div class="city-stat-value" id="city-resource-name">-</div>
                </div>
                
                <!-- Alt Satır: Gelişmiş İstatistikler -->
                <div class="city-stat infra-stat">
                    <div class="city-stat-icon"><i class="fa-solid fa-road"></i></div>
                    <div class="city-stat-label">Altyapı</div>
                    <div class="city-stat-value" id="city-infrastructure">1/10</div>
                </div>
                <div class="city-stat tax-stat">
                    <div class="city-stat-icon"><i class="fa-solid fa-percent"></i></div>
                    <div class="city-stat-label">Vergi Verimliliği</div>
                    <div class="city-stat-value" id="city-tax-efficiency">100%</div>
                </div>
                <div class="city-stat value-stat">
                    <div class="city-stat-icon"><i class="fa-solid fa-star"></i></div>
                    <div class="city-stat-label">Eyalet Değeri</div>
                    <div class="city-stat-value" id="city-value">1/10</div>
                </div>
                <div class="city-stat building-stat">
                    <div class="city-stat-icon"><i class="fa-solid fa-city"></i></div>
                    <div class="city-stat-label">Binalar</div>
                    <div class="city-stat-value" id="city-buildings">0</div>
                </div>
            </div>
            <div class="city-panel-footer">
                <button class="city-detail-btn" id="city-detail-btn">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    Daha Fazla Detay
                </button>
            </div>
        </div>
        
        <!-- Sağ Üst: İstatistik Butonu -->
        <button class="map-stats-trigger" id="map-stats-trigger" title="Dünya İstatistikleri">
            <i class="fa-solid fa-chart-bar"></i>
            <span>İstatistik</span>
        </button>

        <!-- Dünya İstatistikleri - Popup Overlay (AoH2 Tarzı) -->
        <div id="world-stats-overlay" class="world-stats-overlay">
            <div class="ws-popup">
                <div class="ws-top-bar">
                    <div class="ws-cat-title" id="ws-cat-title">
                        <span class="ws-cat-name" id="ws-cat-name">Nüfus</span>
                    </div>
                    <button class="ws-close-btn" id="ws-close-btn"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="ws-icon-tabs" id="ws-icon-tabs">
                    <button class="ws-icon-tab active" data-cat="population" title="Nüfus"><i class="fa-solid fa-users"></i></button>
                    <button class="ws-icon-tab" data-cat="economy" title="Ekonomi"><i class="fa-solid fa-coins"></i></button>
                    <button class="ws-icon-tab" data-cat="technology" title="Teknoloji"><i class="fa-solid fa-flask"></i></button>
                    <button class="ws-icon-tab" data-cat="infrastructure" title="Altyapı"><i class="fa-solid fa-road"></i></button>
                    <button class="ws-icon-tab" data-cat="buildings" title="Binalar"><i class="fa-solid fa-city"></i></button>
                    <button class="ws-icon-tab" data-cat="military" title="Askeri Güç"><i class="fa-solid fa-shield-halved"></i></button>
                    <button class="ws-icon-tab" data-cat="producers" title="En Büyük Üreticiler"><i class="fa-solid fa-wheat-awn"></i></button>
                </div>
                <div class="ws-chart-wrapper">
                    <div class="ws-y-label" id="ws-y-label">Nüfus</div>
                    <div class="ws-max-line" id="ws-max-line">
                        <span class="ws-max-val" id="ws-max-val">0</span>
                    </div>
                    <div class="ws-chart-area" id="ws-chart-area"></div>
                    <!-- Scroll okları -->
                    <button class="ws-scroll-arrow ws-scroll-left" id="ws-scroll-left"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="ws-scroll-arrow ws-scroll-right" id="ws-scroll-right"><i class="fa-solid fa-chevron-right"></i></button>
                    <!-- Dikey/Yatay görünüm geçiş butonu -->
                    <button class="ws-view-toggle" id="ws-view-toggle" title="Dikey Liste Görünümü">
                        <i class="fa-solid fa-list"></i>
                    </button>
                </div>
                <div class="ws-legend" id="ws-legend">
                    <span class="ws-leg-item"><span class="ws-leg-dot" style="background:#d4a574"></span>Afrika</span>
                    <span class="ws-leg-item"><span class="ws-leg-dot" style="background:#c8b642"></span>Asya</span>
                    <span class="ws-leg-item"><span class="ws-leg-dot" style="background:#d48c2e"></span>Avrupa</span>
                    <span class="ws-leg-item"><span class="ws-leg-dot" style="background:#3dab5c"></span>Güney Amerika</span>
                    <span class="ws-leg-item"><span class="ws-leg-dot" style="background:#4a8ddb"></span>Kuzey Amerika</span>
                    <span class="ws-leg-item"><span class="ws-leg-dot" style="background:#7a7a7a"></span>Okyanusya</span>
                </div>
            </div>
        </div>

        <!-- Harita Modları Paneli -->
        ${createModePanelHTML()}
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

        // Router Loading Bar'ı bitir
        import('../router.js').then(module => {
            if (module.finishLoading) module.finishLoading();
        });

        if (loader) {
            // Yazıyı değiştir (Son dokunuş)
            loader.querySelector('.loading-title').innerText = "BAĞLANTI KURULDU";
            loader.querySelector('.loading-title').style.color = "#4ade80"; // Yeşil
            loader.querySelector('.loading-subtitle').innerText = "Harita Hazır";

            // Kısa bir süre sonra yok et
            setTimeout(() => {
                loader.classList.add('map-loader-hidden');
                setTimeout(() => loader.remove(), 800); // CSS transition süresi kadar bekle

                // Harita Modları paneli event'lerini başlat
                initModePanelEvents();

                // Dünya İstatistikleri paneli event'lerini başlat
                initWorldStatsPanel();

                // Uçak tracking sistemini başlat
                initFlightTracking(mapInstance);

                // Gemi tracking sistemini başlat
                initShipTracking(mapInstance);

                // Deniz rotalarını başlat
                initSeaRoutes(mapInstance);

                // Havalimanlarını başlat
                setTimeout(() => {
                    import('./flights.js').then(module => {
                        initAirports(mapInstance, module.getActiveFlights());
                    });

                    // Limanları başlat
                    initPorts(mapInstance, getActiveShips);
                }, 1000);
            }, 500);
        }
    });
}

export function destroyMap() {
    // Uçak tracking'i durdur
    stopFlightTracking();

    // Gemi tracking'i durdur
    stopShipTracking();

    // Limanları temizle
    clearPorts();

    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
}