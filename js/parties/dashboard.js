// PARTİLER: DASHBOARD (YENİ DÜZEN)
import { partiesData, availableIdeologies, invitations, playerProfile } from './data.js';
import { setupModal } from './modal.js';

export function renderDashboard(container) {
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');
    const countries = [...new Set(partiesData.map(p => p.country))];
    const countryOptions = countries.map(c => `<option value="${c}">${c}</option>`).join('');

    container.innerHTML = `
        <div class="parties-dashboard-layout">
            
            <!-- SOL SÜTUN: ANA LİSTE VE FİLTRELER -->
            <div class="parties-main-col">
                <div class="parties-toolbar">
                    <div class="toolbar-top">
                        <div class="search-box">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <input type="text" id="party-search" placeholder="Parti ara...">
                        </div>
                        <button class="create-btn" data-page="parties" data-view="create">
                            <i class="fa-solid fa-plus"></i> <span>Yeni Parti</span>
                        </button>
                    </div>
                    <div class="toolbar-bottom">
                        <select id="country-filter" class="filter-select"><option value="all">Tüm Ülkeler</option>${countryOptions}</select>
                        <select id="ideology-filter" class="filter-select"><option value="all">Tüm İdeolojiler</option>${ideologyOptions}</select>
                    </div>
                </div>

                <div class="list-header-label">TÜM PARTİLER (${partiesData.length})</div>
                <div id="party-list-grid" class="party-list-grid"></div>
            </div>

            <!-- SAĞ SÜTUN: WIDGETLAR (DAVET & ÖNERİ) -->
            <div class="parties-side-col">
                
                <!-- Widget: Davetler -->
                ${invitations.length > 0 ? `
                <div class="side-widget">
                    <div class="widget-header"><i class="fa-solid fa-envelope"></i> Davetiyeler <span class="badge">${invitations.length}</span></div>
                    <div class="widget-content">
                        ${renderInvitations()}
                    </div>
                </div>` : ''}

                <!-- Widget: Önerilenler -->
                <div class="side-widget">
                    <div class="widget-header"><i class="fa-solid fa-star"></i> Sizin İçin (${playerProfile.ideology})</div>
                    <div class="widget-content">
                        ${renderRecommended()}
                    </div>
                </div>

                <!-- Widget: Bilgi -->
                <div class="info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <p>Parti kurmak için 1000 Altın ve en az 10. seviye gereklidir.</p>
                </div>

            </div>
        </div>
    `;

    setupModal(container);
    applyFilters();

    document.getElementById('party-search').addEventListener('input', applyFilters);
    document.getElementById('country-filter').addEventListener('change', applyFilters);
    document.getElementById('ideology-filter').addEventListener('change', applyFilters);
}

// --- RENDER YARDIMCILARI ---

function renderInvitations() {
    return invitations.map(inv => {
        const p = partiesData.find(x => x.id === inv.partyId);
        if(!p) return '';
        return `
            <div class="mini-invite-card" style="border-left-color:${p.color}">
                <div class="mini-invite-top">
                    <img src="https://flagcdn.com/20x15/${p.countryCode}.png" title="${p.country}">
                    <span class="sender">${inv.inviter}</span>
                </div>
                <div class="mini-invite-body">
                    <strong>${p.name}</strong>
                    <p>"${inv.message}"</p>
                </div>
                <div class="mini-invite-actions">
                    <button class="btn-accept">Kabul</button>
                    <button class="btn-reject"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>`;
    }).join('');
}

function renderRecommended() {
    const recs = partiesData.filter(p => p.ideology === playerProfile.ideology);
    if(recs.length === 0) return '<div class="empty-widget">Öneri yok.</div>';
    
    return recs.map(p => `
        <div class="mini-rec-row" data-page="parties" data-view="detail" data-id="${p.id}">
            <div class="mini-logo" style="color:${p.color}">
                ${p.logo ? `<img src="${p.logo}">` : `<i class="fa-solid ${p.icon}"></i>`}
            </div>
            <div class="mini-info">
                <div class="mini-name">${p.name}</div>
                <div class="mini-meta">${p.members} Üye • ${p.city}</div>
            </div>
            <i class="fa-solid fa-chevron-right arrow"></i>
        </div>
    `).join('');
}

function applyFilters() {
    const search = document.getElementById('party-search').value.toLowerCase();
    const country = document.getElementById('country-filter').value;
    const ideology = document.getElementById('ideology-filter').value;

    const filtered = partiesData.filter(p => {
        return (p.name.toLowerCase().includes(search) || p.shortName.toLowerCase().includes(search)) &&
               (country === 'all' || p.country === country) &&
               (ideology === 'all' || p.ideology === ideology);
    });

    const grid = document.getElementById('party-list-grid');
    grid.innerHTML = "";
    
    if(filtered.length === 0) { 
        grid.innerHTML = `<div class="empty-state">Sonuç yok.</div>`; 
        return; 
    }

    filtered.forEach(p => {
        const logo = p.logo ? `<img src="${p.logo}">` : `<i class="fa-solid ${p.icon || 'fa-flag'}"></i>`;
        const div = document.createElement('div');
        div.className = 'party-compact-card';
        div.style.borderLeft = `3px solid ${p.color}`;
        
        div.innerHTML = `
            <div class="compact-logo" style="color:${p.color}">${logo}</div>
            <div class="compact-info">
                <div class="compact-header">
                    <span class="compact-name">${p.name}</span>
                    <span class="compact-short">${p.shortName}</span>
                </div>
                <div class="compact-meta">
                    <img src="https://flagcdn.com/16x12/${p.countryCode}.png"> 
                    <span>${p.leader}</span>
                    <span class="dot">•</span>
                    <span>${p.ideology}</span>
                </div>
            </div>
            <div class="compact-stats">
                <i class="fa-solid fa-users"></i> ${p.members}
            </div>
            <button class="compact-btn" data-page="parties" data-view="detail" data-id="${p.id}">
                <i class="fa-solid fa-eye"></i>
            </button>
        `;
        // Global Click
        div.setAttribute('data-page', 'parties');
        div.setAttribute('data-view', 'detail');
        div.setAttribute('data-id', p.id);
        grid.appendChild(div);
    });
}