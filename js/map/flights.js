// GELİŞMİŞ UÇAK SİSTEMİ V2 - Havalimanı Bazlı
// Gerçekçi uçuş yolları, doğru rotasyon, Bezier curves

import { AIRPORTS } from './airports.js';

let activeFlights = [];
let flightMarkers = [];
let flightPaths = [];
let flightUpdateInterval = null;
let mapInstance = null;
let trackingFlightId = null;
let isUserInteracting = false;
let lastCameraUpdateTime = 0;

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
    { name: 'Endüstriyel Parçalar', weightRange: [20, 100], valueRange: [100000, 500000] },
    { name: 'Teknoloji Ürünleri', weightRange: [5, 30], valueRange: [500000, 2000000] },
    { name: 'Medikal Ekipman', weightRange: [2, 15], valueRange: [200000, 1000000] },
    { name: 'Değerli Madenler', weightRange: [0.5, 5], valueRange: [1000000, 5000000] },
    { name: 'Otomotiv Yedek Parça', weightRange: [15, 60], valueRange: [50000, 250000] },
    { name: 'Lojistik Hammadde', weightRange: [40, 150], valueRange: [20000, 100000] }
];

const VIP_OFFICIALS = [
    { title: 'Cumhurbaşkanı', name: 'Ahmet Yılmaz', purpose: 'Devlet Zirvesi' },
    { title: 'Dışişleri Bakanı', name: 'Mehmet Demir', purpose: 'Diplomatik Temaslar' },
    { title: 'Savunma Bakanı', name: 'Can Özkan', purpose: 'Stratejik Görüşme' },
    { title: 'Milli Eğitim Bakanı', name: 'Selin Kaya', purpose: 'Eğitim Forumu' },
    { title: 'Enerji Bakanı', name: 'Murat Aras', purpose: 'Enerji Anlaşması' },
    { title: 'Ticaret Bakanı', name: 'Elif Şahin', purpose: 'Ticaret Heyeti Başkanı' }
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

    // Sabit hız ayarı
    // Her 100ms'lik güncellemede katedilecek mesafe
    const kmPerUpdate = 0.8; // Hızı bir miktar artırdık (0.5 -> 0.8)
    const totalDistance = distance;
    const progressStep = (kmPerUpdate / totalDistance) * 100;

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
        progressStep: progressStep, // Sabit hız için adım
        speed: 480,
        departureTime,
        arrivalTime,
        status: 'En Route'
    };

    // Tip bazlı detaylar
    if (airline.type === 'cargo') {
        const cargoType = CARGO_TYPES[Math.floor(Math.random() * CARGO_TYPES.length)];
        flight.cargo = {
            type: cargoType.name,
            weight: (Math.random() * (cargoType.weightRange[1] - cargoType.weightRange[0]) + cargoType.weightRange[0]).toFixed(1),
            value: Math.floor(Math.random() * (cargoType.valueRange[1] - cargoType.valueRange[0]) + cargoType.valueRange[0]),
            sender: `${flight.origin} Lojistik Merkezi`,
            receiver: `${flight.destination} Serbest Bölge`
        };
    } else if (airline.type === 'vip') {
        const official = VIP_OFFICIALS[Math.floor(Math.random() * VIP_OFFICIALS.length)];
        flight.vip = {
            official: official.name,
            title: official.title,
            purpose: official.purpose
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

    // Haritaya tıklandığında paneli kapat
    map.on('click', () => {
        closeFlightPanel();
    });

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
            <div class="flight-plane-icon" style="transform: rotate(${flight.heading}deg);">
                <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(14, 14)">
                        <!-- Uçak gövdesi (yukarı bakan) -->
                        <path d="M 0,-12 L 2,-4 L 2,8 L 0,10 L -2,8 L -2,-4 Z" 
                              fill="${flight.color}" 
                              stroke="rgba(0,0,0,0.3)" 
                              stroke-width="0.5"/>
                        <!-- Kanatlar -->
                        <path d="M -8,-2 L -2,-1 L -2,1 L -8,0 Z" 
                              fill="${flight.color}" 
                              opacity="0.9"/>
                        <path d="M 8,-2 L 2,-1 L 2,1 L 8,0 Z" 
                              fill="${flight.color}" 
                              opacity="0.9"/>
                        <!-- Kuyruk -->
                        <path d="M -3,6 L 0,4 L 3,6 Z" 
                              fill="${flight.color}" 
                              opacity="0.8"/>
                    </g>
                </svg>
            </div>
            <div class="flight-tooltip">
                <div class="tooltip-type">${flightTypeText}</div>
                <div class="tooltip-route">${flight.origin} → ${flight.destination}</div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    const marker = L.marker([flight.currentLat, flight.currentLng], {
        icon,
        zIndexOffset: 1000,
        riseOnHover: true
    });

    if (mapInstance.getZoom() >= 6.0) {
        marker.addTo(mapInstance);
    }

    marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        trackingFlightId = flight.id;
        // Zoom yok, sadece soft pan
        mapInstance.panTo(marker.getLatLng(), {
            animate: true,
            duration: 0.8,
            easeLinearity: 0.3
        });
        openFlightPanel(flight);
    });

    flightMarkers.push({ flightId: flight.id, marker });
}

