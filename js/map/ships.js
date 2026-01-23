// GEMİ TAKİP SİSTEMİ V6 - AKILLI ROTA SİSTEMİ
// Gemiler ülke rotalarını kullanarak limandan limana gider

import { PORTS } from './ports.js';
import { SEA_ROUTES, findRouteBetweenCountries, getRouteWaypoints } from './routes.js';

let activeShips = [];
let shipMarkers = [];
let shipUpdateInterval = null;
let mapInstance = null;

// Gemi tipleri
const SHIP_TYPES = [
    { type: 'cargo', name: 'Kargo Gemisi', color: '#f97316' },
    { type: 'tanker', name: 'Tanker', color: '#3b82f6' },
    { type: 'container', name: 'Konteyner', color: '#22c55e' }
];

// Yükler
const CARGO_GOODS = [
    { name: 'Şarap', icon: '🍷' },
    { name: 'Zeytinyağı', icon: '🫒' },
    { name: 'Tekstil', icon: '🧵' },
    { name: 'Elektronik', icon: '📱' },
    { name: 'Tahıl', icon: '🌾' },
    { name: 'Petrol', icon: '🛢️' },
    { name: 'Otomobil', icon: '🚗' },
    { name: 'Makine', icon: '⚙️' }
];

// Yardımcı fonksiyonlar
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateRouteDistance(waypoints) {
    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
        total += getDistance(waypoints[i].lat, waypoints[i].lng, waypoints[i + 1].lat, waypoints[i + 1].lng);
    }
    return total;
}

function getPositionOnRoute(waypoints, progress) {
    const totalDist = calculateRouteDistance(waypoints);
    const targetDist = (progress / 100) * totalDist;

    let acc = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
        const segDist = getDistance(waypoints[i].lat, waypoints[i].lng, waypoints[i + 1].lat, waypoints[i + 1].lng);
        if (acc + segDist >= targetDist) {
            const t = (targetDist - acc) / segDist;
            return {
                lat: waypoints[i].lat + (waypoints[i + 1].lat - waypoints[i].lat) * t,
                lng: waypoints[i].lng + (waypoints[i + 1].lng - waypoints[i].lng) * t,
                nextLat: waypoints[i + 1].lat,
                nextLng: waypoints[i + 1].lng
            };
        }
        acc += segDist;
    }
    const last = waypoints[waypoints.length - 1];
    return { lat: last.lat, lng: last.lng, nextLat: last.lat, nextLng: last.lng };
}

function calculateHeading(lat1, lng1, lat2, lng2) {
    const dLng = lng2 - lng1;
    const dLat = lat2 - lat1;
    return (Math.atan2(dLng, dLat) * 180 / Math.PI + 360) % 360;
}

