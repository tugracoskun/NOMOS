// HARİTA AYARLARI VE LİNKLER

export const mapConfig = {
    minZoom: 4,
    maxZoom: 10,
    startView: [50.0, 25.0], // Avrupa'nın ortasına biraz daha odaklanalım
    startZoom: 5,
    maxBounds: [[-85, -180], [85, 180]]
};

export const dataUrls = {
    world: './assets/world.json',          // Zemin
    turkey: './assets/tr.json',            // Türkiye (Yüksek Detay)
    neighbors: './assets/all_provinces.json' // Tüm Dünya Arşivi (Master)
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

    // Kafkaslar & Ortadoğu
    "Syria",
    "Iraq",
    "Iran",
    "Georgia",
    "Armenia",
    "Azerbaijan",

    // Doğu Avrupa
    "Ukraine",
    "Moldova",
    "Belarus",   // Beyaz Rusya
    "Poland",    // Polonya
    "Russia",    // Rusya

    // Baltıklar
    "Estonia",
    "Latvia",
    "Lithuania",

    // İskandinavya
    "Finland",
    "Sweden",
    "Norway"
];