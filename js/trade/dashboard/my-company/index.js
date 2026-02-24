// MY COMPANY SECTION - UI COMPONENTS
// Şirketim bölümü - Mesleğe göre dinamik görünüm

import {
    getProfessionInfo,
    calculateCompanyMetrics,
    PROFESSION_TYPES,
    createNewCompany,
    deleteProduct,
    updateCompany,
    addProduct,
    updateProduct,
    hireEmployee,
    fireEmployee,
    upgradeCapacity,
    getProfessionsByCategory,
    loadPlayerCompany,
    deleteCompany,
    buyProductStock,
    setProductPrice,
    // Yeni eklenenler
    STAFF_TYPES,
    MAX_COMPANIES,
    getAllCompanies,
    createAdditionalCompany,
    canCreateCompany,
    transferToCompany,
    withdrawFromCompany,
    hireStaff,
    fireStaff,
    hasStaff,
    getTotalStaffSalary
} from '../data/company-data.js';

// === HELPER FUNCTIONS ===

// Oyuncu bakiyesini al
function getPlayerBalance() {
    try {
        const gameState = JSON.parse(localStorage.getItem('nomos_game_state') || '{}');
        return gameState.money || 0;
    } catch (e) {
        return 0;
    }
}

// Toplam staff maaşı göster
function getTotalStaffSalaryDisplay(company) {
    if (!company.staff || company.staff.length === 0) return 0;
    return company.staff.reduce((total, s) => {
        const staffType = Object.values(STAFF_TYPES).find(st => st.id === s.id);
        return total + (staffType ? staffType.salary : 0);
    }, 0);
}

// Şirket sayısını al
function getAllCompaniesCount() {
    try {
        const companies = getAllCompanies();
        return companies.length;
    } catch (e) {
        return 1;
    }
}

// Yeni şirket oluşturulabilir mi?
function canCreateNewCompany() {
    return getAllCompaniesCount() < MAX_COMPANIES;
}

