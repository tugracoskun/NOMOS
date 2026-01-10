// COMPANY DATA MANAGEMENT
// Oyuncu şirket verilerini yönetir - Mesleğe göre dinamik şirket yapısı

const COMPANY_STORAGE_KEY = 'nomos_player_company';

// === MESLEK TÜRLERİ ===
export const PROFESSION_TYPES = {
    // === ÜRETİM SEKTÖRÜ ===
    MINING: {
        id: 'mining',
        name: 'Madencilik',
        icon: 'fa-solid fa-gem',
        color: '#f59e0b',
        category: 'production',
        description: 'Maden çıkarımı ve işleme. Hammadde tedarikçisi.',
        metrics: ['extraction', 'reserves', 'processing', 'export'],
        defaultProducts: ['Demir', 'Bakır', 'Altın', 'Kömür', 'Lityum', 'Elmas']
    },
    AGRICULTURE: {
        id: 'agriculture',
        name: 'Tarım & Gıda',
        icon: 'fa-solid fa-wheat-awn',
        color: '#22c55e',
        category: 'production',
        description: 'Gıda üretimi, hasat ve işleme.',
        metrics: ['harvest', 'processing', 'freshness', 'demand'],
        defaultProducts: ['Buğday', 'Meyve', 'Sebze', 'Süt Ürünleri', 'Et', 'Şarap']
    },
    RAW_MATERIALS: {
        id: 'raw_materials',
        name: 'Hammadde İşleme',
        icon: 'fa-solid fa-cubes',
        color: '#78716c',
        category: 'production',
        description: 'Demir, taş ve ahşap işleme. Sanayiye yarı mamul tedarik.',
        metrics: ['processing_rate', 'quality', 'capacity', 'contracts'],
        defaultProducts: ['Çelik', 'Kereste', 'Mermer', 'Cam', 'Plastik', 'Kimyasal']
    },
    MANUFACTURING: {
        id: 'manufacturing',
        name: 'İmalat',
        icon: 'fa-solid fa-industry',
        color: '#64748b',
        category: 'production',
        description: 'Endüstriyel üretim ve imalat.',
        metrics: ['output', 'quality', 'efficiency', 'orders'],
        defaultProducts: ['Makine', 'Araç Parçası', 'Mobilya', 'Elektronik', 'Tekstil']
    },
    ENERGY: {
        id: 'energy',
        name: 'Enerji',
        icon: 'fa-solid fa-bolt',
        color: '#eab308',
        category: 'production',
        description: 'Enerji üretimi ve dağıtımı.',
        metrics: ['production_mw', 'efficiency', 'grid_coverage', 'green_ratio'],
        defaultProducts: ['Elektrik', 'Doğalgaz', 'Petrol', 'Güneş Enerjisi', 'Nükleer']
    },

    // === HİZMET SEKTÖRÜ ===
    PORT_COMPANY: {
        id: 'port_company',
        name: 'Liman Şirketi',
        icon: 'fa-solid fa-anchor',
        color: '#0ea5e9',
        category: 'services',
        description: 'Liman operasyonları, deniz ticareti ve konteyner yönetimi.',
        metrics: ['throughput', 'berth_capacity', 'turnaround_time', 'clients'],
        defaultProducts: ['Konteyner', 'Bulk Kargo', 'Yakıt İkmali', 'Gemi Servisi', 'Depolama']
    },
    LOGISTICS: {
        id: 'logistics',
        name: 'Lojistik & Ulaşım',
        icon: 'fa-solid fa-truck-fast',
        color: '#06b6d4',
        category: 'services',
        description: 'Tren, uçak, otobüs üretimi ve taşımacılık.',
        metrics: ['deliveries', 'fleet_size', 'coverage', 'on_time_rate'],
        defaultProducts: ['Karayolu', 'Denizyolu', 'Havayolu', 'Demiryolu', 'Otobüs']
    },
    BANKING: {
        id: 'banking',
        name: 'Bankacılık',
        icon: 'fa-solid fa-building-columns',
        color: '#059669',
        category: 'finance',
        description: 'Banka ve finansal hizmetler. Kredi, mevduat, yatırım.',
        metrics: ['assets', 'loans', 'deposits', 'interest_margin'],
        defaultProducts: ['Kredi', 'Mevduat', 'Yatırım', 'Sigorta', 'Döviz']
    },
    TRADING: {
        id: 'trading',
        name: 'Trader',
        icon: 'fa-solid fa-chart-line',
        color: '#8b5cf6',
        category: 'finance',
        description: 'Borsa ve emtia ticareti. Sosyal medya etkisi, ün kazanımı.',
        metrics: ['portfolio_value', 'win_rate', 'followers', 'reputation'],
        defaultProducts: ['Hisse', 'Emtia', 'Türev', 'Kripto', 'Tahvil'],
        special: ['social_influence', 'portfolio_showcase'] // Warren Buffet tarzı "X'in Portföyü"
    },

    // === STRATEJİK SEKTÖR ===
    DEFENSE: {
        id: 'defense',
        name: 'Savunma Sanayi',
        icon: 'fa-solid fa-shield-halved',
        color: '#dc2626',
        category: 'strategic',
        description: 'Silah geliştirme, hükümet ihaleleri. Ülkeye katma değer.',
        metrics: ['contracts', 'r_and_d', 'security_level', 'government_rating'],
        defaultProducts: ['Hafif Silah', 'Zırhlı Araç', 'Drone', 'Radar', 'Füze Sistemi'],
        governmentTied: true
    },
    CONSTRUCTION: {
        id: 'construction',
        name: 'İnşaat',
        icon: 'fa-solid fa-helmet-safety',
        color: '#f97316',
        category: 'strategic',
        description: 'Altyapı, bina ve mega proje inşaatı.',
        metrics: ['projects', 'capacity', 'completion_rate', 'tenders'],
        defaultProducts: ['Konut', 'Ticari Bina', 'Köprü', 'Tünel', 'Havalimanı']
    },
    FOUNDATION: {
        id: 'foundation',
        name: 'Vakıf',
        icon: 'fa-solid fa-hand-holding-heart',
        color: '#ec4899',
        category: 'social',
        description: 'Eğitim, teknoloji ve toplumsal gelişim. Sosyal etki.',
        metrics: ['impact_score', 'beneficiaries', 'fund_raised', 'projects'],
        defaultProducts: ['Eğitim Bursu', 'Araştırma Fonu', 'Sağlık Desteği', 'Teknoloji Hibesi'],
        nonprofit: true
    },
    TECH: {
        id: 'tech',
        name: 'Teknoloji',
        icon: 'fa-solid fa-microchip',
        color: '#3b82f6',
        category: 'innovation',
        description: 'Yazılım, donanım ve inovasyon.',
        metrics: ['innovation', 'patents', 'users', 'market_share'],
        defaultProducts: ['Yazılım', 'Uygulama', 'Çip', 'AI Sistemi', 'Cloud']
    },

    // === TİCARET SEKTÖRÜ ===
    CLOTHING: {
        id: 'clothing',
        name: 'Tekstil & Moda',
        icon: 'fa-solid fa-shirt',
        color: '#e879f9',
        category: 'retail',
        description: 'Giyim, aksesuar ve moda ürünleri.',
        metrics: ['collections', 'sales', 'inventory', 'trends'],
        defaultProducts: ['T-Shirt', 'Pantolon', 'Elbise', 'Ceket', 'Aksesuar']
    },
    LUXURY: {
        id: 'luxury',
        name: 'Lüks Ürünler',
        icon: 'fa-solid fa-crown',
        color: '#a855f7',
        category: 'retail',
        description: 'Premium ve lüks ürün ticareti.',
        metrics: ['exclusivity', 'brand_value', 'vip_clients', 'prestige'],
        defaultProducts: ['Mücevher', 'Saat', 'Parfüm', 'Deri Eşya', 'Sanat']
    }
};

