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

// === STAFF TİPLERİ ===
export const STAFF_TYPES = {
    CFO: {
        id: 'cfo',
        name: 'Mali Müdür (CFO)',
        icon: 'fa-solid fa-chart-pie',
        color: '#fbbf24',
        salary: 500,
        description: 'Detaylı mali raporlar ve gelir-gider analizi sağlar.',
        unlocks: ['detailed_financials', 'budget_planning', 'tax_optimization']
    },
    COO: {
        id: 'coo',
        name: 'Operasyon Müdürü (COO)',
        icon: 'fa-solid fa-gears',
        color: '#06b6d4',
        salary: 450,
        description: 'Üretim verimliliğini artırır, operasyonel maliyetleri düşürür.',
        unlocks: ['efficiency_boost', 'auto_production', 'supply_chain']
    },
    CMO: {
        id: 'cmo',
        name: 'Pazarlama Müdürü (CMO)',
        icon: 'fa-solid fa-bullhorn',
        color: '#ec4899',
        salary: 400,
        description: 'Marka değerini ve müşteri tabanını artırır.',
        unlocks: ['marketing_campaigns', 'brand_boost', 'customer_analytics']
    },
    HR: {
        id: 'hr',
        name: 'İK Müdürü',
        icon: 'fa-solid fa-users-gear',
        color: '#8b5cf6',
        salary: 350,
        description: 'Çalışan verimliliğini ve memnuniyetini artırır.',
        unlocks: ['talent_pool', 'training_programs', 'morale_boost']
    },
    LEGAL: {
        id: 'legal',
        name: 'Hukuk Danışmanı',
        icon: 'fa-solid fa-scale-balanced',
        color: '#64748b',
        salary: 400,
        description: 'Yasal riskleri azaltır, sözleşme avantajları sağlar.',
        unlocks: ['contract_protection', 'legal_shield', 'merger_support']
    }
};

// === MAX ŞİRKET SAYISI ===
export const MAX_COMPANIES = 7;
const COMPANIES_STORAGE_KEY = 'nomos_player_companies';
const ACTIVE_COMPANY_KEY = 'nomos_active_company_id';

