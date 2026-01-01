// HARİTA ETKİLEŞİMLERİ (EVENTS)
import { getProvinceStyle, getBaseCountryStyle } from './styles.js';
import { isEditorActive, openEditor, getSavedData } from './editor.js';

// 1. DETAYLI EYALETLER İÇİN ETKİLEŞİM
export function onProvinceInteraction(feature, layer, mapInstance) {
    const p = feature.properties;
    
    // İsim Kontrolü (Editör veya GeoJSON)
    const saved = getSavedData(feature);
    const regionName = saved?.name || p.name || p.NAME || p.Name || p.NAME_1 || p.VARNAME_1 || 
                       p.lektur || p.bulgarian_name || p.NUTS3_NAME || p.province || "Bölge";
                       
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
            
            if (isEditorActive()) {
                openEditor(feature, layer);
            } else {
                L.popup().setLatLng(e.latlng).setContent(createPopupContent(countryName, regionName, true)).openOn(mapInstance);
            }
        }
    });
}

// 2. TEK PARÇA ÜLKELER İÇİN ETKİLEŞİM (YENİ)
export function onBaseInteraction(feature, layer, mapInstance) {
    const name = feature.properties.NAME || feature.properties.ADMIN || "Bilinmeyen Ülke";

    layer.on({
        mouseover: (e) => {
            const l = e.target;
            l.setStyle({ weight: 2, color: '#ffffff', fillOpacity: 1 });
            l.bringToFront();
        },
        mouseout: (e) => {
            const l = e.target;
            l.setStyle(getBaseCountryStyle(feature)); // Orijinal haline dön
        },
        click: (e) => {
            L.DomEvent.stopPropagation(e);
            
            // Tek parça ülkeler için popup (Editör yok, sadece yönetim)
            L.popup()
                .setLatLng(e.latlng)
                .setContent(createPopupContent("Ülke", name, false))
                .openOn(mapInstance);
        }
    });
}

// Popup HTML Oluşturucu (Kod tekrarını önlemek için)
function createPopupContent(topLabel, mainLabel, isProvince) {
    const btnText = isProvince ? "Bölgeyi Yönet" : "Ülkeyi Yönet";
    return `
        <div style="text-align:center; min-width:120px;">
            <div style="font-size:0.7rem; color:#94a3b8; font-weight:700; text-transform:uppercase;">${topLabel}</div>
            <div style="font-size:1.1rem; color:#0f172a; font-weight:700; margin:5px 0;">${mainLabel}</div>
            <button style="background:#1e293b; color:white; border:none; padding:6px 12px; border-radius:4px; font-size:0.8rem; cursor:pointer;">
                ${btnText}
            </button>
        </div>
    `;
}