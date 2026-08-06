// WARS (SAVAŞLAR) MODÜLÜ
// Oyuncunun aktif cepheleri, savaş ilan etme seçenekleri ve muharebe geçmişi

import { gameState } from '../data/state.js';

// ===================================================================
// SAHTE VERİ (MOCK DATA)
// ===================================================================
const activeWars = [
    { 
        id: 'w1', 
        enemy: 'Yunanistan', 
        flag: '🇬🇷', 
        casusBelli: 'Kıta Sahanlığı İhlali', 
        warScore: 15, 
        playerCasualties: 8500, 
        enemyCasualties: 14200, 
        duration: '14 Gün',
        status: 'advantage',
    },
    { 
        id: 'w2', 
        enemy: 'Suriye', 
        flag: '🇸🇾', 
        casusBelli: 'Sınır Güvenliği', 
        warScore: 45, 
        playerCasualties: 2100, 
        enemyCasualties: 24500, 
        duration: '2 Ay',
        status: 'advantage', 
    },
    { 
        id: 'w3', 
        enemy: 'İran', 
        flag: '🇮🇷', 
        casusBelli: 'Bölgesel Nüfuz', 
        warScore: -12, 
        playerCasualties: 18400, 
        enemyCasualties: 15200, 
        duration: '5 Gün',
        status: 'disadvantage', 
    }
];

const warHistory = [
    { 
        id: 'wh1', 
        enemy: 'Suriye Terör Unsurları', 
        flag: '🇸🇾', 
        date: '2 Ay Önce', 
        result: 'victory', 
        loot: '4,500,000 ₳', 
        playerCasualties: 1200, 
        enemyCasualties: 9800 
    }
];

const neighbors = [
    { id: 'gr', name: 'Yunanistan', flag: '🇬🇷', strength: 'Güçlü', relations: -65, alliance: 'NATO' },
    { id: 'bg', name: 'Bulgaristan', flag: '🇧🇬', strength: 'Zayıf', relations: 10, alliance: 'NATO' },
    { id: 'sy', name: 'Suriye', flag: '🇸🇾', strength: 'Çok Zayıf', relations: -90, alliance: 'Yok' },
    { id: 'ir', name: 'İran', flag: '🇮🇷', strength: 'Güçlü', relations: -10, alliance: 'Kısmi' }
];

let activeTab = 'overview';
let selectedWar = null; // null ise liste gösterilir, id varsa o savaşın sayfası gösterilir.