// Akıllı gemi oluştur - ülke rotalarını kullanır
function generateSmartShip(index) {
    // Rastgele bir rota seç
    const route = SEA_ROUTES[Math.floor(Math.random() * SEA_ROUTES.length)];

    // Bu rota üzerindeki ülkelerden limanları bul
    const country1 = route.countries[0];
    const country2 = route.countries[1];

    const portsCountry1 = PORTS.filter(p => p.country === country1);
    const portsCountry2 = PORTS.filter(p => p.country === country2);

    if (portsCountry1.length === 0 || portsCountry2.length === 0) {
        console.warn('No ports for route:', route.name);
        return null;
    }

    // Rastgele yön seç (country1 -> country2 veya tersi)
    const goingForward = Math.random() > 0.5;

    const originPort = goingForward
        ? portsCountry1[Math.floor(Math.random() * portsCountry1.length)]
        : portsCountry2[Math.floor(Math.random() * portsCountry2.length)];

    const destPort = goingForward
        ? portsCountry2[Math.floor(Math.random() * portsCountry2.length)]
        : portsCountry1[Math.floor(Math.random() * portsCountry1.length)];

    // Rota waypoint'lerini al (yöne göre)
    const waypoints = getRouteWaypoints(route, originPort.country);

    // Limandan başlayıp limana bitecek şekilde waypoint'leri ayarla
    const fullWaypoints = [
        { lat: originPort.lat, lng: originPort.lng },
        ...waypoints,
        { lat: destPort.lat, lng: destPort.lng }
    ];

    const shipType = SHIP_TYPES[Math.floor(Math.random() * SHIP_TYPES.length)];
    const cargo = CARGO_GOODS[Math.floor(Math.random() * CARGO_GOODS.length)];

    const totalDist = calculateRouteDistance(fullWaypoints);
    const kmPerUpdate = 0.7;
    const progressStep = (kmPerUpdate / totalDist) * 100;

    return {
        id: `ship_${index}_${Date.now()}`,
        name: `${originPort.country.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
        originPort,
        destPort,
        route: route,
        shipType,
        cargo,
        cargoAmount: Math.floor(Math.random() * 4000) + 500,
        waypoints: fullWaypoints,
        currentLat: fullWaypoints[0].lat,
        currentLng: fullWaypoints[0].lng,
        heading: 0,
        progress: Math.random() * 30,
        progressStep,
        speed: 22
    };
}

// Sistem başlat
export function initShipTracking(map) {
    mapInstance = map;

    // 6 gemi oluştur
    for (let i = 0; i < 6; i++) {
        const ship = generateSmartShip(i);
        if (ship) {
            activeShips.push(ship);
            createShipMarker(ship);
        }
    }

    updateShipVisibility();
    map.on('zoomend', updateShipVisibility);

    shipUpdateInterval = setInterval(updateShips, 150);
    console.log(`🚢 Smart Ship System: ${activeShips.length} ships using country routes`);
}

function updateShipVisibility() {
    const show = mapInstance.getZoom() >= 5;
    shipMarkers.forEach(({ marker }) => {
        if (show && !mapInstance.hasLayer(marker)) marker.addTo(mapInstance);
        else if (!show && mapInstance.hasLayer(marker)) mapInstance.removeLayer(marker);
    });
}

function createShipMarker(ship) {
    const icon = L.divIcon({
        className: 'ship-marker',
        html: `
            <div class="ship-icon-wrapper" style="transform:rotate(${ship.heading}deg)">
                <svg width="20" height="20" viewBox="0 0 20 20">
                    <g transform="translate(10,10)">
                        <path d="M0,-8 L3,-2 L3,5 L0,7 L-3,5 L-3,-2 Z" fill="${ship.shipType.color}" stroke="#000" stroke-width="0.3"/>
                    </g>
                </svg>
            </div>
            <div class="ship-preview-tooltip">
                <div class="preview-header">
                    <span class="country-flag">${ship.originPort.flag}</span>
                    <div class="preview-title">
                        <span class="country-name">${ship.originPort.country}</span>
                        <span class="ship-type">${ship.shipType.name}</span>
                    </div>
                </div>
                <div class="preview-route">${ship.originPort.city} → ${ship.destPort.city}</div>
                <div class="preview-cargo">
                    <span>${ship.cargo.icon}</span>
                    <span>${ship.cargo.name}</span>
                </div>
                <div class="preview-route-name" style="border-left-color: ${ship.route.color}">
                    ${ship.route.name} Rotası
                </div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    const marker = L.marker([ship.currentLat, ship.currentLng], { icon, zIndexOffset: 800, riseOnHover: true });
    if (mapInstance.getZoom() >= 5) marker.addTo(mapInstance);

    // Sadece hover preview - tıklama paneli yok
    shipMarkers.push({ shipId: ship.id, marker });
}

function updateShips() {
    activeShips.forEach((ship, index) => {
        ship.progress += ship.progressStep;

        if (ship.progress >= 100) {
            // Varış - yeni rota
            const m = shipMarkers.find(x => x.shipId === ship.id);
            if (m) mapInstance.removeLayer(m.marker);

            const newShip = generateSmartShip(index);
            if (newShip) {
                activeShips[index] = newShip;
                createShipMarker(newShip);
            }

            const idx = shipMarkers.findIndex(x => x.shipId === ship.id);
            if (idx !== -1) shipMarkers.splice(idx, 1);
        } else {
            const pos = getPositionOnRoute(ship.waypoints, ship.progress);
            ship.currentLat = pos.lat;
            ship.currentLng = pos.lng;
            ship.heading = calculateHeading(pos.lat, pos.lng, pos.nextLat, pos.nextLng);

            const m = shipMarkers.find(x => x.shipId === ship.id);
            if (m?.marker) {
                m.marker.setLatLng([ship.currentLat, ship.currentLng]);
                if (m.marker._icon) {
                    const w = m.marker._icon.querySelector('.ship-icon-wrapper');
                    if (w) w.style.transform = `rotate(${ship.heading}deg)`;
                }
            }
        }
    });
}

// Panel fonksiyonları kaldırıldı - sadece hover preview var

export function stopShipTracking() {
    if (shipUpdateInterval) clearInterval(shipUpdateInterval);
    shipMarkers.forEach(({ marker }) => mapInstance?.removeLayer(marker));
    activeShips = [];
    shipMarkers = [];
}

export function getActiveShips() { return activeShips; }
