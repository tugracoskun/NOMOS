// HARİTA AYARLARI

export const mapConfig = {
    minZoom: 4,
    maxZoom: 10,
    startView: [39.0, 35.0],
    startZoom: 5,
    maxBounds: [[-85, -180], [85, 180]]
};

export const dataUrls = {
    world: './assets/world.json',          // Zemin
    turkey: './assets/tr.json',            // Türkiye (Özel dosya kalsın)
    
    // KOMŞULAR İÇİN O BÜYÜK DOSYAYI KULLANIYORUZ
    neighbors: './assets/all_provinces.json' 
};

// GÖSTERİLECEK ÜLKELER
export const activeCountries = [
    "Turkey",
    "Greece",
    "Bulgaria",
    "Romania",
    "Ukraine",
    "Moldova",
    "Syria",
    "Georgia",
    "Armenia",
    "Azerbaijan",
    "Iraq",
    "Iran",
    "Cyprus",
    "Russia"
];