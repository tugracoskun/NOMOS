// ŞEHİR İSTATİSTİKLERİ MODÜLÜ
// Altyapı, Vergi Verimliliği, Eyalet Değeri hesaplamaları

// Bina Tipleri ve Etkileri
// role: 'citizen' (Vatandaş inşa edebilir), 'president' (Yalnızca Başkan inşa edebilir)
export const buildingTypes = {
    // Ekonomik/Yönetim Binaları
    municipality: {
        name: "Belediye Binası",
        icon: "fa-solid fa-building-flag",
        effects: { maintenanceCost: -0.15 },
        cost: 40000,
        description: "İl bakım ücreti %15 düşer",
        role: 'president'
    },
    courthouse: {
        name: "Mahkeme Binası",
        icon: "fa-solid fa-scale-balanced",
        effects: { maintenanceCost: -0.10 },
        cost: 35000,
        description: "İl bakım ücreti %10 düşer",
        role: 'president'
    },
    taxOffice: {
        name: "Vergi Dairesi",
        icon: "fa-solid fa-landmark",
        effects: { taxEfficiency: +0.10 },
        cost: 30000,
        description: "Vergi verimliliği %10 artar",
        role: 'president'
    },
    taxCollection: {
        name: "Vergi Toplama Dairesi",
        icon: "fa-solid fa-money-check-dollar",
        effects: { taxEfficiency: +0.05 },
        cost: 3500,
        description: "Vergi verimliliği %5 artar",
        role: 'president'
    },

    // Üretim/Ticaret Binaları
    port: {
        name: "Liman",
        icon: "fa-solid fa-ship",
        effects: { tradeIncome: +0.20 },
        cost: 75000,
        requiresCoast: true,
        description: "Ticaret geliri %20 artar (Kıyı şeridi gerektirir)",
        role: 'president'
    },
    airport: {
        name: "Havalimanı",
        icon: "fa-solid fa-plane",
        effects: { tradeIncome: +0.30, tourismBonus: +0.15 },
        cost: 150000,
        description: "Uluslararası ticaret ve turizm geliri sağlar",
        role: 'president'
    },
    manufactory: {
        name: "Manufactory",
        icon: "fa-solid fa-gears",
        effects: { productionBonus: +0.15 },
        cost: 25000,
        description: "Üretim bonusu %15 artar",
        role: 'citizen'
    },
    warehouse: {
        name: "Ambar",
        icon: "fa-solid fa-warehouse",
        effects: { storageCapacity: +100 },
        cost: 15000,
        description: "Depolama kapasitesi +100",
        role: 'citizen'
    },
    farm: {
        name: "Çiftlik",
        icon: "fa-solid fa-tractor",
        effects: { foodProduction: +0.20 },
        cost: 2500,
        description: "Gıda üretimi %20 artar",
        role: 'citizen'
    },
    foodWorkshop: {
        name: "Gıda Atölyesi",
        icon: "fa-solid fa-utensils",
        effects: { foodProduction: +0.10, productionBonus: +0.05 },
        cost: 4000,
        description: "Gıda üretimi %10, üretim bonusu %5 artar",
        role: 'citizen'
    },
    workshop: {
        name: "Atölye",
        icon: "fa-solid fa-hammer",
        effects: { productionBonus: +0.10 },
        cost: 3500,
        description: "Üretim bonusu %10 artar",
        role: 'citizen'
    },
    tradeCenter: {
        name: "Ticaret Merkezi",
        icon: "fa-solid fa-store",
        effects: { tradeIncome: +0.15 },
        cost: 60000,
        description: "Ticaret geliri %15 artar",
        role: 'citizen'
    },
    bank: {
        name: "Banka",
        icon: "fa-solid fa-building-columns",
        effects: { taxEfficiency: +0.08, tradeIncome: +0.05 },
        cost: 50000,
        description: "Vergi verimliliği %8, ticaret geliri %5 artar",
        role: 'citizen'
    },
    factory: {
        name: "Fabrika",
        icon: "fa-solid fa-industry",
        effects: { productionBonus: +0.25 },
        cost: 85000,
        description: "Üretim bonusu %25 artar",
        role: 'citizen'
    },
    buildersGuild: {
        name: "İnşaatçılar Birliği",
        icon: "fa-solid fa-helmet-safety",
        effects: { constructionCost: -0.10 },
        cost: 5500,
        description: "İnşaat maliyeti %10 düşer",
        role: 'citizen'
    },
    railway: {
        name: "Demiryolu",
        icon: "fa-solid fa-train",
        effects: { tradeIncome: +0.10, maintenanceCost: -0.05 },
        cost: 15000,
        description: "Ticaret geliri %10 artar, bakım %5 düşer",
        role: 'president'
    },

    // Eğitim/Teknoloji Binaları
    library: {
        name: "Kütüphane",
        icon: "fa-solid fa-book",
        effects: { techIndex: +0.05 },
        cost: 10000,
        description: "Teknoloji indeksi %5 artar",
        role: 'citizen'
    },
    school: {
        name: "Okul",
        icon: "fa-solid fa-school",
        effects: { techIndex: +0.10 },
        cost: 20000,
        description: "Teknoloji indeksi %10 artar",
        role: 'citizen'
    },
    university: {
        name: "Üniversite",
        icon: "fa-solid fa-graduation-cap",
        effects: { techIndex: +0.20, scientistChance: +0.05 },
        cost: 100000,
        description: "Teknoloji indeksi %20 artar, bilim adamı şansı %5",
        role: 'president'
    },
    academy: {
        name: "Akademi",
        icon: "fa-solid fa-atom",
        effects: { techIndex: +0.30, scientistChance: +0.10 },
        cost: 25000,
        description: "Teknoloji indeksi %30 artar, bilim adamı şansı %10",
        role: 'president'
    }
};