// Staff kartlarını render et
function renderStaffCards(company) {
    return Object.entries(STAFF_TYPES).map(([key, staff]) => {
        const isHired = company.staff && company.staff.some(s => s.id === staff.id);
        const hiringCost = staff.salary * 3;

        return `
            <div class="staff-card ${isHired ? 'hired' : ''}" data-staff-id="${staff.id}">
                <div class="staff-icon" style="background: ${staff.color}20; color: ${staff.color}">
                    <i class="${staff.icon}"></i>
                </div>
                <div class="staff-info">
                    <h5>${staff.name}</h5>
                    <p>${staff.description}</p>
                    <div class="staff-unlocks">
                        ${staff.unlocks.map(u => `<span class="unlock-tag">${u.replace(/_/g, ' ')}</span>`).join('')}
                    </div>
                </div>
                <div class="staff-action">
                    ${isHired ? `
                        <div class="hired-badge"><i class="fa-solid fa-check"></i> İşe Alındı</div>
                        <div class="staff-salary">${staff.salary} ₳/ay</div>
                        <button class="btn-fire-staff" data-action="fire-staff" data-staff="${staff.id}">
                            <i class="fa-solid fa-user-minus"></i>
                        </button>
                    ` : `
                        <div class="hire-cost">${hiringCost.toLocaleString()} ₳</div>
                        <button class="btn-hire-staff" data-action="hire-staff" data-staff="${staff.id}">
                            <i class="fa-solid fa-user-plus"></i> İşe Al
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

// Şirket mini listesini render et
function renderCompanyMiniList(currentCompany) {
    try {
        const companies = getAllCompanies();
        return companies.map(company => {
            const isActive = company.id === currentCompany.id;
            const profession = getProfessionInfo(company.profession);

            return `
                <div class="company-mini-item ${isActive ? 'active' : ''}" data-company-id="${company.id}">
                    <div class="company-mini-icon" style="background: ${profession.color}20; color: ${profession.color}">
                        <i class="${profession.icon}"></i>
                    </div>
                    <div class="company-mini-info">
                        <span class="company-mini-name">${company.name}</span>
                        <span class="company-mini-sector">${profession.name}</span>
                    </div>
                    <div class="company-mini-cash">
                        ${company.cash.toLocaleString()} ₳
                    </div>
                    ${isActive ? '<div class="active-badge">Aktif</div>' : ''}
                </div>
            `;
        }).join('');
    } catch (e) {
        return '<div class="no-companies">Şirket bulunamadı</div>';
    }
}

// === MINI P/L CHART GENERATOR ===
function generateMiniPLChart(company) {
    // Simüle edilmiş 7 günlük veri (gerçek uygulamada company.financialHistory kullanılır)
    const baseCash = company.cash || 5000;
    const profitData = [
        Math.floor(baseCash * 0.04),
        Math.floor(baseCash * 0.06),
        Math.floor(baseCash * 0.03),
        Math.floor(baseCash * 0.07),
        Math.floor(baseCash * 0.05),
        Math.floor(baseCash * 0.08),
        Math.floor(baseCash * 0.04)
    ];
    const expenseData = [
        Math.floor(baseCash * 0.02),
        Math.floor(baseCash * 0.03),
        Math.floor(baseCash * 0.02),
        Math.floor(baseCash * 0.04),
        Math.floor(baseCash * 0.02),
        Math.floor(baseCash * 0.03),
        Math.floor(baseCash * 0.02)
    ];

    const maxValue = Math.max(...profitData, ...expenseData);
    const chartHeight = 80;
    const barWidth = 12;
    const gap = 8;
    const startX = 10;

    let svg = `<svg width="100%" height="${chartHeight + 10}" viewBox="0 0 180 ${chartHeight + 10}">`;

    // Grid lines
    svg += `<line x1="0" y1="${chartHeight * 0.25}" x2="180" y2="${chartHeight * 0.25}" stroke="rgba(255,255,255,0.05)" />`;
    svg += `<line x1="0" y1="${chartHeight * 0.5}" x2="180" y2="${chartHeight * 0.5}" stroke="rgba(255,255,255,0.05)" />`;
    svg += `<line x1="0" y1="${chartHeight * 0.75}" x2="180" y2="${chartHeight * 0.75}" stroke="rgba(255,255,255,0.05)" />`;

    // Draw bars
    for (let i = 0; i < 7; i++) {
        const x = startX + i * (barWidth * 2 + gap);
        const profitHeight = (profitData[i] / maxValue) * (chartHeight - 10);
        const expenseHeight = (expenseData[i] / maxValue) * (chartHeight - 10);

        // Profit bar (green)
        svg += `<rect x="${x}" y="${chartHeight - profitHeight}" width="${barWidth}" height="${profitHeight}" 
                rx="2" fill="url(#profitGrad)" opacity="0.9"/>`;

        // Expense bar (red)
        svg += `<rect x="${x + barWidth + 2}" y="${chartHeight - expenseHeight}" width="${barWidth}" height="${expenseHeight}" 
                rx="2" fill="url(#expenseGrad)" opacity="0.9"/>`;
    }

    // Gradients
    svg += `
        <defs>
            <linearGradient id="profitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#22c55e"/>
                <stop offset="100%" style="stop-color:#16a34a"/>
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ef4444"/>
                <stop offset="100%" style="stop-color:#dc2626"/>
            </linearGradient>
        </defs>
    `;

    svg += `</svg>`;
    return svg;
}

// === MAIN RENDER ===
export function renderMyCompanySection(company, isWidget = false) {
    if (!company) {
        return renderEmptyCompanyState();
    }

    const profession = getProfessionInfo(company.profession);
    const metrics = calculateCompanyMetrics(company);

    if (isWidget) {
        return renderCompanyWidget(company, profession, metrics);
    }

    return renderFullCompanyView(company, profession, metrics);
}

// === EMPTY STATE ===
function renderEmptyCompanyState() {
    return `
        <div class="company-empty-state">
            <div class="empty-icon">
                <i class="fa-solid fa-building-circle-xmark"></i>
            </div>
            <h3>Şirket Bulunamadı</h3>
            <p>Henüz bir şirket kurmadınız. Ticaret yapmak için önce bir şirket oluşturun.</p>
            <button class="btn-primary btn-create-company" data-action="create-company">
                <i class="fa-solid fa-plus"></i>
                Şirket Kur
            </button>
        </div>
    `;
}

// === WIDGET VIEW (Overview için kompakt görünüm) ===
function renderCompanyWidget(company, profession, metrics) {
    const topProducts = company.products.slice(0, 3);

    return `
        <div class="company-widget-v2" data-profession="${profession.id}">
            <!-- Header Section -->
            <div class="comp-v2-header">
                <div class="comp-v2-identity">
                    <div class="comp-v2-icon" style="background: ${profession.color}20; color: ${profession.color}">
                        <i class="${profession.icon}"></i>
                    </div>
                    <div class="comp-v2-names">
                        <h4>${company.name}</h4>
                        <span class="comp-v2-profession" style="color: ${profession.color}">${profession.name}</span>
                    </div>
                </div>
            </div>

            <!-- Stats Grid Section -->
            <div class="comp-v2-stats-grid">
                <div class="comp-v2-stat-card">
                    <div class="stat-content">
                        <span class="val text-gold">${company.totalValue.toLocaleString()} ₳</span>
                        <span class="lbl">ŞİRKET DEĞERİ</span>
                    </div>
                    <div class="stat-trend positive"><i class="fa-solid fa-arrow-up"></i></div>
                </div>
                <div class="comp-v2-stat-card">
                    <div class="stat-content">
                        <span class="val text-green">+${company.dailyIncome.toLocaleString()} ₳</span>
                        <span class="lbl">GÜNLÜK GELİR</span>
                    </div>
                </div>
                <div class="comp-v2-stat-card">
                    <div class="stat-content">
                        <span class="val text-blue">${company.products.reduce((sum, p) => sum + p.stock, 0)}</span>
                        <span class="lbl">TOPLAM STOK</span>
                    </div>
                </div>
            </div>

            <!-- Products Progress Section -->
            <div class="comp-v2-products">
                <div class="products-header">
                    <span>Öne Çıkan Ürünler</span>
                    <span class="count">${company.products.length} ürün</span>
                </div>
                <div class="products-list">
                    ${topProducts.map(prod => `
                        <div class="prod-item-v2">
                            <div class="prod-top">
                                <span class="name">${prod.name}</span>
                                <span class="stock">${prod.stock} adet</span>
                            </div>
                            <div class="prod-bar-full">
                                <div class="prod-bar-fill" style="width: ${prod.demand}%; background: ${profession.color}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Footer Section -->
            <div class="comp-v2-footer">
                <div class="foot-item"><i class="fa-solid fa-clock"></i> 0 Bekleyen Sipariş</div>
                <div class="foot-item"><i class="fa-solid fa-star text-gold"></i> 50/100 İtibar</div>
                <div class="lvl-badge">LVL ${company.level}</div>
            </div>
        </div>
    `;
}

// === FULL COMPANY VIEW ===
function renderFullCompanyView(company, profession, metrics) {
    const allCompanies = getAllCompanies();
    const hasMultipleCompanies = allCompanies.length > 1;

    return `
        <div class="company-full-view" data-profession="${profession.id}">
            <!-- Company Header -->
            ${renderCompanyHeader(company, profession)}

            <!-- Scrollable Content -->
            <div class="company-full-view-scroll">
                
                <!-- Management Dashboard (Top Hub) -->
                <div class="company-management-hub">
                    <div class="management-grid">
                        <!-- Stat 1: Financials -->
                        ${renderFinancialStats(company)}
                        
                        <!-- Stat 2: Operational -->
                        ${renderOperationalStats(company, metrics)}
                        
                        <!-- Stat 3: Staff & Network -->
                        <div class="stats-card network-staff">
                            <div class="card-header">
                                <h3><i class="fa-solid fa-network-wired"></i> Yönetim & Staff</h3>
                            </div>
                            <div class="card-content">
                                <div class="hub-mini-section">
                                    <div class="section-label">Çalışanlar</div>
                                    <div class="staff-summary-mini">
                                        <div class="staff-count-box">
                                            <span class="count">${company.employees}/${company.maxEmployees}</span>
                                            <span class="lbl">Aktif Personel</span>
                                        </div>
                                        <button class="btn-sm-ghost" data-action="manage-employees">
                                            <i class="fa-solid fa-users-gear"></i> Yönet
                                        </button>
                                    </div>
                                </div>
                                <div class="hub-mini-section">
                                    <div class="section-label">Şirket Ağınız (${allCompanies.length}/${MAX_COMPANIES})</div>
                                    <div class="company-grid-mini">
                                        ${allCompanies.map(c => `
                                            <div class="mini-comp-dot ${c.id === company.id ? 'active' : ''}" 
                                                 title="${c.name}" data-company-id="${c.id}">
                                                <i class="${getProfessionInfo(c.profession).icon}"></i>
                                            </div>
                                        `).join('')}
                                        ${allCompanies.length < MAX_COMPANIES ? `
                                            <div class="mini-comp-dot add" data-action="create-company">
                                                <i class="fa-solid fa-plus"></i>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Stat 4: Prestige & Rank -->
                        ${renderPrestigeCard(company)}
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="company-compact-grid">
                    <!-- Left Column: Products -->
                    <div class="company-left-column">
                        <div class="financial-summary-bar">
                            <div class="summary-card">
                                <div class="summary-icon text-gold"><i class="fa-solid fa-coins"></i></div>
                                <div class="summary-content">
                                    <span class="summary-value">${company.totalValue.toLocaleString()} ₳</span>
                                    <span class="summary-label">Şirket Değeri</span>
                                </div>
                            </div>
                            <div class="summary-card">
                                <div class="summary-icon text-green"><i class="fa-solid fa-arrow-trend-up"></i></div>
                                <div class="summary-content">
                                    <span class="summary-value">+${company.dailyIncome.toLocaleString()} ₳</span>
                                    <span class="summary-label">Günlük Gelir</span>
                                </div>
                            </div>
                            <div class="summary-card">
                                <div class="summary-icon text-blue"><i class="fa-solid fa-warehouse"></i></div>
                                <div class="summary-content">
                                    <span class="summary-value">${metrics.totalStock}</span>
                                    <span class="summary-label">Toplam Stok</span>
                                </div>
                            </div>
                            <div class="summary-card">
                                <div class="summary-icon text-yellow"><i class="fa-solid fa-star"></i></div>
                                <div class="summary-content">
                                    <span class="summary-value">${company.reputation}/100</span>
                                    <span class="summary-label">İtibar</span>
                                </div>
                            </div>
                        </div>

                        ${renderProductsSection(company, profession)}
                    </div>

                    <!-- Right Column: Orders + Activity -->
                    <div class="company-right-column">
                        ${renderOrdersSectionCompact(company)}
                        ${renderActivityFeedCompact(company)}
                    </div>
                </div>
            </div>
        </div>
    `;
}




// === COMPANY HEADER ===
function renderCompanyHeader(company, profession) {
    return `
        <header class="company-header" style="--profession-color: ${profession.color}">
            <div class="header-main">
                <div class="company-logo large" style="background: linear-gradient(135deg, ${profession.color}40, ${profession.color}20);">
                    <i class="${profession.icon}" style="color: ${profession.color}"></i>
                </div>
                <div class="company-details">
                    <div class="company-name-wrapper" data-action="toggle-company-switcher">
                        <h1 class="company-name">${company.name} <i class="fa-solid fa-chevron-down"></i></h1>
                        <div class="company-switcher-dropdown" id="company-switcher">
                            ${getAllCompanies().map(c => `
                                <div class="switcher-item ${c.id === company.id ? 'active' : ''}" data-company-id="${c.id}">
                                    <div class="item-icon"><i class="${getProfessionInfo(c.profession).icon}"></i></div>
                                    <div class="item-info">
                                        <span class="name">${c.name}</span>
                                        <span class="desc">${getProfessionInfo(c.profession).name} • Seviye ${c.level}</span>
                                    </div>
                                    ${c.id === company.id ? '<i class="fa-solid fa-check"></i>' : ''}
                                </div>
                            `).join('')}
                            <div class="switcher-divider"></div>
                            <div class="switcher-item add-new" data-action="create-company">
                                <div class="item-icon"><i class="fa-solid fa-plus"></i></div>
                                <div class="item-info">
                                    <span class="name">Yeni Şirket Kur</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="company-meta">
                        <span class="company-type"><i class="${profession.icon}"></i> ${profession.name}</span>
                        <span class="company-level">Seviye ${company.level}</span>
                        <span class="company-since">Kuruluş: ${new Date(company.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div class="experience-bar">
                        <div class="exp-fill" style="width: ${(company.experience % 100)}%"></div>
                        <span class="exp-text">${company.experience % 100}/100 XP</span>
                    </div>
                </div>
            </div>
            <div class="header-actions">
                <button class="btn-action primary" data-action="company-management">
                    <i class="fa-solid fa-briefcase"></i>
                    Yönetim
                </button>
                <button class="btn-action" data-action="edit-company">
                    <i class="fa-solid fa-pen"></i>
                    Düzenle
                </button>
                <button class="btn-action info" data-action="manage-employees">
                    <i class="fa-solid fa-users"></i>
                    Çalışanlar
                </button>
                <button class="btn-action secondary" data-action="company-settings">
                    <i class="fa-solid fa-gear"></i>
                    Ayarlar
                </button>
                <button class="btn-action success" data-action="new-product">
                    <i class="fa-solid fa-plus"></i>
                    Yeni Ürün
                </button>
            </div>
        </header>
        `;
}

// === FINANCIAL STATS ===
function renderFinancialStats(company) {
    const weeklyChange = company.weeklyGrowth > 0 ? `+ ${company.weeklyGrowth}% ` : `${company.weeklyGrowth}% `;
    const changeClass = company.weeklyGrowth > 0 ? 'positive' : 'negative';

    return `
        <div class="stats-card financial">
            <div class="card-header">
                <h3><i class="fa-solid fa-chart-pie"></i> Finansal Durum</h3>
            </div>
            <div class="card-content">
                <div class="big-stat">
                    <div class="stat-value text-gold">${company.totalValue.toLocaleString()} ₳</div>
                    <div class="stat-label">Toplam Şirket Değeri</div>
                    <div class="stat-change ${changeClass}">
                        <i class="fa-solid ${company.weeklyGrowth > 0 ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                        ${weeklyChange} bu hafta
                    </div>
                </div>
                <div class="stat-grid">
                    <div class="stat-box">
                        <div class="value text-green">+${company.dailyIncome.toLocaleString()}</div>
                        <div class="label">Günlük Gelir</div>
                    </div>
                    <div class="stat-box">
                        <div class="value text-blue">${company.cash.toLocaleString()}</div>
                        <div class="label">Nakit</div>
                    </div>
                    <div class="stat-box">
                        <div class="value ${company.debt > 0 ? 'text-red' : 'text-green'}">${company.debt > 0 ? company.debt.toLocaleString() : 'Yok'}</div>
                        <div class="label">Borç</div>
                    </div>
                </div>
            </div>
        </div>
        `;
}

// === OPERATIONAL STATS ===
function renderOperationalStats(company, metrics) {
    return `
        <div class="stats-card operational">
            <div class="card-header">
                <h3><i class="fa-solid fa-gears"></i> Operasyonel</h3>
            </div>
            <div class="card-content">
                <div class="stat-row">
                    <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
                    <div class="stat-info">
                        <div class="stat-label">Çalışanlar</div>
                        <div class="stat-value">${company.employees} / ${company.maxEmployees}</div>
                    </div>
                    <div class="progress-mini">
                        <div class="progress-fill" style="width: ${metrics.employeeEfficiency}%"></div>
                    </div>
                </div>
                <div class="stat-row">
                    <div class="stat-icon"><i class="fa-solid fa-cubes"></i></div>
                    <div class="stat-info">
                        <div class="stat-label">Toplam Ürün</div>
                        <div class="stat-value">${metrics.productCount}</div>
                    </div>
                </div>
                <div class="stat-row">
                    <div class="stat-icon"><i class="fa-solid fa-warehouse"></i></div>
                    <div class="stat-info">
                        <div class="stat-label">Stok Hacmi</div>
                        <div class="stat-value">${metrics.totalStock} adet</div>
                    </div>
                </div>
                <div class="stat-row">
                    <div class="stat-icon"><i class="fa-solid fa-medal"></i></div>
                    <div class="stat-info">
                        <div class="stat-label">Ortalama Kalite</div>
                        <div class="stat-value">${metrics.avgQuality}%</div>
                    </div>
                    <div class="progress-mini quality">
                        <div class="progress-fill" style="width: ${metrics.avgQuality}%"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
}

// === PRESTIGE & RANKING CARD ===
function renderPrestigeCard(company) {
    const prestigeMax = 1000;
    const prestigePercent = (company.prestige || 0) / prestigeMax * 100;

    const prestigeLevel = company.prestige >= 800 ? 'Küresel Güç' :
        company.prestige >= 500 ? 'Bölgesel Lider' :
            company.prestige >= 200 ? 'Yükselen Yıldız' : 'Yerel Oyuncu';

    return `
        <div class="stats-card prestige">
            <div class="card-header">
                <h3><i class="fa-solid fa-crown text-gold"></i> Prestij & Konum</h3>
            </div>
            <div class="card-content">
                <div class="prestige-display">
                    <div class="prestige-val-box">
                        <span class="p-value">${company.prestige || 0}</span>
                        <span class="p-max">/ ${prestigeMax}</span>
                    </div>
                    <div class="prestige-bar-container">
                        <div class="prestige-bar-fill" style="width: ${prestigePercent}%"></div>
                    </div>
                    <div class="prestige-label">${prestigeLevel}</div>
                </div>

                <div class="ranking-grid">
                    <div class="rank-item">
                        <div class="rank-icon"><i class="fa-solid fa-earth-americas"></i></div>
                        <div class="rank-info">
                            <span class="rank-label">DÜNYA SIRALAMASI</span>
                            <span class="rank-value">#${(company.worldRank || 15420).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-icon national"><i class="fa-solid fa-flag"></i></div>
                        <div class="rank-info">
                            <span class="rank-label">ÜLKE SIRALAMASI</span>
                            <span class="rank-value">#${(company.nationalRank || 840).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-icon sector"><i class="fa-solid fa-tag"></i></div>
                        <div class="rank-info">
                            <span class="rank-label">SEKTÖR SIRALAMASI</span>
                            <span class="rank-value">#${(company.sectorRank || 120).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
}

// === PRODUCTS SECTION ===
function renderProductsSection(company, profession) {
    return `
        <div class="products-section">
            <div class="section-header">
                <h3><i class="fa-solid fa-cubes"></i> Ürünlerim</h3>
                <div class="section-actions">
                    <input type="text" placeholder="Ürün ara..." class="search-input" id="product-search">
                    <button class="btn-sm" data-action="add-product">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="products-grid" id="products-grid">
                ${company.products.map(product => renderProductCard(product, profession)).join('')}
            </div>
        </div>
        `;
}

// === PRODUCT CARD ===
function renderProductCard(product, profession) {
    const demandColor = product.demand >= 70 ? '#22c55e' : product.demand >= 40 ? '#fbbf24' : '#ef4444';
    const demandLabel = product.demand >= 70 ? 'Yüksek Talep' : product.demand >= 40 ? 'Normal Talep' : 'Düşük Talep';

    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-header">
                <div class="product-icon" style="background: ${profession.color}20; color: ${profession.color}">
                    <i class="${profession.icon}"></i>
                </div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <div class="product-meta">
                        <span class="quality-badge" title="Kalite">
                            <i class="fa-solid fa-medal"></i> ${product.quality}%
                        </span>
                    </div>
                </div>
                <div class="product-menu">
                    <button class="btn-icon" data-action="product-menu" data-product="${product.id}">
                        <i class="fa-solid fa-ellipsis-v"></i>
                    </button>
                </div>
            </div>
            <div class="product-stats">
                <div class="stat">
                    <span class="label">Stok</span>
                    <span class="value">${product.stock} adet</span>
                </div>
                <div class="stat">
                    <span class="label">Fiyat</span>
                    <span class="value text-gold">${product.price} ₳</span>
                </div>
            </div>
            <div class="product-demand">
                <div class="demand-header">
                    <span class="demand-label" style="color: ${demandColor}">${demandLabel}</span>
                    <span class="demand-value">${product.demand}%</span>
                </div>
                <div class="demand-bar-container">
                    <div class="demand-bar" style="width: ${product.demand}%; background: ${demandColor}"></div>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-product" data-action="sell-product" data-product="${product.id}">
                    <i class="fa-solid fa-tag"></i> Sat
                </button>
                <button class="btn-product secondary" data-action="ship-product" data-product="${product.id}">
                    <i class="fa-solid fa-truck"></i> Gönder
                </button>
            </div>
        </div>
        `;
}

// === ORDERS SECTION ===
function renderOrdersSection(company) {
    const orders = company.orders || [];
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const recentOrders = orders.slice(-5).reverse();

    return `
        <div class="orders-section">
            <div class="section-header">
                <h3><i class="fa-solid fa-clipboard-list"></i> Siparişler</h3>
                <span class="order-count">${pendingOrders.length} beklemede</span>
            </div>
            <div class="orders-list">
                ${recentOrders.length > 0 ? recentOrders.map(order => renderOrderItem(order)).join('') : `
                    <div class="empty-state small">
                        <i class="fa-solid fa-inbox"></i>
                        <p>Henüz sipariş yok</p>
                    </div>
                `}
            </div>
            <button class="btn-full" data-action="view-all-orders">
                Tüm Siparişleri Gör
            </button>
        </div>
        `;
}

// === ORDER ITEM ===
function renderOrderItem(order) {
    const statusColors = {
        pending: '#f59e0b',
        processing: '#3b82f6',
        shipped: '#8b5cf6',
        delivered: '#22c55e',
        cancelled: '#ef4444'
    };
    const statusLabels = {
        pending: 'Beklemede',
        processing: 'Hazırlanıyor',
        shipped: 'Gönderildi',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal'
    };

    return `
        <div class="order-item" data-order-id="${order.id}">
            <div class="order-status" style="background: ${statusColors[order.status]}20; color: ${statusColors[order.status]}">
                ${statusLabels[order.status]}
            </div>
            <div class="order-details">
                <div class="order-id">#${order.id.slice(-8)}</div>
                <div class="order-info">${order.productName || 'Ürün'} x${order.quantity || 1}</div>
            </div>
            <div class="order-value">${(order.total || 0).toLocaleString()} ₳</div>
        </div>
        `;
}

// === ACTIVITY FEED ===
function renderActivityFeed(company) {
    // Generate sample activities
    const activities = [
        { type: 'sale', message: '5x T-Shirt satıldı', time: '2 dakika önce', icon: 'fa-cart-shopping', color: '#22c55e' },
        { type: 'order', message: 'Yeni sipariş alındı', time: '15 dakika önce', icon: 'fa-bell', color: '#3b82f6' },
        { type: 'stock', message: 'Stok güncellendi', time: '1 saat önce', icon: 'fa-warehouse', color: '#f59e0b' },
        { type: 'review', message: '5 yıldızlı değerlendirme', time: '3 saat önce', icon: 'fa-star', color: '#fbbf24' }
    ];

    return `
        <div class="activity-section">
            <div class="section-header">
                <h3><i class="fa-solid fa-clock-rotate-left"></i> Son Aktiviteler</h3>
            </div>
            <div class="activity-feed">
                ${activities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon" style="background: ${activity.color}20; color: ${activity.color}">
                            <i class="fa-solid ${activity.icon}"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-message">${activity.message}</div>
                            <div class="activity-time">${activity.time}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
}

// === PROFESSION SELECTOR ===
export function renderProfessionSelector(currentProfession) {
    return `
        <div class="profession-selector">
            <h3>Meslek Seçin</h3>
            <div class="profession-grid">
                ${Object.values(PROFESSION_TYPES).map(prof => `
                    <div class="profession-option ${currentProfession === prof.id ? 'selected' : ''}" 
                         data-profession="${prof.id}">
                        <div class="profession-icon" style="background: ${prof.color}20; color: ${prof.color}">
                            <i class="${prof.icon}"></i>
                        </div>
                        <div class="profession-info">
                            <h4>${prof.name}</h4>
                            <p>${prof.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
}

// === COMPACT ORDERS SECTION ===
function renderOrdersSectionCompact(company) {
    const orders = company.orders || [];
    const statusGroups = {
        pending: orders.filter(o => o.status === 'pending'),
        processing: orders.filter(o => o.status === 'processing'),
        shipped: orders.filter(o => o.status === 'shipped'),
        delivered: orders.filter(o => o.status === 'delivered')
    };

    return `
        <div class="orders-compact-section">
            <div class="section-header-compact">
                <h3><i class="fa-solid fa-clipboard-list"></i> Siparişler</h3>
                <button class="btn-see-all" data-action="view-all-orders">
                    Tümü <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>

            <!--Sipariş Durumu Özeti-->
            <div class="order-status-grid">
                <div class="order-status-card pending">
                    <div class="status-count">${statusGroups.pending.length}</div>
                    <div class="status-label">Beklemede</div>
                    <div class="status-icon"><i class="fa-solid fa-clock"></i></div>
                </div>
                <div class="order-status-card processing">
                    <div class="status-count">${statusGroups.processing.length}</div>
                    <div class="status-label">Hazırlanıyor</div>
                    <div class="status-icon"><i class="fa-solid fa-box-open"></i></div>
                </div>
                <div class="order-status-card shipped">
                    <div class="status-count">${statusGroups.shipped.length}</div>
                    <div class="status-label">Gönderildi</div>
                    <div class="status-icon"><i class="fa-solid fa-truck"></i></div>
                </div>
                <div class="order-status-card delivered">
                    <div class="status-count">${statusGroups.delivered.length}</div>
                    <div class="status-label">Teslim</div>
                    <div class="status-icon"><i class="fa-solid fa-circle-check"></i></div>
                </div>
            </div>

            <!--Son Siparişler-->
        <div class="recent-orders">
            <h4>Son Siparişler</h4>
            <div class="orders-list-compact">
                ${orders.slice(-4).reverse().map(order => renderOrderCardCompact(order)).join('') || `
                        <div class="empty-state small">
                            <p>Henüz sipariş yok</p>
                        </div>
                    `}
            </div>
        </div>
        </div>
        `;
}

function renderOrderCardCompact(order) {
    const statusConfig = {
        pending: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: 'fa-clock' },
        processing: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', icon: 'fa-box-open' },
        shipped: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: 'fa-truck' },
        delivered: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', icon: 'fa-check' },
        cancelled: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: 'fa-xmark' }
    };
    const config = statusConfig[order.status] || statusConfig.pending;

    return `
        <div class="order-card-compact" data-order-id="${order.id}">
            <div class="order-status-badge" style="background: ${config.bg}; color: ${config.color}">
                <i class="fa-solid ${config.icon}"></i>
            </div>
            <div class="order-info">
                <div class="order-product">${order.productName || 'Ürün'} × ${order.quantity || 1}</div>
                <div class="order-id-small">#${order.id.slice(-6)}</div>
            </div>
            <div class="order-value">${(order.total || 0).toLocaleString()} ₳</div>
        </div>
        `;
}

// === COMPACT ACTIVITY FEED ===
function renderActivityFeedCompact(company) {
    const activities = [
        { type: 'sale', message: '5x T-Shirt satıldı', time: '2dk', icon: 'fa-cart-shopping', color: '#22c55e' },
        { type: 'order', message: 'Yeni sipariş alındı', time: '15dk', icon: 'fa-bell', color: '#3b82f6' },
        { type: 'stock', message: 'Stok güncellendi', time: '1s', icon: 'fa-warehouse', color: '#f59e0b' },
        { type: 'review', message: '5★ Değerlendirme', time: '3s', icon: 'fa-star', color: '#fbbf24' },
        { type: 'payment', message: 'Ödeme alındı', time: '5s', icon: 'fa-money-bill-wave', color: '#22c55e' }
    ];

    return `
        <div class="activity-compact-section">
            <div class="section-header-compact">
                <h3><i class="fa-solid fa-clock-rotate-left"></i> Aktiviteler</h3>
            </div>
            <div class="activity-list-compact">
                ${activities.map(activity => `
                    <div class="activity-row">
                        <div class="activity-dot" style="background: ${activity.color}"></div>
                        <div class="activity-text">${activity.message}</div>
                        <div class="activity-time-small">${activity.time}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// =====================================================
// === COMPANY MANAGEMENT MODALS ===
// =====================================================

// === RENDER CREATE COMPANY WIZARD ===
export function renderCreateCompanyWizard() {
    const categories = getProfessionsByCategory();

    return `
        <div class="modal-overlay" id="create-company-modal">
            <div class="modal-container wizard-modal">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-building-circle-check"></i> Yeni Şirket Kur</h2>
                    <button class="modal-close" data-action="close-modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <div class="wizard-body">
                    <!-- Step 1: Company Info -->
                    <div class="wizard-step active" data-step="1">
                        <div class="step-header">
                            <span class="step-number">1</span>
                            <div class="step-info">
                                <h3>Şirket Bilgileri</h3>
                                <p>Şirketinizin temel bilgilerini girin</p>
                            </div>
                        </div>
                        <div class="step-content">
                            <div class="form-group">
                                <label>Şirket Adı</label>
                                <input type="text" id="company-name-input" placeholder="Örn: Anadolu Tekstil A.Ş." maxlength="40">
                            </div>
                            <div class="form-group">
                                <label>Başlangıç Sermayesi</label>
                                <div class="capital-options">
                                    <button class="capital-btn active" data-capital="5000">
                                        <span class="capital-amount">5,000 ₳</span>
                                        <span class="capital-label">Küçük</span>
                                    </button>
                                    <button class="capital-btn" data-capital="10000">
                                        <span class="capital-amount">10,000 ₳</span>
                                        <span class="capital-label">Orta</span>
                                    </button>
                                    <button class="capital-btn" data-capital="25000">
                                        <span class="capital-amount">25,000 ₳</span>
                                        <span class="capital-label">Büyük</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Step 2: Select Sector -->
                    <div class="wizard-step" data-step="2">
                        <div class="step-header">
                            <span class="step-number">2</span>
                            <div class="step-info">
                                <h3>Sektör Seçimi</h3>
                                <p>Faaliyet göstereceğiniz sektörü seçin</p>
                            </div>
                        </div>
                        <div class="step-content">
                            <div class="sector-categories">
                                ${Object.entries(categories).map(([catId, cat]) => `
                                    <div class="sector-category" data-category="${catId}">
                                        <div class="category-header">
                                            <i class="fa-solid ${cat.icon}"></i>
                                            <span>${cat.name}</span>
                                            <span class="category-count">${cat.professions.length}</span>
                                        </div>
                                        <div class="category-professions">
                                            ${cat.professions.map(prof => `
                                                <div class="profession-option" data-profession="${prof.key}">
                                                    <div class="profession-icon" style="background: ${prof.color}20; color: ${prof.color}">
                                                        <i class="${prof.icon}"></i>
                                                    </div>
                                                    <div class="profession-info">
                                                        <span class="profession-name">${prof.name}</span>
                                                        <span class="profession-desc">${prof.description}</span>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Step 3: Confirm -->
                    <div class="wizard-step" data-step="3">
                        <div class="step-header">
                            <span class="step-number">3</span>
                            <div class="step-info">
                                <h3>Onay</h3>
                                <p>Şirket bilgilerinizi kontrol edin</p>
                            </div>
                        </div>
                        <div class="step-content">
                            <div class="company-preview-card">
                                <div class="preview-header">
                                    <div class="preview-icon" id="preview-icon">
                                        <i class="fa-solid fa-building"></i>
                                    </div>
                                    <div class="preview-info">
                                        <h3 id="preview-name">Şirket Adı</h3>
                                        <span id="preview-sector">Sektör</span>
                                    </div>
                                </div>
                                <div class="preview-stats">
                                    <div class="preview-stat">
                                        <span class="label">Sermaye</span>
                                        <span class="value" id="preview-capital">10,000 ₳</span>
                                    </div>
                                    <div class="preview-stat">
                                        <span class="label">Çalışan</span>
                                        <span class="value">3 Kişi</span>
                                    </div>
                                    <div class="preview-stat">
                                        <span class="label">Seviye</span>
                                        <span class="value">1</span>
                                    </div>
                                </div>
                            </div>
                            <div class="confirm-message">
                                <i class="fa-solid fa-circle-info"></i>
                                <p>Şirketiniz kurulduktan sonra sektör değişikliği yapabilirsiniz ancak bu işlem maliyetli olacaktır.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="wizard-footer">
                    <div class="wizard-progress">
                        <div class="progress-step active" data-step="1">1</div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="2">2</div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="3">3</div>
                    </div>
                    <div class="wizard-actions">
                        <button class="btn-wizard secondary" id="wizard-prev" disabled>
                            <i class="fa-solid fa-arrow-left"></i> Geri
                        </button>
                        <button class="btn-wizard primary" id="wizard-next">
                            İleri <i class="fa-solid fa-arrow-right"></i>
                        </button>
                        <button class="btn-wizard success hidden" id="wizard-finish">
                            <i class="fa-solid fa-check"></i> Şirketi Kur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// === RENDER EDIT COMPANY MODAL (ADVANCED) ===
export function renderEditCompanyModal(company, profession) {
    const categories = getProfessionsByCategory();
    const sectorChangeCost = calculateSectorChangeCost(company);

    return `
        <div class="modal-overlay" id="edit-company-modal">
            <div class="modal-container modal-large">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-building-user"></i> Şirket Yönetimi</h2>
                    <button class="modal-close" data-action="close-modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <!-- Tab Navigation -->
                <div class="modal-tabs">
                    <button class="modal-tab active" data-tab="basic">
                        <i class="fa-solid fa-info-circle"></i> Temel Bilgiler
                    </button>
                    <button class="modal-tab" data-tab="sector">
                        <i class="fa-solid fa-industry"></i> Sektör
                    </button>
                    <button class="modal-tab" data-tab="stats">
                        <i class="fa-solid fa-chart-pie"></i> İstatistikler
                    </button>
                </div>
                
                <div class="modal-body modal-body-tabs">
                    <!-- TAB 1: Temel Bilgiler -->
                    <div class="modal-tab-content active" data-tab-content="basic">
                        <div class="company-edit-header">
                            <div class="company-logo-editor" id="logo-editor">
                                <div class="logo-preview" style="background: linear-gradient(135deg, ${profession.color}40, ${profession.color}20);">
                                    <i class="${profession.icon}" style="color: ${profession.color}"></i>
                                </div>
                                <button class="logo-change-btn" data-action="change-logo">
                                    <i class="fa-solid fa-camera"></i>
                                </button>
                            </div>
                            <div class="company-info-edit">
                                <div class="form-group">
                                    <label><i class="fa-solid fa-building"></i> Şirket Adı</label>
                                    <input type="text" id="edit-company-name" value="${company.name}" maxlength="40" class="input-large">
                                </div>
                                <div class="company-badges">
                                    <span class="badge level"><i class="fa-solid fa-star"></i> Seviye ${company.level}</span>
                                    <span class="badge sector" style="background: ${profession.color}30; color: ${profession.color}">
                                        <i class="${profession.icon}"></i> ${profession.name}
                                    </span>
                                    <span class="badge date"><i class="fa-solid fa-calendar"></i> ${new Date(company.createdAt).toLocaleDateString('tr-TR')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4><i class="fa-solid fa-quote-left"></i> Şirket Sloganı</h4>
                            <input type="text" id="edit-company-slogan" value="${company.slogan || ''}" 
                                   placeholder="Örn: Kalite ve Güven" maxlength="60">
                        </div>
                        
                        <div class="form-section">
                            <h4><i class="fa-solid fa-align-left"></i> Şirket Açıklaması</h4>
                            <textarea id="edit-company-desc" placeholder="Şirketiniz hakkında detaylı bir açıklama yazın..." 
                                      rows="4" maxlength="500">${company.description || ''}</textarea>
                            <div class="char-counter"><span id="desc-count">${(company.description || '').length}</span>/500</div>
                        </div>
                    </div>
                    
                    <!-- TAB 2: Sektör (Yeni Tasarım) -->
                    <div class="modal-tab-content" data-tab-content="sector">
                        <!-- Mevcut Sektör Bilgisi -->
                        <div class="sector-info-card">
                            <div class="sector-info-icon" style="background: linear-gradient(135deg, ${profession.color}30, ${profession.color}10); border: 2px solid ${profession.color}">
                                <i class="${profession.icon}" style="color: ${profession.color}"></i>
                            </div>
                            <div class="sector-info-content">
                                <span class="sector-info-label">Mevcut Sektör</span>
                                <h3>${profession.name}</h3>
                                <p>${profession.description || 'Bu sektörde faaliyet gösteriyorsunuz.'}</p>
                            </div>
                            <div class="sector-info-stats">
                                <div class="info-stat">
                                    <span class="stat-num">${(company.products || []).length}</span>
                                    <span class="stat-txt">Ürün</span>
                                </div>
                                <div class="info-stat">
                                    <span class="stat-num">${company.level}</span>
                                    <span class="stat-txt">Seviye</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Sektör Değiştir Accordion -->
                        <div class="accordion-section" id="sector-change-accordion">
                            <div class="accordion-header" data-toggle="sector-change-content">
                                <div class="accordion-title">
                                    <i class="fa-solid fa-shuffle"></i>
                                    <span>Sektör Değiştir</span>
                                </div>
                                <div class="accordion-badge warning">
                                    <i class="fa-solid fa-coins"></i> ${sectorChangeCost.toLocaleString()} ₳
                                </div>
                                <i class="fa-solid fa-chevron-down accordion-arrow"></i>
                            </div>
                            <div class="accordion-content" id="sector-change-content" style="display: none;">
                                <div class="accordion-warning">
                                    <i class="fa-solid fa-triangle-exclamation"></i>
                                    <span>Sektör değiştirmek şirketinizin yapısını değiştirir. Mevcut ürünleriniz etkilenebilir.</span>
                                </div>
                                
                                <div class="sector-cards-grid">
                                    ${Object.entries(categories).map(([catId, cat]) => `
                                        <div class="sector-category-block">
                                            <div class="category-title">
                                                <i class="fa-solid ${cat.icon}"></i> ${cat.name}
                                            </div>
                                            <div class="sector-cards-row">
                                                ${cat.professions.map(prof => `
                                                    <div class="sector-card ${prof.key === company.profession ? 'current' : ''}" 
                                                         data-sector="${prof.key}">
                                                        <div class="sector-card-icon" style="background: ${prof.color}15; border-color: ${prof.color}40">
                                                            <i class="${prof.icon}" style="color: ${prof.color}"></i>
                                                        </div>
                                                        <div class="sector-card-name">${prof.name}</div>
                                                        ${prof.key === company.profession ? '<div class="current-indicator"><i class="fa-solid fa-check"></i></div>' : ''}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div class="sector-selection-footer" id="sector-selection-footer" style="display: none;">
                                    <div class="selection-info">
                                        <div class="selection-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                        <div class="selected-sector-card" id="selected-sector-display"></div>
                                    </div>
                                    <button class="btn-change-sector" data-action="confirm-sector-change">
                                        <i class="fa-solid fa-shuffle"></i> Sektörü Değiştir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- TAB 3: İstatistikler -->
                    <div class="modal-tab-content" data-tab-content="stats">
                        <div class="stats-overview">
                            <div class="stat-card-large">
                                <div class="stat-icon green"><i class="fa-solid fa-coins"></i></div>
                                <div class="stat-content">
                                    <span class="stat-value-large">${(company.cash || 0).toLocaleString()}</span>
                                    <span class="stat-label-large">Nakit (₳)</span>
                                </div>
                            </div>
                            <div class="stat-card-large">
                                <div class="stat-icon blue"><i class="fa-solid fa-building"></i></div>
                                <div class="stat-content">
                                    <span class="stat-value-large">${(company.totalValue || 0).toLocaleString()}</span>
                                    <span class="stat-label-large">Toplam Değer (₳)</span>
                                </div>
                            </div>
                            <div class="stat-card-large">
                                <div class="stat-icon purple"><i class="fa-solid fa-users"></i></div>
                                <div class="stat-content">
                                    <span class="stat-value-large">${company.employees}/${company.maxEmployees}</span>
                                    <span class="stat-label-large">Çalışanlar</span>
                                </div>
                            </div>
                            <div class="stat-card-large">
                                <div class="stat-icon orange"><i class="fa-solid fa-box"></i></div>
                                <div class="stat-content">
                                    <span class="stat-value-large">${(company.products || []).length}</span>
                                    <span class="stat-label-large">Ürün Çeşidi</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="stats-details">
                            <div class="stats-section">
                                <h4><i class="fa-solid fa-chart-line"></i> Performans</h4>
                                <div class="stats-rows">
                                    <div class="stats-row">
                                        <span class="stats-label">Günlük Gelir</span>
                                        <span class="stats-value text-green">+${(company.dailyIncome || 0).toLocaleString()} ₳</span>
                                    </div>
                                    <div class="stats-row">
                                        <span class="stats-label">Toplam Sipariş</span>
                                        <span class="stats-value">${(company.orders || []).length}</span>
                                    </div>
                                    <div class="stats-row">
                                        <span class="stats-label">Müşteri Memnuniyeti</span>
                                        <span class="stats-value">${company.customerSatisfaction || 85}%</span>
                                    </div>
                                    <div class="stats-row">
                                        <span class="stats-label">İtibar Puanı</span>
                                        <span class="stats-value">${company.reputation || 100}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="stats-section">
                                <h4><i class="fa-solid fa-trophy"></i> Başarılar</h4>
                                <div class="achievements-mini">
                                    <div class="achievement-badge unlocked">
                                        <i class="fa-solid fa-rocket"></i>
                                        <span>İlk Adım</span>
                                    </div>
                                    <div class="achievement-badge ${company.level >= 5 ? 'unlocked' : 'locked'}">
                                        <i class="fa-solid fa-fire"></i>
                                        <span>Seviye 5</span>
                                    </div>
                                    <div class="achievement-badge ${(company.products || []).length >= 10 ? 'unlocked' : 'locked'}">
                                        <i class="fa-solid fa-boxes"></i>
                                        <span>10 Ürün</span>
                                    </div>
                                    <div class="achievement-badge locked">
                                        <i class="fa-solid fa-crown"></i>
                                        <span>100K Gelir</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Mali İstatistikler ve Kar/Zarar Grafiği -->
                        <div class="financial-stats-section">
                            <h4><i class="fa-solid fa-scale-balanced"></i> Mali İstatistikler</h4>
                            <div class="financial-layout">
                                <!-- Sol: Kar Zarar Kartları -->
                                <div class="financial-cards">
                                    <div class="pl-card profit">
                                        <div class="pl-icon"><i class="fa-solid fa-arrow-trend-up"></i></div>
                                        <div class="pl-info">
                                            <span class="pl-label">Toplam Gelir</span>
                                            <span class="pl-value">+${(company.totalRevenue || Math.floor(company.cash * 0.3) || 3500).toLocaleString()} ₳</span>
                                        </div>
                                    </div>
                                    <div class="pl-card expense">
                                        <div class="pl-icon"><i class="fa-solid fa-arrow-trend-down"></i></div>
                                        <div class="pl-info">
                                            <span class="pl-label">Toplam Gider</span>
                                            <span class="pl-value">-${(company.totalExpense || Math.floor(company.cash * 0.15) || 1200).toLocaleString()} ₳</span>
                                        </div>
                                    </div>
                                    <div class="pl-card net ${(company.netProfit || (company.cash * 0.15)) >= 0 ? 'positive' : 'negative'}">
                                        <div class="pl-icon"><i class="fa-solid fa-wallet"></i></div>
                                        <div class="pl-info">
                                            <span class="pl-label">Net Kar</span>
                                            <span class="pl-value">${(company.netProfit || Math.floor(company.cash * 0.15) || 2300) >= 0 ? '+' : ''}${(company.netProfit || Math.floor(company.cash * 0.15) || 2300).toLocaleString()} ₳</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Sağ: Basit Chart -->
                                <div class="pl-chart-container">
                                    <div class="chart-header">
                                        <span class="chart-title">Son 7 Gün</span>
                                        <div class="chart-legend">
                                            <span class="legend-item profit"><span class="legend-dot"></span> Gelir</span>
                                            <span class="legend-item expense"><span class="legend-dot"></span> Gider</span>
                                        </div>
                                    </div>
                                    <div class="chart-area" id="pl-chart">
                                        ${generateMiniPLChart(company)}
                                    </div>
                                    <div class="chart-labels">
                                        <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-modal secondary" data-action="close-modal">İptal</button>
                    <button class="btn-modal primary" data-action="save-company-edit">
                        <i class="fa-solid fa-save"></i> Değişiklikleri Kaydet
                    </button>
                </div>
            </div>
        </div>
    `;
}

// === RENDER COMPANY MANAGEMENT MODAL ===
export function renderCompanyManagementModal(company, profession) {
    return `
        <div class="modal-overlay" id="company-management-modal">
            <div class="modal-container modal-large">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-briefcase"></i> Şirket Yönetimi</h2>
                    <button class="modal-close" data-action="close-modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <!-- Tab Navigation -->
                <div class="modal-tabs">
                    <button class="modal-tab active" data-tab="staff">
                        <i class="fa-solid fa-user-tie"></i> Yönetim Ekibi
                    </button>
                    <button class="modal-tab" data-tab="finance">
                        <i class="fa-solid fa-wallet"></i> Finans
                    </button>
                    <button class="modal-tab" data-tab="companies">
                        <i class="fa-solid fa-building-circle-check"></i> Şirketlerim
                    </button>
                </div>
                
                <div class="modal-body modal-body-tabs">
                    <!-- TAB 1: Yönetim Ekibi (Staff) -->
                    <div class="modal-tab-content active" data-tab-content="staff">
                        <div class="staff-intro">
                            <div class="intro-icon"><i class="fa-solid fa-user-tie"></i></div>
                            <div class="intro-text">
                                <h4>Yönetim Ekibi</h4>
                                <p>Profesyonel yöneticiler işe alarak şirketinizi güçlendirin. Her yönetici yeni özellikler ve bonuslar açar.</p>
                            </div>
                        </div>
                        
                        <div class="staff-grid">
                            ${renderStaffCards(company)}
                        </div>
                        
                        <div class="staff-summary">
                            <div class="summary-item">
                                <span class="summary-label">Toplam Aylık Maaş</span>
                                <span class="summary-value">${getTotalStaffSalaryDisplay(company)} ₳/ay</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">İşe Alınan</span>
                                <span class="summary-value">${(company.staff || []).length}/5 yönetici</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- TAB 2: Finans (Para Transferi) -->
                    <div class="modal-tab-content" data-tab-content="finance">
                        <div class="finance-balances">
                            <div class="balance-card player">
                                <div class="balance-icon"><i class="fa-solid fa-user"></i></div>
                                <div class="balance-info">
                                    <span class="balance-label">Kişisel Bakiye</span>
                                    <span class="balance-value" id="player-balance">${getPlayerBalance().toLocaleString()} ₳</span>
                                </div>
                            </div>
                            <div class="balance-arrow">
                                <i class="fa-solid fa-arrow-right-arrow-left"></i>
                            </div>
                            <div class="balance-card company">
                                <div class="balance-icon"><i class="fa-solid fa-building"></i></div>
                                <div class="balance-info">
                                    <span class="balance-label">Şirket Kasası</span>
                                    <span class="balance-value" id="company-balance">${(company.cash || 0).toLocaleString()} ₳</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="transfer-section">
                            <h4><i class="fa-solid fa-money-bill-transfer"></i> Para Transferi</h4>
                            <div class="transfer-form">
                                <div class="transfer-input-group">
                                    <label>Transfer Miktarı</label>
                                    <div class="amount-input">
                                        <input type="number" id="transfer-amount" placeholder="0" min="1">
                                        <span class="currency">₳</span>
                                    </div>
                                    <div class="quick-amounts">
                                        <button class="quick-btn" data-amount="100">100</button>
                                        <button class="quick-btn" data-amount="500">500</button>
                                        <button class="quick-btn" data-amount="1000">1K</button>
                                        <button class="quick-btn" data-amount="5000">5K</button>
                                    </div>
                                </div>
                                <div class="transfer-buttons">
                                    <button class="transfer-btn to-company" data-action="transfer-to-company">
                                        <i class="fa-solid fa-arrow-right"></i> Şirkete Aktar
                                    </button>
                                    <button class="transfer-btn from-company" data-action="withdraw-from-company">
                                        <i class="fa-solid fa-arrow-left"></i> Şirketten Çek
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- TAB 3: Şirketlerim -->
                    <div class="modal-tab-content" data-tab-content="companies">
                        <div class="companies-header">
                            <div class="companies-count">
                                <span class="count-big">${getAllCompaniesCount()}</span>
                                <span class="count-label">/ 7 Şirket</span>
                            </div>
                            <p>Maksimum 7 şirket kurabilirsiniz. Her şirket bağımsız olarak yönetilir.</p>
                        </div>
                        
                        <div class="company-full-list" id="company-full-list">
                            ${renderCompanyFullList(company)}
                        </div>
                        
                        ${canCreateNewCompany() ? `
                            <button class="btn-new-company-large" data-action="create-new-company">
                                <i class="fa-solid fa-plus"></i>
                                <span>Yeni Şirket Kur</span>
                            </button>
                        ` : `
                            <div class="max-companies-notice">
                                <i class="fa-solid fa-info-circle"></i>
                                Maksimum şirket sayısına ulaştınız (7/7)
                            </div>
                        `}
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-modal secondary" data-action="close-modal">Kapat</button>
                </div>
            </div>
        </div>
    `;
}

// Helper: Şirket tam listesi
function renderCompanyFullList(currentCompany) {
    try {
        const companies = getAllCompanies();
        return companies.map(company => {
            const isActive = company.id === currentCompany.id;
            const profession = getProfessionInfo(company.profession);

            return `
                <div class="company-full-item ${isActive ? 'active' : ''}" data-company-id="${company.id}">
                    <div class="company-item-icon" style="background: linear-gradient(135deg, ${profession.color}40, ${profession.color}20);">
                        <i class="${profession.icon}" style="color: ${profession.color}"></i>
                    </div>
                    <div class="company-item-info">
                        <h4>${company.name}</h4>
                        <div class="company-item-meta">
                            <span><i class="${profession.icon}"></i> ${profession.name}</span>
                            <span><i class="fa-solid fa-layer-group"></i> Seviye ${company.level}</span>
                        </div>
                    </div>
                    <div class="company-item-stats">
                        <div class="item-stat">
                            <span class="stat-val">${company.cash.toLocaleString()} ₳</span>
                            <span class="stat-lbl">Nakit</span>
                        </div>
                        <div class="item-stat">
                            <span class="stat-val">${company.employees}</span>
                            <span class="stat-lbl">Çalışan</span>
                        </div>
                    </div>
                    <div class="company-item-actions">
                        ${isActive ? `
                            <span class="active-company-badge"><i class="fa-solid fa-check"></i> Aktif</span>
                        ` : `
                            <button class="btn-switch-company" data-action="switch-company" data-company="${company.id}">
                                <i class="fa-solid fa-arrow-right-to-bracket"></i> Geç
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        return '<div class="no-companies">Şirket bulunamadı</div>';
    }
}

// Calculate sector change cost
function calculateSectorChangeCost(company) {
    const baseCost = 3000;
    const employeeCost = company.employees * 200;
    const levelCost = company.level * 500;
    return baseCost + employeeCost + levelCost;
}

// Setup edit modal handlers
export function setupEditModalHandlers() {
    const modal = document.getElementById('edit-company-modal');
    if (!modal) return;

    // Tab switching
    modal.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            // Update tab buttons
            modal.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update content
            modal.querySelectorAll('.modal-tab-content').forEach(content => {
                content.classList.toggle('active', content.dataset.tabContent === tabId);
            });
        });
    });

    // Character counter for description
    const descTextarea = modal.querySelector('#edit-company-desc');
    const descCounter = modal.querySelector('#desc-count');
    if (descTextarea && descCounter) {
        descTextarea.addEventListener('input', () => {
            descCounter.textContent = descTextarea.value.length;
        });
    }

    // Color picker
    modal.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Sector category accordion (old style)
    modal.querySelectorAll('.category-header-card').forEach(header => {
        header.addEventListener('click', () => {
            const card = header.parentElement;
            card.classList.toggle('expanded');
        });
    });

    // NEW: Accordion toggle for sector change
    modal.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            const contentId = header.dataset.toggle;
            const content = document.getElementById(contentId);

            if (content) {
                const isOpen = content.style.display !== 'none';
                content.style.display = isOpen ? 'none' : 'block';
                section.classList.toggle('open', !isOpen);
            }
        });
    });

    // Sector selection (works with both old .sector-option and new .sector-card)
    let selectedNewSector = null;
    const sectorSelectors = modal.querySelectorAll('.sector-option:not(.current), .sector-card:not(.current)');

    sectorSelectors.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selection from all
            modal.querySelectorAll('.sector-option, .sector-card').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedNewSector = option.dataset.sector;

            // Show footer section (new design)
            const footerSection = modal.querySelector('#sector-selection-footer');
            const displaySection = modal.querySelector('#selected-sector-display');

            // Also check for old design elements
            const actionSection = modal.querySelector('#sector-change-action');
            const previewSection = modal.querySelector('#new-sector-preview');

            // Get sector info
            const categories = getProfessionsByCategory();
            let sectorInfo = null;
            Object.values(categories).forEach(cat => {
                const found = cat.professions.find(p => p.key === selectedNewSector);
                if (found) sectorInfo = found;
            });

            if (sectorInfo) {
                // New design footer
                if (footerSection && displaySection) {
                    footerSection.style.display = 'flex';
                    displaySection.innerHTML = `
                        <div class="sector-card-icon" style="background: ${sectorInfo.color}15; border-color: ${sectorInfo.color}">
                            <i class="${sectorInfo.icon}" style="color: ${sectorInfo.color}"></i>
                        </div>
                        <div>
                            <div class="sector-card-name" style="font-size: 0.8rem; font-weight: 700;">${sectorInfo.name}</div>
                            <div style="font-size: 0.6rem; color: var(--text-muted);">Yeni Sektör</div>
                        </div>
                    `;
                }

                // Old design compatibility
                if (actionSection && previewSection) {
                    actionSection.style.display = 'flex';
                    previewSection.innerHTML = `
                        <div class="sector-option-icon" style="background: ${sectorInfo.color}20; color: ${sectorInfo.color}">
                            <i class="${sectorInfo.icon}"></i>
                        </div>
                        <div class="sector-option-info">
                            <span class="sector-option-name">${sectorInfo.name}</span>
                        </div>
                    `;
                }
            }
        });
    });

    // Sector change confirmation
    modal.querySelector('[data-action="confirm-sector-change"]')?.addEventListener('click', () => {
        if (!selectedNewSector) return;

        const company = loadPlayerCompany();
        const cost = calculateSectorChangeCost(company);

        showConfirmDialog(
            'Sektör Değişikliği Onayı',
            `Sektörünüzü değiştirmek ${cost.toLocaleString()} ₳ maliyetinde olacak. Devam etmek istiyor musunuz?`,
            () => {
                // Check if enough cash
                if (company.cash < cost) {
                    alert('Yetersiz bakiye! Sektör değişikliği için ' + cost.toLocaleString() + ' ₳ gerekli.');
                    return;
                }

                // Change sector
                import('../data/company-data.js').then(module => {
                    module.changeProfession(selectedNewSector);
                    module.updateCompany({ cash: company.cash - cost });
                    closeAllModals(true);
                    window.location.reload();
                });
            }
        );
    });

    // === STAFF HANDLERS ===

    // Staff işe alma
    modal.querySelectorAll('[data-action="hire-staff"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const staffId = btn.dataset.staff;
            const result = hireStaff(staffId);

            if (result.success) {
                alert(`${result.staff.name} başarıyla işe alındı!`);
                closeAllModals(true);
                window.location.reload();
            } else {
                alert(result.error);
            }
        });
    });

    // Staff işten çıkarma
    modal.querySelectorAll('[data-action="fire-staff"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const staffId = btn.dataset.staff;
            showConfirmDialog(
                'Personel Çıkışı',
                'Bu personeli işten çıkarmak istediğinize emin misiniz?',
                () => {
                    const result = fireStaff(staffId);
                    if (result.success) {
                        closeAllModals(true);
                        window.location.reload();
                    } else {
                        alert(result.error);
                    }
                }
            );
        });
    });

    // === FINANCE HANDLERS ===

    // Quick amount buttons
    modal.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            const input = modal.querySelector('#transfer-amount');
            if (input) {
                input.value = amount;
            }
        });
    });

    // Transfer to company
    modal.querySelector('[data-action="transfer-to-company"]')?.addEventListener('click', () => {
        const input = modal.querySelector('#transfer-amount');
        const amount = parseInt(input?.value) || 0;

        if (amount <= 0) {
            alert('Geçerli bir miktar girin');
            return;
        }

        const company = loadPlayerCompany();
        const result = transferToCompany(company.id, amount);

        if (result.success) {
            // Update displays
            const playerBalanceEl = modal.querySelector('#player-balance');
            const companyBalanceEl = modal.querySelector('#company-balance');

            if (playerBalanceEl) playerBalanceEl.textContent = `${result.newBalance.toLocaleString()} ₳`;
            if (companyBalanceEl) {
                const updatedCompany = loadPlayerCompany();
                companyBalanceEl.textContent = `${updatedCompany.cash.toLocaleString()} ₳`;
            }

            input.value = '';
            alert(`${amount.toLocaleString()} ₳ şirkete aktarıldı!`);
        } else {
            alert(result.error);
        }
    });

    // Withdraw from company
    modal.querySelector('[data-action="withdraw-from-company"]')?.addEventListener('click', () => {
        const input = modal.querySelector('#transfer-amount');
        const amount = parseInt(input?.value) || 0;

        if (amount <= 0) {
            alert('Geçerli bir miktar girin');
            return;
        }

        const company = loadPlayerCompany();
        const result = withdrawFromCompany(company.id, amount);

        if (result.success) {
            // Update displays
            const playerBalanceEl = modal.querySelector('#player-balance');
            const companyBalanceEl = modal.querySelector('#company-balance');

            if (playerBalanceEl) playerBalanceEl.textContent = `${result.newBalance.toLocaleString()} ₳`;
            if (companyBalanceEl) {
                const updatedCompany = loadPlayerCompany();
                companyBalanceEl.textContent = `${updatedCompany.cash.toLocaleString()} ₳`;
            }

            input.value = '';
            alert(`${amount.toLocaleString()} ₳ şirketten çekildi!`);
        } else {
            alert(result.error);
        }
    });

    // Create new company button
    modal.querySelector('[data-action="create-new-company"]')?.addEventListener('click', () => {
        // TODO: Yeni şirket kurma wizard'ını aç
        alert('Yeni şirket kurma özelliği yakında eklenecek!');
    });
}

// === SETUP COMPANY MANAGEMENT MODAL HANDLERS ===
export function setupCompanyManagementHandlers() {
    const modal = document.getElementById('company-management-modal');
    if (!modal) return;

    // Tab switching
    modal.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            modal.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            modal.querySelectorAll('.modal-tab-content').forEach(content => {
                content.classList.toggle('active', content.dataset.tabContent === tabId);
            });
        });
    });

    // Staff işe alma
    modal.querySelectorAll('[data-action="hire-staff"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const staffId = btn.dataset.staff;
            const result = hireStaff(staffId);

            if (result.success) {
                alert(`${result.staff.name} başarıyla işe alındı!`);
                closeAllModals(true);
                window.location.reload();
            } else {
                alert(result.error);
            }
        });
    });

    // Staff işten çıkarma
    modal.querySelectorAll('[data-action="fire-staff"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const staffId = btn.dataset.staff;
            showConfirmDialog(
                'Personel Çıkışı',
                'Bu personeli işten çıkarmak istediğinize emin misiniz?',
                () => {
                    const result = fireStaff(staffId);
                    if (result.success) {
                        closeAllModals(true);
                        window.location.reload();
                    } else {
                        alert(result.error);
                    }
                }
            );
        });
    });

    // Quick amount buttons
    modal.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            const input = modal.querySelector('#transfer-amount');
            if (input) {
                input.value = amount;
            }
        });
    });

    // Transfer to company
    modal.querySelector('[data-action="transfer-to-company"]')?.addEventListener('click', () => {
        const input = modal.querySelector('#transfer-amount');
        const amount = parseInt(input?.value) || 0;

        if (amount <= 0) {
            alert('Geçerli bir miktar girin');
            return;
        }

        const company = loadPlayerCompany();
        const result = transferToCompany(company.id, amount);

        if (result.success) {
            const playerBalanceEl = modal.querySelector('#player-balance');
            const companyBalanceEl = modal.querySelector('#company-balance');

            if (playerBalanceEl) playerBalanceEl.textContent = `${result.newBalance.toLocaleString()} ₳`;
            if (companyBalanceEl) {
                const updatedCompany = loadPlayerCompany();
                companyBalanceEl.textContent = `${updatedCompany.cash.toLocaleString()} ₳`;
            }

            input.value = '';
            alert(`${amount.toLocaleString()} ₳ şirkete aktarıldı!`);
        } else {
            alert(result.error);
        }
    });

    // Withdraw from company
    modal.querySelector('[data-action="withdraw-from-company"]')?.addEventListener('click', () => {
        const input = modal.querySelector('#transfer-amount');
        const amount = parseInt(input?.value) || 0;

        if (amount <= 0) {
            alert('Geçerli bir miktar girin');
            return;
        }

        const company = loadPlayerCompany();
        const result = withdrawFromCompany(company.id, amount);

        if (result.success) {
            const playerBalanceEl = modal.querySelector('#player-balance');
            const companyBalanceEl = modal.querySelector('#company-balance');

            if (playerBalanceEl) playerBalanceEl.textContent = `${result.newBalance.toLocaleString()} ₳`;
            if (companyBalanceEl) {
                const updatedCompany = loadPlayerCompany();
                companyBalanceEl.textContent = `${updatedCompany.cash.toLocaleString()} ₳`;
            }

            input.value = '';
            alert(`${amount.toLocaleString()} ₳ şirketten çekildi!`);
        } else {
            alert(result.error);
        }
    });

    // Create new company button
    modal.querySelector('[data-action="create-new-company"]')?.addEventListener('click', () => {
        alert('Yeni şirket kurma özelliği yakında eklenecek!');
    });

    // Switch company
    modal.querySelectorAll('[data-action="switch-company"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const companyId = btn.dataset.company;
            import('../data/company-data.js').then(module => {
                module.setActiveCompany(companyId);
                closeAllModals(true);
                window.location.reload();
            });
        });
    });
}

// === RENDER ADD PRODUCT MODAL ===
export function renderAddProductModal(profession) {
    return `
        <div class="modal-overlay" id="add-product-modal">
            <div class="modal-container">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-plus-circle"></i> Yeni Ürün Ekle</h2>
                    <button class="modal-close" data-action="close-modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Ürün Adı</label>
                        <input type="text" id="new-product-name" placeholder="Örn: Premium T-Shirt" maxlength="30">
                    </div>
                    <div class="form-row">
                        <div class="form-group half">
                            <label>Başlangıç Stoğu</label>
                            <input type="number" id="new-product-stock" value="50" min="0" max="10000">
                        </div>
                        <div class="form-group half">
                            <label>Birim Fiyatı (₳)</label>
                            <input type="number" id="new-product-price" value="100" min="1" max="99999">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Ürün Kalitesi</label>
                        <div class="quality-slider">
                            <input type="range" id="new-product-quality" min="30" max="100" value="70">
                            <div class="quality-labels">
                                <span>Ekonomik</span>
                                <span>Standart</span>
                                <span>Premium</span>
                            </div>
                            <div class="quality-value" id="quality-display">70%</div>
                        </div>
                    </div>
                    <div class="stock-cost-preview">
                        <span>Stok Maliyeti:</span>
                        <span class="cost-value" id="stock-cost-display">2,500 ₳</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal secondary" data-action="close-modal">İptal</button>
                    <button class="btn-modal success" data-action="confirm-add-product">
                        <i class="fa-solid fa-plus"></i> Ürün Ekle
                    </button>
                </div>
            </div>
        </div>
    `;
}

// === RENDER EMPLOYEE MANAGEMENT MODAL ===
export function renderEmployeeModal(company) {
    const hireCost = 500;
    const fireCost = 200;
    const upgradeCost = company.maxEmployees * 1000;

    return `
        <div class="modal-overlay" id="employee-modal">
            <div class="modal-container">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-users-gear"></i> Çalışan Yönetimi</h2>
                    <button class="modal-close" data-action="close-modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="employee-overview">
                        <div class="employee-stat-card">
                            <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
                            <div class="stat-info">
                                <span class="stat-value">${company.employees}</span>
                                <span class="stat-label">Mevcut Çalışan</span>
                            </div>
                        </div>
                        <div class="employee-stat-card">
                            <div class="stat-icon"><i class="fa-solid fa-user-plus"></i></div>
                            <div class="stat-info">
                                <span class="stat-value">${company.maxEmployees}</span>
                                <span class="stat-label">Maksimum Kapasite</span>
                            </div>
                        </div>
                        <div class="employee-stat-card">
                            <div class="stat-icon"><i class="fa-solid fa-percent"></i></div>
                            <div class="stat-info">
                                <span class="stat-value">${Math.round((company.employees / company.maxEmployees) * 100)}%</span>
                                <span class="stat-label">Verimlilik</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="employee-actions-grid">
                        <div class="action-card hire">
                            <div class="action-header">
                                <i class="fa-solid fa-user-plus"></i>
                                <h4>Çalışan İşe Al</h4>
                            </div>
                            <p>Üretim kapasitesini artırmak için yeni çalışan alın.</p>
                            <div class="action-cost">
                                <span>Maliyet:</span>
                                <span class="cost">${hireCost.toLocaleString()} ₳ / kişi</span>
                            </div>
                            <div class="action-controls">
                                <button class="btn-sm" data-action="decrease-hire">-</button>
                                <span class="hire-count" id="hire-count">1</span>
                                <button class="btn-sm" data-action="increase-hire">+</button>
                            </div>
                            <button class="btn-action success" data-action="confirm-hire" ${company.employees >= company.maxEmployees ? 'disabled' : ''}>
                                <i class="fa-solid fa-check"></i> İşe Al (<span id="hire-total-cost">${hireCost}</span> ₳)
                            </button>
                        </div>
                        
                        <div class="action-card fire">
                            <div class="action-header">
                                <i class="fa-solid fa-user-minus"></i>
                                <h4>Çalışan Çıkar</h4>
                            </div>
                            <p>Maliyetleri düşürmek için çalışan sayısını azaltın.</p>
                            <div class="action-cost">
                                <span>Tazminat:</span>
                                <span class="cost">${fireCost.toLocaleString()} ₳ / kişi</span>
                            </div>
                            <div class="action-controls">
                                <button class="btn-sm" data-action="decrease-fire">-</button>
                                <span class="fire-count" id="fire-count">1</span>
                                <button class="btn-sm" data-action="increase-fire">+</button>
                            </div>
                            <button class="btn-action danger" data-action="confirm-fire" ${company.employees <= 1 ? 'disabled' : ''}>
                                <i class="fa-solid fa-xmark"></i> Çıkar (<span id="fire-total-cost">${fireCost}</span> ₳)
                            </button>
                        </div>
                        
                        <div class="action-card upgrade full-width">
                            <div class="action-header">
                                <i class="fa-solid fa-arrow-up-right-dots"></i>
                                <h4>Kapasite Yükselt</h4>
                            </div>
                            <p>Maksimum çalışan kapasitesini 5 kişi artırın. Daha fazla üretim, daha fazla gelir!</p>
                            <div class="upgrade-preview">
                                <span>${company.maxEmployees} kişi</span>
                                <i class="fa-solid fa-arrow-right"></i>
                                <span class="text-green">${company.maxEmployees + 5} kişi</span>
                            </div>
                            <button class="btn-action primary" data-action="confirm-upgrade">
                                <i class="fa-solid fa-arrow-up"></i> Yükselt (${upgradeCost.toLocaleString()} ₳)
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal secondary" data-action="close-modal">Kapat</button>
                </div>
            </div>
        </div>
    `;
}

// === RENDER COMPANY SETTINGS MODAL ===
export function renderCompanySettingsModal(company) {
    return `
        <div class="modal-overlay" id="company-settings-modal">
            <div class="modal-container">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-gear"></i> Şirket Ayarları</h2>
                    <button class="modal-close" data-action="close-modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="settings-section">
                        <h4><i class="fa-solid fa-bell"></i> Bildirimler</h4>
                        <div class="settings-options">
                            <label class="toggle-option">
                                <span>Sipariş Bildirimleri</span>
                                <input type="checkbox" checked>
                                <span class="toggle-slider"></span>
                            </label>
                            <label class="toggle-option">
                                <span>Stok Uyarıları</span>
                                <input type="checkbox" checked>
                                <span class="toggle-slider"></span>
                            </label>
                            <label class="toggle-option">
                                <span>Günlük Rapor</span>
                                <input type="checkbox">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h4><i class="fa-solid fa-robot"></i> Otomasyon</h4>
                        <div class="settings-options">
                            <label class="toggle-option">
                                <span>Otomatik Stok Siparişi</span>
                                <input type="checkbox">
                                <span class="toggle-slider"></span>
                            </label>
                            <label class="toggle-option">
                                <span>Dinamik Fiyatlandırma</span>
                                <input type="checkbox">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-section danger-zone">
                        <h4><i class="fa-solid fa-triangle-exclamation"></i> Tehlikeli Bölge</h4>
                        <div class="danger-actions">
                            <div class="danger-item">
                                <div class="danger-info">
                                    <span class="danger-title">Şirketi Sıfırla</span>
                                    <span class="danger-desc">Tüm veriler silinir, sıfırdan başlarsınız.</span>
                                </div>
                                <button class="btn-danger" data-action="reset-company">
                                    <i class="fa-solid fa-rotate"></i> Sıfırla
                                </button>
                            </div>
                            <div class="danger-item">
                                <div class="danger-info">
                                    <span class="danger-title">Şirketi Kapat</span>
                                    <span class="danger-desc">Şirketiniz tamamen kapatılır.</span>
                                </div>
                                <button class="btn-danger" data-action="delete-company">
                                    <i class="fa-solid fa-trash"></i> Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal primary" data-action="close-modal">Tamam</button>
                </div>
            </div>
        </div>
    `;
}

// === SETUP COMPANY EVENT HANDLERS ===
export function setupCompanyEventHandlers() {
    const container = document.querySelector('.company-full-view') || document.querySelector('.dashboard-content');
    if (!container) return;

    // Remove existing listener to prevent duplicates
    container.removeEventListener('click', handleCompanyClick);
    container.addEventListener('click', handleCompanyClick);
}

// Separate handler function to allow removal
function handleCompanyClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const companyId = e.target.closest('[data-company-id]')?.dataset.companyId;

    // Handle company switching from mini dots or list
    if (companyId && !action) {
        import('../data/company-data.js').then(module => {
            module.setActiveCompany(companyId);
            // Re-render the section
            const updatedCompany = module.loadPlayerCompany();
            const root = document.querySelector('.dashboard-content');
            if (root) {
                root.innerHTML = renderMyCompanySection(updatedCompany);
                setupCompanyEventHandlers();
            }
        });
        return;
    }

    if (!action) return;

    switch (action) {
        case 'create-company':
            showModal(renderCreateCompanyWizard());
            setupWizardHandlers();
            setupModalCloseHandlers();
            break;
        case 'company-management':
            // Logic to switch to "Management" tab or scroll to hub
            const hub = document.querySelector('.company-management-hub');
            if (hub) {
                hub.scrollIntoView({ behavior: 'smooth' });
            } else {
                const mgmtCompany = loadPlayerCompany();
                const mgmtProfession = getProfessionInfo(mgmtCompany.profession);
                showModal(renderCompanyManagementModal(mgmtCompany, mgmtProfession));
                setupCompanyManagementHandlers();
                setupModalCloseHandlers();
            }
            break;
        case 'edit-company':
            const company = loadPlayerCompany();
            const profession = getProfessionInfo(company.profession);
            showModal(renderEditCompanyModal(company, profession));
            setupEditModalHandlers();
            setupModalCloseHandlers(true); // Has form
            break;
        case 'new-product':
        case 'add-product':
            const comp = loadPlayerCompany();
            const prof = getProfessionInfo(comp.profession);
            showModal(renderAddProductModal(prof));
            setupProductModalHandlers();
            setupModalCloseHandlers(true); // Has form
            break;
        case 'manage-employees':
            showModal(renderEmployeeModal(loadPlayerCompany()));
            setupEmployeeModalHandlers();
            setupModalCloseHandlers();
            break;
        case 'toggle-company-switcher':
            const dropdown = document.getElementById('company-switcher');
            if (dropdown) dropdown.classList.toggle('show');
            break;
        case 'company-settings':
            showModal(renderCompanySettingsModal(loadPlayerCompany()));
            setupModalCloseHandlers();
            break;
        case 'close-modal':
            tryCloseModal();
            break;
        case 'save-company-edit':
            saveCompanyEdit();
            break;
        case 'confirm-add-product':
            confirmAddProduct();
            break;
    }
}

// Track if form has been modified
let formModified = false;

// === MODAL HELPERS ===
function showModal(html) {
    // Remove existing modals
    closeAllModals(true); // Force close without confirmation

    // Reset form modified flag
    formModified = false;

    // Add new modal
    document.body.insertAdjacentHTML('beforeend', html);

    // Animate in
    setTimeout(() => {
        document.querySelector('.modal-overlay')?.classList.add('active');
    }, 10);
}

function setupModalCloseHandlers(hasForm = false) {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;

    // Track form changes if this modal has a form
    if (hasForm) {
        overlay.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                formModified = true;
            });
            input.addEventListener('change', () => {
                formModified = true;
            });
        });
    }

    // Click outside to close (on overlay background)
    overlay.addEventListener('click', (e) => {
        // Only close if clicking the overlay itself, not its children
        if (e.target === overlay) {
            tryCloseModal();
        }
    });

    // Close button (X) handler
    overlay.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            tryCloseModal();
        });
    });

    // Cancel/Close buttons handler
    overlay.querySelectorAll('[data-action="close-modal"], .btn-modal.secondary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            tryCloseModal();
        });
    });

    // ESC key to close
    document.addEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        tryCloseModal();
    }
}

function tryCloseModal() {
    if (formModified) {
        // Show confirmation dialog
        showConfirmDialog(
            'Değişiklikler Kaydedilmedi',
            'Yapmış olduğunuz değişiklikler kaydedilmeyecek. Çıkmak istediğinize emin misiniz?',
            () => {
                formModified = false;
                closeAllModals(true);
            }
        );
    } else {
        closeAllModals(true);
    }
}

function closeAllModals(force = false) {
    // Remove ESC key listener
    document.removeEventListener('keydown', handleEscKey);

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    // Reset form modified flag
    if (force) {
        formModified = false;
    }
}

// === CONFIRMATION DIALOG ===
function showConfirmDialog(title, message, onConfirm, onCancel) {
    const dialogHTML = `
        <div class="confirm-dialog-overlay" id="confirm-dialog">
            <div class="confirm-dialog">
                <div class="confirm-dialog-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="confirm-dialog-actions">
                    <button class="btn-confirm-cancel" id="confirm-cancel">
                        <i class="fa-solid fa-arrow-left"></i> Geri Dön
                    </button>
                    <button class="btn-confirm-ok" id="confirm-ok">
                        <i class="fa-solid fa-xmark"></i> Çık
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', dialogHTML);

    const dialog = document.getElementById('confirm-dialog');
    setTimeout(() => dialog?.classList.add('active'), 10);

    document.getElementById('confirm-ok')?.addEventListener('click', () => {
        dialog?.remove();
        if (onConfirm) onConfirm();
    });

    document.getElementById('confirm-cancel')?.addEventListener('click', () => {
        dialog?.remove();
        if (onCancel) onCancel();
    });

    // Click outside to cancel
    dialog?.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog?.remove();
            if (onCancel) onCancel();
        }
    });
}

// === WIZARD HANDLERS ===
function setupWizardHandlers() {
    let currentStep = 1;
    let selectedCapital = 10000;
    let selectedProfession = null;

    const modal = document.getElementById('create-company-modal');
    if (!modal) return;

    // Capital selection
    modal.querySelectorAll('.capital-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.capital-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCapital = parseInt(btn.dataset.capital);
        });
    });

    // Profession selection
    modal.querySelectorAll('.profession-option').forEach(opt => {
        opt.addEventListener('click', () => {
            modal.querySelectorAll('.profession-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedProfession = opt.dataset.profession;
        });
    });

    // Category accordion
    modal.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('expanded');
        });
    });

    // Navigation buttons
    document.getElementById('wizard-prev')?.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateWizardStep(currentStep, modal);
        }
    });

    document.getElementById('wizard-next')?.addEventListener('click', () => {
        if (currentStep < 3) {
            // Validate current step
            if (currentStep === 1) {
                const name = document.getElementById('company-name-input')?.value?.trim();
                if (!name) {
                    alert('Lütfen şirket adını girin');
                    return;
                }
            }
            if (currentStep === 2 && !selectedProfession) {
                alert('Lütfen bir sektör seçin');
                return;
            }

            currentStep++;
            updateWizardStep(currentStep, modal);

            // Update preview on step 3
            if (currentStep === 3) {
                updateCompanyPreview(selectedCapital, selectedProfession);
            }
        }
    });

    document.getElementById('wizard-finish')?.addEventListener('click', () => {
        const name = document.getElementById('company-name-input')?.value?.trim() || 'Yeni Şirket';

        createNewCompany({
            name,
            professionKey: selectedProfession,
            startingCapital: selectedCapital,
            initialEmployees: 3
        });

        closeAllModals();
        // Refresh the page/view
        window.location.reload();
    });
}

