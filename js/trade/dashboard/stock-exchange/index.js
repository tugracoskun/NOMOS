// STOCK EXCHANGE SECTION - UI COMPONENTS
// Şirket borsası ve yatırım paneli

import { marketState, getMarketMultiplier, marketScenarios } from '../../../data/market.js';
import { resourcesList } from '../../../map/resources.js';
import { resourcesEconomics } from '../../../data/city-stats.js';

// Simüle edilmiş şirket borsası verileri
const STOCK_DATA = {
    companies: [
        { id: 'textile_corp', name: 'Tekstil A.Ş.', ticker: 'TKS', sector: 'textile', price: 1250, change: 3.5, volume: 125000, marketCap: 15000000 },
        { id: 'food_global', name: 'Gıda Global', ticker: 'GDG', sector: 'food', price: 890, change: -1.2, volume: 89000, marketCap: 8900000 },
        { id: 'tech_innovate', name: 'Tekno İnovasyon', ticker: 'TKN', sector: 'tech', price: 2450, change: 5.8, volume: 245000, marketCap: 24500000 },
        { id: 'energy_plus', name: 'Enerji Plus', ticker: 'ENP', sector: 'energy', price: 1780, change: 2.1, volume: 178000, marketCap: 17800000 },
        { id: 'mining_deep', name: 'Derin Maden', ticker: 'DMD', sector: 'mining', price: 3200, change: -0.8, volume: 320000, marketCap: 32000000 },
        { id: 'lux_brands', name: 'Lüks Markalar', ticker: 'LXM', sector: 'luxury', price: 4500, change: 1.5, volume: 45000, marketCap: 45000000 },
        { id: 'logistics_express', name: 'Express Lojistik', ticker: 'EXL', sector: 'logistics', price: 980, change: 4.2, volume: 98000, marketCap: 9800000 },
        { id: 'agro_harvest', name: 'Agro Hasat', ticker: 'AGH', sector: 'agriculture', price: 650, change: -2.5, volume: 65000, marketCap: 6500000 }
    ],
    funds: [
        { id: 'growth_fund', name: 'Büyüme Fonu', ticker: 'BYF', type: 'growth', price: 150, change: 2.8, aum: 5000000, risk: 'medium' },
        { id: 'stable_fund', name: 'Sabit Getiri', ticker: 'SGF', type: 'stable', price: 105, change: 0.5, aum: 8000000, risk: 'low' },
        { id: 'tech_fund', name: 'Teknoloji Fonu', ticker: 'TKF', type: 'sector', price: 280, change: 6.2, aum: 3000000, risk: 'high' },
        { id: 'diversified_fund', name: 'Çeşitlendirilmiş', ticker: 'DVF', type: 'diversified', price: 125, change: 1.8, aum: 12000000, risk: 'low' }
    ],
    indices: [
        { name: 'NOMOS 100', value: 12458.32, change: 1.24 },
        { name: 'Sanayi Endeksi', value: 8934.56, change: -0.87 },
        { name: 'Teknoloji Endeksi', value: 15678.90, change: 2.45 }
    ]
};

// === MAIN RENDER ===
export function renderStockExchangeSection(isWidget = false) {
    if (isWidget) {
        return renderExchangeWidget();
    }
    return renderFullExchangeView();
}

// === WIDGET VIEW ===
function renderExchangeWidget() {
    const topMovers = [...STOCK_DATA.companies].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 4);
    const mainIndex = STOCK_DATA.indices[0];

    return `
        <div class="exchange-widget-content">
            <!-- Header with Main Index -->
            <div class="exchange-widget-header">
                <div class="main-index">
                    <div class="index-header">
                        <span class="index-label">${mainIndex.name}</span>
                        <div class="market-status">
                            <span class="status-dot"></span>
                            <span>Açık</span>
                        </div>
                    </div>
                    <div class="index-value-large">${mainIndex.value.toLocaleString()}</div>
                    <div class="index-change-badge ${mainIndex.change >= 0 ? 'positive' : 'negative'}">
                        <i class="fa-solid fa-${mainIndex.change >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                        ${mainIndex.change >= 0 ? '+' : ''}${mainIndex.change}%
                    </div>
                </div>
                <div class="mini-chart-container">
                    ${renderMiniChart(mainIndex.change >= 0, 100, 50)}
                </div>
            </div>

            <!-- Index Strip -->
            <div class="index-strip">
                ${STOCK_DATA.indices.slice(1).map(index => `
                    <div class="index-mini">
                        <span class="idx-name">${index.name.split(' ')[0]}</span>
                        <span class="idx-change ${index.change >= 0 ? 'positive' : 'negative'}">
                            ${index.change >= 0 ? '+' : ''}${index.change}%
                        </span>
                    </div>
                `).join('')}
            </div>

            <!-- Top Movers Grid -->
            <div class="movers-grid">
                ${topMovers.map(stock => `
                    <div class="mover-card ${stock.change >= 0 ? 'up' : 'down'}">
                        <div class="mover-header">
                            <span class="mover-ticker">${stock.ticker}</span>
                            <span class="mover-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                                ${stock.change >= 0 ? '+' : ''}${stock.change}%
                            </span>
                        </div>
                        <div class="mover-price">${stock.price.toLocaleString()} ₳</div>
                    </div>
                `).join('')}
            </div>

            <!-- Quick Actions -->
            <div class="exchange-quick-actions">
                <button class="btn-exchange" data-action="view-exchange">
                    <i class="fa-solid fa-chart-line"></i>
                    Borsa
                </button>
                <button class="btn-exchange" data-action="view-funds">
                    <i class="fa-solid fa-coins"></i>
                    Fonlar
                </button>
                <button class="btn-exchange" data-action="portfolio">
                    <i class="fa-solid fa-wallet"></i>
                    Portföy
                </button>
            </div>
        </div>
    `;
}