// ===================================================================
// ANA RENDER FONKSİYONU
// ===================================================================
export function renderWarsPage(container) {
    if (!container) return;
    activeTab = 'overview';
    selectedWar = null;

    if (!document.getElementById('wars-styles')) {
        const style = document.createElement('style');
        style.id = 'wars-styles';
        style.innerHTML = `
            .wars-page { max-width: 980px; margin: 0 auto; padding: 16px 0; height: calc(100vh - 130px); display: flex; flex-direction: column; color: var(--text-primary); animation: warsFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes warsFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes warsPulseGlow { 0% { box-shadow: 0 0 10px rgba(0, 212, 170, 0.2); } 50% { box-shadow: 0 0 20px rgba(0, 212, 170, 0.5); } 100% { box-shadow: 0 0 10px rgba(0, 212, 170, 0.2); } }
            
            .wars-tabs { display: flex; justify-content: center; gap: 8px; padding: 0 0 15px 0; border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; }
            .wars-tab { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); color: var(--text-dim); padding: 10px 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border-radius: 12px; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; backdrop-filter: blur(4px); }
            .wars-tab:hover { color: var(--text-light); background: rgba(255,255,255,0.08); transform: translateY(-2px); }
            .wars-tab.active { color: var(--accent-primary); background: rgba(0, 212, 170, 0.1); border-color: rgba(0, 212, 170, 0.3); box-shadow: 0 4px 15px rgba(0, 212, 170, 0.15); text-shadow: 0 0 8px rgba(0,212,170,0.4); }
            .wars-content { flex: 1; overflow-y: auto; padding: 25px 5px; }
            
            /* Savaş Listesi (Satırlar) - Glassmorphism Update */
            .war-list { display: flex; flex-direction: column; gap: 12px; }
            .war-row { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr auto; align-items: center; background: rgba(30, 41, 59, 0.45); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px 24px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); border-left: 4px solid transparent; cursor: pointer; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
            .war-row:hover { background: rgba(30, 41, 59, 0.7); transform: translateX(8px); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.15); }
            
            .war-row.advantage { border-left-color: var(--success-color, #22c55e); }
            .war-row.disadvantage { border-left-color: var(--error-color, #ef4444); }
            .war-row.stalemate { border-left-color: var(--warning-color, #f59e0b); }
            
            .wr-info { display: flex; align-items: center; gap: 18px; }
            .wr-flag { font-size: 2rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)); transition: transform 0.3s; }
            .war-row:hover .wr-flag { transform: scale(1.1) rotate(-3deg); }
            .wr-name-group { display: flex; flex-direction: column; gap: 4px; }
            .wr-enemy { font-size: 1.15rem; font-weight: 800; color: var(--text-light); letter-spacing: 0.5px; }
            .wr-cb { font-size: 0.75rem; color: var(--text-dim); background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 6px; display: inline-block; width: fit-content; }
            
            .wr-stat { display: flex; flex-direction: column; text-align: center; justify-content: center; }
            .wr-stat-label { font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px; letter-spacing: 1px; font-weight: 600; }
            .wr-stat-val { font-size: 1.2rem; font-weight: 800; }
            .wr-stat-val.good { color: var(--success-color, #22c55e); text-shadow: 0 0 12px rgba(34,197,94,0.4); }
            .wr-stat-val.bad { color: var(--error-color, #ef4444); text-shadow: 0 0 12px rgba(239,68,68,0.4); }
            
            .wr-actions { font-size: 1.4rem; color: rgba(255,255,255,0.2); transition: all 0.3s; display: flex; align-items: center; }
            .war-row:hover .wr-actions { color: var(--accent-primary); transform: translateX(5px); text-shadow: 0 0 10px rgba(0,212,170,0.5); }

            /* Savaş Detay Sayfası (Premium Büyük Kart) */
            .war-detail-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; animation: warsFadeIn 0.4s ease; }
            .btn-back { background: rgba(0,0,0,0.25); color: var(--text-dim); border: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 10px; backdrop-filter: blur(5px); }
            .btn-back:hover { background: rgba(255,255,255,0.1); color: var(--text-light); transform: translateX(-5px); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
            
            .war-card { background: linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 30px; margin-bottom: 25px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.6); border-left: 5px solid var(--accent-primary); animation: warsFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; }
            .war-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }
            
            .war-card.advantage { border-left-color: var(--success-color, #22c55e); }
            .war-card.disadvantage { border-left-color: var(--error-color, #ef4444); }
            .war-card.stalemate { border-left-color: var(--warning-color, #f59e0b); }
            
            .war-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px; }
            .war-enemy { display: flex; align-items: center; gap: 18px; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px; }
            .war-flag { font-size: 2.8rem; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.5)); }
            .war-cb { font-size: 0.85rem; color: var(--accent-primary); background: rgba(0,212,170,0.05); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(0,212,170,0.2); letter-spacing: 0.5px; }
            
            .war-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 30px; }
            .ws-box { background: rgba(0,0,0,0.25); padding: 25px 20px; border-radius: 16px; text-align: center; border: 1px solid rgba(255,255,255,0.04); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); }
            .ws-box:hover { background: rgba(0,0,0,0.4); transform: translateY(-5px); border-color: rgba(255,255,255,0.1); box-shadow: inset 0 2px 20px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.3); }
            .ws-label { font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; font-weight: 600; }
            .ws-val { font-size: 2.2rem; font-weight: 900; color: var(--text-light); }
            .ws-val.good { color: var(--success-color, #22c55e); text-shadow: 0 0 20px rgba(34,197,94,0.5); }
            .ws-val.bad { color: var(--error-color, #ef4444); text-shadow: 0 0 20px rgba(239,68,68,0.5); }
            
            .war-actions { display: flex; gap: 15px; justify-content: flex-end; }
            
            .btn-war { background: var(--accent-primary); color: #000; border: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.3s; box-shadow: 0 0 15px rgba(0,212,170,0.4); font-size: 1rem; }
            .btn-war:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 0 25px rgba(0,212,170,0.6); background: #14f1c3; }
            
            .btn-peace { background: rgba(255,255,255,0.03); color: var(--text-light); border: 1px solid rgba(255,255,255,0.1); padding: 14px 28px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s; backdrop-filter: blur(5px); font-size: 1rem; }
            .btn-peace:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }

            /* Declare War Grid (Premium Tasarım) */
            .declare-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
            .target-card { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 22px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; }
            .target-card:hover { transform: translateY(-6px); border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 15px 30px -5px rgba(239, 68, 68, 0.15); background: rgba(30, 41, 59, 0.8); }
            .target-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .target-name { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.3rem; }
            .btn-declare { width: 100%; background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s; letter-spacing: 0.5px; }
            .btn-declare:hover { background: #ef4444; color: #fff; box-shadow: 0 0 20px rgba(239,68,68,0.5); transform: translateY(-2px); }
            
            /* History List (Premium) */
            .history-list { display: flex; flex-direction: column; gap: 15px; }
            .history-item { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px 25px; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s; }
            .history-item:hover { background: rgba(30, 41, 59, 0.7); border-color: rgba(255,255,255,0.15); transform: translateX(5px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="wars-page">
            <div class="wars-tabs">
                <button class="wars-tab active" data-tab="overview">
                    <i class="fa-solid fa-crosshairs"></i> Aktif Cepheler
                </button>
                <button class="wars-tab" data-tab="declare">
                    <i class="fa-solid fa-fire-flame-curved"></i> Savaş İlan Et
                </button>
                <button class="wars-tab" data-tab="history">
                    <i class="fa-solid fa-book-journal-whills"></i> Muharebe Raporları
                </button>
            </div>
            <div class="wars-content" id="wars-content">
                ${renderOverviewTab()}
            </div>
        </div>
    `;

    initWarsEvents();
}

function initWarsEvents() {
    document.querySelectorAll('.wars-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.wars-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.dataset.tab;
            
            // Sekme değiştiğinde seçili savaşı sıfırla ki listeye dönsün
            if (activeTab === 'overview') selectedWar = null;
            
            refreshCurrentTab();
        });
    });

    attachOverviewEvents();
}

