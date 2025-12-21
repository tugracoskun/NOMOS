// HARİTA ETKİLEŞİMLERİ (EVENTS)
import { getProvinceStyle } from './styles.js'; // Stilleri geri yüklemek için import ettik

export function onProvinceInteraction(feature, layer, mapInstance) {
    const p = feature.properties;
    // İsimleri güvenli şekilde al
    const regionName = p.name || p.NAME_1 || p.Name || p.lektur || "Bölge";
    const countryName = p.admin || p.ADMIN || "Ülke";

    layer.on({
        // 1. MOUSE ÜZERİNE GELİNCE (Highlight)
        mouseover: (e) => {
            const l = e.target;
            l.setStyle({
                weight: 2,            // Sınırı kalınlaştır
                color: '#ffffff',     // Sınırı Beyaz yap
                fillColor: '#ffffff', // İçini Beyaz yap
                fillOpacity: 0.2      // Ama şeffaf olsun (Highlight efekti)
            });
            
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                l.bringToFront(); // Öne getir ki sınırları net görünsün
            }
        },

        // 2. MOUSE GİDİNCE (Reset) - DÜZELTİLEN KISIM
        mouseout: (e) => {
            const l = e.target;
            
            // HATA ÇÖZÜMÜ: resetStyle kullanmak yerine,
            // O bölgenin orijinal stilini fonksiyonla tekrar hesaplayıp uyguluyoruz.
            const originalStyle = getProvinceStyle(feature); 
            
            l.setStyle(originalStyle);
        },

        // 3. TIKLAYINCA (Popup)
        click: (e) => {
            L.DomEvent.stopPropagation(e);
            
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`
                    <div style="text-align:center; min-width:120px;">
                        <div style="font-size:0.7rem; color:#94a3b8; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">
                            ${countryName}
                        </div>
                        <div style="font-size:1.1rem; color:#0f172a; font-weight:700; margin-bottom:8px;">
                            ${regionName}
                        </div>
                        <button style="
                            background:#1e293b; color:white; border:none; 
                            padding:6px 14px; border-radius:4px; font-size:0.8rem; 
                            cursor:pointer; font-weight:600; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
                            Bölgeyi Yönet
                        </button>
                    </div>
                `)
                .openOn(mapInstance);
        }
    });
}