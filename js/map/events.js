// HARİTA ETKİLEŞİMLERİ
import { getProvinceStyle } from './styles.js';
import { isEditorActive, openEditor, getSavedData } from './editor.js'; // IMPORT

export function onProvinceInteraction(feature, layer, mapInstance) {
    const p = feature.properties;
    const countryName = p.admin || p.ADMIN || "Ülke";

    layer.on({
        mouseover: (e) => {
            const l = e.target;
            l.setStyle({ weight: 2, color: '#ffffff', fillColor: '#ffffff', fillOpacity: 0.3 });
            l.bringToFront();
        },
        mouseout: (e) => {
            const l = e.target;
            l.setStyle(getProvinceStyle(feature)); // Orijinal haline dön
        },
        click: (e) => {
            L.DomEvent.stopPropagation(e);
            
            // EDİTÖR MODU KONTROLÜ
            if (isEditorActive()) {
                openEditor(feature, layer);
            } else {
                // NORMAL MOD: Kaydedilmiş ismi göster
                const saved = getSavedData(feature);
                const displayName = saved?.name || p.name || p.NAME || p.NAME_1 || "Bölge";

                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(`
                        <div style="text-align:center; min-width:120px;">
                            <div style="font-size:0.7rem; color:#94a3b8; font-weight:700; text-transform:uppercase;">${countryName}</div>
                            <div style="font-size:1.1rem; color:#0f172a; font-weight:700; margin:5px 0;">${displayName}</div>
                            <button style="background:#1e293b; color:white; border:none; padding:6px 12px; border-radius:4px; font-size:0.8rem; cursor:pointer;">Bölgeyi Yönet</button>
                        </div>
                    `)
                    .openOn(mapInstance);
            }
        }
    });
}