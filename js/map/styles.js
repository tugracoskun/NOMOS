// HARİTA STİLLERİ

// 1. ZEMİN (EN ALT) - Sadece Dolgu
export function getBaseCountryStyle(feature) {
    return {
        fillColor: '#111827', // Koyu zemin
        weight: 0,            // Sınır çizme (Üst katman çizecek)
        opacity: 0,
        color: 'transparent',
        fillOpacity: 1
    };
}

// 2. DETAY (ORTA) - İller
export function getProvinceStyle(feature) {
    const name = feature.properties.name || "Bölge";
    const color = stringToColor(name);

    return {
        fillColor: color, 
        weight: 1,            
        opacity: 1,
        color: 'rgba(255, 255, 255, 0.5)', // İÇ SINIRLAR BEYAZ VE İNCE
        fillOpacity: 0.8
    };
}

// 3. ULUSLARARASI SINIRLAR (EN ÜST) - YENİ
export function getInternationalBorderStyle(feature) {
    return {
        fillColor: 'transparent', // İçi boş (Alttaki harita görünsün)
        weight: 2,                // KALIN ÇİZGİ
        opacity: 1,
        color: '#000000',         // SİMSİYAH
        fillOpacity: 0,
        interactive: false        // Tıklanmasın
    };
}

// Renk Üretici
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 60%, 40%)`; 
}