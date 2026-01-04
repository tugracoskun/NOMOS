// HARİTA ETİKET SİSTEMİ (LABELS)
// Age of History 3 tarzı: Yakınlaştıkça netleşen, uzaklaştıkça saydam olan etiketler
// NOT: Sadece ülke isimleri - Şehir detayları ileride city details kısmında olacak

// Label layer grubu
let countryLabelsLayer = null;

// Başkent koordinatları (lat, lng)
const capitalCoordinates = {
    "Turkey": [39.93, 32.86],
    "France": [48.85, 2.35],
    "Germany": [52.52, 13.40],
    "United Kingdom": [51.51, -0.13],
    "Italy": [41.90, 12.49],
    "Spain": [40.42, -3.70],
    "Russia": [55.75, 37.62],
    "United States of America": [38.91, -77.04],
    "Canada": [45.42, -75.69],
    "Brazil": [-15.79, -47.88],
    "China": [39.90, 116.40],
    "Japan": [35.68, 139.69],
    "India": [28.61, 77.21],
    "Australia": [-35.28, 149.13],
    "South Africa": [-25.75, 28.19],
    "Egypt": [30.04, 31.24],
    "Nigeria": [9.08, 7.40],
    "Argentina": [-34.60, -58.38],
    "Mexico": [19.43, -99.13],
    "Indonesia": [-6.21, 106.85],
    "Poland": [52.23, 21.01],
    "Ukraine": [50.45, 30.52],
    "Netherlands": [52.37, 4.90],
    "Belgium": [50.85, 4.35],
    "Greece": [37.98, 23.73],
    "Portugal": [38.72, -9.14],
    "Sweden": [59.33, 18.07],
    "Norway": [59.91, 10.75],
    "Finland": [60.17, 24.94],
    "Denmark": [55.68, 12.57],
    "Austria": [48.21, 16.37],
    "Switzerland": [46.95, 7.45],
    "Czech Republic": [50.08, 14.44],
    "Czechia": [50.08, 14.44],
    "Hungary": [47.50, 19.04],
    "Romania": [44.43, 26.10],
    "Bulgaria": [42.70, 23.32],
    "Serbia": [44.79, 20.45],
    "Croatia": [45.81, 15.98],
    "Slovakia": [48.15, 17.11],
    "Slovenia": [46.05, 14.51],
    "North Macedonia": [42.00, 21.43],
    "Albania": [41.33, 19.82],
    "Bosnia and Herzegovina": [43.86, 18.41],
    "Montenegro": [42.44, 19.26],
    "Kosovo": [42.67, 21.17],
    "Moldova": [47.01, 28.86],
    "Belarus": [53.90, 27.57],
    "Lithuania": [54.69, 25.28],
    "Latvia": [56.95, 24.11],
    "Estonia": [59.44, 24.75],
    "Georgia": [41.69, 44.80],
    "Armenia": [40.18, 44.51],
    "Azerbaijan": [40.41, 49.87],
    "Kazakhstan": [51.17, 71.47],
    "Uzbekistan": [41.31, 69.28],
    "Turkmenistan": [37.95, 58.38],
    "Tajikistan": [38.56, 68.77],
    "Kyrgyzstan": [42.87, 74.59],
    "Afghanistan": [34.53, 69.17],
    "Pakistan": [33.69, 73.04],
    "Bangladesh": [23.81, 90.41],
    "Thailand": [13.76, 100.50],
    "Vietnam": [21.03, 105.85],
    "Malaysia": [3.14, 101.69],
    "Philippines": [14.60, 120.98],
    "South Korea": [37.57, 126.98],
    "North Korea": [39.04, 125.76],
    "Taiwan": [25.03, 121.57],
    "Mongolia": [47.89, 106.91],
    "Iran": [35.69, 51.39],
    "Iraq": [33.34, 44.40],
    "Syria": [33.51, 36.28],
    "Saudi Arabia": [24.71, 46.68],
    "Yemen": [15.37, 44.21],
    "Oman": [23.61, 58.59],
    "United Arab Emirates": [24.45, 54.37],
    "Qatar": [25.29, 51.53],
    "Kuwait": [29.38, 47.99],
    "Bahrain": [26.23, 50.59],
    "Jordan": [31.95, 35.93],
    "Lebanon": [33.89, 35.50],
    "Israel": [31.77, 35.22],
    "Palestine": [31.90, 35.20],
    "Morocco": [34.02, -6.83],
    "Algeria": [36.75, 3.04],
    "Tunisia": [36.81, 10.18],
    "Libya": [32.90, 13.19],
    "Sudan": [15.60, 32.53],
    "South Sudan": [4.85, 31.58],
    "Ethiopia": [9.02, 38.75],
    "Kenya": [-1.29, 36.82],
    "Tanzania": [-6.16, 35.75],
    "Uganda": [0.31, 32.58],
    "Rwanda": [-1.94, 30.06],
    "Somalia": [2.04, 45.34],
    "Democratic Republic of the Congo": [-4.32, 15.31],
    "Dem. Rep. Congo": [-4.32, 15.31],
    "Republic of the Congo": [-4.27, 15.28],
    "Congo": [-4.27, 15.28],
    "Angola": [-8.84, 13.23],
    "Mozambique": [-25.97, 32.58],
    "Zimbabwe": [-17.83, 31.05],
    "Zambia": [-15.42, 28.29],
    "Botswana": [-24.65, 25.91],
    "Namibia": [-22.56, 17.08],
    "Ghana": [5.56, -0.19],
    "Ivory Coast": [6.85, -5.30],
    "Côte d'Ivoire": [6.85, -5.30],
    "Senegal": [14.69, -17.44],
    "Mali": [12.65, -8.00],
    "Niger": [13.51, 2.11],
    "Chad": [12.11, 15.04],
    "Cameroon": [3.87, 11.52],
    "Colombia": [4.71, -74.07],
    "Venezuela": [10.49, -66.88],
    "Peru": [-12.05, -77.04],
    "Chile": [-33.45, -70.67],
    "Ecuador": [-0.18, -78.47],
    "Bolivia": [-16.50, -68.15],
    "Paraguay": [-25.26, -57.58],
    "Uruguay": [-34.90, -56.19],
    "Cuba": [23.11, -82.37],
    "Panama": [8.98, -79.52],
    "Costa Rica": [9.93, -84.09],
    "Honduras": [14.08, -87.21],
    "Guatemala": [14.63, -90.51],
    "El Salvador": [13.69, -89.19],
    "Nicaragua": [12.15, -86.27],
    "New Zealand": [-41.29, 174.78],
    "Iceland": [64.15, -21.94],
    "Ireland": [53.35, -6.26],
    "Cyprus": [35.17, 33.36]
};

