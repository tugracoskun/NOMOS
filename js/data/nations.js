import { getCountryCode } from './iso_codes.js';

// Ülke Verileri ve Yardımcı Fonksiyonlar

export const nations = {
    "tr": {
        id: "tr",
        name: "Türkiye",
        flag: "https://flagcdn.com/w320/tr.png",
        capital: "Ankara",
        leader: "Başkan [TR]",
        leaderTitle: "Cumhurbaşkanı",
        government: "Cumhuriyet",
        gdp: "900 Mr $",
        population: "85 M",
        ranking: 18,
        tech: "0.75",
        mainResource: "Tekstil",
        ministers: [
            { title: "Ekonomi Bakanı", name: "Mehmet Şimşek" },
            { title: "Savunma Bakanı", name: "Yaşar Güler" },
            { title: "Dışişleri Bakanı", name: "Hakan Fidan" }
        ],
        color: "#E30A17",
        alliances: [
            { name: "NATO", icon: "fa-shield-halved" },
            { name: "TDT", icon: "fa-handshake" }
        ]
    },
    "us": {
        id: "us",
        name: "Amerika Birleşik Devletleri",
        flag: "https://flagcdn.com/w320/us.png",
        capital: "Washington, D.C.",
        leader: "J. Biden",
        leaderTitle: "Başkan",
        government: "Federal Cumhuriyet",
        gdp: "23 Tn $",
        population: "331 M",
        ranking: 1,
        tech: "0.98",
        mainResource: "Teknoloji",
        ministers: [
            { title: "Hazine Bakanı", name: "Janet Yellen" },
            { title: "Savunma Bakanı", name: "Lloyd Austin" },
            { title: "Dışişleri Bakanı", name: "Antony Blinken" }
        ],
        color: "#3C3B6E",
        alliances: [
            { name: "NATO", icon: "fa-shield-halved" }
        ]
    },
    "ru": {
        id: "ru",
        name: "Rusya Federasyonu",
        flag: "https://flagcdn.com/w320/ru.png",
        capital: "Moskova",
        leader: "V. Putin",
        leaderTitle: "Devlet Başkanı",
        government: "Federasyon",
        gdp: "1.7 Tn $",
        population: "144 M",
        ranking: 11,
        tech: "0.85",
        mainResource: "Doğalgaz",
        ministers: [
            { title: "Maliye Bakanı", name: "Anton Siluanov" },
            { title: "Savunma Bakanı", name: "Sergey Şoygu" },
            { title: "Dışişleri Bakanı", name: "Sergey Lavrov" }
        ],
        color: "#0039A6",
        alliances: [
            { name: "CSTO", icon: "fa-shield-halved" }
        ]
    },
    "ma": {
        id: "ma",
        name: "Fas Krallığı",
        flag: "https://flagcdn.com/w320/ma.png",
        capital: "Rabat",
        leader: "VI. Muhammed",
        leaderTitle: "Kral",
        government: "Anayasal Monarşi",
        gdp: "142 Mr $",
        population: "37 M",
        ranking: 58,
        tech: "0.45",
        mainResource: "Fosfat",
        ministers: [
            { title: "Başbakan", name: "Aziz Akhannouch" },
            { title: "Dışişleri Bakanı", name: "Nasser Bourita" }
        ],
        color: "#c1272d",
        alliances: [
            { name: "AB Gümrük", icon: "fa-euro-sign" }
        ]
    },
    "de": {
        id: "de",
        name: "Almanya",
        flag: "https://flagcdn.com/w320/de.png",
        capital: "Berlin",
        leader: "O. Scholz",
        leaderTitle: "Şansölye",
        government: "Federal Cumhuriyet",
        gdp: "4.2 Tn $",
        population: "83 M",
        ranking: 4,
        tech: "0.92",
        mainResource: "Otomotiv",
        ministers: [
            { title: "Maliye Bakanı", name: "Christian Lindner" },
            { title: "Dışişleri Bakanı", name: "Annalena Baerbock" }
        ],
        color: "#DD0000",
        alliances: [
            { name: "NATO", icon: "fa-shield-halved" },
            { name: "AB", icon: "fa-flag-usa" }
        ]
    },
    "fr": {
        id: "fr",
        name: "Fransa",
        flag: "https://flagcdn.com/w320/fr.png",
        capital: "Paris",
        leader: "E. Macron",
        leaderTitle: "Cumhurbaşkanı",
        government: "Cumhuriyet",
        gdp: "2.9 Tn $",
        population: "67 M",
        ranking: 7,
        tech: "0.88",
        mainResource: "Havacılık",
        ministers: [
            { title: "Başbakan", name: "Gabriel Attal" },
            { title: "Ekonomi Bakanı", name: "Bruno Le Maire" }
        ],
        color: "#0055A4",
        alliances: [
            { name: "NATO", icon: "fa-shield-halved" },
            { name: "AB", icon: "fa-flag" }
        ]
    },
    "cn": {
        id: "cn",
        name: "Çin Halk Cumhuriyeti",
        flag: "https://flagcdn.com/w320/cn.png",
        capital: "Pekin",
        leader: "Xi Jinping",
        leaderTitle: "Devlet Başkanı",
        government: "Sosyalist Cumhuriyet",
        gdp: "17.7 Tn $",
        population: "1.4 Mr",
        ranking: 2,
        tech: "0.90",
        mainResource: "Elektronik",
        ministers: [
            { title: "Başbakan", name: "Li Qiang" },
            { title: "Dışişleri Bakanı", name: "Wang Yi" }
        ],
        color: "#EE1C25",
        alliances: []
    }
};

