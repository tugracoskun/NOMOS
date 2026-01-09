// TRADE PAGE HTML TEMPLATES
// Generates HTML for marketplace components

import { resourcesList } from '../map/resources.js';
import { resourcesEconomics, calculateResourceIncome } from '../data/city-stats.js';
import { getMarketMultiplier, marketScenarios, marketState } from '../data/market.js';

// === MAIN PAGE TEMPLATE ===
export function generateTradePage(tradeState, playerInventory, tradeHistory) {
    return `
        <div class="trade-page">
            ${generateMarketHeader(tradeState)}
            <div class="trade-content">
                ${generateSidebar(playerInventory, tradeHistory)}
                ${generateResourcesPanel(tradeState)}
                ${generateTradePanel(tradeState)}
            </div>
        </div>
    `;
}

// === MARKET HEADER ===
function generateMarketHeader(tradeState) {
    const totalVolume = tradeState.totalVolume || 0;
    const marketTrend = tradeState.marketTrend || 0;
    const trendClass = marketTrend > 0 ? 'positive' : marketTrend < 0 ? 'negative' : '';
    const trendSign = marketTrend > 0 ? '+' : '';

    // Check for active scenarios (any market multiplier != 1.0)
    const activeScenarios = getActiveScenarios();

    return `
        <header class="market-header">
            <div class="market-title">
                <h1><i class="fa-solid fa-store"></i> Ticaret Borsası</h1>
                <span class="subtitle">Global Kaynak Piyasası</span>
            </div>
            ${activeScenarios.length > 0 ? `
                <div class="active-scenarios">
                    ${activeScenarios.map(s => `
                        <span class="scenario-badge ${s.type}">
                            <i class="fa-solid ${getScenarioIcon(s.type)}"></i>
                            ${s.name}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
            <div class="market-stats">
                <div class="market-stat">
                    <span class="label">24s Hacim</span>
                    <span class="value">${totalVolume.toLocaleString()} Altın</span>
                </div>
                <div class="market-stat">
                    <span class="label">Piyasa Trendi</span>
                    <span class="value ${trendClass}">${trendSign}${marketTrend.toFixed(1)}%</span>
                </div>
            </div>
        </header>
    `;
}

// Helper for active scenarios
function getActiveScenarios() {
    const active = [];
    Object.entries(marketState).forEach(([resource, mult]) => {
        if (mult !== 1.0) {
            // Find which scenario affects this
            const scenario = marketScenarios.find(s => s.effects[resource] === mult);
            if (scenario && !active.find(a => a.id === scenario.id)) {
                active.push(scenario);
            }
        }
    });
    return active;
}

function getScenarioIcon(type) {
    const icons = {
        crisis: 'fa-triangle-exclamation',
        boom: 'fa-chart-line',
        surplus: 'fa-wheat-awn',
        war: 'fa-shield-halved'
    };
    return icons[type] || 'fa-bolt';
}

// === LEFT SIDEBAR ===
function generateSidebar(playerInventory, tradeHistory) {
    return `
        <aside class="trade-sidebar">
            ${generateInventoryCard(playerInventory)}
            ${generateWatchlistCard()}
            ${generateHistoryCard(tradeHistory)}
        </aside>
    `;
}

// Inventory Card
function generateInventoryCard(inventory) {
    const items = Object.entries(inventory || {});

    let content = '';
    if (items.length === 0) {
        content = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <p>Envanteriniz boş</p>
            </div>
        `;
    } else {
        content = `
            <div class="inventory-list">
                ${items.map(([name, data]) => {
            const resource = resourcesList.find(r => r.name === name);
            const icon = resource?.icon || 'fa-solid fa-cube';
            const currentPrice = getResourcePrice(name);
            const totalValue = data.quantity * currentPrice;

            return `
                        <div class="inventory-item" data-resource="${name}">
                            <div class="icon"><i class="${icon}"></i></div>
                            <div class="details">
                                <div class="name">${name}</div>
                                <div class="quantity">${data.quantity} adet</div>
                            </div>
                            <div class="value">${totalValue.toLocaleString()} ₳</div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    // Portfolio Value
    const portfolioValue = calculatePortfolioValue(inventory);

    return `
        <div class="sidebar-card">
            <div class="sidebar-card-header">
                <h3><i class="fa-solid fa-briefcase"></i> Envanterim</h3>
                <span style="color: #fbbf24; font-size: 0.75rem; font-weight: 600;">${portfolioValue.toLocaleString()} ₳</span>
            </div>
            <div class="sidebar-card-content">
                ${content}
            </div>
        </div>
    `;
}

// Watchlist Card
function generateWatchlistCard() {
    // Static watchlist for now
    const watchlist = ['Petrol', 'Altın', 'Demir', 'Buğday'];

    return `
        <div class="sidebar-card">
            <div class="sidebar-card-header">
                <h3><i class="fa-solid fa-star"></i> İzleme Listesi</h3>
            </div>
            <div class="sidebar-card-content">
                <div class="inventory-list">
                    ${watchlist.map(name => {
        const resource = resourcesList.find(r => r.name === name);
        const icon = resource?.icon || 'fa-solid fa-cube';
        const price = getResourcePrice(name);
        const change = getRandomPriceChange();
        const changeClass = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

        return `
                            <div class="inventory-item" data-resource="${name}">
                                <div class="icon"><i class="${icon}"></i></div>
                                <div class="details">
                                    <div class="name">${name}</div>
                                </div>
                                <div class="value">
                                    <div style="color: white;">${price.toLocaleString()} ₳</div>
                                    <div class="price-change ${changeClass}" style="font-size: 0.6rem;">${change > 0 ? '+' : ''}${change.toFixed(1)}%</div>
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// Trade History Card
function generateHistoryCard(history) {
    const recentHistory = (history || []).slice(-5).reverse();

    let content = '';
    if (recentHistory.length === 0) {
        content = `
            <div class="empty-state">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <p>Henüz işlem yok</p>
            </div>
        `;
    } else {
        content = `
            <div class="trade-history-list">
                ${recentHistory.map(tx => `
                    <div class="history-item">
                        <span class="type ${tx.type}">${tx.type === 'buy' ? 'AL' : 'SAT'}</span>
                        <div class="details">
                            <span class="resource">${tx.resource}</span>
                            <span class="quantity">x${tx.quantity}</span>
                        </div>
                        <span class="total">${tx.total.toLocaleString()} ₳</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return `
        <div class="sidebar-card">
            <div class="sidebar-card-header">
                <h3><i class="fa-solid fa-clock-rotate-left"></i> Son İşlemler</h3>
            </div>
            <div class="sidebar-card-content">
                ${content}
            </div>
        </div>
    `;
}

// === RESOURCES PANEL (Center) ===
function generateResourcesPanel(tradeState) {
    const categories = {
        all: 'Tümü',
        strategic: 'Stratejik',
        industrial: 'Endüstriyel',
        agricultural: 'Tarımsal'
    };

    const activeCategory = tradeState.activeCategory || 'all';
    const searchQuery = tradeState.searchQuery || '';

    return `
        <main class="resources-panel">
            <div class="resources-header">
                <h2>Kaynak Piyasası</h2>
                <div class="category-tabs">
                    ${Object.entries(categories).map(([key, label]) => `
                        <button class="category-tab ${activeCategory === key ? 'active' : ''}" data-category="${key}">
                            ${label}
                        </button>
                    `).join('')}
                </div>
                <div class="resources-search">
                    <i class="fa-solid fa-search"></i>
                    <input type="text" placeholder="Kaynak ara..." id="resource-search" value="${searchQuery}">
                </div>
            </div>
            <div class="resources-grid" id="resources-grid">
                ${generateResourceCards(activeCategory, searchQuery, tradeState.selectedResource)}
            </div>
        </main>
    `;
}

// Generate Resource Cards
function generateResourceCards(category, searchQuery, selectedResource) {
    let filteredResources = [...resourcesList];

    // Filter by search
    if (searchQuery) {
        filteredResources = filteredResources.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by category (simplified)
    if (category === 'strategic') {
        const strategicNames = ['Petrol', 'Doğalgaz', 'Uranyum', 'Altın', 'Lityum', 'Titanyum'];
        filteredResources = filteredResources.filter(r => strategicNames.includes(r.name));
    } else if (category === 'industrial') {
        const industrialNames = ['Demir', 'Çelik', 'Bakır', 'Alüminyum', 'Kömür', 'Kauçuk'];
        filteredResources = filteredResources.filter(r => industrialNames.includes(r.name));
    } else if (category === 'agricultural') {
        const agriNames = ['Buğday', 'Mısır', 'Pamuk', 'Zeytin', 'Şarap', 'Tütün', 'Kahve', 'Çay'];
        filteredResources = filteredResources.filter(r => agriNames.includes(r.name));
    }

    return filteredResources.map(resource => {
        const price = getResourcePrice(resource.name);
        const change = getPriceChange(resource.name);
        const changeClass = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
        const isSelected = selectedResource === resource.name;
        const sparklineSvg = generateSparklineSVG(resource.name, change > 0);

        return `
            <div class="resource-card ${isSelected ? 'selected' : ''}" data-resource="${resource.name}">
                <div class="resource-card-header">
                    <div class="resource-icon"><i class="${resource.icon}"></i></div>
                    <div>
                        <div class="resource-name">${resource.name}</div>
                        <div class="resource-category">${getCategoryLabel(resource.name)}</div>
                    </div>
                </div>
                <div class="resource-price">
                    <span class="price-current">${price.toLocaleString()} ₳</span>
                    <span class="price-change ${changeClass}">${change > 0 ? '+' : ''}${change.toFixed(1)}%</span>
                </div>
                <div class="sparkline">
                    ${sparklineSvg}
                </div>
                <div class="resource-quick-actions">
                    <button class="quick-btn buy" data-action="quick-buy" data-resource="${resource.name}">AL</button>
                    <button class="quick-btn sell" data-action="quick-sell" data-resource="${resource.name}">SAT</button>
                </div>
            </div>
        `;
    }).join('');
}

// === TRADE PANEL (Right) ===
function generateTradePanel(tradeState) {
    const selectedResource = tradeState.selectedResource || null;
    const quantity = tradeState.quantity || 1;

    return `
        <aside class="trade-panel">
            ${generateTradeCard(selectedResource, quantity)}
            ${generateQuickStatsCard()}
        </aside>
    `;
}

// Trade Execution Card
function generateTradeCard(selectedResource, quantity) {
    if (!selectedResource) {
        return `
            <div class="trade-card">
                <div class="trade-card-header">
                    <i class="fa-solid fa-exchange-alt" style="color: #60a5fa;"></i>
                    <h3>İşlem Yap</h3>
                </div>
                <div class="trade-card-content">
                    <div class="empty-state">
                        <i class="fa-solid fa-hand-pointer"></i>
                        <p>İşlem yapmak için bir kaynak seçin</p>
                    </div>
                </div>
            </div>
        `;
    }

    const resource = resourcesList.find(r => r.name === selectedResource);
    const price = getResourcePrice(selectedResource);
    const total = price * quantity;

    return `
        <div class="trade-card">
            <div class="trade-card-header">
                <i class="fa-solid fa-exchange-alt" style="color: #60a5fa;"></i>
                <h3>İşlem Yap</h3>
            </div>
            <div class="trade-card-content">
                <div class="selected-resource">
                    <div class="icon"><i class="${resource?.icon || 'fa-solid fa-cube'}"></i></div>
                    <div class="info">
                        <div class="name">${selectedResource}</div>
                        <div class="price">${price.toLocaleString()} ₳ / adet</div>
                    </div>
                </div>

                <div class="trade-form">
                    <div class="form-group">
                        <label>Miktar</label>
                        <div class="quantity-input">
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <input type="number" id="trade-quantity" value="${quantity}" min="1" max="1000">
                            <button class="quantity-btn" data-action="increase">+</button>
                        </div>
                    </div>

                    <div class="order-summary">
                        <div class="summary-row">
                            <span class="label">Birim Fiyat</span>
                            <span class="value">${price.toLocaleString()} ₳</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Miktar</span>
                            <span class="value">x${quantity}</span>
                        </div>
                        <div class="summary-row total">
                            <span class="label">Toplam</span>
                            <span class="value">${total.toLocaleString()} ₳</span>
                        </div>
                    </div>

                    <div class="trade-buttons">
                        <button class="trade-btn buy" data-action="execute-buy">
                            <i class="fa-solid fa-cart-plus"></i> AL
                        </button>
                        <button class="trade-btn sell" data-action="execute-sell">
                            <i class="fa-solid fa-hand-holding-dollar"></i> SAT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Quick Stats Card
function generateQuickStatsCard() {
    return `
        <div class="sidebar-card">
            <div class="sidebar-card-header">
                <h3><i class="fa-solid fa-chart-line"></i> Piyasa Özeti</h3>
            </div>
            <div class="sidebar-card-content">
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                        <span style="color: #94a3b8;">En Çok Yükselen</span>
                        <span style="color: #22c55e;">Petrol +12.5%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                        <span style="color: #94a3b8;">En Çok Düşen</span>
                        <span style="color: #ef4444;">Buğday -8.2%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                        <span style="color: #94a3b8;">En Çok İşlem</span>
                        <span style="color: #60a5fa;">Altın 2.5K</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// === HELPER FUNCTIONS ===

function getResourcePrice(name) {
    const economics = resourcesEconomics[name];
    const multiplier = getMarketMultiplier(name);
    if (economics) {
        return Math.round(economics.baseValue * multiplier);
    }
    // Fallback for resources not in economics
    const index = resourcesList.findIndex(r => r.name === name);
    return Math.round(200 + (index * 15) * multiplier);
}

// Seeded price change (consistent per resource)
function getPriceChange(resourceName) {
    const seed = hashString(resourceName);
    return ((seed % 200) - 100) / 10; // -10 to +10
}

// Generate SVG sparkline chart
function generateSparklineSVG(resourceName, isPositive) {
    const seed = hashString(resourceName);
    const points = [];
    const width = 140;
    const height = 28;
    const numPoints = 12;

    // Generate seeded random points
    let value = 50;
    for (let i = 0; i < numPoints; i++) {
        const change = ((seed * (i + 1)) % 30) - 15;
        value = Math.max(10, Math.min(90, value + change));
        const x = (i / (numPoints - 1)) * width;
        const y = height - (value / 100) * height;
        points.push(`${x},${y}`);
    }

    const color = isPositive ? '#22c55e' : '#ef4444';
    const gradientId = `grad_${seed}`;

    return `
        <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
            <defs>
                <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
                </linearGradient>
            </defs>
            <polygon 
                points="0,${height} ${points.join(' ')} ${width},${height}" 
                fill="url(#${gradientId})" 
            />
            <polyline 
                points="${points.join(' ')}" 
                fill="none" 
                stroke="${color}" 
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    `;
}

// Simple string hash for consistent seeding
function hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return Math.abs(hash);
}

function getRandomPriceChange() {
    // Simulated change for display
    return (Math.random() - 0.5) * 20;
}

function getCategoryLabel(resourceName) {
    const strategic = ['Petrol', 'Doğalgaz', 'Uranyum', 'Altın', 'Lityum', 'Titanyum'];
    const industrial = ['Demir', 'Çelik', 'Bakır', 'Alüminyum', 'Kömür', 'Kauçuk'];
    const agricultural = ['Buğday', 'Mısır', 'Pamuk', 'Zeytin', 'Şarap', 'Tütün'];

    if (strategic.includes(resourceName)) return 'Stratejik';
    if (industrial.includes(resourceName)) return 'Endüstriyel';
    if (agricultural.includes(resourceName)) return 'Tarımsal';
    return 'Diğer';
}

function calculatePortfolioValue(inventory) {
    if (!inventory) return 0;
    return Object.entries(inventory).reduce((total, [name, data]) => {
        return total + (data.quantity * getResourcePrice(name));
    }, 0);
}

// Export helper for external use
export { getResourcePrice, calculatePortfolioValue };
