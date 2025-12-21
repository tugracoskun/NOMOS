// HARİTA AYARLARI VE LİNKLER

export const mapConfig = {
    minZoom: 4,
    maxZoom: 10,
    startView: [41.0, 25.0], // Türkiye-Yunanistan-Bulgaristan ortası
    startZoom: 6,
    maxBounds: [[-85, -180], [85, 180]]
};

export const dataUrls = {
    world: './assets/world.json',
};

// DETAYLI ÜLKELER (YEREL DOSYALAR)
export const detailedCountries = {
    "Turkey": "./assets/tr.json",
    "Greece": "./assets/gr.json", // Dosya gelince burası çalışacak
    "Bulgaria": "./assets/bg.json"
};