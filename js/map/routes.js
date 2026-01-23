// GEMİ ROTALARI SİSTEMİ
// Ülke bazlı rotalar - haritada görünür, gemiler kullanır

let routeLines = [];
let mapInstance = null;

// ===== ÜLKE BAZLI ROTALAR =====
// Her rota iki ülke arasında ve deniz waypoint'leri içeriyor
export const SEA_ROUTES = [
    // TÜRKİYE - YUNANİSTAN (Ege Denizi)
    {
        id: 'TR_GR',
        name: 'Türkiye - Yunanistan',
        countries: ['Türkiye', 'Yunanistan'],
        color: '#0ea5e9',
        waypoints: [
            { lat: 38.44, lng: 27.14 },  // İzmir açıkları
            { lat: 38.00, lng: 26.00 },  // Orta Ege
            { lat: 37.70, lng: 24.50 },  // Kiklades
            { lat: 37.94, lng: 23.65 }   // Pire açıkları
        ]
    },

    // TÜRKİYE - MISIR (Doğu Akdeniz)
    {
        id: 'TR_EG',
        name: 'Türkiye - Mısır',
        countries: ['Türkiye', 'Mısır'],
        color: '#f97316',
        waypoints: [
            { lat: 38.44, lng: 27.14 },  // İzmir açıkları
            { lat: 36.50, lng: 26.00 },  // Rodos kuzeyi
            { lat: 35.00, lng: 27.00 },  // Girit güneyi
            { lat: 33.00, lng: 28.50 },  // Açık Akdeniz
            { lat: 31.21, lng: 29.89 }   // İskenderiye açıkları
        ]
    },

    // TÜRKİYE - UKRAYNA (Karadeniz)
    {
        id: 'TR_UA',
        name: 'Türkiye - Ukrayna',
        countries: ['Türkiye', 'Ukrayna'],
        color: '#eab308',
        waypoints: [
            { lat: 41.20, lng: 29.10 },  // İstanbul Boğazı çıkışı
            { lat: 42.50, lng: 30.00 },  // Batı Karadeniz
            { lat: 44.00, lng: 31.00 },  // Orta Karadeniz
            { lat: 46.00, lng: 31.50 },  // Kuzey Karadeniz
            { lat: 46.47, lng: 30.73 }   // Odessa açıkları
        ]
    },

    // TÜRKİYE - BULGARİSTAN (Karadeniz Batı)
    {
        id: 'TR_BG',
        name: 'Türkiye - Bulgaristan',
        countries: ['Türkiye', 'Bulgaristan'],
        color: '#22c55e',
        waypoints: [
            { lat: 41.20, lng: 29.10 },  // İstanbul Boğazı çıkışı
            { lat: 42.00, lng: 28.50 },  // Batı Karadeniz
            { lat: 43.20, lng: 27.92 }   // Varna açıkları
        ]
    },

    // YUNANİSTAN - MISIR
    {
        id: 'GR_EG',
        name: 'Yunanistan - Mısır',
        countries: ['Yunanistan', 'Mısır'],
        color: '#8b5cf6',
        waypoints: [
            { lat: 37.94, lng: 23.65 },  // Pire
            { lat: 36.00, lng: 24.50 },  // Girit kuzeyi
            { lat: 34.50, lng: 26.00 },  // Girit güneyi
            { lat: 32.50, lng: 28.00 },  // Açık deniz
            { lat: 31.21, lng: 29.89 }   // İskenderiye
        ]
    },

    // YUNANİSTAN - İTALYA (İyon Denizi)
    {
        id: 'GR_IT',
        name: 'Yunanistan - İtalya',
        countries: ['Yunanistan', 'İtalya'],
        color: '#ec4899',
        waypoints: [
            { lat: 37.94, lng: 23.65 },  // Pire
            { lat: 37.00, lng: 21.00 },  // Batı Yunanistan
            { lat: 37.50, lng: 17.00 },  // İyon Denizi
            { lat: 38.50, lng: 15.50 },  // Sicilya doğusu
            { lat: 40.50, lng: 13.00 },  // Tirrenia
            { lat: 43.00, lng: 10.00 },  // Ligurya
            { lat: 44.42, lng: 8.94 }    // Cenova
        ]
    },

    // İTALYA - FRANSA (Batı Akdeniz)
    {
        id: 'IT_FR',
        name: 'İtalya - Fransa',
        countries: ['İtalya', 'Fransa'],
        color: '#06b6d4',
        waypoints: [
            { lat: 44.42, lng: 8.94 },   // Cenova
            { lat: 43.80, lng: 7.50 },   // Riviera
            { lat: 43.29, lng: 5.36 }    // Marsilya
        ]
    },

    // FRANSA - İSPANYA
    {
        id: 'FR_ES',
        name: 'Fransa - İspanya',
        countries: ['Fransa', 'İspanya'],
        color: '#f43f5e',
        waypoints: [
            { lat: 43.29, lng: 5.36 },   // Marsilya
            { lat: 42.50, lng: 4.00 },   // Güney Fransa
            { lat: 41.38, lng: 2.18 }    // Barselona
        ]
    },

    // BULGARİSTAN - UKRAYNA
    {
        id: 'BG_UA',
        name: 'Bulgaristan - Ukrayna',
        countries: ['Bulgaristan', 'Ukrayna'],
        color: '#84cc16',
        waypoints: [
            { lat: 43.20, lng: 27.92 },  // Varna
            { lat: 44.00, lng: 29.00 },  // Batı Karadeniz
            { lat: 45.50, lng: 30.50 },  // Kuzey
            { lat: 46.47, lng: 30.73 }   // Odessa
        ]
    }
];

