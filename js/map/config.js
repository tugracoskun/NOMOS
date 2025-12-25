// HARİTA AYARLARI VE LİNKLER

export const mapConfig = {
    minZoom: 4,
    maxZoom: 10,
    startView: [36.0, 28.0], // Akdeniz Ortası (Hem Avrupa hem Afrika görünür)
    startZoom: 5,
    maxBounds: [[-85, -180], [85, 180]]
};

export const dataUrls = {
    world: './assets/world.json',          // Zemin
    turkey: './assets/tr.json',            // Türkiye (Yüksek Detay)
    neighbors: './assets/all_provinces.json' // Master Dosya (Tüm Dünya)
};

// GÖSTERİLECEK ÜLKELER LİSTESİ
export const activeCountries = [
    // Ana Vatan
    "Turkey",

    // Balkanlar & Komşular
    "Greece",
    "Bulgaria",
    "Romania",
    "Cyprus",

    // Doğu Avrupa
    "Ukraine",
    "Moldova",
    "Belarus",
    "Poland",
    "Czechia",
    "Russia",

    // Baltıklar & İskandinavya
    "Estonia",
    "Latvia",
    "Lithuania",
    "Finland",
    "Sweden",
    "Norway",

    // Batı & Orta Avrupa
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Portugal",
    "Belgium",
    "Netherlands",
    "Switzerland",
    "Austria",

    // --- YENİ EKLENENLER (ORTA DOĞU & LEVANT) ---
    "Syria",
    "Iraq",
    "Iran",
    "Georgia",
    "Armenia",
    "Azerbaijan",
    "Lebanon",   // Lübnan
    "Jordan",    // Ürdün
    "Israel",    // İsrail
    "Palestine", // Filistin

    // --- YENİ EKLENENLER (KUZEY AFRİKA) ---
    "Egypt",     // Mısır
    "Libya",     // Libya
    "Tunisia",   // Tunus
    "Algeria",   // Cezayir
    "Morocco"    // Fas
];