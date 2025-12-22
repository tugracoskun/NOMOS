// KATMAN FİLTRELEME MANTIĞI
import { activeCountries } from './config.js';

// GeoJSON verisinden Ülke İsmini bulur
export function getCountryName(feature) {
    const p = feature.properties;
    // Farklı veri setlerindeki olası etiketler
    return p.admin || p.ADMIN || p.adm0_name || p.name || p.NAME || p.sov_a3 || "";
}

// Bir ülkenin aktif listede olup olmadığını kontrol eder
export function isCountryActive(countryName) {
    if (!countryName) return false;
    const lowerName = countryName.toLowerCase();
    
    // Listeyi gez ve gevşek eşleşme yap (örn: "Syria" kelimesi "Syrian Arab Rep" içinde var mı?)
    return activeCountries.some(active => {
        const lowerActive = active.toLowerCase();
        return lowerName === lowerActive || lowerName.includes(lowerActive);
    });
}

// ZEMİN FİLTRESİ: Detaylı çizilecek ülkeleri zemin haritasından çıkarır
export function filterBaseLayer(feature) {
    const name = getCountryName(feature);
    // Eğer detaylı listedeyse FALSE döndür (Zemini çizme)
    return !isCountryActive(name);
}

// DETAY FİLTRESİ (KOMŞULAR): Sadece listedekileri çizer, Türkiye'yi atlar
export function filterNeighborLayer(feature) {
    const name = getCountryName(feature);
    const isActive = isCountryActive(name);
    
    // Aktifse VE Türkiye değilse çiz
    return isActive && !name.toLowerCase().includes("turkey");
}