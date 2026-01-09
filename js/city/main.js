import { buildingTypes, generateCityStats, getInfrastructureUpgradeCost } from '../data/city-stats.js';
import { addBuildingToCity, upgradeCityInfrastructure } from '../data/state.js';
import { getNationData } from '../data/nations.js';
import { generateSidebarHTML, generateMainContentHTML, generateBuildingCards } from './templates.js';

let currentCityId = null;

// Sayfa render (Ana Controller)
export function renderCityPage(container, cityId) {
    currentCityId = cityId || 'demo';
    loadStyles();

    // Şehir Verisini Yükle
    let cityData = loadCityData(currentCityId);

    // Altyapı ve İstatistikleri Hesapla
    const stats = generateCityStats(cityData);
    const buildings = cityData.buildings || [];

    // Ülke ve İttifak Verisi
    const nation = getNationData(cityData.country);
    const alliancesHtml = (nation.alliances || []).map(a =>
        `<span class="tag-v2"><i class="fa-solid ${a.icon || 'fa-shield-halved'}"></i> ${a.name}</span>`
    ).join('');

    // HTML Birleştirme (Templates.js'den gelen parçalarla)
    container.innerHTML = `
        <div class="city-page">
            <header class="city-header">
                <div class="city-header-left">
                    <button class="back-btn" onclick="window.location.hash='map'">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <div class="city-title">
                        <h1>${cityData.name}</h1>
                        <span class="city-country-badge"><i class="fa-solid fa-location-dot"></i> ${nation.name}</span>
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
                ${generateSidebarHTML(cityData, nation, stats, alliancesHtml)}
                ${generateMainContentHTML(buildings)}
            </main>
        </div>
    `;

    // Event Listener'ları Kur
    setupTabs(buildings);
    setupUpgradeButton(currentCityId, cityData.infrastructure || 1);
}

// ------ YARDIMCI FONKSİYONLAR & EVENTLER ------

function loadStyles() {
    addCSS('city-page-style', 'css/city.css');
    addCSS('nation-panel-style', 'css/nation-panel.css');
}

function addCSS(id, href) {
    if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

function loadCityData(cityId) {
    try {
        const savedCity = localStorage.getItem('nomos_current_city');
        if (savedCity) return JSON.parse(savedCity);
    } catch (e) {
        console.warn('City data load error:', e);
    }
    return getDemoCity(cityId);
}

function getDemoCity(cityId) {
    return {
        id: cityId,
        name: 'Demo Şehir',
        country: 'Türkiye',
        population: 1250000,
        economy: 75,
        infrastructure: 1,
        buildings: [],
        resource: { name: 'Demir', icon: 'fa-solid fa-cube' }
    };
}

// --- TAB & UI LOGIC ---

function setupTabs(buildings) {
    const mainTabs = document.querySelectorAll('.main-tab');
    const ownedView = document.getElementById('owned-buildings-view');
    const buildView = document.getElementById('build-new-view');

    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            mainTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.dataset.view === 'owned') {
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

                // Template güncellenince listenerları yeniden bağla
                buildGrid.innerHTML = generateBuildingCards(tab.dataset.category, buildings);
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

function refreshCityView() {
    const container = document.getElementById('app-container');
    if (container) renderCityPage(container, currentCityId);
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
