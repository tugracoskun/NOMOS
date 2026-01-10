// LOGISTICS & SHIPMENT TRACKER
// Kargo takip sistemi - Gemi, Hava, Kara, Tren

import { loadShipments, getTransportTypeInfo, getStatusInfo, TRANSPORT_TYPES, SHIPMENT_STATUS } from '../data/shipment-data.js';

export function renderShipmentTracker(shipments, isWidget = false) {
    if (isWidget) {
        return renderLogisticsWidget(shipments);
    }
    return renderFullLogisticsView(shipments);
}

function renderLogisticsWidget(shipments) {
    const activeShipments = shipments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled').slice(0, 3);
    const stats = {
        total: shipments.length,
        inTransit: shipments.filter(s => s.status === 'in_transit').length,
        delivered: shipments.filter(s => s.status === 'delivered').length
    };

    return `
        <div class="logistics-widget">
            <div class="widget-header">
                <h3><i class="fa-solid fa-truck-fast"></i> Kargo Takip</h3>
                <span class="shipment-count">${stats.inTransit} aktif</span>
            </div>
            <div class="shipment-stats-mini">
                <div class="stat-pill"><i class="fa-solid fa-route text-blue"></i> ${stats.total} Toplam</div>
                <div class="stat-pill"><i class="fa-solid fa-truck text-yellow"></i> ${stats.inTransit} Yolda</div>
                <div class="stat-pill"><i class="fa-solid fa-check text-green"></i> ${stats.delivered} Teslim</div>
            </div>
            <div class="active-shipments-list">
                ${activeShipments.length > 0 ? activeShipments.map(shipment => renderShipmentMini(shipment)).join('') : `
                    <div class="empty-state small"><i class="fa-solid fa-box-open"></i><p>Aktif kargo yok</p></div>
                `}
            </div>
            <div class="widget-footer">
                <button class="btn-widget" data-action="view-logistics"><i class="fa-solid fa-truck-fast"></i> Tüm Kargolar</button>
                <button class="btn-widget secondary" data-action="new-shipment"><i class="fa-solid fa-plus"></i> Yeni Gönderi</button>
            </div>
        </div>
    `;
}

function renderShipmentMini(shipment) {
    const transport = getTransportTypeInfo(shipment.transportType);
    const status = getStatusInfo(shipment.status);

    return `
        <div class="shipment-mini" data-shipment-id="${shipment.id}">
            <div class="shipment-icon" style="background: ${transport.color}20; color: ${transport.color}">
                <i class="${transport.icon}"></i>
            </div>
            <div class="shipment-info">
                <div class="shipment-route">${shipment.origin} → ${shipment.destination}</div>
                <div class="shipment-product">${shipment.productName}</div>
            </div>
            <div class="shipment-progress">
                <div class="progress-bar-mini">
                    <div class="progress-fill" style="width: ${shipment.progress}%; background: ${transport.color}"></div>
                </div>
                <span class="progress-text">${shipment.progress}%</span>
            </div>
        </div>
    `;
}

function renderFullLogisticsView(shipments) {
    const stats = {
        total: shipments.length,
        pending: shipments.filter(s => s.status === 'pending').length,
        inTransit: shipments.filter(s => s.status === 'in_transit').length,
        delivered: shipments.filter(s => s.status === 'delivered').length,
        totalValue: shipments.reduce((sum, s) => sum + s.value, 0)
    };

    return `
        <div class="logistics-full-view">
            <header class="logistics-header">
                <div class="header-left">
                    <h1><i class="fa-solid fa-truck-fast"></i> Lojistik Merkezi</h1>
                    <p>Kargolarınızı takip edin ve yönetin</p>
                </div>
                <div class="header-actions">
                    <button class="btn-action primary" data-action="new-shipment"><i class="fa-solid fa-plus"></i> Yeni Gönderi</button>
                </div>
            </header>
            
            <div class="stats-bar">
                <div class="stat-card"><div class="stat-icon"><i class="fa-solid fa-box"></i></div><div class="stat-content"><span class="value">${stats.total}</span><span class="label">Toplam Kargo</span></div></div>
                <div class="stat-card"><div class="stat-icon text-yellow"><i class="fa-solid fa-clock"></i></div><div class="stat-content"><span class="value">${stats.pending}</span><span class="label">Beklemede</span></div></div>
                <div class="stat-card"><div class="stat-icon text-blue"><i class="fa-solid fa-truck"></i></div><div class="stat-content"><span class="value">${stats.inTransit}</span><span class="label">Yolda</span></div></div>
                <div class="stat-card"><div class="stat-icon text-green"><i class="fa-solid fa-check"></i></div><div class="stat-content"><span class="value">${stats.delivered}</span><span class="label">Teslim Edildi</span></div></div>
                <div class="stat-card"><div class="stat-icon text-gold"><i class="fa-solid fa-coins"></i></div><div class="stat-content"><span class="value">${stats.totalValue.toLocaleString()} ₳</span><span class="label">Toplam Değer</span></div></div>
            </div>
            
            <!-- Ana İçerik Grid: Sol Kargolar, Sağ Haberler -->
            <div class="logistics-main-grid">
                <!-- Sol: Kargo Listesi -->
                <div class="logistics-shipments-area">
                    <div class="transport-tabs">
                        <button class="transport-tab active" data-transport="all"><i class="fa-solid fa-list"></i> Tümü</button>
                        ${Object.values(TRANSPORT_TYPES).map(t => `
                            <button class="transport-tab" data-transport="${t.id}"><i class="${t.icon}" style="color: ${t.color}"></i> ${t.name}</button>
                        `).join('')}
                    </div>
                    
                    <div class="shipments-grid" id="shipments-grid">
                        ${shipments.map(shipment => renderShipmentCard(shipment)).join('')}
                    </div>
                </div>

                <!-- Sağ: Dünya Lojistik Haberleri -->
                <aside class="logistics-news-sidebar">
                    <div class="sidebar-header">
                        <h3><i class="fa-solid fa-globe"></i> Dünya Lojistik Haberleri</h3>
                    </div>
                    <div class="logistics-news-list">
                        ${renderLogisticsNews()}
                    </div>
                </aside>
            </div>
        </div>
    `;
}

