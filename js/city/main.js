import { buildingTypes, infrastructureLevels, calculateCityValue, calculateTaxEfficiency, generateCityStats, getInfrastructureUpgradeCost } from '../data/city-stats.js';
import { addBuildingToCity, upgradeCityInfrastructure, loadState } from '../data/state.js';

// Bina kategorileri
const buildingCategories = {
    economic: ['municipality', 'courthouse', 'taxOffice', 'taxCollection'],
    production: ['port', 'airport', 'manufactory', 'warehouse', 'farm', 'foodWorkshop', 'workshop', 'tradeCenter', 'bank', 'factory', 'buildersGuild', 'railway'],
    education: ['library', 'school', 'university', 'academy']
};

let currentCityId = null;

// Kategori için bina kartları oluştur
function generateBuildingCards(category, existingBuildings) {
    const buildingIds = buildingCategories[category] || [];
    const state = loadState();

    return buildingIds.map(id => {
        const b = buildingTypes[id];
        if (!b) return '';

        const isBuilt = existingBuildings.includes(id);
        const hasPermission = b.role === 'citizen' || state.role === 'president';

        return `
            <div class="available-building ${isBuilt ? 'already-built' : ''} ${!hasPermission ? 'locked' : ''}" data-building="${id}">
                <div class="building-icon-wrap">
                    <i class="${b.icon}"></i>
                    ${isBuilt ? '<span class="built-badge"><i class="fa-solid fa-check"></i></span>' : ''}
                    ${!hasPermission ? '<span class="lock-badge"><i class="fa-solid fa-lock"></i></span>' : ''}
                </div>
                <div class="building-details">
                    <div class="name-row">
                        <span class="building-name">${b.name}</span>
                        ${b.role === 'president' ? '<span class="role-tag">Başkan</span>' : ''}
                    </div>
                    <span class="building-desc">${b.description}</span>
                    <div class="building-cost">
                        <i class="fa-solid fa-coins"></i>
                        <span>${b.cost.toLocaleString()}</span>
                    </div>
                </div>
                ${!isBuilt ? `
                    <button class="build-btn" 
                            data-building="${id}" 
                            data-cost="${b.cost}" 
                            ${!hasPermission ? 'disabled' : ''}>
                        <i class="fa-solid ${!hasPermission ? 'fa-lock' : 'fa-hammer'}"></i>
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
            const cost = parseInt(btn.dataset.cost);

            const result = addBuildingToCity(currentCityId, buildingId, cost);

            if (result.success) {
                showNotification(`${buildingTypes[buildingId].name} başarıyla inşa edildi!`, 'success');
                refreshCityView();
            } else {
                showNotification(result.error || 'İşlem başarısız.', 'error');
            }
        });
    });
}