function updateWizardStep(step, modal) {
    // Update step visibility
    modal.querySelectorAll('.wizard-step').forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.step) === step);
    });

    // Update progress indicators
    modal.querySelectorAll('.progress-step').forEach(s => {
        const stepNum = parseInt(s.dataset.step);
        s.classList.toggle('active', stepNum <= step);
        s.classList.toggle('completed', stepNum < step);
    });

    // Update buttons
    document.getElementById('wizard-prev').disabled = step === 1;
    document.getElementById('wizard-next').classList.toggle('hidden', step === 3);
    document.getElementById('wizard-finish').classList.toggle('hidden', step !== 3);
}

function updateCompanyPreview(capital, professionKey) {
    const name = document.getElementById('company-name-input')?.value?.trim() || 'Yeni Şirket';
    const categories = getProfessionsByCategory();
    let profession = null;

    Object.values(categories).forEach(cat => {
        const found = cat.professions.find(p => p.key === professionKey);
        if (found) profession = found;
    });

    if (profession) {
        document.getElementById('preview-name').textContent = name;
        document.getElementById('preview-sector').textContent = profession.name;
        document.getElementById('preview-sector').style.color = profession.color;
        document.getElementById('preview-icon').innerHTML = `<i class="${profession.icon}" style="color: ${profession.color}"></i>`;
        document.getElementById('preview-icon').style.background = `${profession.color}20`;
    }
    document.getElementById('preview-capital').textContent = capital.toLocaleString() + ' ₳';
}