// === DEFAULT COMPANY TEMPLATE ===
function createDefaultCompany(professionType = 'CLOTHING') {
    const profession = PROFESSION_TYPES[professionType] || PROFESSION_TYPES.CLOTHING;

    return {
        id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

        // Detaylı Finansal (CFO ile açılır)
        financialHistory: [],
        totalRevenue: 0,
        totalExpense: 0,
        netProfit: 0,

        // Operasyonel
        employees: 5,
        maxEmployees: 10,
        reputation: 50, // 0-100
        customerSatisfaction: 75,
        prestige: 10, // Yeni: 0-1000
        worldRank: 15420, // Yeni: Global sıralama
        nationalRank: 840, // Yeni: Ülke sıralaması
        sectorRank: 120, // Yeni: Sektör sıralaması

        // Yönetim Ekibi (Staff)
        staff: [], // [{id: 'cfo', hiredAt: Date, salary: 500}]

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

// === DELETE PRODUCT ===
export function deleteProduct(productId) {
    const company = loadPlayerCompany();
    company.products = company.products.filter(p => p.id !== productId);
    savePlayerCompany(company);
    return company;
}

// === HIRE EMPLOYEE ===
export function hireEmployee(count = 1) {
    const company = loadPlayerCompany();
    const hireCost = 500 * count;

    if (company.cash < hireCost) {
        return { success: false, error: 'Yetersiz nakit' };
    }

    if (company.employees + count > company.maxEmployees) {
        return { success: false, error: 'Maksimum çalışan sayısına ulaşıldı' };
    }

    company.employees += count;
    company.cash -= hireCost;
    savePlayerCompany(company);
    return { success: true, company };
}

// === FIRE EMPLOYEE ===
export function fireEmployee(count = 1) {
    const company = loadPlayerCompany();

    if (company.employees - count < 1) {
        return { success: false, error: 'En az 1 çalışan olmalı' };
    }

    company.employees -= count;
    // Severance pay
    company.cash -= 200 * count;
    savePlayerCompany(company);
    return { success: true, company };
}

// === UPGRADE CAPACITY ===
export function upgradeCapacity() {
    const company = loadPlayerCompany();
    const upgradeCost = company.maxEmployees * 1000;

    if (company.cash < upgradeCost) {
        return { success: false, error: 'Yetersiz nakit', cost: upgradeCost };
    }

    company.maxEmployees += 5;
    company.cash -= upgradeCost;
    company.experience += 50;
    savePlayerCompany(company);
    return { success: true, company };
}

// === UPDATE ORDER STATUS ===
export function updateOrderStatus(orderId, newStatus) {
    const company = loadPlayerCompany();
    const order = company.orders.find(o => o.id === orderId);

    if (order) {
        order.status = newStatus;
        order.updatedAt = Date.now();

        if (newStatus === 'completed') {
            company.cash += order.totalValue;
            company.experience += 10;
            company.reputation = Math.min(100, company.reputation + 1);
        }

        savePlayerCompany(company);
    }
    return company;
}

// === DELETE ORDER ===
export function deleteOrder(orderId) {
    const company = loadPlayerCompany();
    company.orders = company.orders.filter(o => o.id !== orderId);
    savePlayerCompany(company);
    return company;
}

// === CREATE NEW COMPANY (Full Reset) ===
export function createNewCompany(companyData) {
    const profession = PROFESSION_TYPES[companyData.professionKey] || PROFESSION_TYPES.CLOTHING;

    const newCompany = {
        id: `company_${Date.now()}`,
        name: companyData.name || 'Yeni Şirket',
        profession: profession.id,
        level: 1,
        experience: 0,

        // Finansal
        totalValue: companyData.startingCapital || 10000,
        dailyIncome: 0,
        weeklyGrowth: 0,
        cash: companyData.startingCapital || 10000,
        debt: 0,

        // Operasyonel
        employees: companyData.initialEmployees || 3,
        maxEmployees: 10,
        reputation: 30,
        customerSatisfaction: 50,

        // Ürünler
        products: profession.defaultProducts.slice(0, 3).map((name, i) => ({
            id: `prod_${Date.now()}_${i}`,
            name: name,
            stock: 50,
            price: Math.floor(Math.random() * 300) + 100,
            demand: 50,
            quality: 60
        })),

        // Siparişler
        orders: [],

        // Yatırımlar
        investments: [],

        // Zaman damgaları
        createdAt: Date.now(),
        lastUpdated: Date.now()
    };

    savePlayerCompany(newCompany);
    return newCompany;
}

// === DELETE COMPANY (Reset to Empty) ===
export function deleteCompany() {
    localStorage.removeItem(COMPANY_STORAGE_KEY);
    return null;
}

// === ADD INVESTMENT ===
export function addInvestment(investmentData) {
    const company = loadPlayerCompany();

    if (company.cash < investmentData.amount) {
        return { success: false, error: 'Yetersiz nakit' };
    }

    const investment = {
        id: `inv_${Date.now()}`,
        type: investmentData.type,
        name: investmentData.name,
        amount: investmentData.amount,
        expectedReturn: investmentData.expectedReturn || 0.05,
        startDate: Date.now(),
        maturityDate: Date.now() + (investmentData.durationDays || 30) * 24 * 60 * 60 * 1000,
        status: 'active'
    };

    company.investments.push(investment);
    company.cash -= investmentData.amount;
    savePlayerCompany(company);

    return { success: true, investment, company };
}

// === COLLECT INVESTMENT ===
export function collectInvestment(investmentId) {
    const company = loadPlayerCompany();
    const investment = company.investments.find(i => i.id === investmentId);

    if (!investment) {
        return { success: false, error: 'Yatırım bulunamadı' };
    }

    if (Date.now() < investment.maturityDate) {
        return { success: false, error: 'Yatırım henüz vadesi dolmadı' };
    }

    const returnAmount = investment.amount * (1 + investment.expectedReturn);
    company.cash += returnAmount;
    company.investments = company.investments.filter(i => i.id !== investmentId);
    savePlayerCompany(company);

    return { success: true, amount: returnAmount, company };
}

// === BUY STOCK FOR PRODUCT ===
export function buyProductStock(productId, quantity, unitCost) {
    const company = loadPlayerCompany();
    const totalCost = quantity * unitCost;

    if (company.cash < totalCost) {
        return { success: false, error: 'Yetersiz nakit' };
    }

    const product = company.products.find(p => p.id === productId);
    if (!product) {
        return { success: false, error: 'Ürün bulunamadı' };
    }

    product.stock += quantity;
    company.cash -= totalCost;
    savePlayerCompany(company);

    return { success: true, company };
}

// === SET PRODUCT PRICE ===
export function setProductPrice(productId, newPrice) {
    const company = loadPlayerCompany();
    const product = company.products.find(p => p.id === productId);

    if (!product) {
        return { success: false, error: 'Ürün bulunamadı' };
    }

    product.price = newPrice;
    savePlayerCompany(company);

    return { success: true, company };
}

// === SIMULATE DAILY OPERATIONS ===
export function simulateDailyOperations() {
    const company = loadPlayerCompany();

    // Calculate daily income based on products and employees
    let dailyRevenue = 0;
    const employeeEfficiency = company.employees / company.maxEmployees;

    company.products.forEach(product => {
        // Sales based on demand, price, and employee efficiency
        const salesRate = (product.demand / 100) * employeeEfficiency;
        const potentialSales = Math.floor(product.stock * salesRate * 0.1);
        const actualSales = Math.min(potentialSales, product.stock);

        if (actualSales > 0) {
            product.stock -= actualSales;
            dailyRevenue += actualSales * product.price;

            // Adjust demand based on stock levels
            if (product.stock < 10) {
                product.demand = Math.min(100, product.demand + 5);
            } else if (product.stock > 100) {
                product.demand = Math.max(10, product.demand - 3);
            }
        }
    });

    // Daily costs
    const employeeCosts = company.employees * 50;
    const operationalCosts = company.products.length * 20;
    const totalCosts = employeeCosts + operationalCosts;

    // Net income
    const netIncome = dailyRevenue - totalCosts;
    company.cash += netIncome;
    company.dailyIncome = netIncome;

    // Update total value
    company.totalValue = company.cash +
        company.products.reduce((sum, p) => sum + (p.stock * p.price), 0) +
        company.investments.reduce((sum, i) => sum + i.amount, 0);

    // Experience gain
    if (netIncome > 0) {
        company.experience += Math.floor(netIncome / 100);

        // Level up check
        if (company.experience >= 100) {
            company.level += 1;
            company.experience -= 100;
            company.maxEmployees += 2;
        }
    }

    // Update reputation slightly
    if (company.orders.filter(o => o.status === 'completed').length > 0) {
        company.reputation = Math.min(100, company.reputation + 0.5);
    }

    savePlayerCompany(company);
    return company;
}

// === GET ALL PROFESSION CATEGORIES ===
export function getProfessionsByCategory() {
    const categories = {
        production: { name: 'Üretim Sektörü', icon: 'fa-industry', professions: [] },
        services: { name: 'Hizmet Sektörü', icon: 'fa-handshake', professions: [] },
        finance: { name: 'Finans Sektörü', icon: 'fa-building-columns', professions: [] },
        strategic: { name: 'Stratejik Sektör', icon: 'fa-shield-halved', professions: [] },
        social: { name: 'Sosyal Sektör', icon: 'fa-heart', professions: [] },
        innovation: { name: 'İnovasyon Sektörü', icon: 'fa-lightbulb', professions: [] },
        retail: { name: 'Ticaret Sektörü', icon: 'fa-store', professions: [] }
    };

    Object.entries(PROFESSION_TYPES).forEach(([key, profession]) => {
        if (categories[profession.category]) {
            categories[profession.category].professions.push({
                key,
                ...profession
            });
        }
    });

    return categories;
}

// === ÇOKLU ŞİRKET YÖNETİMİ ===

// Tüm şirketleri getir
export function getAllCompanies() {
    try {
        const raw = localStorage.getItem(COMPANIES_STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
        // İlk şirketi ana şirketlerden al
        const mainCompany = loadPlayerCompany();
        if (mainCompany) {
            const companies = [mainCompany];
            saveAllCompanies(companies);
            return companies;
        }
        return [];
    } catch (e) {
        console.error('Companies load error:', e);
        return [];
    }
}

// Tüm şirketleri kaydet
export function saveAllCompanies(companies) {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
}

// Aktif şirket ID'sini al
export function getActiveCompanyId() {
    return localStorage.getItem(ACTIVE_COMPANY_KEY) || null;
}

// Aktif şirketi değiştir
export function setActiveCompany(companyId) {
    localStorage.setItem(ACTIVE_COMPANY_KEY, companyId);
    const companies = getAllCompanies();
    const company = companies.find(c => c.id === companyId);
    if (company) {
        savePlayerCompany(company);
    }
}

// Yeni şirket oluştur (max 7)
export function createAdditionalCompany(professionType, name, initialCapital = 5000) {
    const companies = getAllCompanies();

    if (companies.length >= MAX_COMPANIES) {
        return { success: false, error: 'Maksimum şirket sayısına ulaşıldı (7)' };
    }

    const newCompany = createDefaultCompany(professionType);
    newCompany.name = name;
    newCompany.cash = initialCapital;
    newCompany.totalValue = initialCapital * 2;

    companies.push(newCompany);
    saveAllCompanies(companies);

    return { success: true, company: newCompany };
}

// Şirket sil
export function removeCompany(companyId) {
    let companies = getAllCompanies();
    if (companies.length <= 1) {
        return { success: false, error: 'En az bir şirketiniz olmalı' };
    }

    companies = companies.filter(c => c.id !== companyId);
    saveAllCompanies(companies);

    // Aktif şirket silindiyse ilkini seç
    if (getActiveCompanyId() === companyId && companies.length > 0) {
        setActiveCompany(companies[0].id);
    }

    return { success: true };
}

// Şirket sayısını kontrol et
export function canCreateCompany() {
    return getAllCompanies().length < MAX_COMPANIES;
}

// === PARA TRANSFERİ ===

// Oyuncudan şirkete para aktar
export function transferToCompany(companyId, amount) {
    // Oyuncu bakiyesi kontrolü (gameState'den alınır)
    const gameState = JSON.parse(localStorage.getItem('nomos_game_state') || '{}');
    const playerMoney = gameState.money || 0;

    if (amount <= 0) {
        return { success: false, error: 'Geçersiz miktar' };
    }

    if (playerMoney < amount) {
        return { success: false, error: 'Yetersiz bakiye' };
    }

    // Para transferi
    gameState.money = playerMoney - amount;
    localStorage.setItem('nomos_game_state', JSON.stringify(gameState));

    // Şirkete ekle
    const companies = getAllCompanies();
    const company = companies.find(c => c.id === companyId);
    if (company) {
        company.cash += amount;
        company.lastUpdated = Date.now();
        saveAllCompanies(companies);

        // Ana şirket ise onu da güncelle
        if (getActiveCompanyId() === companyId || loadPlayerCompany().id === companyId) {
            savePlayerCompany(company);
        }
    }

    return { success: true, newBalance: gameState.money };
}

// Şirketten oyuncuya para çek
export function withdrawFromCompany(companyId, amount) {
    const companies = getAllCompanies();
    const company = companies.find(c => c.id === companyId);

    if (!company) {
        return { success: false, error: 'Şirket bulunamadı' };
    }

    if (amount <= 0) {
        return { success: false, error: 'Geçersiz miktar' };
    }

    if (company.cash < amount) {
        return { success: false, error: 'Şirkette yetersiz bakiye' };
    }

    // Şirketten çıkar
    company.cash -= amount;
    company.lastUpdated = Date.now();
    saveAllCompanies(companies);

    // Ana şirket ise onu da güncelle
    if (getActiveCompanyId() === companyId || loadPlayerCompany().id === companyId) {
        savePlayerCompany(company);
    }

    // Oyuncuya ekle
    const gameState = JSON.parse(localStorage.getItem('nomos_game_state') || '{}');
    gameState.money = (gameState.money || 0) + amount;
    localStorage.setItem('nomos_game_state', JSON.stringify(gameState));

    return { success: true, newBalance: gameState.money };
}

// === STAFF YÖNETİMİ ===

// Staff işe al
export function hireStaff(staffTypeId) {
    const company = loadPlayerCompany();
    const staffType = Object.values(STAFF_TYPES).find(s => s.id === staffTypeId);

    if (!staffType) {
        return { success: false, error: 'Geçersiz personel türü' };
    }

    // Zaten işe alınmış mı?
    if (company.staff && company.staff.some(s => s.id === staffTypeId)) {
        return { success: false, error: 'Bu personel zaten mevcut' };
    }

    // İşe alma ücreti (aylık maaşın 3 katı)
    const hiringCost = staffType.salary * 3;
    if (company.cash < hiringCost) {
        return { success: false, error: `Yetersiz bakiye. İşe alma maliyeti: ${hiringCost.toLocaleString()} ₳` };
    }

    // İşe al
    company.cash -= hiringCost;
    if (!company.staff) company.staff = [];
    company.staff.push({
        id: staffTypeId,
        hiredAt: Date.now(),
        salary: staffType.salary
    });

    savePlayerCompany(company);

    // Tüm şirketleri de güncelle
    const companies = getAllCompanies();
    const idx = companies.findIndex(c => c.id === company.id);
    if (idx >= 0) {
        companies[idx] = company;
        saveAllCompanies(companies);
    }

    return { success: true, staff: staffType };
}

// Staff işten çıkar
export function fireStaff(staffTypeId) {
    const company = loadPlayerCompany();

    if (!company.staff || !company.staff.some(s => s.id === staffTypeId)) {
        return { success: false, error: 'Bu personel mevcut değil' };
    }

    company.staff = company.staff.filter(s => s.id !== staffTypeId);
    savePlayerCompany(company);

    // Tüm şirketleri de güncelle
    const companies = getAllCompanies();
    const idx = companies.findIndex(c => c.id === company.id);
    if (idx >= 0) {
        companies[idx] = company;
        saveAllCompanies(companies);
    }

    return { success: true };
}

// Staff mevcut mu kontrol
export function hasStaff(staffTypeId) {
    const company = loadPlayerCompany();
    return company.staff && company.staff.some(s => s.id === staffTypeId);
}

// Toplam staff maaşını hesapla
export function getTotalStaffSalary() {
    const company = loadPlayerCompany();
    if (!company.staff) return 0;
    return company.staff.reduce((total, s) => {
        const staffType = Object.values(STAFF_TYPES).find(st => st.id === s.id);
        return total + (staffType ? staffType.salary : 0);
    }, 0);
}
