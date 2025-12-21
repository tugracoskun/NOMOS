import { getProvinceStyle } from './styles.js';
import { isEditorActive, openEditor, getOverriddenName } from './editor.js'; // <-- IMPORT

export function onProvinceInteraction(feature, layer, mapInstance) {
    const p = feature.properties;
    
    // İSİM ALIRKEN ÖNCE KAYITLI VERİYE BAK (Override)
    let regionName = getOverriddenName(feature);
    
    // Kayıtlı yoksa GeoJSON'dan tahmin et
    if (!regionName) {
        regionName = p.name || p.NAME || p.Name || p.NAME_1 || p.lektur || 
                     p.bulgarian_name || p.NUTS3_NAME || p.province || "Bölge";
    }
                       
    const countryName = p.admin || p.ADMIN || "Ülke";

    layer.on({
        mouseover: (e) => { /* ... aynı ... */ },
        mouseout: (e) => { /* ... aynı ... */ },
        
        click: (e) => {
            L.DomEvent.stopPropagation(e);
            
            // --- KONTROL: EDİTÖR MODUNDA MIYIZ? ---
            if (isEditorActive()) {
                openEditor(feature, layer); // Editörü Aç
            } else {
                // NORMAL OYUN POPUP'I
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(`
                        <div style="text-align:center; min-width:120px;">
                            <div style="font-size:0.7rem; color:#94a3b8; font-weight:700; text-transform:uppercase;">
                                ${countryName}
                            </div>
                            <!-- İSMİ GÖSTER (Değiştirdiysek yenisi görünür) -->
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
        }
    });
}