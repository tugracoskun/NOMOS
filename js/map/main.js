// HARİTA MODÜLÜ ANA DOSYASI
import { mapConfig } from './config.js';
import { loadLayers } from './layers.js';
import { initEditor } from './editor.js'; // Geliştirici Modu

let mapInstance = null;

export function initMap(containerId) {
    // Varsa temizle
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    // Harita Motorunu Başlat
    mapInstance = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        
        // --- SMOOTH ZOOM AYARLARI ---
        zoomSnap: 0,
        zoomDelta: 0.1,
        wheelPxPerZoomLevel: 120,
        
        // Sınırlandırmalar
        minZoom: mapConfig.minZoom, 
        maxZoom: mapConfig.maxZoom,
        maxBounds: mapConfig.maxBounds,
        maxBoundsViscosity: 1.0,
        preferCanvas: true
    }).setView(mapConfig.startView, mapConfig.startZoom);

    // Zoom butonlarını sağ alta ekle
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // --- GELİŞTİRİCİ EDİTÖRÜNÜ BAŞLAT ---
    initEditor(mapInstance);

    // Katmanları Yükle
    loadLayers(mapInstance);
}

export function destroyMap() {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
}