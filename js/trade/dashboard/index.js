// TRADE DASHBOARD - MAIN CONTROLLER
// Ana ticaret dashboard kontrolcüsü - Şirket yönetimi ve borsa entegrasyonu

import { getGameState } from '../../data/state.js';
import { marketState, initMarket } from '../../data/market.js';
import { renderMyCompanySection } from './my-company/index.js';
import { renderStockExchangeSection } from './stock-exchange/index.js';
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
                    <div class="quick-stat">
                        <span class="stat-label">Şirket Değeri</span>
                        <span class="stat-value text-gold">${(company?.totalValue || 0).toLocaleString()} ₳</span>
                    </div>
                    <div class="quick-stat">
                        <span class="stat-label">Günlük Gelir</span>
                        <span class="stat-value text-green">+${(company?.dailyIncome || 0).toLocaleString()} ₳</span>
                    </div>
                    <div class="quick-stat">
                        <span class="stat-label">Aktif Kargo</span>
                        <span class="stat-value text-blue">${dashboardState.shipments.filter(s => s.status === 'in_transit').length}</span>
                    </div>
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
            <!-- Sol Sütun: Haberler + Son Yatırımlar -->
            <div class="overview-column col-left">
                <!-- Piyasa Haberleri (Kompakt) -->
                <div class="widget-card news-widget-compact">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-newspaper"></i> Piyasa Haberleri</h3>
                        <button class="btn-widget-action" data-action="view-news">Tümü</button>
                    </div>
                    <div class="widget-body">
                        ${renderCompactNews()}
                    </div>
                </div>

                <!-- Son Yatırımlar -->
                <div class="widget-card investments-widget-compact">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-clock-rotate-left"></i> Son Yatırımlar</h3>
                        <button class="btn-widget-action" data-action="view-investments">Tümü</button>
                    </div>
                    <div class="widget-body">
                        ${renderCompactInvestments()}
                    </div>
                </div>
            </div>

            <!-- Orta Sütun: Lojistik -->
            <div class="overview-column col-center">
                <div class="widget-card logistics-widget-compact no-header">
                    ${renderShipmentTracker(dashboardState.shipments, true)}
                </div>
            </div>

            <!-- Sağ Sütun: Şirket + Borsa -->
            <div class="overview-column col-right">
                <!-- Şirketim Özeti -->
                <div class="widget-card company-widget-compact">
                    ${renderMyCompanySection(dashboardState.companyData, true)}
                </div>

                <!-- Borsa Widget -->
                <div class="widget-card exchange-widget-compact">
                    ${renderStockExchangeSection(true)}
                </div>
            </div>
        </div>
    `;
}

// Kompakt Haberler
function renderCompactNews() {
    const news = [
        { type: 'breaking', title: 'Petrol Fiyatlarında Rekor Artış', time: '5 dk', impact: 'negative' },
        { type: 'market', title: 'Altın Güvenli Liman Olarak Parladı', time: '15 dk', impact: 'positive' },
        { type: 'trade', title: 'Türkiye-AB Ticaret Görüşmeleri', time: '1 saat', impact: 'positive' },
        { type: 'economy', title: 'Merkez Bankası Faiz Kararı', time: '2 saat', impact: 'neutral' }
    ];

    const icons = {
        breaking: 'fa-bolt',
        market: 'fa-chart-line',
        trade: 'fa-handshake',
        economy: 'fa-landmark'
    };

    return news.map(n => `
        <div class="compact-news-item">
            <div class="news-icon ${n.type}">
                <i class="fa-solid ${icons[n.type]}"></i>
            </div>
            <div class="news-content">
                <span class="news-title">${n.title}</span>
                <span class="news-time">${n.time}</span>
            </div>
            <div class="news-impact ${n.impact}">
                <i class="fa-solid fa-${n.impact === 'positive' ? 'arrow-up' : n.impact === 'negative' ? 'arrow-down' : 'minus'}"></i>
            </div>
        </div>
    `).join('');
}

// Kompakt Yatırımlar
function renderCompactInvestments() {
    const investments = [
        { type: 'buy', asset: 'TKN', amount: 500, price: 71250, time: '2 dk' },
        { type: 'sell', asset: 'ENP', amount: 200, price: 17840, time: '15 dk' },
        { type: 'dividend', asset: 'MNC', amount: null, price: 450, time: '1 saat' },
        { type: 'buy', asset: 'NOMOS 100', amount: 1, price: 5000, time: '3 saat' }
    ];

    return investments.map(inv => `
        <div class="compact-investment-item ${inv.type}">
            <div class="inv-type-icon">
                <i class="fa-solid fa-${inv.type === 'buy' ? 'arrow-down' : inv.type === 'sell' ? 'arrow-up' : 'coins'}"></i>
            </div>
            <div class="inv-details">
                <span class="inv-name">${inv.asset}</span>
                <span class="inv-desc">${inv.type === 'buy' ? 'Alım' : inv.type === 'sell' ? 'Satım' : 'Temettü'}</span>
            </div>
            <div class="inv-amount">
                <span class="inv-price">${inv.price.toLocaleString()} ₳</span>
                <span class="inv-time">${inv.time}</span>
            </div>
        </div>
    `).join('');
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
            // Overview specific actions
            contentArea.querySelectorAll('[data-action="view-news"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const exchangeTab = document.querySelector('[data-tab="exchange"]');
                    if (exchangeTab) exchangeTab.click();
                });
            });
            break;
        case 'company':
            // Company module handles its own events
            break;
            // Company module handles its own events
            break;
        case 'exchange':
            // Exchange module handles its own events
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
