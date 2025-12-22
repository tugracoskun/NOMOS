// HARİTA MODÜLÜ ANA DOSYASI
// Harita motorunu başlatır, ayarlarını yapar ve katmanları yükler.

import { mapConfig } from './config.js';
import { loadLayers } from './layers.js';
import { initEditor } from './editor.js'; // Geliştirici Modu

let mapInstance = null;

export function initMap(containerId) {
    // Eğer harita daha önce oluşturulmuşsa, temizle (Memory leak önleme)
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    // Harita Motorunu Başlat (Leaflet)
    mapInstance = L.map(containerId, {
        // Kontrolleri elle ekleyeceğiz
        zoomControl: false,
        attributionControl: false,
        
        // --- SMOOTH ZOOM AYARLARI (Modern Oyun Hissi) ---
        zoomSnap: 0,           // Kademeli (1,2,3) zoom yerine kesirli (1.2, 1.5) zoom
        zoomDelta: 0.1,        // Tekerlek her döndüğünde ne kadar yaklaşsın (Düşük = Hassas)
        wheelPxPerZoomLevel: 120, // Tekerlek hassasiyeti (Yüksek = Daha yavaş ve kontrollü)
        
        // --- SINIRLANDIRMALAR ---
        minZoom: mapConfig.minZoom, 
        maxZoom: mapConfig.maxZoom,
        maxBounds: mapConfig.maxBounds,
        maxBoundsViscosity: 1.0, // Kenarlara çarpınca esnemesin, sert dursun
        
        // --- PERFORMANS VE GÖRSELLİK ---
        preferCanvas: true,      // Binlerce bölgeyi çizmek için Canvas kullan (Hız)
        smoothFactor: 1.5        // Çizgileri yumuşat (Tırtıkları azaltır, performansı artırır)
    }).setView(mapConfig.startView, mapConfig.startZoom);

    // Zoom butonlarını sağ alta ekle
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // --- GELİŞTİRİCİ EDİTÖRÜNÜ BAŞLAT ---
    // (Sağ alttaki 'Dev Mode' butonu)
    initEditor(mapInstance);

    // --- KATMANLARI YÜKLE ---
    // (Zemin, Türkiye, Komşular vb.)
    loadLayers(mapInstance);
}

export function destroyMap() {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
}