// === PRODUCT MODAL HANDLERS ===
function setupProductModalHandlers() {
    const qualitySlider = document.getElementById('new-product-quality');
    const qualityDisplay = document.getElementById('quality-display');
    const stockInput = document.getElementById('new-product-stock');
    const costDisplay = document.getElementById('stock-cost-display');

    if (qualitySlider && qualityDisplay) {
        qualitySlider.addEventListener('input', () => {
            qualityDisplay.textContent = qualitySlider.value + '%';
            updateStockCost();
        });
    }

    if (stockInput) {
        stockInput.addEventListener('input', updateStockCost);
    }

    function updateStockCost() {
        const stock = parseInt(stockInput?.value || 50);
        const quality = parseInt(qualitySlider?.value || 70);
        const unitCost = Math.round(50 * (quality / 70));
        const totalCost = stock * unitCost;
        if (costDisplay) {
            costDisplay.textContent = totalCost.toLocaleString() + ' ₳';
        }
    }
}

function confirmAddProduct() {
    const name = document.getElementById('new-product-name')?.value?.trim();
    const stock = parseInt(document.getElementById('new-product-stock')?.value || 50);
    const price = parseInt(document.getElementById('new-product-price')?.value || 100);
    const quality = parseInt(document.getElementById('new-product-quality')?.value || 70);

    if (!name) {
        alert('Lütfen ürün adını girin');
        return;
    }

    addProduct({
        name,
        stock,
        price,
        quality
    });

    closeAllModals();
    window.location.reload();
}

