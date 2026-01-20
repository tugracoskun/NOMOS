// HAVALİMANI SİSTEMİ - Flightradar24 Tarzı
// Havalimanı marker'ları, detay paneli, uçuş listeleri

let airportMarkers = [];
let mapInstance = null;

// Havalimanları (her ülkede 1 tane)
export const AIRPORTS = [
    {
        id: 'IST',
        name: 'Istanbul Havalimanı',
        city: 'Istanbul',
        country: 'Türkiye',
        countryCode: 'TR',
        lat: 41.0082,
        lng: 28.9784,
        capacity: 200, // Günlük uçuş kapasitesi
        runways: 3
    },
    {
        id: 'ATH',
        name: 'Athens International Airport',
        city: 'Athens',
        country: 'Yunanistan',
        countryCode: 'GR',
        lat: 37.9838,
        lng: 23.7275,
        capacity: 150,
        runways: 2
    },
    {
        id: 'FCO',
        name: 'Leonardo da Vinci Airport',
        city: 'Rome',
        country: 'İtalya',
        countryCode: 'IT',
        lat: 41.9028,
        lng: 12.4964,
        capacity: 180,
        runways: 4
    },
    {
        id: 'CDG',
        name: 'Charles de Gaulle Airport',
        city: 'Paris',
        country: 'Fransa',
        countryCode: 'FR',
        lat: 48.8566,
        lng: 2.3522,
        capacity: 200,
        runways: 4
    },
    {
        id: 'LHR',
        name: 'Heathrow Airport',
        city: 'London',
        country: 'İngiltere',
        countryCode: 'GB',
        lat: 51.5074,
        lng: -0.1278,
        capacity: 220,
        runways: 2
    },
    {
        id: 'DXB',
        name: 'Dubai International Airport',
        city: 'Dubai',
        country: 'BAE',
        countryCode: 'AE',
        lat: 25.2048,
        lng: 55.2708,
        capacity: 250,
        runways: 2
    },
    {
        id: 'CAI',
        name: 'Cairo International Airport',
        city: 'Cairo',
        country: 'Mısır',
        countryCode: 'EG',
        lat: 30.0444,
        lng: 31.2357,
        capacity: 140,
        runways: 3
    }
];

// Havalimanlarını haritaya ekle
export function initAirports(map, activeFlights) {
    mapInstance = map;

    AIRPORTS.forEach(airport => {
        createAirportMarker(airport, activeFlights);
    });

    // Zoom kontrolü - 7.0'dan küçükse havalimanlarını gizle
    updateAirportVisibility();
    map.on('zoomend', updateAirportVisibility);

    console.log(`🛫 ${AIRPORTS.length} airports initialized`);
}

// Zoom seviyesine göre havalimanlarını göster/gizle
function updateAirportVisibility() {
    const currentZoom = mapInstance.getZoom();
    const shouldShow = currentZoom >= 7.0;

    airportMarkers.forEach(({ marker }) => {
        if (shouldShow) {
            if (!mapInstance.hasLayer(marker)) {
                marker.addTo(mapInstance);
            }
        } else {
            if (mapInstance.hasLayer(marker)) {
                mapInstance.removeLayer(marker);
            }
        }
    });
}

