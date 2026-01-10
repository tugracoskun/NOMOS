// COMMODITY EXCHANGE - EMTİA TİCARETİ
// Oyundaki 53 kaynağın alım-satım borsası
// Tarım, gıda, metaller, madenler, enerji gibi hammaddelerin ticareti

import { resourcesList } from '../../../map/resources.js';
import { marketState, getMarketMultiplier } from '../../../data/market.js';

// Emtia Kategorileri - Temel Hammaddeler + Lüks
const COMMODITY_CATEGORIES = {
    AGRICULTURAL: {
        id: 'agricultural',
        name: 'Tarım & Gıda',
        icon: 'fa-solid fa-wheat-awn',
        color: '#22c55e',
        description: 'Çiftlik ürünleri, tahıllar ve gıda maddeleri',
        resources: ['Sığır Eti', 'Buğday', 'Meyve', 'Peynir', 'Kahve', 'Çay', 'Pirinç', 'Zeytin', 'Şarap', 'Muz', 'Hurma', 'Domates', 'Limon', 'Kakao']
    },
    METALS: {
        id: 'metals',
        name: 'Metaller & Madenler',
        icon: 'fa-solid fa-gem',
        color: '#f59e0b',
        description: 'Değerli ve endüstriyel metaller, madenler',
        resources: ['Demir', 'Bakır', 'Bronz', 'Gümüş', 'Altın', 'Titanyum', 'Lityum', 'Çelik', 'Alüminyum', 'Kobalt', 'Nadir Toprak Elementleri']
    },
    ENERGY: {
        id: 'energy',
        name: 'Enerji',
        icon: 'fa-solid fa-bolt',
        color: '#eab308',
        description: 'Fosil yakıtlar ve enerji kaynakları',
        resources: ['Kömür', 'Doğalgaz', 'Petrol', 'Uranyum']
    },
    RAW_MATERIALS: {
        id: 'raw_materials',
        name: 'Hammadde',
        icon: 'fa-solid fa-cubes',
        color: '#78716c',
        description: 'Sanayi için temel hammaddeler',
        resources: ['Su Rezervleri', 'Kauçuk', 'Tuz', 'Cam', 'Tropik Odun', 'Mermer', 'Silikon', 'Kâğıt']
    },
    LUXURY: {
        id: 'luxury',
        name: 'Lüks Emtia',
        icon: 'fa-solid fa-crown',
        color: '#a855f7',
        description: 'Tekstil, tüketim ürünleri ve nadir emtialar',
        resources: [
            // Tekstil & Kıyafet
            'İpek', 'Kürk', 'Boya', 'Kıyafetler',
            // Lüks Tüketim
            'Baharatlar', 'Şerbetçiotu', 'Tütün', 'Bira', 'Afyon',
            // Nadir & Değerli
            'Fildişi', 'Elmaslar', 'Safran', 'Vanilya', 'Tarçın',
            // Dekoratif
            'Mobilya', 'Porselen'
        ]
    }
};

// Simüle edilmiş emtia fiyat verileri
function generateCommodityData() {
    return resourcesList.map((resource, index) => {
        const basePrice = 100 + (index * 25) + Math.random() * 500;
        const change = (Math.random() - 0.5) * 10;
        const volume = Math.floor(Math.random() * 100000) + 10000;

        return {
            id: `commodity_${index}`,
            name: resource.name,
            icon: resource.icon,
            price: Math.round(basePrice),
            change: Math.round(change * 100) / 100,
            volume: volume,
            high24h: Math.round(basePrice * 1.05),
            low24h: Math.round(basePrice * 0.95),
            category: findCategoryForResource(resource.name)
        };
    });
}

function findCategoryForResource(resourceName) {
    for (const [key, category] of Object.entries(COMMODITY_CATEGORIES)) {
        if (category.resources.includes(resourceName)) {
            return category.id;
        }
    }
    return 'other';
}

