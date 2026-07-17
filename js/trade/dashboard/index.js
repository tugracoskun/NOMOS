// TRADE DASHBOARD - MAIN CONTROLLER
// Ana ticaret dashboard kontrolcüsü - Şirket yönetimi ve borsa entegrasyonu

import { getGameState } from '../../data/state.js';
import { marketState, initMarket } from '../../data/market.js';
import { renderMyCompanySection, setupCompanyEventHandlers } from './my-company/index.js';
import { renderStockExchangeSection, initInteractiveChart, setupExchangeViewNav } from './stock-exchange/index.js';
import { renderMarketNews } from './news/index.js';
import { renderShipmentTracker } from './logistics/index.js';
import { renderCommodityExchangeWidget, renderCommodityExchangeSection, setupCommodityExchangeEvents } from './commodity-exchange/index.js';
import { loadPlayerCompany, getPlayerCompany } from './data/company-data.js';
import { loadShipments } from './data/shipment-data.js';

// Dashboard State
let dashboardState = {
    activeTab: 'overview', // 'overview', 'company', 'exchange', 'commodity', 'logistics'
    companyData: null,
    shipments: [],
    marketNews: [],
    funds: []
};

// === MAIN RENDER ===
export function renderTradeDashboard(container) {
    // Show loading state first
    container.innerHTML = `
        <div class="trade-dashboard" style="min-height: 400px; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center; color: #64748b;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>Yükleniyor...</p>
            </div>
        </div>
    `;

    // Load CSS and wait for it
    loadDashboardStyles(() => {
        // Initialize data
        initMarket();
        dashboardState.companyData = loadPlayerCompany();
        dashboardState.shipments = loadShipments();

        // Render main structure
        container.innerHTML = generateDashboardHTML();

        // Setup event listeners
        setupDashboardEvents(container);

        // Start real-time updates
        startDashboardTicker();
    });
}

// === LOAD STYLES ===
function loadDashboardStyles(callback) {
    const existingLink = document.getElementById('trade-dashboard-style');

    if (existingLink) {
        // CSS already loaded
        if (callback) callback();
        return;
    }

    const link = document.createElement('link');
    link.id = 'trade-dashboard-style';
    link.rel = 'stylesheet';
    link.href = 'css/trade-dashboard.css';

    // Wait for CSS to load
    link.onload = () => {
        if (callback) callback();
    };

    // Fallback: if onload doesn't fire, continue after a short delay
    setTimeout(() => {
        if (callback) callback();
    }, 100);

    document.head.appendChild(link);
}

// === GENERATE DASHBOARD HTML ===
function generateDashboardHTML() {
    const company = dashboardState.companyData;

    return `
        <div class="trade-dashboard">
            <!-- Dashboard Header -->
            <header class="dashboard-header">
                <div class="header-left">
                    <h1 class="dashboard-title">
                        <i class="fa-solid fa-building-columns"></i>
                        Ticaret Merkezi
                    </h1>
                    <div class="header-tabs futuristic">
                        <button class="tab-btn ${dashboardState.activeTab === 'overview' ? 'active' : ''}" data-tab="overview" title="Genel Bakış">
                            <div class="tab-icon"><i class="fa-solid fa-gauge-high"></i></div>
                            <span class="tab-label">Genel</span>
                        </button>
                        <button class="tab-btn ${dashboardState.activeTab === 'company' ? 'active' : ''}" data-tab="company" title="Şirketim">
                            <div class="tab-icon"><i class="fa-solid fa-building"></i></div>
                            <span class="tab-label">Şirket</span>
                        </button>
                        <button class="tab-btn ${dashboardState.activeTab === 'exchange' ? 'active' : ''}" data-tab="exchange" title="Borsa">
                            <div class="tab-icon"><i class="fa-solid fa-chart-line"></i></div>
                            <span class="tab-label">Borsa</span>
                        </button>
                        <button class="tab-btn ${dashboardState.activeTab === 'commodity' ? 'active' : ''}" data-tab="commodity" title="Emtia Ticareti">
                            <div class="tab-icon"><i class="fa-solid fa-scale-balanced"></i></div>
                            <span class="tab-label">Emtia</span>
                        </button>
                        <button class="tab-btn ${dashboardState.activeTab === 'logistics' ? 'active' : ''}" data-tab="logistics" title="Lojistik">
                            <div class="tab-icon"><i class="fa-solid fa-truck-fast"></i></div>
                            <span class="tab-label">Lojistik</span>
                        </button>
                    </div>
                </div>
                
                <div class="header-right">
                </div>
            </header>

            <!-- Main Dashboard Content -->
            <div class="dashboard-content" id="dashboard-content">
                ${renderTabContent(dashboardState.activeTab)}
            </div>
        </div>
    `;
}

