// İSTATİSTİK MODU PANELİ
// Kapsamlı oyun istatistiklerini gösterir

import { buildingTypes } from '../data/city-stats.js';

// İstatistik kategorileri
export const statisticsCategories = {
    overview: {
        name: 'Genel Bakış',
        icon: 'fa-solid fa-chart-pie'
    },
    buildings: {
        name: 'Yapı İstatistikleri',
        icon: 'fa-solid fa-city',
        getData: () => getBuildingStats()
    },
    economy: {
        name: 'Ekonomi',
        icon: 'fa-solid fa-coins',
        getData: () => getEconomyStats()
    },
    population: {
        name: 'Nüfus',
        icon: 'fa-solid fa-users',
        getData: () => getPopulationStats()
    },
    wars: {
        name: 'Savaşlar',
        icon: 'fa-solid fa-burst',
        getData: () => getWarStats()
    },
    alliances: {
        name: 'İttifaklar',
        icon: 'fa-solid fa-handshake',
        getData: () => getAllianceStats()
    },
    topCities: {
        name: 'En Gelişmiş Şehirler',
        icon: 'fa-solid fa-ranking-star',
        getData: () => getTopCitiesStats()
    }
};

// Bina istatistiklerini al
function getBuildingStats() {
    // Placeholder - gerçek verilerle değiştirilecek
    return {
        totalBuildings: 1247,
        byType: {
            economic: 423,
            production: 512,
            education: 312
        },
        topCountries: [
            { name: 'Türkiye', count: 156 },
            { name: 'Almanya', count: 142 },
            { name: 'Fransa', count: 128 }
        ]
    };
}

// Ekonomi istatistiklerini al
function getEconomyStats() {
    return {
        totalGDP: '2.5T',
        averageTaxEfficiency: '112%',
        topEconomies: [
            { name: 'ABD', gdp: '450B' },
            { name: 'Çin', gdp: '380B' },
            { name: 'Almanya', gdp: '290B' }
        ]
    };
}

// Nüfus istatistiklerini al
function getPopulationStats() {
    return {
        totalPopulation: '7.8B',
        averageGrowth: '+1.2%',
        mostPopulated: [
            { name: 'Çin', pop: '1.4B' },
            { name: 'Hindistan', pop: '1.3B' },
            { name: 'ABD', pop: '330M' }
        ]
    };
}

// Savaş istatistiklerini al
function getWarStats() {
    return {
        activeWars: 3,
        conflicts: [
            { parties: 'Ülke A vs Ülke B', status: 'Aktif' },
            { parties: 'Ülke C vs Ülke D', status: 'Ateşkes' }
        ]
    };
}

// İttifak istatistiklerini al
function getAllianceStats() {
    return {
        totalAlliances: 12,
        largestAlliance: {
            name: 'Kuzey İttifakı',
            members: 8
        },
        alliances: [
            { name: 'Kuzey İttifakı', members: 8, color: '#3b82f6' },
            { name: 'Güney Birliği', members: 6, color: '#22c55e' },
            { name: 'Doğu Paktı', members: 5, color: '#f59e0b' }
        ]
    };
}

// En gelişmiş şehirleri al
function getTopCitiesStats() {
    return {
        cities: [
            { name: 'İstanbul', country: 'Türkiye', value: 9, infra: 8 },
            { name: 'Berlin', country: 'Almanya', value: 9, infra: 9 },
            { name: 'Paris', country: 'Fransa', value: 8, infra: 8 },
            { name: 'Londra', country: 'İngiltere', value: 8, infra: 7 },
            { name: 'Tokyo', country: 'Japonya', value: 10, infra: 10 }
        ]
    };
}

