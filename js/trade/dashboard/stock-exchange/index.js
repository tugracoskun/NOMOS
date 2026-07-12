// STOCK EXCHANGE SECTION - UI COMPONENTS
// Şirket borsası ve yatırım paneli

import { marketState, getMarketMultiplier, marketScenarios } from '../../../data/market.js';
import { resourcesList } from '../../../map/resources.js';
import { resourcesEconomics } from '../../../data/city-stats.js';

export const STOCK_DATA = {
    countries: [
        { id: 'tr', name: 'Türkiye', ticker: 'TR', growth: 4.5, investment: 125, score: 85, change: 1.2 },
        { id: 'us', name: 'ABD', ticker: 'USA', growth: 2.1, investment: 4500, score: 92, change: 0.5 },
        { id: 'de', name: 'Almanya', ticker: 'GER', growth: 0.5, investment: 2100, score: 88, change: -0.3 },
        { id: 'cn', name: 'Çin', ticker: 'CHN', growth: 5.2, investment: 3200, score: 89, change: 2.1 },
        { id: 'gb', name: 'İngiltere', ticker: 'UK', growth: 1.1, investment: 1500, score: 84, change: 0.8 },
        { id: 'jp', name: 'Japonya', ticker: 'JPN', growth: 0.8, investment: 1800, score: 87, change: -0.1 },
        { id: 'in', name: 'Hindistan', ticker: 'IND', growth: 6.5, investment: 1100, score: 81, change: 3.2 },
        { id: 'br', name: 'Brezilya', ticker: 'BRA', growth: 2.5, investment: 850, score: 76, change: 1.5 }
    ],
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
        { id: 'tech_fund', name: 'Teknoloji Odaklı BYF', ticker: 'TEK', type: 'growth', price: 1450, aum: 150000000, change: 2.4, risk: 'high' },
        { id: 'dividend_fund', name: 'Temettü 25 BYF', ticker: 'TEM', type: 'dividend', price: 850, aum: 450000000, change: 0.8, risk: 'low' },
        { id: 'global_fund', name: 'Küresel Karma Fon', ticker: 'GLB', type: 'mixed', price: 2100, aum: 320000000, change: 1.2, risk: 'medium' },
        { id: 'sustainability', name: 'Sürdürülebilirlik BYF', ticker: 'SRD', type: 'growth', price: 1100, aum: 85000000, change: 1.8, risk: 'medium' }
    ],
    indices: [
        { name: 'Küresel Büyüme Endeksi', value: 1045.32, change: 0.84 },
        { name: 'Gelişen Piyasalar Endeksi', value: 834.56, change: 1.27 },
        { name: 'Enerji Piyasası Endeksi', value: 1578.90, change: -0.45 }
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
                            <span>Yatırım Fonları</span>
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
                    </div>
            </header>

            <!-- Main Layout with Views -->
            <div class="exchange-main-layout">
                <!-- Sol Panel: İçerik Görünümleri -->
                <div class="exchange-left-panel">
                    
                    <!-- VIEW: Overview (General Dashboard) -->
                    <div class="exchange-view-panel active" id="view-overview">
                        <div class="exchange-dashboard-grid">
                            <div class="dashboard-top-row horizontal-widgets">
                                <div class="widget-card summary-widget">
                                    <div class="widget-header">
                                        <h4><i class="fa-solid fa-clock-rotate-left"></i> Son Yatırımlar</h4>
                                    </div>
                                    <div class="widget-body">
                                        ${renderRecentInvestments()}
                                    </div>
                                </div>
                                <div class="widget-card summary-widget">
                                    <div class="widget-header">
                                        <h4><i class="fa-solid fa-handshake"></i> Ticari Antlaşmalar</h4>
                                    </div>
                                    <div class="widget-body">
                                        ${renderTradeAgreements()}
                                    </div>
                                </div>
                                <div class="widget-card summary-widget">
                                    <div class="widget-header">
                                        <h4><i class="fa-solid fa-globe"></i> Ülke Ekonomileri</h4>
                                    </div>
                                    <div class="widget-body">
                                        ${renderCountryEconomies()}
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
                                        ${STOCK_DATA.indices.map((index, idx) => `
                                            <div class="premium-index-card ${index.change >= 0 ? 'bullish' : 'bearish'}" data-index-name="${index.name}" style="cursor:pointer;" title="Detay için tıklayın">
                                                <div class="card-content">
                                                    <div class="card-top">
                                                        <span class="index-ticker">${index.name}</span>
                                                        <span class="index-change-tag ${index.change >= 0 ? 'positive' : 'negative'}">
                                                            ${index.change >= 0 ? '▲' : '▼'} ${index.change}%
                                                        </span>
                                                    </div>
                                                    <div class="card-middle">
                                                        <span class="current-value">${index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div class="card-chart-area">
                                                        <canvas class="index-mini-chart" data-index-idx="${idx}" data-base-value="${index.value}" data-change="${index.change}"></canvas>
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
                                            <select class="chart-symbol-select" style="background: transparent; color: white; border: none; font-size: 1.2rem; font-weight: bold; cursor: pointer; outline: none; margin-right: 8px;">
                                                <optgroup label="Ülkeler">
                                                    <option value="TR">Türkiye Endeksi</option>
                                                    <option value="USA">ABD Endeksi</option>
                                                    <option value="GER">Almanya Endeksi</option>
                                                    <option value="CHN">Çin Endeksi</option>
                                                </optgroup>
                                                <optgroup label="Makro Endeksler">
                                                    <option value="GLO">Küresel Büyüme Endeksi</option>
                                                    <option value="DEV">Gelişen Piyasalar</option>
                                                    <option value="ENE">Enerji Piyasası</option>
                                                </optgroup>
                                            </select>
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
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="custom-chart-icon">
                                                    <rect x="2" y="11" width="3" height="6" rx="0.5" opacity="0.4"/>
                                                    <rect x="3.2" y="9" width="0.6" height="10" rx="0.3" opacity="0.2"/>
                                                    <rect x="7" y="6" width="3" height="7" rx="0.5" opacity="0.4"/>
                                                    <rect x="8.2" y="4" width="0.6" height="11" rx="0.3" opacity="0.2"/>
                                                    <rect x="12" y="10" width="3" height="6" rx="0.5" opacity="0.4"/>
                                                    <rect x="13.2" y="8" width="0.6" height="10" rx="0.3" opacity="0.2"/>
                                                    <rect x="17" y="4" width="3" height="8" rx="0.5" opacity="0.4"/>
                                                    <rect x="18.2" y="2" width="0.6" height="12" rx="0.3" opacity="0.2"/>
                                                    <path d="M1 18L6 13L11 16L22 5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M17 5H22V10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </button>
                                            <button class="chart-tool-btn" data-chart-type="line" title="Çizgi Grafiği">
                                                <i class="fa-solid fa-chart-line"></i>
                                            </button>
                                        </div>
                                        <div class="divider"></div>
                                        <div class="timeline-tabs compact">
                                            <button class="tf-btn" data-tf="15m">15dk</button>
                                            <button class="tf-btn" data-tf="1h">1sa</button>
                                            <button class="tf-btn active" data-tf="4h">4sa</button>
                                            <button class="tf-btn" data-tf="1d">1g</button>
                                            <button class="tf-btn" data-tf="1w">1h</button>
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

                                <!-- Integrated Internal Content -->
                                <div class="chart-internal-content">

                                    <div class="chart-internal-grid">
                                        <div class="internal-col-left">
                                            <div class="internal-section">
                                                <h4><i class="fa-solid fa-newspaper"></i> HABERLER</h4>
                                                <div class="stock-news-item mini">
                                                    <div class="news-title">Küresel Büyüme Endeksi Endeksi pozitif seyrediyor.</div>
                                                    <span class="time">2sa</span>
                                                </div>
                                                <div class="stock-news-item mini">
                                                    <div class="news-title">Teknoloji rallisi başladı mı?</div>
                                                    <span class="time">5sa</span>
                                                </div>
                                            </div>
                                            <div class="internal-section">
                                                <h4><i class="fa-solid fa-pie-chart"></i> FONLAR (BYF)</h4>
                                                <div class="funds-mini-row">
                                                    <div class="f-mini-tag">Büyüme %12</div>
                                                    <div class="f-mini-tag">Tekno %8</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="internal-col-right">
                                            <div class="internal-section chat-mini">
                                                <h4><i class="fa-solid fa-comments"></i> SOHBET</h4>
                                                <div class="chat-messages mini" id="tv-chat-box">
                                                    <div class="chat-msg">
                                                        <span class="u">BorsaKaplanı:</span>
                                                        <span class="m">12,500 direnci önemli.</span>
                                                    </div>
                                                    <div class="chat-msg">
                                                        <span class="u">Analist:</span>
                                                        <span class="m">Hacim artmalı.</span>
                                                    </div>
                                                </div>
                                                <div class="chat-input-area mini">
                                                    <input type="text" placeholder="Mesaj..." id="stock-chat-input">
                                                    <button class="btn-chat-send"><i class="fa-solid fa-paper-plane"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="chart-bottom-info">
                                     <div class="chart-stats-mini">
                                         <div class="mini-stat"><span>YÜK:</span> <span class="v text-green">12,520</span></div>
                                         <div class="mini-stat"><span>DÜŞ:</span> <span class="v text-red">12,195</span></div>
                                         <div class="mini-stat"><span>HAC:</span> <span class="v">2.44M</span></div>
                                     </div>
                                 </div>
                            </div>
                            
                            <!-- Chart Sidebar (Right) -->
                            <div class="chart-sidebar">
                                <div class="sidebar-section">
                                    <h4><i class="fa-solid fa-list-ul"></i> İzleme Listesi</h4>
                                    <div class="watch-list" id="tv-watch-list">
<div class="watch-item">
                                            <span class="w-symbol">TR</span>
                                            <span class="w-price">8,945</span>
                                            <span class="w-change positive">+1.24%</span>
                                        </div>
                                        <div class="watch-item">
                                            <span class="w-symbol">USA</span>
                                            <span class="w-price">34,567</span>
                                            <span class="w-change positive">+0.45%</span>
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
                            <div class="view-header-modern">
                                <div class="title-group">
                                    <h2><i class="fa-solid fa-globe"></i> Dünya Hisseleri</h2>
                                    <p>Küresel borsalardaki en değerli şirketler ve anlık veriler</p>
                                </div>
                                <div class="view-controls">
                                    <div class="search-box-modern">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                        <input type="text" placeholder="Hisse veya şirket ara..." id="world-stock-search">
                                    </div>
                                    <div class="filter-group-modern">
                                        <button class="filter-btn active" data-filter="all">Tümü</button>
                                        <button class="filter-btn" data-filter="giants">Devler</button>
                                        <button class="filter-btn" data-filter="trendy">Popüler</button>
                                        <button class="filter-btn" data-filter="newcomers">Yeni Eklenenler</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="modern-stocks-table">
                                <div class="table-head">
                                    <div class="th-col col-symbol sortable" data-sort="ticker">SEMBOL <i class="fa-solid fa-sort"></i></div>
                                    <div class="th-col col-company sortable" data-sort="name">ŞİRKET <i class="fa-solid fa-sort"></i></div>
                                    <div class="th-col col-price sortable" data-sort="price">FİYAT <i class="fa-solid fa-sort"></i></div>
                                    <div class="th-col col-change sortable" data-sort="change">DEĞİŞİM <i class="fa-solid fa-sort"></i></div>
                                    <div class="th-col col-cap sortable" data-sort="mcap">PİYASA DEĞERİ <i class="fa-solid fa-sort"></i></div>
                                    <div class="th-col col-country">ÜLKE</div>
                                    <div class="th-col col-action">İŞLEM</div>
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
    setupWorldStockSorting();
    setupFundEvents(); // Initial load
    setupSubTabs(); // Handle sub-tabs in overview
    setupIndexCardClicks(); // Endeks kartlarına tıklama

    // Render mini candlestick charts on index cards
    setTimeout(() => renderIndexMiniCharts(), 100);
}

// === MINI CANDLESTICK CHARTS FOR INDEX CARDS ===
function renderIndexMiniCharts() {
    const canvases = document.querySelectorAll('.index-mini-chart');
    canvases.forEach(canvas => {
        const baseValue = parseFloat(canvas.dataset.baseValue);
        const change = parseFloat(canvas.dataset.change);
        drawMiniCandleChart(canvas, baseValue, change);
    });
}

function drawMiniCandleChart(canvas, baseValue, changePercent) {
    const wrapper = canvas.closest('.card-chart-area');
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Generate candle data
    const count = 25;
    let price = baseValue * (1 - changePercent / 80);
    const candles = [];

    for (let i = 0; i < count; i++) {
        const open = price;
        const volatility = baseValue * 0.003 + Math.random() * baseValue * 0.005;
        const trend = Math.sin(i / 7) * 0.3 + (changePercent >= 0 ? 0.08 : -0.08) + (Math.random() - 0.46);
        price = price + trend * volatility;
        const close = price;
        const high = Math.max(open, close) + Math.random() * baseValue * 0.002;
        const low = Math.min(open, close) - Math.random() * baseValue * 0.002;
        candles.push({ open, close, high, low });
    }

    const allPrices = candles.flatMap(c => [c.high, c.low]);
    const maxP = Math.max(...allPrices);
    const minP = Math.min(...allPrices);
    const range = maxP - minP || 1;

    const padTop = 4;
    const padBot = 4;
    const chartH = H - padTop - padBot;
    const barW = Math.max((W / count) - 1.5, 2);
    const gap = 1;

    const toY = (val) => padTop + chartH - ((val - minP) / range) * chartH;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, 'rgba(19, 23, 34, 0.6)');
    bgGrad.addColorStop(1, 'rgba(15, 20, 30, 0.95)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Area fill under line
    const areaColor = changePercent >= 0 ? '#4ade80' : '#f87171';
    const areaGrad = ctx.createLinearGradient(0, 0, 0, H);
    areaGrad.addColorStop(0, changePercent >= 0 ? 'rgba(74, 222, 128, 0.12)' : 'rgba(248, 113, 113, 0.12)');
    areaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    candles.forEach((c, i) => {
        const x = i * (barW + gap) + barW / 2;
        const y = toY(c.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    const lastX = (candles.length - 1) * (barW + gap) + barW / 2;
    ctx.lineTo(lastX, H);
    ctx.lineTo(barW / 2, H);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Draw candlesticks
    candles.forEach((c, i) => {
        const x = i * (barW + gap);
        const bullish = c.close >= c.open;
        const bodyTop = toY(Math.max(c.open, c.close));
        const bodyBot = toY(Math.min(c.open, c.close));
        const bodyH = Math.max(bodyBot - bodyTop, 1);

        // Wick
        ctx.strokeStyle = bullish ? 'rgba(74, 222, 128, 0.4)' : 'rgba(248, 113, 113, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + barW / 2, toY(c.high));
        ctx.lineTo(x + barW / 2, toY(c.low));
        ctx.stroke();

        // Body
        ctx.fillStyle = bullish ? 'rgba(74, 222, 128, 0.65)' : 'rgba(248, 113, 113, 0.65)';
        ctx.fillRect(x, bodyTop, barW, bodyH);
    });

    // Line overlay
    ctx.beginPath();
    candles.forEach((c, i) => {
        const x = i * (barW + gap) + barW / 2;
        const y = toY(c.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = areaColor;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
}

// === INDEX CARD CLICK → POPUP PREVIEW ===
function setupIndexCardClicks() {
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.premium-index-card[data-index-name]');
        if (!card) return;

        const indexName = card.dataset.indexName;
        const index = STOCK_DATA.indices.find(i => i.name === indexName);
        if (index) {
            showIndexPreviewPopup(index);
        }
    });
}

function showIndexPreviewPopup(index) {
    // Remove existing popup
    const existing = document.getElementById('index-preview-popup');
    if (existing) existing.remove();

    const isUp = index.change >= 0;
    const accentColor = isUp ? '#22c55e' : '#ef4444';

    // Mock detailed data
    const open = (index.value * (1 - index.change / 200)).toFixed(2);
    const high = (index.value * (1 + Math.abs(index.change) / 80)).toFixed(2);
    const low = (index.value * (1 - Math.abs(index.change) / 60)).toFixed(2);
    const prevClose = (index.value * (1 - index.change / 100)).toFixed(2);
    const volume = (Math.random() * 5 + 1).toFixed(2);
    const week52High = (index.value * 1.15).toFixed(2);
    const week52Low = (index.value * 0.78).toFixed(2);
    const changeAbs = (index.value - parseFloat(prevClose)).toFixed(2);

    const popupHTML = `
        <div class="index-popup-overlay" id="index-preview-popup">
            <div class="index-popup-container">

                <!-- Header -->
                <div class="index-popup-header">
                    <div class="popup-title-area">
                        <div class="popup-index-badge ${isUp ? 'bullish' : 'bearish'}">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                        <div class="popup-title-text">
                            <h2>${index.name}</h2>
                            <span class="popup-subtitle">NOMOS Borsa Endeksi • Anlık Veri</span>
                        </div>
                    </div>
                    <div class="popup-price-area">
                        <span class="popup-main-price">${index.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span class="popup-change-tag ${isUp ? 'positive' : 'negative'}">
                            <i class="fa-solid fa-${isUp ? 'arrow-up' : 'arrow-down'}"></i>
                            ${isUp ? '+' : ''}${changeAbs} (${isUp ? '+' : ''}${index.change}%)
                        </span>
                    </div>
                    <button class="index-popup-close" id="index-popup-close-btn">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Chart Controls Bar (like main chart view) -->
                <div class="index-popup-controls">
                    <div class="popup-chart-type-selector">
                        <button class="popup-chart-tool-btn active" data-popup-chart-type="candle" title="Mum Grafiği">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="8" width="3" height="8" rx="0.5" opacity="0.6"/>
                                <rect x="4" y="5" width="1" height="14" rx="0.3" opacity="0.3"/>
                                <rect x="10" y="4" width="3" height="10" rx="0.5" opacity="0.6"/>
                                <rect x="11" y="2" width="1" height="14" rx="0.3" opacity="0.3"/>
                                <rect x="17" y="9" width="3" height="6" rx="0.5" opacity="0.6"/>
                                <rect x="18" y="7" width="1" height="10" rx="0.3" opacity="0.3"/>
                            </svg>
                        </button>
                        <button class="popup-chart-tool-btn" data-popup-chart-type="line" title="Çizgi Grafiği">
                            <i class="fa-solid fa-chart-line"></i>
                        </button>
                    </div>
                    <div class="popup-divider"></div>
                    <div class="popup-timeline-tabs">
                        <button class="popup-tf-btn" data-popup-tf="15m">15dk</button>
                        <button class="popup-tf-btn" data-popup-tf="1h">1sa</button>
                        <button class="popup-tf-btn active" data-popup-tf="4h">4sa</button>
                        <button class="popup-tf-btn" data-popup-tf="1d">1g</button>
                        <button class="popup-tf-btn" data-popup-tf="1w">1h</button>
                    </div>
                    <div class="popup-divider"></div>
                    <div class="popup-zoom-controls">
                        <button class="popup-chart-tool-btn" id="popup-zoom-in" title="Yakınlaştır"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                        <button class="popup-chart-tool-btn" id="popup-zoom-out" title="Uzaklaştır"><i class="fa-solid fa-magnifying-glass-minus"></i></button>
                        <button class="popup-chart-tool-btn" id="popup-zoom-reset" title="Sıfırla"><i class="fa-solid fa-arrows-rotate"></i></button>
                    </div>
                </div>

                <!-- Interactive Canvas Chart -->
                <div class="index-popup-chart-area">
                    <div class="popup-chart-wrapper" id="popup-chart-wrapper">
                        <canvas id="popup-chart-canvas"></canvas>
                        <div class="popup-chart-tooltip" id="popup-chart-tooltip" style="display:none;"></div>
                        <div class="popup-crosshair-x" id="popup-crosshair-x"></div>
                        <div class="popup-crosshair-y" id="popup-crosshair-y"></div>
                        <div class="popup-price-label" id="popup-price-label"></div>
                        <div class="popup-zoom-hint">Fare tekerleği ile yakınlaştırın</div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="index-popup-stats">
                    <div class="stat-item">
                        <span class="stat-label">Açılış</span>
                        <span class="stat-value">${parseFloat(open).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Önceki Kapanış</span>
                        <span class="stat-value">${parseFloat(prevClose).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Gün Yüksek</span>
                        <span class="stat-value text-green">${parseFloat(high).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Gün Düşük</span>
                        <span class="stat-value text-red">${parseFloat(low).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">İşlem Hacmi</span>
                        <span class="stat-value">${volume}M</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">52H Yüksek</span>
                        <span class="stat-value text-green">${parseFloat(week52High).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">52H Düşük</span>
                        <span class="stat-value text-red">${parseFloat(week52Low).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Piyasa Durumu</span>
                        <span class="stat-value" style="color:${accentColor}">${isUp ? '🟢 Boğa' : '🔴 Ayı'}</span>
                    </div>
                </div>

                <!-- Bottom Row: Summary + News -->
                <div class="index-popup-bottom">
                    <div class="popup-summary-box">
                        <h4><i class="fa-solid fa-chart-pie"></i> Piyasa Özeti</h4>
                        <p>
                            ${index.name} endeksi bugün ${isUp ? 'yukarı yönlü' : 'aşağı yönlü'} bir seyir izledi. 
                            Seans içinde ${isUp ? 'alıcılar baskısı' : 'satıcılar baskısı'} görüldü. 
                            Endeks ${parseFloat(high).toLocaleString()} seviyesinden dirençle karşılaşırken, 
                            ${parseFloat(low).toLocaleString()} seviyesinde destek buldu.
                        </p>
                    </div>
                    <div class="popup-news-box">
                        <h4><i class="fa-solid fa-newspaper"></i> Son Haberler</h4>
                        <div class="popup-news-list">
                            <div class="popup-news-item">
                                <span class="news-dot ${isUp ? 'green' : 'red'}"></span>
                                <span>${index.name} ${isUp ? 'pozitif açıldı' : 'negatif seyirde'}.</span>
                                <small>2sa</small>
                            </div>
                            <div class="popup-news-item">
                                <span class="news-dot"></span>
                                <span>Merkez Bankası faiz kararını açıkladı.</span>
                                <small>5sa</small>
                            </div>
                            <div class="popup-news-item">
                                <span class="news-dot green"></span>
                                <span>Dış ticaret verileri beklentilerin üzerinde.</span>
                                <small>1g</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Animate in
    requestAnimationFrame(() => {
        const overlay = document.getElementById('index-preview-popup');
        if (overlay) overlay.classList.add('active');
    });

    // Close handlers
    const closeBtn = document.getElementById('index-popup-close-btn');
    const overlay = document.getElementById('index-preview-popup');

    const closePopup = () => {
        if (overlay) {
            overlay.classList.remove('active');
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 300);
        }
    };

    closeBtn?.addEventListener('click', closePopup);
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup();
    });
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', escHandler);
        }
    });

    // Initialize interactive chart after DOM insertion
    setTimeout(() => initPopupInteractiveChart(index), 50);
}

// === POPUP INTERACTIVE CHART (Canvas - TradingView Style) ===
function initPopupInteractiveChart(index) {
    let popupChartType = 'candle';
    let popupTimeframe = '4h';
    let popupZoom = 1.0;

    const container = document.getElementById('index-preview-popup');
    if (!container) return;

    function renderPopupChart() {
        const canvas = document.getElementById('popup-chart-canvas');
        const wrapper = document.getElementById('popup-chart-wrapper');
        if (!canvas || !wrapper) return;

        const ctx = canvas.getContext('2d');
        const rect = wrapper.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const width = canvas.width;
        const height = canvas.height;
        const xAxisHeight = 28;
        const volumeHeight = 35;
        const chartHeight = height - volumeHeight - xAxisHeight - 15;

        // Generate candle data
        const baseCount = popupTimeframe === '15m' ? 80 : popupTimeframe === '1d' ? 30 : 50;
        const candleCount = Math.max(10, Math.floor(baseCount / popupZoom));
        const candles = generatePopupCandleData(candleCount, popupTimeframe, index.value);
        const maxHigh = Math.max(...candles.map(c => c.high));
        const minLow = Math.min(...candles.map(c => c.low));
        const range = maxHigh - minLow;
        const maxVolume = Math.max(...candles.map(c => c.volume));

        const candleWidth = Math.max(Math.floor((width - 70) / candles.length) - 2, 2);
        const gap = 2;

        const candlePositions = [];

        function draw(highlightIndex = -1) {
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
                ctx.lineTo(width - 55, y);
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
                const x = i * (candleWidth + gap) + 15;
                const yHigh = 10 + ((maxHigh - c.high) / range) * (chartHeight - 20);
                const yLow = 10 + ((maxHigh - c.low) / range) * (chartHeight - 20);
                const yOpen = 10 + ((maxHigh - c.open) / range) * (chartHeight - 20);
                const yClose = 10 + ((maxHigh - c.close) / range) * (chartHeight - 20);

                const bullish = c.close >= c.open;
                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);

                candlePositions.push({ x, xEnd: x + candleWidth, data: c, index: i });

                // Highlight
                if (i === highlightIndex) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                    ctx.fillRect(x - gap, 0, candleWidth + gap * 2, height - xAxisHeight);
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

                if (popupChartType === 'candle') {
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
                    // Line chart
                    if (i > 0) {
                        const prevX = (i - 1) * (candleWidth + gap) + 15 + candleWidth / 2;
                        const prevY = 10 + ((maxHigh - candles[i - 1].close) / range) * (chartHeight - 20);
                        ctx.beginPath();
                        ctx.strokeStyle = '#2962ff';
                        ctx.lineWidth = 2;
                        ctx.moveTo(prevX, prevY);
                        ctx.lineTo(x + candleWidth / 2, yClose);
                        ctx.stroke();

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
                ctx.fillRect(x, height - xAxisHeight - volHeight - 2, candleWidth, volHeight);
            });

            // Price Axis line
            ctx.strokeStyle = '#2a2e39';
            ctx.beginPath();
            ctx.moveTo(width - 55, 0);
            ctx.lineTo(width - 55, height - xAxisHeight);
            ctx.stroke();

            // X-Axis line
            ctx.strokeStyle = '#2a2e39';
            ctx.beginPath();
            ctx.moveTo(0, height - xAxisHeight);
            ctx.lineTo(width, height - xAxisHeight);
            ctx.stroke();

            // Time Axis Labels
            ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
            ctx.font = '9px Inter, sans-serif';
            ctx.textAlign = 'center';
            const labelInterval = Math.max(1, Math.floor(candles.length / 7));
            candles.forEach((c, i) => {
                if (i % labelInterval === 0) {
                    const x = i * (candleWidth + gap) + 15 + candleWidth / 2;
                    const date = new Date(c.timestamp);
                    let label = '';
                    if (popupTimeframe === '15m' || popupTimeframe === '1h' || popupTimeframe === '4h') {
                        label = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
                    } else {
                        label = date.getDate() + ' ' + date.toLocaleString('tr-TR', { month: 'short' });
                    }
                    ctx.fillText(label, x, height - 8);
                }
            });

            // Volume label
            ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
            ctx.font = '8px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('HACİM', 10, height - xAxisHeight - 5);
        }

        draw();

        // Mouse interactions
        const tooltip = document.getElementById('popup-chart-tooltip');
        const crosshairX = document.getElementById('popup-crosshair-x');
        const crosshairY = document.getElementById('popup-crosshair-y');
        const priceLabel = document.getElementById('popup-price-label');

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const hovered = candlePositions.find(cp => mouseX >= cp.x && mouseX <= cp.xEnd);

            if (hovered && mouseY < chartHeight) {
                crosshairX.style.display = 'block';
                crosshairY.style.display = 'block';
                crosshairX.style.left = `${mouseX}px`;
                crosshairY.style.top = `${mouseY}px`;

                const price = maxHigh - (mouseY / chartHeight) * range;
                priceLabel.style.display = 'block';
                priceLabel.style.top = `${mouseY - 10}px`;
                priceLabel.textContent = price.toFixed(2);

                const c = hovered.data;
                const bullish = c.close >= c.open;
                tooltip.innerHTML = `
                    <div class="tt-header ${bullish ? 'bullish' : 'bearish'}">
                        <span class="tt-symbol">${index.name}</span>
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

    // Chart type buttons
    container.querySelectorAll('.popup-chart-tool-btn[data-popup-chart-type]').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.popup-chart-tool-btn[data-popup-chart-type]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            popupChartType = btn.dataset.popupChartType;
            renderPopupChart();
        });
    });

    // Timeframe buttons
    container.querySelectorAll('.popup-tf-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.popup-tf-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            popupTimeframe = btn.dataset.popupTf;
            renderPopupChart();
        });
    });

    // Zoom controls
    document.getElementById('popup-zoom-in')?.addEventListener('click', () => {
        popupZoom = Math.min(5, popupZoom * 1.2);
        renderPopupChart();
    });
    document.getElementById('popup-zoom-out')?.addEventListener('click', () => {
        popupZoom = Math.max(0.2, popupZoom / 1.2);
        renderPopupChart();
    });
    document.getElementById('popup-zoom-reset')?.addEventListener('click', () => {
        popupZoom = 1.0;
        renderPopupChart();
    });

    // Wheel zoom
    const chartWrapper = document.getElementById('popup-chart-wrapper');
    chartWrapper?.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        if (e.deltaY < 0) popupZoom = Math.min(5, popupZoom + zoomSpeed);
        else popupZoom = Math.max(0.2, popupZoom - zoomSpeed);
        renderPopupChart();
    }, { passive: false });

    renderPopupChart();
}

function generatePopupCandleData(count, timeframe, baseValue) {
    let price = baseValue * 0.97 + Math.random() * baseValue * 0.03;
    const data = [];
    const now = Date.now();
    let timeStep = 1000 * 60 * 60 * 4;
    if (timeframe === '15m') timeStep = 1000 * 60 * 15;
    else if (timeframe === '1h') timeStep = 1000 * 60 * 60;
    else if (timeframe === '1d') timeStep = 1000 * 60 * 60 * 24;
    else if (timeframe === '1w') timeStep = 1000 * 60 * 60 * 24 * 7;

    for (let i = 0; i < count; i++) {
        const open = price;
        const volatility = baseValue * 0.004 + Math.random() * baseValue * 0.006;
        const trend = Math.sin(i / 8) * 0.3 + (Math.random() - 0.48);
        const change = trend * volatility;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * baseValue * 0.003;
        const low = Math.min(open, close) - Math.random() * baseValue * 0.003;
        price = close;
        const timestamp = now - (count - i) * timeStep;
        data.push({ open, close, high, low, timestamp, volume: 30 + Math.random() * 70 });
    }
    return data;
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
    const filterBtns = document.querySelectorAll('.world-stocks-section .filter-btn');
    const searchInput = document.getElementById('world-stock-search');

    const applyFilters = () => {
        const activeFilter = document.querySelector('.world-stocks-section .filter-btn.active')?.dataset.filter || 'all';
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const rows = document.querySelectorAll('.modern-stock-row');

        rows.forEach(row => {
            const category = row.dataset.category;
            const ticker = row.querySelector('.ticker-text')?.textContent.toLowerCase() || '';
            const name = row.querySelector('.company-full-name')?.textContent.toLowerCase() || '';

            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = ticker.includes(searchTerm) || name.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                row.style.display = 'grid';
            } else {
                row.style.display = 'none';
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

let worldSortState = { field: null, direction: 'asc' };

function setupWorldStockSorting() {
    const headers = document.querySelectorAll('.table-head .th-col.sortable');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const field = header.dataset.sort;

            // Toggle direction
            if (worldSortState.field === field) {
                worldSortState.direction = worldSortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                worldSortState.field = field;
                worldSortState.direction = 'asc';
            }

            // Update icons
            headers.forEach(h => {
                const icon = h.querySelector('i');
                if (h === header) {
                    icon.className = `fa-solid fa-sort-${worldSortState.direction === 'asc' ? 'up' : 'down'}`;
                } else {
                    icon.className = 'fa-solid fa-sort';
                }
            });

            sortWorldStocks(field, worldSortState.direction);
        });
    });
}

function sortWorldStocks(field, direction) {
    const parseMcap = (val) => {
        const num = parseFloat(val);
        if (val.includes('T')) return num * 1000000;
        if (val.includes('B')) return num * 1000;
        return num;
    };

    WORLD_STOCKS.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (field === 'mcap') {
            valA = parseMcap(valA);
            valB = parseMcap(valB);
        }

        if (typeof valA === 'string') {
            return direction === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        } else {
            return direction === 'asc' ? valA - valB : valB - valA;
        }
    });

    // Re-render
    const tableBody = document.getElementById('world-stocks-table-body');
    if (tableBody) {
        tableBody.innerHTML = renderWorldStocks();
        // Filters should be reapplied if search/category is active
        const searchInput = document.getElementById('world-stock-search');
        if (searchInput && searchInput.value) {
            // Trigger input event to re-apply filters
            searchInput.dispatchEvent(new Event('input'));
        } else {
            // Just apply current active filter if any
            const activeFilter = document.querySelector('.world-stocks-section .filter-btn.active');
            if (activeFilter && activeFilter.dataset.filter !== 'all') {
                activeFilter.click();
            }
        }
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

    // Social & Chat Interactions
    const chatInput = document.getElementById('stock-chat-input');
    const btnChatSend = document.querySelector('.btn-chat-send');
    const chatBox = document.getElementById('tv-chat-box');

    const sendChatMessage = () => {
        if (!chatInput || !chatInput.value.trim()) return;

        const msg = document.createElement('div');
        msg.className = 'chat-msg me';
        msg.innerHTML = `<span class="u">Siz</span><span class="m">${chatInput.value}</span>`;
        chatBox.appendChild(msg);
        chatInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    btnChatSend?.addEventListener('click', sendChatMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    // News placeholders
    chartView.querySelectorAll('.stock-news-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('.news-title').textContent;
            showNotification('Haber Başlığı', title, 'info');
        });
    });

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
                <span class="alert-symbol">Küresel Büyüme Endeksi</span>
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
    const xAxisHeight = 30;
    const volumeHeight = 40;
    const chartHeight = height - volumeHeight - xAxisHeight - 20;

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
            ctx.fillRect(x, height - xAxisHeight - volHeight - 2, candleWidth, volHeight);
        });

        // Price Axis line
        ctx.strokeStyle = '#2a2e39';
        ctx.beginPath();
        ctx.moveTo(width - 60, 0);
        ctx.lineTo(width - 60, height - xAxisHeight);
        ctx.stroke();

        // X-Axis (Time) Line
        ctx.strokeStyle = '#2a2e39';
        ctx.beginPath();
        ctx.moveTo(0, height - xAxisHeight);
        ctx.lineTo(width, height - xAxisHeight);
        ctx.stroke();

        // Time Axis Labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';

        const labelInterval = Math.max(1, Math.floor(candles.length / 8));
        candles.forEach((c, i) => {
            if (i % labelInterval === 0) {
                const x = i * (candleWidth + gap) + 20 + candleWidth / 2;
                const date = new Date(c.timestamp);
                let label = '';

                if (currentTimeframe === '15m' || currentTimeframe === '1h' || currentTimeframe === '4h') {
                    label = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
                } else {
                    label = date.getDate() + ' ' + date.toLocaleString('tr-TR', { month: 'short' });
                }

                ctx.fillText(label, x, height - 10);

                // Vertical grid lines
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height - xAxisHeight);
                ctx.stroke();
            }
        });

        // Volume label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('HACİM', 15, height - xAxisHeight - 5);
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
                    <span class="tt-symbol">Küresel Büyüme Endeksi</span>
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

function generateCandleData(count, timeframe) {
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
        { type: 'buy', asset: 'Küresel Büyüme Endeksi Fonu', amount: 1, price: 5000, time: '1 saat önce', profit: null },
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
    return STOCK_DATA.countries.find(s => s.id === stockId);
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
        const changeClass = isPositive ? 'up' : 'down';
        const changeSign = isPositive ? '+' : '';

        return `
            <div class="modern-stock-row" data-category="${stock.category}">
                <div class="td-col col-symbol">
                    <div class="stock-ticker-box">
                        <span class="ticker-text">${stock.ticker}</span>
                    </div>
                </div>
                <div class="td-col col-company">
                    <div class="company-info-cell">
                        <div class="company-logo-placeholder">${stock.name.charAt(0)}</div>
                        <span class="company-full-name">${stock.name}</span>
                    </div>
                </div>
                <div class="td-col col-price">
                    <span class="price-val">$${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="td-col col-change">
                    <div class="change-pill ${changeClass}">
                        <i class="fa-solid fa-arrow-${isPositive ? 'up' : 'down'}"></i>
                        <span>${changeSign}${stock.change}%</span>
                    </div>
                </div>
                <div class="td-col col-cap">
                    <span class="cap-val">$${stock.mcap}</span>
                </div>
                <div class="td-col col-country">
                    <div class="country-cell">
                        <span class="flag-icon">${stock.flag}</span>
                        <span class="country-label">${stock.country}</span>
                    </div>
                </div>
                <div class="td-col col-action">
                    <button class="btn-buy-modern" onclick="alert('${stock.name} satın alma ekranı')">
                        <i class="fa-solid fa-cart-plus"></i> SATIN AL
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

export function getWorldStocks() {
    return WORLD_STOCKS;
}
