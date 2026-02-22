// PARTİLER: DETAY MODALI (Gelişmiş Sekmeli Profil)
import { partiesData, coalitions, getPrestigeLevel, formatMoney } from './data.js';

export function setupModal(container) {
    if (!document.getElementById('party-modal')) {
        const modalHtml = `
            <div id="party-modal" class="modal-overlay" style="display:none;">
                <div class="modal-content">
                    <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
                    <div id="modal-body"></div>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', modalHtml);
    }

    const modal = document.getElementById('party-modal');
    const closeAction = () => {
        modal.classList.add('modal-closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('modal-closing');
            // Hash'i #parties olarak güncelle (sayfa yeniden render edilmez)
            if (window.location.hash.includes('detail')) {
                history.replaceState({ page: 'parties' }, null, '#parties');
            }
        }, 250);
    };

    modal.addEventListener('click', (e) => { if (e.target === modal) closeAction(); });
    document.querySelector('.close-modal').addEventListener('click', closeAction);
}

export function openPartyModal(party) {
    const modal = document.getElementById('party-modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body) return;

    const prestige = getPrestigeLevel(party.prestige);

    let logoDisplay = party.logo
        ? `<img src="${party.logo}" class="modal-logo-img">`
        : `<div class="big-logo" style="color:${party.color}"><i class="fa-solid ${party.icon || 'fa-flag'}"></i></div>`;

    body.innerHTML = `
        <!-- HEADER -->
        <div class="party-profile-header" style="background: linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.7) 50%, rgba(15,23,42,0.95) 100%), linear-gradient(135deg, ${party.color}44 0%, transparent 60%);">
            <div class="header-left">
                ${logoDisplay}
                <div class="header-texts">
                    <h1>${party.name} <img src="https://flagcdn.com/32x24/${party.countryCode}.png" title="${party.country}"></h1>
                    <p class="slogan">"${party.slogan || ''}"</p>
                    <div class="header-meta-row">
                        <span class="prestige-badge" style="background:${prestige.color}22; color:${prestige.color}; border:1px solid ${prestige.color}44">
                            <i class="fa-solid ${prestige.icon}"></i> ${prestige.name} • ${party.prestige.toLocaleString()} PP
                        </span>
                        <span class="meta-chip"><i class="fa-solid fa-users"></i> ${party.members.toLocaleString()} Üye</span>
                        <span class="meta-chip"><i class="fa-solid fa-chair"></i> ${party.stats.seatsInParliament} Koltuk</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- SEKMELER -->
        <div class="profile-tabs">
            <button class="tab-btn active" data-tab="overview"><i class="fa-solid fa-house"></i> Genel Bakış</button>
            <button class="tab-btn" data-tab="stats"><i class="fa-solid fa-chart-bar"></i> İstatistikler</button>
            <button class="tab-btn" data-tab="finance"><i class="fa-solid fa-coins"></i> Finans</button>
            <button class="tab-btn" data-tab="coalition"><i class="fa-solid fa-handshake"></i> Koalisyon</button>
            <button class="tab-btn" data-tab="history"><i class="fa-solid fa-clock-rotate-left"></i> Tarihçe</button>
        </div>

        <!-- SEKME İÇERİKLERİ -->
        <div class="tab-content-area">
            ${renderOverviewTab(party)}
            ${renderStatsTab(party)}
            ${renderFinanceTab(party)}
            ${renderCoalitionTab(party)}
            ${renderHistoryTab(party)}
        </div>
    `;

    modal.style.display = 'flex';
    modal.classList.remove('modal-closing');

    // Sekme Geçişleri
    body.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            body.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            body.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = body.querySelector(`#tab-${btn.dataset.tab}`);
            if (panel) panel.classList.add('active');
        });
    });
}

