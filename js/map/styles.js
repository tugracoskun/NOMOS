// HARİTA STİLLERİ VE RENKLENDİRME
import { getOverriddenName } from './editor.js';

// 1. ZEMİN KATMANI (Sadece Okyanus/Arka Plan etkisi için)
export function getBaseCountryStyle(feature) {
    return {
        fillColor: '#111827', // Koyu zemin
        weight: 0,
        opacity: 0,
        fillOpacity: 1
    };
}

// 2. DETAY KATMANI (EYALETLER - RENGARENK & EDİTÖR DESTEKLİ)
export function getProvinceStyle(feature) {
    const p = feature.properties;
    
    // 1. Önce kayıtlı bir isim değişikliği var mı kontrol et (Dev Mode)
    let name = getOverriddenName(feature);
    
    // 2. Yoksa GeoJSON içindeki olası etiketleri tara
    if (!name) {
        name = p.name || p.NAME || p.Name || p.NAME_1 || p.VARNAME_1 || p.lektur || 
               p.bulgarian_name || p.NUTS3_NAME || p.province || "Bölge-" + Math.random();
    }

    // 3. İsme göre benzersiz renk üret
    // (İsim değişirse renk de otomatik değişir)
    const color = stringToColor(name);

    return {
        fillColor: color, 
        weight: 0.5,          // İnce sınır
        opacity: 1,
        color: '#000000',     // SINIR RENGİ: Siyah
        fillOpacity: 1        // Tam dolu
    };
}

// 3. DIŞ SINIRLAR (EN ÜST KATMAN)
export function getInternationalBorderStyle(feature) {
    return {
        fillColor: 'transparent', 
        weight: 2,            // Kalın ülke sınırı
        opacity: 1, 
        color: '#000000',     // Simsiyah
        fillOpacity: 0, 
        interactive: false
    };
}

// --- YARDIMCI FONKSİYONLAR ---

// Renk Üretici (Canlı ve Rastgele Görünümlü - HSL)
function stringToColor(str) {
    if (!str) return "#333";
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // Hash algoritması (String'i sayıya çevir)
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; 
    }
    
    // HSL Ayarları (Rival Regions Paleti)
    const h = Math.abs(hash) % 360; // Her renk tonu olabilir
    
    // Doygunluk (Saturation): %50-70 arası (Canlı)
    const s = 50 + (Math.abs(hash) % 20); 
    
    // Parlaklık (Lightness): %35-55 arası (Koyu temaya uygun)
    const l = 35 + (Math.abs(hash) % 20); 

    return `hsl(${h}, ${s}%, ${l}%)`; 
}