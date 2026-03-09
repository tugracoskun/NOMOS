// DÜNYA İSTATİSTİKLERİ - AGE OF HISTORY II TARZI DİKEY BAR CHART
// Tam ekran overlay, bayraklı dikey barlar, kıta renkleri

// ============================
// ÜLKE VERİLERİ
// ============================
const countryData = [
    { id: 'tr', name: 'Türkiye', flag: 'https://flagcdn.com/w80/tr.png', continent: 'Avrupa', population: 85000000, gdp: 900, tech: 0.75, infra: 7, buildings: 12, military: 650000 },
    { id: 'us', name: 'ABD', flag: 'https://flagcdn.com/w80/us.png', continent: 'Kuzey Amerika', population: 331000000, gdp: 23000, tech: 0.98, infra: 9, buildings: 48, military: 1400000 },
    { id: 'ru', name: 'Rusya', flag: 'https://flagcdn.com/w80/ru.png', continent: 'Avrupa', population: 144000000, gdp: 1700, tech: 0.85, infra: 6, buildings: 28, military: 1150000 },
    { id: 'de', name: 'Almanya', flag: 'https://flagcdn.com/w80/de.png', continent: 'Avrupa', population: 83000000, gdp: 4200, tech: 0.92, infra: 9, buildings: 35, military: 183000 },
    { id: 'fr', name: 'Fransa', flag: 'https://flagcdn.com/w80/fr.png', continent: 'Avrupa', population: 67000000, gdp: 2900, tech: 0.88, infra: 8, buildings: 30, military: 205000 },
    { id: 'cn', name: 'Çin', flag: 'https://flagcdn.com/w80/cn.png', continent: 'Asya', population: 1400000000, gdp: 17700, tech: 0.90, infra: 8, buildings: 52, military: 2000000 },
    { id: 'jp', name: 'Japonya', flag: 'https://flagcdn.com/w80/jp.png', continent: 'Asya', population: 125000000, gdp: 4900, tech: 0.95, infra: 10, buildings: 40, military: 247000 },
    { id: 'gb', name: 'İngiltere', flag: 'https://flagcdn.com/w80/gb.png', continent: 'Avrupa', population: 67000000, gdp: 3100, tech: 0.91, infra: 8, buildings: 32, military: 153000 },
    { id: 'br', name: 'Brezilya', flag: 'https://flagcdn.com/w80/br.png', continent: 'Güney Amerika', population: 214000000, gdp: 1600, tech: 0.60, infra: 5, buildings: 18, military: 360000 },
    { id: 'in', name: 'Hindistan', flag: 'https://flagcdn.com/w80/in.png', continent: 'Asya', population: 1400000000, gdp: 3700, tech: 0.72, infra: 5, buildings: 22, military: 1455000 },
    { id: 'kr', name: 'G. Kore', flag: 'https://flagcdn.com/w80/kr.png', continent: 'Asya', population: 51000000, gdp: 1800, tech: 0.94, infra: 9, buildings: 28, military: 555000 },
    { id: 'it', name: 'İtalya', flag: 'https://flagcdn.com/w80/it.png', continent: 'Avrupa', population: 59000000, gdp: 2100, tech: 0.82, infra: 7, buildings: 25, military: 165000 },
    { id: 'au', name: 'Avustralya', flag: 'https://flagcdn.com/w80/au.png', continent: 'Okyanusya', population: 26000000, gdp: 1500, tech: 0.88, infra: 8, buildings: 20, military: 59000 },
    { id: 'ca', name: 'Kanada', flag: 'https://flagcdn.com/w80/ca.png', continent: 'Kuzey Amerika', population: 38000000, gdp: 2000, tech: 0.90, infra: 8, buildings: 22, military: 72000 },
    { id: 'sa', name: 'S. Arabistan', flag: 'https://flagcdn.com/w80/sa.png', continent: 'Asya', population: 35000000, gdp: 833, tech: 0.70, infra: 8, buildings: 15, military: 257000 },
    { id: 'eg', name: 'Mısır', flag: 'https://flagcdn.com/w80/eg.png', continent: 'Afrika', population: 104000000, gdp: 404, tech: 0.50, infra: 4, buildings: 10, military: 438000 },
    { id: 'mx', name: 'Meksika', flag: 'https://flagcdn.com/w80/mx.png', continent: 'Kuzey Amerika', population: 128000000, gdp: 1300, tech: 0.62, infra: 5, buildings: 16, military: 277000 },
    { id: 'id', name: 'Endonezya', flag: 'https://flagcdn.com/w80/id.png', continent: 'Asya', population: 273000000, gdp: 1200, tech: 0.55, infra: 4, buildings: 14, military: 395000 },
    { id: 'pl', name: 'Polonya', flag: 'https://flagcdn.com/w80/pl.png', continent: 'Avrupa', population: 38000000, gdp: 674, tech: 0.78, infra: 7, buildings: 18, military: 114000 },
    { id: 'za', name: 'G. Afrika', flag: 'https://flagcdn.com/w80/za.png', continent: 'Afrika', population: 60000000, gdp: 405, tech: 0.58, infra: 5, buildings: 12, military: 73000 },
    { id: 'ng', name: 'Nijerya', flag: 'https://flagcdn.com/w80/ng.png', continent: 'Afrika', population: 218000000, gdp: 477, tech: 0.38, infra: 3, buildings: 8, military: 223000 },
    { id: 'ar', name: 'Arjantin', flag: 'https://flagcdn.com/w80/ar.png', continent: 'Güney Amerika', population: 46000000, gdp: 641, tech: 0.65, infra: 5, buildings: 14, military: 107000 },
    { id: 'se', name: 'İsveç', flag: 'https://flagcdn.com/w80/se.png', continent: 'Avrupa', population: 10000000, gdp: 585, tech: 0.93, infra: 9, buildings: 20, military: 24000 },
    { id: 'no', name: 'Norveç', flag: 'https://flagcdn.com/w80/no.png', continent: 'Avrupa', population: 5400000, gdp: 482, tech: 0.91, infra: 10, buildings: 18, military: 23000 },
    { id: 'pk', name: 'Pakistan', flag: 'https://flagcdn.com/w80/pk.png', continent: 'Asya', population: 230000000, gdp: 376, tech: 0.42, infra: 3, buildings: 9, military: 654000 },
];

