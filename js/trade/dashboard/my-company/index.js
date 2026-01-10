// MY COMPANY SECTION - UI COMPONENTS
// Şirketim bölümü - Mesleğe göre dinamik görünüm

import { getProfessionInfo, calculateCompanyMetrics, PROFESSION_TYPES } from '../data/company-data.js';

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
    return `
        <div class="company-widget" data-profession="${profession.id}">
            <!-- Widget Header -->
            <div class="widget-header">
                <div class="company-identity">
                    <div class="company-logo" style="background: linear-gradient(135deg, ${profession.color}40, ${profession.color}20);">
                        <i class="${profession.icon}" style="color: ${profession.color}"></i>
                    </div>
                    <div class="company-info">
                        <h3 class="company-name">${company.name}</h3>
                        <span class="company-type" style="color: ${profession.color}">${profession.name}</span>
                    </div>
                </div>
                <div class="company-level">
                    <span class="level-badge">LVL ${company.level}</span>
                </div>
            </div>

            <!-- Quick Stats Row -->
            <div class="widget-stats">
                <div class="stat-item">
                    <div class="stat-icon text-gold">
                        <i class="fa-solid fa-coins"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">${company.totalValue.toLocaleString()} ₳</span>
                        <span class="stat-label">Şirket Değeri</span>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon text-green">
                        <i class="fa-solid fa-arrow-trend-up"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">+${company.dailyIncome.toLocaleString()} ₳</span>
                        <span class="stat-label">Günlük Gelir</span>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon text-blue">
                        <i class="fa-solid fa-box"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">${metrics.totalStock}</span>
                        <span class="stat-label">Toplam Stok</span>
                    </div>
                </div>
            </div>

            <!-- Product Highlights -->
            <div class="widget-products">
                <div class="products-header">
                    <h4>Öne Çıkan Ürünler</h4>
                    <span class="product-count">${metrics.productCount} ürün</span>
                </div>
                <div class="products-list">
                    ${company.products.slice(0, 3).map(product => `
                        <div class="product-mini">
                            <div class="product-info">
                                <span class="product-name">${product.name}</span>
                                <span class="product-stock">${product.stock} adet</span>
                            </div>
                            <div class="product-demand">
                                <div class="demand-bar" style="width: ${product.demand}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Orders Summary -->
            <div class="widget-orders">
                <div class="order-stat">
                    <i class="fa-solid fa-clock text-yellow"></i>
                    <span>${metrics.pendingOrders} Bekleyen Sipariş</span>
                </div>
                <div class="order-stat">
                    <i class="fa-solid fa-star text-gold"></i>
                    <span>${company.reputation}/100 İtibar</span>
                </div>
            </div>

            <!-- Widget Footer -->
            <div class="widget-footer">
                <button class="btn-widget" data-action="view-company">
                    <i class="fa-solid fa-building"></i>
                    Şirketi Yönet
                </button>
                <button class="btn-widget secondary" data-action="view-products">
                    <i class="fa-solid fa-cubes"></i>
                    Ürünler
                </button>
            </div>
        </div>
    `;
}

// === FULL COMPANY VIEW ===
function renderFullCompanyView(company, profession, metrics) {
    return `
        <div class="company-full-view" data-profession="${profession.id}">
            <!-- Company Header - Kompakt -->
            ${renderCompanyHeader(company, profession)}

            <!-- Ana İçerik: 2 Sütun Kompakt -->
            <div class="company-compact-grid">
                <!-- Sol Sütun: Finansal + Ürünler -->
                <div class="company-left-column">
                    <!-- Finansal Özet Kartları -->
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
                            <div class="summary-icon text-blue"><i class="fa-solid fa-users"></i></div>
                            <div class="summary-content">
                                <span class="summary-value">${company.employees}/${company.maxEmployees}</span>
                                <span class="summary-label">Çalışanlar</span>
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

                    <!-- Ürünler Bölümü -->
                    ${renderProductsSection(company, profession)}
                </div>

                <!-- Sağ Sütun: Siparişler + Aktivite -->
                <div class="company-right-column">
                    ${renderOrdersSectionCompact(company)}
                    ${renderActivityFeedCompact(company)}
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
                    <h1 class="company-name">${company.name}</h1>
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
                <button class="btn-action" data-action="edit-company">
                    <i class="fa-solid fa-pen"></i>
                    Düzenle
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
    const weeklyChange = company.weeklyGrowth > 0 ? `+${company.weeklyGrowth}%` : `${company.weeklyGrowth}%`;
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

// === REPUTATION CARD ===
function renderReputationCard(company) {
    const reputationLevel = company.reputation >= 80 ? 'Mükemmel' :
        company.reputation >= 60 ? 'İyi' :
            company.reputation >= 40 ? 'Orta' : 'Gelişmeli';
    const satisfactionLevel = company.customerSatisfaction >= 80 ? 'Çok Memnun' :
        company.customerSatisfaction >= 60 ? 'Memnun' :
            company.customerSatisfaction >= 40 ? 'Nötr' : 'Memnun Değil';

    return `
        <div class="stats-card reputation">
            <div class="card-header">
                <h3><i class="fa-solid fa-star"></i> İtibar & Memnuniyet</h3>
            </div>
            <div class="card-content">
                <div class="reputation-gauge">
                    <svg viewBox="0 0 100 50" class="gauge-svg">
                        <path class="gauge-bg" d="M 10 45 A 35 35 0 1 1 90 45" fill="none" stroke="#1e293b" stroke-width="8"/>
                        <path class="gauge-fill" d="M 10 45 A 35 35 0 1 1 90 45" fill="none" stroke="url(#reputationGradient)" stroke-width="8" 
                              stroke-dasharray="${company.reputation * 1.1} 110"/>
                        <defs>
                            <linearGradient id="reputationGradient">
                                <stop offset="0%" stop-color="#ef4444"/>
                                <stop offset="50%" stop-color="#fbbf24"/>
                                <stop offset="100%" stop-color="#22c55e"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <div class="gauge-value">${company.reputation}</div>
                    <div class="gauge-label">${reputationLevel}</div>
                </div>
                <div class="satisfaction-bar">
                    <div class="bar-header">
                        <span>Müşteri Memnuniyeti</span>
                        <span class="bar-value">${company.customerSatisfaction}% - ${satisfactionLevel}</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill satisfaction" style="width: ${company.customerSatisfaction}%"></div>
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

            <!-- Sipariş Durumu Özeti -->
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

            <!-- Son Siparişler -->
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

