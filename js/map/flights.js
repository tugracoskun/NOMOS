// UÇAK TAKİP SİSTEMİ - Oyun İçi Havacılık
// Ticari ve kişisel uçuşlar, kargo taşımacılığı

let activeFlights = [];
let flightMarkers = [];
let flightUpdateInterval = null;
let mapInstance = null;

// Oyun içi havayolları (gerçek markalar değil)
const AIRLINES = [
    { code: 'NA', name: 'Nomos Air', color: '#3b82f6', type: 'passenger' },
    { code: 'SC', name: 'Sky Cargo', color: '#f97316', type: 'cargo' },
    { code: 'EA', name: 'Empire Airways', color: '#8b5cf6', type: 'passenger' },
    { code: 'GF', name: 'Global Freight', color: '#ef4444', type: 'cargo' },
    { code: 'PA', name: 'Phoenix Air', color: '#06b6d4', type: 'passenger' },
    { code: 'TC', name: 'Trade Connect', color: '#22c55e', type: 'cargo' },
    { code: 'VIP', name: 'Devlet Uçağı', color: '#fbbf24', type: 'vip' }
];

// Uçak tipleri
const AIRCRAFT_TYPES = {
    passenger: ['Boeing 737', 'Airbus A320', 'Boeing 787', 'Airbus A350'],
    cargo: ['Boeing 747F', 'Airbus A330F', 'Boeing 777F'],
    private: ['Gulfstream G650', 'Bombardier Global', 'Cessna Citation']
};

// Kargo tipleri
const CARGO_TYPES = [
    'Elektronik', 'Tekstil', 'Gıda', 'Otomotiv Parçaları',
    'İlaç', 'Makine', 'Kimyasal', 'Mobilya'
];

// Şehirler - Havalimanlı olanlar
const CITIES = [
    { name: 'Istanbul', lat: 41.0082, lng: 28.9784, hasAirport: true, country: 'Türkiye' },
    { name: 'Ankara', lat: 39.9334, lng: 32.8597, hasAirport: false, country: 'Türkiye' },
    { name: 'Izmir', lat: 38.4237, lng: 27.1428, hasAirport: false, country: 'Türkiye' },
    { name: 'Antalya', lat: 36.8969, lng: 30.7133, hasAirport: false, country: 'Türkiye' },
    { name: 'Athens', lat: 37.9838, lng: 23.7275, hasAirport: true, country: 'Yunanistan' },
    { name: 'Rome', lat: 41.9028, lng: 12.4964, hasAirport: true, country: 'İtalya' },
    { name: 'Paris', lat: 48.8566, lng: 2.3522, hasAirport: true, country: 'Fransa' },
    { name: 'London', lat: 51.5074, lng: -0.1278, hasAirport: true, country: 'İngiltere' },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, hasAirport: true, country: 'BAE' },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357, hasAirport: true, country: 'Mısır' }
];

// Rastgele uçuş oluştur
function generateRandomFlight(index) {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const flightNumber = `${airline.code}${Math.floor(Math.random() * 900) + 100}`;

    // Rastgele başlangıç ve bitiş şehirleri (sadece havalimanlı olanlar)
    const airportCities = CITIES.filter(c => c.hasAirport);
    const origin = airportCities[Math.floor(Math.random() * airportCities.length)];
    let destination;
    do {
        destination = airportCities[Math.floor(Math.random() * airportCities.length)];
    } while (destination.name === origin.name);

    // Uçuş süresi hesapla (basit)
    const distance = Math.sqrt(
        Math.pow(destination.lat - origin.lat, 2) +
        Math.pow(destination.lng - origin.lng, 2)
    );
    const flightDuration = Math.floor(distance * 30) + 60; // dakika

    const now = new Date();
    const departureTime = new Date(now.getTime() - Math.random() * flightDuration * 60000);
    const arrivalTime = new Date(departureTime.getTime() + flightDuration * 60000);

    const flight = {
        id: `flight_${index}_${Date.now()}`,
        flightNumber,
        airline: airline.name,
        airlineCode: airline.code,
        color: airline.color,
        type: airline.type,
        aircraft: airline.type === 'cargo'
            ? AIRCRAFT_TYPES.cargo[Math.floor(Math.random() * AIRCRAFT_TYPES.cargo.length)]
            : airline.type === 'vip'
                ? AIRCRAFT_TYPES.private[Math.floor(Math.random() * AIRCRAFT_TYPES.private.length)]
                : AIRCRAFT_TYPES.passenger[Math.floor(Math.random() * AIRCRAFT_TYPES.passenger.length)],
        origin: origin.name,
        destination: destination.name,
        originLat: origin.lat,
        originLng: origin.lng,
        destLat: destination.lat,
        destLng: destination.lng,
        currentLat: origin.lat,
        currentLng: origin.lng,
        heading: 0,
        progress: 0,
        speed: 480, // Sabit hız - 480 knots
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        status: 'En Route'
    };

    // Tip bazlı detaylar
    if (airline.type === 'cargo') {
        flight.cargo = {
            type: CARGO_TYPES[Math.floor(Math.random() * CARGO_TYPES.length)],
            weight: Math.floor(Math.random() * 50) + 10, // ton
            value: Math.floor(Math.random() * 500000) + 50000 // $
        };
    } else if (airline.type === 'vip') {
        flight.vip = {
            official: ['Cumhurbaşkanı', 'Başbakan', 'Dışişleri Bakanı', 'Savunma Bakanı'][Math.floor(Math.random() * 4)],
            destination_purpose: ['Resmi Ziyaret', 'Diplomatik Görüşme', 'Zirve Toplantısı'][Math.floor(Math.random() * 3)]
        };
    } else {
        flight.passengers = Math.floor(Math.random() * 150) + 50;
    }

    flight.heading = calculateHeading(
        flight.originLat, flight.originLng,
        flight.destLat, flight.destLng
    );

    return flight;
}

