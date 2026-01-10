// COMPANY DATA MANAGEMENT
// Oyuncu şirket verilerini yönetir - Mesleğe göre dinamik şirket yapısı

const COMPANY_STORAGE_KEY = 'nomos_player_company';

// === MESLEK TÜRLERİ ===
export const PROFESSION_TYPES = {
    CLOTHING: {
        id: 'clothing',
        name: 'Tekstil & Moda',
        icon: 'fa-solid fa-shirt',
        color: '#e879f9',
        description: 'Giyim, aksesuar ve moda ürünleri üretimi/satışı',
        metrics: ['collections', 'sales', 'inventory', 'trends'],
        defaultProducts: ['T-Shirt', 'Pantolon', 'Elbise', 'Ceket', 'Aksesuar']
    },
    FOOD: {
        id: 'food',
        name: 'Gıda & Tarım',
        icon: 'fa-solid fa-wheat-awn',
        color: '#22c55e',
        description: 'Gıda üretimi, işleme ve dağıtımı',
        metrics: ['harvest', 'processing', 'freshness', 'demand'],
        defaultProducts: ['Buğday', 'Meyve', 'Sebze', 'Süt Ürünleri', 'Et']
    },
    TECH: {
        id: 'tech',
        name: 'Teknoloji',
        icon: 'fa-solid fa-microchip',
        color: '#3b82f6',
        description: 'Elektronik, yazılım ve teknoloji ürünleri',
        metrics: ['innovation', 'production', 'patents', 'market_share'],
        defaultProducts: ['Telefon', 'Bilgisayar', 'Yazılım', 'Çip', 'Sensör']
    },
    MINING: {
        id: 'mining',
        name: 'Madencilik',
        icon: 'fa-solid fa-gem',
        color: '#f59e0b',
        description: 'Maden çıkarımı ve işleme',
        metrics: ['extraction', 'reserves', 'processing', 'export'],
        defaultProducts: ['Demir', 'Bakır', 'Altın', 'Kömür', 'Lityum']
    },
    ENERGY: {
        id: 'energy',
        name: 'Enerji',
        icon: 'fa-solid fa-bolt',
        color: '#eab308',
        description: 'Enerji üretimi ve dağıtımı',
        metrics: ['production_mw', 'efficiency', 'grid_coverage', 'green_ratio'],
        defaultProducts: ['Elektrik', 'Doğalgaz', 'Petrol', 'Güneş Enerjisi', 'Rüzgar']
    },
    MANUFACTURING: {
        id: 'manufacturing',
        name: 'İmalat',
        icon: 'fa-solid fa-industry',
        color: '#64748b',
        description: 'Endüstriyel üretim ve imalat',
        metrics: ['output', 'quality', 'efficiency', 'orders'],
        defaultProducts: ['Makine', 'Araç Parçası', 'Mobilya', 'Kimyasal', 'Plastik']
    },
    LUXURY: {
        id: 'luxury',
        name: 'Lüks Ürünler',
        icon: 'fa-solid fa-crown',
        color: '#a855f7',
        description: 'Premium ve lüks ürün satışı',
        metrics: ['exclusivity', 'brand_value', 'vip_clients', 'prestige'],
        defaultProducts: ['Mücevher', 'Saat', 'Parfüm', 'Deri Eşya', 'Sanat']
    },
    LOGISTICS: {
        id: 'logistics',
        name: 'Lojistik',
        icon: 'fa-solid fa-truck-fast',
        color: '#06b6d4',
        description: 'Taşımacılık ve depolama hizmetleri',
        metrics: ['deliveries', 'fleet_size', 'coverage', 'on_time_rate'],
        defaultProducts: ['Karayolu', 'Denizyolu', 'Havayolu', 'Demiryolu', 'Depolama']
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