// === COMMODITY WIDGET ===
export function renderCommodityExchangeWidget() {
    const commodities = generateCommodityData();
    const topGainers = [...commodities].sort((a, b) => b.change - a.change).slice(0, 4);
    const topVolume = [...commodities].sort((a, b) => b.volume - a.volume).slice(0, 3);

    return `
        <div class="commodity-widget-content">
            <div class="commodity-widget-header">
                <div class="header-title">
                    <i class="fa-solid fa-scale-balanced"></i>
                    <h3>Emtia Ticareti</h3>
                </div>
                <div class="market-status">
                    <span class="status-dot"></span>
                    Açık
                </div>
            </div>

            <!-- Kategori Strip -->
            <div class="category-strip">
                ${Object.values(COMMODITY_CATEGORIES).slice(0, 4).map(cat => `
                    <div class="category-pill" style="background: ${cat.color}20; color: ${cat.color}">
                        <i class="${cat.icon}"></i>
                        <span>${cat.name.split(' ')[0]}</span>
                    </div>
                `).join('')}
            </div>

            <!-- Top Movers -->
            <div class="commodity-movers">
                <h4>En Çok Değişenler</h4>
                <div class="movers-list">
                    ${topGainers.map(c => `
                        <div class="commodity-mover-item ${c.change >= 0 ? 'up' : 'down'}">
                            <div class="commodity-icon">
                                <i class="${c.icon}"></i>
                            </div>
                            <div class="commodity-info">
                                <span class="commodity-name">${c.name}</span>
                                <span class="commodity-price">${c.price.toLocaleString()} ₳</span>
                            </div>
                            <div class="commodity-change ${c.change >= 0 ? 'positive' : 'negative'}">
                                <i class="fa-solid fa-${c.change >= 0 ? 'caret-up' : 'caret-down'}"></i>
                                ${c.change >= 0 ? '+' : ''}${c.change}%
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="commodity-actions">
                <button class="btn-commodity" data-action="view-commodities">
                    <i class="fa-solid fa-scale-balanced"></i>
                    Tüm Emtialar
                </button>
                <button class="btn-commodity" data-action="trade-commodity">
                    <i class="fa-solid fa-arrow-right-arrow-left"></i>
                    İşlem Yap
                </button>
            </div>
        </div>
    `;
}

// === FULL COMMODITY EXCHANGE VIEW ===
export function renderCommodityExchangeSection() {
    const commodities = generateCommodityData();

    return `
        <div class="commodity-full-view">
            <header class="commodity-header">
                <div class="header-left">
                    <h1><i class="fa-solid fa-scale-balanced"></i> Emtia Ticareti</h1>
                    <p>Tarım, gıda, enerji ve hammadde alım-satımı</p>
                </div>
                <div class="header-actions">
                    <button class="btn-action" data-action="portfolio">
                        <i class="fa-solid fa-wallet"></i> Portföyüm
                    </button>
                    <button class="btn-action primary" data-action="new-trade">
                        <i class="fa-solid fa-plus"></i> Yeni İşlem
                    </button>
                </div>
            </header>

            <!-- Kategori Tabs -->
            <div class="commodity-category-tabs">
                <button class="category-tab active" data-category="all">
                    <i class="fa-solid fa-list"></i> Tümü
                </button>
                ${Object.values(COMMODITY_CATEGORIES).map(cat => `
                    <button class="category-tab" data-category="${cat.id}" style="--cat-color: ${cat.color}">
                        <i class="${cat.icon}"></i> ${cat.name}
                    </button>
                `).join('')}
            </div>

            <!-- Main Content Grid -->
            <div class="commodity-main-grid">
                <!-- Sol: Emtia Listesi -->
                <div class="commodity-list-section">
                    <div class="list-header">
                        <div class="search-box">
                            <i class="fa-solid fa-search"></i>
                            <input type="text" placeholder="Emtia ara..." id="commodity-search">
                        </div>
                        <div class="sort-options">
                            <select id="commodity-sort">
                                <option value="name">İsim</option>
                                <option value="price">Fiyat</option>
                                <option value="change">Değişim</option>
                                <option value="volume">Hacim</option>
                            </select>
                        </div>
                    </div>
                    <div class="commodity-table">
                        <div class="table-header">
                            <div class="col-name">Emtia</div>
                            <div class="col-price">Fiyat</div>
                            <div class="col-change">24s Değişim</div>
                            <div class="col-volume">Hacim</div>
                            <div class="col-actions">İşlem</div>
                        </div>
                        <div class="table-body" id="commodity-table-body">
                            ${commodities.map(c => renderCommodityRow(c)).join('')}
                        </div>
                    </div>
                </div>

                <!-- Sağ: Market Özeti -->
                <aside class="market-summary-sidebar">
                    <div class="summary-card">
                        <h4><i class="fa-solid fa-chart-pie"></i> Market Özeti</h4>
                        <div class="summary-stats">
                            <div class="stat-row">
                                <span class="label">Toplam Emtia</span>
                                <span class="value">${commodities.length}</span>
                            </div>
                            <div class="stat-row">
                                <span class="label">Yükselenler</span>
                                <span class="value text-green">${commodities.filter(c => c.change > 0).length}</span>
                            </div>
                            <div class="stat-row">
                                <span class="label">Düşenler</span>
                                <span class="value text-red">${commodities.filter(c => c.change < 0).length}</span>
                            </div>
                            <div class="stat-row">
                                <span class="label">Toplam Hacim</span>
                                <span class="value">${(commodities.reduce((s, c) => s + c.volume, 0) / 1000000).toFixed(1)}M</span>
                            </div>
                        </div>
                    </div>

                    <!-- En Yüksek Hacim -->
                    <div class="top-volume-card">
                        <h4><i class="fa-solid fa-fire"></i> En Yüksek Hacim</h4>
                        <div class="volume-list">
                            ${commodities.sort((a, b) => b.volume - a.volume).slice(0, 5).map((c, i) => `
                                <div class="volume-item">
                                    <span class="rank">#${i + 1}</span>
                                    <i class="${c.icon}"></i>
                                    <span class="name">${c.name}</span>
                                    <span class="vol">${(c.volume / 1000).toFixed(0)}K</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Watchlist -->
                    <div class="watchlist-card">
                        <h4><i class="fa-solid fa-star"></i> İzleme Listesi</h4>
                        <p class="empty-text">Henüz emtia eklenmedi</p>
                        <button class="btn-add-watchlist">
                            <i class="fa-solid fa-plus"></i> Emtia Ekle
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    `;
}

function renderCommodityRow(commodity) {
    return `
        <div class="commodity-row" data-commodity-id="${commodity.id}">
            <div class="col-name">
                <div class="commodity-badge">
                    <i class="${commodity.icon}"></i>
                </div>
                <span>${commodity.name}</span>
            </div>
            <div class="col-price">${commodity.price.toLocaleString()} ₳</div>
            <div class="col-change ${commodity.change >= 0 ? 'positive' : 'negative'}">
                <i class="fa-solid fa-${commodity.change >= 0 ? 'caret-up' : 'caret-down'}"></i>
                ${commodity.change >= 0 ? '+' : ''}${commodity.change}%
            </div>
            <div class="col-volume">${(commodity.volume / 1000).toFixed(0)}K</div>
            <div class="col-actions">
                <button class="btn-trade buy" data-action="buy" data-commodity="${commodity.id}">
                    AL
                </button>
                <button class="btn-trade sell" data-action="sell" data-commodity="${commodity.id}">
                    SAT
                </button>
            </div>
        </div>
    `;
}

// Export for use in dashboard
export { COMMODITY_CATEGORIES, generateCommodityData };
