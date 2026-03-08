import { buildingTypes, generateCityStats, getInfrastructureUpgradeCost } from '../data/city-stats.js';
import { addBuildingToCity, upgradeCityInfrastructure } from '../data/state.js';
import { getNationData } from '../data/nations.js';
import { generateSidebarHTML, generateMainContentHTML, generateBuildingCards } from './templates.js';
import { isCoastalRegion } from '../data/coastal-regions.js';

let currentCityId = null;

// Sayfa render (Ana Controller)
export function renderCityPage(container, cityId) {
    currentCityId = cityId || 'demo';

    // İlk açılışta container'ı gizle (CSS yüklenene kadar)
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.2s ease';

    // CSS'leri yükle ve yüklendikten sonra render et
    loadStyles(() => {
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

        // Kıyı Şehri mi kontrol et
        const isCoastal = isCoastalRegion(cityData.regionId);

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
                            <div class="city-tags">
                                <span class="city-country-badge"><i class="fa-solid fa-location-dot"></i> ${nation.name}</span>
                                ${isCoastal ? '<span class="coastal-tag"><i class="fa-solid fa-anchor"></i> Kıyı Şehri</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="city-header-right">
                        <div class="city-value-badge-wrapper">
                            <div class="city-value-badge">
                                <i class="fa-solid fa-star"></i>
                                <span>Eyalet Değeri: ${stats.cityValue.stars}/10</span>
                                <i class="fa-solid fa-circle-info info-icon"></i>
                            </div>
                            <div class="rank-tooltip">
                                <h4>Değerlendirme Puanı (${stats.cityValue.score}/100)</h4>
                                <ul>
                                    ${Object.entries(stats.cityValue.details || {}).map(([key, val]) => `
                                        <li>
                                            <span>${key}</span>
                                            <span class="score">+${val}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
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
        setupUpgradeButton(currentCityId);
        setupInspectButton();

        // Render tamamlandı, container'ı göster
        requestAnimationFrame(() => {
            container.style.opacity = '1';
        });
    });
}

// ------ YARDIMCI FONKSİYONLAR & EVENTLER ------

function loadStyles(callback) {
    const cssFiles = [
        { id: 'city-page-style', href: 'css/city.css' },
        { id: 'nation-panel-style', href: 'css/nation-panel.css' }
    ];

    // Yüklenmemiş CSS'leri bul
    const toLoad = cssFiles.filter(css => !document.getElementById(css.id));

    if (toLoad.length === 0) {
        // Tüm CSS'ler zaten yüklü
        callback();
        return;
    }

    let loadedCount = 0;

    toLoad.forEach(css => {
        const link = document.createElement('link');
        link.id = css.id;
        link.rel = 'stylesheet';
        link.href = css.href;
        link.onload = () => {
            loadedCount++;
            if (loadedCount === toLoad.length) {
                callback();
            }
        };
        // Hata durumunda da devam et
        link.onerror = () => {
            loadedCount++;
            if (loadedCount === toLoad.length) {
                callback();
            }
        };
        document.head.appendChild(link);
    });
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

function setupUpgradeButton(cityId) {
    const btn = document.getElementById('btn-upgrade-infrastructure');
    if (!btn || btn.disabled) return;

    btn.addEventListener('click', () => {
        const cost = parseInt(btn.dataset.cost);
        const nextLevel = btn.dataset.level;

        if (confirm(`Altyapıyı Seviye ${nextLevel} yapmak için ${cost.toLocaleString()} Altın harcanacak. Onaylıyor musunuz?`)) {
            const result = upgradeCityInfrastructure(cityId, cost);
            if (result.success) {
                showNotification(`Altyapı seviye ${result.newLevel}'e yükseltildi!`, 'success');
                refreshCityView();
            } else {
                showNotification(result.error, 'error');
            }
        }
    });
}

function setupInspectButton() {
    // Document-level event delegation - DOM yükleme zamanlamasından bağımsız çalışır
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.js-inspect-country');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const country = btn.dataset.country;
        if (country) {
            console.log('Navigating to country:', country);
            window.location.hash = `country/${encodeURIComponent(country)}`;
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