// === DEFAULT COMPANY TEMPLATE ===
function createDefaultCompany(professionType = 'CLOTHING') {
    const profession = PROFESSION_TYPES[professionType] || PROFESSION_TYPES.CLOTHING;

    return {
        id: `company_${Date.now()}`,
        name: 'Yeni Şirket',
        profession: profession.id,
        level: 1,
        experience: 0,

        // Finansal
        totalValue: 10000,
        dailyIncome: 150,
        weeklyGrowth: 2.5,
        cash: 5000,
        debt: 0,

        // Operasyonel
        employees: 5,
        maxEmployees: 10,
        reputation: 50, // 0-100
        customerSatisfaction: 75,

        // Ürünler
        products: profession.defaultProducts.map((name, i) => ({
            id: `prod_${i}`,
            name: name,
            stock: Math.floor(Math.random() * 100) + 10,
            price: Math.floor(Math.random() * 500) + 100,
            demand: Math.floor(Math.random() * 100),
            quality: Math.floor(Math.random() * 50) + 50
        })),

        // Siparişler
        orders: [],

        // Yatırımlar
        investments: [],

        // Zaman damgaları
        createdAt: Date.now(),
        lastUpdated: Date.now()
    };
}

// === LOAD PLAYER COMPANY ===
export function loadPlayerCompany() {
    try {
        const raw = localStorage.getItem(COMPANY_STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
        // Create default if not exists
        const defaultCompany = createDefaultCompany('CLOTHING');
        savePlayerCompany(defaultCompany);
        return defaultCompany;
    } catch (e) {
        console.error('Company load error:', e);
        return createDefaultCompany('CLOTHING');
    }
}

// === SAVE PLAYER COMPANY ===
export function savePlayerCompany(companyData) {
    companyData.lastUpdated = Date.now();
    localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(companyData));
}

