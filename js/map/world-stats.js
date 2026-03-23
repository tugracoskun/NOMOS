// DÜNYA İSTATİSTİKLERİ - AGE OF HISTORY II TARZI
// Dikey bar chart, bayraklı barlar, kıta renkleri, üretici listesi

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
        name: 'Nüfus', key: 'population',
        format: (v) => { if (v >= 1e9) return (v/1e9).toFixed(1)+'Mr'; if (v >= 1e6) return (v/1e6).toFixed(1)+'M'; if (v >= 1e3) return (v/1e3).toFixed(1)+'K'; return v.toString(); },
        rawFormat: (v) => v.toLocaleString('tr-TR'),
    },
    economy: {
        name: 'Ekonomi', key: 'gdp',
        format: (v) => { if (v >= 1000) return (v/1000).toFixed(1)+' Tn $'; return v+' Mr $'; },
        rawFormat: (v) => v.toLocaleString('tr-TR') + ' Mr $',
    },
    technology: {
        name: 'Teknoloji', key: 'tech',
        format: (v) => (v*100).toFixed(0)+'%',
        rawFormat: (v) => '%'+(v*100).toFixed(1),
    },
    infrastructure: {
        name: 'Altyapı', key: 'infra',
        format: (v) => v+'/10',
        rawFormat: (v) => v+'/10',
    },
    buildings: {
        name: 'Binalar', key: 'buildings',
        format: (v) => v.toString(),
        rawFormat: (v) => v.toString(),
    },
    military: {
        name: 'Askeri Güç', key: 'military',
        format: (v) => { if (v >= 1e6) return (v/1e6).toFixed(1)+'M'; if (v >= 1e3) return (v/1e3).toFixed(0)+'K'; return v.toString(); },
        rawFormat: (v) => v.toLocaleString('tr-TR'),
    },
};

let currentCategory = 'population';
let isListView = false; // Dikey liste görünümü aktif mi?

