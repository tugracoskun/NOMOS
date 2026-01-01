// HARİTA AYARLARI VE LİNKLER

export const mapConfig = {
    minZoom: 3, // Amerika'yı görebilmek için biraz daha uzaklaşmaya izin verelim
    maxZoom: 10,
    startView: [39.0, 35.0], // Türkiye merkezli başlasın
    startZoom: 5,
    maxBounds: [[-85, -180], [85, 180]]
};

export const dataUrls = {
    world: './assets/world.json',          // Zemin
    turkey: './assets/tr.json',            // Türkiye (Özel)
    neighbors: './assets/all_provinces.json' // Master Dosya
};

// GÖSTERİLECEK ÜLKELER LİSTESİ
export const activeCountries = [
    // --- KUZEY AMERİKA (YENİ) ---
    "United States of America", // ABD
    "Canada",                   // Kanada

    // --- AVRUPA ---
    "United Kingdom", // İngiltere
    "Ireland",
    "Germany", "France", "Italy", "Spain", "Portugal", 
    "Belgium", "Netherlands", "Switzerland", "Austria",
    "Czechia", "Hungary", "Slovakia", "Poland", "Belarus",
    "Ukraine", "Moldova", "Romania", "Bulgaria", "Greece",
    "Albania", "Bosnia and Herzegovina", "Kosovo", "Macedonia", 
    "Serbia", "Montenegro", "Croatia", "Slovenia",
    
    // --- İSKANDİNAVYA & BALTIK ---
    "Finland", "Sweden", "Norway", "Denmark",
    "Estonia", "Latvia", "Lithuania",

    // --- ORTA DOĞU & KAFKASLAR ---
    "Turkey", // Ana Vatan
    "Cyprus", "Syria", "Iraq", "Iran", "Georgia", "Armenia", "Azerbaijan",
    "Lebanon", "Jordan", "Israel", "Palestine",

    // --- KUZEY AFRİKA ---
    "Egypt", "Libya", "Tunisia", "Algeria", "Morocco",
    
    // --- RUSYA ---
    "Russia"
];