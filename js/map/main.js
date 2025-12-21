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
        
        // --- SMOOTH ZOOM AYARLARI ---
        zoomSnap: 0,           // KİLİT NOKTA: Haritanın 1, 2, 3 diye tam sayılara yapışmasını engeller.
        zoomDelta: 0.1,        // Tekerleği çevirince ne kadar zoom yapacağını belirler (Düşük = Daha hassas).
        wheelPxPerZoomLevel: 120, // Tekerlek hassasiyeti (Yüksek değer = Daha yavaş ve kontrollü zoom).
        
        // Diğer Ayarlar
        minZoom: mapConfig.minZoom, 
        maxZoom: mapConfig.maxZoom,
        maxBounds: mapConfig.maxBounds,
        maxBoundsViscosity: 1.0, // Kenarlara çarpınca esnemesin, sert dursun
        preferCanvas: true       // Performans için şart
    }).setView(mapConfig.startView, mapConfig.startZoom);

    // Zoom butonlarını sağ alta ekle
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