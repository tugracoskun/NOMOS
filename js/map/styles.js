// HARİTA STİLLERİ VE RENKLENDİRME

// 1. ZEMİN KATMANI (Ülkeler)
export function getBaseCountryStyle(feature) {
    const name = feature.properties.NAME || feature.properties.ADMIN;
    return {
        fillColor: stringToColor(name), 
        weight: 1,            // Ülke sınırı kalınlığı
        opacity: 1,
        color: '#000000',     // Ülke sınırı SİYAH (Net ayrım)
        fillOpacity: 1        // Tam doygun renk
    };
}

// 2. DETAY KATMANI (Eyaletler/İller)
// SORUN BURADAYDI: Siyah yapınca görünmüyordu. Beyaz yapıyoruz.
export function getProvinceStyle(feature) {
    return {
        fillColor: 'transparent', // İçi boş (Alttaki ülkenin rengi görünsün)
        weight: 0.5,              // İnce çizgi
        opacity: 1,
        color: 'rgba(255, 255, 255, 0.4)', // BEYAZ ve YARI SAYDAM (Voronoi Ağı)
        fillOpacity: 0
    };
}

// HSL Renk Üretici (Ülke İsmine Göre Sabit Renk)
function stringToColor(str) {
    if(!str) return "#333";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Biraz daha pastel ve koyu tonlar (Göz yormayan strateji renkleri)
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 40%, 30%)`; 
}