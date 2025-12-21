// HARİTA STİLLERİ VE RENKLENDİRME
import { getSavedData } from './editor.js';

// 1. ZEMİN KATMANI (Sadece Dolgu - Okyanusla uyumlu)
export function getBaseCountryStyle(feature) {
    return {
        fillColor: '#111827', // Koyu zemin
        weight: 0,            // Sınır yok (Üst katman çizecek)
        opacity: 0,
        fillOpacity: 1
    };
}

// 2. DETAY KATMANI (EYALETLER - RENKLİ & EDİTÖR DESTEKLİ)
export function getProvinceStyle(feature) {
    const p = feature.properties;
    
    // --- EDİTÖR VERİSİ KONTROLÜ ---
    // LocalStorage'dan bu bölge için kayıtlı veri var mı?
    const saved = getSavedData(feature);
    
    // 1. İsim Belirle 
    // (Kaydedilmiş isim varsa onu al, yoksa GeoJSON içindeki olası etiketleri tara)
    let name = saved?.name || p.name || p.NAME || p.Name || p.NAME_1 || p.VARNAME_1 || 
               p.lektur || p.bulgarian_name || p.NUTS3_NAME || p.province || "Bölge-" + Math.random();

    // 2. Renk Belirle
    let color;
    if (saved && saved.color) {
        // Eğer editörden ÖZEL RENK seçildiyse kesinlikle onu kullan
        color = saved.color;
    } else {
        // Yoksa isme göre OTOMATİK renk üret (Voronoi Stili)
        // Not: Eğer ismi değiştirdiysen, bu fonksiyon yeni isme göre yeni bir renk üretir.
        color = stringToColor(name);
    }

    return {
        fillColor: color, 
        weight: 0.5,          // İnce sınır (Şehirler arası)
        opacity: 1,
        color: '#000000',     // Sınır Rengi: Siyah
        fillOpacity: 1        // Tam Dolu
    };
}

// 3. ULUSLARARASI SINIRLAR (EN ÜST KATMAN)
export function getInternationalBorderStyle(feature) {
    return {
        fillColor: 'transparent', // İçi boş
        weight: 2,                // Kalın çizgi (Ülkeleri ayırır)
        opacity: 1, 
        color: '#000000',         // Simsiyah
        fillOpacity: 0, 
        interactive: false
    };
}

// --- YARDIMCI FONKSİYONLAR ---

// Renk Üretici (String -> HSL Renk)
// İsme göre benzersiz ve canlı renkler üretir.
function stringToColor(str) {
    if (!str) return "#333";
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // Hash algoritması: String'i sayıya çevir
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; 
    }
    
    // HSL Ayarları (Strateji Oyunu Paleti)
    const h = Math.abs(hash) % 360; // Hue: Her renk olabilir
    
    // Doygunluk (Saturation): %50-70 arası (Canlı ama göz yormaz)
    const s = 50 + (Math.abs(hash) % 20); 
    
    // Parlaklık (Lightness): %35-55 arası (Koyu temaya uygun pastel)
    const l = 35 + (Math.abs(hash) % 20); 

    return `hsl(${h}, ${s}%, ${l}%)`; 
}