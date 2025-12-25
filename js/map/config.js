// HARİTA AYARLARI VE LİNKLER

export const mapConfig = {
    minZoom: 4,
    maxZoom: 10,
    startView: [48.0, 15.0], // Avrupa'nın tam ortası (Viyana civarı)
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
    // Ana Vatan
    "Turkey",

    // Balkanlar & Komşular
    "Greece",
    "Bulgaria",
    "Romania",
    "Cyprus",

    // Kafkaslar & Ortadoğu & Asya
    "Syria",
    "Iraq",
    "Iran",
    "Georgia",
    "Armenia",
    "Azerbaijan",
    "Russia",

    // Doğu Avrupa
    "Ukraine",
    "Moldova",
    "Belarus",
    "Poland",
    "Czechia", // Çek Cumhuriyeti

    // Baltıklar & İskandinavya
    "Estonia",
    "Latvia",
    "Lithuania",
    "Finland",
    "Sweden",
    "Norway",

    // Batı & Orta Avrupa (YENİLER)
    "Germany",      // Almanya
    "France",       // Fransa
    "Italy",        // İtalya
    "Spain",        // İspanya
    "Portugal",     // Portekiz
    "Belgium",      // Belçika
    "Netherlands",  // Hollanda
    "Switzerland",  // İsviçre
    "Austria"       // Avusturya (Bunu da ekledim, arada boşluk kalmasın)
];