function refreshCurrentTab() {
    const content = document.getElementById('wars-content');
    if (!content) return;
    
    switch (activeTab) {
        case 'overview': 
            content.innerHTML = renderOverviewTab(); 
            attachOverviewEvents();
            break;
        case 'declare': 
            content.innerHTML = renderDeclareTab(); 
            attachDeclareEvents(); 
            break;
        case 'history': 
            content.innerHTML = renderHistoryTab(); 
            break;
    }
}

// ===================================================================
// 1. AKTİF CEPHELER
// ===================================================================
function renderOverviewTab() {
    if (activeWars.length === 0) {
        return `
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; color:var(--text-dim);">
                <i class="fa-solid fa-dove" style="font-size:4rem; margin-bottom:20px; opacity:0.3;"></i>
                <h2>Barış Zamanı</h2>
                <p>Şu anda ülkenizin aktif olarak dahil olduğu bir savaş bulunmuyor.</p>
            </div>
        `;
    }

    // EĞER BİR SAVAŞ SEÇİLİ DEĞİLSE, LİSTEYİ GÖSTER
    if (!selectedWar) {
        const rows = activeWars.map(war => {
            const scoreColor = war.warScore > 0 ? 'good' : (war.warScore < 0 ? 'bad' : '');
            const scoreSign = war.warScore > 0 ? '+' : '';
            return `
                <div class="war-row ${war.status}" data-war-id="${war.id}">
                    <div class="wr-info">
                        <span class="wr-flag">${war.flag}</span>
                        <div class="wr-name-group">
                            <div class="wr-enemy">${war.enemy} Savaşı</div>
                            <div class="wr-cb">${war.casusBelli}</div>
                        </div>
                    </div>
                    
                    <div class="wr-stat">
                        <div class="wr-stat-label">Savaş Skoru</div>
                        <div class="wr-stat-val ${scoreColor}">${scoreSign}${war.warScore}%</div>
                    </div>
                    
                    <div class="wr-stat">
                        <div class="wr-stat-label">Düşman Zayiatı</div>
                        <div class="wr-stat-val good">${war.enemyCasualties.toLocaleString()}</div>
                    </div>
                    
                    <div class="wr-stat">
                        <div class="wr-stat-label">Bizim Zayiatımız</div>
                        <div class="wr-stat-val bad">${war.playerCasualties.toLocaleString()}</div>
                    </div>

                    <div class="wr-actions">
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div style="margin-bottom:20px;">
                <h2 style="font-size:1.2rem; margin-bottom:5px;">Aktif Muharebe Alanları</h2>
                <p style="color:var(--text-dim); font-size:0.9rem;">Detaylarını görmek ve birlik sevk etmek istediğiniz cepheyi seçin.</p>
            </div>
            <div class="war-list">${rows}</div>
        `;
    }

    // BİR SAVAŞ SEÇİLİYSE, DETAY SAYFASINI (KART) GÖSTER
    const war = activeWars.find(w => w.id === selectedWar);
    if (!war) return '';

    const scoreColor = war.warScore > 0 ? 'good' : (war.warScore < 0 ? 'bad' : '');
    const scoreSign = war.warScore > 0 ? '+' : '';

    return `
        <div class="war-detail-header">
            <button class="btn-back" id="btn-back-to-list"><i class="fa-solid fa-arrow-left"></i> Cephelere Dön</button>
        </div>
        
        <div class="war-card ${war.status}">
            <div class="war-header">
                <div class="war-enemy">
                    <span class="war-flag">${war.flag}</span>
                    ${war.enemy} Savaşı
                    <span class="war-cb"><i class="fa-solid fa-scale-unbalanced"></i> ${war.casusBelli}</span>
                </div>
                <div style="color:var(--text-dim);"><i class="fa-regular fa-clock"></i> Süre: ${war.duration}</div>
            </div>
            
            <div class="war-stats">
                <div class="ws-box">
                    <div class="ws-label">Savaş Skoru</div>
                    <div class="ws-val ${scoreColor}">${scoreSign}${war.warScore}%</div>
                </div>
                <div class="ws-box">
                    <div class="ws-label">Düşman Zayiatı</div>
                    <div class="ws-val good">${war.enemyCasualties.toLocaleString()}</div>
                </div>
                <div class="ws-box">
                    <div class="ws-label">Kendi Zayiatımız</div>
                    <div class="ws-val bad">${war.playerCasualties.toLocaleString()}</div>
                </div>
            </div>

            <div class="war-actions">
                <button class="btn-peace"><i class="fa-solid fa-handshake"></i> Barış Müzakeresi</button>
                <button class="btn-war" onclick="alert('Askeri birlikler cepheye sevk ediliyor...')">
                    <i class="fa-solid fa-location-crosshairs"></i> Cepheye Birlik Gönder
                </button>
            </div>
        </div>
    `;
}

function attachOverviewEvents() {
    // Listede bir savaşa tıklanınca
    document.querySelectorAll('.war-row').forEach(row => {
        row.addEventListener('click', (e) => {
            selectedWar = e.currentTarget.dataset.warId;
            refreshCurrentTab();
        });
    });

    // Detay sayfasında Geri Dön butonuna tıklanınca
    const btnBack = document.getElementById('btn-back-to-list');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            selectedWar = null;
            refreshCurrentTab();
        });
    }
}

