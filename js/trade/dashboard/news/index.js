// MARKET NEWS SECTION
// Piyasa haberleri ve finansal gelişmeler

const NEWS_DATA = {
    breaking: [
        { id: 'news_1', type: 'breaking', title: 'Petrol Fiyatlarında Rekor Artış', summary: 'Orta Doğu gerilimi petrol fiyatlarını yükseltti.', category: 'energy', impact: 'high', trend: 'up', affectedResources: ['Petrol', 'Doğalgaz'], timestamp: Date.now() - 1000 * 60 * 15 },
        { id: 'news_2', type: 'breaking', title: 'Teknoloji Hisselerinde Rallye', summary: 'AI yatırımları teknoloji sektöründe büyüme başlattı.', category: 'tech', impact: 'high', trend: 'up', affectedResources: ['Lityum', 'Bakır'], timestamp: Date.now() - 1000 * 60 * 45 }
    ],
    market: [
        { id: 'news_3', type: 'market', title: 'Tekstil Sektöründe Büyüme', summary: 'Tekstil ihracatı %15 artış bekleniyor.', category: 'textile', impact: 'medium', trend: 'up', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
        { id: 'news_4', type: 'market', title: 'Altın Güvenli Liman', summary: 'Ekonomik belirsizlikler altın talebini artırdı.', category: 'commodities', impact: 'medium', trend: 'up', timestamp: Date.now() - 1000 * 60 * 60 * 3 }
    ]
};

export function renderMarketNews(newsData, isWidget = false) {
    const breakingNews = NEWS_DATA.breaking[0];
    const recentNews = NEWS_DATA.market.slice(0, 3);

    return `
        <div class="news-widget">
            <div class="widget-header">
                <h3><i class="fa-solid fa-newspaper"></i> Piyasa Haberleri</h3>
                <span class="live-badge"><span class="live-dot"></span>CANLI</span>
            </div>
            ${breakingNews ? `
                <div class="breaking-news-banner ${breakingNews.impact}">
                    <div class="breaking-label"><i class="fa-solid fa-bolt"></i> SON DAKİKA</div>
                    <div class="breaking-content">
                        <h4>${breakingNews.title}</h4>
                        <p>${breakingNews.summary}</p>
                        <div class="breaking-meta">
                            <span class="impact-badge ${breakingNews.trend}">
                                <i class="fa-solid fa-arrow-trend-up"></i>
                                ${breakingNews.affectedResources.join(', ')}
                            </span>
                            <span class="time">${formatTimeAgo(breakingNews.timestamp)}</span>
                        </div>
                    </div>
                </div>
            ` : ''}
            <div class="news-list">
                ${recentNews.map(news => `
                    <div class="news-item" data-news-id="${news.id}">
                        <div class="news-icon ${news.category}"><i class="fa-solid ${getCategoryIcon(news.category)}"></i></div>
                        <div class="news-content">
                            <h4>${news.title}</h4>
                            <div class="news-meta">
                                <span class="trend-indicator ${news.trend}"><i class="fa-solid fa-caret-up"></i></span>
                                <span class="time">${formatTimeAgo(news.timestamp)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="market-pulse">
                <div class="pulse-header"><span>Piyasa Nabzı</span><span class="pulse-status positive">Olumlu</span></div>
                <div class="pulse-indicators">
                    <div class="pulse-indicator"><div class="indicator-bar" style="--value: 65%; --color: #22c55e"><div class="bar-fill"></div></div><div class="indicator-label"><span>Boğa</span><span class="value">65%</span></div></div>
                    <div class="pulse-indicator"><div class="indicator-bar" style="--value: 35%; --color: #ef4444"><div class="bar-fill"></div></div><div class="indicator-label"><span>Ayı</span><span class="value">35%</span></div></div>
                </div>
            </div>
            <div class="widget-footer">
                <button class="btn-widget" data-action="view-all-news"><i class="fa-solid fa-newspaper"></i> Tüm Haberler</button>
            </div>
        </div>
    `;
}

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Az önce';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} dk önce`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} saat önce`;
    return `${Math.floor(seconds / 86400)} gün önce`;
}

function getCategoryIcon(category) {
    const icons = { energy: 'fa-bolt', tech: 'fa-microchip', textile: 'fa-shirt', commodities: 'fa-gem', agriculture: 'fa-wheat-awn' };
    return icons[category] || 'fa-newspaper';
}

export function getNewsData() { return NEWS_DATA; }
