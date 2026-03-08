import { buildingTypes, infrastructureLevels, getNextLevelPreview } from '../data/city-stats.js';
import { loadState } from '../data/state.js';

const buildingCategories = {
    economic: ['municipality', 'courthouse', 'taxOffice', 'taxCollection'],
    production: ['port', 'airport', 'manufactory', 'warehouse', 'farm', 'foodWorkshop', 'workshop', 'tradeCenter', 'bank', 'factory', 'buildersGuild', 'railway'],
    education: ['library', 'school', 'university', 'academy']
};

export function generateSidebarHTML(cityData, nation, stats, alliancesHtml) {
    return `
        <aside class="city-sidebar">
            <div class="sidebar-section nation-compact-card">
                <div class="nation-compact-header">
                    <img src="${nation.flag}" class="nation-flag-small" alt="${nation.name}">
                    <div class="nation-info-compact">
                        <span class="nation-sub">Bağlı Olduğu Ülke</span>
                        <strong class="nation-name-lg">${nation.name}</strong>
                    </div>
                    <span class="rank-badge">#${nation.ranking || '?'}</span>
                </div>
                 
                 <div class="nation-compact-stats">
                    <div class="dict-stat">
                        <span class="lbl"><i class="fa-solid fa-coins text-gold"></i> GSYİH</span>
                        <span class="val">${nation.gdp}</span>
                    </div>
                    <div class="dict-stat">
                        <span class="lbl"><i class="fa-solid fa-users text-green"></i> Nüfus</span>
                        <span class="val">${nation.population}</span>
                    </div>
                 </div>

                 <button class="nation-inspect-btn-sm js-inspect-country" data-country="${nation.name}">
                    İncele <i class="fa-solid fa-arrow-right"></i>
                 </button>
            </div>

            <!-- FAZ 4: KAYNAK GELİRİ KARTI -->
            ${cityData.resource ? `
            <div class="sidebar-section highlight-card">
                <div class="resource-header">
                    <i class="fa-solid fa-gem text-gold"></i>
                    <span>Bölgesel Kaynak</span>
                </div>
                <div class="resource-body">
                    <div class="res-icon-large"><i class="${cityData.resource.icon || 'fa-solid fa-box'}"></i></div>
                    <div class="res-details">
                        <strong class="res-name">${cityData.resource.name}</strong>
                        <div class="res-income">
                            <i class="fa-solid fa-coins text-yellow"></i>
                            <span class="income-val">+${stats.resourceIncome ? stats.resourceIncome.toLocaleString() : '0'}</span> / Gün
                        </div>
                    </div>
                </div>
                <div class="market-trend up">
                    <i class="fa-solid fa-arrow-trend-up"></i> Pazar Değeri Yüksek
                </div>
            </div>
            ` : ''}

            <section class="sidebar-section" style="margin-top: 16px;">
                <div class="infra-header-row">
                    <h2><i class="fa-solid fa-wrench"></i> Altyapı</h2>
                    <span class="infra-badge">Seviye ${stats.infrastructure}</span>
                </div>
                
                <div class="infra-card">
                    <div class="infra-progress-track">
                        <div class="infra-progress-bar" style="width: ${stats.infrastructure * 10}%"></div>
                    </div>
                    <div class="infra-status">
                        <span class="curr-infra">${stats.infrastructureName}</span>
                        <span class="next-infra">${stats.infrastructure < 10 ? 'Sonraki: ' + (infrastructureLevels[stats.infrastructure + 1]?.name || '???') : 'Maksimum'}</span>
                    </div>

                    ${(() => {
            const next = getNextLevelPreview(stats.infrastructure);
            if (!next) return `<button class="upgrade-btn maxed" disabled>Maksimum Seviye</button>`;

            return `
                            <div class="next-level-preview">
                                <strong><i class="fa-solid fa-angles-up"></i> Yükseltme Etkileri:</strong>
                                <ul>
                                    ${next.effects.map(e => `<li>${e}</li>`).join('')}
                                </ul>
                            </div>
                            <button class="upgrade-btn" 
                                id="btn-upgrade-infrastructure"
                                data-cost="${next.cost}"
                                data-level="${next.level}">
                                <div class="btn-content">
                                    <span>GELİŞTİR</span>
                                    <span class="cost"><i class="fa-solid fa-coins"></i> ${next.cost.toLocaleString()}</span>
                                </div>
                            </button>
                        `;
        })()}
                </div>
            </section>
        </aside>
    `;
}

export function generateMainContentHTML(buildings) {
    return `
        <div class="city-main-content">
            <div class="content-tabs-header">
                <div class="main-tabs">
                    <button class="main-tab active" data-view="owned">Binalar</button>
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
                        <button class="build-tab" data-category="education">Araştırma</button>
                    </div>
                    <div class="available-buildings" id="available-buildings">
                        ${generateBuildingCards('economic', buildings)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function generateBuildingCards(category, existingBuildings) {
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
