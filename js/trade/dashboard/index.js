// TRADE DASHBOARD - MAIN CONTROLLER
// Ana ticaret dashboard kontrolcüsü - Şirket yönetimi ve borsa entegrasyonu

import { getGameState } from '../../data/state.js';
import { marketState, initMarket } from '../../data/market.js';
import { renderMyCompanySection } from './my-company/index.js';
import { renderStockExchangeSection } from './stock-exchange/index.js';
import { renderMarketNews } from './news/index.js';
import { renderShipmentTracker } from './logistics/index.js';
import { loadPlayerCompany, getPlayerCompany } from './data/company-data.js';
import { loadShipments } from './data/shipment-data.js';

// Dashboard State
let dashboardState = {
    activeTab: 'overview', // 'overview', 'company', 'exchange', 'logistics'
    companyData: null,
    shipments: [],
    marketNews: [],
    funds: []
};

// === MAIN RENDER ===
export function renderTradeDashboard(container) {
    // Load CSS
    loadDashboardStyles();

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
}

// === LOAD STYLES ===
function loadDashboardStyles() {
    if (!document.getElementById('trade-dashboard-style')) {
        const link = document.createElement('link');
        link.id = 'trade-dashboard-style';
        link.rel = 'stylesheet';
        link.href = 'css/trade-dashboard.css';
        document.head.appendChild(link);
    }
}

// === GENERATE DASHBOARD HTML ===
function generateDashboardHTML() {
    const gameState = getGameState();
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
                    <div class="header-tabs">
                        <button class="tab-btn active" data-tab="overview">
                            <i class="fa-solid fa-gauge-high"></i>
                            Genel Bakış
                        </button>
                        <button class="tab-btn" data-tab="company">
                            <i class="fa-solid fa-building"></i>
                            Şirketim
                        </button>
                        <button class="tab-btn" data-tab="exchange">
                            <i class="fa-solid fa-chart-line"></i>
                            Borsa
                        </button>
                        <button class="tab-btn" data-tab="logistics">
                            <i class="fa-solid fa-truck-fast"></i>
                            Lojistik
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
                ${renderOverviewTab()}
            </div>
        </div>
    `;
}

// === OVERVIEW TAB (Default View) ===
function renderOverviewTab() {
    return `
        <div class="dashboard-grid overview-compact">
            <!-- Sol Panel: Haberler & Lojistik (Eşit Yükseklik) -->
            <aside class="dashboard-left-panel">
                <!-- Piyasa Haberleri -->
                <div class="news-widget compact">
                    ${renderMarketNews(dashboardState.marketNews, true)}
                </div>

                <!-- Aktif Kargolar -->
                <div class="logistics-widget compact">
                    ${renderShipmentTracker(dashboardState.shipments, true)}
                </div>
            </aside>

            <!-- Sağ Panel: Şirket & Borsa -->
            <section class="dashboard-right-panel">
                <!-- Şirketim Özeti -->
                <div class="company-widget">
                    ${renderMyCompanySection(dashboardState.companyData, true)}
                </div>

                <!-- Borsa Widget -->
                <div class="exchange-widget">
                    ${renderStockExchangeSection(true)}
                </div>
            </section>
        </div>
    `;
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
    setupTabSpecificEvents(container, 'overview');
}

// Tab-specific event handlers
function setupTabSpecificEvents(container, tabId) {
    // Delegate to appropriate module based on tab
    switch (tabId) {
        case 'company':
            // Company module handles its own events
            break;
        case 'exchange':
            // Exchange module handles its own events
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
