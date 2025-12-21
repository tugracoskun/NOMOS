// HARİTA AYARLARI VE LİNKLER

export const mapConfig = {
    minZoom: 4,
    maxZoom: 10,
    startView: [41.0, 35.0], 
    startZoom: 6,
    maxBounds: [[-85, -180], [85, 180]]
};

export const dataUrls = {
    world: './assets/world.json',          // Zemin (Ülkeler)
    allProvinces: './assets/all_provinces.json' // DETAY (Tüm Dünya İlleri)
};

// DETAYLI GÖSTERİLECEK ÜLKELER LİSTESİ
// Artık dosya yolu yazmana gerek yok. Sadece ismini yazman yeterli!
// Bu listedeki ülkelerin illeri haritada görünecek.
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
    "Azerbaijan"
];