// === GET PLAYER COMPANY (Read-only) ===
export function getPlayerCompany() {
    return loadPlayerCompany();
}

// === UPDATE COMPANY ===
export function updateCompany(updates) {
    const company = loadPlayerCompany();
    const updated = { ...company, ...updates };
    savePlayerCompany(updated);
    return updated;
}

// === CHANGE PROFESSION ===
export function changeCompanyProfession(newProfessionId) {
    const profession = Object.values(PROFESSION_TYPES).find(p => p.id === newProfessionId);
    if (!profession) return null;

    const company = loadPlayerCompany();
    company.profession = profession.id;
    company.products = profession.defaultProducts.map((name, i) => ({
        id: `prod_${i}`,
        name: name,
        stock: Math.floor(Math.random() * 100) + 10,
        price: Math.floor(Math.random() * 500) + 100,
        demand: Math.floor(Math.random() * 100),
        quality: Math.floor(Math.random() * 50) + 50
    }));

    savePlayerCompany(company);
    return company;
}

// === ADD PRODUCT ===
export function addProduct(productData) {
    const company = loadPlayerCompany();
    company.products.push({
        id: `prod_${Date.now()}`,
        ...productData,
        stock: productData.stock || 0,
        demand: 50,
        quality: 70
    });
    savePlayerCompany(company);
    return company;
}

// === UPDATE PRODUCT ===
export function updateProduct(productId, updates) {
    const company = loadPlayerCompany();
    const index = company.products.findIndex(p => p.id === productId);
    if (index !== -1) {
        company.products[index] = { ...company.products[index], ...updates };
        savePlayerCompany(company);
    }
    return company;
}

// === ADD ORDER ===
export function addOrder(orderData) {
    const company = loadPlayerCompany();
    const order = {
        id: `order_${Date.now()}`,
        ...orderData,
        status: 'pending',
        createdAt: Date.now()
    };
    company.orders.push(order);
    savePlayerCompany(company);
    return order;
}

// === GET PROFESSION INFO ===
export function getProfessionInfo(professionId) {
    return Object.values(PROFESSION_TYPES).find(p => p.id === professionId) || PROFESSION_TYPES.CLOTHING;
}

// === CALCULATE COMPANY METRICS ===
export function calculateCompanyMetrics(company) {
    if (!company) return {};

    const totalStock = company.products.reduce((sum, p) => sum + p.stock, 0);
    const avgQuality = company.products.reduce((sum, p) => sum + p.quality, 0) / company.products.length;
    const avgDemand = company.products.reduce((sum, p) => sum + p.demand, 0) / company.products.length;
    const pendingOrders = company.orders.filter(o => o.status === 'pending').length;

    return {
        totalStock,
        avgQuality: Math.round(avgQuality),
        avgDemand: Math.round(avgDemand),
        pendingOrders,
        productCount: company.products.length,
        employeeEfficiency: Math.round((company.employees / company.maxEmployees) * 100)
    };
}