// Havalimanı marker'ı oluştur
function createAirportMarker(airport, activeFlights) {
    const icon = L.divIcon({
        className: 'airport-marker',
        html: `
            <div class="airport-icon">
                <i class="fa-solid fa-plane-circle-check"></i>
            </div>
            <div class="airport-label">${airport.id}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    const marker = L.marker([airport.lat, airport.lng], { icon });

    // Zoom kontrolüne göre ekle
    const currentZoom = mapInstance.getZoom();
    if (currentZoom >= 7.0) {
        marker.addTo(mapInstance);
    }

    marker.on('click', () => openAirportPanel(airport, activeFlights));

    airportMarkers.push({ airportId: airport.id, marker });
}

// Havalimanı detay panelini aç
function openAirportPanel(airport, activeFlights) {
    closeAirportPanel();

    // Bu havalimanından kalkan ve inen uçuşları bul
    const departures = activeFlights.filter(f => f.origin === airport.city);
    const arrivals = activeFlights.filter(f => f.destination === airport.city);

    const panel = document.createElement('div');
    panel.id = 'airport-detail-panel';
    panel.className = 'airport-panel';

    // Kalkış listesi
    const departuresHTML = departures.length > 0 ? departures.map(flight => `
        <div class="flight-list-item departure">
            <div class="flight-list-time">${flight.departureTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="flight-list-info">
                <div class="flight-list-number">${flight.flightNumber}</div>
                <div class="flight-list-route">→ ${flight.destination}</div>
            </div>
            <div class="flight-list-status ${flight.progress > 0 ? 'departed' : 'scheduled'}">
                ${flight.progress > 0 ? 'Kalktı' : 'Zamanında'}
            </div>
        </div>
    `).join('') : '<div class="empty-flights">Kalkış yok</div>';

    // İniş listesi
    const arrivalsHTML = arrivals.length > 0 ? arrivals.map(flight => `
        <div class="flight-list-item arrival">
            <div class="flight-list-time">${flight.arrivalTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="flight-list-info">
                <div class="flight-list-number">${flight.flightNumber}</div>
                <div class="flight-list-route">${flight.origin} →</div>
            </div>
            <div class="flight-list-status ${flight.progress >= 100 ? 'landed' : 'en-route'}">
                ${flight.progress >= 100 ? 'İndi' : `${Math.round(flight.progress)}%`}
            </div>
        </div>
    `).join('') : '<div class="empty-flights">İniş yok</div>';

    panel.innerHTML = `
        <div class="airport-panel-header">
            <div class="airport-header-top">
                <div class="airport-code">${airport.id}</div>
                <button class="airport-panel-close" onclick="document.getElementById('airport-detail-panel').remove()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="airport-name">${airport.name}</div>
            <div class="airport-location">
                <span class="country-flag">${getCountryFlag(airport.countryCode)}</span>
                ${airport.city}, ${airport.country}
            </div>
        </div>
        
        <div class="airport-panel-body">
            <!-- İstatistikler -->
            <div class="airport-stats">
                <div class="airport-stat">
                    <i class="fa-solid fa-plane-departure"></i>
                    <div class="stat-info">
                        <span class="stat-value">${departures.length}</span>
                        <span class="stat-label">Kalkış</span>
                    </div>
                </div>
                <div class="airport-stat">
                    <i class="fa-solid fa-plane-arrival"></i>
                    <div class="stat-info">
                        <span class="stat-value">${arrivals.length}</span>
                        <span class="stat-label">İniş</span>
                    </div>
                </div>
                <div class="airport-stat">
                    <i class="fa-solid fa-road"></i>
                    <div class="stat-info">
                        <span class="stat-value">${airport.runways}</span>
                        <span class="stat-label">Pist</span>
                    </div>
                </div>
                <div class="airport-stat">
                    <i class="fa-solid fa-gauge-high"></i>
                    <div class="stat-info">
                        <span class="stat-value">${airport.capacity}</span>
                        <span class="stat-label">Kapasite</span>
                    </div>
                </div>
            </div>
            
            <!-- Uçuş Listeleri -->
            <div class="airport-tabs">
                <button class="airport-tab active" data-tab="departures">
                    <i class="fa-solid fa-plane-departure"></i>
                    Kalkışlar (${departures.length})
                </button>
                <button class="airport-tab" data-tab="arrivals">
                    <i class="fa-solid fa-plane-arrival"></i>
                    İnişler (${arrivals.length})
                </button>
            </div>
            
            <div class="airport-tab-content">
                <div class="tab-pane active" id="departures-pane">
                    <div class="flight-list">
                        ${departuresHTML}
                    </div>
                </div>
                <div class="tab-pane" id="arrivals-pane">
                    <div class="flight-list">
                        ${arrivalsHTML}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    // Tab switching
    panel.querySelectorAll('.airport-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            panel.querySelectorAll('.airport-tab').forEach(t => t.classList.remove('active'));
            panel.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            panel.querySelector(`#${tabName}-pane`).classList.add('active');
        });
    });

    setTimeout(() => panel.classList.add('open'), 10);
}

// Ülke bayrağı emoji
function getCountryFlag(countryCode) {
    const flags = {
        'TR': '🇹🇷',
        'GR': '🇬🇷',
        'IT': '🇮🇹',
        'FR': '🇫🇷',
        'GB': '🇬🇧',
        'AE': '🇦🇪',
        'EG': '🇪🇬'
    };
    return flags[countryCode] || '🌍';
}

// Panel kapat
function closeAirportPanel() {
    const panel = document.getElementById('airport-detail-panel');
    if (panel) {
        panel.classList.remove('open');
        setTimeout(() => panel.remove(), 300);
    }
}

// Havalimanı ID'sine göre bilgi al
export function getAirportByCity(cityName) {
    return AIRPORTS.find(a => a.city === cityName);
}

// Temizlik
export function clearAirports() {
    airportMarkers.forEach(({ marker }) => {
        if (mapInstance) {
            mapInstance.removeLayer(marker);
        }
    });
    airportMarkers = [];
}