function renderLogisticsNews() {
    const newsItems = [
        {
            title: 'Süveyş Kanalı\'nda Trafik Normale Döndü',
            summary: 'Geçici kapatmanın ardından kanal trafiği yeniden açıldı.',
            time: '2 saat önce',
            icon: 'fa-ship',
            color: '#0ea5e9',
            impact: 'positive'
        },
        {
            title: 'Avrupa\'da Yakıt Fiyatları Yükseliyor',
            summary: 'Kara taşımacılığı maliyetleri %12 arttı.',
            time: '5 saat önce',
            icon: 'fa-gas-pump',
            color: '#f59e0b',
            impact: 'negative'
        },
        {
            title: 'Çin Limanlarında Yoğunluk Azaldı',
            summary: 'Bekleme süreleri 3 günden 1 güne düştü.',
            time: '8 saat önce',
            icon: 'fa-anchor',
            color: '#22c55e',
            impact: 'positive'
        },
        {
            title: 'Hava Kargo Kapasitesi Genişliyor',
            summary: 'Yeni rotalar Asya-Avrupa hattını güçlendiriyor.',
            time: '12 saat önce',
            icon: 'fa-plane',
            color: '#8b5cf6',
            impact: 'positive'
        },
        {
            title: 'Demiryolu Yatırımları Hızlandı',
            summary: 'Orta Koridor projesi %40 ilerleme kaydetti.',
            time: '1 gün önce',
            icon: 'fa-train',
            color: '#10b981',
            impact: 'positive'
        }
    ];

    return newsItems.map(news => `
        <div class="logistics-news-item">
            <div class="news-icon" style="background: ${news.color}20; color: ${news.color}">
                <i class="fa-solid ${news.icon}"></i>
            </div>
            <div class="news-content">
                <h4>${news.title}</h4>
                <p>${news.summary}</p>
                <div class="news-meta">
                    <span class="news-time">${news.time}</span>
                    <span class="news-impact ${news.impact}">
                        <i class="fa-solid fa-${news.impact === 'positive' ? 'arrow-up' : 'arrow-down'}"></i>
                        ${news.impact === 'positive' ? 'Olumlu' : 'Olumsuz'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderShipmentCard(shipment) {
    const transport = getTransportTypeInfo(shipment.transportType);
    const status = getStatusInfo(shipment.status);

    return `
        <div class="shipment-card" data-shipment-id="${shipment.id}">
            <div class="card-header">
                <div class="transport-badge" style="background: ${transport.color}20; color: ${transport.color}">
                    <i class="${transport.icon}"></i> ${transport.name}
                </div>
                <div class="status-badge" style="background: ${status.color}20; color: ${status.color}">
                    <i class="${status.icon}"></i> ${status.name}
                </div>
            </div>
            <div class="tracking-id">${shipment.trackingId}</div>
            <div class="route-info">
                <div class="route-point origin"><i class="fa-solid fa-circle"></i><span>${shipment.origin}</span></div>
                <div class="route-line"><div class="route-progress" style="width: ${shipment.progress}%; background: ${transport.color}"></div></div>
                <div class="route-point destination"><i class="fa-solid fa-location-dot"></i><span>${shipment.destination}</span></div>
            </div>
            <div class="shipment-details">
                <div class="detail"><i class="fa-solid fa-cube"></i><span>${shipment.productName}</span></div>
                <div class="detail"><i class="fa-solid fa-boxes-stacked"></i><span>${shipment.quantity} adet</span></div>
                <div class="detail"><i class="fa-solid fa-weight-hanging"></i><span>${shipment.weight} kg</span></div>
            </div>
            <div class="progress-section">
                <div class="progress-bar"><div class="progress-fill" style="width: ${shipment.progress}%; background: linear-gradient(90deg, ${transport.color}, ${transport.color}aa)"></div></div>
                <div class="progress-info"><span>${shipment.progress}% tamamlandı</span><span>Tahmini: ${new Date(shipment.estimatedDelivery).toLocaleDateString('tr-TR')}</span></div>
            </div>
            <div class="card-actions">
                <button class="btn-sm" data-action="track-shipment" data-id="${shipment.id}"><i class="fa-solid fa-location-crosshairs"></i> Takip Et</button>
                <button class="btn-sm secondary" data-action="shipment-details" data-id="${shipment.id}"><i class="fa-solid fa-info-circle"></i> Detaylar</button>
            </div>
        </div>
    `;
}