// Heading hesapla
function calculateHeading(lat1, lng1, lat2, lng2) {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const y = Math.sin(dLng) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
        Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLng);
    const heading = Math.atan2(y, x) * 180 / Math.PI;
    return (heading + 360) % 360;
}

// Uçuş sistemini başlat
export function initFlightTracking(map) {
    mapInstance = map;

    // İlk uçuşları oluştur (8 uçak)
    for (let i = 0; i < 8; i++) {
        const flight = generateRandomFlight(i);
        activeFlights.push(flight);
        createFlightMarker(flight);
    }

    // Zoom kontrolü - 6.0'dan küçükse uçakları gizle
    updateFlightVisibility();
    map.on('zoomend', updateFlightVisibility);

    // Smooth güncelleme (her 100ms)
    flightUpdateInterval = setInterval(updateFlights, 100);

    console.log(`✈️ Flight tracking initialized with ${activeFlights.length} flights`);
}

// Zoom seviyesine göre uçakları göster/gizle
function updateFlightVisibility() {
    const currentZoom = mapInstance.getZoom();
    const shouldShow = currentZoom >= 6.0;

    flightMarkers.forEach(({ marker }) => {
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

// Uçak marker'ı oluştur
function createFlightMarker(flight) {
    // Tüm uçaklar aynı icon (fa-plane)
    const flightTypeText = flight.type === 'cargo' ? 'Kargo Uçağı' : flight.type === 'vip' ? 'Devlet Uçağı' : 'Ticari Uçak';

    const icon = L.divIcon({
        className: 'flight-marker',
        html: `
            <div class="flight-icon-wrapper" style="transform: rotate(${flight.heading - 45}deg)">
                <i class="fa-solid fa-plane" style="color: ${flight.color}"></i>
            </div>
            <div class="flight-tooltip">
                <div class="tooltip-type">${flightTypeText}</div>
                <div class="tooltip-route">${flight.origin} → ${flight.destination}</div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    const marker = L.marker([flight.currentLat, flight.currentLng], { icon });

    // Zoom kontrolüne göre ekle
    const currentZoom = mapInstance.getZoom();
    if (currentZoom >= 6.0) {
        marker.addTo(mapInstance);
    }

    marker.on('click', () => openFlightPanel(flight));

    flightMarkers.push({ flightId: flight.id, marker });
}

// Uçuşları güncelle (smooth)
function updateFlights() {
    activeFlights.forEach((flight, index) => {
        // Her güncelleme %0.2 ilerleme (100ms * 500 = 50 saniye tam uçuş)
        flight.progress += 0.2;

        if (flight.progress >= 100) {
            // Uçuş tamamlandı, yeni uçuş oluştur
            const newFlight = generateRandomFlight(index);

            // Eski marker'ı kaldır
            const markerObj = flightMarkers.find(m => m.flightId === flight.id);
            if (markerObj) {
                mapInstance.removeLayer(markerObj.marker);
            }

            activeFlights[index] = newFlight;
            createFlightMarker(newFlight);

            const markerIndex = flightMarkers.findIndex(m => m.flightId === flight.id);
            if (markerIndex !== -1) {
                flightMarkers.splice(markerIndex, 1);
            }
        } else {
            // Smooth pozisyon güncelleme
            const t = flight.progress / 100;
            flight.currentLat = flight.originLat + (flight.destLat - flight.originLat) * t;
            flight.currentLng = flight.originLng + (flight.destLng - flight.originLng) * t;

            // Marker'ı güncelle
            const markerObj = flightMarkers.find(m => m.flightId === flight.id);
            if (markerObj) {
                markerObj.marker.setLatLng([flight.currentLat, flight.currentLng]);
            }
        }
    });
}

// Uçuş detay panelini aç
function openFlightPanel(flight) {
    closeFlightPanel();

    const panel = document.createElement('div');
    panel.id = 'flight-detail-panel';
    panel.className = 'flight-panel';

    // Zaman formatla
    const formatTime = (date) => {
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    // Tip bazlı bilgi
    let detailsHTML = '';

    if (flight.type === 'cargo') {
        detailsHTML = `
            <div class="cargo-info">
                <div class="cargo-header">
                    <i class="fa-solid fa-boxes-stacked"></i>
                    <span>Kargo Detayları</span>
                </div>
                <div class="cargo-details">
                    <div class="cargo-item">
                        <span class="cargo-label">Yük Tipi</span>
                        <span class="cargo-value">${flight.cargo.type}</span>
                    </div>
                    <div class="cargo-item">
                        <span class="cargo-label">Miktar</span>
                        <span class="cargo-value">${flight.cargo.weight} ton</span>
                    </div>
                    <div class="cargo-item">
                        <span class="cargo-label">Değer</span>
                        <span class="cargo-value">$${flight.cargo.value.toLocaleString()}</span>
                    </div>
                    <div class="cargo-item">
                        <span class="cargo-label">Gönderen</span>
                        <span class="cargo-value">${flight.origin}</span>
                    </div>
                    <div class="cargo-item">
                        <span class="cargo-label">Alıcı</span>
                        <span class="cargo-value">${flight.destination}</span>
                    </div>
                </div>
            </div>
        `;
    } else if (flight.type === 'vip') {
        detailsHTML = `
            <div class="vip-info">
                <div class="vip-header">
                    <i class="fa-solid fa-crown"></i>
                    <span>Devlet Uçuşu</span>
                </div>
                <div class="vip-details">
                    <div class="vip-item">
                        <span class="vip-label">Yetkili</span>
                        <span class="vip-value">${flight.vip.official}</span>
                    </div>
                    <div class="vip-item">
                        <span class="vip-label">Amaç</span>
                        <span class="vip-value">${flight.vip.destination_purpose}</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        detailsHTML = `
            <div class="passenger-info">
                <div class="passenger-stat">
                    <i class="fa-solid fa-users"></i>
                    <div class="stat-info">
                        <span class="stat-label">Yolcu Sayısı</span>
                        <span class="stat-value">${flight.passengers} kişi</span>
                    </div>
                </div>
            </div>
        `;
    }

    panel.innerHTML = `
        <div class="flight-panel-header">
            <div class="flight-header-left">
                <div class="flight-number">${flight.flightNumber}</div>
                <div class="flight-airline">${flight.airline}</div>
                <div class="flight-type-badge ${flight.type}">
                    <i class="fa-solid ${flight.type === 'cargo' ? 'fa-box' : flight.type === 'vip' ? 'fa-crown' : 'fa-user'}"></i>
                    ${flight.type === 'cargo' ? 'Kargo' : flight.type === 'vip' ? 'VIP' : 'Yolcu'}
                </div>
            </div>
            <button class="flight-panel-close" onclick="document.getElementById('flight-detail-panel').remove()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        
        <div class="flight-panel-body">
            <div class="flight-route">
                <div class="route-point">
                    <i class="fa-solid fa-plane-departure"></i>
                    <span class="route-city">${flight.origin}</span>
                    <span class="route-time">${formatTime(flight.departureTime)}</span>
                </div>
                <div class="route-line">
                    <div class="route-progress" style="width: ${flight.progress}%"></div>
                    <div class="route-plane" style="left: ${flight.progress}%">
                        <i class="fa-solid fa-plane"></i>
                    </div>
                </div>
                <div class="route-point">
                    <i class="fa-solid fa-plane-arrival"></i>
                    <span class="route-city">${flight.destination}</span>
                    <span class="route-time">${formatTime(flight.arrivalTime)}</span>
                </div>
            </div>
            
            ${detailsHTML}
            
            <div class="flight-stats">
                <div class="flight-stat">
                    <i class="fa-solid fa-plane"></i>
                    <div class="stat-info">
                        <span class="stat-label">Uçak Tipi</span>
                        <span class="stat-value">${flight.type === 'cargo' ? 'Kargo Uçağı' : 'Ticari Uçak'}</span>
                    </div>
                </div>

            </div>
            
            <div class="flight-status">
                <span class="status-badge en-route">
                    <i class="fa-solid fa-circle"></i>
                    ${flight.status}
                </span>
                <span class="progress-text">${Math.round(flight.progress)}% tamamlandı</span>
            </div>
        </div>
    `;

    document.body.appendChild(panel);
    setTimeout(() => panel.classList.add('open'), 10);
}

// Panel kapat
function closeFlightPanel() {
    const panel = document.getElementById('flight-detail-panel');
    if (panel) {
        panel.classList.remove('open');
        setTimeout(() => panel.remove(), 300);
    }
}

// Temizlik
export function stopFlightTracking() {
    if (flightUpdateInterval) {
        clearInterval(flightUpdateInterval);
    }

    flightMarkers.forEach(({ marker }) => {
        if (mapInstance) {
            mapInstance.removeLayer(marker);
        }
    });

    activeFlights = [];
    flightMarkers = [];

    console.log('✈️ Flight tracking stopped');
}
