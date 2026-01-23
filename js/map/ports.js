// LİMAN SİSTEMİ - Havalimanı sistemi gibi
// Haritada liman markerları + detay paneli

let portMarkers = [];
let mapInstance = null;
let activeShipsRef = null;

// ===== LİMANLAR - ROTA KESİŞİM NOKTALARINDA =====
export const PORTS = [
    // Türkiye - İstanbul (Boğaz çıkışı - Karadeniz rotaları başlangıcı)
    {
        id: 'IST_PORT', code: 'IST', name: 'İstanbul Limanı', city: 'İstanbul', country: 'Türkiye', flag: '🇹🇷',
        lat: 41.20, lng: 29.10, capacity: 150, docks: 8
    },
    // Türkiye - İzmir (Ege rotaları başlangıcı)
    {
        id: 'IZM_PORT', code: 'IZM', name: 'İzmir Limanı', city: 'İzmir', country: 'Türkiye', flag: '🇹🇷',
        lat: 38.44, lng: 27.14, capacity: 100, docks: 5
    },

    // Yunanistan - Pire (Ege/Akdeniz kavşağı)
    {
        id: 'PIR_PORT', code: 'PIR', name: 'Pire Limanı', city: 'Atina', country: 'Yunanistan', flag: '🇬🇷',
        lat: 37.94, lng: 23.65, capacity: 120, docks: 6
    },

    // Mısır - İskenderiye (Doğu Akdeniz)
    {
        id: 'ALE_PORT', code: 'ALE', name: 'İskenderiye Limanı', city: 'İskenderiye', country: 'Mısır', flag: '🇪🇬',
        lat: 31.21, lng: 29.89, capacity: 180, docks: 10
    },

    // Ukrayna - Odessa (Kuzey Karadeniz)
    {
        id: 'ODE_PORT', code: 'ODE', name: 'Odessa Limanı', city: 'Odessa', country: 'Ukrayna', flag: '🇺🇦',
        lat: 46.47, lng: 30.73, capacity: 140, docks: 7
    },

    // Bulgaristan - Varna (Batı Karadeniz)
    {
        id: 'VAR_PORT', code: 'VAR', name: 'Varna Limanı', city: 'Varna', country: 'Bulgaristan', flag: '🇧🇬',
        lat: 43.20, lng: 27.92, capacity: 80, docks: 4
    },

    // İtalya - Cenova (Batı Akdeniz kavşağı)
    {
        id: 'GEN_PORT', code: 'GEN', name: 'Cenova Limanı', city: 'Cenova', country: 'İtalya', flag: '🇮🇹',
        lat: 44.42, lng: 8.94, capacity: 160, docks: 9
    },

    // Fransa - Marsilya
    {
        id: 'MRS_PORT', code: 'MRS', name: 'Marsilya Limanı', city: 'Marsilya', country: 'Fransa', flag: '🇫🇷',
        lat: 43.29, lng: 5.36, capacity: 200, docks: 12
    },

    // İspanya - Barselona
    {
        id: 'BCN_PORT', code: 'BCN', name: 'Barselona Limanı', city: 'Barselona', country: 'İspanya', flag: '🇪🇸',
        lat: 41.38, lng: 2.18, capacity: 170, docks: 8
    }
];

// Liman sistemini başlat
export function initPorts(map, getActiveShips) {
    mapInstance = map;
    activeShipsRef = getActiveShips;

    // Zoom kontrolü
    updatePortVisibility();
    map.on('zoomend', updatePortVisibility);

    console.log(`⚓ Port system initialized with ${PORTS.length} ports`);
}

// Zoom kontrolü
function updatePortVisibility() {
    const currentZoom = mapInstance.getZoom();
    const shouldShow = currentZoom >= 6.0;

    if (shouldShow && portMarkers.length === 0) {
        // Liman markerlarını oluştur
        PORTS.forEach(port => createPortMarker(port));
    } else if (!shouldShow && portMarkers.length > 0) {
        // Markerları kaldır
        portMarkers.forEach(({ marker }) => mapInstance.removeLayer(marker));
        portMarkers = [];
    }
}