// Ana Fonksiyon: İsmi alır, ID'yi bulur, veriyi döner
export function getNationData(countryName) {
    if (!countryName) return generateFallback("Bilinmiyor", "un_000");

    // 1. Önce nations objesindeki Türkçe isimle eşleşme ara
    const byName = Object.values(nations).find(
        n => n.name.toLowerCase() === countryName.trim().toLowerCase()
    );
    if (byName) {
        const robustId = byName.id.length < 4 ? generateRobustId(byName.id) : byName.id;
        return { ...byName, id: robustId };
    }

    // 2. ISO kodu ile dene (İngilizce isimler için)
    const isoCode = getCountryCode(countryName);

    // 3. Bu kod için özel tanımlanmış veri var mı?
    let data = nations[isoCode];

    // 4. Sağlam ID Oluştur
    let robustId = data?.id;
    if (!robustId || robustId.length < 4) {
        robustId = generateRobustId(isoCode);
    }

    if (data) {
        return { ...data, id: robustId };
    }

    // 5. Yoksa jenerik oluştur
    return generateFallback(countryName, robustId, isoCode);
}

// ID oluşturucu: TR -> TR_592 gibi
function generateRobustId(code) {
    if (code === "un") return "un_999";

    // Basit bir hash mantığıyla her ülke kodu için sabit bir numara üretmeye çalışalım
    // Böylece "Turkey" her zaman aynı ID'yi alır (server restart olmadıkça veya logic değişmedikçe)
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
        hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash % 900) + 100; // 100-999 arası sayı

    return `${code.toUpperCase()}_${num}`;
}

function generateFallback(name, id, originalDetailsCode = "un") {
    // FlagCDN için temiz 2 harfli koda ihtiyacımız var, ID'den parse edelim veya parametre alalım
    const flagCode = originalDetailsCode !== "un" ? originalDetailsCode : (id.split('_')[0].toLowerCase() || "un");

    return {
        id: id,
        name: name,
        flag: `https://flagcdn.com/w320/${flagCode}.png`,
        // ... (Kalanlar aynı)
        capital: "Bilinmiyor",
        leader: "Bilinmiyor",
        leaderTitle: "Devlet Başkanı",
        government: "Cumhuriyet",
        gdp: (Math.random() * 500 + 10).toFixed(0) + " Mr $",
        population: (Math.random() * 50 + 1).toFixed(1) + " M",
        ranking: Math.floor(Math.random() * 100) + 20,
        tech: (Math.random() * 0.8).toFixed(2),
        mainResource: ["Tarım", "Sanayi", "Turizm", "Maden"][Math.floor(Math.random() * 4)],
        ministers: [
            { title: "Ekonomi Bakanı", name: "Bilinmiyor" },
            { title: "Dışişleri Bakanı", name: "Bilinmiyor" }
        ],
        color: "#555555",
        alliances: []
    };
}
