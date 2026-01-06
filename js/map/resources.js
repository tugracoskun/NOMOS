// KAYNAK SİSTEMİ - 53 KAYNAK (Yaygından Nadire Sıralı)

export const resourcesList = [
    // En Yaygın (1-10)
    { name: "Sığır Eti", icon: "fa-solid fa-cow" },
    { name: "Buğday", icon: "fa-solid fa-wheat-awn" },
    { name: "Su Rezervleri", icon: "fa-solid fa-droplet" },
    { name: "Kömür", icon: "fa-solid fa-mountain" },
    { name: "Demir", icon: "fa-solid fa-gavel" },
    { name: "Kürk", icon: "fa-solid fa-paw" },
    { name: "Meyve", icon: "fa-solid fa-apple-whole" },
    { name: "Şarap", icon: "fa-solid fa-wine-bottle" },
    { name: "Boya", icon: "fa-solid fa-palette" },
    { name: "Kıyafetler", icon: "fa-solid fa-shirt" },

    // Yaygın (11-23)
    { name: "Baharatlar", icon: "fa-solid fa-pepper-hot" },
    { name: "Peynir", icon: "fa-solid fa-cheese" },
    { name: "Bronz", icon: "fa-solid fa-ring" },
    { name: "Bakır", icon: "fa-solid fa-circle-dot" },
    { name: "Kahve", icon: "fa-solid fa-mug-hot" },
    { name: "Mobilya", icon: "fa-solid fa-couch" },
    { name: "Çay", icon: "fa-solid fa-mug-saucer" },
    { name: "Şerbetçiotu", icon: "fa-solid fa-mortar-pestle" },
    { name: "Kâğıt", icon: "fa-solid fa-scroll" },
    { name: "Pirinç", icon: "fa-solid fa-bowl-rice" },
    { name: "Cam", icon: "fa-solid fa-wine-glass" },
    { name: "Tütün", icon: "fa-solid fa-smoking" },
    { name: "İpek", icon: "fa-solid fa-feather" },

    // Orta Seviye (24-35)
    { name: "Doğalgaz", icon: "fa-solid fa-fire-flame-curved" },
    { name: "Petrol", icon: "fa-solid fa-oil-well" },
    { name: "Tropik Odun", icon: "fa-solid fa-tree" },
    { name: "Bira", icon: "fa-solid fa-beer-mug-empty" },
    { name: "Afyon", icon: "fa-solid fa-capsules" },
    { name: "Kauçuk", icon: "fa-solid fa-tire" },
    { name: "Gümüş", icon: "fa-solid fa-coins" },
    { name: "Tuz", icon: "fa-solid fa-cubes-stacked" },
    { name: "Zeytin", icon: "fa-solid fa-seedling" },
    { name: "Kakao", icon: "fa-solid fa-cookie-bite" },
    { name: "Porselen", icon: "fa-solid fa-martini-glass" },
    { name: "Altın", icon: "fa-solid fa-sack-dollar" },
    { name: "Muz", icon: "fa-solid fa-carrot" },

    // Değerli (36-44)
    { name: "Silikon", icon: "fa-solid fa-microchip" },
    { name: "Fildişi", icon: "fa-solid fa-hippo" },
    { name: "Limon", icon: "fa-solid fa-lemon" },
    { name: "Hurma", icon: "fa-solid fa-leaf" },
    { name: "Titanyum", icon: "fa-solid fa-shield-halved" },
    { name: "Vanilya", icon: "fa-solid fa-ice-cream" },
    { name: "Lityum", icon: "fa-solid fa-battery-full" },
    { name: "Domates", icon: "fa-solid fa-circle" },
    { name: "Safran", icon: "fa-solid fa-sun" },

    // Çok Değerli / Nadir (45-53)
    { name: "Elmaslar", icon: "fa-solid fa-gem" },
    { name: "Tarçın", icon: "fa-solid fa-jar" },
    { name: "Çelik", icon: "fa-solid fa-industry" },
    { name: "Mermer", icon: "fa-solid fa-building-columns" },
    { name: "Alüminyum", icon: "fa-solid fa-cube" },
    { name: "Kobalt", icon: "fa-solid fa-atom" },
    { name: "Uranyum", icon: "fa-solid fa-radiation" },
    { name: "Nadir Toprak Elementleri", icon: "fa-solid fa-flask-vial" }
];

// Basit modulo - tüm kaynaklar eşit dağıtılır
export function assignResourceToRegion(countryName, globalIndex) {
    // Direkt index kullan
    return resourcesList[globalIndex % resourcesList.length];
}
