// HARİTA STİLLERİ - Dinamik Mod Desteği
import { getSavedData } from './editor.js';
import { getCurrentMode, mapModes } from './modes.js';

// Aktif mod
let activeMode = 'default';

// Mod değişikliğini dinle
window.addEventListener('mapModeChanged', (e) => {
    activeMode = e.detail.mode;
});

// DETAY KATMANI (RENKLİ BÖLGELER) - Moda Göre Dinamik
export function getProvinceStyle(feature) {
    const p = feature.properties;
    const saved = getSavedData(feature);

    // Temel bilgiler
    let name = saved?.name || p.regionName || "Bölge";
    let country = p.ADMIN || p.NAME || "";

    // Moda göre renk belirle
    let color = getColorByMode(saved, country, name);

    return {
        fillColor: color,
        weight: 0.5,
        opacity: 1,
        color: '#1e293b', // Koyu lacivert sınır
        fillOpacity: 0.85
    };
}

// Moda göre renk hesapla
function getColorByMode(saved, country, name) {
    const mode = activeMode || 'default';

    switch (mode) {
        case 'infrastructure':
            return getInfrastructureColor(saved?.infrastructure || 1);

        case 'population':
            return getPopulationColor(saved?.population || 100000);

        case 'buildings':
            return getBuildingsColor((saved?.buildings || []).length);

        case 'technology':
            return getTechnologyColor(saved?.techIndex || 0.5);

        case 'wars':
            return getWarColor(saved?.atWar || false);

        case 'alliances':
            return getAllianceColor(country);

        case 'statistics':
            // İstatistik modunda eyalet değerine göre renklendir
            return getValueColor(saved);

        default:
            // Varsayılan: Kaydedilmiş renk veya ülke bazlı
            if (saved?.color) return saved.color;
            return stringToColor(country + name);
    }
}

// ALTYAPI MODU: 1 (Kırmızı) -> 10 (Yeşil)
function getInfrastructureColor(level) {
    const colors = [
        '#ef4444', // 1 - Kırmızı
        '#f97316', // 2 - Turuncu
        '#f59e0b', // 3 - Amber
        '#eab308', // 4 - Sarı
        '#84cc16', // 5 - Lime
        '#22c55e', // 6 - Yeşil
        '#10b981', // 7 - Emerald
        '#14b8a6', // 8 - Teal
        '#06b6d4', // 9 - Cyan
        '#0ea5e9'  // 10 - Sky Blue
    ];
    return colors[Math.min(Math.max(level - 1, 0), 9)];
}

// NÜFUS MODU: Açık Mavi -> Koyu Mavi
function getPopulationColor(pop) {
    if (pop < 100000) return '#dbeafe';      // Çok düşük
    if (pop < 500000) return '#93c5fd';      // Düşük
    if (pop < 1000000) return '#60a5fa';     // Orta
    if (pop < 5000000) return '#3b82f6';     // Yüksek
    if (pop < 10000000) return '#2563eb';    // Çok yüksek
    return '#1d4ed8';                         // Mega şehir
}

// BİNA MODU: Sarı -> Yeşil
function getBuildingsColor(count) {
    if (count === 0) return '#fef3c7';       // Hiç bina yok
    if (count <= 2) return '#fde047';        // Az
    if (count <= 5) return '#a3e635';        // Orta
    if (count <= 8) return '#4ade80';        // İyi
    return '#22c55e';                         // Mükemmel
}

// TEKNOLOJİ MODU: 0-1 arası index
function getTechnologyColor(index) {
    if (index < 0.3) return '#fecaca';       // Düşük
    if (index < 0.5) return '#fde68a';       // Orta-düşük
    if (index < 0.7) return '#bfdbfe';       // Orta
    if (index < 0.9) return '#c4b5fd';       // Yüksek
    return '#a78bfa';                         // Çok yüksek
}

// SAVAŞ MODU
function getWarColor(atWar) {
    return atWar ? '#ef4444' : '#64748b';    // Kırmızı veya Gri
}

// İTTİFAK MODU: Ülkeye göre renk
function getAllianceColor(country) {
    // Basit hash ile her ülkeye sabit renk
    return stringToColor(country);
}

// İSTATİSTİK MODU: Eyalet değerine göre
function getValueColor(saved) {
    const infra = saved?.infrastructure || 1;
    const buildings = (saved?.buildings || []).length;

    // Basit bir skor
    const score = (infra * 2) + (buildings * 3);

    if (score < 5) return '#94a3b8';         // Düşük
    if (score < 15) return '#fbbf24';        // Orta
    if (score < 30) return '#22c55e';        // İyi
    return '#8b5cf6';                         // Mükemmel
}

// DIŞ SINIRLAR
export function getInternationalBorderStyle(feature) {
    return {
        fillColor: 'transparent',
        weight: 2,
        opacity: 1,
        color: '#0f172a',
        fillOpacity: 0,
        interactive: false
    };
}

// RENK ÜRETİCİ (Varsayılan Mod için)
function stringToColor(str) {
    if (!str) return "#334155";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }

    const h = Math.abs(hash) % 360;
    const s = 55 + (Math.abs(hash) % 25);
    const l = 45 + (Math.abs(hash) % 15);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function getBaseCountryStyle() { return {}; }