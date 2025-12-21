// HARİTA AYARLARI VE DETAYLI ÜLKE LİSTESİ

export const mapConfig = {
    minZoom: 4,
    maxZoom: 10,
    startView: [41.0, 29.0], // İstanbul civarına odaklan (TR-GR-BG ortası)
    startZoom: 6,
    maxBounds: [[-85, -180], [85, 180]]
};

export const dataUrls = {
    world: './assets/world.json', // Zemin
};

// DETAYLI OLARAK YÜKLENECEK ÜLKELER
// Anahtar (Key): assets/world.json içindeki ülke ismiyle AYNI olmalı (Filtreleme için)
// Değer (Value): Yüklenecek detaylı GeoJSON linki
export const detailedCountries = {
    "Turkey": "https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json",
    "Greece": "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/greece.geojson",
    "Bulgaria": "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/bulgaria.geojson"
};