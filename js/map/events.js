// HARİTA ETKİLEŞİMLERİ (EVENTS)
import { getProvinceStyle, getBaseCountryStyle } from './styles.js';
import { isEditorActive, openEditor, getSavedData, toggleRegionSelection } from './editor.js';
import { getCityDataByRegion, openCityPanel } from './cities.js';
import { isCoastalSelectorMode, addCoastalId } from './coastal-selector.js';

// 1. DETAYLI EYALETLER İÇİN ETKİLEŞİM
export function onProvinceInteraction(feature, layer, mapInstance) {
    const p = feature.properties;

    // İsim Kontrolü (Editör veya GeoJSON)
    const saved = getSavedData(feature);
    const regionName = saved?.name || p.name || p.NAME || p.Name || p.NAME_1 || p.VARNAME_1 ||
        p.lektur || p.bulgarian_name || p.NUTS3_NAME || p.province || "Bölge";

    const countryName = p.admin || p.ADMIN || "Ülke";
    const regionId = p.regionId; // Voronoi bölge ID'si

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

            // KIYI SEÇİCİ MODU AKTİFSE
            if (isCoastalSelectorMode()) {
                addCoastalId(regionId, `${regionName} (${countryName})`);
                return; // Başka işlem yapma
            }

            if (isEditorActive()) {
                // Ctrl tuşu ile çoklu seçim
                if (e.originalEvent.ctrlKey) {
                    const isSelected = toggleRegionSelection(feature);
                    // Seçili bölgeleri görsel olarak vurgula
                    if (isSelected) {
                        layer.setStyle({
                            fillColor: '#3b82f6',
                            fillOpacity: 0.5,
                            weight: 2,
                            color: '#60a5fa'
                        });
                    } else {
                        layer.setStyle(getProvinceStyle(feature));
                    }
                } else {
                    // Normal tekli düzenleme
                    openEditor(feature, layer);
                }
            } else {
                // Bölgeye tıklayınca şehir detaylarını aç
                const cityData = getCityDataByRegion(regionId);
                if (cityData) {
                    openCityPanel(cityData);
                } else {
                    // Şehir verisi yoksa eski popup'ı göster
                    L.popup().setLatLng(e.latlng).setContent(createPopupContent(countryName, regionName, true)).openOn(mapInstance);
                }
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

// Popup HTML Oluşturucu (Kod tekrarını önlemek için) - YENİ TASARIM
function createPopupContent(topLabel, mainLabel, isProvince, extraData = null) {
    const btnText = isProvince ? "Şehri Yönet" : "Ülkeyi Yönet";

    // Varsayılan bayrak ve lider (gelecekte dinamik olacak)
    const flagUrl = "https://flagcdn.com/w80/tr.png";
    const allianceHtml = `
        <div style="display:flex; gap:4px; justify-content:center; margin-top:8px;">
            <span style="font-size:0.6rem; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; color:#cbd5e1;">NATO</span>
            <span style="font-size:0.6rem; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; color:#cbd5e1;">AB</span>
        </div>
    `;

    return `
        <div style="text-align:center; min-width:180px; font-family:'Inter', sans-serif;">
            <!-- Ülke Özeti -->
            <div style="display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.05); padding:6px; border-radius:8px; margin-bottom:8px;">
                <img src="${flagUrl}" style="width:24px; height:16px; border-radius:2px; object-fit:cover;">
                <div style="text-align:left;">
                   <div style="font-size:0.65rem; color:#94a3b8; line-height:1;">Cumhuriyet</div>
                   <div style="font-size:0.75rem; color:#e2e8f0; font-weight:700;">${topLabel === 'Ülke' ? mainLabel : topLabel}</div>
                </div>
            </div>

            <div style="font-size:0.7rem; color:#94a3b8; font-weight:700; text-transform:uppercase; margin-top:4px;">${isProvince ? 'ŞEHİR' : 'ÜLKE'}</div>
            <div style="font-size:1.25rem; color:#f8fafc; font-weight:800; margin:2px 0 8px 0;">${mainLabel}</div>
            
            ${allianceHtml}

            <button style="background:#3b82f6; color:white; border:none; padding:8px 16px; border-radius:6px; font-size:0.85rem; font-weight:600; cursor:pointer; width:100%; margin-top:12px; transition:all 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
                ${btnText}
            </button>
        </div>
    `;
}