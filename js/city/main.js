// ŞEHİR SAYFASI MODÜLÜ
// Harita'dan "Daha Fazla Detay" butonuyla açılan sayfa

import { buildingTypes, infrastructureLevels, calculateCityValue, calculateTaxEfficiency, generateCityStats } from '../data/city-stats.js';

// Şehir verisi global cache (haritadan aktarılır)
let currentCityData = null;

export function setCityData(data) {
    currentCityData = data;
}

export function getCityData() {
    return currentCityData;
}

// Sayfa render
export function renderCityPage(container, cityId) {
    // localStorage'dan şehir verisini yükle
    let cityData = null;

    try {
        const savedCity = localStorage.getItem('nomos_current_city');
        if (savedCity) {
            cityData = JSON.parse(savedCity);
        }
    } catch (e) {
        console.warn('City data load error:', e);
    }

    // Veri yoksa demo veri oluştur
    if (!cityData) {
        cityData = {
            id: cityId || 'demo',
            name: 'Demo Şehir',
            country: 'Türkiye',
            population: 1250000,
            economy: 75,
            infrastructure: 4,
            buildings: ['municipality', 'taxOffice', 'workshop'],
            resource: { name: 'Demir', icon: 'fa-solid fa-cube' }
        };
    }

    // İstatistikleri hesapla
    const stats = generateCityStats(cityData);
    const buildings = cityData.buildings || [];

    container.innerHTML = `
        <link rel="stylesheet" href="css/city.css">
        <div class="city-page">
            <!-- Header -->
            <header class="city-header">
                <div class="city-header-left">
                    <button class="back-btn" onclick="window.location.hash='map'">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <div class="city-title">
                        <h1>${cityData.name || 'Bilinmeyen Şehir'}</h1>
                        <span class="city-country-badge">
                            <i class="fa-solid fa-flag"></i> ${cityData.country || 'Bilinmiyor'}
                        </span>
                    </div>
                </div>
                <div class="city-value-badge">
                    <i class="fa-solid fa-star"></i>
                    <span>Eyalet Değeri: ${stats.cityValue}/10</span>
                </div>
            </header>

            <!-- Stats Overview -->
            <section class="city-stats-section">
                <h2><i class="fa-solid fa-chart-pie"></i> Genel Bakış</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <i class="fa-solid fa-users"></i>
                        <div class="stat-info">
                            <span class="stat-value">${(cityData.population || 0).toLocaleString()}</span>
                            <span class="stat-label">Nüfus</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fa-solid fa-coins"></i>
                        <div class="stat-info">
                            <span class="stat-value">${cityData.economy || 0}</span>
                            <span class="stat-label">Ekonomi</span>
                        </div>
                    </div>
                    <div class="stat-card green">
                        <i class="fa-solid fa-percent"></i>
                        <div class="stat-info">
                            <span class="stat-value">${stats.taxEfficiency}%</span>
                            <span class="stat-label">Vergi Verimliliği</span>
                        </div>
                    </div>
                    <div class="stat-card blue">
                        <i class="fa-solid fa-road"></i>
                        <div class="stat-info">
                            <span class="stat-value">${stats.infrastructure}/10</span>
                            <span class="stat-label">Altyapı (${stats.infrastructureName})</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Resource -->
            <section class="city-resource-section">
                <h2><i class="fa-solid fa-gem"></i> Şehir Kaynağı</h2>
                <div class="resource-card">
                    ${cityData.resource ? `
                        <div class="resource-icon">
                            <i class="${cityData.resource.icon}"></i>
                        </div>
                        <div class="resource-info">
                            <span class="resource-name">${cityData.resource.name}</span>
                            <span class="resource-desc">Bu şehrin ana hammaddesi</span>
                        </div>
                    ` : '<p>Kaynak bilgisi yok</p>'}
                </div>
            </section>

            <!-- Buildings -->
            <section class="city-buildings-section">
                <h2><i class="fa-solid fa-city"></i> Mevcut Binalar (${buildings.length})</h2>
                <div class="buildings-grid">
                    ${buildings.length > 0 ? buildings.map(buildingId => {
        const b = buildingTypes[buildingId];
        return b ? `
                            <div class="building-card built">
                                <i class="${b.icon}"></i>
                                <span>${b.name}</span>
                                <small class="building-effect">${b.description}</small>
                            </div>
                        ` : '';
    }).join('') : `
                        <div class="no-buildings">
                            <i class="fa-solid fa-hard-hat"></i>
                            <p>Henüz bina inşa edilmemiş</p>
                        </div>
                    `}
                </div>
            </section>

            <!-- Build New -->
            <section class="city-build-section">
                <h2><i class="fa-solid fa-hammer"></i> Yeni Bina İnşa Et</h2>
                
                <!-- Category Tabs -->
                <div class="build-tabs">
                    <button class="build-tab active" data-category="economic">
                        <i class="fa-solid fa-landmark"></i> Yönetim
                    </button>
                    <button class="build-tab" data-category="production">
                        <i class="fa-solid fa-industry"></i> Üretim
                    </button>
                    <button class="build-tab" data-category="education">
                        <i class="fa-solid fa-graduation-cap"></i> Eğitim
                    </button>
                </div>

                <!-- Available Buildings Grid -->
                <div class="available-buildings" id="available-buildings">
                    ${generateBuildingCards('economic', buildings)}
                </div>
            </section>

            <!-- Infrastructure -->
            <section class="city-infra-section">
                <h2><i class="fa-solid fa-wrench"></i> Altyapı Geliştirme</h2>
                <div class="infra-progress">
                    <div class="infra-bar">
                        <div class="infra-fill" style="width: ${stats.infrastructure * 10}%"></div>
                    </div>
                    <span class="infra-level">Seviye ${stats.infrastructure}</span>
                </div>
                <p class="infra-benefits">
                    <i class="fa-solid fa-check"></i> Vergi Verimliliği: +${Math.round((infrastructureLevels[stats.infrastructure]?.taxEfficiency - 1) * 100)}% |
                    <i class="fa-solid fa-check"></i> İnşaat Maliyeti: -${Math.round((1 - infrastructureLevels[stats.infrastructure]?.constructionCost) * 100)}%
                </p>
            </section>
        </div>
    `;

    // Tab switching
    setupBuildTabs(buildings);
}

