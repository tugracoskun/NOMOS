// KAYNAK SİSTEMİ
// Her bölge için gerçekçi kaynak dağılımı

export const resourcesList = [
    // Yaygın Kaynaklar
    { name: "Sığır Eti", rarity: "common", icon: "🥩" },
    { name: "Buğday", rarity: "common", icon: "🌾" },
    { name: "Su Rezervleri", rarity: "common", icon: "💧" },
    { name: "Kömür", rarity: "common", icon: "⚫" },
    { name: "Demir", rarity: "common", icon: "⚙️" },
    { name: "Kürk", rarity: "common", icon: "🦊" },
    { name: "Meyve", rarity: "common", icon: "🍎" },
    { name: "Şarap", rarity: "common", icon: "🍷" },
    { name: "Boya", rarity: "common", icon: "🎨" },
    { name: "Kıyafetler", rarity: "common", icon: "👔" },
    { name: "Baharatlar", rarity: "common", icon: "🌶️" },
    { name: "Peynir", rarity: "common", icon: "🧀" },

    // Orta Seviye
    { name: "Bronz", rarity: "uncommon", icon: "🔶" },
    { name: "Bakır", rarity: "uncommon", icon: "🟠" },
    { name: "Kahve", rarity: "uncommon", icon: "☕" },
    { name: "Mobilya", rarity: "uncommon", icon: "🪑" },
    { name: "Çay", rarity: "uncommon", icon: "🍵" },
    { name: "Şerbetçiotu", rarity: "uncommon", icon: "🌿" },
    { name: "Kâğıt", rarity: "uncommon", icon: "📄" },
    { name: "Pirinç", rarity: "uncommon", icon: "🍚" },
    { name: "Cam", rarity: "uncommon", icon: "🪟" },
    { name: "Tütün", rarity: "uncommon", icon: "🚬" },
    { name: "İpek", rarity: "uncommon", icon: "🧵" },

    // Değerli Kaynaklar
    { name: "Doğalgaz", rarity: "rare", icon: "🔥" },
    { name: "Petrol", rarity: "rare", icon: "🛢️" },
    { name: "Tropik Odun", rarity: "rare", icon: "🌴" },
    { name: "Bira", rarity: "rare", icon: "🍺" },
    { name: "Afyon", rarity: "rare", icon: "💊" },
    { name: "Kauçuk", rarity: "rare", icon: "⚫" },
    { name: "Gümüş", rarity: "rare", icon: "⚪" },
    { name: "Tuz", rarity: "rare", icon: "🧂" },
    { name: "Zeytin", rarity: "rare", icon: "🫒" },
    { name: "Kakao", rarity: "rare", icon: "🍫" },
    { name: "Porselen", rarity: "rare", icon: "🏺" },

    // Çok Değerli
    { name: "Altın", rarity: "epic", icon: "🟡" },
    { name: "Muz", rarity: "epic", icon: "🍌" },
    { name: "Silikon", rarity: "epic", icon: "💎" },
    { name: "Fildişi", rarity: "epic", icon: "🦷" },
    { name: "Limon", rarity: "epic", icon: "🍋" },
    { name: "Hurma", rarity: "epic", icon: "🌴" },
    { name: "Titanyum", rarity: "epic", icon: "⚙️" },
    { name: "Vanilya", rarity: "epic", icon: "🌸" },
    { name: "Lityum", rarity: "epic", icon: "🔋" },
    { name: "Domates", rarity: "epic", icon: "🍅" },

    // Efsanevi
    { name: "Safran", rarity: "legendary", icon: "🟨" },
    { name: "Elmaslar", rarity: "legendary", icon: "💎" },
    { name: "Tarçın", rarity: "legendary", icon: "🟤" },
    { name: "Çelik", rarity: "legendary", icon: "⚙️" },
    { name: "Mermer", rarity: "legendary", icon: "🏛️" },
    { name: "Alüminyum", rarity: "legendary", icon: "⚪" },
    { name: "Kobalt", rarity: "legendary", icon: "🔵" },
    { name: "Uranyum", rarity: "legendary", icon: "☢️" },
    { name: "Nadir Toprak Elementleri", rarity: "legendary", icon: "🌟" }
];

