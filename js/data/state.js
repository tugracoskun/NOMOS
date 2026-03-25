// GLOBAL OYUN DURUMU (STATE) YÖNETİMİ
// Oyuncunun parası, enerjisi ve şehirlerdeki kalıcı değişiklikleri yönetir.

const STATE_KEY = 'nomos_game_state';
const CITY_STORAGE_KEY = 'nomos_map_data'; // Harita verileriyle senkronize

// Varsayılan durum
let gameState = {
    gold: 50000,
    energy: 85,
    maxEnergy: 100,
    role: 'president',
    lastUpdate: Date.now()
};

// Son para hareketleri log'u (max 30)
const transactionLog = [
    { amount: 15400, desc: 'Gümrük Vergisi Gelirleri', time: Date.now() - 1800000, type: 'income' },
    { amount: -12500, desc: 'Kamu Personeli Maaşları', time: Date.now() - 7200000, type: 'expense' },
    { amount: -4500, desc: 'Dönemlik Kurumlar Vergisi', time: Date.now() - 10800000, type: 'expense' },
    { amount: 8200, desc: 'Şehir Vergisi Tahsilatı', time: Date.now() - 14400000, type: 'income' },
    { amount: -1270, desc: 'Merkezi Elektrik Faturası', time: Date.now() - 18000000, type: 'expense' },
    { amount: -3200, desc: 'Yol Bakım & Onarım (Lojistik)', time: Date.now() - 21600000, type: 'expense' },
    { amount: 950, desc: 'Kaynak İhraç Bedeli (Demir)', time: Date.now() - 25200000, type: 'income' },
    { amount: -500, desc: 'Sistem Bakım Aidatı', time: Date.now() - 32400000, type: 'expense' },
];

function logTransaction(amount, desc) {
    transactionLog.unshift({
        amount,
        desc: desc || (amount > 0 ? 'Gelir' : 'Harcama'),
        time: Date.now(),
        type: amount > 0 ? 'income' : 'expense'
    });
    if (transactionLog.length > 30) transactionLog.pop();
}

// Durumu yükle
export function loadState() {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
        gameState = { ...gameState, ...JSON.parse(saved) };
    }
    updateHeaderUI();
    // Gold dropdown init (DOM hazır olunca)
    requestAnimationFrame(() => setTimeout(setupGoldDropdown, 200));
    return gameState;
}

// Mevcut durumu getir (Read-only)
export function getGameState() {
    return { ...gameState };
}

// Durumu kaydet
export function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(gameState));
    updateHeaderUI();
}

// UI Güncelle (Altın ve Enerji)
let lastGoldValue = 0;

export function updateHeaderUI() {
    const goldEl = document.getElementById('global-gold');
    const energyBar = document.getElementById('energy-bar');
    const energyText = document.getElementById('energy-text');

    if (goldEl) {
        const newValue = gameState.gold;
        const oldValue = lastGoldValue;

        // Eğer değer değiştiyse animasyonlu geçiş yap
        if (oldValue !== newValue && oldValue > 0) {
            animateGoldChange(goldEl, oldValue, newValue);
        } else {
            goldEl.textContent = newValue.toLocaleString();
        }

        lastGoldValue = newValue;
    }

    if (energyBar) energyBar.style.width = `${(gameState.energy / gameState.maxEnergy) * 100}%`;
    if (energyText) energyText.textContent = `${gameState.energy} / ${gameState.maxEnergy}`;
}