// Uçuşları güncelle - GELİŞMİŞ SİSTEM
function updateFlights() {
    activeFlights.forEach((flight, index) => {
        flight.progress += flight.progressStep; // Sabit hızda ilerleme

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

            // Takip ediliyorsa haritayı güncelle (SOFT FOLLOW)
            if (trackingFlightId === flight.id) {
                const now = Date.now();
                const mapCenter = mapInstance.getCenter();
                const planeLatLng = L.latLng(flight.currentLat, flight.currentLng);
                const distanceInPixels = mapInstance.latLngToContainerPoint(mapCenter).distanceTo(mapInstance.latLngToContainerPoint(planeLatLng));

                // Eğer uçak merkezden çok uzaklaştıysa (yaklaşık 50px) veya uzun süre geçtiyse yumuşak hareket et
                if (distanceInPixels > 50 || (now - lastCameraUpdateTime > 2000)) {
                    mapInstance.panTo([flight.currentLat, flight.currentLng], {
                        animate: true,
                        duration: 2, // Çok uzun ve yumuşak bir süre
                        easeLinearity: 0.2
                    });
                    lastCameraUpdateTime = now;
                }

                // Panel içeriğini her türlü güncelle (ilerleme barı ve varış süresi için)
                updatePanelRealtime(flight);
            }

            // Heading hesapla (hareket yönü)
            flight.heading = calculateHeading(
                oldPos.lat, oldPos.lng,
                newPos.lat, newPos.lng
            );

            // Marker güncelle (DOM'u koru, sadece değerleri değiştir)
            const markerObj = flightMarkers.find(m => m.flightId === flight.id);
            if (markerObj && markerObj.marker) {
                const marker = markerObj.marker;
                marker.setLatLng([flight.currentLat, flight.currentLng]);

                // Sadece DOM yüklendiyse ve gerekiyorsa CSS rotasyonunu güncelle
                // Bu tıklama kaybını engeller çünkü DOM düğümü silinmez
                if (marker._icon) {
                    const iconWrapper = marker._icon.querySelector('.flight-plane-icon');
                    if (iconWrapper) {
                        iconWrapper.style.transform = `rotate(${flight.heading}deg)`;
                    }
                }
            }
        }
    });
}