// === OVERVIEW TAB (Default View) ===
function renderOverviewTab() {
    return `
        <div class="dashboard-grid overview-compact-v2">
            <!-- Sol Sütun: Piyasa/Yatırımlar Sekmeli + Kargo -->
            <div class="overview-column col-left">
                <div class="widget-card trade-tabbed-widget" style="flex:1; min-height:0;">
                    <div class="trade-widget-tabs">
                        <button class="trade-widget-tab active" data-trade-tab="news">
                            <i class="fa-solid fa-newspaper"></i> Piyasa
                        </button>
                        <button class="trade-widget-tab" data-trade-tab="investments">
                            <i class="fa-solid fa-clock-rotate-left"></i> Yatırımlar
                        </button>
                    </div>
                    <div class="trade-tab-body">
                        <div class="trade-tab-panel active" id="trade-panel-news">
                            ${renderCompactNewsV2()}
                        </div>
                        <div class="trade-tab-panel" id="trade-panel-investments">
                            ${renderCompactInvestmentsV2()}
                        </div>
                    </div>
                </div>

                <!-- Kargo Takip Mini -->
                <div class="widget-card logistics-widget-compact">
                    <div class="logistics-mini-header">
                        <h3><i class="fa-solid fa-truck-fast"></i> Kargo Takip</h3>
                    </div>
                    <div class="logistics-mini-body">
                        ${renderMiniShipments()}
                    </div>
                </div>
            </div>


            <!-- Sağ Sütun: Şirket + Borsa -->
            <div class="overview-column col-right">
                <div class="widget-card company-widget-compact">
                    ${renderMyCompanySection(dashboardState.companyData, true)}
                </div>
                <div class="widget-card exchange-widget-compact">
                    ${renderStockExchangeSection(true)}
                </div>
            </div>
        </div>
    `;
}

// Kompakt Haberler v2
function renderCompactNewsV2() {
    const news = [
        { type: 'breaking', title: 'Petrol Fiyatlarında Rekor Artış', time: '5 dk', impact: 'negative' },
        { type: 'market', title: 'Altın Güvenli Liman Olarak Parladı', time: '15 dk', impact: 'positive' },
        { type: 'trade', title: 'Türkiye-AB Ticaret Görüşmeleri', time: '1 saat', impact: 'positive' },
        { type: 'economy', title: 'Merkez Bankası Faiz Kararı', time: '2 saat', impact: 'neutral' },
        { type: 'market', title: 'Kripto Piyasası Toparlandı', time: '3 saat', impact: 'positive' },
        { type: 'breaking', title: 'Enerji Krizi Derinleşiyor', time: '5 saat', impact: 'negative' },
        { type: 'trade', title: 'Çin İhracatta Rekor Kırdı', time: '8 saat', impact: 'positive' }
    ];

    const icons = {
        breaking: 'fa-bolt',
        market: 'fa-chart-line',
        trade: 'fa-handshake',
        economy: 'fa-landmark'
    };

    return news.map(n => `
        <div class="compact-news-item-v2">
            <div class="news-icon-v2 ${n.type}">
                <i class="fa-solid ${icons[n.type]}"></i>
            </div>
            <div class="news-content-v2">
                <span class="news-title-v2">${n.title}</span>
                <span class="news-time-v2">${n.time}</span>
            </div>
            <div class="news-impact-v2 ${n.impact}">
                <i class="fa-solid fa-${n.impact === 'positive' ? 'arrow-up' : n.impact === 'negative' ? 'arrow-down' : 'minus'}"></i>
            </div>
        </div>
    `).join('');
}

