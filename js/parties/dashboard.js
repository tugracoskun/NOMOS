// PARTİLER: DASHBOARD
import { partiesData, availableIdeologies, invitations, playerProfile } from './data.js';
import { setupModal } from './modal.js';

export function renderDashboard(container) {
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');
    const countries = [...new Set(partiesData.map(p => p.country))];
    const countryOptions = countries.map(c => `<option value="${c}">${c}</option>`).join('');

    container.innerHTML = `
        <div class="parties-wrapper">
            <!-- 1. DAVETLER -->
            ${renderInvitations()}

            <!-- 2. ÖNERİLENLER -->
            ${renderRecommended()}
            
            <!-- 3. ANA LİSTE -->
            <div class="list-section">
                <div class="section-title">
                    <h3><i class="fa-solid fa-earth-americas"></i> Siyasi Partiler Listesi</h3>
                </div>
                
                <div class="parties-toolbar">
                    <div class="search-box">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="party-search" placeholder="İsim veya Kısaltma ara...">
                    </div>
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

    setupModal(container);
    applyFilters();

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
                <div class="invite-header">
                    <span>Davet Eden: <b>${inv.inviter}</b></span>
                    <img src="https://flagcdn.com/20x15/${p.countryCode}.png">
                </div>
                <div class="invite-body">
                    <div class="invite-logo-box" style="color:${p.color}"><i class="fa-solid ${p.icon}"></i></div>
                    <div class="invite-details">
                        <h4>${p.name}</h4>
                        <div class="invite-msg">"${inv.message}"</div>
                    </div>
                </div>
                <div class="invite-actions">
                    <button class="accept-btn">Kabul Et</button>
                </div>
            </div>`;
    }).join('');
    return `<div class="section-title"><h3><i class="fa-solid fa-envelope"></i> Davetiyeler</h3></div><div class="invites-grid">${items}</div><br>`;
}

function renderRecommended() {
    const recs = partiesData.filter(p => p.ideology === playerProfile.ideology);
    if(recs.length === 0) return '';
    
    const items = recs.map(p => `
        <div class="rec-card" style="--party-color:${p.color}" data-page="parties" data-view="detail" data-id="${p.id}">
            <div class="rec-content">
                <div class="rec-info">
                    <h4>${p.name}</h4>
                    <span class="rec-meta">${p.city}, ${p.country}</span>
                </div>
            </div>
            <div style="margin-left:auto; color:var(--text-dim);"><i class="fa-solid fa-chevron-right"></i></div>
        </div>
    `).join('');
    return `<div class="section-title"><h3><i class="fa-solid fa-star"></i> Sizin İçin Önerilenler</h3></div><div class="rec-grid">${items}</div><br>`;
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
    
    if(filtered.length === 0) { grid.innerHTML = `<div style="text-align:center; padding:30px; color:#64748b;">Sonuç yok.</div>`; return; }

    filtered.forEach(p => {
        const logo = p.logo ? `<img src="${p.logo}">` : `<i class="fa-solid ${p.icon || 'fa-flag'}"></i>`;
        
        const div = document.createElement('div');
        div.className = 'party-row-card';
        // Renk değişkenini CSS'e gönderiyoruz
        div.style.setProperty('--party-color', p.color);
        
        div.innerHTML = `
            <div class="party-color-strip"></div>
            
            <div class="row-logo" style="color:${p.color}">${logo}</div>
            
            <div class="row-main">
                <div class="row-name">
                    ${p.name} 
                    <img src="https://flagcdn.com/16x12/${p.countryCode}.png" title="${p.country}">
                </div>
                <div class="row-leader"><i class="fa-solid fa-user-tie"></i> ${p.leader}</div>
            </div>

            <div class="row-ideology">
                <span class="ideology-badge">${p.ideology}</span>
            </div>

            <div class="row-stats">
                <div class="member-count">${p.members} Üye</div>
                <div style="font-size:0.8rem">${p.founded}</div>
            </div>

            <div class="row-action">
                <button class="btn-inspect" data-page="parties" data-view="detail" data-id="${p.id}">İNCELE</button>
            </div>
        `;
        
        // Karta tıklayınca da çalışsın
        div.setAttribute('data-page', 'parties');
        div.setAttribute('data-view', 'detail');
        div.setAttribute('data-id', p.id);
        
        grid.appendChild(div);
    });
}