// ============================
// EN BÜYÜK ÜRETİCİLER VERİSİ (TÜM KAYNAKLAR)
// ============================
const producersData = [
    // === EN YAYGIN (1-10) ===
    { resource: 'Sığır Eti', icon: '🐄', effect: 'Gıda Kapasitesi: +6%', production: '12400 / 72800', share: 17, country: 'Brezilya', flag: 'https://flagcdn.com/w80/br.png' },
    { resource: 'Buğday', icon: '🌾', effect: 'Nüfus Büyümesi: +3%', production: '999797 / 7370425', share: 13, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Su Rezervleri', icon: '💧', effect: 'Nüfus Kapasitesi: +5%', production: '462000 / 1820000', share: 25, country: 'Brezilya', flag: 'https://flagcdn.com/w80/br.png' },
    { resource: 'Kömür', icon: '⚫', effect: 'Enerji Maliyeti: -3%', production: '425600 / 2850000', share: 14, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Demir', icon: '⛏️', effect: 'İnşaat Maliyeti: -5%', production: '862858 / 5779648', share: 14, country: 'Avustralya', flag: 'https://flagcdn.com/w80/au.png' },
    { resource: 'Kürk', icon: '🦊', effect: 'Lüks Ticaret: +3%', production: '28400 / 186500', share: 15, country: 'Rusya', flag: 'https://flagcdn.com/w80/ru.png' },
    { resource: 'Meyve', icon: '🍎', effect: 'Gıda Üretimi: +3%', production: '86500 / 620000', share: 13, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Şarap', icon: '🍷', effect: 'Lüks Tüketim: +5%', production: '46800 / 284500', share: 16, country: 'Fransa', flag: 'https://flagcdn.com/w80/fr.png' },
    { resource: 'Boya', icon: '🎨', effect: 'Kültür Geliri: +4%', production: '34200 / 248000', share: 13, country: 'Almanya', flag: 'https://flagcdn.com/w80/de.png' },
    { resource: 'Kıyafetler', icon: '👕', effect: 'Tekstil İhracatı: +8%', production: '185000 / 620000', share: 29, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    // === YAYGIN (11-23) ===
    { resource: 'Baharatlar', icon: '🌶️', effect: 'Ticaret Geliri: +5%', production: '92000 / 420000', share: 21, country: 'Hindistan', flag: 'https://flagcdn.com/w80/in.png' },
    { resource: 'Peynir', icon: '🧀', effect: 'Gıda Kalitesi: +3%', production: '21400 / 112000', share: 19, country: 'ABD', flag: 'https://flagcdn.com/w80/us.png' },
    { resource: 'Bronz', icon: '🥉', effect: 'Silah Üretimi: +4%', production: '18200 / 142000', share: 12, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Bakır', icon: '🔶', effect: 'Elektronik Üretimi: +8%', production: '206788 / 1114150', share: 18, country: 'Şili', flag: 'https://flagcdn.com/w80/cl.png' },
    { resource: 'Kahve', icon: '☕', effect: 'Verimlilik: +4%', production: '69200 / 178000', share: 38, country: 'Brezilya', flag: 'https://flagcdn.com/w80/br.png' },
    { resource: 'Mobilya', icon: '🪑', effect: 'Yaşam Kalitesi: +3%', production: '45000 / 285000', share: 15, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Çay', icon: '🍵', effect: 'Kültür Bonusu: +2%', production: '82000 / 310000', share: 26, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Şerbetçiotu', icon: '🌿', effect: 'Bira Üretimi: +5%', production: '12800 / 98000', share: 13, country: 'Almanya', flag: 'https://flagcdn.com/w80/de.png' },
    { resource: 'Kâğıt', icon: '📜', effect: 'Araştırma Hızı: +3%', production: '106000 / 420000', share: 25, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Pirinç', icon: '🍚', effect: 'Nüfus Büyümesi: +4%', production: '148000 / 520000', share: 28, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Cam', icon: '🥂', effect: 'İnşaat Kalitesi: +3%', production: '28000 / 180000', share: 15, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Tütün', icon: '🍂', effect: 'Vergi Geliri: +6%', production: '92400 / 612300', share: 15, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'İpek', icon: '🧣', effect: 'Lüks İhracat: +8%', production: '146000 / 210000', share: 69, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    // === ORTA SEVİYE (24-35) ===
    { resource: 'Doğalgaz', icon: '🔥', effect: 'Enerji Üretimi: +15%', production: '184200 / 612800', share: 30, country: 'Rusya', flag: 'https://flagcdn.com/w80/ru.png' },
    { resource: 'Petrol', icon: '🛢️', effect: 'Ordu Bakımı: -5%', production: '295310 / 1127420', share: 26, country: 'S. Arabistan', flag: 'https://flagcdn.com/w80/sa.png' },
    { resource: 'Tropik Odun', icon: '🌴', effect: 'İnşaat Hızı: +5%', production: '42000 / 310000', share: 13, country: 'Brezilya', flag: 'https://flagcdn.com/w80/br.png' },
    { resource: 'Bira', icon: '🍺', effect: 'Halk Mutluluğu: +3%', production: '88000 / 190000', share: 46, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Afyon', icon: '💊', effect: 'Tıp Araştırma: +6%', production: '6800 / 8200', share: 82, country: 'Afganistan', flag: 'https://flagcdn.com/w80/af.png' },
    { resource: 'Kauçuk', icon: '🌿', effect: 'Araç Üretimi: +6%', production: '135994 / 1009230', share: 13, country: 'Endonezya', flag: 'https://flagcdn.com/w80/id.png' },
    { resource: 'Gümüş', icon: '🥈', effect: 'Hazine Geliri: +5%', production: '6200 / 26000', share: 23, country: 'Meksika', flag: 'https://flagcdn.com/w80/mx.png' },
    { resource: 'Tuz', icon: '🧂', effect: 'Gıda Saklama: +3%', production: '68000 / 280000', share: 24, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Zeytin', icon: '🫒', effect: 'Ticaret Geliri: +4%', production: '52751 / 64530', share: 81, country: 'Türkiye', flag: 'https://flagcdn.com/w80/tr.png' },
    { resource: 'Kakao', icon: '🍫', effect: 'Lüks İhracat: +5%', production: '2200 / 5800', share: 37, country: 'Fildişi Sahili', flag: 'https://flagcdn.com/w80/ci.png' },
    { resource: 'Porselen', icon: '🏺', effect: 'Kültür Değeri: +4%', production: '38000 / 62000', share: 61, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Altın', icon: '🥇', effect: 'Hazine Geliri: +10%', production: '179202 / 1125614', share: 15, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Muz', icon: '🍌', effect: 'Gıda Çeşitliliği: +3%', production: '8400 / 42000', share: 20, country: 'Hindistan', flag: 'https://flagcdn.com/w80/in.png' },
    // === DEĞERLİ (36-44) ===
    { resource: 'Silikon', icon: '💾', effect: 'Teknoloji Üretimi: +12%', production: '14800 / 48000', share: 30, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Fildişi', icon: '🦏', effect: 'Lüks Ticaret: +6%', production: '320 / 1200', share: 26, country: 'Tanzanya', flag: 'https://flagcdn.com/w80/tz.png' },
    { resource: 'Limon', icon: '🍋', effect: 'Sağlık Bonusu: +2%', production: '3800 / 21000', share: 18, country: 'Hindistan', flag: 'https://flagcdn.com/w80/in.png' },
    { resource: 'Hurma', icon: '🌴', effect: 'Gıda Saklama: +4%', production: '1400 / 9200', share: 15, country: 'Mısır', flag: 'https://flagcdn.com/w80/eg.png' },
    { resource: 'Titanyum', icon: '⚙️', effect: 'Askeri Donanım: +5%', production: '48200 / 312600', share: 15, country: 'Rusya', flag: 'https://flagcdn.com/w80/ru.png' },
    { resource: 'Vanilya', icon: '🍦', effect: 'Lüks Gıda: +4%', production: '3200 / 3800', share: 84, country: 'Madagaskar', flag: 'https://flagcdn.com/w80/mg.png' },
    { resource: 'Lityum', icon: '🔋', effect: 'Teknoloji Üretimi: +10%', production: '78300 / 256400', share: 30, country: 'Avustralya', flag: 'https://flagcdn.com/w80/au.png' },
    { resource: 'Domates', icon: '🍅', effect: 'Gıda Üretimi: +2%', production: '42000 / 186000', share: 22, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Safran', icon: '🌸', effect: 'Lüks Ticaret: +10%', production: '430 / 580', share: 74, country: 'İran', flag: 'https://flagcdn.com/w80/ir.png' },
    // === ÇOK DEĞERLİ / NADİR (45-53) ===
    { resource: 'Elmaslar', icon: '💎', effect: 'Lüks İhracat: +12%', production: '89400 / 342600', share: 26, country: 'G. Afrika', flag: 'https://flagcdn.com/w80/za.png' },
    { resource: 'Tarçın', icon: '🫙', effect: 'Ticaret Geliri: +3%', production: '18000 / 42000', share: 42, country: 'Endonezya', flag: 'https://flagcdn.com/w80/id.png' },
    { resource: 'Çelik', icon: '🔧', effect: 'Bina Dayanıklılığı: +8%', production: '1032500 / 1920000', share: 53, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Mermer', icon: '🏛️', effect: 'İnşaat Kalitesi: +6%', production: '4800 / 18200', share: 26, country: 'Türkiye', flag: 'https://flagcdn.com/w80/tr.png' },
    { resource: 'Alüminyum', icon: '🔩', effect: 'Havacılık Üretimi: +7%', production: '312500 / 1680000', share: 18, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
    { resource: 'Kobalt', icon: '⚛️', effect: 'Batarya Üretimi: +15%', production: '120000 / 170000', share: 70, country: 'Kongo', flag: 'https://flagcdn.com/w80/cd.png' },
    { resource: 'Uranyum', icon: '☢️', effect: 'Nükleer Güç: +20%', production: '52300 / 186700', share: 28, country: 'Kanada', flag: 'https://flagcdn.com/w80/ca.png' },
    { resource: 'Nadir Toprak', icon: '🧪', effect: 'İleri Teknoloji: +18%', production: '168000 / 210000', share: 80, country: 'Çin', flag: 'https://flagcdn.com/w80/cn.png' },
];

// ============================
// ORTAK DOM YARDIMCILARI
// ============================
function getElements() {
    return {
        chartArea: document.getElementById('ws-chart-area'),
        maxValEl: document.getElementById('ws-max-val'),
        yLabel: document.getElementById('ws-y-label'),
        catNameEl: document.getElementById('ws-cat-name'),
        chartWrapper: document.querySelector('.ws-chart-wrapper'),
        legend: document.getElementById('ws-legend'),
        maxLine: document.getElementById('ws-max-line'),
        scrollLeft: document.getElementById('ws-scroll-left'),
        scrollRight: document.getElementById('ws-scroll-right'),
        viewToggle: document.getElementById('ws-view-toggle'),
    };
}

function resetToChartMode(els) {
    els.chartWrapper.style.display = 'flex';
    els.chartWrapper.style.flexDirection = 'column';
    els.chartWrapper.style.padding = '';
    els.legend.style.display = 'flex';
    els.yLabel.style.display = '';
    els.maxLine.style.display = '';
    els.chartArea.className = 'ws-chart-area';
    els.scrollLeft.style.display = '';
    els.scrollRight.style.display = '';
    els.viewToggle.style.display = '';
}

function resetToListMode(els) {
    els.yLabel.style.display = 'none';
    els.maxLine.style.display = 'none';
    els.chartWrapper.style.display = 'flex';
    els.chartWrapper.style.flexDirection = 'column';
    els.chartWrapper.style.padding = '0';
    els.legend.style.display = 'none';
    els.chartArea.className = 'ws-chart-area ws-producers-mode';
    els.scrollLeft.style.display = 'none';
    els.scrollRight.style.display = 'none';
    els.viewToggle.style.display = 'none';
}

// ============================
// BAR CHART RENDER (YATAY — kaydırılabilir)
// ============================
function renderBarChart(catKey) {
    const cat = categories[catKey];
    if (!cat) return;
    currentCategory = catKey;
    isListView = false;

    const els = getElements();
    if (!els.chartArea) return;

    resetToChartMode(els);

    // Toggle ikon güncelle
    els.viewToggle.innerHTML = '<i class="fa-solid fa-list"></i>';
    els.viewToggle.title = 'Dikey Liste Görünümü';

    els.catNameEl.textContent = cat.name;
    els.yLabel.textContent = cat.name;

    const sorted = [...countryData].sort((a, b) => a[cat.key] - b[cat.key]);
    const maxValue = sorted[sorted.length - 1][cat.key];
    els.maxValEl.textContent = cat.rawFormat(maxValue);

    let html = '';
    sorted.forEach((country, i) => {
        const value = country[cat.key];
        const percent = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const colors = continentColors[country.continent] || continentColors['Okyanusya'];
        const formattedVal = cat.format(value);
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

    els.chartArea.innerHTML = html;
    els.chartArea.scrollLeft = 0;

    requestAnimationFrame(() => {
        els.chartArea.querySelectorAll('.ws-bar-col').forEach(col => {
            col.classList.add('ws-bar-visible');
        });
    });

    updateScrollArrows(els);
}

// ============================
// DİKEY LİSTE RENDER (kategoriler için)
// ============================
function renderListView(catKey) {
    const cat = categories[catKey];
    if (!cat) return;
    currentCategory = catKey;
    isListView = true;

    const els = getElements();
    if (!els.chartArea) return;

    resetToListMode(els);
    els.catNameEl.textContent = cat.name;

    const sorted = [...countryData].sort((a, b) => b[cat.key] - a[cat.key]);
    const maxValue = sorted[0][cat.key];

    let html = `
        <div class="ws-list-header">
            <span class="ws-lh-rank">#</span>
            <span class="ws-lh-flag"></span>
            <span class="ws-lh-name">Ülke</span>
            <span class="ws-lh-bar">Oran</span>
            <span class="ws-lh-val">Değer</span>
        </div>
    `;

    sorted.forEach((country, i) => {
        const value = country[cat.key];
        const percent = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const colors = continentColors[country.continent] || continentColors['Okyanusya'];
        const formattedVal = cat.format(value);

        html += `
            <div class="ws-list-row" style="animation-delay: ${i * 25}ms">
                <span class="ws-list-rank">${i + 1}</span>
                <img class="ws-list-flag" src="${country.flag}" alt="${country.name}" loading="lazy" />
                <span class="ws-list-name">${country.name}</span>
                <div class="ws-list-bar-wrap">
                    <div class="ws-list-bar-fill" style="width: ${percent}%; background: linear-gradient(90deg, ${colors.bar}, ${colors.barLight})"></div>
                </div>
                <span class="ws-list-val">${formattedVal}</span>
            </div>
        `;
    });

    // Geri dönüş butonu
    html += `
        <button class="ws-back-to-chart" id="ws-back-to-chart">
            <i class="fa-solid fa-chart-bar"></i> Yatay Grafik Görünümüne Dön
        </button>
    `;

    els.chartArea.innerHTML = html;

    // Geri butonu event
    document.getElementById('ws-back-to-chart')?.addEventListener('click', () => {
        renderBarChart(currentCategory);
    });

    requestAnimationFrame(() => {
        els.chartArea.querySelectorAll('.ws-list-row').forEach(row => {
            row.classList.add('ws-list-visible');
        });
    });
}

// ============================
// ÜRETİCİLER LİSTESİ RENDER
// ============================
function renderProducers() {
    currentCategory = 'producers';
    isListView = false;

    const els = getElements();
    if (!els.chartArea) return;

    resetToListMode(els);
    els.catNameEl.textContent = 'En Büyük Mal Üreticileri';

    let html = '';
    producersData.forEach((item, i) => {
        html += `
            <div class="ws-prod-row" style="animation-delay: ${i * 25}ms">
                <div class="ws-prod-icon">${item.icon}</div>
                <div class="ws-prod-resource">${item.resource}</div>
                <div class="ws-prod-effect">${item.effect}</div>
                <div class="ws-prod-stats">${item.production}</div>
                <div class="ws-prod-share">${item.share}%</div>
                <div class="ws-prod-country">
                    <img class="ws-prod-flag" src="${item.flag}" alt="${item.country}" loading="lazy" />
                    <span>${item.country}</span>
                </div>
            </div>
        `;
    });

    els.chartArea.innerHTML = html;

    requestAnimationFrame(() => {
        els.chartArea.querySelectorAll('.ws-prod-row').forEach(row => {
            row.classList.add('ws-prod-visible');
        });
    });
}

// ============================
// SCROLL OKLARI
// ============================
function updateScrollArrows(els) {
    if (!els.scrollLeft || !els.scrollRight) return;
    const area = els.chartArea;
    // Scroll gerekip gerekmediğini kontrol et
    const needsScroll = area.scrollWidth > area.clientWidth + 10;
    els.scrollLeft.style.opacity = needsScroll && area.scrollLeft > 10 ? '1' : '0.3';
    els.scrollRight.style.opacity = needsScroll && area.scrollLeft < area.scrollWidth - area.clientWidth - 10 ? '1' : '0.3';
}

function scrollChart(direction) {
    const area = document.getElementById('ws-chart-area');
    if (!area) return;
    const amount = area.clientWidth * 0.6;
    area.scrollBy({ left: direction * amount, behavior: 'smooth' });
    setTimeout(() => updateScrollArrows(getElements()), 350);
}

// ============================
// PANEL INIT
// ============================
export function initWorldStatsPanel() {
    const trigger = document.getElementById('map-stats-trigger');
    const overlay = document.getElementById('world-stats-overlay');
    const closeBtn = document.getElementById('ws-close-btn');
    const tabs = document.querySelectorAll('.ws-icon-tab');
    const scrollLeftBtn = document.getElementById('ws-scroll-left');
    const scrollRightBtn = document.getElementById('ws-scroll-right');
    const viewToggle = document.getElementById('ws-view-toggle');

    if (!trigger || !overlay) return;

    // Trigger tıklama
    trigger.addEventListener('click', () => {
        overlay.classList.add('open');
        if (currentCategory === 'producers') {
            renderProducers();
        } else if (isListView) {
            renderListView(currentCategory);
        } else {
            renderBarChart(currentCategory);
        }
    });

    // Kapatma
    closeBtn?.addEventListener('click', () => overlay.classList.remove('open'));

    // ESC ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            overlay.classList.remove('open');
        }
    });

    // Scroll okları
    scrollLeftBtn?.addEventListener('click', () => scrollChart(-1));
    scrollRightBtn?.addEventListener('click', () => scrollChart(1));

    // Chart area scroll event (ok görünürlüğü güncelle)
    document.getElementById('ws-chart-area')?.addEventListener('scroll', () => {
        updateScrollArrows(getElements());
    });

    // View toggle (yatay ↔ dikey)
    viewToggle?.addEventListener('click', () => {
        if (currentCategory === 'producers') return;
        if (isListView) {
            renderBarChart(currentCategory);
        } else {
            renderListView(currentCategory);
        }
    });

    // Tab değiştirme
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const cat = tab.dataset.cat;
            isListView = false;

            if (cat === 'producers') {
                renderProducers();
            } else {
                renderBarChart(cat);
            }
        });
    });
}
