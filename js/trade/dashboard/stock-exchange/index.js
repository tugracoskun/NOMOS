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
                    <h1><i class="fa-solid fa-chart-line"></i> NOMOS Borsa</h1>
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

            <!-- TradingView Style Main Layout -->
            <div class="exchange-main-layout">
                <!-- Sol Panel: Grafik ve Şirketler -->
                <div class="exchange-left-panel">
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
                            </div>
                        `).join('')}
                    </div>

                    <!-- TradingView Style Chart -->
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

                    <!-- Stocks Table -->
                    <section class="stocks-section">
                        <div class="section-header">
                            <h2>Şirketler</h2>
                            <div class="section-controls">
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
                                <div class="col-chart">Grafik</div>
                                <div class="col-actions">İşlem</div>
                            </div>
                            <div class="table-body">
                                ${STOCK_DATA.companies.map(stock => renderStockRow(stock)).join('')}
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Sağ Panel: Ekonomiler, Yatırımlar, Haberler -->
                <aside class="exchange-right-panel">
                    <!-- Ülke Ekonomileri -->
                    ${renderCountryEconomies()}

                    <!-- Son Yatırımlar -->
                    ${renderRecentInvestments()}

                    <!-- Ticari Antlaşmalar -->
                    ${renderTradeAgreements()}
                </aside>
            </div>
        </div>
    `;
}

// === ADVANCED CHART (TradingView Style) ===
function renderAdvancedChart() {
    // SVG based candlestick-like chart
    const width = 800;
    const height = 250;
    const candles = generateCandleData(40);
    const maxHigh = Math.max(...candles.map(c => c.high));
    const minLow = Math.min(...candles.map(c => c.low));
    const range = maxHigh - minLow;

    const candleWidth = 16;
    const gap = 4;

    let candleSVG = candles.map((c, i) => {
        const x = i * (candleWidth + gap) + 20;
        const yHigh = height - 30 - ((c.high - minLow) / range) * (height - 60);
        const yLow = height - 30 - ((c.low - minLow) / range) * (height - 60);
        const yOpen = height - 30 - ((c.open - minLow) / range) * (height - 60);
        const yClose = height - 30 - ((c.close - minLow) / range) * (height - 60);
        const color = c.close >= c.open ? '#22c55e' : '#ef4444';
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.abs(yClose - yOpen) || 2;

        return `
            <line x1="${x + candleWidth / 2}" y1="${yHigh}" x2="${x + candleWidth / 2}" y2="${yLow}" stroke="${color}" stroke-width="1.5"/>
            <rect x="${x}" y="${bodyTop}" width="${candleWidth}" height="${bodyHeight}" fill="${color}" rx="1"/>
        `;
    }).join('');

    return `
        <svg viewBox="0 0 ${width} ${height}" class="tv-chart-svg">
            <defs>
                <linearGradient id="chartBg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e293b;stop-opacity:0.5"/>
                    <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1"/>
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#chartBg)"/>
            <!-- Grid Lines -->
            ${[0.25, 0.5, 0.75].map(pct => `
                <line x1="0" y1="${height * pct}" x2="${width}" y2="${height * pct}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
            `).join('')}
            <!-- Candles -->
            ${candleSVG}
            <!-- Volume bars at bottom -->
            ${candles.map((c, i) => {
        const x = i * (candleWidth + gap) + 20;
        const volHeight = (c.volume / 100) * 30;
        const color = c.close >= c.open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
        return `<rect x="${x}" y="${height - volHeight - 5}" width="${candleWidth}" height="${volHeight}" fill="${color}"/>`;
    }).join('')}
        </svg>
    `;
}

function generateCandleData(count) {
    let price = 12000 + Math.random() * 500;
    return Array.from({ length: count }, () => {
        const open = price;
        const change = (Math.random() - 0.48) * 100;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 30;
        const low = Math.min(open, close) - Math.random() * 30;
        price = close;
        return { open, close, high, low, volume: 30 + Math.random() * 70 };
    });
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
