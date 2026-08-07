// SAVAŞ VERİLERİ MODÜLÜ
export const activeWars = [
    { 
        id: 'w1', 
        type: 'Vekalet Savaşı',
        sideA: { name: 'Türkiye', code: 'tr', mapNames: ['Turkey', 'Türkiye'] }, 
        sideB: { name: 'Yunanistan', code: 'gr', mapNames: ['Greece', 'Yunanistan'] }, 
        locationRegionId: 'region_100', 
        locationNameFallback: 'İzmir',
        casusBelli: 'Kıta Sahanlığı İhlali', 
        damageA: 1540000, 
        damageB: 920000, 
        casualtiesA: 8500, 
        casualtiesB: 14200, 
        duration: '14 Gün',
        playerSupportedSide: null,
        contributorsA: [
            {name: 'Nomos_King', damage: 850000}, 
            {name: 'Korkusuz34', damage: 450000}, 
            {name: 'General_X', damage: 240000}
        ],
        contributorsB: [
            {name: 'Spartan99', damage: 600000}, 
            {name: 'Athena_TR', damage: 320000}
        ]
    },
    { 
        id: 'w2', 
        type: 'Fetih Harekâtı',
        sideA: { name: 'Rusya', code: 'ru', mapNames: ['Russia', 'Russian Federation', 'Rusya'] }, 
        sideB: { name: 'Ukrayna', code: 'ua', mapNames: ['Ukraine', 'Ukrayna'] }, 
        locationRegionId: 'region_500', 
        locationNameFallback: 'Donetsk',
        casusBelli: 'Toprak Bütünlüğü', 
        damageA: 4250000, 
        damageB: 3890000, 
        casualtiesA: 125000, 
        casualtiesB: 142500, 
        duration: '18 Ay',
        playerSupportedSide: null,
        contributorsA: [{name: 'BearClaw', damage: 2100000}, {name: 'Ivan_K', damage: 1500000}],
        contributorsB: [{name: 'GhostOfK', damage: 1800000}, {name: 'Liberty1', damage: 1200000}, {name: 'NATO_Sup', damage: 890000}]
    },
    { 
        id: 'w3', 
        type: 'Askeri Darbe',
        sideA: { name: 'Hükümet Güçleri', code: 'cf', mapNames: ['Central African Republic', 'Orta Afrika Cumhuriyeti'] }, 
        sideB: { name: 'İsyancılar', code: 'cd', mapNames: ['Central African Republic'] }, 
        locationRegionId: 'region_800', 
        locationNameFallback: 'Bangui',
        casusBelli: 'Yönetimi Devirme', 
        damageA: 250000, 
        damageB: 450000, 
        casualtiesA: 2100, 
        casualtiesB: 1800, 
        duration: '5 Gün',
        playerSupportedSide: null,
        contributorsA: [{name: 'Loyalist', damage: 150000}],
        contributorsB: [{name: 'ShadowOps', damage: 280000}, {name: 'Merc_1', damage: 170000}]
    }
];

export const warHistory = [
    { 
        id: 'wh1', 
        type: 'Vekalet Savaşı',
        sideA: { name: 'Azerbaycan', code: 'az' },
        sideB: { name: 'Ermenistan', code: 'am' },
        locationRegionId: 'region_200',
        date: '1 Yıl Önce', 
        winner: 'A', 
        damageA: 5500000,
        damageB: 1200000,
        casualtiesA: 2900, 
        casualtiesB: 7800 
    }
];

// Şehirdeki aktif savaşları getirir (Artık haritadaki spesifik regionId ile eşleşir)
export function getWarsForCity(cityData) {
    if (!cityData || !cityData.regionId) return [];
    return activeWars.filter(w => w.locationRegionId === cityData.regionId);
}

// Region ID'ye göre güncel şehir ismini bulur (Kullanıcı ismini değiştirirse dinamik yansır)
export function getWarLocationName(war) {
    let name = war.locationNameFallback || war.locationRegionId;
    let regionId = war.locationRegionId;

    try {
        const lookupRaw = localStorage.getItem('nomos_city_lookup');
        const mapRaw = localStorage.getItem('nomos_map_data');
        
        if (lookupRaw) {
            const lookup = JSON.parse(lookupRaw);
            if (lookup[regionId] && lookup[regionId].name) {
                // Eğer haritada orijinal ID formundaysa (CITY_XXXX) ve harita modifiyeli bir ad barındırmıyorsa yansıt, 
                // Aksi takdirde fallback adını (İzmir vb) göster ki "CITY_XXXX" kadar çirkin durmasın.
                let mappedName = lookup[regionId].name;
                if (!mappedName.startsWith('CITY_')) {
                    name = mappedName;
                }
            }
        }
        
        if (mapRaw) {
            const mapData = JSON.parse(mapRaw);
            if (mapData[regionId] && mapData[regionId].name) {
                name = mapData[regionId].name; // Kullanıcı özel bir isim (Örn: "Yeni İzmir") girdiyse bunu ezerek alır
            }
        }
    } catch (e) {
        console.warn("War location name resolution error:", e);
    }
    return name;
}

// Oyundaki güncel harita verisine bakarak savaşları ait oldukları ülkenin rastgele bir eyaletine bağlar (Eğer varsa)
export function syncWarsWithMap() {
    try {
        const lookupRaw = localStorage.getItem('nomos_city_lookup');
        if (!lookupRaw) return;
        
        const lookup = JSON.parse(lookupRaw);
        const allCities = Object.values(lookup);
        
        activeWars.forEach(war => {
            const possibleCities = allCities.filter(c => {
                const countryMatch = (war.sideA.mapNames && war.sideA.mapNames.includes(c.country)) || 
                                     (war.sideB.mapNames && war.sideB.mapNames.includes(c.country)) ||
                                     c.country === war.sideA.name || 
                                     c.country === war.sideB.name;
                return countryMatch;
            });
            if (possibleCities.length > 0) {
                // Her seferinde aynı şehri seçmesi için ufak bir hash benzeri mantık veya sadece ilkini alıyoruz
                war.locationRegionId = possibleCities[0].regionId;
            }
        });
    } catch (e) {
        console.warn("Could not sync wars with map:", e);
    }
}