// === FULL EXCHANGE VIEW ===
function renderFullExchangeView() {
    return `
        <div class="exchange-full-view">
            <!-- Exchange Header -->
            <header class="exchange-page-header">
                <div class="header-left">
                    <h1><i class="fa-solid fa-building-columns"></i> NOMOS Borsa</h1>
                    <div class="market-status open">
                        <span class="status-dot"></span>
                        Piyasa Açık
                    </div>
                </div>
                <div class="header-right">
                    <div class="portfolio-summary">
                        <span class="label">Portföy Değeri</span>
                        <span class="value text-gold">45,250 ₳</span>
                        <span class="change positive">+2.4%</span>
                    </div>
                </div>
            </header>

            <!-- Index Bar -->
            <div class="index-bar">
                ${STOCK_DATA.indices.map(index => `
                    <div class="index-card">
                        <div class="index-name">${index.name}</div>
                        <div class="index-value">${index.value.toLocaleString()}</div>
                        <div class="index-change ${index.change >= 0 ? 'positive' : 'negative'}">
                            <i class="fa-solid fa-${index.change >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                            ${index.change >= 0 ? '+' : ''}${index.change}%
                        </div>
                        ${renderMiniChart(index.change >= 0)}
                    </div>
                `).join('')}
            </div>

            <!-- Main Content -->
            <div class="exchange-content">
                <!-- Stocks Table -->
                <section class="stocks-section">
                    <div class="section-header">
                        <h2>Şirketler</h2>
                        <div class="section-controls">
                            <div class="search-box">
                                <i class="fa-solid fa-search"></i>
                                <input type="text" placeholder="Şirket ara..." id="stock-search">
                            </div>
                            <div class="filter-tabs">
                                <button class="filter-tab active" data-filter="all">Tümü</button>
                                <button class="filter-tab" data-filter="gainers">Yükselenler</button>
                                <button class="filter-tab" data-filter="losers">Düşenler</button>
                            </div>
                        </div>
                    </div>
                    <div class="stocks-table">
                        <div class="table-header">
                            <div class="col-ticker">Sembol</div>
                            <div class="col-name">Şirket</div>
                            <div class="col-price">Fiyat</div>
                            <div class="col-change">Değişim</div>
                            <div class="col-volume">Hacim</div>
                            <div class="col-mcap">Piyasa Değeri</div>
                            <div class="col-actions">İşlem</div>
                        </div>
                        <div class="table-body">
                            ${STOCK_DATA.companies.map(stock => renderStockRow(stock)).join('')}
                        </div>
                    </div>
                </section>

                <!-- Funds Section -->
                <section class="funds-section">
                    <div class="section-header">
                        <h2><i class="fa-solid fa-landmark"></i> Yatırım Fonları</h2>
                    </div>
                    <div class="funds-grid">
                        ${STOCK_DATA.funds.map(fund => renderFundCard(fund)).join('')}
                    </div>
                </section>
            </div>
        </div>
    `;
}

