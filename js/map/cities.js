// ŞEHİR MODÜLÜ - Marker ve Panel Yönetimi

import { assignResourceToRegion, resourcesList } from './resources.js';
import { getSavedData } from './editor.js';
// City page modülünden setCityData'yı dinamik import ile çekeceğiz (circular dependency önleme)

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
    console.log(`DEBUG: createCityMarkers fonksiyonuna ${regions.length} bölge geldi`);

    // Harita verilerini (localStorage) kontrol et
    const savedMapData = window.savedMapData || {}; // Global veya import ile alacağız. 
    // Not: editor.js'den import etmek en doğrusu, aşağıda import ekleyeceğiz.

    // Ülke bazlı sayaçlar
    const countryCityCounters = {};

    // Her bölge için bir şehir verisi oluştur
    regions.forEach((region, index) => {
        const countryName = region.properties.ADMIN || region.properties.NAME || "";
        const regionId = region.properties.regionId || `region_${index} `;

        // Ülke sayacını başlat
        if (!countryCityCounters[countryName]) countryCityCounters[countryName] = 0;

        // İsim listesinden isim seç
        let assignedName;
        const nameList = cityNamesByCountry[countryName] || defaultCityNames;

        if (countryCityCounters[countryName] < nameList.length) {
            assignedName = nameList[countryCityCounters[countryName]];
        } else {
            // Liste bittiyse türet
            assignedName = `${countryName} City ${countryCityCounters[countryName] + 1} `;
        }
        countryCityCounters[countryName]++;

        // Benzersiz şehir ID'si oluştur (SABİT KALMALI)
        const cityId = `CITY_${String(index).padStart(4, '0')} `;

        // Bölgeye özel kaynak ata
        const resource = assignResourceToRegion(countryName, index);

        // Şehir verisi
        const cityData = {
            id: cityId,
            name: assignedName, // Artık gerçek isim
            originalName: assignedName,
            country: countryName,
            regionId: regionId,
            population: Math.floor(Math.random() * 5000000) + 100000,
            economy: Math.floor(Math.random() * 100) + 1,
            resource: resource
        };

        // Benzersiz cityId ile sakla
        cityDataByRegion[cityId] = cityData;
    });


    // DEBUG: Kaç farklı kaynak kullanıldığını kontrol et
    const uniqueResources = new Set();
    Object.values(cityDataByRegion).forEach(city => {
        if (city.resource) {
            uniqueResources.add(city.resource.name);
        }
    });

    console.log(`Cities: ${Object.keys(cityDataByRegion).length} şehir verisi oluşturuldu.`);
    console.log(`Unique Resources: ${uniqueResources.size} farklı kaynak kullanıldı: `, Array.from(uniqueResources));
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

    // Temel istatistikler
    document.getElementById('city-name').textContent = cityData.name;
    document.getElementById('city-country').textContent = cityData.country;
    document.getElementById('city-population').textContent = cityData.population.toLocaleString();
    document.getElementById('city-economy').textContent = cityData.economy;

    // Kaynak bilgisini güncelle (Font Awesome icon)
    if (cityData.resource) {
        const iconElement = document.getElementById('city-resource-icon');
        iconElement.innerHTML = `<i class="${cityData.resource.icon}"></i>`;
        document.getElementById('city-resource-name').textContent = cityData.resource.name;
    }

    // Gelişmiş istatistikler
    const infrastructure = cityData.infrastructure || 1;
    const taxEfficiency = cityData.taxEfficiency || 100;
    const cityValue = cityData.cityValue || 1;
    const buildingCount = (cityData.buildings || []).length;

    document.getElementById('city-infrastructure').textContent = `${infrastructure}/10`;
    document.getElementById('city-tax-efficiency').textContent = `${taxEfficiency}%`;
    document.getElementById('city-value').textContent = `${cityValue}/10`;
    document.getElementById('city-buildings').textContent = buildingCount;

    // "Daha Fazla Detay" butonu için event listener
    const detailBtn = document.getElementById('city-detail-btn');
    if (detailBtn) {
        // Önceki listener'ı temizle
        detailBtn.replaceWith(detailBtn.cloneNode(true));
        const newBtn = document.getElementById('city-detail-btn');
        newBtn.addEventListener('click', () => {
            // Şehir verisini localStorage'a kaydet (sayfa geçişi için)
            try {
                localStorage.setItem('nomos_current_city', JSON.stringify(cityData));
            } catch (e) {
                console.warn('City save error:', e);
            }
            // Şehir sayfasına yönlendir (cityId ile)
            window.location.hash = `city/${cityData.id}`;
            closeCityPanel();
        });
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

// Şehir verisini al (cityId veya regionId ile)
export function getCityDataByRegion(lookupKey) {
    // Önce direkt lookup dene
    let data = cityDataByRegion[lookupKey];

    // Bulunamadıysa, tüm şehirlerde regionId ile ara
    if (!data) {
        data = Object.values(cityDataByRegion).find(city => city.regionId === lookupKey);
    }

    if (data) {
        // --- LIVE DATA MERGE ---
        try {
            const savedRaw = localStorage.getItem('nomos_map_data');
            if (savedRaw) {
                const savedJson = JSON.parse(savedRaw);
                // Region ID (saved key) ile eşleşen veri var mı?
                const savedItem = savedJson[data.regionId];

                if (savedItem) {
                    // İsim değişmiş mi?
                    if (savedItem.name) data.name = savedItem.name;

                    // Kaynak değişmiş mi?
                    if (savedItem.resource) {
                        // savedItem.resource STRING (örn: "Demir")
                        // Bunu objeye çevir
                        const foundRes = resourcesList.find(r => r.name === savedItem.resource);
                        if (foundRes) {
                            data.resource = foundRes;
                        }
                    }
                }
            }
        } catch (e) { console.warn("City merge error:", e); }
    }

    return data || null;
}
