// GELİŞMİŞ UÇAK SİSTEMİ V2 - Havalimanı Bazlı
// Gerçekçi uçuş yolları, doğru rotasyon, Bezier curves

import { AIRPORTS } from './airports.js';

let activeFlights = [];
let flightMarkers = [];
let flightPaths = [];
let flightUpdateInterval = null;
let mapInstance = null;

// Havayolları
const AIRLINES = [
    { code: 'NA', name: 'Nomos Air', color: '#3b82f6', type: 'passenger' },
    { code: 'SC', name: 'Sky Cargo', color: '#f97316', type: 'cargo' },
    { code: 'EA', name: 'Empire Airways', color: '#8b5cf6', type: 'passenger' },
    { code: 'GF', name: 'Global Freight', color: '#ef4444', type: 'cargo' },
    { code: 'PA', name: 'Phoenix Air', color: '#06b6d4', type: 'passenger' },
    { code: 'TC', name: 'Trade Connect', color: '#22c55e', type: 'cargo' },
    { code: 'VIP', name: 'Devlet Uçağı', color: '#fbbf24', type: 'vip' }
];

// Kargo tipleri
const CARGO_TYPES = [
    'Elektronik', 'Tekstil', 'Gıda', 'Otomotiv Parçaları',
    'İlaç', 'Makine', 'Kimyasal', 'Mobilya'
];

// Rastgele uçuş oluştur - HAVALİMANI BAZLI
function generateRandomFlight(index) {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const flightNumber = `${airline.code}${Math.floor(Math.random() * 900) + 100}`;

    // Rastgele kalkış ve varış HAVALİMANI seç
    const originAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    let destAirport;
    do {
        destAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    } while (destAirport.id === originAirport.id);

    // Uçuş süresi hesapla
    const distance = getDistance(
        originAirport.lat, originAirport.lng,
        destAirport.lat, destAirport.lng
    );
    const flightDuration = Math.floor(distance * 2) + 30; // dakika

    const now = new Date();
    const departureTime = new Date(now.getTime() - Math.random() * flightDuration * 60000);
    const arrivalTime = new Date(departureTime.getTime() + flightDuration * 60000);

    // Bezier curve için kontrol noktası (uçuş yolu eğrisi)
    const controlPoint = calculateControlPoint(
        originAirport.lat, originAirport.lng,
        destAirport.lat, destAirport.lng
    );

    const flight = {
        id: `flight_${index}_${Date.now()}`,
        flightNumber,
        airline: airline.name,
        airlineCode: airline.code,
        color: airline.color,
        type: airline.type,

        // Havalimanı bilgileri
        originAirport: originAirport.id,
        destAirport: destAirport.id,
        origin: originAirport.city,
        destination: destAirport.city,

        // Koordinatlar
        originLat: originAirport.lat,
        originLng: originAirport.lng,
        destLat: destAirport.lat,
        destLng: destAirport.lng,

        // Bezier kontrol noktası
        controlLat: controlPoint.lat,
        controlLng: controlPoint.lng,

        // Mevcut pozisyon
        currentLat: originAirport.lat,
        currentLng: originAirport.lng,

        // Uçuş bilgileri
        heading: 0,
        progress: 0,
        speed: 480,
        departureTime,
        arrivalTime,
        status: 'En Route'
    };

    // Tip bazlı detaylar
    if (airline.type === 'cargo') {
        flight.cargo = {
            type: CARGO_TYPES[Math.floor(Math.random() * CARGO_TYPES.length)],
            weight: Math.floor(Math.random() * 50) + 10,
            value: Math.floor(Math.random() * 500000) + 50000
        };
    } else if (airline.type === 'vip') {
        flight.vip = {
            official: ['Cumhurbaşkanı', 'Başbakan', 'Dışişleri Bakanı', 'Savunma Bakanı'][Math.floor(Math.random() * 4)],
            destination_purpose: ['Resmi Ziyaret', 'Diplomatik Görüşme', 'Zirve Toplantısı'][Math.floor(Math.random() * 3)]
        };
    } else {
        flight.passengers = Math.floor(Math.random() * 150) + 50;
    }

    return flight;
}

// İki nokta arası mesafe (km)
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Bezier curve kontrol noktası hesapla (gerçekçi uçuş yolu)
function calculateControlPoint(lat1, lng1, lat2, lng2) {
    // Orta nokta
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;

    // Mesafeye göre eğrilik
    const distance = getDistance(lat1, lng1, lat2, lng2);
    const offset = distance / 20; // Eğrilik miktarı

    // Dik yönde offset
    const angle = Math.atan2(lat2 - lat1, lng2 - lng1);
    const perpAngle = angle + Math.PI / 2;

    return {
        lat: midLat + offset * Math.sin(perpAngle) * 0.01,
        lng: midLng + offset * Math.cos(perpAngle) * 0.01
    };
}

