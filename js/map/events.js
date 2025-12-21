// HARİTA ETKİLEŞİMLERİ (EVENTS)
import { getProvinceStyle } from './styles.js';

export function onProvinceInteraction(feature, layer, mapInstance) {
    // Veri setine göre isim bulucu (Turkey, Greece, Bulgaria hepsi farklı kullanabilir)
    const regionName = feature.properties.name || feature.properties.NAME_1 || feature.properties.Name || "Bölge";
    
    // Ülke ismini genelde biz fonksiyona gönderiyoruz ama burada feature'dan tahmin edelim
    // ya da boş bırakalım şimdilik.
    
    layer.on({
        mouseover: (e) => {
            const l = e.target;
            l.setStyle({ weight: 2, color: '#ffffff', fillColor: '#ffffff', fillOpacity: 0.2 });
            l.bringToFront();
        },
        mouseout: (e) => {
            // Mouse gidince eski rengine dönmesi için basit bir reset
            // (Tam performans için stil fonksiyonunu tekrar çağırmak gerekir ama şimdilik bu yeterli)
            const originalColor = getProvinceStyle(feature).fillColor;
            l.setStyle({ weight: 1, color: 'rgba(255, 255, 255, 0.5)', fillColor: originalColor, fillOpacity: 0.8 });
        },
        click: (e) => {
            L.DomEvent.stopPropagation(e);
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`
                    <div style="text-align:center; min-width:120px;">
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