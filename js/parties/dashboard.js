// PARTİLER: DASHBOARD (Genişletilmiş)
import { partiesData, availableIdeologies, invitations, playerProfile, coalitions, getPrestigeLevel, formatMoney } from './data.js';
import { setupModal } from './modal.js';

export function renderDashboard(container) {
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');
    const countries = [...new Set(partiesData.map(p => p.country))];
    const countryOptions = countries.map(c => `<option value="${c}">${c}</option>`).join('');

    // Genel istatistikler
    const totalMembers = partiesData.reduce((s, p) => s + p.members, 0);
    const totalSeats = partiesData.reduce((s, p) => s + p.stats.seatsInParliament, 0);

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

                <div class="list-header-label">TÜM PARTİLER (${partiesData.length})</div>
                
                <!-- Liste Wrapper -->
                <div class="party-list-wrapper">
                    <div id="party-list-grid" class="party-list-grid"></div>
                </div>
            </div>

            <!-- SAĞ SÜTUN: WIDGETLAR -->
            <div class="parties-side-col">
                
                <!-- 1. İstatistik Özeti -->
                <div class="side-widget">
                    <div class="widget-header"><i class="fa-solid fa-chart-simple"></i> Genel Bakış</div>
                    <div class="widget-content">
                        <div class="mini-stats-grid">
                            <div class="mini-stat">
                                <div class="ms-value">${partiesData.length}</div>
                                <div class="ms-label">Parti</div>
                            </div>
                            <div class="mini-stat">
                                <div class="ms-value">${formatMoney(totalMembers)}</div>
                                <div class="ms-label">Üye</div>
                            </div>
                            <div class="mini-stat">
                                <div class="ms-value">${coalitions.length}</div>
                                <div class="ms-label">İttifak</div>
                            </div>
                            <div class="mini-stat">
                                <div class="ms-value">${totalSeats}</div>
                                <div class="ms-label">Koltuk</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. Aktif İttifaklar -->
                ${coalitions.length > 0 ? `
                <div class="side-widget">
                    <div class="widget-header"><i class="fa-solid fa-handshake"></i> Aktif İttifaklar</div>
                    <div class="widget-content">
                        ${coalitions.map(c => {
        const members = c.partyIds.map(id => partiesData.find(p => p.id === id)).filter(Boolean);
        return `
                            <div class="mini-coalition-card" style="border-left-color:${c.color}">
                                <div class="mcc-header">
                                    <strong style="color:${c.color}">${c.name}</strong>
                                    <span class="mcc-count">${members.length} parti</span>
                                </div>
                                <div class="mcc-avatars">
                                    ${members.map(p => `
                                        <div class="mcc-avatar" style="color:${p.color}; border-color:${p.color}44" title="${p.name}">
                                            <i class="fa-solid ${p.icon || 'fa-flag'}"></i>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>`;
    }).join('')}
                    </div>
                </div>` : ''}

                <!-- 3. Davetiyeler -->
                ${invitations.length > 0 ? `
                <div class="side-widget">
                    <div class="widget-header"><i class="fa-solid fa-envelope"></i> Davetiyeler <span class="badge">${invitations.length}</span></div>
                    <div class="widget-content">${renderInvitations()}</div>
                </div>` : ''}

                <!-- 4. Öneriler -->
                <div class="side-widget">
                    <div class="widget-header"><i class="fa-solid fa-star"></i> Sizin İçin (${playerProfile.ideology})</div>
                    <div class="widget-content">${renderRecommended()}</div>
                </div>

                <!-- 5. Bilgi -->
                <div class="info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <p>Parti kurmak için 1000 Altın ve en az 10. seviye gereklidir.</p>
                </div>
            </div>
        </div>
    `;

    setupModal(container);
    applyFilters();

    // Event Listeners
    document.getElementById('party-search').addEventListener('input', applyFilters);
    document.getElementById('country-filter').addEventListener('change', applyFilters);
    document.getElementById('ideology-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-filter').addEventListener('change', applyFilters);
}

// --- RENDER YARDIMCILARI ---

function renderInvitations() {
    return invitations.map(inv => {
        const p = partiesData.find(x => x.id === inv.partyId);
        if (!p) return '';
        return `
            <div class="mini-invite-card" style="border-left-color:${p.color}">
                <div class="mini-invite-top">
                    <span style="color:var(--text-dim); font-size:0.8rem">${inv.inviter}</span>
                    <img src="https://flagcdn.com/20x15/${p.countryCode}.png">
                </div>
                <div class="mini-invite-body">
                    <strong>${p.name}</strong>
                    <p>"${inv.message}"</p>
                </div>
                <button class="btn-accept">Kabul</button>
            </div>`;
    }).join('');
}

function renderRecommended() {
    const recs = partiesData.filter(p => p.ideology === playerProfile.ideology);
    if (recs.length === 0) return '<div style="color:#64748b; font-size:0.85rem; text-align:center;">Öneri bulunamadı.</div>';

    return recs.map(p => `
        <div class="mini-rec-row" data-page="parties" data-view="detail" data-id="${p.id}">
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

            <button class="row-btn" data-page="parties" data-view="detail" data-id="${p.id}">
                <i class="fa-solid fa-eye"></i>
            </button>
        `;

        div.setAttribute('data-page', 'parties');
        div.setAttribute('data-view', 'detail');
        div.setAttribute('data-id', p.id);

        grid.appendChild(div);
    });
}