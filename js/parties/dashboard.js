// PARTİLER: ANA LİSTE VE DASHBOARD
import { partiesData, availableIdeologies, invitations, playerProfile } from './data.js';
import { setupModal } from './modal.js';

export function renderDashboard(container) {
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');
    const countries = [...new Set(partiesData.map(p => p.country))];
    const countryOptions = countries.map(c => `<option value="${c}">${c}</option>`).join('');

    container.innerHTML = `
        <div class="parties-wrapper">
            ${renderInvitations()}
            ${renderRecommended()}
            
            <div class="list-section">
                <div class="section-title"><h3><i class="fa-solid fa-list-ul"></i> Tüm Partiler</h3></div>
                
                <div class="parties-toolbar">
                    <div class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input type="text" id="party-search" placeholder="Parti ara..."></div>
                    <div class="filter-group">
                        <select id="country-filter" class="filter-select"><option value="all">Tüm Ülkeler</option>${countryOptions}</select>
                        <select id="ideology-filter" class="filter-select"><option value="all">Tüm İdeolojiler</option>${ideologyOptions}</select>
                    </div>
                    <button class="create-btn" data-page="parties" data-view="create"><i class="fa-solid fa-plus"></i> Parti Kur</button>
                </div>

                <div id="party-list-grid" class="party-list-grid"></div>
            </div>
        </div>
    `;

    // Modal Kurulumu
    setupModal(container);

    // İlk Liste Render
    applyFilters();

    // Eventler
    document.getElementById('party-search').addEventListener('input', applyFilters);
    document.getElementById('country-filter').addEventListener('change', applyFilters);
    document.getElementById('ideology-filter').addEventListener('change', applyFilters);
}

function renderInvitations() {
    if (invitations.length === 0) return '';
    const items = invitations.map(inv => {
        const p = partiesData.find(x => x.id === inv.partyId);
        if(!p) return '';
        return `
            <div class="invite-card">
                <div class="invite-header"><img src="https://flagcdn.com/20x15/${p.countryCode}.png"> Davet: ${inv.inviter}</div>
                <div class="invite-body">
                    <div class="invite-party-name">${p.name}</div>
                    <div class="invite-msg">"${inv.message}"</div>
                </div>
                <div class="invite-actions"><button class="accept-btn">Katıl</button></div>
            </div>`;
    }).join('');
    return `<div class="invitations-section"><div class="section-title"><h3>Bekleyen Davetler</h3></div><div class="invites-grid">${items}</div></div>`;
}

function renderRecommended() {
    const recs = partiesData.filter(p => p.ideology === playerProfile.ideology);
    if(recs.length === 0) return '';
    
    const items = recs.map(p => `
        <div class="rec-card" data-page="parties" data-view="detail" data-id="${p.id}">
            <div class="rec-bg" style="background:${p.color}"></div>
            <div class="rec-content">
                <div class="rec-name">${p.name}</div>
                <div class="rec-meta">${p.city} • ${p.members} Üye</div>
            </div>
            <div class="rec-badge">Önerilen</div>
        </div>
    `).join('');
    return `<div class="recommended-section"><div class="section-title"><h3>Sizin İçin Önerilenler</h3></div><div class="rec-grid">${items}</div></div>`;
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
    
    if(filtered.length === 0) { grid.innerHTML = `<div class="empty-state">Sonuç yok.</div>`; return; }

    filtered.forEach(p => {
        const logo = p.logo ? `<img src="${p.logo}">` : `<i class="fa-solid ${p.icon || 'fa-flag'}"></i>`;
        const div = document.createElement('div');
        div.className = 'party-list-card';
        div.style.borderLeft = `4px solid ${p.color}`;
        div.innerHTML = `
            <div class="list-logo" style="color:${p.color}">${logo}</div>
            <div class="list-info">
                <div class="list-name">${p.name} <img src="https://flagcdn.com/16x12/${p.countryCode}.png"></div>
                <div class="list-sub">${p.leader} • ${p.members} Üye</div>
            </div>
            <div class="list-tag">${p.ideology}</div>
            <button class="details-btn" data-page="parties" data-view="detail" data-id="${p.id}">İncele</button>
        `;
        div.setAttribute('data-page', 'parties');
        div.setAttribute('data-view', 'detail');
        div.setAttribute('data-id', p.id);
        grid.appendChild(div);
    });
}