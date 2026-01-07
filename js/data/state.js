// GLOBAL OYUN DURUMU (STATE) YÖNETİMİ
// Oyuncunun parası, enerjisi ve şehirlerdeki kalıcı değişiklikleri yönetir.

const STATE_KEY = 'nomos_game_state';
const CITY_STORAGE_KEY = 'nomos_map_data'; // Harita verileriyle senkronize

// Varsayılan durum
let gameState = {
    gold: 50000,
    energy: 85,
    maxEnergy: 100,
    role: 'president', // 'president' veya 'citizen'
    lastUpdate: Date.now()
};

// Durumu yükle
export function loadState() {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
        gameState = { ...gameState, ...JSON.parse(saved) };
    }
    updateHeaderUI();
    return gameState;
}

// Durumu kaydet
export function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(gameState));
    updateHeaderUI();
}

// UI Güncelle (Altın ve Enerji)
export function updateHeaderUI() {
    const goldEl = document.getElementById('global-gold');
    const energyBar = document.getElementById('energy-bar');
    const energyText = document.getElementById('energy-text');

    if (goldEl) goldEl.textContent = gameState.gold.toLocaleString();
    if (energyBar) energyBar.style.width = `${(gameState.energy / gameState.maxEnergy) * 100}%`;
    if (energyText) energyText.textContent = `${gameState.energy} / ${gameState.maxEnergy}`;
}

// Altın harca / ekle
export function updateGold(amount) {
    if (gameState.gold + amount < 0) return false;
    gameState.gold += amount;
    saveState();
    return true;
}

// Şehre bina ekle ve kalıcı olarak kaydet
export function addBuildingToCity(cityId, buildingId, cost) {
    if (gameState.gold < cost) return { success: false, error: 'Yetersiz altın!' };

    // 1. Altın düş
    gameState.gold -= cost;
    saveState();

    // 2. Şehir verisini güncelle
    const cityDataRaw = localStorage.getItem('nomos_current_city');
    if (cityDataRaw) {
        const cityData = JSON.parse(cityDataRaw);
        if (cityData.id === cityId) {
            if (!cityData.buildings) cityData.buildings = [];
            if (!cityData.buildings.includes(buildingId)) {
                cityData.buildings.push(buildingId);
                localStorage.setItem('nomos_current_city', JSON.stringify(cityData));

                // 3. Global harita verisine de işle (Kalıcılık için)
                updateGlobalCityData(cityData.regionId, { buildings: cityData.buildings });
                return { success: true };
            }
        }
    }
    return { success: false, error: 'Şehir verisi bulunamadı.' };
}

// Şehir altyapısını geliştir
export function upgradeCityInfrastructure(cityId, cost) {
    if (gameState.gold < cost) return { success: false, error: 'Yetersiz altın!' };

    const cityDataRaw = localStorage.getItem('nomos_current_city');
    if (cityDataRaw) {
        const cityData = JSON.parse(cityDataRaw);
        if (cityData.id === cityId) {
            if ((cityData.infrastructure || 1) >= 10) return { success: false, error: 'Maksimum seviyeye ulaşıldı!' };

            gameState.gold -= cost;
            cityData.infrastructure = (cityData.infrastructure || 1) + 1;

            localStorage.setItem('nomos_current_city', JSON.stringify(cityData));
            updateGlobalCityData(cityData.regionId, { infrastructure: cityData.infrastructure });
            saveState();
            return { success: true, newLevel: cityData.infrastructure };
        }
    }
    return { success: false, error: 'Şehir verisi bulunamadı.' };
}

// Global harita verisini (nomos_map_data) güncelle
function updateGlobalCityData(regionId, newData) {
    try {
        const raw = localStorage.getItem(CITY_STORAGE_KEY);
        let mapData = raw ? JSON.parse(raw) : {};

        if (!mapData[regionId]) mapData[regionId] = {};
        mapData[regionId] = { ...mapData[regionId], ...newData };

        localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(mapData));
    } catch (e) {
        console.error("Global data update error:", e);
    }
}