// === STOCK ROW ===
function renderStockRow(stock) {
    const sectorIcons = {
        textile: 'fa-shirt',
        food: 'fa-utensils',
        tech: 'fa-microchip',
        energy: 'fa-bolt',
        mining: 'fa-gem',
        luxury: 'fa-crown',
        logistics: 'fa-truck',
        agriculture: 'fa-wheat-awn'
    };

    return `
        <div class="stock-row" data-stock-id="${stock.id}">
            <div class="col-ticker">
                <div class="ticker-badge">
                    <i class="fa-solid ${sectorIcons[stock.sector] || 'fa-building'}"></i>
                    <span>${stock.ticker}</span>
                </div>
            </div>
            <div class="col-name">${stock.name}</div>
            <div class="col-price">${stock.price.toLocaleString()} ₳</div>
            <div class="col-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                <i class="fa-solid fa-${stock.change >= 0 ? 'caret-up' : 'caret-down'}"></i>
                ${stock.change >= 0 ? '+' : ''}${stock.change}%
            </div>
            <div class="col-volume">${(stock.volume / 1000).toFixed(1)}K</div>
            <div class="col-mcap">${(stock.marketCap / 1000000).toFixed(1)}M ₳</div>
            <div class="col-actions">
                <button class="btn-trade buy" data-action="buy-stock" data-stock="${stock.id}">
                    <i class="fa-solid fa-plus"></i> AL
                </button>
                <button class="btn-trade sell" data-action="sell-stock" data-stock="${stock.id}">
                    <i class="fa-solid fa-minus"></i> SAT
                </button>
            </div>
        </div>
    `;
}

// === FUND CARD ===
function renderFundCard(fund) {
    const riskColors = {
        low: '#22c55e',
        medium: '#f59e0b',
        high: '#ef4444'
    };
    const riskLabels = {
        low: 'Düşük Risk',
        medium: 'Orta Risk',
        high: 'Yüksek Risk'
    };
    const typeLabels = {
        growth: 'Büyüme',
        stable: 'Sabit Getiri',
        sector: 'Sektörel',
        diversified: 'Çeşitlendirilmiş'
    };

    return `
        <div class="fund-card" data-fund-id="${fund.id}">
            <div class="fund-header">
                <div class="fund-identity">
                    <span class="fund-ticker">${fund.ticker}</span>
                    <span class="fund-type">${typeLabels[fund.type]}</span>
                </div>
                <div class="fund-risk" style="color: ${riskColors[fund.risk]}">
                    <i class="fa-solid fa-shield-halved"></i>
                    ${riskLabels[fund.risk]}
                </div>
            </div>
            <div class="fund-name">${fund.name}</div>
            <div class="fund-stats">
                <div class="stat">
                    <span class="label">Fiyat</span>
                    <span class="value">${fund.price.toLocaleString()} ₳</span>
                </div>
                <div class="stat">
                    <span class="label">Değişim</span>
                    <span class="value ${fund.change >= 0 ? 'text-green' : 'text-red'}">
                        ${fund.change >= 0 ? '+' : ''}${fund.change}%
                    </span>
                </div>
                <div class="stat">
                    <span class="label">AUM</span>
                    <span class="value">${(fund.aum / 1000000).toFixed(1)}M ₳</span>
                </div>
            </div>
            <div class="fund-chart">
                ${renderMiniChart(fund.change >= 0, 80, 40)}
            </div>
            <div class="fund-actions">
                <button class="btn-fund primary" data-action="invest-fund" data-fund="${fund.id}">
                    <i class="fa-solid fa-coins"></i> Yatırım Yap
                </button>
                <button class="btn-fund" data-action="fund-details" data-fund="${fund.id}">
                    <i class="fa-solid fa-chart-pie"></i> Detaylar
                </button>
            </div>
        </div>
    `;
}

// === MINI CHART SVG ===
function renderMiniChart(isPositive, width = 60, height = 24) {
    const color = isPositive ? '#22c55e' : '#ef4444';
    const points = [];

    // Generate random but consistent-looking points
    let y = height / 2;
    for (let x = 0; x <= width; x += width / 10) {
        y += (Math.random() - (isPositive ? 0.3 : 0.7)) * 8;
        y = Math.max(4, Math.min(height - 4, y));
        points.push(`${x},${y}`);
    }

    // Ensure end point reflects trend
    if (isPositive) {
        points[points.length - 1] = `${width},${Math.min(y - 4, 8)}`;
    } else {
        points[points.length - 1] = `${width},${Math.max(y + 4, height - 8)}`;
    }

    return `
        <svg class="mini-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGrad_${isPositive}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <polygon 
                points="0,${height} ${points.join(' ')} ${width},${height}" 
                fill="url(#chartGrad_${isPositive})"
            />
            <polyline 
                points="${points.join(' ')}" 
                fill="none" 
                stroke="${color}" 
                stroke-width="1.5"
                stroke-linecap="round"
            />
        </svg>
    `;
}

// === EXPORT STOCK DATA FOR OTHER MODULES ===
export function getStockData() {
    return STOCK_DATA;
}

export function getStockById(stockId) {
    return STOCK_DATA.companies.find(s => s.id === stockId);
}

export function getFundById(fundId) {
    return STOCK_DATA.funds.find(f => f.id === fundId);
}