// İstatistik paneli HTML'ini oluştur
export function createStatisticsPanelHTML() {
    const categoryButtons = Object.entries(statisticsCategories).map(([id, cat]) => `
        <button class="stat-category-btn" data-category="${id}">
            <i class="${cat.icon}"></i>
            <span>${cat.name}</span>
        </button>
    `).join('');

    return `
        <div id="statistics-panel" class="statistics-panel">
            <div class="stats-header">
                <h3><i class="fa-solid fa-chart-bar"></i> İstatistikler</h3>
                <button id="close-stats" class="close-stats-btn">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="stats-categories">
                ${categoryButtons}
            </div>
            <div id="stats-content" class="stats-content">
                <div class="stats-placeholder">
                    <i class="fa-solid fa-chart-pie"></i>
                    <p>Kategori seçin</p>
                </div>
            </div>
        </div>
    `;
}

// Kategori içeriğini render et
export function renderCategoryContent(categoryId) {
    const category = statisticsCategories[categoryId];
    if (!category) return;

    const contentEl = document.getElementById('stats-content');
    if (!contentEl) return;

    // Butonları güncelle
    document.querySelectorAll('.stat-category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === categoryId);
    });

    const data = category.getData ? category.getData() : null;

    if (categoryId === 'topCities' && data) {
        contentEl.innerHTML = `
            <div class="stats-section">
                <h4><i class="fa-solid fa-ranking-star"></i> En Gelişmiş Şehirler</h4>
                <div class="top-cities-list">
                    ${data.cities.map((city, i) => `
                        <div class="top-city-item">
                            <span class="rank">#${i + 1}</span>
                            <div class="city-info">
                                <span class="city-name">${city.name}</span>
                                <span class="city-country">${city.country}</span>
                            </div>
                            <div class="city-scores">
                                <span class="value-badge"><i class="fa-solid fa-star"></i> ${city.value}/10</span>
                                <span class="infra-badge"><i class="fa-solid fa-road"></i> ${city.infra}/10</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (categoryId === 'buildings' && data) {
        contentEl.innerHTML = `
            <div class="stats-section">
                <h4><i class="fa-solid fa-city"></i> Yapı İstatistikleri</h4>
                <div class="stat-grid">
                    <div class="stat-box">
                        <span class="stat-number">${data.totalBuildings}</span>
                        <span class="stat-label">Toplam Bina</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${data.byType.economic}</span>
                        <span class="stat-label">Ekonomik</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${data.byType.production}</span>
                        <span class="stat-label">Üretim</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${data.byType.education}</span>
                        <span class="stat-label">Eğitim</span>
                    </div>
                </div>
                <h5>Ülkelere Göre</h5>
                <div class="country-list">
                    ${data.topCountries.map(c => `
                        <div class="country-stat">
                            <span>${c.name}</span>
                            <span class="count">${c.count} bina</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (categoryId === 'alliances' && data) {
        contentEl.innerHTML = `
            <div class="stats-section">
                <h4><i class="fa-solid fa-handshake"></i> İttifaklar</h4>
                <div class="stat-grid">
                    <div class="stat-box">
                        <span class="stat-number">${data.totalAlliances}</span>
                        <span class="stat-label">Toplam İttifak</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${data.largestAlliance.members}</span>
                        <span class="stat-label">En Büyük</span>
                    </div>
                </div>
                <div class="alliance-list">
                    ${data.alliances.map(a => `
                        <div class="alliance-item" style="border-left: 4px solid ${a.color}">
                            <span class="alliance-name">${a.name}</span>
                            <span class="member-count">${a.members} üye</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        contentEl.innerHTML = `
            <div class="stats-placeholder">
                <i class="${category.icon}"></i>
                <p>${category.name} verileri yükleniyor...</p>
            </div>
        `;
    }
}

// İstatistik panelini aç/kapa
export function toggleStatisticsPanel(show = true) {
    const panel = document.getElementById('statistics-panel');
    if (panel) {
        panel.classList.toggle('open', show);
    }
}

// Event listener'ları kur
export function initStatisticsPanelEvents() {
    // Kategori butonları
    document.querySelectorAll('.stat-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            renderCategoryContent(btn.dataset.category);
        });
    });

    // Kapat butonu
    const closeBtn = document.getElementById('close-stats');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleStatisticsPanel(false));
    }
}
