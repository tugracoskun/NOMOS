
// Ülke Verileri ve Yardımcı Fonksiyonlar

export const nations = {
    "Turkey": {
        id: "tr",
        name: "Türkiye",
        flag: "https://flagcdn.com/w320/tr.png",
        leader: "Başkan [TR]",
        leaderTitle: "Cumhurbaşkanı",
        government: "Cumhuriyet",
        gdp: "900 Mr $",
        population: "85 M",
        color: "#E30A17",
        alliances: [
            { name: "NATO", icon: "fa-shield-halved" },
            { name: "TDT", icon: "fa-handshake" }
        ]
    },
    "United States": {
        id: "us",
        name: "Amerika Birleşik Devletleri",
        flag: "https://flagcdn.com/w320/us.png",
        leader: "J. Biden",
        leaderTitle: "Başkan",
        government: "Federal Cumhuriyet",
        gdp: "23 Tn $",
        population: "331 M",
        color: "#3C3B6E",
        alliances: [
            { name: "NATO", icon: "fa-shield-halved" }
        ]
    },
    "Russia": {
        id: "ru",
        name: "Rusya Federasyonu",
        flag: "https://flagcdn.com/w320/ru.png",
        leader: "V. Putin",
        leaderTitle: "Devlet Başkanı",
        government: "Federasyon",
        gdp: "1.7 Tn $",
        population: "144 M",
        color: "#0039A6",
        alliances: [
            { name: "CSTO", icon: "fa-shield-halved" }
        ]
    },
    "Morocco": {
        id: "ma",
        name: "Fas Krallığı",
        flag: "https://flagcdn.com/w320/ma.png",
        leader: "VI. Muhammed",
        leaderTitle: "Kral",
        government: "Anayasal Monarşi",
        gdp: "142 Mr $",
        population: "37 M",
        color: "#c1272d",
        alliances: [
            { name: "AB Gümrük", icon: "fa-euro-sign" }
        ]
    },
    "Germany": {
        id: "de",
        name: "Almanya",
        flag: "https://flagcdn.com/w320/de.png",
        leader: "O. Scholz",
        leaderTitle: "Şansölye",
        government: "Federal Cumhuriyet",
        gdp: "4.2 Tn $",
        population: "83 M",
        color: "#DD0000",
        alliances: [
            { name: "NATO", icon: "fa-shield-halved" },
            { name: "AB", icon: "fa-flag-usa" } // AB icon placeholder
        ]
    },
    "France": {
        id: "fr",
        name: "Fransa",
        flag: "https://flagcdn.com/w320/fr.png",
        leader: "E. Macron",
        leaderTitle: "Cumhurbaşkanı",
        government: "Cumhuriyet",
        gdp: "2.9 Tn $",
        population: "67 M",
        color: "#0055A4",
        alliances: [
            { name: "NATO", icon: "fa-shield-halved" },
            { name: "AB", icon: "fa-flag" }
        ]
    },
    "China": {
        id: "cn",
        name: "Çin Halk Cumhuriyeti",
        flag: "https://flagcdn.com/w320/cn.png",
        leader: "Xi Jinping",
        leaderTitle: "Devlet Başkanı",
        government: "Sosyalist Cumhuriyet",
        gdp: "17.7 Tn $",
        population: "1.4 Mr",
        color: "#EE1C25",
        alliances: []
    }
};

// Bilinmeyen ülkeler için varsayılan veri oluşturucu
export function getNationData(countryName) {
    // 1. Tanımlı listeyi kontrol et
    // İsimden birebir eşleşme veya Türkçe/İngilizce mapping denenebilir.
    // Şimdilik basitçe listede var mı diye bakıyoruz.

    // Basit eşleşme (Case insensitive)
    const key = Object.keys(nations).find(k => k.toLowerCase() === countryName.toLowerCase());

    if (key) {
        return nations[key];
    }

    // 2. Bulunamazsa jenerik veri döndür
    return {
        id: "unknown",
        name: countryName,
        flag: `https://flagcdn.com/w320/${getMethodIdFromName(countryName)}.png`, // Tahmini kod
        leader: "Bilinmiyor",
        leaderTitle: "Devlet Başkanı",
        government: "Cumhuriyet",
        gdp: (Math.random() * 500 + 10).toFixed(0) + " Mr $",
        population: (Math.random() * 50 + 1).toFixed(1) + " M",
        color: "#555555",
        alliances: []
    };
}