// Ülke ismi kısaltmaları (uzun isimler için)
const countryAbbreviations = {
    "United States of America": "USA",
    "United Kingdom": "UK",
    "United Arab Emirates": "UAE",
    "Democratic Republic of the Congo": "DR Congo",
    "Dem. Rep. Congo": "DR Congo",
    "Republic of the Congo": "Congo",
    "Central African Republic": "CAR",
    "Bosnia and Herzegovina": "Bosnia",
    "North Macedonia": "N. Macedonia",
    "South Africa": "S. Africa",
    "South Korea": "S. Korea",
    "North Korea": "N. Korea",
    "South Sudan": "S. Sudan",
    "New Zealand": "N. Zealand",
    "Papua New Guinea": "PNG",
    "Dominican Republic": "Dom. Rep.",
    "Equatorial Guinea": "Eq. Guinea",
    "Trinidad and Tobago": "Trinidad",
    "Saint Kitts and Nevis": "St. Kitts",
    "Antigua and Barbuda": "Antigua",
    "Saint Vincent and the Grenadines": "St. Vincent",
    "São Tomé and Príncipe": "São Tomé"
};

// Ultra mikro devletler - en yüksek zoom gerektirir (zoom 10+)
const ultraMicroStates = [
    "Vatican", "Holy See", "Vatican City",
    "Monaco",
    "San Marino",
    "Nauru",
    "Tuvalu"
];

// Mikro devletler - çok yüksek zoom gerektirir (zoom 8+)
const microStates = [
    "Liechtenstein",
    "Malta",
    "Luxembourg",
    "Andorra",
    "Singapore",
    "Bahrain",
    "Brunei",
    "Maldives",
    "Seychelles",
    "Palau",
    "Marshall Islands",
    "Micronesia",
    "Saint Kitts and Nevis",
    "Antigua and Barbuda",
    "Barbados",
    "Saint Lucia",
    "Grenada",
    "Saint Vincent and the Grenadines",
    "Dominica",
    "Comoros",
    "Mauritius",
    "São Tomé and Príncipe",
    "Cabo Verde",
    "Cape Verde"
];

// Küçük ülkeler - yüksek zoom gerektirir (zoom 7+)
const smallCountries = [
    "Slovenia", "North Macedonia", "Macedonia",
    "Albania", "Montenegro", "Kosovo",
    "Cyprus", "Lebanon", "Israel", "Palestine",
    "Kuwait", "Qatar",
    "Jamaica", "Trinidad and Tobago",
    "East Timor", "Timor-Leste",
    "Bhutan", "Djibouti", "Eswatini", "Swaziland",
    "Equatorial Guinea", "Guinea-Bissau",
    "Gambia", "Lesotho", "Burundi", "Rwanda",
    "Armenia", "Georgia", "Azerbaijan"
];

