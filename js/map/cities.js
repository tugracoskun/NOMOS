// ŞEHİR SİSTEMİ MODÜLÜ
// Her ülkenin 5 şehrini Voronoi bölgelerinin merkezine yerleştirir

import { assignResourceToRegion } from './resources.js';

let currentOpenCity = null;
let cityDataByRegion = {}; // Bölge ID'sine göre şehir verisi

// Türkiye için örnek şehir isimleri (diğer ülkeler için de genişletilebilir)
const cityNamesByCountry = {
    "Turkey": ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"],
    "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
    "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"],
    "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo"],
    "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza"],
    "Russia": ["Moscow", "St. Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan"],
    "United States of America": ["Washington", "New York", "Los Angeles", "Chicago", "Houston"],
    "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"],
    "Japan": ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo"],
    "India": ["New Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai"],
    "Brazil": ["Brasília", "São Paulo", "Rio de Janeiro", "Salvador", "Fortaleza"],
    "Canada": ["Ottawa", "Toronto", "Montreal", "Vancouver", "Calgary"],
    "Australia": ["Canberra", "Sydney", "Melbourne", "Brisbane", "Perth"],
    "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana"],
    "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
    "South Africa": ["Pretoria", "Johannesburg", "Cape Town", "Durban", "Port Elizabeth"],
    "Egypt": ["Cairo", "Alexandria", "Giza", "Shubra El-Kheima", "Port Said"],
    "Nigeria": ["Abuja", "Lagos", "Kano", "Ibadan", "Port Harcourt"],
    "Indonesia": ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang"],
    "Poland": ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań"],
    "Ukraine": ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Lviv"],
    "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
    "Belgium": ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège"],
    "Greece": ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa"],
    "Portugal": ["Lisbon", "Porto", "Braga", "Coimbra", "Funchal"],
    "Sweden": ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås"],
    "Norway": ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen"],
    "Finland": ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu"],
    "Denmark": ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Frederiksberg"],
    "Austria": ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck"],
    "Switzerland": ["Bern", "Zürich", "Geneva", "Basel", "Lausanne"],
    "Czech Republic": ["Prague", "Brno", "Ostrava", "Plzeň", "Liberec"],
    "Czechia": ["Prague", "Brno", "Ostrava", "Plzeň", "Liberec"],
    "Hungary": ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs"],
    "Romania": ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța"],
    "Bulgaria": ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse"],
    "Serbia": ["Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica"],
    "Croatia": ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar"],
    "Slovakia": ["Bratislava", "Košice", "Prešov", "Žilina", "Nitra"],
    "Iran": ["Tehran", "Mashhad", "Isfahan", "Karaj", "Shiraz"],
    "Iraq": ["Baghdad", "Basra", "Mosul", "Erbil", "Kirkuk"],
    "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
    "Thailand": ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Nakhon Ratchasima"],
    "Vietnam": ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hai Phong", "Can Tho"],
    "Malaysia": ["Kuala Lumpur", "George Town", "Ipoh", "Johor Bahru", "Malacca"],
    "Philippines": ["Manila", "Quezon City", "Davao", "Cebu", "Zamboanga"],
    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"],
    "Pakistan": ["Islamabad", "Karachi", "Lahore", "Faisalabad", "Rawalpindi"],
    "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet"],
    "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
    "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay"],
    "Peru": ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Cusco"],
    "Chile": ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta"],
};

// Varsayılan şehir isimleri (ülke tanımlı değilse)
const defaultCityNames = ["City A", "City B", "City C", "City D", "City E"];

// Şehir verilerini oluştur (marker olmadan, sadece veri)
export function createCityMarkers(regions, mapInstance) {
    // Önceki verileri temizle
    cityDataByRegion = {};

    // Her bölge için bir şehir verisi oluştur
    regions.forEach((region, index) => {
        const countryName = region.properties.ADMIN || region.properties.NAME || "";
        const regionId = region.properties.regionId || `region_${index}`;

        // Ülkeye göre şehir ismini al
        const cityNames = cityNamesByCountry[countryName] || defaultCityNames;
        const regionIndex = parseInt(regionId.split('_')[1]) || 0;
        const cityName = cityNames[regionIndex % cityNames.length];

        // Bölgeye özel kaynak ata
        const resource = assignResourceToRegion(countryName, regionIndex);

        // Şehir verisi
        const cityData = {
            name: cityName,
            country: countryName,
            regionId: regionId,
            population: Math.floor(Math.random() * 5000000) + 100000,
            economy: Math.floor(Math.random() * 100) + 1,
            resource: resource // Bölgeye özel kaynak
        };

        // Bölge ID'sine göre şehir verisini sakla
        cityDataByRegion[regionId] = cityData;
    });

    console.log(`Cities: ${Object.keys(cityDataByRegion).length} şehir verisi oluşturuldu.`);
}

// Zoom seviyesine göre görünürlük (artık kullanılmıyor ama uyumluluk için)
export function updateCityMarkersVisibility(zoom) {
    // Marker olmadığı için boş
}

// Şehir detay panelini aç
export function openCityPanel(cityData) {
    currentOpenCity = cityData;

    const panel = document.getElementById('city-detail-panel');
    if (!panel) return;

    // Panel içeriğini güncelle
    document.getElementById('city-name').textContent = cityData.name;
    document.getElementById('city-country').textContent = cityData.country;
    document.getElementById('city-population').textContent = cityData.population.toLocaleString();
    document.getElementById('city-economy').textContent = cityData.economy;

    // Kaynak bilgisini güncelle
    if (cityData.resource) {
        document.getElementById('city-resource-icon').textContent = cityData.resource.icon;
        document.getElementById('city-resource-name').textContent = cityData.resource.name;
    }

    // Panel'i aç
    panel.classList.add('open');
}

// Şehir detay panelini kapat
export function closeCityPanel() {
    const panel = document.getElementById('city-detail-panel');
    if (panel) {
        panel.classList.remove('open');
    }
    currentOpenCity = null;
}

// City pane oluştur (artık kullanılmıyor ama uyumluluk için)
export function setupCityPane(mapInstance) {
    // Marker olmadığı için boş
}

// Bölge ID'sine göre şehir verisini al
export function getCityDataByRegion(regionId) {
    return cityDataByRegion[regionId] || null;
}
