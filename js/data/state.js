// OYUN DURUMU (GAME STATE)
// Bakiyeler, kullanıcı tercihleri ve kalıcı veriler burada tutulur.

import { createPurchaseTaxMessage } from '../messages/data.js';
import { nations } from './nations.js';

export const gameState = {
    gold: 50000,
    diamonds: 100,
    level: 12,
    xp: 450,
    maxXp: 1000,
    energy: 85,
    maxEnergy: 100,
    role: 'president',
    lastUpdate: Date.now()
};

// LocalStorage Yardımcıları (Burada tanımlıyoruz, dışarıdan import etmiyoruz)
export function saveState() {
    localStorage.setItem('nomos_gamestate', JSON.stringify(gameState));
}

export function loadState() {
    const saved = localStorage.getItem('nomos_gamestate');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(gameState, parsed);
    }
}

// Son para hareketleri log'u (max 30)
export let transactionLog = [
    { id: 1, type: 'income', amount: 950, reason: 'Şehir Vergisi (Istanbul)', time: Date.now() - 10000 },
    { id: 2, type: 'income', amount: 1200, reason: 'İhracat Geliri (Tekstil)', time: Date.now() - 600000 },
    { id: 3, type: 'expense', amount: 2500, reason: 'Altyapı Bakımı', time: Date.now() - 3600000 },
    { id: 4, type: 'income', amount: 8400, reason: 'Maden Satışı', time: Date.now() - 7200000 },
    { id: 5, type: 'expense', amount: 4500, reason: 'Memur Maaşları', time: Date.now() - 86400000 }
];

// Altın güncelleme fonksiyonu
export function updateGold(amount, description = 'Bilinmeyen İşlem') {
    if (gameState.gold + amount < 0) return false;
    gameState.gold += amount;
    
    addTransactionLog(amount, description);

    // Otomatik Vergi Bildirimi
    if (amount < -5000 && !description.includes('Vergi')) {
        const nation = nations['tr'] || { name: 'Türkiye', government: 'Başkanlık Cumhuriyeti' };
        const taxMsg = createPurchaseTaxMessage(nation.name, nation.government, description, Math.abs(amount));
        
        import('../messages/data.js').then(module => {
            if (module.mockMessages) {
                module.mockMessages.unshift(taxMsg);
                window.dispatchEvent(new CustomEvent('new-message-received'));
            }
        });
    }

    // Header güncelleme
    const goldDisplay = document.querySelector('.gold-display span');
    if (goldDisplay) goldDisplay.innerText = gameState.gold.toLocaleString();

    saveState();
    return true;
}

function addTransactionLog(amount, reason) {
    transactionLog.unshift({
        id: Date.now(),
        type: amount >= 0 ? 'income' : 'expense',
        amount: amount,
        reason: reason,
        time: Date.now()
    });
    if (transactionLog.length > 30) transactionLog.pop();
}

// PANEL VE SEKME MANTIĞI
export function toggleGoldDropdown(e) {
    if (e) e.stopPropagation();
    const existing = document.getElementById('gold-info-panel');
    if (existing) { existing.remove(); return; }

    const panel = document.createElement('div');
    panel.className = 'gold-info-panel';
    panel.id = 'gold-info-panel';
    
    panel.innerHTML = `
        <div class="gold-panel-tabs">
            <button class="gold-tab-btn active" data-tab="history">Son Hareketler</button>
            <button class="gold-tab-btn" data-tab="balance">Gelir-Gider Dengesi</button>
        </div>
        <div class="gold-panel-content" id="gold-panel-content"></div>
        <div class="gold-panel-footer">
            <span>Mevcut Bakiye</span>
            <span class="gold-total-balance">${gameState.gold.toLocaleString()} ₳</span>
        </div>
    `;

    document.body.appendChild(panel);

    const closePanel = (ev) => {
        if (!panel.contains(ev.target)) {
            panel.remove();
            document.removeEventListener('click', closePanel);
        }
    };
    setTimeout(() => document.addEventListener('click', closePanel), 10);

    renderPanelTab('history');
    setupTabEvents();
}

function setupTabEvents() {
    const btns = document.querySelectorAll('.gold-tab-btn');
    btns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPanelTab(btn.dataset.tab);
        };
    });
}

function renderPanelTab(tabId) {
    const container = document.getElementById('gold-panel-content');
    if (!container) return;

    if (tabId === 'history') {
        const historyHtml = transactionLog.length > 0 ? 
            transactionLog.slice(0, 15).map(log => `
                <div class="gold-log-item">
                    <div class="gli-left">
                        <div class="gli-icon ${log.type}">
                            <i class="fa-solid ${log.type === 'income' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
                        </div>
                        <div class="gli-info">
                            <div class="gli-reason">${log.reason}</div>
                            <div class="gli-time">${formatLogTime(log.time)}</div>
                        </div>
                    </div>
                    <div class="gli-amount ${log.type === 'income' ? 'plus' : 'minus'}">
                        ${log.type === 'income' ? '+' : ''}${log.amount.toLocaleString()} ₳
                    </div>
                </div>
            `).join('') : '<div class="gold-empty">Henüz hareket bulunmuyor.</div>';
        container.innerHTML = `<div class="gold-history-view">${historyHtml}</div>`;
    } else {
        const totalIncome = transactionLog.filter(l => l.type === 'income').reduce((sum, l) => sum + l.amount, 0);
        const totalExpense = transactionLog.filter(l => l.type === 'expense').reduce((sum, l) => sum + Math.abs(l.amount), 0);
        const netBalance = totalIncome - totalExpense;

        container.innerHTML = `
            <div class="gold-balance-view">
                <div class="gbv-stat-card income">
                    <div class="gbv-label">Toplam Gelir</div>
                    <div class="gbv-value">+${totalIncome.toLocaleString()} ₳</div>
                </div>
                <div class="gbv-stat-card expense">
                    <div class="gbv-label">Toplam Gider</div>
                    <div class="gbv-value">-${totalExpense.toLocaleString()} ₳</div>
                </div>
                <div class="gbv-stat-card net ${netBalance >= 0 ? 'profit' : 'loss'}">
                    <div class="gbv-label">Net Finansal Durum</div>
                    <div class="gbv-value">${netBalance >= 0 ? '+' : ''}${netBalance.toLocaleString()} ₳</div>
                </div>
                <div class="balance-info-note">* Son 30 işlem baz alınmıştır.</div>
            </div>
        `;
    }
}

function formatLogTime(time) {
    const diff = Date.now() - time;
    if (diff < 60000) return 'Şimdi';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' dk önce';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' saat önce';
    return Math.floor(diff / 86400000) + ' gün önce';
}

/**
 * Şehre bina ekler
 */
export function addBuildingToCity(cityId, building) {
    saveState();
}

/**
 * Şehir altyapısını geliştirir
 */
export function upgradeCityInfrastructure(cityId) {
    saveState();
}

/**
 * Mesajı okundu olarak işaretler
 */
export function markMessageAsRead(messageId) {
    // Mesaj modülüyle senkronize çalışır
    saveState();
}

/**
 * Oyun durumunu döndürür (Getter)
 */
export function getGameState() {
    return gameState;
}

/**
 * Hareket günlüğünü döndürür
 */
export function getTransactionLog() {
    return transactionLog;
}

/**
 * Şehirlerden ve kaynaklardan gelen gelir döngüsünü başlatır
 */
export function startIncomeTicker() {
    console.log("NOMOS: Gelir döngüsü başlatıldı.");
    // Gelecekte buraya otomatik gelir-gider hesaplayan interval eklenecek
}
