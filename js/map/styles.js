// HARİTA STİLLERİ
import { getSavedData } from './editor.js';

// DETAY KATMANI (RENKLİ BÖLGELER)
export function getProvinceStyle(feature) {
    const p = feature.properties;
    const saved = getSavedData(feature);
    
    // İsim (Generator'dan gelen: Bölge 1, Bölge 2...)
    let name = saved?.name || p.regionName || "Bölge";
    // Ülke Adı
    let country = p.ADMIN || p.NAME || "";

    let color;
    if (saved && saved.color) {
        color = saved.color;
    } else {
        // --- RENK FORMÜLÜ ---
        // Hem ülke ismini hem de bölge ismini karıştırıyoruz.
        // Böylece aynı ülkenin içindeki bölgeler farklı tonlarda olur.
        color = stringToColor(country + name); 
    }

    return {
        fillColor: color, 
        weight: 0.5,
        opacity: 1,
        color: '#000000', // İnce siyah sınır
        fillOpacity: 1
    };
}

// DIŞ SINIRLAR
export function getInternationalBorderStyle(feature) {
    return {
        fillColor: 'transparent', weight: 1.5, opacity: 1, color: '#000000', fillOpacity: 0, interactive: false
    };
}

// RENK ÜRETİCİ (Daha Canlı Palet)
function stringToColor(str) {
    if (!str) return "#333";
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); hash = hash & hash; }
    
    // HSL Ayarları:
    const h = Math.abs(hash) % 360;       // Tam renk spektrumu
    const s = 60 + (Math.abs(hash) % 20); // %60-80 Doygunluk (Daha Canlı)
    const l = 40 + (Math.abs(hash) % 20); // %40-60 Parlaklık (Ne çok koyu ne çok açık)
    
    return `hsl(${h}, ${s}%, ${l}%)`; 
}

// Zemin stiline gerek kalmadı ama hata vermemesi için boş bırakabiliriz
export function getBaseCountryStyle() { return {}; }