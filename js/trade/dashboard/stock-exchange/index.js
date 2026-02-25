// STOCK EXCHANGE SECTION - UI COMPONENTS
// Şirket borsası ve yatırım paneli

import { marketState, getMarketMultiplier, marketScenarios } from '../../../data/market.js';
import { resourcesList } from '../../../map/resources.js';
import { resourcesEconomics } from '../../../data/city-stats.js';

export const PORTFOLIO_STATS = {
    total: 45250.00,
    change: 2.4,
    holdings: [
        { ticker: 'TKN', qty: 500, change: 5.8 },
        { ticker: 'ENP', qty: 200, change: 2.1 },
        { ticker: 'GDG', qty: 350, change: -1.2 },
        { ticker: 'BYF', qty: 10, change: 2.8 },
        { ticker: 'LXM', qty: 50, change: 1.5 }
    ]
};

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
        {
            id: 'growth_fund', name: 'Büyüme Fonu', ticker: 'BYF', type: 'growth', price: 150, change: 2.8, aum: 5000000, risk: 'medium',
            distribution: { 'Hisse Senedi': 65, 'Tahvil': 15, 'Emtia': 10, 'Kripto': 5, 'Nakit': 5 }
        },
        {
            id: 'stable_fund', name: 'Sabit Getiri', ticker: 'SGF', type: 'stable', price: 105, change: 0.5, aum: 8000000, risk: 'low',
            distribution: { 'Hisse Senedi': 10, 'Tahvil': 70, 'Emtia': 5, 'Kripto': 0, 'Nakit': 15 }
        },
        {
            id: 'tech_fund', name: 'Teknoloji Fonu', ticker: 'TKF', type: 'sector', price: 280, change: 6.2, aum: 3000000, risk: 'high',
            distribution: { 'Hisse Senedi': 85, 'Tahvil': 5, 'Emtia': 0, 'Kripto': 5, 'Nakit': 5 }
        },
        {
            id: 'diversified_fund', name: 'Çeşitlendirilmiş', ticker: 'DVF', type: 'diversified', price: 125, change: 1.8, aum: 12000000, risk: 'low',
            distribution: { 'Hisse Senedi': 35, 'Tahvil': 35, 'Emtia': 20, 'Kripto': 2, 'Nakit': 8 }
        }
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
            <!-- Header with Main Index and Sparkline -->
            <div class="exchange-widget-header-v2">
                <div class="index-info-box">
                    <div class="index-name-row">
                        <span class="index-label">${mainIndex.name}</span>
                        <span class="status-indicator open">AÇIK</span>
                    </div>
                    <div class="index-price-row">
                        <span class="value-large">${mainIndex.value.toLocaleString()}</span>
                        <span class="change-tag ${mainIndex.change >= 0 ? 'positive' : 'negative'}">
                            <i class="fa-solid fa-${mainIndex.change >= 0 ? 'arrow-up' : 'arrow-down'}"></i> ${mainIndex.change >= 0 ? '+' : ''}${mainIndex.change}%
                        </span>
                    </div>
                </div>
                <div class="index-sparkline">
                    <svg viewBox="0 0 100 40">
                        <path d="M0 35 L10 32 L20 38 L30 25 L40 28 L50 15 L60 22 L70 10 L80 18 L90 5 L100 12" fill="none" stroke="#22d3ee" stroke-width="1.5" />
                    </svg>
                </div>
            </div>

            <!-- Top Movers Grid (2 Columns) -->
            <div class="top-movers-grid">
                ${topMovers.map(stock => `
                    <div class="mover-grid-item">
                        <div class="mover-top">
                            <span class="ticker">${stock.ticker}</span>
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
                <button class="btn-exchange" data-action="view-world-stocks">
                    <i class="fa-solid fa-globe"></i>
                    Dünya Hisseleri
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
                    <h1><i class="fa-solid fa-chart-line"></i> NOMOS Borsa</h1>
                    <div class="market-status open">
                        <span class="status-dot"></span>
                        <span class="status-text">PİYAŞA AÇIK</span>
                    </div>
                </div>
                <div class="header-center">
                    <!-- Navigation Tabs -->
                    <div class="exchange-nav-tabs">
                        <button class="exchange-nav-btn active" data-view="overview">
                            <i class="fa-solid fa-gauge-high"></i>
                            <span>Genel</span>
                        </button>
                        <button class="exchange-nav-btn" data-view="chart">
                            <i class="fa-solid fa-chart-line"></i>
                            <span>Grafik</span>
                        </button>
                        <button class="exchange-nav-btn" data-view="funds">
                            <i class="fa-solid fa-coins"></i>
                            <span>Fonlar</span>
                        </button>
                        <button class="exchange-nav-btn" data-view="world-stocks">
                            <i class="fa-solid fa-globe"></i>
                            <span>Dünya Hisseleri</span>
                        </button>
                    </div>
                </div>
                <div class="header-right">
                    <div class="header-actions">
                        <button class="btn-icon-header" title="Alarm Kur"><i class="fa-solid fa-bell"></i></button>
                        <button class="btn-icon-header" title="Ayarlar"><i class="fa-solid fa-gear"></i></button>
                    </div>
                    <div class="portfolio-summary-compact">
                        <div class="label">PORTFÖY</div>
                        <div class="val-group">
                            <span class="value">${PORTFOLIO_STATS.total.toLocaleString()} ₳</span>
                            <span class="change positive">+${PORTFOLIO_STATS.change}%</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Layout with Views -->
            <div class="exchange-main-layout">
                <!-- Sol Panel: İçerik Görünümleri -->
                <div class="exchange-left-panel">
                    
                    <!-- VIEW: Overview (General Dashboard) -->
                    <div class="exchange-view-panel active" id="view-overview">
                        <div class="exchange-dashboard-grid">
                            <div class="dashboard-top-row">
                                <div class="consolidated-trade-tabs widget-card">
                                    <div class="tabs-navigation">
                                        <button class="trade-sub-tab active" data-sub-tab="investments">
                                            <i class="fa-solid fa-clock-rotate-left"></i> Son Yatırımlar
                                        </button>
                                        <button class="trade-sub-tab" data-sub-tab="agreements">
                                            <i class="fa-solid fa-handshake"></i> Ticari Antlaşmalar
                                        </button>
                                        <button class="trade-sub-tab" data-sub-tab="economies">
                                            <i class="fa-solid fa-globe"></i> Ülke Ekonomileri
                                        </button>
                                    </div>
                                    <div class="tabs-content">
                                        <div class="tab-pane active" id="pane-investments">
                                            ${renderRecentInvestments()}
                                        </div>
                                        <div class="tab-pane" id="pane-agreements">
                                            ${renderTradeAgreements()}
                                        </div>
                                        <div class="tab-pane" id="pane-economies">
                                            ${renderCountryEconomies()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="dashboard-indices-row">
                                <div class="indices-container-premium">
                                    <div class="indices-header">
                                        <div class="title-with-desc">
                                            <h3>Piyasa Endeksleri</h3>
                                            <p>Küresel piyasaların anlık performans verileri</p>
                                        </div>
                                        <div class="market-badge">
                                            <span class="dot pulse"></span>
                                            CANLI PİYASA
                                        </div>
                                    </div>
                                    <div class="indices-grid-modern">
                                        ${STOCK_DATA.indices.map(index => `
                                            <div class="premium-index-card ${index.change >= 0 ? 'bullish' : 'bearish'}">
                                                <div class="glass-reflection"></div>
                                                <div class="card-content">
                                                    <div class="card-top">
                                                        <span class="index-ticker">${index.name}</span>
                                                        <span class="index-badge">GLOBAL</span>
                                                    </div>
                                                    <div class="card-middle">
                                                        <div class="index-value-container">
                                                            <span class="current-value">${index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                            <div class="change-info">
                                                                <i class="fa-solid fa-arrow-${index.change >= 0 ? 'up-right' : 'down-left'}"></i>
                                                                <span>${index.change >= 0 ? '+' : ''}${index.change}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="card-bottom">
                                                        <div class="index-visual">
                                                            <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                                <path d="M0,35 Q15,${30 - index.change * 5} 30,${35 + index.change * 3} T60,${30 - index.change * 2} T100,25" 
                                                                      fill="none" stroke="url(#indexGrad_${index.name.replace(/\s+/g, '')})" stroke-width="2.5" stroke-linecap="round"/>
                                                                <defs>
                                                                    <linearGradient id="indexGrad_${index.name.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                        <stop offset="0%" stop-color="${index.change >= 0 ? '#4ade80' : '#f87171'}" stop-opacity="0.3"/>
                                                                        <stop offset="100%" stop-color="${index.change >= 0 ? '#4ade80' : '#f87171'}" stop-opacity="1"/>
                                                                    </linearGradient>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- VIEW: Chart -->
                    <div class="exchange-view-panel" id="view-chart">
                        <div class="tv-chart-main-layout">
                            <div class="tv-chart-container">
                                <div class="chart-header">
                                    <div class="chart-symbol">
                                        <div class="symbol-box">
                                            <span class="symbol">NOMOS 100</span>
                                            <span class="market">INDEX</span>
                                        </div>
                                        <div class="price-box">
                                            <span class="price">12,458.32</span>
                                            <span class="change positive">+1.34%</span>
                                        </div>
                                    </div>
                                    <div class="chart-controls-group">
                                        <div class="chart-type-selector">
                                            <button class="chart-tool-btn active" data-chart-type="candle" title="Mum Grafiği">
                                                <i class="fa-solid fa-chart-candlestick"></i>
                                            </button>
                                            <button class="chart-tool-btn" data-chart-type="line" title="Çizgi Grafiği">
                                                <i class="fa-solid fa-chart-line"></i>
                                            </button>
                                        </div>
                                        <div class="divider"></div>
                                        <div class="zoom-controls">
                                            <button class="chart-tool-btn" id="btn-zoom-in" title="Yakınlaştır"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                                            <button class="chart-tool-btn" id="btn-zoom-out" title="Uzaklaştır"><i class="fa-solid fa-magnifying-glass-minus"></i></button>
                                            <button class="chart-tool-btn" id="btn-zoom-reset" title="Sıfırla"><i class="fa-solid fa-arrows-rotate"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="chart-area" id="chart-main-area">
                                    <div class="zoom-hint">Fare tekerleği ile yakınlaştırın</div>
                                    ${renderAdvancedChart()}
                                </div>
                                <div class="chart-bottom-info">
                                    <div class="chart-stats-mini">
                                        <div class="mini-stat"><span>YÜK:</span> <span class="v text-green">12,520</span></div>
                                        <div class="mini-stat"><span>DÜŞ:</span> <span class="v text-red">12,195</span></div>
                                        <div class="mini-stat"><span>HAC:</span> <span class="v">2.44M</span></div>
                                    </div>
                                    <div class="chart-timeframes-bottom">
                                        <button class="tf-btn" data-tf="15m">15dk</button>
                                        <button class="tf-btn" data-tf="1h">1sa</button>
                                        <button class="tf-btn active" data-tf="4h">4sa</button>
                                        <button class="tf-btn" data-tf="1d">1G</button>
                                        <button class="tf-btn" data-tf="1w">1H</button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Chart Sidebar (Right) -->
                            <div class="chart-sidebar">
                                <div class="sidebar-section">
                                    <h4><i class="fa-solid fa-list-ul"></i> İzleme Listesi</h4>
                                    <div class="watch-list" id="tv-watch-list">
                                        <div class="watch-item">
                                            <span class="w-symbol">TKS</span>
                                            <span class="w-price">1,250</span>
                                            <span class="w-change positive">+3.5%</span>
                                        </div>
                                        <div class="watch-item">
                                            <span class="w-symbol">TKN</span>
                                            <span class="w-price">2,450</span>
                                            <span class="w-change positive">+5.8%</span>
                                        </div>
                                        <div class="watch-item">
                                            <span class="w-symbol">ENP</span>
                                            <span class="w-price">1,780</span>
                                            <span class="w-change negative">-0.4%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="sidebar-section">
                                    <div class="section-title-row">
                                        <h4><i class="fa-solid fa-bell"></i> Alarmlar</h4>
                                        <button class="btn-sidebar-add" id="btn-create-alert"><i class="fa-solid fa-plus"></i></button>
                                    </div>
                                    <div class="alert-list" id="tv-alert-list">
                                        <div class="no-alerts">Aktif alarm bulunmuyor.</div>
                                    </div>
                                </div>
                                <div class="sidebar-section filler">
                                    <h4><i class="fa-solid fa-circle-info"></i> Detaylar</h4>
                                    <div class="selection-details">
                                        <p class="desc">Grafik üzerinde bir nokta seçerek veri detaylarını burada görebilirsiniz.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- VIEW: Funds -->
                    <div class="exchange-view-panel" id="view-funds">
                        <section class="funds-section">
                            <div class="section-header">
                                <h2>Yatırım Fonları</h2>
                                <div class="section-controls">
                                    <div class="filter-tabs">
                                        <button class="filter-tab active" data-filter="all">Tümü</button>
                                        <button class="filter-tab" data-filter="low">Düşük Risk</button>
                                        <button class="filter-tab" data-filter="medium">Orta Risk</button>
                                        <button class="filter-tab" data-filter="high">Yüksek Risk</button>
                                    </div>
                                </div>
                            </div>
                            <div class="funds-grid">
                                ${STOCK_DATA.funds.map(fund => renderFundCard(fund)).join('')}
                            </div>
                        </section>
                    </div>

                    <!-- VIEW: World Stocks -->
                    <div class="exchange-view-panel" id="view-world-stocks">
                        <section class="world-stocks-section">
                            <div class="section-header">
                                <h2><i class="fa-solid fa-globe" style="color:#60a5fa;margin-right:8px;"></i>Dünya Hisseleri</h2>
                                <div class="section-controls">
                                    <input type="text" class="search-input" placeholder="Şirket ara..." id="world-stock-search">
                                    <div class="filter-tabs">
                                        <button class="filter-tab active" data-filter="all">Tümü</button>
                                        <button class="filter-tab" data-filter="giants">Piyasa Devleri</button>
                                        <button class="filter-tab" data-filter="trendy">Popüler</button>
                                        <button class="filter-tab" data-filter="trendy">Popüler</button>
                                        <button class="filter-tab" data-filter="newcomers">Yeniler</button>
                                    </div>
                                </div>
                            </div>
                            <div class="stocks-table world-stocks-table">
                                <div class="table-header">
                                    <div class="col-ticker">Sembol</div>
                                    <div class="col-name">Şirket</div>
                                    <div class="col-price">Fiyat</div>
                                    <div class="col-change">Değişim</div>
                                    <div class="col-mcap">Piyasa Değeri</div>
                                    <div class="col-country">Ülke</div>
                                    <div class="col-actions">İşlem</div>
                                </div>
                                <div class="table-body" id="world-stocks-table-body">
                                    ${renderWorldStocks()}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                </div>
            </div>
        </div>
    `;
}

// Setup exchange view navigation
export function setupExchangeViewNav() {
    const navBtns = document.querySelectorAll('.exchange-nav-btn');
    const viewPanels = document.querySelectorAll('.exchange-view-panel');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewId = btn.dataset.view;

            // Update active button
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show corresponding view
            viewPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `view-${viewId}`) {
                    panel.classList.add('active');
                }
            });

            // Reinitialize chart if switching to chart view
            if (viewId === 'chart') {
                setTimeout(() => initInteractiveChart(), 50);
            }

            // Setup fund events if switching to funds view
            if (viewId === 'funds') {
                setTimeout(() => setupFundEvents(), 50);
            }
        });
    });

    // Initialize specific view event handlers
    setupWorldStockFilters();
    setupFundEvents(); // Initial load
    setupSubTabs(); // Handle sub-tabs in overview
}

// === CONSOLIDATED SUB-TABS HANDLER ===
function setupSubTabs() {
    const navButtons = document.querySelectorAll('.trade-sub-tab');
    const panes = document.querySelectorAll('.tab-pane');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.subTab;

            // Remove active from all btns
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show active pane
            panes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${targetId}`) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

// === FUND EVENTS HANDLER ===
function setupFundEvents() {
    const exchangeView = document.querySelector('.exchange-full-view');
    if (!exchangeView) return;

    exchangeView.addEventListener('click', (e) => {
        const card = e.target.closest('.fund-card');
        if (card) {
            const actionBtn = e.target.closest('[data-action]');
            const fundId = card.dataset.fundId;
            const fund = STOCK_DATA.funds.find(f => f.id === fundId);

            if (fund) {
                if (actionBtn) {
                    const action = actionBtn.dataset.action;
                    if (action === 'invest-fund') {
                        e.stopPropagation();
                        alert(`${fund.name} fonuna yatırım ekranı (Yakında)`);
                    } else if (action === 'fund-details') {
                        e.stopPropagation();
                        showFundDetailsModal(fund);
                    }
                } else {
                    showFundDetailsModal(fund);
                }
            }
        }

        const filterTab = e.target.closest('.filter-tab:not(.search-input)');
        if (filterTab) {
            const filter = filterTab.dataset.filter;
            const allTabs = exchangeView.querySelectorAll('.filter-tab');
            allTabs.forEach(t => t.classList.remove('active'));
            filterTab.classList.add('active');
            applyFundFilter(filter);
        }
    });
}

function handleFundClick(e) {
    const card = e.target.closest('.fund-card');
    const actionBtn = e.target.closest('[data-action]');

    if (!card) return;

    const fundId = card.dataset.fundId;
    const fund = STOCK_DATA.funds.find(f => f.id === fundId);

    if (!fund) return;

    if (actionBtn) {
        const action = actionBtn.dataset.action;
        if (action === 'invest-fund') {
            alert(`${fund.name} fonuna yatırım ekranı (Yakında)`);
        } else if (action === 'fund-details') {
            showFundDetailsModal(fund);
        }
    } else {
        // Kartın geneline tıklandığında detayları aç
        showFundDetailsModal(fund);
    }
}

function applyFundFilter(filter) {
    const cards = document.querySelectorAll('.fund-card');
    cards.forEach(card => {
        const fundId = card.dataset.fundId;
        const fund = STOCK_DATA.funds.find(f => f.id === fundId);
        if (filter === 'all' || fund.risk === filter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function showFundDetailsModal(fund) {
    const modalHTML = `
        <div class="modal-overlay active" id="fund-details-modal">
            <div class="modal-container detail-modal">
                <div class="modal-header">
                    <div class="header-main-info">
                        <div class="fund-ticker-box">${fund.ticker}</div>
                        <div class="header-texts">
                            <h2>${fund.name}</h2>
                            <span class="sector-badge">Yatırım Fonu</span>
                        </div>
                    </div>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="detail-content-grid">
                        <div class="detail-visual">
                            <div class="large-radar-container">
                                <h4 class="visual-title">Fon Varlık Dağılımı</h4>
                                ${renderFundRadar(fund.distribution)}
                            </div>
                        </div>
                        <div class="detail-stats-panel">
                            <div class="detail-stat-row">
                                <span class="lbl">Birim Fiyat:</span>
                                <span class="val text-gold">${fund.price.toLocaleString()} ₳</span>
                            </div>
                            <div class="detail-stat-row">
                                <span class="lbl">Günlük Değişim:</span>
                                <span class="val ${fund.change >= 0 ? 'text-green' : 'text-red'}">
                                    ${fund.change >= 0 ? '+' : ''}${fund.change}%
                                </span>
                            </div>
                            <div class="detail-stat-row">
                                <span class="lbl">Yönetilen Varlık (AUM):</span>
                                <span class="val">${(fund.aum / 1000000).toFixed(1)}M ₳</span>
                            </div>
                            <div class="finance-risk-card">
                                <div class="risk-info">
                                    <span class="risk-title">Risk Seviyesi</span>
                                    <span class="risk-score-val risk-${fund.risk}">${fund.risk === 'high' ? 'Yüksek' : fund.risk === 'medium' ? 'Orta' : 'Düşük'}</span>
                                </div>
                                <p style="font-size:0.7rem; color:var(--text-muted); margin:0;">
                                    Bu fon, piyasa koşullarına göre varlık dağılımını optimize eder.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal secondary" onclick="this.closest('.modal-overlay').remove()">Kapat</button>
                    <button class="btn-modal primary">
                        <i class="fa-solid fa-coins"></i> Yatırım Yap
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// === RENDER FUND RADAR CHART (SVG) ===
function renderFundRadar(distribution) {
    if (!distribution) return '';

    const size = 150;
    const center = size / 2;
    const radius = size * 0.35;
    const keys = Object.keys(distribution);
    const count = keys.length;

    const points = keys.map((key, i) => {
        const val = distribution[key];
        const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
        const x = center + (radius * val / 100) * Math.cos(angle);
        const y = center + (radius * val / 100) * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    const webPaths = [0.2, 0.4, 0.6, 0.8, 1].map(r => {
        let p = "";
        for (let i = 0; i <= count; i++) {
            const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
            const x = center + (radius * r) * Math.cos(angle);
            const y = center + (radius * r) * Math.sin(angle);
            p += (i === 0 ? "M" : "L") + x + "," + y;
        }
        return `<path d="${p}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
    }).join('');

    return `
        <div class="fund-radar-container-big">
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                ${webPaths}
                <polygon points="${points}" fill="rgba(59, 130, 246, 0.2)" stroke="var(--accent-blue)" stroke-width="2"/>
                ${keys.map((key, i) => {
        const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
        const x = center + (radius + 20) * Math.cos(angle);
        const y = center + (radius + 20) * Math.sin(angle);
        return `<text x="${x}" y="${y}" font-size="8" fill="var(--text-muted)" text-anchor="middle" dominant-baseline="middle">${key.substring(0, 5)}</text>`;
    }).join('')}
            </svg>
            <div class="fund-summary-list-big">
                ${keys.map(key => `
                    <div class="fund-summary-item">
                        <span class="dot"></span>
                        <span class="label">${key}</span>
                        <span class="val">%${distribution[key]}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Dünya hisseleri için filtreleme ve arama olaylarını ayarlar
 */
function setupWorldStockFilters() {
    const filterTabs = document.querySelectorAll('.world-stocks-section .filter-tab');
    const searchInput = document.getElementById('world-stock-search');
    const rows = document.querySelectorAll('.world-stock-row');

    const applyFilters = () => {
        const activeFilter = document.querySelector('.world-stocks-section .filter-tab.active')?.dataset.filter || 'all';
        const searchTerm = searchInput?.value.toLowerCase() || '';

        rows.forEach(row => {
            const category = row.dataset.category;
            const ticker = row.querySelector('.ticker-badge')?.textContent.toLowerCase() || '';
            const name = row.querySelector('.stock-company-name')?.textContent.toLowerCase() || '';

            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = ticker.includes(searchTerm) || name.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                row.style.display = 'grid';
            } else {
                row.style.display = 'none';
            }
        });
    };

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

// === ADVANCED CHART (TradingView Style - Interactive Canvas) ===
function renderAdvancedChart() {
    // Return HTML with canvas element - chart will be drawn after render
    return `
        <div class="tv-chart-wrapper" id="tv-chart-wrapper">
            <canvas id="tv-chart-canvas" class="tv-chart-canvas"></canvas>
            <div class="tv-chart-tooltip" id="tv-chart-tooltip" style="display: none;"></div>
            <div class="tv-chart-crosshair-x" id="tv-crosshair-x"></div>
            <div class="tv-chart-crosshair-y" id="tv-crosshair-y"></div>
            <div class="tv-price-label" id="tv-price-label"></div>
        </div>
    `;
}

// Initialize the interactive chart after DOM is ready
let currentChartType = 'candle';
let currentTimeframe = '4h';
let currentZoom = 1.0;

export function initInteractiveChart() {
    setupChartEvents();
    renderMainChart();
}

function setupChartEvents() {
    const chartView = document.getElementById('view-chart');
    if (!chartView || chartView.dataset.eventsSetup) return;

    // Timeframe Buttons (Now at the bottom)
    chartView.querySelectorAll('.tf-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            chartView.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTimeframe = btn.dataset.tf;
            renderMainChart();
        });
    });

    // Chart Type Buttons
    chartView.querySelectorAll('.chart-tool-btn[data-chart-type]').forEach(btn => {
        btn.addEventListener('click', () => {
            chartView.querySelectorAll('.chart-tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentChartType = btn.dataset.chartType; // Fix: Use camelCase for data-chart-type
            renderMainChart();
        });
    });

    // Zoom Controls
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomReset = document.getElementById('btn-zoom-reset');
    const chartArea = document.getElementById('chart-main-area');

    if (btnZoomIn) btnZoomIn.addEventListener('click', () => { currentZoom = Math.min(5, currentZoom * 1.2); renderMainChart(); });
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => { currentZoom = Math.max(0.2, currentZoom / 1.2); renderMainChart(); });
    if (btnZoomReset) btnZoomReset.addEventListener('click', () => { currentZoom = 1.0; renderMainChart(); });

    // Wheel Zoom
    if (chartArea) {
        chartArea.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.1;
            if (e.deltaY < 0) currentZoom = Math.min(5, currentZoom + zoomSpeed);
            else currentZoom = Math.max(0.2, currentZoom - zoomSpeed);
            renderMainChart();
        }, { passive: false });
    }

    // Alert Creation
    const btnAlert = document.getElementById('btn-create-alert');
    if (btnAlert) {
        btnAlert.addEventListener('click', () => {
            const price = prompt("Alarm kurmak istediğiniz fiyat seviyesini girin:", "12450");
            if (price) addAlertToList(parseFloat(price));
        });
    }

    chartView.dataset.eventsSetup = "true";
}