// Altyapı Seviyeleri (1-10)
export const infrastructureLevels = {
    1: { taxEfficiency: 1.00, constructionCost: 1.00, maintenanceCost: 1.00, name: "Çok Düşük" },
    2: { taxEfficiency: 1.05, constructionCost: 0.95, maintenanceCost: 0.95, name: "Düşük" },
    3: { taxEfficiency: 1.10, constructionCost: 0.90, maintenanceCost: 0.90, name: "Az Gelişmiş" },
    4: { taxEfficiency: 1.15, constructionCost: 0.87, maintenanceCost: 0.85, name: "Orta-Alt" },
    5: { taxEfficiency: 1.20, constructionCost: 0.85, maintenanceCost: 0.80, name: "Orta" },
    6: { taxEfficiency: 1.25, constructionCost: 0.80, maintenanceCost: 0.75, name: "Orta-Üst" },
    7: { taxEfficiency: 1.32, constructionCost: 0.75, maintenanceCost: 0.68, name: "Gelişmiş" },
    8: { taxEfficiency: 1.40, constructionCost: 0.70, maintenanceCost: 0.60, name: "İleri" },
    9: { taxEfficiency: 1.45, constructionCost: 0.65, maintenanceCost: 0.55, name: "Çok İleri" },
    10: { taxEfficiency: 1.50, constructionCost: 0.60, maintenanceCost: 0.50, name: "Maksimum" }
};

// Altyapı geliştirme maliyeti
export function getInfrastructureUpgradeCost(currentLevel) {
    const baseCost = 5000;
    return Math.floor(baseCost * Math.pow(1.8, currentLevel));
}

// Eyalet Değeri Hesaplama (1-10 üzerinden)
export function calculateCityValue(cityData) {
    const infraScore = (cityData.infrastructure || 1) / 10; // 0-1
    const buildingCount = (cityData.buildings || []).length;
    const buildingScore = Math.min(buildingCount / 10, 1); // Max 10 bina = 1
    const taxEffScore = Math.min((cityData.taxEfficiency || 1) / 1.5, 1); // 1-1.5 arası normalize
    const popScore = Math.min((cityData.population || 0) / 5000000, 1); // 5M = max
    const popDensity = popScore * 0.15;
    const prodScore = Math.min((cityData.economy || 0) / 100, 1); // 100 = max

    const rawValue = (infraScore * 0.3) + (buildingScore * 0.2) + (taxEffScore * 0.2) + (popDensity) + (prodScore * 0.15);

    // 1-10 arası normalize et
    return Math.max(1, Math.ceil(rawValue * 10));
}