// İsimden ülke kodu tahmin etmeye çalışan yardımcı (FlagCDN için)
function getMethodIdFromName(name) {
    if (!name) return "un";

    // Normalize input
    const cleanName = name.trim();

    // Expanded Mapping Name -> ISO 2 Code
    const map = {
        // Europe
        "Italy": "it", "Spain": "es", "Greece": "gr", "Bulgaria": "bg",
        "Germany": "de", "France": "fr", "United Kingdom": "gb", "Great Britain": "gb",
        "Russia": "ru", "Ukraine": "ua", "Poland": "pl", "Romania": "ro",
        "Netherlands": "nl", "Belgium": "be", "Czech Republic": "cz", "Czechia": "cz",
        "Sweden": "se", "Norway": "no", "Finland": "fi", "Denmark": "dk",
        "Switzerland": "ch", "Austria": "at", "Portugal": "pt", "Ireland": "ie",
        "Hungary": "hu", "Slovakia": "sk", "Belarus": "by", "Moldova": "md",
        "Serbia": "rs", "Croatia": "hr", "Bosnia and Herzegovina": "ba", "Albania": "al",
        "North Macedonia": "mk", "Slovenia": "si", "Montenegro": "me", "Iceland": "is",
        "Estonia": "ee", "Latvia": "lv", "Lithuania": "lt", "Malta": "mt", "Cyprus": "cy",

        // Middle East & North Africa
        "Turkey": "tr", "Syria": "sy", "Iraq": "iq", "Iran": "ir", "Egypt": "eg",
        "Saudi Arabia": "sa", "Yemen": "ye", "Oman": "om", "UAE": "ae", "United Arab Emirates": "ae",
        "Qatar": "qa", "Bahrain": "bh", "Kuwait": "kw", "Jordan": "jo", "Lebanon": "lb",
        "Israel": "il", "Palestine": "ps",
        "Algeria": "dz", "Tunisia": "tn", "Libya": "ly", "Morocco": "ma", "Sudan": "sd",

        // Asia
        "China": "cn", "Japan": "jp", "South Korea": "kr", "North Korea": "kp",
        "India": "in", "Pakistan": "pk", "Bangladesh": "bd", "Sri Lanka": "lk",
        "Indonesia": "id", "Malaysia": "my", "Vietnam": "vn", "Thailand": "th",
        "Philippines": "ph", "Singapore": "sg", "Myanmar": "mm", "Cambodia": "kh",
        "Laos": "la", "Mongolia": "mn", "Kazakhstan": "kz", "Uzbekistan": "uz",
        "Turkmenistan": "tm", "Kyrgyzstan": "kg", "Tajikistan": "tj", "Afghanistan": "af",
        "Azerbaijan": "az", "Armenia": "am", "Georgia": "ge",

        // Americas
        "United States": "us", "United States of America": "us", "USA": "us", "Canada": "ca",
        "Mexico": "mx", "Brazil": "br", "Argentina": "ar", "Chile": "cl",
        "Colombia": "co", "Peru": "pe", "Venezuela": "ve", "Bolivia": "bo",
        "Paraguay": "py", "Uruguay": "uy", "Ecuador": "ec", "Cuba": "cu",

        // Africa (Sub-Saharan)
        "Nigeria": "ng", "South Africa": "za", "Ethiopia": "et", "Kenya": "ke",
        "Tanzania": "tz", "Uganda": "ug", "Ghana": "gh", "Ivory Coast": "ci",
        "Cameroon": "cm", "Senegal": "sn", "Mali": "ml", "Niger": "ne",
        "Chad": "td", "Somalia": "so", "DR Congo": "cd", "Angola": "ao",

        // Oceania
        "Australia": "au", "New Zealand": "nz"
    };

    return map[cleanName] || "un"; // Bilinmiyorsa "un" (United Nations) veya "xx" dönebilir
}
