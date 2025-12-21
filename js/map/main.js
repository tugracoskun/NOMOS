// HARİTA MODÜLÜ ANA DOSYASI
import { mapConfig } from './config.js';
import { loadLayers } from './layers.js';

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
        minZoom: mapConfig.minZoom, 
        maxZoom: mapConfig.maxZoom,
        maxBounds: mapConfig.maxBounds,
        maxBoundsViscosity: 1.0,
        preferCanvas: true
    }).setView(mapConfig.startView, mapConfig.startZoom);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // Katmanları Yükle
    loadLayers(mapInstance);
}

export function destroyMap() {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
}