// Altın değişim animasyonu
function animateGoldChange(element, from, to) {
    const duration = 600; // ms
    const startTime = performance.now();
    const diff = to - from;

    // Renk efekti
    const wrapper = element.closest('.gold-display') || element.parentElement;
    if (wrapper) {
        wrapper.classList.remove('gold-increase', 'gold-decrease');
        wrapper.classList.add(diff > 0 ? 'gold-increase' : 'gold-decrease');
        setTimeout(() => wrapper.classList.remove('gold-increase', 'gold-decrease'), 800);
    }

    // Sayı animasyonu
    function tick(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(from + diff * eased);

        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

// Altın harca / ekle
export function updateGold(amount, description) {
    if (gameState.gold + amount < 0) return false;
    gameState.gold += amount;
    logTransaction(amount, description);

    // Otomatik Vergi Bildirimi (Deneme amaçlı: Eğer harcama > 5000 ise)
    if (amount < -5000 && !description.includes('Vergi')) {
        const nation = nations['tr'] || { name: 'Türkiye', government: 'Başkanlık Cumhuriyeti' };
        const taxMsg = createPurchaseTaxMessage(nation.name, nation.government, description, Math.abs(amount));
        
        // Mesajlar modülü eğer yüklüyse veya mockMessages global ise oraya ekleyelim
        // Gerçek sistemde bu bir backend tetiklemesi olurdu
        import('../messages/data.js').then(module => {
            module.mockMessages.unshift(taxMsg);
            // Yeni mesaj bildirimi tetikle
            window.dispatchEvent(new CustomEvent('new-message-received'));
        });
    }

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
import { createPurchaseTaxMessage } from '../messages/data.js';
import { nations } from './nations.js'; // nations objesini doğrudan import et

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
    // Gold display wrapper'ını bul
    const goldWrapper = document.querySelector('.gold-display');
    if (!goldWrapper) return;

    // Önceki bildirimi temizle
    const existing = goldWrapper.querySelector('.income-toast');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'income-toast';
    notif.innerHTML = `
        <i class="fa-solid fa-coins text-yellow"></i>
        <span>+${amount.toLocaleString()}</span>
        <small>(${source})</small>
    `;

    // Gold display'in child'ı olarak ekle (altında belirir)
    goldWrapper.appendChild(notif);

    // 2.5 saniye sonra kaybolsun
    setTimeout(() => {
        notif.style.animation = 'incomeSlideOut 0.3s ease forwards';
        setTimeout(() => notif.remove(), 300);
    }, 2500);
}

// ========================================
// ALTIN DROPDOWN PANELİ
// ========================================
function setupGoldDropdown() {
    const goldDisplay = document.querySelector('.gold-display');
    if (!goldDisplay || goldDisplay.dataset.dropdownReady) return;
    goldDisplay.dataset.dropdownReady = 'true';
    goldDisplay.style.cursor = 'pointer';

    // Dropdown panel oluştur
    const panel = document.createElement('div');
    panel.className = 'gold-dropdown';
    panel.style.display = 'none';
    goldDisplay.appendChild(panel);

    function formatTimeAgo(ts) {
        const diff = Date.now() - ts;
        if (diff < 60000) return 'Şimdi';
        if (diff < 3600000) return Math.floor(diff / 60000) + ' dk önce';
        if (diff < 86400000) return Math.floor(diff / 3600000) + ' saat önce';
        return Math.floor(diff / 86400000) + ' gün önce';
    }

    function renderPanel() {
        const total = transactionLog.reduce((s, t) => s + t.amount, 0);
        const incomeTotal = transactionLog.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const expenseTotal = transactionLog.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

        panel.innerHTML = `
            <div class="gd-header">
                <h4><i class="fa-solid fa-clock-rotate-left"></i> Son Hareketler</h4>
                <div class="gd-summary">
                    <span class="gd-income"><i class="fa-solid fa-arrow-trend-up"></i> +${incomeTotal.toLocaleString()}</span>
                    <span class="gd-expense"><i class="fa-solid fa-arrow-trend-down"></i> -${expenseTotal.toLocaleString()}</span>
                </div>
            </div>
            <div class="gd-list">
                ${transactionLog.slice(0, 15).map(t => `
                    <div class="gd-item">
                        <div class="gd-item-icon ${t.type}">
                            <i class="fa-solid ${t.type === 'income' ? 'fa-arrow-down-left' : 'fa-arrow-up-right'}"></i>
                        </div>
                        <div class="gd-item-info">
                            <span class="gd-item-desc">${t.desc}</span>
                            <span class="gd-item-time">${formatTimeAgo(t.time)}</span>
                        </div>
                        <span class="gd-item-amount ${t.type}">${t.amount > 0 ? '+' : ''}${t.amount.toLocaleString()} ₳</span>
                    </div>
                `).join('')}
            </div>
            <div class="gd-balance">
                <span>Mevcut Bakiye</span>
                <span class="gd-balance-val">${gameState.gold.toLocaleString()} ₳</span>
            </div>
        `;
    }

    goldDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = panel.style.display !== 'none';
        if (isOpen) {
            panel.style.display = 'none';
        } else {
            renderPanel();
            panel.style.display = 'block';
        }
    });

    document.addEventListener('click', (e) => {
        if (!goldDisplay.contains(e.target)) {
            panel.style.display = 'none';
        }
    });
}