// Şehrin toplam vergi verimliliğini hesapla
export function calculateTaxEfficiency(cityData) {
    const infraLevel = cityData.infrastructure || 1;
    const infraBonus = infrastructureLevels[infraLevel]?.taxEfficiency || 1;

    let buildingBonus = 0;
    (cityData.buildings || []).forEach(buildingId => {
        const building = buildingTypes[buildingId];
        if (building?.effects?.taxEfficiency) {
            buildingBonus += building.effects.taxEfficiency;
        }
    });

    return infraBonus + buildingBonus;
}

// Şehir istatistiklerini oluştur (City Details için)
export function generateCityStats(cityData) {
    const infrastructure = cityData.infrastructure || 1;
    const taxEfficiency = calculateTaxEfficiency(cityData);
    const cityValue = calculateCityValue({ ...cityData, taxEfficiency, infrastructure });
    const buildings = cityData.buildings || [];

    // Kaynak Geliri Hesabı
    const resourceName = cityData.resource?.name || null;
    let resourceIncome = 0;
    if (resourceName && resourcesEconomics[resourceName]) {
        // Pazar Çarpanı (Market Multiplier) ileride global state'ten gelecek. Şimdilik 1.0
        resourceIncome = calculateResourceIncome(resourceName, 1.0);
    }

    return {
        infrastructure,
        infrastructureName: infrastructureLevels[infrastructure]?.name || "Bilinmiyor",
        taxEfficiency: Math.round(taxEfficiency * 100), // Yüzde olarak
        cityValue,
        buildingCount: buildings.length,
        buildings,
        resourceIncome // Yeni Alan: Tahmini Kaynak Geliri
    };
}

// --- FAZ 4: KAYNAK EKONOMİSİ SİSTEMİ ---

export const resourcesEconomics = {
    // Stratejik Kaynaklar (Yüksek Değer, Yüksek Oynaklık)
    "Petrol": { baseValue: 1200, volatility: 0.8 }, // Çok değerli ama savaşta düşebilir/artabilir
    "Doğalgaz": { baseValue: 1100, volatility: 0.7 },
    "Uranyum": { baseValue: 1500, volatility: 0.9 },
    "Altın": { baseValue: 1000, volatility: 0.4 }, // Güvenli liman
    "Pırlanta": { baseValue: 1300, volatility: 0.5 },
    "Lityum": { baseValue: 900, volatility: 0.6 },
    "Titanyum": { baseValue: 950, volatility: 0.5 },

    // Endüstriyel Hammaddeler (Orta Değer, Kararlı)
    "Demir": { baseValue: 600, volatility: 0.2 },
    "Çelik": { baseValue: 700, volatility: 0.3 }, // İşlenmiş olduğu için biraz daha değerli
    "Bakır": { baseValue: 550, volatility: 0.2 },
    "Alüminyum": { baseValue: 580, volatility: 0.2 },
    "Kömür": { baseValue: 400, volatility: 0.3 },
    "Kauçuk": { baseValue: 500, volatility: 0.4 },
    "Kereste": { baseValue: 350, volatility: 0.1 },

    // Tarım ve Gıda (Düşük Değer, Mevsimsel Oynaklık)
    "Buğday": { baseValue: 200, volatility: 0.3 },
    "Mısır": { baseValue: 220, volatility: 0.3 },
    "Pamuk": { baseValue: 450, volatility: 0.4 }, // Tekstil için önemli
    "Zeytin": { baseValue: 380, volatility: 0.2 },
    "Şarap": { baseValue: 500, volatility: 0.2 }, // Lüks tüketim
    "Balık": { baseValue: 250, volatility: 0.3 },
    "Tütün": { baseValue: 600, volatility: 0.2 }, // Yüksek vergi geliri potansiyeli

    // Diğer (Varsayılan)
    "Bilinmiyor": { baseValue: 100, volatility: 0.0 }
};

// Kaynak Geliri Hesaplama Fonksiyonu
// Formül: (BaseValue * MarketMultiplier) + (InfrastructureBonus)
export function calculateResourceIncome(resourceName, marketMultiplier = 1.0, infraLevel = 1) {
    const stats = resourcesEconomics[resourceName] || resourcesEconomics["Bilinmiyor"];

    // Altyapı bonusu: Her seviye %5 ek gelir sağlar
    const infraBonusMultiplier = 1 + ((infraLevel - 1) * 0.05);

    return Math.floor(stats.baseValue * marketMultiplier * infraBonusMultiplier);
}