// Kıta renkleri (AoH2 tarzı)
const continentColors = {
    'Afrika': { bar: '#d4a574', barLight: '#e0be98' },
    'Asya': { bar: '#c8b642', barLight: '#d4c85e' },
    'Avrupa': { bar: '#d48c2e', barLight: '#e0a34a' },
    'Güney Amerika': { bar: '#3dab5c', barLight: '#52c472' },
    'Kuzey Amerika': { bar: '#4a8ddb', barLight: '#6aa4e6' },
    'Okyanusya': { bar: '#7a7a7a', barLight: '#969696' },
};

// Kategori tanımları
const categories = {
    population: {
        name: 'Nüfus',
        key: 'population',
        format: (v) => {
            if (v >= 1e9) return (v / 1e9).toFixed(1) + 'Mr';
            if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
            if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
            return v.toString();
        },
        rawFormat: (v) => v.toLocaleString('tr-TR'),
    },
    economy: {
        name: 'Ekonomi',
        key: 'gdp',
        format: (v) => {
            if (v >= 1000) return (v / 1000).toFixed(1) + ' Tn $';
            return v + ' Mr $';
        },
        rawFormat: (v) => v.toLocaleString('tr-TR') + ' Mr $',
    },
    technology: {
        name: 'Teknoloji',
        key: 'tech',
        format: (v) => (v * 100).toFixed(0) + '%',
        rawFormat: (v) => '%' + (v * 100).toFixed(1),
    },
    infrastructure: {
        name: 'Altyapı',
        key: 'infra',
        format: (v) => v + '/10',
        rawFormat: (v) => v + '/10',
    },
    buildings: {
        name: 'Binalar',
        key: 'buildings',
        format: (v) => v.toString(),
        rawFormat: (v) => v.toString(),
    },
    military: {
        name: 'Askeri Güç',
        key: 'military',
        format: (v) => {
            if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
            if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
            return v.toString();
        },
        rawFormat: (v) => v.toLocaleString('tr-TR'),
    },
};

let currentCategory = 'population';

