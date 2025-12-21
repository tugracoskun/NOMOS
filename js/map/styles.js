// HARİTA STİLLERİ VE RENKLENDİRME

// 1. ZEMİN KATMANI (Sadece Okyanus/Arka Plan etkisi için)
export function getBaseCountryStyle(feature) {
    return {
        fillColor: '#111827', // Koyu zemin (Okyanusla uyumlu)
        weight: 0,
        opacity: 0,
        fillOpacity: 1
    };
}

// 2. DETAY KATMANI (EYALETLER - RENGARENK)
export function getProvinceStyle(feature) {
    // İsim Bulucu (Veri setlerinde farklılık olabilir)
    const p = feature.properties;
    // Bulgaristan verisinde bazen 'name' yerine başka keyler olabilir, hepsini tarıyoruz
    const name = p.name || p.NAME || p.Name || p.NAME_1 || p.VARNAME_1 || p.lektur || "Bölge-" + Math.random();

    // DÜZELTME BURADA:
    // Artık ülkeye göre değil, doğrudan ŞEHİR İSMİNE göre renk üretiyoruz.
    // Bu sayede her şehir bambaşka bir renk alacak.
    const color = stringToColor(name);

    return {
        fillColor: color, 
        weight: 0.5,          // İnce sınır
        opacity: 1,
        color: '#000000',     // SINIR RENGİ: Siyah (Net ayrım için)
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

// Renk Üretici (Canlı ve Rastgele Görünümlü)
function stringToColor(str) {
    if (!str) return "#333";
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // Hash algoritmasını biraz karıştıralım ki birbirine yakın isimler farklı renk olsun
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; 
    }
    
    // HSL Ayarları (Rival Regions Paleti)
    const h = Math.abs(hash) % 360; // Her renk tonu olabilir
    
    // Doygunluk (Saturation): %50-70 arası (Canlı ama kör etmeyen)
    const s = 50 + (Math.abs(hash) % 20); 
    
    // Parlaklık (Lightness): %35-55 arası (Koyu temaya uygun, pastel)
    const l = 35 + (Math.abs(hash) % 20); 

    return `hsl(${h}, ${s}%, ${l}%)`; 
}