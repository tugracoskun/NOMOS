// HARİTA MODÜLÜ ANA DOSYASI
import { mapConfig } from './config.js';
import { loadLayers } from './layers.js';
import { initEditor } from './editor.js';

let mapInstance = null;

export function initMap(containerId) {
    const container = document.getElementById(containerId);
    
    // 1. Önce temizlik yap (Varsa eski haritayı sil)
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    // 2. Yükleme Ekranını (Loader) Enjekte Et
    // Harita div'inin içine değil, yanına veya üstüne ekliyoruz ki harita oluşurken görünmesin.
    // Ancak Leaflet container'ı temizlediği için, loader'ı dinamik ekleyip yöneteceğiz.
    
    // Container'ı sıfırla ve yapılandır
    container.innerHTML = `
        <div id="actual-map-div" style="width:100%; height:100%;"></div>
        <div id="map-loader" class="map-loader-overlay">
            <div class="radar-spinner"></div>
            <div class="loading-text">UYDU VERİLERİ İŞLENİYOR...</div>
        </div>
    `;

    // 3. Haritayı Başlat (İçerdeki div'e)
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

    // 4. Katmanları Yükle ve Bittiğinde Loader'ı Kaldır
    // loadLayers fonksiyonu async olduğu için .then() kullanabiliriz.
    loadLayers(mapInstance).then(() => {
        // Yükleme bitti, loader'ı gizle
        const loader = document.getElementById('map-loader');
        if (loader) {
            loader.classList.add('map-loader-hidden');
            // Animasyon bitince DOM'dan tamamen sil (0.5s sonra)
            setTimeout(() => {
                loader.remove();
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