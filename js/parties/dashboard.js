// PARTİLER: DASHBOARD (Kompakt Sidebar + Modal Fix)
import { partiesData, availableIdeologies, invitations, playerProfile, coalitions, getPrestigeLevel, formatMoney } from './data.js';
import { setupModal, openPartyModal } from './modal.js';

export function renderDashboard(container) {
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');
    const countries = [...new Set(partiesData.map(p => p.country))];
    const countryOptions = countries.map(c => `<option value="${c}">${c}</option>`).join('');

    container.innerHTML = `
        <div class="parties-dashboard-layout">
            
            <!-- SOL SÜTUN: ANA LİSTE -->
            <div class="parties-main-col">
                <!-- Toolbar -->
                <div class="parties-toolbar">
                    <div class="toolbar-top">
                        <div class="search-box">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <input type="text" id="party-search" placeholder="Parti ara...">
                        </div>

                        <!-- KOMPAKT İKON BUTONLARI -->
                        <div class="toolbar-icons">
                            <button class="toolbar-icon-btn" id="btn-toggle-coalitions" title="İttifaklar">
                                <i class="fa-solid fa-handshake"></i>
                                ${coalitions.length > 0 ? `<span class="toolbar-badge">${coalitions.length}</span>` : ''}
                            </button>
                            <button class="toolbar-icon-btn" id="btn-toggle-invitations" title="Davetiyeler">
                                <i class="fa-solid fa-envelope"></i>
                                ${invitations.length > 0 ? `<span class="toolbar-badge pulse">${invitations.length}</span>` : ''}
                            </button>
                        </div>

                        <button class="create-btn" data-page="parties" data-view="create">
                            <i class="fa-solid fa-plus"></i> <span>Yeni Parti</span>
                        </button>
                    </div>
                    <div class="toolbar-bottom">
                        <select id="country-filter" class="filter-select"><option value="all">Tüm Ülkeler</option>${countryOptions}</select>
                        <select id="ideology-filter" class="filter-select"><option value="all">Tüm İdeolojiler</option>${ideologyOptions}</select>
                        <select id="sort-filter" class="filter-select">
                            <option value="prestige">Prestije Göre</option>
                            <option value="members">Üye Sayısı</option>
                            <option value="name">İsim (A-Z)</option>
                            <option value="newest">En Yeni</option>
                        </select>
                    </div>
                </div>

                <!-- DROPDOWN PANELLER (ikon tıklayınca açılır) -->
                <div id="panel-coalitions" class="dropdown-panel" style="display:none;">
                    <div class="dropdown-panel-header">
                        <span><i class="fa-solid fa-handshake"></i> Aktif İttifaklar</span>
                        <button class="dropdown-close" id="close-coalitions"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="dropdown-panel-body">
                        ${coalitions.length > 0 ? coalitions.map(c => {
        const members = c.partyIds.map(id => partiesData.find(p => p.id === id)).filter(Boolean);
        return `
                            <div class="mini-coalition-row" style="border-left-color:${c.color}">
                                <div class="mcr-info">
                                    <strong style="color:${c.color}">${c.name}</strong>
                                    <span class="mcr-meta">${members.map(m => m.shortName).join(' + ')} • ${members.reduce((s, m) => s + m.members, 0).toLocaleString()} üye</span>
                                </div>
                                <div class="mcr-avatars">
                                    ${members.map(p => `<div class="mcr-avatar" style="color:${p.color}" title="${p.name}"><i class="fa-solid ${p.icon || 'fa-flag'}"></i></div>`).join('')}
                                </div>
                            </div>`;
    }).join('') : '<div class="dropdown-empty">Aktif ittifak yok.</div>'}
                    </div>
                </div>

                <div id="panel-invitations" class="dropdown-panel" style="display:none;">
                    <div class="dropdown-panel-header">
                        <span><i class="fa-solid fa-envelope"></i> Davetiyeler</span>
                        <button class="dropdown-close" id="close-invitations"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="dropdown-panel-body">
                        ${invitations.length > 0 ? invitations.map(inv => {
        const p = partiesData.find(x => x.id === inv.partyId);
        if (!p) return '';
        return `
                            <div class="mini-invite-row" style="border-left-color:${p.color}">
                                <div class="mir-logo" style="color:${p.color}"><i class="fa-solid ${p.icon || 'fa-flag'}"></i></div>
                                <div class="mir-info">
                                    <strong>${p.name}</strong>
                                    <span>${inv.inviter} — "${inv.message}"</span>
                                </div>
                                <div class="mir-actions">
                                    <button class="mir-accept"><i class="fa-solid fa-check"></i></button>
                                    <button class="mir-reject"><i class="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>`;
    }).join('') : '<div class="dropdown-empty">Davetiye yok.</div>'}
                    </div>
                </div>

                <div class="list-header-label">TÜM PARTİLER (${partiesData.length})</div>
                
                <!-- Liste Wrapper -->
                <div class="party-list-wrapper">
                    <div id="party-list-grid" class="party-list-grid"></div>
                </div>
            </div>

            <!-- SAĞ SÜTUN: WIDGETLAR (sadece öneriler ve bilgi) -->
            <div class="parties-side-col">
                <!-- Öneriler -->
                <div class="side-widget">
                    <div class="widget-header"><i class="fa-solid fa-star"></i> Sizin İçin (${playerProfile.ideology})</div>
                    <div class="widget-content">${renderRecommended()}</div>
                </div>

                <!-- Bilgi -->
                <div class="info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <p>Parti kurmak için 1000 Altın ve en az 10. seviye gereklidir.</p>
                </div>
            </div>
        </div>
    `;

    setupModal(container);
    applyFilters();
    setupRecommendedClicks();

    // --- EVENT LISTENERS ---
    document.getElementById('party-search').addEventListener('input', applyFilters);
    document.getElementById('country-filter').addEventListener('change', applyFilters);
    document.getElementById('ideology-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-filter').addEventListener('change', applyFilters);

    // Dropdown toggle: İttifaklar
    document.getElementById('btn-toggle-coalitions').addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel('panel-coalitions', 'panel-invitations');
    });
    document.getElementById('close-coalitions').addEventListener('click', () => {
        document.getElementById('panel-coalitions').style.display = 'none';
    });

    // Dropdown toggle: Davetiyeler
    document.getElementById('btn-toggle-invitations').addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel('panel-invitations', 'panel-coalitions');
    });
    document.getElementById('close-invitations').addEventListener('click', () => {
        document.getElementById('panel-invitations').style.display = 'none';
    });

}

// Dropdown panel toggle
function togglePanel(showId, hideId) {
    const showPanel = document.getElementById(showId);
    const hidePanel = document.getElementById(hideId);
    if (hidePanel) hidePanel.style.display = 'none';
    if (showPanel) {
        showPanel.style.display = showPanel.style.display === 'none' ? 'block' : 'none';
    }
}

// --- RENDER YARDIMCILARI ---

function renderRecommended() {
    const recs = partiesData.filter(p => p.ideology === playerProfile.ideology);
    if (recs.length === 0) return '<div style="color:#64748b; font-size:0.85rem; text-align:center;">Öneri bulunamadı.</div>';

    return recs.map(p => `
        <div class="mini-rec-row" data-party-id="${p.id}" style="cursor:pointer">
            <div class="mini-logo" style="color:${p.color}">
                ${p.logo ? `<img src="${p.logo}">` : `<i class="fa-solid ${p.icon}"></i>`}
            </div>
            <div class="mini-info">
                <div class="mini-name">${p.name}</div>
                <span class="mini-meta">${p.members} Üye • ${p.city}</span>
            </div>
            <i class="fa-solid fa-chevron-right arrow"></i>
        </div>
    `).join('');
}

// Sidebar önerilere click handler ekle
function setupRecommendedClicks() {
    document.querySelectorAll('.mini-rec-row[data-party-id]').forEach(row => {
        row.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = row.getAttribute('data-party-id');
            const party = partiesData.find(p => p.id == id);
            if (party) {
                try {
                    openPartyModal(party);
                } catch (err) {
                    console.error('Modal açma hatası:', err);
                }
            }
        });
    });
}

function applyFilters() {
    const search = document.getElementById('party-search').value.toLowerCase();
    const country = document.getElementById('country-filter').value;
    const ideology = document.getElementById('ideology-filter').value;
    const sort = document.getElementById('sort-filter').value;

    let filtered = partiesData.filter(p => {
        return (p.name.toLowerCase().includes(search) || p.shortName.toLowerCase().includes(search)) &&
            (country === 'all' || p.country === country) &&
            (ideology === 'all' || p.ideology === ideology);
    });

    // Sıralama
    switch (sort) {
        case 'prestige': filtered.sort((a, b) => b.prestige - a.prestige); break;
        case 'members': filtered.sort((a, b) => b.members - a.members); break;
        case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr')); break;
        case 'newest': filtered.sort((a, b) => b.founded.localeCompare(a.founded)); break;
    }

    const grid = document.getElementById('party-list-grid');
    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">Kriterlere uygun parti bulunamadı.</div>`;
        return;
    }

    filtered.forEach((p, index) => {
        const logo = p.logo ? `<img src="${p.logo}">` : `<i class="fa-solid ${p.icon || 'fa-flag'}"></i>`;
        const prestige = getPrestigeLevel(p.prestige);
        const coalition = p.coalitionId ? coalitions.find(c => c.id === p.coalitionId) : null;

        const div = document.createElement('div');
        div.className = 'party-row-card';
        div.style.setProperty('--party-color', p.color);
        div.style.animationDelay = `${index * 0.04}s`;

        div.innerHTML = `
            <div class="row-border-strip" style="background-color:${p.color}"></div>
            <div class="row-logo" style="color:${p.color}">${logo}</div>
            
            <div class="row-main">
                <div class="row-name">
                    ${p.name} 
                    <img src="https://flagcdn.com/16x12/${p.countryCode}.png" title="${p.country}">
                    <span style="color:#64748b; font-weight:400; font-size:0.9rem; margin-left:5px;">${p.shortName}</span>
                    ${coalition ? `<span class="coalition-chip" style="background:${coalition.color}22; color:${coalition.color}; border:1px solid ${coalition.color}44"><i class="fa-solid fa-handshake"></i> ${coalition.name}</span>` : ''}
                </div>
                <div class="row-leader">
                    <span style="color:${p.color}">${p.ideology}</span> • ${p.leader}
                </div>
            </div>

            <div class="row-prestige" style="color:${prestige.color}" title="${prestige.name}">
                <i class="fa-solid ${prestige.icon}"></i>
                <span>${formatMoney(p.prestige)}</span>
            </div>

            <div class="row-stats">
                <i class="fa-solid fa-users"></i> ${formatMoney(p.members)}
            </div>

            <div class="row-seats">
                <i class="fa-solid fa-chair"></i> ${p.stats.seatsInParliament}
            </div>

            <button class="row-btn">
                <i class="fa-solid fa-eye"></i>
            </button>
        `;

        // Parti kartına tıkla → modal aç
        div.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openPartyModal(p);
        });

        grid.appendChild(div);
    });
}