// Bezier curve üzerinde pozisyon hesapla
function getBezierPoint(t, p0, p1, p2) {
    const u = 1 - t;
    return {
        lat: u * u * p0.lat + 2 * u * t * p1.lat + t * t * p2.lat,
        lng: u * u * p0.lng + 2 * u * t * p1.lng + t * t * p2.lng
    };
}

// Heading hesapla - DOĞRU AÇI
function calculateHeading(lat1, lng1, lat2, lng2) {
    const dLng = lng2 - lng1;
    const dLat = lat2 - lat1;

    // atan2 ile açı hesapla (derece)
    let angle = Math.atan2(dLng, dLat) * (180 / Math.PI);

    // 0-360 arası normalize et
    return (angle + 360) % 360;
}

// Uçuş sistemini başlat
export function initFlightTracking(map) {
    mapInstance = map;

    // 8 uçuş oluştur
    for (let i = 0; i < 8; i++) {
        const flight = generateRandomFlight(i);
        activeFlights.push(flight);
        createFlightMarker(flight);
    }

    // Zoom kontrolü
    updateFlightVisibility();
    map.on('zoomend', updateFlightVisibility);

    // Smooth güncelleme (her 100ms)
    flightUpdateInterval = setInterval(updateFlights, 100);

    console.log(`✈️ Flight tracking initialized with ${activeFlights.length} flights`);
}

// Zoom kontrolü
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

// Uçak marker oluştur
function createFlightMarker(flight) {
    const flightTypeText = flight.type === 'cargo' ? 'Kargo Uçağı' :
        flight.type === 'vip' ? 'Devlet Uçağı' : 'Ticari Uçak';

    const icon = L.divIcon({
        className: 'flight-marker',
        html: `
            <div class="flight-icon-wrapper" style="transform: rotate(${flight.heading}deg)">
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

    if (mapInstance.getZoom() >= 6.0) {
        marker.addTo(mapInstance);
    }

    marker.on('click', () => {
        // Panel açma fonksiyonu flights.js'den import edilecek
        console.log('Flight clicked:', flight.flightNumber);
    });

    flightMarkers.push({ flightId: flight.id, marker });
}

// Uçuşları güncelle - GELİŞMİŞ SİSTEM
function updateFlights() {
    activeFlights.forEach((flight, index) => {
        flight.progress += 0.2; // %0.2 ilerleme

        if (flight.progress >= 100) {
            // Uçuş bitti, yeni uçuş
            const markerObj = flightMarkers.find(m => m.flightId === flight.id);
            if (markerObj) {
                mapInstance.removeLayer(markerObj.marker);
            }

            const newFlight = generateRandomFlight(index);
            activeFlights[index] = newFlight;
            createFlightMarker(newFlight);

            const markerIndex = flightMarkers.findIndex(m => m.flightId === flight.id);
            if (markerIndex !== -1) {
                flightMarkers.splice(markerIndex, 1);
            }
        } else {
            // Bezier curve üzerinde pozisyon hesapla
            const t = flight.progress / 100;
            const p0 = { lat: flight.originLat, lng: flight.originLng };
            const p1 = { lat: flight.controlLat, lng: flight.controlLng };
            const p2 = { lat: flight.destLat, lng: flight.destLng };

            const oldPos = { lat: flight.currentLat, lng: flight.currentLng };
            const newPos = getBezierPoint(t, p0, p1, p2);

            flight.currentLat = newPos.lat;
            flight.currentLng = newPos.lng;

            // Heading hesapla (hareket yönü)
            flight.heading = calculateHeading(
                oldPos.lat, oldPos.lng,
                newPos.lat, newPos.lng
            );

            // Marker güncelle
            const markerObj = flightMarkers.find(m => m.flightId === flight.id);
            if (markerObj) {
                markerObj.marker.setLatLng([flight.currentLat, flight.currentLng]);

                // Icon güncelle (yeni heading)
                const flightTypeText = flight.type === 'cargo' ? 'Kargo Uçağı' :
                    flight.type === 'vip' ? 'Devlet Uçağı' : 'Ticari Uçak';

                const newIcon = L.divIcon({
                    className: 'flight-marker',
                    html: `
                        <div class="flight-icon-wrapper" style="transform: rotate(${flight.heading}deg)">
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
                markerObj.marker.setIcon(newIcon);
            }
        }
    });
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

// Aktif uçuşları al
export function getActiveFlights() {
    return activeFlights;
}
