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

// Şehre bina ekle ve kalıcı olarak kaydet (Altyapı İndirimi Dahil)
export function addBuildingToCity(cityId, buildingId, baseCost) {
    // 1. Şehir verisini çek (Altyapı seviyesi için)
    const cityDataRaw = localStorage.getItem('nomos_current_city');
    let infraLevel = 1;
    let cityData = null;

    if (cityDataRaw) {
        cityData = JSON.parse(cityDataRaw);
        if (cityData.id === cityId) {
            infraLevel = cityData.infrastructure || 1;
        }
    }

    if (!cityData) return { success: false, error: 'Şehir verisi bulunamadı.' };

    // 2. İndirimli Maliyeti Hesapla
    const infraStats = infrastructureLevels[infraLevel];
    const discountMultiplier = infraStats ? infraStats.constructionCost : 1.0;
    const finalCost = Math.floor(baseCost * discountMultiplier);

    // Bakiye kontrolü
    if (gameState.gold < finalCost) return { success: false, error: `Yetersiz altın! (Gereken: ${finalCost.toLocaleString()})` };

    // 3. Altın düş
    gameState.gold -= finalCost;
    saveState();

    // 4. Şehir verisini güncelle
    if (!cityData.buildings) cityData.buildings = [];
    if (!cityData.buildings.includes(buildingId)) {
        cityData.buildings.push(buildingId);
        localStorage.setItem('nomos_current_city', JSON.stringify(cityData));

        // 5. Global harita verisine de işle
        updateGlobalCityData(cityData.regionId, { buildings: cityData.buildings });

        return { success: true, actualCost: finalCost }; // UI için gerçek maliyeti dön
    }

    return { success: false, error: 'Bu bina zaten inşa edilmiş.' };
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

// --- FAZ 4: GELİR DÖNGÜSÜ (TICKER) ---
import { calculateResourceIncome, resourcesEconomics, infrastructureLevels } from './city-stats.js';

let incomeInterval = null;

export function startIncomeTicker() {
    if (incomeInterval) clearInterval(incomeInterval);

    // Her 10 saniyede bir gelir topla
    incomeInterval = setInterval(() => {
        collectIncome();
    }, 10000);
}

function collectIncome() {
    // Şimdilik sadece aktif şehrin gelirini simüle ediyoruz
    // İleride tüm sahip olunan şehirleri dönebiliriz.
    const cityDataRaw = localStorage.getItem('nomos_current_city');
    if (!cityDataRaw) return;

    const cityData = JSON.parse(cityDataRaw);
    const resourceName = cityData.resource?.name;

    if (resourceName && resourcesEconomics[resourceName]) {
        // Gelir hesapla
        const income = calculateResourceIncome(resourceName, 1.0, cityData.infrastructure || 1);

        if (income > 0) {
            updateGold(income);
            showIncomeNotification(income, resourceName);
        }
    }
}

function showIncomeNotification(amount, source) {
    // Basit bir toast bildirimi (DOM'a müdahale)
    const notif = document.createElement('div');
    notif.className = 'income-toast';
    notif.innerHTML = `
        <i class="fa-solid fa-coins text-yellow"></i>
        <span>+${amount.toLocaleString()} </span>
        <small>(${source})</small>
    `;

    // CSS stilleri (inline veya global CSS'te olmalı, burada inline ekliyorum pratiklik için)
    notif.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: rgba(16, 185, 129, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: floatUp 2s forwards;
        font-family: 'Inter', sans-serif;
    `;

    // Animasyon keyframe'ini document'a eklemek yerine basit transition kullanıyoruz
    // veya zaten var olan CSS animasyonlarından faydalanıyoruz.

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateY(-20px)';
        notif.style.transition = 'all 0.5s';
        setTimeout(() => notif.remove(), 500);
    }, 2000);
}