// === EMPLOYEE MODAL HANDLERS ===
function setupEmployeeModalHandlers() {
    let hireCount = 1;
    let fireCount = 1;
    const hireCost = 500;
    const fireCost = 200;

    document.querySelector('[data-action="increase-hire"]')?.addEventListener('click', () => {
        hireCount++;
        document.getElementById('hire-count').textContent = hireCount;
        document.getElementById('hire-total-cost').textContent = (hireCount * hireCost).toLocaleString();
    });

    document.querySelector('[data-action="decrease-hire"]')?.addEventListener('click', () => {
        if (hireCount > 1) {
            hireCount--;
            document.getElementById('hire-count').textContent = hireCount;
            document.getElementById('hire-total-cost').textContent = (hireCount * hireCost).toLocaleString();
        }
    });

    document.querySelector('[data-action="increase-fire"]')?.addEventListener('click', () => {
        fireCount++;
        document.getElementById('fire-count').textContent = fireCount;
        document.getElementById('fire-total-cost').textContent = (fireCount * fireCost).toLocaleString();
    });

    document.querySelector('[data-action="decrease-fire"]')?.addEventListener('click', () => {
        if (fireCount > 1) {
            fireCount--;
            document.getElementById('fire-count').textContent = fireCount;
            document.getElementById('fire-total-cost').textContent = (fireCount * fireCost).toLocaleString();
        }
    });

    document.querySelector('[data-action="confirm-hire"]')?.addEventListener('click', () => {
        const result = hireEmployee(hireCount);
        if (result.success) {
            closeAllModals();
            window.location.reload();
        } else {
            alert(result.error);
        }
    });

    document.querySelector('[data-action="confirm-fire"]')?.addEventListener('click', () => {
        const result = fireEmployee(fireCount);
        if (result.success) {
            closeAllModals();
            window.location.reload();
        } else {
            alert(result.error);
        }
    });

    document.querySelector('[data-action="confirm-upgrade"]')?.addEventListener('click', () => {
        const result = upgradeCapacity();
        if (result.success) {
            closeAllModals();
            window.location.reload();
        } else {
            alert(result.error);
        }
    });
}

function saveCompanyEdit() {
    const name = document.getElementById('edit-company-name')?.value?.trim();
    const desc = document.getElementById('edit-company-desc')?.value?.trim();

    if (name) {
        updateCompany({ name, description: desc });
        closeAllModals();
        window.location.reload();
    }
}