// ============================
// EN BÜYÜK ÜRETİCİLER VERİSİ
// ============================
const producersData = [
    { resource: 'Petrol', icon: '🛢️', effect: 'Ordu Bakımı: -5%', effectColor: '#f87171', production: '295310 / 1127420', share: 26, country: 'S. Arabistan', flag: 'https://flagcdn.com/w80/sa.png' },
    { resource: 'Doğalgaz', icon: '🔥', effect: 'Enerji Üretimi: +15%', effectColor: '#4ade80', production: '184200 / 612800', share: 30, country: 'Rusya', flag: 'https://flagcdn.com/w80/ru.png' },
    { resource: 'Uranyum', icon: '☢️', effect: 'Nükleer Güç: +20%', effectColor: '#4ade80', production: '52300 / 186700', share: 28, country: 'Kanada', flag: 'https://flagcdn.com/w80/ca.png' },
    { resource: 'Altın', icon: '🥇', effect: 'Hazine Geliri: +10%', effectColor: '#fbbf24', production: '179202 / 1125614', share: 15, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Pırlanta', icon: '💎', effect: 'Lüks Ticaret: +12%', effectColor: '#4ade80', production: '89400 / 342600', share: 26, country: 'G. Afrika', flag: 'https://flagcdn.com/w80/za.png' },
    { resource: 'Demir', icon: '⛏️', effect: 'İnşaat Maliyeti: -5%', effectColor: '#f87171', production: '862858 / 5779648', share: 14, country: 'Avustralya', flag: 'https://flagcdn.com/w80/au.png' },
    { resource: 'Bakır', icon: '🔶', effect: 'Elektronik Üretimi: +8%', effectColor: '#4ade80', production: '206788 / 1114150', share: 18, country: 'Şili', flag: 'https://flagcdn.com/w80/cl.png' },
    { resource: 'Buğday', icon: '🌾', effect: 'Nüfus Büyümesi: +3%', effectColor: '#4ade80', production: '999797 / 7370425', share: 13, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Pamuk', icon: '🧶', effect: 'Tekstil Geliri: +10%', effectColor: '#4ade80', production: '191281 / 605755', share: 31, country: 'Hindistan', flag: 'https://flagcdn.com/w80/in.png' },
    { resource: 'Kauçuk', icon: '🌿', effect: 'Araç Üretimi: +6%', effectColor: '#4ade80', production: '135994 / 1009230', share: 13, country: 'Endonezya', flag: 'https://flagcdn.com/w80/id.png' },
    { resource: 'Mısır', icon: '🌽', effect: 'Gıda Üretimi: +5%', effectColor: '#4ade80', production: '384500 / 1215600', share: 31, country: 'ABD', flag: 'https://flagcdn.com/w80/us.png' },
    { resource: 'Zeytin', icon: '🫒', effect: 'Ticaret Geliri: +4%', effectColor: '#4ade80', production: '52751 / 64530', share: 81, country: 'Türkiye', flag: 'https://flagcdn.com/w80/tr.png' },
    { resource: 'Kereste', icon: '🪵', effect: 'İnşaat Hızı: +8%', effectColor: '#4ade80', production: '145200 / 820300', share: 17, country: 'Kanada', flag: 'https://flagcdn.com/w80/ca.png' },
    { resource: 'Kömür', icon: '⚫', effect: 'Enerji Maliyeti: -3%', effectColor: '#f87171', production: '425600 / 2850000', share: 14, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Lityum', icon: '🔋', effect: 'Teknoloji Üretimi: +10%', effectColor: '#4ade80', production: '78300 / 256400', share: 30, country: 'Avustralya', flag: 'https://flagcdn.com/w80/au.png' },
    { resource: 'Balık', icon: '🐟', effect: 'Gıda Kapasitesi: +4%', effectColor: '#4ade80', production: '158200 / 890400', share: 17, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Tütün', icon: '🍂', effect: 'Vergi Geliri: +6%', effectColor: '#4ade80', production: '92400 / 612300', share: 15, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Şarap', icon: '🍷', effect: 'Lüks Tüketim: +5%', effectColor: '#4ade80', production: '46800 / 284500', share: 16, country: 'Fransa', flag: 'https://flagcdn.com/w80/fr.png' },
    { resource: 'Alüminyum', icon: '🔩', effect: 'Havacılık Üretimi: +7%', effectColor: '#4ade80', production: '312500 / 1680000', share: 18, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Titanyum', icon: '⚙️', effect: 'Askeri Donanım: +5%', effectColor: '#4ade80', production: '48200 / 312600', share: 15, country: 'Rusya', flag: 'https://flagcdn.com/w80/ru.png' },
];

// ============================
// BAR CHART RENDER
// ============================
function renderBarChart(catKey) {
    const cat = categories[catKey];
    if (!cat) return;

    currentCategory = catKey;

    // DOM elemanları
    const chartArea = document.getElementById('ws-chart-area');
    const maxValEl = document.getElementById('ws-max-val');
    const yLabel = document.getElementById('ws-y-label');
    const catNameEl = document.getElementById('ws-cat-name');
    const chartWrapper = document.querySelector('.ws-chart-wrapper');
    const legend = document.getElementById('ws-legend');

    if (!chartArea) return;

    // Chart moduna geç (bar chart görünümü)
    chartWrapper.style.display = 'flex';
    legend.style.display = 'flex';
    chartArea.className = 'ws-chart-area';

    // Başlık ve Y ekseni güncelle
    catNameEl.textContent = cat.name;
    yLabel.textContent = cat.name;

    // Veriyi sırala (küçükten büyüğe)
    const sorted = [...countryData].sort((a, b) => a[cat.key] - b[cat.key]);
    const maxValue = sorted[sorted.length - 1][cat.key];

    // Max değeri göster
    maxValEl.textContent = cat.rawFormat(maxValue);

    // Barları oluştur
    let html = '';
    sorted.forEach((country, i) => {
        const value = country[cat.key];
        const percent = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const colors = continentColors[country.continent] || continentColors['Okyanusya'];
        const formattedVal = cat.format(value);

        // Gradient: kıta rengi ama daha derin alttan üste
        const barGrad = `linear-gradient(to top, ${colors.bar} 0%, ${colors.barLight} 70%, ${colors.barLight} 100%)`;

        html += `
            <div class="ws-bar-col" style="animation-delay: ${i * 20}ms">
                <img class="ws-bar-flag" src="${country.flag}" alt="${country.name}" title="${country.name}" loading="lazy" />
                <div class="ws-bar-stick" style="height: ${Math.max(percent, 1.5)}%">
                    <div class="ws-bar-inner" style="background: ${barGrad}"></div>
                </div>
                <span class="ws-bar-val">${formattedVal}</span>
            </div>
        `;
    });

    chartArea.innerHTML = html;

    // Barlar animasyonlu giriş
    requestAnimationFrame(() => {
        chartArea.querySelectorAll('.ws-bar-col').forEach(col => {
            col.classList.add('ws-bar-visible');
        });
    });
}

// ============================
// ÜRETİCİLER LİSTESİ RENDER
// ============================
function renderProducers() {
    currentCategory = 'producers';

    const chartArea = document.getElementById('ws-chart-area');
    const catNameEl = document.getElementById('ws-cat-name');
    const chartWrapper = document.querySelector('.ws-chart-wrapper');
    const legend = document.getElementById('ws-legend');
    const yLabel = document.getElementById('ws-y-label');
    const maxLine = document.getElementById('ws-max-line');

    if (!chartArea) return;

    // Başlığı güncelle
    catNameEl.textContent = 'En Büyük Mal Üreticileri';

    // Chart wrapper'ı liste moduna geçir (y-label ve max-line gizle)
    yLabel.style.display = 'none';
    maxLine.style.display = 'none';
    chartWrapper.style.display = 'block';
    chartWrapper.style.padding = '0';
    legend.style.display = 'none';
    chartArea.className = 'ws-chart-area ws-producers-mode';

    let html = '';
    producersData.forEach((item, i) => {
        html += `
            <div class="ws-prod-row" style="animation-delay: ${i * 30}ms">
                <div class="ws-prod-icon">${item.icon}</div>
                <div class="ws-prod-resource">${item.resource}</div>
                <div class="ws-prod-effect">
                    ${item.effect}
                </div>
                <div class="ws-prod-stats">${item.production}</div>
                <div class="ws-prod-share">${item.share}%</div>
                <div class="ws-prod-country">
                    <img class="ws-prod-flag" src="${item.flag}" alt="${item.country}" loading="lazy" />
                    <span>${item.country}</span>
                </div>
            </div>
        `;
    });

    chartArea.innerHTML = html;

    // Animasyonlu giriş
    requestAnimationFrame(() => {
        chartArea.querySelectorAll('.ws-prod-row').forEach(row => {
            row.classList.add('ws-prod-visible');
        });
    });
}

// ============================
// PANEL INIT
// ============================
export function initWorldStatsPanel() {
    const trigger = document.getElementById('map-stats-trigger');
    const overlay = document.getElementById('world-stats-overlay');
    const closeBtn = document.getElementById('ws-close-btn');
    const tabs = document.querySelectorAll('.ws-icon-tab');

    if (!trigger || !overlay) return;

    // Trigger tıklama -> overlay aç
    trigger.addEventListener('click', () => {
        overlay.classList.add('open');
        // İlk açılışta chart render et
        if (currentCategory === 'producers') {
            renderProducers();
        } else {
            renderBarChart(currentCategory);
        }
    });

    // Kapatma
    closeBtn?.addEventListener('click', () => {
        overlay.classList.remove('open');
    });

    // ESC ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            overlay.classList.remove('open');
        }
    });

    // Tab değiştirme
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const cat = tab.dataset.cat;

            // Chart wrapper stillerini sıfırla
            const chartWrapper = document.querySelector('.ws-chart-wrapper');
            const yLabel = document.getElementById('ws-y-label');
            const maxLine = document.getElementById('ws-max-line');
            chartWrapper.style.padding = '';
            yLabel.style.display = '';
            maxLine.style.display = '';

            if (cat === 'producers') {
                renderProducers();
            } else {
                renderBarChart(cat);
            }
        });
    });
}
