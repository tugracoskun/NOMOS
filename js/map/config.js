// HARİTA AYARLARI

export const mapConfig = {
    minZoom: 3,
    maxZoom: 10,
    startView: [39.0, 35.0], // Dünya merkezi
    startZoom: 4,
    maxBounds: [[-85, -180], [85, 180]]
};

export const dataUrls = {
    world: './assets/world.json', // Tek kaynağımız
};

// LİSTEYİ BOŞALTTIK - ARTIK TÜM DÜNYA GEÇERLİ
export const activeCountries = [];