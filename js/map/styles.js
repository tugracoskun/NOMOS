// HARİTA STİLLERİ

// 1. ZEMİN (EN ALT)
export function getBaseCountryStyle(feature) {
    return {
        fillColor: '#111827',
        weight: 0, opacity: 0, color: 'transparent', fillOpacity: 1
    };
}

// 2. DETAY (ORTA) - İller
export function getProvinceStyle(feature, countryName) {
    // Farklı GeoJSON'lar farklı property isimleri kullanır, hepsini dene:
    const name = feature.properties.name || feature.properties.NAME_1 || feature.properties.Name || "Bölge";
    
    // Her ile benzersiz renk üret
    const color = stringToColor(name);

    return {
        fillColor: color, 
        weight: 1,            
        opacity: 1,
        color: 'rgba(255, 255, 255, 0.5)', 
        fillOpacity: 0.8
    };
}

// 3. DIŞ SINIRLAR (EN ÜST)
export function getInternationalBorderStyle(feature) {
    return {
        fillColor: 'transparent', weight: 2, opacity: 1, color: '#000000', fillOpacity: 0, interactive: false
    };
}

// Renk Üretici
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 60%, 40%)`; 
}