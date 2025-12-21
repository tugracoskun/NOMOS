// HARİTA STİLLERİ

// 1. ZEMİN (DÜNYA)
export function getBaseCountryStyle(feature) {
    return {
        fillColor: '#111827', // Çok koyu lacivert/siyah
        weight: 1,
        opacity: 1,
        color: '#000000',     // Ülke sınırları siyah
        fillOpacity: 1
    };
}

// 2. DETAY (İLLER) - CANLI RENKLER
export function getProvinceStyle(feature) {
    // Veri setinden ismi al (tr-cities.json 'name' kullanır)
    const name = feature.properties.name || "Bölge";
    
    // Her şehre farklı bir ton ver
    const color = stringToColor(name);

    return {
        fillColor: color, 
        weight: 1,            // Sınır kalınlığı
        opacity: 1,
        color: '#ffffff',     // SINIRLAR BEYAZ (Net görünsün diye)
        fillOpacity: 0.8      // Biraz şeffaf olsun ki zeminle kaynaşsın
    };
}

// Renk Üretici
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Biraz daha canlı renkler
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 60%, 40%)`; 
}