// Kompakt Yatırımlar v2
function renderCompactInvestmentsV2() {
    const investments = [
        { type: 'buy', asset: 'TKN', amount: 500, price: 71250, time: '2 dk' },
        { type: 'sell', asset: 'ENP', amount: 200, price: 17840, time: '15 dk' },
        { type: 'dividend', asset: 'MNC', amount: null, price: 450, time: '1 saat' },
        { type: 'buy', asset: 'NOMOS 100', amount: 1, price: 5000, time: '3 saat' },
        { type: 'sell', asset: 'GLD', amount: 100, price: 8750, time: '5 saat' },
        { type: 'buy', asset: 'OIL', amount: 300, price: 18960, time: '8 saat' }
    ];

    return investments.map(inv => `
        <div class="compact-inv-item-v2 ${inv.type}">
            <div class="inv-icon-v2 ${inv.type === 'buy' ? 'buy-icon' : inv.type === 'sell' ? 'sell-icon' : 'div-icon'}">
                <i class="fa-solid fa-${inv.type === 'buy' ? 'arrow-down' : inv.type === 'sell' ? 'arrow-up' : 'coins'}"></i>
            </div>
            <div class="inv-details-v2">
                <span class="inv-name-v2">${inv.asset}</span>
                <span class="inv-desc-v2">${inv.type === 'buy' ? 'Alım' : inv.type === 'sell' ? 'Satım' : 'Temettü'}</span>
            </div>
            <div class="inv-amount-v2">
                <span class="inv-price-v2">${inv.price.toLocaleString()} ₳</span>
                <span class="inv-time-v2">${inv.time}</span>
            </div>
        </div>
    `).join('');
}

// Mini Kargo
function renderMiniShipments() {
    const shipments = dashboardState.shipments;
    if (!shipments || shipments.length === 0) {
        return '<div style="color:var(--text-muted); font-size:0.72rem; padding:8px;">Aktif kargo yok</div>';
    }

    const statusIcons = {
        in_transit: { icon: 'fa-truck', cls: 'transit', label: 'Yolda' },
        delivered: { icon: 'fa-check', cls: 'delivered', label: 'Teslim' },
        pending: { icon: 'fa-clock', cls: 'pending', label: 'Bekliyor' }
    };

    return shipments.slice(0, 6).map(s => {
        const st = statusIcons[s.status] || statusIcons.pending;
        return `
            <div class="shipment-mini-item">
                <i class="fa-solid ${st.icon} shipment-mini-icon ${st.cls}"></i>
                <span class="shipment-mini-route">${s.origin || '?'} → ${s.destination || '?'}</span>
                <span class="shipment-mini-status" style="color:var(--accent-${st.cls === 'transit' ? 'blue' : st.cls === 'delivered' ? 'green' : 'yellow'})">${st.label}</span>
            </div>
        `;
    }).join('');
}

// === TAB RENDERERS ===
function renderTabContent(tabId) {
    switch (tabId) {
        case 'overview':
            return renderOverviewTab();
        case 'company':
            return renderMyCompanySection(dashboardState.companyData, false);
        case 'exchange':
            return renderStockExchangeSection(false);
        case 'commodity':
            return renderCommodityExchangeSection();
        case 'logistics':
            return renderShipmentTracker(dashboardState.shipments, false);
        default:
            return renderOverviewTab();
    }
}

// === EVENT SETUP ===
function setupDashboardEvents(container) {
    // Tab switching
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            // Update active state
            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update state
            dashboardState.activeTab = tabId;

            // Re-render content
            const contentArea = container.querySelector('#dashboard-content');
            if (contentArea) {
                contentArea.innerHTML = renderTabContent(tabId);
                setupTabSpecificEvents(contentArea, tabId);
            }
        });
    });

    // Initial tab-specific events
    setupTabSpecificEvents(container, dashboardState.activeTab);
}