// Ülke tipine göre minimum zoom seviyesi
function getMinZoomForCountry(name) {
    if (ultraMicroStates.includes(name)) return 10;
    if (microStates.includes(name)) return 8;
    if (smallCountries.includes(name)) return 7;
    return 5; // Normal ülkeler
}

// Zoom seviyesine göre opacity hesapla
function calculateCountryOpacity(zoom) {
    if (zoom < 5) return 0;
    if (zoom <= 5) return 0.4;
    if (zoom <= 6) return 0.6;
    if (zoom <= 7) return 0.8;
    return 0.95;
}

// Ülke için koordinat bul - HER ZAMAN geometrik merkez (taşma önleme)
function getCountryCenter(country) {
    // Başkent yerine geometrik merkezi kullan - ülkenin tam ortasında olur
    return getPolygonCenter(country);
}

// Polygon merkezini hesapla - Ana kara parçası için
function getPolygonCenter(feature) {
    try {
        const geom = feature.geometry;
        if (!geom) return null;

        let coords = [];

        if (geom.type === 'Polygon') {
            coords = geom.coordinates[0];
        } else if (geom.type === 'MultiPolygon') {
            // En büyük parçayı bul (ana kara)
            let maxArea = 0;
            geom.coordinates.forEach(poly => {
                if (poly[0]) {
                    // Basit alan hesabı (koordinat sayısına göre)
                    const area = poly[0].length;
                    if (area > maxArea) {
                        maxArea = area;
                        coords = poly[0];
                    }
                }
            });
        }

        if (coords.length > 0) {
            let sumLat = 0, sumLng = 0;
            coords.forEach(c => {
                sumLng += c[0];
                sumLat += c[1];
            });
            return [sumLat / coords.length, sumLng / coords.length];
        }
    } catch (e) {
        console.warn("Labels: Merkez hesaplama hatası:", e.message);
    }

    return null;
}

// Ülke etiketlerini oluştur
export function createCountryLabels(countries, mapInstance) {
    if (countryLabelsLayer) {
        mapInstance.removeLayer(countryLabelsLayer);
    }

    countryLabelsLayer = L.layerGroup();

    countries.forEach(country => {
        // world.json'da isim farklı property'lerde olabilir
        // ÖNEMLİ: ADMIN/name önce gelsin - Palestine'ın sovereignt'i Israel olarak kayıtlı
        const name = country.properties.ADMIN ||
            country.properties.name ||
            country.properties.NAME ||
            country.properties.sovereignt ||
            "";
        if (!name) return;

        const center = getCountryCenter(country);
        if (!center) return;

        // Ülke tipine göre minimum zoom
        const minZoom = getMinZoomForCountry(name);

        // Kısa isim kullan (varsa)
        const displayName = countryAbbreviations[name] || name;

        // Ülke adı için marker - Küçük boyut
        const icon = L.divIcon({
            className: 'country-label',
            html: `<span>${displayName}</span>`,
            iconSize: [80, 20],
            iconAnchor: [40, 10]
        });

        const marker = L.marker(center, {
            icon: icon,
            interactive: false,
            pane: 'labelPane'
        });

        // Minimum zoom'u marker'a kaydet
        marker.minZoom = minZoom;

        countryLabelsLayer.addLayer(marker);
    });

    countryLabelsLayer.addTo(mapInstance);

    // İlk opacity ayarı
    updateCountryLabelsOpacity(mapInstance.getZoom());
}

// Ülke etiketlerinin opacity'sini güncelle (ülke bazlı zoom kontrolü ile)
export function updateCountryLabelsOpacity(zoom) {
    if (countryLabelsLayer) {
        countryLabelsLayer.eachLayer(marker => {
            const el = marker.getElement();
            if (el) {
                const minZoom = marker.minZoom || 5;

                // Bu ülke için yeterli zoom var mı?
                if (zoom < minZoom) {
                    el.style.opacity = 0;
                } else {
                    // Minimum zoom'a göre opacity hesapla
                    const zoomDiff = zoom - minZoom;
                    if (zoomDiff <= 0) el.style.opacity = 0.4;
                    else if (zoomDiff <= 1) el.style.opacity = 0.6;
                    else if (zoomDiff <= 2) el.style.opacity = 0.8;
                    else el.style.opacity = 0.95;
                }
            }
        });
    }
}

// Label pane oluştur
export function setupLabelPane(mapInstance) {
    if (!mapInstance.getPane('labelPane')) {
        mapInstance.createPane('labelPane');
        mapInstance.getPane('labelPane').style.zIndex = 650; // Border'ın üstünde
        mapInstance.getPane('labelPane').style.pointerEvents = 'none';
    }
}