// Ülkeye özel kaynak tercihleri (gerçekçi dağılım)
export const countryResourcePreferences = {
    "Turkey": ["Mermer", "Krom", "Zeytin", "Buğday", "Çay"],
    "Saudi Arabia": ["Petrol", "Doğalgaz", "Hurma", "Altın"],
    "Venezuela": ["Petrol", "Altın", "Demir", "Kakao"],
    "Nigeria": ["Kobalt", "Petrol", "Kakao", "Kauçuk"],
    "Russia": ["Doğalgaz", "Petrol", "Altın", "Uranyum", "Kömür"],
    "China": ["Nadir Toprak Elementleri", "Çelik", "Silikon", "Pirinç"],
    "United States of America": ["Petrol", "Doğalgaz", "Altın", "Silikon", "Buğday"],
    "Brazil": ["Demir", "Kahve", "Şeker", "Tropik Odun", "Altın"],
    "Australia": ["Demir", "Altın", "Uranyum", "Kömür", "Lityum"],
    "India": ["Pirinç", "Çay", "Baharatlar", "Demir", "Kömür"],
    "South Africa": ["Altın", "Elmaslar", "Platinyum", "Kömür"],
    "Chile": ["Bakır", "Lityum", "Muz", "Şarap"],
    "Indonesia": ["Kauçuk", "Kakao", "Pirinç", "Kahve", "Tropik Odun"],
    "Iran": ["Petrol", "Doğalgaz", "Safran", "Bakır"],
    "Iraq": ["Petrol", "Doğalgaz", "Hurma"],
    "Norway": ["Petrol", "Doğalgaz", "Balık"],
    "Canada": ["Petrol", "Uranyum", "Altın", "Buğday"],
    "France": ["Şarap", "Buğday", "Peynir", "Uranyum"],
    "Germany": ["Çelik", "Kömür", "Bira", "Mobilya"],
    "Italy": ["Mermer", "Şarap", "Zeytin", "Porselen"],
    "Spain": ["Zeytin", "Şarap", "Mermer"],
    "Greece": ["Mermer", "Zeytin", "Şarap"],
    "Japan": ["Silikon", "Çelik", "Pirinç"],
    "South Korea": ["Silikon", "Çelik", "Elektronik"],
    "Afghanistan": ["Lityum", "Nadir Toprak Elementleri", "Afyon"],
    "Bolivia": ["Lityum", "Gümüş", "Doğalgaz"],
    "Congo": ["Kobalt", "Bakır", "Elmaslar", "Tropik Odun"],
    "Dem. Rep. Congo": ["Kobalt", "Bakır", "Elmaslar", "Tropik Odun"],
    "Colombia": ["Kahve", "Kömür", "Petrol", "Kakao"],
    "Peru": ["Bakır", "Altın", "Gümüş", "Kahve"],
    "Mexico": ["Gümüş", "Petrol", "Bakır", "Kahve"],
    "Argentina": ["Sığır Eti", "Şarap", "Buğday", "Lityum"],
    "Egypt": ["Doğalgaz", "Petrol", "Pamuk", "Hurma"],
    "Morocco": ["Fosfat", "Zeytin", "Turunçgiller"],
    "Vietnam": ["Pirinç", "Kahve", "Kauçuk", "Çay"],
    "Thailand": ["Pirinç", "Kauçuk", "Tropik Meyve"],
    "Malaysia": ["Kauçuk", "Tropik Odun", "Petrol"],
    "Philippines": ["Nikel", "Bakır", "Tropik Meyve"],
    "Ukraine": ["Buğday", "Demir", "Kömür"],
    "Poland": ["Kömür", "Bakır", "Gümüş"],
    "Sweden": ["Demir", "Kürk", "Odun"],
    "Finland": ["Kürk", "Odun", "Bakır"],
    "Netherlands": ["Doğalgaz", "Peynir", "Çiçek"],
    "Belgium": ["Çelik", "Elmas İşleme", "Çikolata"],
    "Switzerland": ["Altın İşleme", "Saat", "Peynir"],
    "Austria": ["Demir", "Mermer", "Odun"],
    "Portugal": ["Zeytin", "Şarap", "Mantar"],
    "Ireland": ["Sığır Eti", "Peynir", "Bira"],
    "Iceland": ["Balık", "Alüminyum", "Jeotermal"],
    "Denmark": ["Petrol", "Doğalgaz", "Peynir"],
    "Czech Republic": ["Çelik", "Cam", "Bira"],
    "Czechia": ["Çelik", "Cam", "Bira"],
    "Hungary": ["Buğday", "Şarap", "Bauxite"],
    "Romania": ["Petrol", "Doğalgaz", "Buğday"],
    "Bulgaria": ["Buğday", "Şarap", "Bakır"],
    "Serbia": ["Bakır", "Buğday", "Meyve"],
    "Croatia": ["Zeytin", "Şarap", "Mermer"],
    "Pakistan": ["Pirinç", "Buğday", "Pamuk"],
    "Bangladesh": ["Pirinç", "Çay", "Jüt"],
    "Sri Lanka": ["Çay", "Kauçuk", "Safir"],
    "Myanmar": ["Jade", "Pirinç", "Tropik Odun"],
    "Kazakhstan": ["Uranyum", "Petrol", "Buğday"],
    "Uzbekistan": ["Pamuk", "Doğalgaz", "Altın"],
    "Turkmenistan": ["Doğalgaz", "Petrol", "Pamuk"],
    "Azerbaijan": ["Petrol", "Doğalgaz"],
    "Georgia": ["Şarap", "Bakır", "Meyve"],
    "Armenia": ["Bakır", "Meyve", "Şarap"]
};

// Bölge için kaynak seç (gerçekçi dağılım)
export function assignResourceToRegion(countryName, regionIndex) {
    const preferences = countryResourcePreferences[countryName];

    if (preferences && preferences.length > 0) {
        // Ülkeye özel kaynaklardan seç
        const resource = preferences[regionIndex % preferences.length];
        const resourceData = resourcesList.find(r => r.name === resource);
        return resourceData || getRandomResource();
    }

    // Ülke tanımlı değilse rastgele ama gerçekçi seç
    return getRandomResource();
}

// Rastgele kaynak seç (nadirlik oranlarına göre)
function getRandomResource() {
    const rand = Math.random();
    let rarity;

    if (rand < 0.5) rarity = "common";
    else if (rand < 0.75) rarity = "uncommon";
    else if (rand < 0.90) rarity = "rare";
    else if (rand < 0.97) rarity = "epic";
    else rarity = "legendary";

    const filtered = resourcesList.filter(r => r.rarity === rarity);
    return filtered[Math.floor(Math.random() * filtered.length)];
}