// Tab-specific event handlers
function setupTabSpecificEvents(container, tabId) {
    // Haber ve yatırım butonlarına tıklama dinleyicileri (Global yetki)
    const contentArea = container.id === 'dashboard-content' ? container : container.querySelector('#dashboard-content');
    if (!contentArea) return;

    // Delegate to appropriate module based on tab
    switch (tabId) {
        case 'overview':
            // Sekmeli widget (Piyasa/Yatırımlar) tab switching
            contentArea.querySelectorAll('.trade-widget-tab').forEach(btn => {
                btn.addEventListener('click', () => {
                    const widget = btn.closest('.trade-tabbed-widget');
                    if (!widget) return;
                    widget.querySelectorAll('.trade-widget-tab').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    widget.querySelectorAll('.trade-tab-panel').forEach(p => p.classList.remove('active'));
                    const target = document.getElementById(`trade-panel-${btn.dataset.tradeTab}`);
                    if (target) target.classList.add('active');
                });
            });

            // Borsa widget -> Borsa sekmesi
            contentArea.querySelectorAll('[data-action="view-exchange"], .exchange-widget-compact').forEach(el => {
                el.style.cursor = 'pointer';
                el.addEventListener('click', (e) => {
                    if (e.target.closest('[data-action]') && e.target.closest('[data-action]') !== el) return;
                    navigateToTab('exchange');
                });
            });

            // Şirketim widget -> Şirket sekmesi
            contentArea.querySelectorAll('[data-action="view-company"], .company-widget-compact').forEach(el => {
                el.style.cursor = 'pointer';
                el.addEventListener('click', (e) => {
                    if (e.target.closest('[data-action]') && e.target.closest('[data-action]') !== el) return;
                    navigateToTab('company');
                });
            });

            // Lojistik widget -> Lojistik sekmesi
            contentArea.querySelectorAll('[data-action="view-logistics"], .logistics-widget-compact').forEach(el => {
                el.style.cursor = 'pointer';
                el.addEventListener('click', (e) => {
                    if (e.target.closest('[data-action]') && e.target.closest('[data-action]') !== el) return;
                    navigateToTab('logistics');
                });
            });

            // Ticaret türleri kartları
            contentArea.querySelectorAll('.trade-type-card').forEach(el => {
                el.style.cursor = 'pointer';
                el.addEventListener('click', () => {
                    const type = el.dataset.tradeType;
                    if (type) navigateToTab(type);
                });
            });

            // Fonlar butonu -> Borsa sekmesi + Fonlar view
            contentArea.querySelectorAll('[data-action="view-funds"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navigateToTab('exchange', 'funds');
                });
            });

            // Dünya Hisseleri butonu -> Borsa sekmesi + Dünya Hisseleri view
            contentArea.querySelectorAll('[data-action="view-world-stocks"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navigateToTab('exchange', 'world-stocks');
                });
            });
            break;
        case 'company':
            // Setup company management event handlers
            setTimeout(() => {
                setupCompanyEventHandlers();
            }, 100);
            break;
        case 'exchange':
            // Initialize interactive chart and view navigation after render
            setTimeout(() => {
                initInteractiveChart();
                setupExchangeViewNav();
            }, 100);
            break;
        case 'commodity':
            // Commodity exchange event listeners
            setupCommodityExchangeEvents(container);
            break;
        case 'logistics':
            // Logistics module handles its own events
            break;
    }
}

// Helper function to navigate between tabs
function navigateToTab(tabId, subView) {
    const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (tabBtn) {
        tabBtn.click();
        // Sub-view yönlendirmesi (ör: borsa sekmesi içindeki fonlar)
        if (subView) {
            setTimeout(() => {
                const subBtn = document.querySelector(`.exchange-nav-btn[data-view="${subView}"]`);
                if (subBtn) subBtn.click();
            }, 100);
        }
    }
}

// === REAL-TIME TICKER ===
let tickerInterval = null;

function startDashboardTicker() {
    if (tickerInterval) clearInterval(tickerInterval);

    // Update every 30 seconds
    tickerInterval = setInterval(() => {
        updateDashboardData();
    }, 30000);
}

function updateDashboardData() {
    // Refresh shipment statuses
    dashboardState.shipments = loadShipments();

    // Could trigger UI updates here if needed
    const activeTab = dashboardState.activeTab;
    if (activeTab === 'logistics') {
        const container = document.querySelector('#dashboard-content');
        if (container) {
            container.innerHTML = renderTabContent('logistics');
        }
    }
}

// Cleanup on page leave
export function destroyDashboard() {
    if (tickerInterval) {
        clearInterval(tickerInterval);
        tickerInterval = null;
    }
}

// Export state for other modules
export function getDashboardState() {
    return { ...dashboardState };
}
