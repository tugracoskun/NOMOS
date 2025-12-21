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
    // İSİM BULMA (Daha kapsamlı kontrol)
    // Farklı GeoJSON formatları için olası tüm isimleri dene
    const p = feature.properties;
    const name = p.name || p.NAME || p.NAME_1 || p.Name || p.VARNAME_1 || p.lektur || "Bölge";
    
    const color = stringToColor(name);

    return {
        fillColor: color, 
        weight: 1,            
        opacity: 1,
        color: 'rgba(255, 255, 255, 0.5)', // Beyaz ince sınır
        fillOpacity: 0.8
    };
}

// 3. DIŞ SINIRLAR (EN ÜST)
export function getInternationalBorderStyle(feature) {
    return {
        fillColor: 'transparent', weight: 2, opacity: 1, color: '#000000', fillOpacity: 0, interactive: false
    };
}

// Renk Üretici (Canlı Tonlar)
function stringToColor(str) {
    if (!str) return "#555"; // İsim yoksa gri döndür, siyah yapma
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    
    // Hue: 0-360 arası renk
    const h = Math.abs(hash) % 360;
    // Saturation: %50-70 arası
    // Lightness: %35-55 arası (Koyu tema uyumlu)
    return `hsl(${h}, 60%, 40%)`; 
}