// Liman marker oluştur
function createPortMarker(port) {
    const icon = L.divIcon({
        className: 'port-marker',
        html: `
            <div class="port-icon">
                <i class="fa-solid fa-anchor"></i>
            </div>
            <div class="port-label">${port.code}</div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const marker = L.marker([port.lat, port.lng], {
        icon,
        zIndexOffset: 500
    });

    marker.addTo(mapInstance);

    marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        openPortPanel(port);
    });

    portMarkers.push({ portId: port.id, marker });
}

// Liman paneli aç
function openPortPanel(port) {
    closePortPanel();

    // Bu limandan kalkan/inen gemileri bul
    const ships = activeShipsRef ? activeShipsRef() : [];
    const departingShips = ships.filter(s => s.originPort?.code === port.code);
    const arrivingShips = ships.filter(s => s.destPort?.code === port.code);

    const panel = document.createElement('div');
    panel.id = 'port-detail-panel';
    panel.className = 'port-panel active';

    panel.innerHTML = `
        <div class="port-panel-header">
            <button class="close-panel" onclick="this.parentElement.parentElement.remove()">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="port-code">${port.code}</div>
            <div class="port-name">${port.name}</div>
            <div class="port-location">${port.flag} ${port.city}, ${port.country}</div>
        </div>
        
        <div class="port-stats">
            <div class="port-stat">
                <i class="fa-solid fa-ship"></i>
                <span class="stat-value">${departingShips.length}</span>
                <span class="stat-label">KALKIŞ</span>
            </div>
            <div class="port-stat">
                <i class="fa-solid fa-anchor"></i>
                <span class="stat-value">${arrivingShips.length}</span>
                <span class="stat-label">VARIŞ</span>
            </div>
            <div class="port-stat">
                <i class="fa-solid fa-warehouse"></i>
                <span class="stat-value">${port.docks}</span>
                <span class="stat-label">RIHITIM</span>
            </div>
            <div class="port-stat">
                <i class="fa-solid fa-boxes-stacked"></i>
                <span class="stat-value">${port.capacity}</span>
                <span class="stat-label">KAPASİTE</span>
            </div>
        </div>
        
        <div class="port-tabs">
            <button class="port-tab active" data-tab="departures">
                <i class="fa-solid fa-arrow-up-from-water-pump"></i> Kalkışlar (${departingShips.length})
            </button>
            <button class="port-tab" data-tab="arrivals">
                <i class="fa-solid fa-arrow-down-to-arc"></i> Varışlar (${arrivingShips.length})
            </button>
        </div>
        
        <div class="port-ship-list" id="port-ship-list">
            ${departingShips.length > 0 ? departingShips.map(ship => `
                <div class="ship-list-item departure">
                    <div class="ship-time">${Math.round(ship.progress)}%</div>
                    <div class="ship-info">
                        <span class="ship-code">${ship.name}</span>
                        <span class="ship-dest">→ ${ship.destPort?.city || 'Bilinmiyor'}</span>
                    </div>
                    <div class="ship-cargo">${ship.cargo?.icon || '📦'}</div>
                </div>
            `).join('') : '<div class="no-ships">Kalkış yapan gemi yok</div>'}
        </div>
    `;

    document.body.appendChild(panel);

    // Tab event'leri
    panel.querySelectorAll('.port-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            panel.querySelectorAll('.port-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabType = tab.dataset.tab;
            const listContainer = document.getElementById('port-ship-list');

            if (tabType === 'departures') {
                listContainer.innerHTML = departingShips.length > 0 ? departingShips.map(ship => `
                    <div class="ship-list-item departure">
                        <div class="ship-time">${Math.round(ship.progress)}%</div>
                        <div class="ship-info">
                            <span class="ship-code">${ship.name}</span>
                            <span class="ship-dest">→ ${ship.destPort?.city || 'Bilinmiyor'}</span>
                        </div>
                        <div class="ship-cargo">${ship.cargo?.icon || '📦'}</div>
                    </div>
                `).join('') : '<div class="no-ships">Kalkış yapan gemi yok</div>';
            } else {
                listContainer.innerHTML = arrivingShips.length > 0 ? arrivingShips.map(ship => `
                    <div class="ship-list-item arrival">
                        <div class="ship-time">${Math.round(100 - ship.progress)}%</div>
                        <div class="ship-info">
                            <span class="ship-code">${ship.name}</span>
                            <span class="ship-dest">← ${ship.originPort?.city || 'Bilinmiyor'}</span>
                        </div>
                        <div class="ship-cargo">${ship.cargo?.icon || '📦'}</div>
                    </div>
                `).join('') : '<div class="no-ships">Varış yapan gemi yok</div>';
            }
        });
    });
}

function closePortPanel() {
    document.getElementById('port-detail-panel')?.remove();
}

// Temizlik
export function clearPorts() {
    portMarkers.forEach(({ marker }) => {
        if (mapInstance) mapInstance.removeLayer(marker);
    });
    portMarkers = [];
}