// Rotaları haritada göster
export function initSeaRoutes(map) {
    mapInstance = map;
    // Artık otomatik gösterilmiyor, modes.js'den kontrol ediliyor
    console.log(`🌊 Sea routes initialized: ${SEA_ROUTES.length} routes ready`);
}

// Rotaları göster (modes.js'den çağrılır)
export function showSeaRoutes() {
    if (!mapInstance || routeLines.length > 0) return;
    drawRoutes();
    console.log('🌊 Sea routes shown');
}

// Rotaları gizle (modes.js'den çağrılır)
export function hideSeaRoutes() {
    clearRoutes();
    console.log('🌊 Sea routes hidden');
}

function drawRoutes() {
    SEA_ROUTES.forEach(route => {
        // Ana rota çizgisi - ince ve akıcı
        const polyline = L.polyline(
            route.waypoints.map(wp => [wp.lat, wp.lng]),
            {
                color: route.color,
                weight: 1.5,
                opacity: 0.35,
                dashArray: '6, 4',
                lineCap: 'round',
                lineJoin: 'round',
                className: `sea-route-line route-${route.id}`
            }
        );

        polyline.addTo(mapInstance);

        // Etiket konumunu hesapla
        const midIndex = Math.floor(route.waypoints.length / 2);
        const midPoint = route.waypoints[midIndex];

        // Etiket - yatay, silik başlangıç, hover'da görünür
        const label = L.marker([midPoint.lat, midPoint.lng], {
            icon: L.divIcon({
                className: 'route-label',
                html: `<div class="route-label-text" style="--route-color: ${route.color}">${route.name}</div>`,
                iconSize: [100, 16],
                iconAnchor: [50, 8]
            }),
            interactive: false
        });

        label.addTo(mapInstance);

        // Polyline hover event - etiketi göster/gizle
        polyline.on('mouseover', () => {
            const labelEl = label.getElement();
            if (labelEl) labelEl.classList.add('hovered');
            polyline.setStyle({ weight: 2.5, opacity: 0.7 });
        });

        polyline.on('mouseout', () => {
            const labelEl = label.getElement();
            if (labelEl) labelEl.classList.remove('hovered');
            polyline.setStyle({ weight: 1.5, opacity: 0.35 });
        });

        routeLines.push({ id: route.id, polyline, label });
    });
}

function clearRoutes() {
    routeLines.forEach(({ polyline, label }) => {
        if (mapInstance) {
            mapInstance.removeLayer(polyline);
            mapInstance.removeLayer(label);
        }
    });
    routeLines = [];
}

// İki ülke arasındaki rotayı bul
export function findRouteBetweenCountries(country1, country2) {
    return SEA_ROUTES.find(route =>
        route.countries.includes(country1) && route.countries.includes(country2)
    );
}

// Rotanın waypoint'lerini al (yön düzeltmeli)
export function getRouteWaypoints(route, fromCountry) {
    // Eğer başlangıç ülkesi rotanın başlangıç ülkesi değilse, waypoint'leri ters çevir
    const firstCountryInRoute = route.countries[0];

    if (fromCountry === firstCountryInRoute) {
        return [...route.waypoints];
    } else {
        return [...route.waypoints].reverse();
    }
}

// Temizlik
export function clearSeaRoutes() {
    clearRoutes();
}
