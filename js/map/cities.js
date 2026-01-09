// ŞEHİR MODÜLÜ - Marker ve Panel Yönetimi

import { assignResourceToRegion, resourcesList } from './resources.js';
import { getSavedData } from './editor.js';
// City page modülünden setCityData'yı dinamik import ile çekeceğiz (circular dependency önleme)

let currentOpenCity = null;
let cityDataByRegion = {}; // Bölge ID'sine göre şehir verisi

// Türkiye için örnek şehir isimleri (diğer ülkeler için de genişletilebilir)
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
        const p = region.properties;
        const countryName = p.ADMIN || p.admin || p.NAME || p.name || p.NAME_TR || p.sovereignt || p.SOVEREIGNT || "Bilinmeyen Ülke";
        const regionId = region.properties.regionId || `region_${index} `;

        // Benzersiz şehir ID'si oluştur (SABİT KALMALI)
        const cityId = `CITY_${String(index).padStart(4, '0')}`;

        // Bölgeye özel kaynak ata
        const resource = assignResourceToRegion(countryName, index);

        // Şehir verisi
        const cityData = {
            id: cityId,
            name: cityId, // İsim varsayılan olarak ID ile aynı
            originalName: cityId,
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
// Şehir detay panelini aç
import { getNationData } from '../data/nations.js';

export function openCityPanel(cityData) {
    currentOpenCity = cityData;

    // --- YENİ EKLENTİ: ÜLKE DETAY OVERLAYİ ---
    if (!document.getElementById('nation-panel-style')) {
        const link = document.createElement('link');
        link.id = 'nation-panel-style';
        link.rel = 'stylesheet';
        link.href = 'css/nation-panel.css';
        document.head.appendChild(link);
    }
    openCountryOverlay(cityData);
    // ----------------------------------------

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
    const overlay = document.getElementById('nation-overlay');
    if (overlay) {
        overlay.classList.remove('active');
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

                    // Ülke değişmiş mi?
                    if (savedItem.country) data.country = savedItem.country;

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

// Ülke Overlayi Açma Fonksiyonu
function openCountryOverlay(cityData) {
    let overlay = document.getElementById('nation-overlay');

    // Daha önce varsa kapat (yeni veri ile açılması için)
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => createOverlayContent(cityData), 200);
    } else {
        createOverlayContent(cityData);
    }
}

function createOverlayContent(cityData) {
    let overlay = document.getElementById('nation-overlay');

    // Ülke verisini al (Dynamic Data)
    const nation = getNationData(cityData.country);

    // İttifak etiketlerini oluştur
    const alliancesHtml = (nation.alliances || []).map(a =>
        `<span class="alliance-tag"><i class="fa-solid ${a.icon || 'fa-shield-halved'}"></i> ${a.name}</span>`
    ).join('');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nation-overlay';
        overlay.className = 'nation-overlay';
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <button class="nation-overlay-close" onclick="document.getElementById('nation-overlay').classList.remove('active')">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="nation-panel">
            <!-- Header: Bayrak ve İsim -->
            <div class="nation-header-v2">
                <div class="nation-flag-v2">
                    <img src="${nation.flag}" alt="${nation.name}">
                </div>
                <div class="nation-title-v2">
                    <span class="nation-name-v2">${nation.name}</span>
                    <span class="nation-meta-v2">
                        <i class="fa-solid fa-landmark"></i> ${nation.government} | 
                        <i class="fa-solid fa-ranking-star"></i> #${nation.ranking || '?'}
                    </span>
                </div>
            </div>

            <!-- Lider (Compact) -->
            <div class="leader-row-v2" style="border-left: 3px solid ${nation.color || '#3b82f6'};">
                <div class="leader-avatar-v2"><i class="fa-solid fa-user-tie"></i></div>
                <div class="leader-info-v2">
                    <span class="l-role">${nation.leaderTitle}</span>
                    <span class="l-name">${nation.leader}</span>
                </div>
            </div>

            <!-- İstatistik Grid 3x2 -->
            <div class="stats-grid-v2">
                <div class="stat-box-v2">
                    <span class="val text-gold">${nation.gdp}</span>
                    <span class="lbl">GSYİH</span>
                </div>
                <div class="stat-box-v2">
                    <span class="val text-green">${nation.population}</span>
                    <span class="lbl">Nüfus</span>
                </div>
                <div class="stat-box-v2">
                    <span class="val text-blue">${nation.mainResource || 'Bilinmiyor'}</span>
                    <span class="lbl">Ana Kaynak</span>
                </div>
                <div class="stat-box-v2">
                    <span class="val text-purple">${nation.tech || '0.50'}</span>
                    <span class="lbl">Teknoloji</span>
                </div>
                <!-- Başkent Eklendi -->
                 <div class="stat-box-v2" style="grid-column: span 2;">
                    <span class="val text-white" style="font-size:0.9rem;">${nation.capital || 'Bilinmiyor'}</span>
                    <span class="lbl">Başkent</span>
                </div>
            </div>
            
             <div class="alliance-section-v2">
                <span class="lbl" style="margin-bottom:4px; display:block;">İttifaklar</span>
                <div class="alliance-list-v2">
                    ${alliancesHtml || '<span class="tag-v2">Tarafsız</span>'}
                </div>
             </div>

             <button class="nation-inspect-btn" onclick="window.location.hash = 'country/${encodeURIComponent(nation.name)}'">
                <i class="fa-solid fa-eye"></i> Detaylı İncele
             </button>
        </div>
    `;

    // Aktif yap
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });
}
