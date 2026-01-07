// ŞEHİR SAYFASI MODÜLÜ
import { buildingTypes, infrastructureLevels, calculateCityValue, calculateTaxEfficiency, generateCityStats } from '../data/city-stats.js';

// Bina kategorileri
const buildingCategories = {
    economic: ['municipality', 'courthouse', 'taxOffice', 'taxCollection'],
    production: ['port', 'manufactory', 'warehouse', 'farm', 'foodWorkshop', 'workshop', 'tradeCenter', 'bank', 'factory', 'buildersGuild', 'railway'],
    education: ['library', 'school', 'university', 'academy']
};

let currentCityData = null;

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
                        <i class="fa-solid fa-hammer"></i>
                    </button>
                ` : `
                    <span class="built-label"><i class="fa-solid fa-check"></i></span>
                `}
            </div>
        `;
    }).join('');
}

// Mevcut binaları listele
function generateOwnedBuildings(existingBuildings) {
    if (!existingBuildings || existingBuildings.length === 0) {
        return `
            <div class="no-buildings">
                <i class="fa-solid fa-hard-hat"></i>
                <p>Henüz bina inşa edilmemiş</p>
            </div>
        `;
    }

    return existingBuildings.map(id => {
        const b = buildingTypes[id];
        if (!b) return '';
        return `
            <div class="building-card built">
                <i class="${b.icon}"></i>
                <div class="building-info-wrap">
                    <span class="owned-building-name">${b.name}</span>
                    <small class="building-effect">${b.description}</small>
                </div>
            </div>
        `;
    }).join('');
}

// Tab event listener'larını kur
function setupTabs(buildings) {
    // Ana Tablar (Mevcut vs Yeni)
    const mainTabs = document.querySelectorAll('.main-tab');
    const ownedView = document.getElementById('owned-buildings-view');
    const buildView = document.getElementById('build-new-view');

    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            mainTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const view = tab.dataset.view;
            if (view === 'owned') {
                ownedView.style.display = 'block';
                buildView.style.display = 'none';
            } else {
                ownedView.style.display = 'none';
                buildView.style.display = 'block';
            }
        });
    });

    // İnşa Kategorileri
    const buildTabs = document.querySelectorAll('.build-tab');
    const buildGrid = document.getElementById('available-buildings');

    if (buildTabs && buildGrid) {
        buildTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                buildTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const category = tab.dataset.category;
                buildGrid.innerHTML = generateBuildingCards(category, buildings);
                setupBuildButtons();
            });
        });
    }

    setupBuildButtons();
}

function setupBuildButtons() {
    document.querySelectorAll('.build-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const buildingId = btn.dataset.building;
            const building = buildingTypes[buildingId];
            if (building) {
                alert(`${building.name} inşa edilecek!\nMaliyet: ${building.cost.toLocaleString()} altın`);
            }
        });
    });
}

// Sayfa render
export function renderCityPage(container, cityId) {
    // CSS'i head'e ekle (eğer yoksa) - FOUC önlemek için
    if (!document.getElementById('city-page-style')) {
        const link = document.createElement('link');
        link.id = 'city-page-style';
        link.rel = 'stylesheet';
        link.href = 'css/city.css';
        document.head.appendChild(link);
    }

    let cityData = null;
    try {
        const savedCity = localStorage.getItem('nomos_current_city');
        if (savedCity) {
            cityData = JSON.parse(savedCity);
        }
    } catch (e) {
        console.warn('City data load error:', e);
    }

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

    const stats = generateCityStats(cityData);
    const buildings = cityData.buildings || [];

    container.innerHTML = `
        <div class="city-page">
            <!-- Top Header -->
            <header class="city-header">
                <div class="city-header-left">
                    <button class="back-btn" onclick="window.location.hash='map'">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <div class="city-title">
                        <h1>${cityData.name}</h1>
                        <span class="city-country-badge"><i class="fa-solid fa-location-dot"></i> ${cityData.country}</span>
                    </div>
                </div>
                <div class="city-header-right">
                    <div class="city-value-badge">
                        <i class="fa-solid fa-star"></i>
                        <span>Eyalet Değeri: ${stats.cityValue}/10</span>
                    </div>
                </div>
            </header>

            <main class="city-dashboard">
                <!-- Sol Panel: İstatistikler ve Kaynaklar -->
                <aside class="city-sidebar">
                    <section class="sidebar-section">
                        <h2><i class="fa-solid fa-chart-simple"></i> Şehir Verileri</h2>
                        <div class="stats-column">
                            <div class="stat-card green">
                                <i class="fa-solid fa-people-group"></i>
                                <div class="stat-info">
                                    <span class="stat-value">${cityData.population.toLocaleString()}</span>
                                    <span class="stat-label">Nüfus</span>
                                </div>
                            </div>
                            <div class="stat-card yellow">
                                <i class="fa-solid fa-chart-line"></i>
                                <div class="stat-info">
                                    <span class="stat-value">%${cityData.economy}</span>
                                    <span class="stat-label">Ekonomi Gücü</span>
                                </div>
                            </div>
                            <div class="stat-card purple">
                                <i class="fa-solid fa-percent"></i>
                                <div class="stat-info">
                                    <span class="stat-value">${stats.taxEfficiency}%</span>
                                    <span class="stat-label">Vergi Verimliliği</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="sidebar-section">
                        <h2><i class="fa-solid fa-gem"></i> Ana Kaynak</h2>
                        <div class="resource-card">
                            <div class="resource-icon">
                                <i class="${cityData.resource?.icon || 'fa-solid fa-box'}"></i>
                            </div>
                            <div class="resource-info">
                                <span class="resource-name">${cityData.resource?.name || 'Yok'}</span>
                                <span class="resource-desc">Şehrin üretim temeli</span>
                            </div>
                        </div>
                    </section>

                    <section class="sidebar-section">
                        <h2><i class="fa-solid fa-wrench"></i> Altyapı</h2>
                        <div class="infra-compact">
                            <div class="infra-header">
                                <span class="infra-level">Seviye ${stats.infrastructure}</span>
                                <span class="infra-name">${stats.infrastructureName}</span>
                            </div>
                            <div class="infra-bar">
                                <div class="infra-fill" style="width: ${stats.infrastructure * 10}%"></div>
                            </div>
                            <button class="upgrade-btn">Geliştir</button>
                        </div>
                    </section>
                </aside>

                <!-- Sağ Panel: Bina Yönetimi -->
                <div class="city-main-content">
                    <div class="content-tabs-header">
                        <div class="main-tabs">
                            <button class="main-tab active" data-view="owned">Binalarım</button>
                            <button class="main-tab" data-view="build">Yeni İnşa Et</button>
                        </div>
                    </div>

                    <div class="scroll-content">
                        <!-- Mevcut Binalar Görünümü -->
                        <div id="owned-buildings-view">
                            <div class="buildings-grid">
                                ${generateOwnedBuildings(buildings)}
                            </div>
                        </div>

                        <!-- Yeni İnşa Et Görünümü -->
                        <div id="build-new-view" style="display: none;">
                            <div class="build-tabs">
                                <button class="build-tab active" data-category="economic">Yönetim</button>
                                <button class="build-tab" data-category="production">Üretim</button>
                                <button class="build-tab" data-category="education">Eğitim</button>
                            </div>
                            <div class="available-buildings" id="available-buildings">
                                ${generateBuildingCards('economic', buildings)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;

    setupTabs(buildings);
}
