// HARİTA ETKİLEŞİMLERİ (EVENTS)
import { getProvinceStyle } from './styles.js';

export function onProvinceInteraction(feature, layer, mapInstance) {
    const p = feature.properties;
    // İsim bulucu (Her veri seti farklı isim kullanıyor)
    const regionName = p.name || p.NAME_1 || p.Name || p.lektur || "Bölge";
    const countryName = p.admin || p.ADMIN || "Ülke";

    layer.on({
        mouseover: (e) => {
            const l = e.target;
            l.setStyle({
                weight: 2,
                color: '#ffffff',     // Parlak Beyaz Sınır
                fillColor: '#ffffff', // Hafif beyaz dolgu
                fillOpacity: 0.2
            });
            l.bringToFront();
        },
        mouseout: (e) => {
            // HATA BURADAYDI: 'l' değişkeni burada yoktu. 'e.target' kullanmalıyız.
            const l = e.target; 
            
            // Orijinal stili geri yükle (Sadece border rengini sıfırla, dolguyu elleme)
            l.setStyle({
                weight: 1,
                color: 'rgba(255, 255, 255, 0.5)',
                fillOpacity: 0.8
            });
        },
        click: (e) => {
            L.DomEvent.stopPropagation(e);
            
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
                            Yönet
                        </button>
                    </div>
                `)
                .openOn(mapInstance);
        }
    });
}