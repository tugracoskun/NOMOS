// HARİTA STİLLERİ VE RENKLENDİRME

// 1. ZEMİN KATMANI (ÜLKELER - GÜVENLİK İÇİN GÖRÜNÜR YAPTIK)
export function getBaseCountryStyle(feature) {
    return {
        fillColor: '#1e293b', // Varsayılan harita rengi (Koyu Mavi/Gri)
        weight: 1,
        opacity: 1,
        color: '#000',        // Siyah sınır
        fillOpacity: 1        // GÖRÜNÜR OLSUN (Eskiden 0'dı, hata buydu)
    };
}

// 2. DETAY KATMANI (EYALETLER)
export function getProvinceStyle(feature) {
    const admin = feature.properties.admin || "Unknown";
    const name = feature.properties.name || "Unknown";

    // Rengi hesapla
    const baseHsl = getCountryBaseHsl(admin);
    const variation = getStringHash(name) % 10; 
    const finalLightness = baseHsl.l + (variation - 5); 

    return {
        fillColor: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${finalLightness}%)`, 
        weight: 0.5,
        opacity: 1,
        color: '#1a1a1a', // Koyu gri sınır
        fillOpacity: 1
    };
}

// --- YARDIMCI FONKSİYONLAR ---

function getCountryBaseHsl(countryName) {
    const hash = getStringHash(countryName);
    const h = Math.abs(hash) % 360; 
    const s = 65; 
    const l = 50; 
    return { h, s, l };
}

function getStringHash(str) {
    let hash = 0;
    if (!str || str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}