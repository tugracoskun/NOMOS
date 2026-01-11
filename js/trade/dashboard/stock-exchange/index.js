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
                    <h1><i class="fa-solid fa-chart-line"></i> NOMOS Borsa</h1>
                    <div class="market-status open">
                        <span class="status-dot"></span>
                        Piyasa Açık
                    </div>
                </div>
                <div class="header-center">
                    <!-- Navigation Tabs -->
                    <div class="exchange-nav-tabs">
                        <button class="exchange-nav-btn active" data-view="chart">
                            <i class="fa-solid fa-chart-candlestick"></i>
                            <span>Grafik</span>
                        </button>
                        <button class="exchange-nav-btn" data-view="stocks">
                            <i class="fa-solid fa-building"></i>
                            <span>Şirketler</span>
                        </button>
                        <button class="exchange-nav-btn" data-view="funds">
                            <i class="fa-solid fa-coins"></i>
                            <span>Fonlar</span>
                        </button>
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

            <!-- Main Layout with Views -->
            <div class="exchange-main-layout">
                <!-- Sol Panel: İçerik Görünümleri -->
                <div class="exchange-left-panel">

                    <!-- VIEW: Chart (Default) -->
                    <div class="exchange-view-panel active" id="view-chart">
                        <div class="tv-chart-container">
                            <div class="chart-header">
                                <div class="chart-symbol">
                                    <span class="symbol">NOMOS 100</span>
                                    <span class="price">12,458.32</span>
                                    <span class="change positive">+1.34%</span>
                                </div>
                                <div class="chart-timeframes">
                                    <button class="tf-btn">1S</button>
                                    <button class="tf-btn">1G</button>
                                    <button class="tf-btn active">1H</button>
                                    <button class="tf-btn">1A</button>
                                    <button class="tf-btn">Tümü</button>
                                </div>
                            </div>
                            <div class="chart-area">
                                ${renderAdvancedChart()}
                            </div>
                            <div class="chart-footer">
                                <div class="chart-stats">
                                    <div class="stat"><span class="label">Açılış</span><span class="val">12,280</span></div>
                                    <div class="stat"><span class="label">Yüksek</span><span class="val text-green">12,520</span></div>
                                    <div class="stat"><span class="label">Düşük</span><span class="val text-red">12,195</span></div>
                                    <div class="stat"><span class="label">Hacim</span><span class="val">2.4M</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- VIEW: Stocks -->
                    <div class="exchange-view-panel" id="view-stocks">
                        <section class="stocks-section">
                            <div class="section-header">
                                <h2>Şirket Hisseleri</h2>
                                <div class="section-controls">
                                    <input type="text" class="search-input" placeholder="Hisse ara..." id="stock-search">
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
                                <div class="table-body" id="stocks-table-body">
                                    ${STOCK_DATA.companies.map(stock => renderStockRow(stock)).join('')}
                                </div>
                            </div>
                        </section>
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
                </div>

                <!-- Sağ Panel: Bilgiler ve İndeksler -->
                <aside class="exchange-right-panel">
                    <!-- Üst Satır: Son Yatırımlar ve Ülke Ekonomileri -->
                    <div class="right-panel-row">
                        ${renderRecentInvestments()}
                        ${renderCountryEconomies()}
                    </div>
                    <!-- Ticari Antlaşmalar -->
                    <div class="right-panel-full">
                        ${renderTradeAgreements()}
                    </div>
                    <!-- Endeksler (3 küçük kart) -->
                    <div class="right-panel-indices">
                        ${STOCK_DATA.indices.map(index => `
                            <div class="index-mini-card ${index.change >= 0 ? 'positive' : 'negative'}">
                                <div class="index-mini-name">${index.name}</div>
                                <div class="index-mini-value">${index.value.toLocaleString()}</div>
                                <div class="index-mini-change">
                                    <i class="fa-solid fa-${index.change >= 0 ? 'caret-up' : 'caret-down'}"></i>
                                    ${index.change >= 0 ? '+' : ''}${index.change}%
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </aside>
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
        });
    });
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
export function initInteractiveChart() {
    const canvas = document.getElementById('tv-chart-canvas');
    if (!canvas) return;

    const wrapper = document.getElementById('tv-chart-wrapper');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width || 800;
    canvas.height = rect.height || 280;

    const width = canvas.width;
    const height = canvas.height;
    const chartHeight = height - 60; // Leave space for volume
    const volumeHeight = 40;

    // Generate candle data
    const candles = generateCandleData(50);
    const maxHigh = Math.max(...candles.map(c => c.high));
    const minLow = Math.min(...candles.map(c => c.low));
    const range = maxHigh - minLow;
    const maxVolume = Math.max(...candles.map(c => c.volume));

    const candleWidth = Math.floor((width - 80) / candles.length) - 2;
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
                ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
                ctx.fillRect(x - 2, 0, candleWidth + 4, chartHeight);
            }

            // Wick
            ctx.strokeStyle = bullish ? '#22c55e' : '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x + candleWidth / 2, yHigh);
            ctx.lineTo(x + candleWidth / 2, yLow);
            ctx.stroke();

            // Body
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

            // Volume bar
            const volHeight = (c.volume / maxVolume) * volumeHeight;
            ctx.fillStyle = bullish ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';
            ctx.fillRect(x, height - volHeight - 5, candleWidth, volHeight);
        });

        // Volume label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('VOL', 5, height - 10);
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

    for (let i = 0; i < count; i++) {
        const open = price;
        const volatility = 50 + Math.random() * 80;
        const trend = Math.sin(i / 8) * 0.3 + (Math.random() - 0.48);
        const change = trend * volatility;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 40;
        const low = Math.min(open, close) - Math.random() * 40;
        price = close;
        data.push({
            open,
            close,
            high,
            low,
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