function setupUpgradeButton(cityId, currentLevel) {
    const btn = document.querySelector('.upgrade-btn');
    if (!btn) return;

    const cost = getInfrastructureUpgradeCost(currentLevel);
    btn.textContent = `Geliştir (${cost.toLocaleString()} 💰)`;

    if (currentLevel >= 10) {
        btn.disabled = true;
        btn.textContent = 'Maksimum Seviye';
        return;
    }

    btn.addEventListener('click', () => {
        const result = upgradeCityInfrastructure(cityId, cost);
        if (result.success) {
            showNotification(`Altyapı seviye ${result.newLevel}'e yükseltildi!`, 'success');
            refreshCityView();
        } else {
            showNotification(result.error, 'error');
        }
    });
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.game-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `game-notification ${type}`;
    notif.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.classList.add('fade-out');
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

function refreshCityView() {
    const container = document.getElementById('app-container');
    if (container) renderCityPage(container, currentCityId);
}

// Sayfa render
export function renderCityPage(container, cityId) {
    currentCityId = cityId || 'demo';

    // CSS'i head'e ekle (eğer yoksa)
    if (!document.getElementById('city-page-style')) {
        const link = document.createElement('link');
        link.id = 'city-page-style';
        link.rel = 'stylesheet';
        link.href = 'css/city.css';
        document.head.appendChild(link);
    }

    if (!document.getElementById('nation-panel-style')) {
        const link = document.createElement('link');
        link.id = 'nation-panel-style';
        link.rel = 'stylesheet';
        link.href = 'css/nation-panel.css';
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
            id: currentCityId,
            name: 'Demo Şehir',
            country: 'Türkiye',
            population: 1250000,
            economy: 75,
            infrastructure: 1,
            buildings: [],
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
                <!-- Sol Panel: Ülke ve Şehir Özeti -->
                <aside class="city-sidebar">
                    
                    <!-- ÜLKE PANELİ (YENİ KOMPAKT TASARIM) -->
                    <div class="nation-panel">
                        <!-- Header: Bayrak ve İsim -->
                        <div class="nation-header">
                            <div class="nation-flag-container">
                                <!-- Örnek Türkiye Bayrağı (Gelecekte dinamik olacak) -->
                                <img src="https://flagcdn.com/w160/tr.png" class="nation-flag" alt="Flag">
                            </div>
                            <div class="nation-title">
                                <span class="nation-name">${cityData.country}</span>
                                <span class="government-type">
                                    <i class="fa-solid fa-landmark"></i> Cumhuriyet
                                </span>
                            </div>
                        </div>

                        <!-- Lider Bilgisi -->
                        <div class="leader-section">
                            <div class="leader-avatar">
                                <i class="fa-solid fa-user-tie"></i>
                            </div>
                            <div class="leader-info">
                                <span class="leader-role">Cumhurbaşkanı</span>
                                <span class="leader-name">Başkan [TR]</span>
                            </div>
                        </div>

                        <!-- İstatistikler -->
                        <div class="nation-stats-grid">
                            <div class="nation-stat-item">
                                <div class="stat-icon text-yellow"><i class="fa-solid fa-coins"></i></div>
                                <div class="stat-content">
                                    <span class="stat-label">GSYİH (Tahmini)</span>
                                    <span class="stat-val">$840 Mr</span>
                                </div>
                            </div>
                            <div class="nation-stat-item">
                                <div class="stat-icon text-green"><i class="fa-solid fa-users"></i></div>
                                <div class="stat-content">
                                    <span class="stat-label">Toplam Nüfus</span>
                                    <span class="stat-val">85.4 M</span>
                                </div>
                            </div>
                            <div class="nation-stat-item">
                                <div class="stat-icon text-blue"><i class="fa-solid fa-microchip"></i></div>
                                <div class="stat-content">
                                    <span class="stat-label">Teknoloji</span>
                                    <span class="stat-val">Seviye 4</span>
                                </div>
                            </div>
                            <div class="nation-stat-item">
                                <div class="stat-icon text-purple"><i class="fa-solid fa-crown"></i></div>
                                <div class="stat-content">
                                    <span class="stat-label">Otorite</span>
                                    <span class="stat-val">%75</span>
                                </div>
                            </div>
                        </div>

                        <!-- Ana Kaynak -->
                        <div class="top-resource">
                            <span class="resource-badge">💎</span>
                            <div class="stat-content">
                                <span class="stat-label">En Büyük İhraç</span>
                                <span class="stat-val">Bor Madeni</span>
                            </div>
                        </div>

                         <!-- İttifaklar -->
                         <div style="margin-top:auto;">
                            <span class="stat-label" style="display:block; margin-bottom:6px;">İttifaklar & Paktlar</span>
                            <div class="alliance-list">
                                <span class="alliance-tag"><i class="fa-solid fa-shield-halved"></i> NATO</span>
                                <span class="alliance-tag"><i class="fa-solid fa-handshake"></i> AB Gümrük</span>
                            </div>
                         </div>
                    </div>

                    <!-- Şehir Altyapısı (Mobil Altyapı Paneli) -->
                    <section class="sidebar-section" style="margin-top: 16px;">
                        <h2><i class="fa-solid fa-wrench"></i> Şehir Altyapısı</h2>
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

                <div class="city-main-content">
                    <div class="content-tabs-header">
                        <div class="main-tabs">
                            <button class="main-tab active" data-view="owned">Binalarım</button>
                            <button class="main-tab" data-view="build">Yeni İnşa Et</button>
                        </div>
                    </div>

                    <div class="scroll-content">
                        <div id="owned-buildings-view">
                            <div class="buildings-grid">
                                ${generateOwnedBuildings(buildings)}
                            </div>
                        </div>

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
    setupUpgradeButton(currentCityId, cityData.infrastructure || 1);
}