function addAlertToList(price) {
    const list = document.getElementById('tv-alert-list');
    if (list.querySelector('.no-alerts')) list.innerHTML = '';

    const id = 'alert_' + Date.now();
    const alertHtml = `
        <div class="alert-item" id="${id}">
            <div class="alert-info">
                <span class="alert-symbol">NOMOS 100</span>
                <span class="alert-price">${price.toLocaleString()}</span>
            </div>
            <button class="btn-clear-alert" onclick="this.closest('.alert-item').remove()">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `;
    list.insertAdjacentHTML('afterbegin', alertHtml);
}

function renderMainChart() {
    const canvas = document.getElementById('tv-chart-canvas');
    if (!canvas) return;

    const wrapper = document.getElementById('tv-chart-wrapper');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const width = canvas.width;
    const height = canvas.height;
    const xAxisHeight = 30; // Extra space for time labels
    const chartHeight = height - volumeHeight - xAxisHeight - 20;
    const volumeHeight = 40;

    // Generate candle data based on timeframe and zoom level
    const baseCount = currentTimeframe === '15m' ? 80 : currentTimeframe === '1d' ? 30 : 50;
    const candleCount = Math.max(10, Math.floor(baseCount / currentZoom));
    const candles = generateCandleData(candleCount, currentTimeframe);
    const maxHigh = Math.max(...candles.map(c => c.high));
    const minLow = Math.min(...candles.map(c => c.low));
    const range = maxHigh - minLow;
    const maxVolume = Math.max(...candles.map(c => c.volume));

    const candleWidth = Math.max(Math.floor((width - 80) / candles.length) - 2, 2);
    const gap = 2;

    // Store candle positions for hit detection
    const candlePositions = [];

    // Draw function
    function draw(highlightIndex = -1) {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, 'rgba(30, 41, 59, 0.8)');
        bgGrad.addColorStop(1, 'rgba(15, 23, 42, 1)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            const y = (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(0, y);
            ctx.lineTo(width - 60, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Price axis labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const price = maxHigh - (range / 4) * i;
            const y = (chartHeight / 4) * i + 12;
            ctx.fillText(price.toFixed(0), width - 5, y);
        }

        candlePositions.length = 0;

        // Draw candles
        candles.forEach((c, i) => {
            const x = i * (candleWidth + gap) + 20;
            const yHigh = 10 + ((maxHigh - c.high) / range) * (chartHeight - 20);
            const yLow = 10 + ((maxHigh - c.low) / range) * (chartHeight - 20);
            const yOpen = 10 + ((maxHigh - c.open) / range) * (chartHeight - 20);
            const yClose = 10 + ((maxHigh - c.close) / range) * (chartHeight - 20);

            const bullish = c.close >= c.open;
            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);

            // Store position for hit detection
            candlePositions.push({
                x: x,
                xEnd: x + candleWidth,
                data: c,
                index: i
            });

            // Highlight effect
            if (i === highlightIndex) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.fillRect(x - gap, 0, candleWidth + gap * 2, height - xAxisHeight);

                // Active X label highlight
                ctx.fillStyle = '#2962ff';
                ctx.fillRect(x - gap, height - xAxisHeight, candleWidth + gap * 2, 2);
            }

            // Wick
            ctx.strokeStyle = bullish ? '#22c55e' : '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x + candleWidth / 2, yHigh);
            ctx.lineTo(x + candleWidth / 2, yLow);
            ctx.stroke();

            // Body
            // Body / Line
            if (currentChartType === 'candle') {
                if (i === highlightIndex) {
                    ctx.fillStyle = bullish ? '#4ade80' : '#f87171';
                    ctx.shadowColor = bullish ? '#22c55e' : '#ef4444';
                    ctx.shadowBlur = 8;
                } else {
                    ctx.fillStyle = bullish ? '#22c55e' : '#ef4444';
                    ctx.shadowBlur = 0;
                }
                ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
                ctx.shadowBlur = 0;
            } else {
                // Draw Line Chart
                if (i > 0) {
                    const prevX = (i - 1) * (candleWidth + gap) + 20 + candleWidth / 2;
                    const prevY = 10 + ((maxHigh - candles[i - 1].close) / range) * (chartHeight - 20);
                    ctx.beginPath();
                    ctx.strokeStyle = '#2962ff';
                    ctx.lineWidth = 2;
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(x + candleWidth / 2, yClose);
                    ctx.stroke();

                    // Area
                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(41, 98, 255, 0.05)';
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(x + candleWidth / 2, yClose);
                    ctx.lineTo(x + candleWidth / 2, chartHeight);
                    ctx.lineTo(prevX, chartHeight);
                    ctx.fill();
                }
            }

            // Volume bar
            const volHeight = (c.volume / maxVolume) * volumeHeight;
            ctx.fillStyle = bullish ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
            ctx.fillRect(x, height - volHeight - 5, candleWidth, volHeight);
        });

        // Price Axis line
        ctx.strokeStyle = '#2a2e39';
        ctx.beginPath();
        ctx.moveTo(width - 60, 0);
        ctx.lineTo(width - 60, chartHeight);
        ctx.stroke();

        // Volume label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('HACİM', 15, height - 10);
    }

    // Initial draw
    draw();

    // Mouse interaction
    const tooltip = document.getElementById('tv-chart-tooltip');
    const crosshairX = document.getElementById('tv-crosshair-x');
    const crosshairY = document.getElementById('tv-crosshair-y');
    const priceLabel = document.getElementById('tv-price-label');

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Find hovered candle
        const hovered = candlePositions.find(cp => mouseX >= cp.x && mouseX <= cp.xEnd);

        if (hovered && mouseY < chartHeight) {
            // Show crosshair
            crosshairX.style.display = 'block';
            crosshairY.style.display = 'block';
            crosshairX.style.left = `${mouseX}px`;
            crosshairY.style.top = `${mouseY}px`;

            // Price label
            const price = maxHigh - (mouseY / chartHeight) * range;
            priceLabel.style.display = 'block';
            priceLabel.style.top = `${mouseY - 10}px`;
            priceLabel.textContent = price.toFixed(2);

            // Tooltip
            const c = hovered.data;
            const bullish = c.close >= c.open;
            tooltip.innerHTML = `
                <div class="tt-header ${bullish ? 'bullish' : 'bearish'}">
                    <span class="tt-symbol">NOMOS 100</span>
                    <span class="tt-change ${bullish ? 'positive' : 'negative'}">
                        ${bullish ? '+' : ''}${((c.close - c.open) / c.open * 100).toFixed(2)}%
                    </span>
                </div>
                <div class="tt-row"><span>Açılış</span><span>${c.open.toFixed(2)}</span></div>
                <div class="tt-row"><span>Yüksek</span><span class="text-green">${c.high.toFixed(2)}</span></div>
                <div class="tt-row"><span>Düşük</span><span class="text-red">${c.low.toFixed(2)}</span></div>
                <div class="tt-row"><span>Kapanış</span><span>${c.close.toFixed(2)}</span></div>
                <div class="tt-row"><span>Hacim</span><span>${c.volume.toFixed(0)}K</span></div>
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = `${Math.min(mouseX + 15, width - 160)}px`;
            tooltip.style.top = `${Math.min(mouseY + 15, chartHeight - 140)}px`;

            // Redraw with highlight
            draw(hovered.index);
        } else {
            tooltip.style.display = 'none';
            crosshairX.style.display = 'none';
            crosshairY.style.display = 'none';
            priceLabel.style.display = 'none';
            draw(-1);
        }
    });

    canvas.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        crosshairX.style.display = 'none';
        crosshairY.style.display = 'none';
        priceLabel.style.display = 'none';
        draw(-1);
    });
}

function generateCandleData(count) {
    let price = 12000 + Math.random() * 500;
    const data = [];

    const now = Date.now();
    let timeStep = 1000 * 60 * 60 * 4; // Default 4h
    if (timeframe === '15m') timeStep = 1000 * 60 * 15;
    else if (timeframe === '1h') timeStep = 1000 * 60 * 60;
    else if (timeframe === '1d') timeStep = 1000 * 60 * 60 * 24;
    else if (timeframe === '1w') timeStep = 1000 * 60 * 60 * 24 * 7;

    for (let i = 0; i < count; i++) {
        const open = price;
        const volatility = 50 + Math.random() * 80;
        const trend = Math.sin(i / 8) * 0.3 + (Math.random() - 0.48);
        const change = trend * volatility;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 40;
        const low = Math.min(open, close) - Math.random() * 40;
        price = close;

        // Reverse order for time
        const timestamp = now - (count - i) * timeStep;

        data.push({
            open,
            close,
            high,
            low,
            timestamp,
            volume: 30 + Math.random() * 70
        });
    }

    return data;
}

// === COUNTRY ECONOMIES ===
function renderCountryEconomies() {
    const countries = [
        { code: 'TR', name: 'Türkiye', gdp: '1.2T', growth: 4.2, flag: '🇹🇷', trend: 'up' },
        { code: 'DE', name: 'Almanya', gdp: '4.2T', growth: 1.8, flag: '🇩🇪', trend: 'up' },
        { code: 'US', name: 'ABD', gdp: '25.5T', growth: 2.1, flag: '🇺🇸', trend: 'up' },
        { code: 'CN', name: 'Çin', gdp: '18.3T', growth: 5.2, flag: '🇨🇳', trend: 'up' },
        { code: 'JP', name: 'Japonya', gdp: '4.9T', growth: -0.3, flag: '🇯🇵', trend: 'down' }
    ];

    return `
        <div class="sidebar-card economies-card">
            <div class="card-header">
                <h3><i class="fa-solid fa-globe"></i> Ülke Ekonomileri</h3>
            </div>
            <div class="economies-list">
                ${countries.map(c => `
                    <div class="economy-row" data-country="${c.code}">
                        <div class="country-flag">${c.flag}</div>
                        <div class="country-info">
                            <span class="country-name">${c.name}</span>
                            <span class="country-gdp">GSYİH: ${c.gdp}</span>
                        </div>
                        <div class="country-growth ${c.growth >= 0 ? 'positive' : 'negative'}">
                            <i class="fa-solid fa-arrow-${c.trend}"></i>
                            ${c.growth >= 0 ? '+' : ''}${c.growth}%
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// === RECENT INVESTMENTS ===
function renderRecentInvestments() {
    const investments = [
        { type: 'buy', asset: 'TKN', amount: 500, price: 142.50, time: '2 dk önce', profit: null },
        { type: 'sell', asset: 'ENP', amount: 200, price: 89.20, time: '15 dk önce', profit: 1250 },
        { type: 'buy', asset: 'NOMOS 100 Fonu', amount: 1, price: 5000, time: '1 saat önce', profit: null },
        { type: 'dividend', asset: 'MNC', amount: null, price: 450, time: '3 saat önce', profit: 450 }
    ];

    return `
        <div class="sidebar-card investments-card">
            <div class="card-header">
                <h3><i class="fa-solid fa-clock-rotate-left"></i> Son Yatırımlar</h3>
                <button class="btn-see-all">Tümü</button>
            </div>
            <div class="investments-list">
                ${investments.map(inv => `
                    <div class="investment-row ${inv.type}">
                        <div class="inv-icon">
                            <i class="fa-solid fa-${inv.type === 'buy' ? 'arrow-down' : inv.type === 'sell' ? 'arrow-up' : 'coins'}"></i>
                        </div>
                        <div class="inv-info">
                            <span class="inv-asset">${inv.asset}</span>
                            <span class="inv-detail">
                                ${inv.type === 'buy' ? `${inv.amount} adet alındı` :
            inv.type === 'sell' ? `${inv.amount} adet satıldı` :
                'Temettü geliri'}
                            </span>
                        </div>
                        <div class="inv-value">
                            <span class="inv-price">${inv.price.toLocaleString()} ₳</span>
                            <span class="inv-time">${inv.time}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// === TRADE AGREEMENTS (Ticari Antlaşmalar) ===
function renderTradeAgreements() {
    const agreements = [
        {
            id: 'ag1',
            title: 'Türkiye-Almanya Ticaret Anlaşması',
            countries: ['🇹🇷', '🇩🇪'],
            type: 'Serbest Ticaret',
            date: '2 saat önce',
            impact: 'positive',
            summary: 'İki ülke arasında otomotiv ve makine sektöründe gümrük vergilerinin kaldırılması...'
        },
        {
            id: 'ag2',
            title: 'Asya-Pasifik Enerji Ortaklığı',
            countries: ['🇨🇳', '🇯🇵', '🇰🇷'],
            type: 'Enerji İşbirliği',
            date: '5 saat önce',
            impact: 'positive',
            summary: 'Yenilenebilir enerji teknolojilerinin paylaşımı ve ortak yatırım planı...'
        },
        {
            id: 'ag3',
            title: 'AB Tarım Kotası Değişikliği',
            countries: ['🇪🇺'],
            type: 'Düzenleme',
            date: '1 gün önce',
            impact: 'negative',
            summary: 'Tarım ürünleri ithalat kotalarının %15 düşürülmesi kararı...'
        }
    ];

    return `
        <div class="sidebar-card agreements-card">
            <div class="card-header">
                <h3><i class="fa-solid fa-handshake"></i> Ticari Antlaşmalar</h3>
            </div>
            <div class="agreements-list">
                ${agreements.map(ag => `
                    <div class="agreement-row" data-agreement-id="${ag.id}" onclick="showAgreementModal('${ag.id}')">
                        <div class="agreement-countries">
                            ${ag.countries.join(' ')}
                        </div>
                        <div class="agreement-info">
                            <span class="agreement-title">${ag.title}</span>
                            <span class="agreement-type">${ag.type}</span>
                        </div>
                        <div class="agreement-meta">
                            <span class="agreement-impact ${ag.impact}">
                                <i class="fa-solid fa-${ag.impact === 'positive' ? 'arrow-up' : 'arrow-down'}"></i>
                            </span>
                            <span class="agreement-date">${ag.date}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Agreement Modal Template -->
        <div id="agreement-modal" class="modal-overlay" style="display: none;">
            <div class="modal-content agreement-modal">
                <div class="modal-header">
                    <h2 id="modal-agreement-title"></h2>
                    <button class="modal-close" onclick="closeAgreementModal()">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="modal-body" id="modal-agreement-body">
                </div>
            </div>
        </div>
    `;
}

// Global modal functions
window.agreementsData = [
    {
        id: 'ag1',
        title: 'Türkiye-Almanya Ticaret Anlaşması',
        countries: ['🇹🇷', '🇩🇪'],
        type: 'Serbest Ticaret',
        date: '2 saat önce',
        impact: 'positive',
        fullContent: `
            <p><strong>Anlaşma Detayları:</strong></p>
            <p>Türkiye ve Almanya arasında imzalanan bu kapsamlı serbest ticaret anlaşması, iki ülke arasındaki ticaret hacmini önemli ölçüde artırmayı hedeflemektedir.</p>
            <h4>Ana Maddeler:</h4>
            <ul>
                <li>Otomotiv sektöründe gümrük vergilerinin %80 azaltılması</li>
                <li>Makine ve ekipman ithalatında kota kaldırılması</li>
                <li>Tekstil ürünlerinde karşılıklı muafiyet</li>
                <li>Teknoloji transferi kolaylıkları</li>
            </ul>
            <h4>Ekonomik Etki:</h4>
            <p>Anlaşmanın yıllık 5 milyar Euro'luk ek ticaret hacmi yaratması beklenmektedir.</p>
        `
    },
    {
        id: 'ag2',
        title: 'Asya-Pasifik Enerji Ortaklığı',
        countries: ['🇨🇳', '🇯🇵', '🇰🇷'],
        type: 'Enerji İşbirliği',
        date: '5 saat önce',
        impact: 'positive',
        fullContent: `
            <p><strong>Ortaklık Detayları:</strong></p>
            <p>Çin, Japonya ve Güney Kore arasında kurulan bu stratejik enerji ortaklığı, bölgesel enerji güvenliğini güçlendirmeyi amaçlamaktadır.</p>
            <h4>İşbirliği Alanları:</h4>
            <ul>
                <li>Güneş enerjisi panel üretiminde ortak yatırımlar</li>
                <li>Hidrojen yakıt teknolojisi geliştirme</li>
                <li>Nükleer enerji güvenliği standartları</li>
                <li>Elektrik şebekesi entegrasyonu</li>
            </ul>
        `
    },
    {
        id: 'ag3',
        title: 'AB Tarım Kotası Değişikliği',
        countries: ['🇪🇺'],
        type: 'Düzenleme',
        date: '1 gün önce',
        impact: 'negative',
        fullContent: `
            <p><strong>Düzenleme Detayları:</strong></p>
            <p>Avrupa Birliği, tarım ürünleri ithalat kotalarında önemli değişiklikler yapma kararı aldı.</p>
            <h4>Değişiklikler:</h4>
            <ul>
                <li>Tahıl ithalat kotası %15 düşürüldü</li>
                <li>Et ürünleri kotası %10 azaltıldı</li>
                <li>Süt ürünlerinde yeni kalite standartları</li>
            </ul>
            <h4>Piyasa Etkisi:</h4>
            <p>Bu düzenleme, AB dışı ülkelerden yapılan tarım ithalatını olumsuz etkileyebilir.</p>
        `
    }
];

window.showAgreementModal = function (agreementId) {
    const agreement = window.agreementsData.find(a => a.id === agreementId);
    if (!agreement) return;

    const modal = document.getElementById('agreement-modal');
    const title = document.getElementById('modal-agreement-title');
    const body = document.getElementById('modal-agreement-body');

    title.innerHTML = `
        <span class="modal-countries">${agreement.countries.join(' ')}</span>
        ${agreement.title}
    `;

    body.innerHTML = `
        <div class="agreement-meta-full">
            <span class="type-badge">${agreement.type}</span>
            <span class="impact-badge ${agreement.impact}">
                <i class="fa-solid fa-${agreement.impact === 'positive' ? 'arrow-trend-up' : 'arrow-trend-down'}"></i>
                ${agreement.impact === 'positive' ? 'Olumlu Etki' : 'Olumsuz Etki'}
            </span>
            <span class="date-badge"><i class="fa-solid fa-clock"></i> ${agreement.date}</span>
        </div>
        <div class="agreement-content">
            ${agreement.fullContent}
        </div>
    `;

    modal.style.display = 'flex';
};

window.closeAgreementModal = function () {
    document.getElementById('agreement-modal').style.display = 'none';
};

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
        <div class="fund-card" data-fund-id="${fund.id}" style="cursor: pointer;">
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
            <div class="fund-stats-row">
                <div class="fund-stat">
                    <span class="fund-stat-value">${fund.price.toLocaleString()} ₳</span>
                    <span class="fund-stat-label">Fiyat</span>
                </div>
                <div class="fund-stat">
                    <span class="fund-stat-value ${fund.change >= 0 ? 'text-green' : 'text-red'}">
                        ${fund.change >= 0 ? '+' : ''}${fund.change}%
                    </span>
                    <span class="fund-stat-label">Değişim</span>
                </div>
                <div class="fund-stat">
                    <span class="fund-stat-value">${(fund.aum / 1000000).toFixed(1)}M</span>
                    <span class="fund-stat-label">AUM</span>
                </div>
            </div>
            <div class="fund-actions">
                <button class="btn-fund-mini primary" data-action="invest-fund" data-fund="${fund.id}">
                    <i class="fa-solid fa-coins"></i> Yatırım
                </button>
                <button class="btn-fund-mini" data-action="fund-details" data-fund="${fund.id}">
                    <i class="fa-solid fa-info-circle"></i>
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

// === DÜNYA HİSELERİ ===
const WORLD_STOCKS = [
    { ticker: 'AAPL', name: 'Apple Inc.', price: 189.84, change: 1.42, mcap: '2.95T', country: 'ABD', flag: '🇺🇸', category: 'giants' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 0.87, mcap: '2.81T', country: 'ABD', flag: '🇺🇸', category: 'giants' },
    { ticker: 'GOOG', name: 'Alphabet Inc.', price: 141.80, change: -0.34, mcap: '1.75T', country: 'ABD', flag: '🇺🇸', category: 'giants' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 2.15, mcap: '1.86T', country: 'ABD', flag: '🇺🇸', category: 'trendy' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 3.82, mcap: '2.16T', country: 'ABD', flag: '🇺🇸', category: 'trendy' },
    { ticker: 'META', name: 'Meta Platforms', price: 484.10, change: 1.96, mcap: '1.23T', country: 'ABD', flag: '🇺🇸', category: 'trendy' },
    { ticker: 'TSLA', name: 'Tesla Inc.', price: 193.57, change: -2.41, mcap: '615B', country: 'ABD', flag: '🇺🇸', category: 'trendy' },
    { ticker: 'TSM', name: 'Taiwan Semiconductor', price: 142.56, change: 1.18, mcap: '738B', country: 'Tayvan', flag: '🇹🇼', category: 'giants' },
    { ticker: 'V', name: 'Visa Inc.', price: 279.32, change: 0.56, mcap: '572B', country: 'ABD', flag: '🇺🇸', category: 'newcomers' },
    { ticker: 'JPM', name: 'JPMorgan Chase', price: 196.20, change: -0.72, mcap: '564B', country: 'ABD', flag: '🇺🇸', category: 'newcomers' },
    { ticker: 'SAP', name: 'SAP SE', price: 187.42, change: 0.93, mcap: '229B', country: 'Almanya', flag: '🇩🇪', category: 'giants' },
    { ticker: 'SHEL', name: 'Shell plc', price: 64.85, change: -1.12, mcap: '206B', country: 'İngiltere', flag: '🇬🇧', category: 'newcomers' },
    { ticker: 'TM', name: 'Toyota Motor Corp.', price: 214.30, change: 0.41, mcap: '310B', country: 'Japonya', flag: '🇯🇵', category: 'giants' },
    { ticker: 'NESN', name: 'Nestlé S.A.', price: 98.16, change: -0.28, mcap: '265B', country: 'İsviçre', flag: '🇨🇭', category: 'newcomers' },
    { ticker: 'MC', name: 'LVMH', price: 842.70, change: 1.34, mcap: '423B', country: 'Fransa', flag: '🇫🇷', category: 'giants' },
    { ticker: 'BABA', name: 'Alibaba Group', price: 73.82, change: -1.87, mcap: '187B', country: 'Çin', flag: '🇨🇳', category: 'trendy' },
    { ticker: 'ASML', name: 'ASML Holding', price: 924.50, change: 2.63, mcap: '370B', country: 'Hollanda', flag: '🇳🇱', category: 'giants' },
    { ticker: 'XOM', name: 'Exxon Mobil Corp.', price: 105.72, change: -0.45, mcap: '442B', country: 'ABD', flag: '🇺🇸', category: 'newcomers' },
    { ticker: 'RY', name: 'Royal Bank of Canada', price: 124.88, change: 0.31, mcap: '175B', country: 'Kanada', flag: '🇨🇦', category: 'giants' },
    { ticker: 'SMSN', name: 'Samsung Electronics', price: 1420.00, change: -0.92, mcap: '348B', country: 'G. Kore', flag: '🇰🇷', category: 'giants' },
];

function renderWorldStocks() {
    return WORLD_STOCKS.map(stock => {
        const isPositive = stock.change >= 0;
        const changeClass = isPositive ? 'positive' : 'negative';
        const changeIcon = isPositive ? 'fa-caret-up' : 'fa-caret-down';
        const changeSign = isPositive ? '+' : '';

        return `
            <div class="table-row world-stock-row" data-category="${stock.category}">
                <div class="col-ticker">
                    <span class="ticker-badge">${stock.ticker}</span>
                </div>
                <div class="col-name">
                    <span class="stock-company-name">${stock.name}</span>
                </div>
                <div class="col-price">$${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div class="col-change ${changeClass}">
                    <i class="fa-solid ${changeIcon}"></i>
                    ${changeSign}${stock.change}%
                </div>
                <div class="col-mcap">$${stock.mcap}</div>
                <div class="col-country">
                    <span class="country-flag">${stock.flag}</span>
                    <span class="country-name">${stock.country}</span>
                </div>
                <div class="col-actions">
                    <button class="btn-trade-sm btn-buy-sm" title="Satın Al">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

export function getWorldStocks() {
    return WORLD_STOCKS;
}
