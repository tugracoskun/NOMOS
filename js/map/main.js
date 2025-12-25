// HARİTA MODÜLÜ ANA DOSYASI
import { mapConfig } from './config.js';
import { loadLayers } from './layers.js';
import { initEditor } from './editor.js';

let mapInstance = null;

export function initMap(containerId) {
    const container = document.getElementById(containerId);
    
    // Temizlik
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    // 1. Şık Loader'ı HTML'e Bas
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
    `;

    // 2. Haritayı Başlat
    mapInstance = L.map('actual-map-div', {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: 0,
        zoomDelta: 0.1,
        wheelPxPerZoomLevel: 120,
        minZoom: mapConfig.minZoom, 
        maxZoom: mapConfig.maxZoom,
        maxBounds: mapConfig.maxBounds,
        maxBoundsViscosity: 1.0,
        preferCanvas: true,
        smoothFactor: 1.5
    }).setView(mapConfig.startView, mapConfig.startZoom);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
    initEditor(mapInstance);

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