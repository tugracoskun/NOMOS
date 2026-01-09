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

// Altyapı Seviyeleri (1-10) detaylandırıldı
export const infrastructureLevels = {
    1: { name: "Köy Yolu", taxEfficiency: 1.00, constructionCost: 1.00, popCap: 100000, desc: "Temel ulaşım ağı." },
    2: { name: "Stabilize Yol", taxEfficiency: 1.05, constructionCost: 0.98, popCap: 250000, desc: "Daha iyi ticaret imkanı." },
    3: { name: "Asfalt Yol", taxEfficiency: 1.10, constructionCost: 0.95, popCap: 500000, desc: "Şehirleşme başlangıcı." },
    4: { name: "Karayolu Ağı", taxEfficiency: 1.15, constructionCost: 0.90, popCap: 1000000, desc: "Bölgesel bağlantı." },
    5: { name: "Otoyol Sistemi", taxEfficiency: 1.25, constructionCost: 0.85, popCap: 2000000, desc: "Hızlı lojistik ve ticaret." },
    6: { name: "Metro Hattı", taxEfficiency: 1.35, constructionCost: 0.80, popCap: 5000000, desc: "Yüksek yoğunluklu ulaşım." },
    7: { name: "Entegre Ulaşım", taxEfficiency: 1.45, constructionCost: 0.75, popCap: 10000000, desc: "Maksimum verimlilik." },
    8: { name: "Akıllı Şehir", taxEfficiency: 1.60, constructionCost: 0.70, popCap: 20000000, desc: "Teknolojik altyapı." },
    9: { name: "Fütüristik Ağ", taxEfficiency: 1.80, constructionCost: 0.60, popCap: 50000000, desc: "Sınırların ötesinde." },
    10: { name: "Ütopya", taxEfficiency: 2.00, constructionCost: 0.50, popCap: 100000000, desc: "Mükemmeliyet." }
};

// Altyapı geliştirme maliyeti (Daha dengeli eğri)
export function getInfrastructureUpgradeCost(currentLevel) {
    if (currentLevel >= 10) return 0; // Max seviye
    const baseCost = 15000;
    // Maliyet artış çarpanı: Her seviyede x2.2
    return Math.floor(baseCost * Math.pow(2.2, currentLevel - 1));
}

// Bir sonraki seviyenin önizlemesini getir (UI için)
export function getNextLevelPreview(currentLevel) {
    if (currentLevel >= 10) return null;
    const nextLvl = currentLevel + 1;
    const stats = infrastructureLevels[nextLvl];
    const cost = getInfrastructureUpgradeCost(currentLevel);

    return {
        level: nextLvl,
        name: stats.name,
        cost: cost,
        effects: [
            `Vergi Geliri: +%${Math.round((stats.taxEfficiency - 1) * 100)}`,
            `İnşaat Maliyeti: -%${Math.round((1 - stats.constructionCost) * 100)}`,
            `Nüfus Kapasitesi: ${formatNumber(stats.popCap)}`
        ]
    };
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// Eyalet Değeri Hesaplama (Gelişmiş Algoritma)
// Sonuç 1-100 arasında bir "Gelişmişlik Puanı" ve 1-10 arası "Yıldız Değeri" döner.
export function calculateCityValue(cityData) {
    // 1. Altyapı Skoru (Temel: 30 Puan)
    const infraScore = (cityData.infrastructure || 1) * 3;

    // 2. Bina Skoru (Max: 30 Puan)
    // Her bina 2 puan, özel binalar (Havalimanı, Üniversite vb.) 4 puan
    let buildingScore = 0;
    (cityData.buildings || []).forEach(bId => {
        const type = buildingTypes[bId];
        // Pahalı binalar daha çok puan getirir
        const bonus = (type?.cost > 50000) ? 4 : 2;
        buildingScore += bonus;
    });
    buildingScore = Math.min(buildingScore, 30); // Cap

    // 3. Nüfus ve Ekonomi (Max: 20 Puan)
    const popScore = Math.min((cityData.population || 0) / 5000000, 1) * 10;
    const ecoScore = Math.min((cityData.economy || 0) / 100, 1) * 10;

    // 4. Stratejik Kaynak (Max: 10 Puan)
    let resourceScore = 2; // Baz
    if (cityData.resource?.name) {
        const res = resourcesEconomics[cityData.resource.name];
        if (res) {
            // Değerine göre 2-10 arası puan
            resourceScore = Math.min(Math.ceil(res.baseValue / 150), 10);
        }
    }

    // 5. Vergi Verimliliği (Max: 10 Puan)
    // 1.0 -> 0 puan, 1.5 -> 10 puan
    const taxEff = calculateTaxEfficiency(cityData);
    const taxScore = Math.max(0, (taxEff - 1) * 20);

    // Toplam Skor (0-100)
    let totalScore = infraScore + buildingScore + popScore + ecoScore + resourceScore + taxScore;
    totalScore = Math.min(Math.max(totalScore, 10), 100); // 10-100 arası

    // 1-10 Skalasına Dönüştür
    const starValue = Math.ceil(totalScore / 10);

    return {
        score: Math.round(totalScore),
        stars: starValue,
        details: {
            "Altyapı": Math.round(infraScore),
            "Binalar": Math.round(buildingScore),
            "Nüfus": Math.round(popScore),
            "Ekonomi": Math.round(ecoScore),
            "Kaynak": Math.round(resourceScore),
            "Vergi Verim.": Math.round(taxScore)
        }
    };
}

// Global Sıralamayı Getir (LocalStorage'daki tüm şehirleri tarar)
export function getGlobalCityRankings() {
    try {
        const rawMap = localStorage.getItem('nomos_map_data');
        if (!rawMap) return [];

        const mapData = JSON.parse(rawMap);
        const cityList = [];

        Object.keys(mapData).forEach(key => {
            const data = mapData[key];
            // Sadece adı olan geçerli şehirleri al
            if (data.name) {
                // Eksik verileri varsayılanlarla doldur (Hesaplama için)
                const fullData = {
                    ...data,
                    infrastructure: data.infrastructure || 1,
                    buildings: data.buildings || [],
                    population: data.population || 100000,
                    economy: data.economy || 50
                };

                const val = calculateCityValue(fullData);
                cityList.push({
                    id: key,
                    name: data.name,
                    country: data.country || "Bilinmiyor",
                    stars: val.stars,
                    score: val.score,
                    resource: data.resource?.name || "Yok"
                });
            }
        });

        // Puana göre azalan sırala
        return cityList.sort((a, b) => b.score - a.score);

    } catch (e) {
        console.error("Rankings error:", e);
        return [];
    }
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
