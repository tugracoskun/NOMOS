// KATMAN YÖNETİMİ
import { dataUrls } from './config.js';
import { getBaseCountryStyle, getProvinceStyle } from './styles.js';
import { onProvinceInteraction } from './events.js';

let countryLayer = null;
let provinceLayer = null;

export async function loadLayers(mapInstance) {
    // Pane Ayarları
    if (!mapInstance.getPane('basePane')) {
        mapInstance.createPane('basePane');
        mapInstance.getPane('basePane').style.zIndex = 300;
    }
    if (!mapInstance.getPane('detailPane')) {
        mapInstance.createPane('detailPane');
        mapInstance.getPane('detailPane').style.zIndex = 400; 
    }

    // 1. ZEMİNİ YÜKLE
    try {
        const resWorld = await fetch(dataUrls.world);
        if (resWorld.ok) {
            const worldData = await resWorld.json();
            if (countryLayer) mapInstance.removeLayer(countryLayer);
            
            countryLayer = L.geoJSON(worldData, {
                pane: 'basePane',
                style: getBaseCountryStyle,
                interactive: false 
            }).addTo(mapInstance);
        }
    } catch (e) { console.error("Zemin Hatası:", e); }

    // 2. DETAYI YÜKLE (TÜRKİYE İLLERİ)
    // Kullanıcıya bilgi verelim
    const loadingPopup = L.popup()
        .setLatLng(mapInstance.getCenter())
        .setContent('<div style="text-align:center; color:black;">Şehirler yükleniyor...</div>')
        .openOn(mapInstance);

    try {
        const resProv = await fetch(dataUrls.provinces);
        
        if (resProv.ok) {
            const provData = await resProv.json();
            
            if (provinceLayer) mapInstance.removeLayer(provinceLayer);

            provinceLayer = L.geoJSON(provData, {
                pane: 'detailPane',
                style: getProvinceStyle,
                onEachFeature: (feature, layer) => onProvinceInteraction(feature, layer, mapInstance, provinceLayer)
            }).addTo(mapInstance);
            
            console.log("Map: Şehirler yüklendi.");
            mapInstance.closePopup(); // Yükleme yazısını kapat
        } else {
            console.error("Veri çekilemedi:", resProv.status);
        }
    } catch (e) { 
        console.error("Detay Hatası:", e); 
        loadingPopup.setContent('<div style="color:red">Bağlantı Hatası!</div>');
    }
}