// Bina kategorilerine göre grupla
const buildingCategories = {
    economic: ['municipality', 'courthouse', 'taxOffice', 'taxCollection'],
    production: ['port', 'manufactory', 'warehouse', 'farm', 'foodWorkshop', 'workshop', 'tradeCenter', 'bank', 'factory', 'buildersGuild', 'railway'],
    education: ['library', 'school', 'university', 'academy']
};

// Kategori için bina kartları oluştur
function generateBuildingCards(category, existingBuildings) {
    const buildingIds = buildingCategories[category] || [];

    return buildingIds.map(id => {
        const b = buildingTypes[id];
        if (!b) return '';

        const isBuilt = existingBuildings.includes(id);

        return `
            <div class="available-building ${isBuilt ? 'already-built' : ''}" data-building="${id}">
                <div class="building-icon-wrap">
                    <i class="${b.icon}"></i>
                    ${isBuilt ? '<span class="built-badge"><i class="fa-solid fa-check"></i></span>' : ''}
                </div>
                <div class="building-details">
                    <span class="building-name">${b.name}</span>
                    <span class="building-desc">${b.description}</span>
                    <div class="building-cost">
                        <i class="fa-solid fa-coins"></i>
                        <span>${b.cost.toLocaleString()}</span>
                    </div>
                </div>
                ${!isBuilt ? `
                    <button class="build-btn" data-building="${id}">
                        <i class="fa-solid fa-hammer"></i> İnşa Et
                    </button>
                ` : `
                    <span class="built-label">İnşa Edildi</span>
                `}
            </div>
        `;
    }).join('');
}

// Tab event listener'larını kur
function setupBuildTabs(existingBuildings) {
    const tabs = document.querySelectorAll('.build-tab');
    const container = document.getElementById('available-buildings');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Aktif tab'ı değiştir
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // İçeriği güncelle
            const category = tab.dataset.category;
            container.innerHTML = generateBuildingCards(category, existingBuildings);

            // Build butonlarını aktif et
            setupBuildButtons();
        });
    });

    // İlk yüklemede butonları aktif et
    setupBuildButtons();
}

// Build butonları için event listener
function setupBuildButtons() {
    document.querySelectorAll('.build-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const buildingId = btn.dataset.building;
            const building = buildingTypes[buildingId];

            if (building) {
                // TODO: Gerçek inşaat mantığı (para kontrolü, kaydetme)
                alert(`${building.name} inşa edilecek!\nMaliyet: ${building.cost.toLocaleString()} altın`);
            }
        });
    });
}

