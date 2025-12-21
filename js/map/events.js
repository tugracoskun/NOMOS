// HARİTA ETKİLEŞİMLERİ (EVENTS)
import { getProvinceStyle } from './styles.js';

export function onProvinceInteraction(feature, layer, mapInstance, provinceLayer) {
    const regionName = feature.properties.name || "Bölge";
    const countryName = feature.properties.admin || "Ülke";

    layer.on({
        // Mouse üzerine gelince parlasın
        mouseover: (e) => {
            const l = e.target;
            l.setStyle({
                weight: 1.5,
                color: '#ffffff',     // Parlak Beyaz Sınır
                fillColor: '#ffffff', // Hafif beyaz dolgu
                fillOpacity: 0.1
            });
            l.bringToFront();
        },
        // Mouse gidince eski haline dön
        mouseout: (e) => {
            provinceLayer.resetStyle(e.target);
        },
        // Tıklama
        click: (e) => {
            L.DomEvent.stopPropagation(e);
            // mapInstance.fitBounds(e.target.getBounds()); // İstersen zoom yapar
            
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`
                    <div style="text-align:center; min-width:120px;">
                        <div style="font-size:0.7rem; color:#94a3b8; font-weight:700; text-transform:uppercase;">
                            ${countryName}
                        </div>
                        <div style="font-size:1.1rem; color:#0f172a; font-weight:700; margin:5px 0;">
                            ${regionName}
                        </div>
                        <button style="background:#1e293b; color:white; border:none; padding:6px 12px; border-radius:4px; font-size:0.8rem; cursor:pointer;">
                            Bölgeyi Yönet
                        </button>
                    </div>
                `)
                .openOn(mapInstance);
        }
    });
}