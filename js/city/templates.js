import { buildingTypes } from '../data/city-stats.js';
import { loadState } from '../data/state.js';

const buildingCategories = {
    economic: ['municipality', 'courthouse', 'taxOffice', 'taxCollection'],
    production: ['port', 'airport', 'manufactory', 'warehouse', 'farm', 'foodWorkshop', 'workshop', 'tradeCenter', 'bank', 'factory', 'buildersGuild', 'railway'],
    education: ['library', 'school', 'university', 'academy']
};

export function generateSidebarHTML(cityData, nation, stats, alliancesHtml) {
    return `
        <aside class="city-sidebar">
            <div class="nation-panel">
                <div class="nation-header-v2">
                    <div class="nation-flag-v2">
                        <img src="${nation.flag}" alt="${nation.name}">
                    </div>
                    <div class="nation-title-v2">
                        <span class="nation-name-v2">${nation.name}</span>
                        <span class="nation-meta-v2">
                            IDs: ${nation.id.split('_')[1] || '?'} | #${nation.ranking || '?'}
                        </span>
                    </div>
                </div>

                <div class="leader-row-v2" style="border-left-color: ${nation.color || '#3b82f6'};">
                    <div class="leader-avatar-v2">
                        <i class="fa-solid fa-user-tie"></i>
                    </div>
                    <div class="leader-info-v2">
                        <span class="l-role">${nation.leaderTitle}</span>
                        <span class="l-name">${nation.leader}</span>
                    </div>
                </div>

                <div class="stats-grid-v2">
                    <div class="stat-box-v2">
                        <span class="val text-gold">${nation.gdp}</span>
                        <span class="lbl">GSYİH</span>
                    </div>
                    <div class="stat-box-v2">
                        <span class="val text-green">${nation.population}</span>
                        <span class="lbl">Nüfus</span>
                    </div>
                    <div class="stat-box-v2">
                        <span class="val text-purple">${nation.tech || '0.50'}</span>
                        <span class="lbl">Teknoloji</span>
                    </div>
                     <div class="stat-box-v2">
                        <span class="val text-white" style="font-size:0.85rem;">${nation.capital || '-'}</span>
                        <span class="lbl">Başkent</span>
                    </div>
                </div>

                 <div class="alliance-section-v2" style="margin-top:12px;">
                    <span class="lbl" style="display:block; margin-bottom:6px;">Üye Olunan Paktlar</span>
                    <div class="alliance-list-v2">
                        ${alliancesHtml || '<span class="tag-v2">Tarafsız</span>'}
                    </div>
                 </div>
                 
                 <button class="nation-inspect-btn" onclick="window.location.hash = 'country/${encodeURIComponent(nation.name)}'">
                    <i class="fa-solid fa-eye"></i> Detaylı İncele
                 </button>
            </div>

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
    `;
}

export function generateMainContentHTML(buildings) {
    return `
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