// =============================================
// SEKME 1: GENEL BAKIŞ
// =============================================
function renderOverviewTab(party) {
    const prestige = getPrestigeLevel(party.prestige);
    const nextLevel = getPrestigeLevel(party.prestige + 1);
    const currentLevel = prestige;

    // Prestij çubuğu hesaplaması
    let progressPercent = 0;
    if (currentLevel.max !== Infinity) {
        progressPercent = ((party.prestige - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
    } else {
        progressPercent = 100;
    }

    return `
    <div id="tab-overview" class="tab-panel active">
        <div class="overview-grid">
            <!-- SOL: BİLGİ KARTI -->
            <div class="wiki-infobox">
                <div class="wiki-title">Künye</div>
                <div class="wiki-row"><span>Merkez</span> <strong>${party.city}, ${party.country}</strong></div>
                <div class="wiki-row"><span>Lider</span> <strong>${party.leader}</strong></div>
                <div class="wiki-row"><span>Kuruluş</span> <strong>${party.founded}</strong></div>
                <div class="wiki-row"><span>İdeoloji</span> <span class="ideo-tag" style="color:${party.color}; background:${party.color}15">${party.ideology}</span></div>
                <div class="wiki-row"><span>Kısaltma</span> <strong>${party.shortName}</strong></div>
                <div class="wiki-row"><span>Maaş</span> <strong style="color:#eab308">${party.wage}</strong></div>
                <div class="wiki-row"><span>Aidat</span> <strong style="color:#eab308">${party.finance.memberDues} G/ay</strong></div>

                <div class="wiki-section-title">Prestij</div>
                <div class="prestige-progress-area">
                    <div class="prestige-level-display" style="color:${prestige.color}">
                        <i class="fa-solid ${prestige.icon}"></i> ${prestige.name}
                    </div>
                    <div class="prestige-bar-track">
                        <div class="prestige-bar-fill" style="width:${progressPercent}%; background:${prestige.color}"></div>
                    </div>
                    <div class="prestige-numbers">
                        <span>${party.prestige.toLocaleString()} PP</span>
                        <span>${currentLevel.max !== Infinity ? currentLevel.max.toLocaleString() + ' PP' : '∞'}</span>
                    </div>
                </div>
            </div>

            <!-- SAĞ: İÇERİK -->
            <div class="overview-main">
                <h3>Hakkında</h3>
                <p class="about-text">${party.description}</p>

                <h3>Politikalar</h3>
                <div class="policies-grid">
                    ${party.policies.map(p => `
                        <div class="policy-card">
                            <i class="fa-solid fa-check-circle" style="color:${party.color}"></i>
                            <span>${p}</span>
                        </div>
                    `).join('')}
                </div>

                <h3>Son Aktiviteler</h3>
                <div class="mini-activity-list">
                    ${(party.stats.activityLog || []).slice(0, 3).map(a => `
                        <div class="mini-activity-row">
                            <div class="activity-dot" style="background:${getActivityColor(a.type)}"></div>
                            <span class="activity-text">${a.action}</span>
                            <span class="activity-date">${a.date}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="action-buttons">
                    <button class="join-party-btn" style="background:${party.color}">
                        <i class="fa-solid fa-right-to-bracket"></i> Partiye Katıl
                    </button>
                    <button class="donate-btn">
                        <i class="fa-solid fa-hand-holding-heart"></i> Bağış Yap
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

// =============================================
// SEKME 2: İSTATİSTİKLER
// =============================================
function renderStatsTab(party) {
    const s = party.stats;
    const activityRate = party.members > 0 ? ((s.activeMembers / party.members) * 100).toFixed(1) : 0;
    const lawSuccessRate = s.lawsProposed > 0 ? ((s.lawsPassed / s.lawsProposed) * 100).toFixed(0) : 0;

    return `
    <div id="tab-stats" class="tab-panel">
        <!-- ÜST: STAT KARTLARI -->
        <div class="stat-cards-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background:rgba(59,130,246,0.15); color:#3b82f6"><i class="fa-solid fa-users"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${party.members.toLocaleString()}</div>
                    <div class="stat-label">Toplam Üye</div>
                </div>
                <div class="stat-trend positive"><i class="fa-solid fa-arrow-up"></i> ${s.weeklyGrowth}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background:rgba(16,185,129,0.15); color:#10b981"><i class="fa-solid fa-user-check"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${s.activeMembers.toLocaleString()}</div>
                    <div class="stat-label">Aktif Üye</div>
                </div>
                <div class="stat-trend neutral">${activityRate}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background:rgba(168,85,247,0.15); color:#a855f7"><i class="fa-solid fa-box-ballot"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${s.totalVotes.toLocaleString()}</div>
                    <div class="stat-label">Toplam Oy</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background:rgba(234,179,8,0.15); color:#eab308"><i class="fa-solid fa-chair"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${s.seatsInParliament}</div>
                    <div class="stat-label">Meclis Koltuğu</div>
                </div>
            </div>
        </div>

        <!-- ALT: PERFORMANS ve SEÇİM -->
        <div class="stats-bottom-grid">
            <!-- SOL: PERFORMANS -->
            <div class="stats-section">
                <h4><i class="fa-solid fa-gavel"></i> Yasama Performansı</h4>
                <div class="law-stats">
                    <div class="law-stat-row">
                        <span>Teklif Edilen Yasalar</span>
                        <strong>${s.lawsProposed}</strong>
                    </div>
                    <div class="law-stat-row">
                        <span>Kabul Edilen Yasalar</span>
                        <strong style="color:#10b981">${s.lawsPassed}</strong>
                    </div>
                    <div class="law-stat-row">
                        <span>Başarı Oranı</span>
                        <div class="mini-progress-track">
                            <div class="mini-progress-fill" style="width:${lawSuccessRate}%; background:${parseInt(lawSuccessRate) > 50 ? '#10b981' : parseInt(lawSuccessRate) > 25 ? '#eab308' : '#ef4444'}"></div>
                        </div>
                        <strong>${lawSuccessRate}%</strong>
                    </div>
                </div>

                <h4 style="margin-top:25px"><i class="fa-solid fa-signal"></i> Üye Aktivitesi</h4>
                <div class="activity-gauge">
                    <div class="gauge-track">
                        <div class="gauge-fill" style="width:${activityRate}%; background: linear-gradient(90deg, #ef4444, #eab308, #10b981)"></div>
                    </div>
                    <div class="gauge-labels">
                        <span>Düşük</span>
                        <span class="gauge-value">${activityRate}%</span>
                        <span>Yüksek</span>
                    </div>
                </div>
            </div>

            <!-- SAĞ: SEÇİM GEÇMİŞİ -->
            <div class="stats-section">
                <h4><i class="fa-solid fa-chart-line"></i> Seçim Geçmişi</h4>
                ${s.electionHistory.length > 0 ? `
                    <div class="election-chart">
                        ${renderBarChart(s.electionHistory, party.color)}
                    </div>
                    <table class="election-table">
                        <thead><tr><th>Dönem</th><th>Oy</th><th>%</th><th>Koltuk</th><th>Sıra</th></tr></thead>
                        <tbody>
                            ${s.electionHistory.map(e => `
                                <tr>
                                    <td>${e.year}</td>
                                    <td>${e.votes.toLocaleString()}</td>
                                    <td style="color:${party.color}">%${e.percentage}</td>
                                    <td>${e.seats}</td>
                                    <td><span class="rank-badge rank-${e.rank}">#${e.rank}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<div class="empty-section">Henüz seçim verisi bulunmuyor.</div>'}
            </div>
        </div>
    </div>`;
}

// =============================================
// SEKME 3: FİNANS
// =============================================
function renderFinanceTab(party) {
    const f = party.finance;
    const netIncome = f.monthlyIncome - f.monthlyExpense;
    const totalDonations = f.donations.reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = f.expenses.reduce((sum, e) => sum + e.amount, 0);
    const maxExpense = Math.max(...f.expenses.map(e => e.amount));

    return `
    <div id="tab-finance" class="tab-panel">
        <!-- ÜST: FİNANS ÖZETİ -->
        <div class="finance-summary-grid">
            <div class="finance-card treasury">
                <div class="fc-icon"><i class="fa-solid fa-vault"></i></div>
                <div class="fc-info">
                    <div class="fc-label">Hazine</div>
                    <div class="fc-value">${f.treasury.toLocaleString()} G</div>
                </div>
            </div>
            <div class="finance-card income">
                <div class="fc-icon"><i class="fa-solid fa-arrow-down"></i></div>
                <div class="fc-info">
                    <div class="fc-label">Aylık Gelir</div>
                    <div class="fc-value">+${f.monthlyIncome.toLocaleString()} G</div>
                </div>
            </div>
            <div class="finance-card expense">
                <div class="fc-icon"><i class="fa-solid fa-arrow-up"></i></div>
                <div class="fc-info">
                    <div class="fc-label">Aylık Gider</div>
                    <div class="fc-value">-${f.monthlyExpense.toLocaleString()} G</div>
                </div>
            </div>
            <div class="finance-card net ${netIncome >= 0 ? 'positive' : 'negative'}">
                <div class="fc-icon"><i class="fa-solid fa-scale-balanced"></i></div>
                <div class="fc-info">
                    <div class="fc-label">Net Gelir</div>
                    <div class="fc-value">${netIncome >= 0 ? '+' : ''}${netIncome.toLocaleString()} G</div>
                </div>
            </div>
        </div>

        <div class="finance-bottom-grid">
            <!-- SOL: GİDER DAĞILIMI -->
            <div class="stats-section">
                <h4><i class="fa-solid fa-chart-pie"></i> Gider Dağılımı</h4>
                <div class="expense-bars">
                    ${f.expenses.map((e, i) => {
        const percent = totalExpenses > 0 ? ((e.amount / totalExpenses) * 100).toFixed(1) : 0;
        const barWidth = maxExpense > 0 ? ((e.amount / maxExpense) * 100) : 0;
        const colors = ['#3b82f6', '#10b981', '#eab308', '#ef4444', '#a855f7', '#f97316'];
        return `
                        <div class="expense-row">
                            <div class="expense-info">
                                <span class="expense-dot" style="background:${colors[i % colors.length]}"></span>
                                <span class="expense-name">${e.category}</span>
                                <span class="expense-amount">${e.amount.toLocaleString()} G</span>
                                <span class="expense-percent">${percent}%</span>
                            </div>
                            <div class="expense-bar-track">
                                <div class="expense-bar-fill" style="width:${barWidth}%; background:${colors[i % colors.length]}"></div>
                            </div>
                        </div>`;
    }).join('')}
                </div>

                <div class="finance-info-row">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Üye Aidat: <strong>${f.memberDues} G/ay</strong> × ${party.stats.activeMembers} aktif üye = <strong style="color:#10b981">${(f.memberDues * party.stats.activeMembers).toLocaleString()} G</strong></span>
                </div>
            </div>

            <!-- SAĞ: BAĞIŞLAR -->
            <div class="stats-section">
                <h4><i class="fa-solid fa-hand-holding-heart"></i> Son Bağışlar</h4>
                <div class="donations-list">
                    ${f.donations.map(d => `
                        <div class="donation-row">
                            <div class="donor-avatar"><i class="fa-solid fa-user"></i></div>
                            <div class="donor-info">
                                <span class="donor-name">${d.donor}</span>
                                <span class="donor-date">${d.date}</span>
                            </div>
                            <span class="donor-amount">+${d.amount.toLocaleString()} G</span>
                        </div>
                    `).join('')}
                </div>

                <div class="donation-total">
                    <span>Toplam Bağışlar</span>
                    <strong>${totalDonations.toLocaleString()} G</strong>
                </div>

                <button class="donate-action-btn" style="background:${party.color}">
                    <i class="fa-solid fa-hand-holding-heart"></i> Bağış Yap
                </button>
            </div>
        </div>
    </div>`;
}

// =============================================
// SEKME 4: KOALİSYON
// =============================================
function renderCoalitionTab(party) {
    const coalition = party.coalitionId ? coalitions.find(c => c.id === party.coalitionId) : null;

    return `
    <div id="tab-coalition" class="tab-panel">
        ${coalition ? renderExistingCoalition(party, coalition) : renderNoCoalition(party)}
    </div>`;
}

function renderExistingCoalition(party, coalition) {
    const partners = coalition.partyIds
        .map(id => partiesData.find(p => p.id === id))
        .filter(Boolean);

    const totalVotes = partners.reduce((s, p) => s + p.stats.totalVotes, 0);
    const totalSeats = partners.reduce((s, p) => s + p.stats.seatsInParliament, 0);
    const totalMembers = partners.reduce((s, p) => s + p.members, 0);

    return `
        <div class="coalition-header" style="background: linear-gradient(135deg, ${coalition.color}15 0%, transparent 100%); border:1px solid ${coalition.color}33">
            <div class="coalition-icon" style="color:${coalition.color}"><i class="fa-solid fa-handshake-angle"></i></div>
            <div class="coalition-info">
                <h3 style="color:${coalition.color}">${coalition.name}</h3>
                <p>${coalition.description}</p>
                <span class="coalition-date"><i class="fa-solid fa-calendar"></i> Kuruluş: ${coalition.founded}</span>
            </div>
        </div>

        <!-- İttifak İstatistikleri -->
        <div class="coalition-stats">
            <div class="cs-item">
                <div class="cs-value">${partners.length}</div>
                <div class="cs-label">Parti</div>
            </div>
            <div class="cs-item">
                <div class="cs-value">${totalMembers.toLocaleString()}</div>
                <div class="cs-label">Toplam Üye</div>
            </div>
            <div class="cs-item">
                <div class="cs-value">${totalSeats}</div>
                <div class="cs-label">Toplam Koltuk</div>
            </div>
            <div class="cs-item">
                <div class="cs-value">${totalVotes.toLocaleString()}</div>
                <div class="cs-label">Toplam Oy</div>
            </div>
        </div>

        <!-- İttifak Üyeleri -->
        <div class="coalition-partners-section">
            <h4><i class="fa-solid fa-users-rectangle"></i> İttifak Üyeleri</h4>
            <div class="partner-cards">
                ${partners.map(p => {
        const pl = getPrestigeLevel(p.prestige);
        return `
                    <div class="partner-card" style="border-color:${p.color}33">
                        <div class="partner-top" style="background: linear-gradient(135deg, ${p.color}15 0%, transparent 100%)">
                            <div class="partner-logo" style="color:${p.color}">
                                ${p.logo ? `<img src="${p.logo}">` : `<i class="fa-solid ${p.icon || 'fa-flag'}"></i>`}
                            </div>
                            <div>
                                <div class="partner-name">${p.name}</div>
                                <div class="partner-meta">${p.ideology} • ${p.leader}</div>
                            </div>
                        </div>
                        <div class="partner-stats">
                            <div><i class="fa-solid fa-users"></i> ${p.members.toLocaleString()}</div>
                            <div><i class="fa-solid fa-chair"></i> ${p.stats.seatsInParliament}</div>
                            <div style="color:${pl.color}"><i class="fa-solid ${pl.icon}"></i> ${p.prestige.toLocaleString()}</div>
                        </div>
                    </div>`;
    }).join('')}
            </div>
        </div>

        <!-- Ortak Politikalar -->
        <div class="coalition-policies">
            <h4><i class="fa-solid fa-scroll"></i> Ortak Politikalar</h4>
            <div class="shared-policies">
                ${coalition.sharedPolicies.map(p => `
                    <div class="shared-policy-chip" style="border-color:${coalition.color}44; color:${coalition.color}">
                        <i class="fa-solid fa-check"></i> ${p}
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="coalition-actions">
            <button class="leave-coalition-btn"><i class="fa-solid fa-right-from-bracket"></i> İttifaktan Ayrıl</button>
        </div>
    `;
}

function renderNoCoalition(party) {
    // Koalisyon önerileri
    const availableParties = partiesData.filter(p => p.id !== party.id && !p.coalitionId);

    return `
        <div class="no-coalition-state">
            <div class="no-coalition-icon"><i class="fa-solid fa-handshake-slash"></i></div>
            <h3>Aktif Koalisyon Yok</h3>
            <p>Bu parti henüz bir ittifaka dahil değil. İttifak kurarak diğer partilerle güç birliği yapabilirsiniz.</p>
        </div>

        ${availableParties.length > 0 ? `
        <div class="coalition-suggestions">
            <h4><i class="fa-solid fa-lightbulb"></i> İttifak Önerileri</h4>
            <div class="suggestion-list">
                ${availableParties.map(p => `
                    <div class="suggestion-row">
                        <div class="suggestion-logo" style="color:${p.color}">
                            ${p.logo ? `<img src="${p.logo}">` : `<i class="fa-solid ${p.icon || 'fa-flag'}"></i>`}
                        </div>
                        <div class="suggestion-info">
                            <div class="suggestion-name">${p.name}</div>
                            <div class="suggestion-meta">${p.ideology} • ${p.members.toLocaleString()} üye</div>
                        </div>
                        <button class="propose-btn" style="color:${p.color}; border-color:${p.color}44">
                            <i class="fa-solid fa-paper-plane"></i> Teklif Et
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

// =============================================
// SEKME 5: TARİHÇE
// =============================================
function renderHistoryTab(party) {
    // Tüm olayları birleştir
    const allEvents = [];

    // Prestij olayları
    (party.prestigeHistory || []).forEach(e => {
        allEvents.push({ date: e.date, text: e.event, type: 'prestige', detail: `+${e.points} PP`, icon: 'fa-star', color: '#eab308' });
    });

    // Aktivite logları
    (party.stats.activityLog || []).forEach(a => {
        allEvents.push({ date: a.date, text: a.action, type: a.type, detail: '', icon: getActivityIcon(a.type), color: getActivityColor(a.type) });
    });

    // Seçim geçmişi
    (party.stats.electionHistory || []).forEach(e => {
        allEvents.push({ date: e.year, text: `Seçim: %${e.percentage} oy, ${e.seats} koltuk`, type: 'election', detail: `#${e.rank}`, icon: 'fa-box-ballot', color: '#a855f7' });
    });

    // Tarihe göre sırala (en yeni en üstte)
    allEvents.sort((a, b) => b.date.localeCompare(a.date));

    return `
    <div id="tab-history" class="tab-panel">
        <div class="history-timeline">
            ${allEvents.length > 0 ? allEvents.map(e => `
                <div class="timeline-item">
                    <div class="timeline-dot" style="background:${e.color}; box-shadow:0 0 8px ${e.color}44"></div>
                    <div class="timeline-line"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-type-badge" style="color:${e.color}; background:${e.color}15">
                                <i class="fa-solid ${e.icon}"></i> ${getTypeLabel(e.type)}
                            </span>
                            <span class="timeline-date">${e.date}</span>
                        </div>
                        <div class="timeline-text">${e.text}</div>
                        ${e.detail ? `<div class="timeline-detail" style="color:${e.color}">${e.detail}</div>` : ''}
                    </div>
                </div>
            `).join('') : '<div class="empty-section">Henüz kayıtlı geçmiş bulunmuyor.</div>'}
        </div>
    </div>`;
}

// =============================================
// YARDIMCI FONKSİYONLAR
// =============================================

function getActivityColor(type) {
    const colors = {
        parliament: '#a855f7',
        event: '#3b82f6',
        recruitment: '#10b981',
        finance: '#eab308',
        election: '#ef4444'
    };
    return colors[type] || '#94a3b8';
}

function getActivityIcon(type) {
    const icons = {
        parliament: 'fa-landmark',
        event: 'fa-calendar-star',
        recruitment: 'fa-user-plus',
        finance: 'fa-coins',
        election: 'fa-box-ballot'
    };
    return icons[type] || 'fa-circle';
}

function getTypeLabel(type) {
    const labels = {
        prestige: 'Prestij',
        parliament: 'Meclis',
        event: 'Etkinlik',
        recruitment: 'Üyelik',
        finance: 'Finans',
        election: 'Seçim'
    };
    return labels[type] || type;
}

function renderBarChart(history, color) {
    if (!history || history.length === 0) return '';
    const maxVotes = Math.max(...history.map(e => e.votes));

    return `
    <div class="mini-bar-chart">
        ${history.map(e => {
        const height = maxVotes > 0 ? (e.votes / maxVotes) * 100 : 0;
        return `
            <div class="bar-col">
                <div class="bar-value">${(e.votes / 1000).toFixed(0)}K</div>
                <div class="bar-visual">
                    <div class="bar-fill-col" style="height:${height}%; background:${color}"></div>
                </div>
                <div class="bar-label">${e.year}</div>
            </div>`;
    }).join('')}
    </div>`;
}