// ===================================================================
// 2. SAVAŞ İLAN ET
// ===================================================================
function renderDeclareTab() {
    return `
        <div class="declare-grid">
            ${neighbors.map(n => `
                <div class="target-card">
                    <div class="target-header">
                        <div class="target-name"><span style="font-size:1.5rem;">${n.flag}</span> ${n.name}</div>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:0.9rem; color:var(--text-dim);">
                        <span><i class="fa-solid fa-shield-halved"></i> Güç: ${n.strength}</span>
                    </div>
                    <button class="btn-declare" data-target-id="${n.id}">
                        <i class="fa-solid fa-skull"></i> Savaş İlan Et
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function attachDeclareEvents() {
    document.querySelectorAll('.btn-declare').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.targetId;
            const target = neighbors.find(n => n.id === targetId);
            if (target) {
                if(confirm(`${target.name} ülkesine savaş ilan etmek istediğinizden emin misiniz?`)) {
                    alert('Askeri hazırlıklar başladı!');
                }
            }
        });
    });
}

// ===================================================================
// 3. MUHAREBE RAPORLARI
// ===================================================================
function renderHistoryTab() {
    if (warHistory.length === 0) {
        return `<div class="history-list"><div style="color:var(--text-dim);">Geçmiş savaş kaydı bulunamadı.</div></div>`;
    }

    return `
        <div class="history-list">
            ${warHistory.map(wh => `
                <div class="history-item">
                    <div class="hi-left">
                        <div class="hi-enemy"><span style="font-size:1.2rem;">${wh.flag}</span> ${wh.enemy}</div>
                        <div class="hi-date"><i class="fa-regular fa-calendar"></i> ${wh.date}</div>
                        <div style="font-size:0.8rem; color:var(--text-dim); margin-top:5px;">
                            Kayıplar: Biz ${wh.playerCasualties.toLocaleString()} — Düşman ${wh.enemyCasualties.toLocaleString()}
                        </div>
                    </div>
                    <div class="hi-right">
                        <div class="hi-result ${wh.result}">${wh.result === 'victory' ? 'ZAFER' : 'HEZİMET'}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