// Uçuş detay panelini aç
function openFlightPanel(flight) {
    let panel = document.getElementById('flight-detail-panel');
    const isNewPanel = !panel;

    if (isNewPanel) {
        panel = document.createElement('div');
        panel.id = 'flight-detail-panel';
        panel.className = 'flight-panel';
        document.body.appendChild(panel);

        // Map tıklandığında takibi bırak
        mapInstance.on('movestart', () => {
            // Sadece kullanıcı haritayı sürüklerse takibi bırak
            // flyTo veya panTo işlemleri 'isUserInteracting' ile kontrol edilebilir
        });
    }

    // Panel içeriğini hazırla
    const formatCurrency = (val) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    const formatTime = (date) => date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    let typeSpecificHTML = '';
    // ... (rest of the typeSpecificHTML logic remains same as per user's preference for cargo/vip/passenger)
    if (flight.type === 'cargo') {
        typeSpecificHTML = `
            <div class="flight-stats-grid">
                <div class="flight-stat-card">
                    <div class="stat-label">Kargo Tipi</div>
                    <div class="stat-value">${flight.cargo.type}</div>
                </div>
                <div class="flight-stat-card">
                    <div class="stat-label">Ağırlık</div>
                    <div class="stat-value">${flight.cargo.weight} Ton</div>
                </div>
                <div class="flight-stat-card">
                    <div class="stat-label">Piyasa Değeri</div>
                    <div class="stat-value text-gold">${formatCurrency(flight.cargo.value)}</div>
                </div>
                <div class="flight-stat-card wide">
                    <div class="stat-label">Gönderici / Alıcı</div>
                    <div class="stat-value" style="font-size: 0.85rem;">${flight.cargo.sender} <i class="fa-solid fa-arrow-right" style="font-size: 0.7rem; margin: 0 5px; opacity: 0.5;"></i> ${flight.cargo.receiver}</div>
                </div>
            </div>
        `;
    } else if (flight.type === 'vip') {
        typeSpecificHTML = `
            <div class="flight-stats-grid">
                <div class="flight-stat-card wide vip-card">
                    <div class="vip-badge"><i class="fa-solid fa-crown"></i> DEVLET GÖREVLİSİ</div>
                    <div class="stat-label">${flight.vip.title}</div>
                    <div class="stat-value">${flight.vip.official}</div>
                </div>
                <div class="flight-stat-card wide">
                    <div class="stat-label">Uçuş Amacı</div>
                    <div class="stat-value">${flight.vip.purpose}</div>
                </div>
            </div>
        `;
    } else {
        typeSpecificHTML = `
            <div class="flight-stats-grid">
                <div class="flight-stat-card">
                    <div class="stat-label">Yolcu Sayısı</div>
                    <div class="stat-value">${flight.passengers}</div>
                </div>
                <div class="flight-stat-card">
                    <div class="stat-label">Doluluk</div>
                    <div class="stat-value">${Math.floor(Math.random() * 20) + 80}%</div>
                </div>
                <div class="flight-stat-card">
                    <div class="stat-label">Uçuş Sınıfı</div>
                    <div class="stat-value">Ekonomi / Business</div>
                </div>
            </div>
        `;
    }

    // Geçiş efekti için önce içeriği saydamlaştır
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-50%) translateX(-20px)';

    setTimeout(() => {
        panel.innerHTML = `
            <div class="flight-panel-header" style="border-left: 4px solid ${flight.color}">
                <div class="flight-number-group">
                    <span class="flight-no">${flight.flightNumber}</span>
                    <span class="airline-name">${flight.airline}</span>
                </div>
                <button class="close-panel" id="close-flight-panel">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="flight-route-visual">
                <div class="route-point">
                    <div class="point-code">${flight.originAirport}</div>
                    <div class="point-city">${flight.origin}</div>
                    <div class="point-time">${formatTime(flight.departureTime)}</div>
                </div>
                <div class="route-line-container">
                    <div class="route-line">
                        <div class="route-progress" id="panel-progress-bar" style="width: ${flight.progress}%"></div>
                        <div class="route-plane" id="panel-plane-icon" style="left: ${flight.progress}%">
                            <i class="fa-solid fa-plane" style="transform: rotate(90deg); color: ${flight.color}"></i>
                        </div>
                    </div>
                </div>
                <div class="route-point text-right">
                    <div class="point-code">${flight.destAirport}</div>
                    <div class="point-city">${flight.destination}</div>
                    <div class="point-time">${formatTime(flight.arrivalTime)}</div>
                </div>
            </div>

            <div class="flight-panel-content">
                ${typeSpecificHTML}
                
                <div class="flight-footer-stats">
                    <div class="f-stat">
                        <i class="fa-solid fa-gauge-high"></i>
                        <span>${flight.speed} KTS</span>
                    </div>
                    <div class="f-stat">
                        <i class="fa-solid fa-clock"></i>
                        <span id="panel-eta-text">Varışa ${Math.max(1, Math.round((100 - flight.progress) * 0.5))} Dakika</span>
                    </div>
                    <div class="f-stat">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${flight.status}</span>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('close-flight-panel').onclick = closeFlightPanel;

        panel.classList.add('active');
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(-50%) translateX(0)';
    }, isNewPanel ? 0 : 200);
}

// Paneldeki ilerlemeyi anlık güncelle
function updatePanelRealtime(flight) {
    const progressBar = document.getElementById('panel-progress-bar');
    const planeIcon = document.getElementById('panel-plane-icon');
    const etaText = document.getElementById('panel-eta-text');

    if (progressBar) progressBar.style.width = `${flight.progress}%`;
    if (planeIcon) planeIcon.style.left = `${flight.progress}%`;
    if (etaText) etaText.innerText = `Varışa ${Math.max(1, Math.round((100 - flight.progress) * 0.5))} Dakika`;
}

// Paneli kapat
function closeFlightPanel() {
    trackingFlightId = null;
    const panel = document.getElementById('flight-detail-panel');
    if (panel) {
        panel.classList.remove('active');
        setTimeout(() => panel.remove(), 400);
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

// Aktif uçuşları al
export function getActiveFlights() {
    return activeFlights;
}
