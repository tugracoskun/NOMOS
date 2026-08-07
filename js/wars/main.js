// WARS (SAVAŞLAR) MODÜLÜ - KOMPAKT & ÇOK OYUNCULU HASAR SİSTEMİ
import { gameState } from '../data/state.js';
import { inventory, unitDatabase } from '../hangar/main.js';
import { activeWars, warHistory, getWarLocationName, syncWarsWithMap } from '../data/wars.js';

// ===================================================================
// SAHTE VERİ (MOCK DATA)
// ===================================================================
const neighbors = [
    { id: 'gr', name: 'Yunanistan', code: 'gr', strength: 'Güçlü', relations: -65, alliance: 'NATO' },
    { id: 'sy', name: 'Suriye', code: 'sy', strength: 'Çok Zayıf', relations: -90, alliance: 'Yok' },
    { id: 'ir', name: 'İran', code: 'ir', strength: 'Güçlü', relations: -10, alliance: 'Kısmi' }
];

let activeTab = 'overview';
let selectedWar = null; 
let isDeploying = false; 
let isLeaderboardOpen = false;

const allUnitsFlat = [...unitDatabase.land, ...unitDatabase.air, ...unitDatabase.sea];
const unitDict = {};
allUnitsFlat.forEach(u => unitDict[u.id] = u);

function getFlagUrl(code) {
    return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
}

// ===================================================================
// ANA RENDER FONKSİYONU
// ===================================================================
export function renderWarsPage(container, view = null, warId = null) {
    if (!container) return;
    syncWarsWithMap(); // Her sayfa açıldığında savaş konumlarını güncel harita verisine senkronize et
    activeTab = 'overview';
    selectedWar = null;
    if (view === 'detail' && warId) {
        selectedWar = activeWars.find(w => w.id === warId) ? warId : null;
    }
    isDeploying = false;
    isLeaderboardOpen = false;

    if (!document.getElementById('wars-styles')) {
        const style = document.createElement('style');
        style.id = 'wars-styles';
        style.innerHTML = `
            /* Kompakt Ana Kapsayıcı */
            .wars-page { max-width: 900px; margin: 0 auto; padding: 10px 0; height: calc(100vh - 110px); display: flex; flex-direction: column; color: var(--text-primary); animation: warsFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); font-size: 0.9rem; }
            @keyframes warsFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            
            /* Kompakt Sekmeler */
            .wars-tabs { display: flex; justify-content: center; gap: 6px; padding: 0 0 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; }
            .wars-tab { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); color: var(--text-dim); padding: 6px 14px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border-radius: 6px; display: flex; align-items: center; gap: 6px; transition: all 0.2s; backdrop-filter: blur(4px); }
            .wars-tab:hover { color: var(--text-light); background: rgba(255,255,255,0.1); }
            .wars-tab.active { color: var(--accent-primary); background: rgba(0, 212, 170, 0.1); border-color: rgba(0, 212, 170, 0.3); box-shadow: 0 2px 10px rgba(0, 212, 170, 0.1); text-shadow: 0 0 5px rgba(0,212,170,0.3); }
            .wars-content { flex: 1; overflow-y: auto; padding: 15px 2px; }
            
            /* Kompakt Savaş Listesi (Satırlar) */
            .war-list { display: flex; flex-direction: column; gap: 8px; }
            .war-row { display: grid; grid-template-columns: 2fr 1fr auto; align-items: center; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px 15px; transition: all 0.2s; cursor: pointer; backdrop-filter: blur(8px); }
            .war-row:hover { background: rgba(30, 41, 59, 0.9); transform: translateX(4px); border-color: rgba(0, 212, 170, 0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
            
            .wr-vs-group { display: flex; align-items: center; justify-content: space-between; padding-right: 15px; border-right: 1px solid rgba(255,255,255,0.1); }
            .wr-side { display: flex; align-items: center; gap: 8px; width: 45%; }
            .wr-side.right { flex-direction: row-reverse; text-align: right; }
            .img-flag { width: 24px; height: 16px; object-fit: cover; border-radius: 2px; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
            .img-flag.large { width: 40px; height: 26px; border-radius: 3px; }
            .wr-name { font-size: 0.85rem; font-weight: 700; color: var(--text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .wr-vs-badge { font-size: 0.7rem; font-weight: 900; color: #ef4444; opacity: 0.8; }
            
            .wr-info { display: flex; flex-direction: column; justify-content: center; padding-left: 15px; gap: 2px; }
            .wr-loc { font-size: 0.75rem; color: var(--accent-primary); font-weight: 600; }
            .wr-type { font-size: 0.65rem; color: var(--text-dim); background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 4px; display: inline-block; width: fit-content; }
            
            .wr-actions { font-size: 1rem; color: rgba(255,255,255,0.2); transition: color 0.2s; padding-left: 10px; }
            .war-row:hover .wr-actions { color: var(--accent-primary); }

            /* Kompakt VS Kartı (Detay Sayfası) */
            .war-detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .btn-back { background: rgba(0,0,0,0.4); color: var(--text-dim); border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
            .btn-back:hover { color: var(--text-light); border-color: rgba(255,255,255,0.2); }
            
            .war-card { background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; }
            .wc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .wc-type-badge { font-size: 0.7rem; font-weight: 700; color: #fff; background: rgba(239, 68, 68, 0.8); padding: 3px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .wc-loc { font-size: 0.85rem; color: var(--text-dim); }
            
            .vs-container-compact { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
            .vs-side-c { display: flex; align-items: center; gap: 12px; flex: 1; padding: 10px; border-radius: 8px; transition: all 0.2s; border: 1px solid transparent; }
            .vs-side-c.right { flex-direction: row-reverse; text-align: right; }
            .vs-side-c.supported { background: rgba(0, 212, 170, 0.05); border-color: rgba(0, 212, 170, 0.2); }
            
            .vsc-info { display: flex; flex-direction: column; gap: 3px; }
            .vsc-name { font-size: 1.2rem; font-weight: 800; color: var(--text-light); }
            .vsc-cas { font-size: 0.7rem; color: var(--error-color); font-weight: 600; }
            
            /* Damage Bar (Hasar Barı) */
            .dmg-section { margin: 10px 0 20px 0; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03); cursor: pointer; transition: background 0.2s; position: relative; }
            .dmg-section:hover { background: rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.1); }
            .dmg-section:hover::after { content: 'Sıralamayı Göster'; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--accent-primary); color: #000; font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: bold; pointer-events: none; }
            
            .dmg-labels { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; margin-bottom: 6px; }
            .dl-left { color: #3b82f6; }
            .dl-right { color: #ef4444; }
            
            .dmg-bar-container { width: 100%; height: 12px; background: #ef4444; border-radius: 6px; overflow: hidden; display: flex; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); }
            .dmg-fill-a { height: 100%; background: #3b82f6; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 2px 0 10px rgba(59, 130, 246, 0.8); }
            
            /* Leaderboard (En Çok Hasar Vuranlar) */
            .leaderboard-panel { background: rgba(0,0,0,0.5); border-radius: 8px; padding: 12px; margin-top: 10px; display: none; animation: warsFadeIn 0.2s ease; border: 1px solid rgba(255,255,255,0.05); }
            .leaderboard-panel.open { display: flex; justify-content: space-between; gap: 20px; }
            .lb-col { flex: 1; }
            .lb-title { font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; margin-bottom: 8px; }
            .lb-row { display: flex; justify-content: space-between; font-size: 0.75rem; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.02); }
            .lb-name { color: var(--text-light); font-weight: 600; }
            .lb-dmg { color: var(--accent-primary); font-weight: 700; }
            
            /* Destek Butonları */
            .support-actions { display: flex; justify-content: space-between; gap: 15px; margin-top: 15px; }
            .btn-sup-c { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-light); padding: 10px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
            .btn-sup-c:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }
            .btn-sup-c.active { background: var(--accent-primary); color: #000; border: none; box-shadow: 0 0 15px rgba(0,212,170,0.3); }
            
            /* Deployment Panel (Kompakt) */
            .deploy-panel { background: rgba(0,0,0,0.4); border-radius: 8px; margin-top: 15px; padding: 15px; border: 1px solid rgba(0,212,170,0.3); animation: warsFadeIn 0.3s ease; }
            .deploy-title { font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; display: flex; justify-content: space-between; color: var(--accent-primary); }
            .deploy-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; margin-bottom: 15px; max-height: 200px; overflow-y: auto; padding-right: 5px; }
            .du-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
            .du-top { display: flex; justify-content: space-between; font-size: 0.75rem; }
            .du-name { color: var(--text-light); font-weight: 600; }
            .du-group { display: flex; background: rgba(0,0,0,0.5); border-radius: 4px; height: 26px; }
            .du-btn { background: transparent; border: none; color: var(--text-dim); padding: 0 10px; cursor: pointer; }
            .du-btn:hover { color: var(--accent-primary); }
            .du-input { flex: 1; background: transparent; border: none; color: var(--accent-primary); text-align: center; font-weight: 700; font-size: 0.85rem; width: 100%; outline: none; -moz-appearance: textfield; }
            .du-input::-webkit-outer-spin-button, .du-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            .btn-dispatch { width: 100%; background: var(--success-color); color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.85rem; }
            .btn-dispatch:hover { opacity: 0.9; }

            /* Declare Grid Kompakt */
            .declare-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; }
            .target-card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; }
            .tc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .tc-name { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.95rem; }
            .tc-select { background: rgba(0,0,0,0.5); color: var(--text-light); border: 1px solid rgba(255,255,255,0.1); padding: 6px; border-radius: 4px; width: 100%; margin-bottom: 8px; font-size: 0.8rem; }
            .btn-declare { width: 100%; background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); padding: 8px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 0.8rem; }
            .btn-declare:hover { background: #ef4444; color: #fff; }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="wars-page">
            <div class="wars-tabs">
                <button class="wars-tab active" data-tab="overview">Küresel Çatışmalar</button>
                <button class="wars-tab" data-tab="declare">Yeni Cephe Aç</button>
                <button class="wars-tab" data-tab="history">Tarihi Savaşlar</button>
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
            if (activeTab === 'overview') { selectedWar = null; isDeploying = false; isLeaderboardOpen = false; }
            refreshCurrentTab();
        });
    });
    attachOverviewEvents();
}

function refreshCurrentTab() {
    const content = document.getElementById('wars-content');
    if (!content) return;
    switch (activeTab) {
        case 'overview': content.innerHTML = renderOverviewTab(); attachOverviewEvents(); break;
        case 'declare': content.innerHTML = renderDeclareTab(); attachDeclareEvents(); break;
        case 'history': content.innerHTML = renderHistoryTab(); break;
    }
}

// ===================================================================
// 1. KÜRESEL ÇATIŞMALAR & HASAR SİSTEMİ
// ===================================================================
function renderOverviewTab() {
    if (activeWars.length === 0) {
        return `<div style="text-align:center; padding: 40px; color:var(--text-dim);">Dünyada barış hakim.</div>`;
    }

    if (!selectedWar) {
        const rows = activeWars.map(war => {
            return `
                <div class="war-row" data-war-id="${war.id}">
                    <div class="wr-vs-group">
                        <div class="wr-side">
                            <img src="${getFlagUrl(war.sideA.code)}" class="img-flag" />
                            <span class="wr-name">${war.sideA.name}</span>
                        </div>
                        <div class="wr-vs-badge">VS</div>
                        <div class="wr-side right">
                            <span class="wr-name">${war.sideB.name}</span>
                            <img src="${getFlagUrl(war.sideB.code)}" class="img-flag" />
                        </div>
                    </div>
                    
                    <div class="wr-info">
                        <div class="wr-type">${war.type}</div>
                        <div class="wr-loc"><i class="fa-solid fa-location-dot"></i> ${getWarLocationName(war)}</div>
                    </div>

                    <div class="wr-actions"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            `;
        }).join('');

        return `<div class="war-list">${rows}</div>`;
    }

    const war = activeWars.find(w => w.id === selectedWar);
    if (!war) return '';

    const totalDamage = war.damageA + war.damageB;
    const percentA = totalDamage === 0 ? 50 : (war.damageA / totalDamage) * 100;

    return `
        <div class="war-detail-header">
            <button class="btn-back" id="btn-back-to-list"><i class="fa-solid fa-arrow-left"></i> Geri Dön</button>
        </div>
        
        <div class="war-card">
            <div class="wc-top">
                <div class="wc-type-badge">${war.type}</div>
                <div class="wc-loc" data-page="city" data-view="${war.locationRegionId}" style="cursor: pointer; color: var(--accent-primary); transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--accent-primary)'">
                    <i class="fa-solid fa-crosshairs"></i> ${getWarLocationName(war)} <span style="color: var(--text-dim);">| <i class="fa-regular fa-clock"></i> ${war.duration}</span>
                </div>
            </div>

            <div class="vs-container-compact">
                <!-- SIDE A -->
                <div class="vs-side-c ${war.playerSupportedSide === 'A' ? 'supported' : ''}">
                    <img src="${getFlagUrl(war.sideA.code)}" class="img-flag large" />
                    <div class="vsc-info">
                        <div class="vsc-name">${war.sideA.name}</div>
                        <div class="vsc-cas">Kayıp: ${war.casualtiesA.toLocaleString()}</div>
                    </div>
                </div>
                
                <div style="font-weight:900; font-style:italic; font-size:1.5rem; color:#ef4444; opacity:0.8;">VS</div>

                <!-- SIDE B -->
                <div class="vs-side-c right ${war.playerSupportedSide === 'B' ? 'supported' : ''}">
                    <div class="vsc-info">
                        <div class="vsc-name">${war.sideB.name}</div>
                        <div class="vsc-cas">Kayıp: ${war.casualtiesB.toLocaleString()}</div>
                    </div>
                    <img src="${getFlagUrl(war.sideB.code)}" class="img-flag large" />
                </div>
            </div>

            <!-- HASAR BARI (DAMAGE BAR) -->
            <div class="dmg-section" id="dmg-section">
                <div class="dmg-labels">
                    <div class="dl-left">Hasar: ${war.damageA.toLocaleString()}</div>
                    <div style="color:var(--text-dim);"><i class="fa-solid fa-chart-bar"></i> Liderlik Tablosu</div>
                    <div class="dl-right">Hasar: ${war.damageB.toLocaleString()}</div>
                </div>
                <div class="dmg-bar-container">
                    <div class="dmg-fill-a" style="width: ${percentA}%;"></div>
                </div>
                
                <!-- LEADERBOARD (GİZLİ BAŞLAR) -->
                <div class="leaderboard-panel ${isLeaderboardOpen ? 'open' : ''}">
                    <div class="lb-col">
                        <div class="lb-title">${war.sideA.name} Destekçileri (Top 3)</div>
                        ${war.contributorsA.sort((a,b)=>b.damage-a.damage).slice(0,3).map((c,i) => `
                            <div class="lb-row">
                                <span class="lb-name">${i+1}. ${c.name}</span>
                                <span class="lb-dmg">${c.damage.toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="lb-col">
                        <div class="lb-title">${war.sideB.name} Destekçileri (Top 3)</div>
                        ${war.contributorsB.sort((a,b)=>b.damage-a.damage).slice(0,3).map((c,i) => `
                            <div class="lb-row">
                                <span class="lb-name">${i+1}. ${c.name}</span>
                                <span class="lb-dmg" style="color:#ef4444;">${c.damage.toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- DESTEKLE BUTONLARI -->
            <div class="support-actions">
                ${war.playerSupportedSide === 'A' 
                    ? `<button class="btn-sup-c active" id="btn-toggle-deploy">Hangar'dan Destek Yolla</button>`
                    : `<button class="btn-sup-c btn-pick-side" data-side="A">${war.sideA.name}'ı Destekle</button>`
                }
                ${war.playerSupportedSide === 'B' 
                    ? `<button class="btn-sup-c active" id="btn-toggle-deploy">Hangar'dan Destek Yolla</button>`
                    : `<button class="btn-sup-c btn-pick-side" data-side="B">${war.sideB.name}'ı Destekle</button>`
                }
            </div>
            
            ${isDeploying ? renderDeployPanel(war) : ''}
        </div>
    `;
}

function renderDeployPanel(war) {
    const availableUnits = Object.entries(inventory.military).filter(([id, count]) => count > 0).map(([id, count]) => ({ id, count, meta: unitDict[id] }));

    if (availableUnits.length === 0) return `<div class="deploy-panel">Birlik bulunamadı.</div>`;

    const cards = availableUnits.map(item => {
        const u = item.meta;
        return `
            <div class="du-card">
                <div class="du-top"><span class="du-name">${u.name}</span> <span>${item.count.toLocaleString()}</span></div>
                <div class="du-group">
                    <button class="du-btn dec" data-uid="${u.id}">-</button>
                    <input type="number" class="du-input deploy-val" data-uid="${u.id}" data-max="${item.count}" value="0" min="0" max="${item.count}" />
                    <button class="du-btn inc" data-uid="${u.id}" data-max="${item.count}">+</button>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="deploy-panel">
            <div class="deploy-title"><span>Sevkıyat Planlama</span> <i class="fa-solid fa-xmark" id="btn-close-deploy" style="cursor:pointer; color:var(--text-dim);"></i></div>
            <div class="deploy-grid">${cards}</div>
            <button class="btn-dispatch" id="btn-dispatch-units">Birlikleri Sınır Hattına Teslim Et</button>
        </div>
    `;
}

function attachOverviewEvents() {
    document.querySelectorAll('.war-row').forEach(row => {
        row.addEventListener('click', (e) => {
            selectedWar = e.currentTarget.dataset.warId;
            isDeploying = false;
            isLeaderboardOpen = false;
            refreshCurrentTab();
        });
    });

    const btnBack = document.getElementById('btn-back-to-list');
    if (btnBack) btnBack.addEventListener('click', () => { selectedWar = null; refreshCurrentTab(); });

    const dmgSection = document.getElementById('dmg-section');
    if (dmgSection) {
        dmgSection.addEventListener('click', () => {
            isLeaderboardOpen = !isLeaderboardOpen;
            refreshCurrentTab();
        });
    }

    document.querySelectorAll('.btn-pick-side').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const side = e.currentTarget.dataset.side;
            const war = activeWars.find(w => w.id === selectedWar);
            if (war) {
                war.playerSupportedSide = side;
                isDeploying = true; 
                refreshCurrentTab();
            }
        });
    });

    const btnToggleDeploy = document.getElementById('btn-toggle-deploy');
    if (btnToggleDeploy) btnToggleDeploy.addEventListener('click', () => { isDeploying = !isDeploying; refreshCurrentTab(); });

    const btnCloseDeploy = document.getElementById('btn-close-deploy');
    if (btnCloseDeploy) btnCloseDeploy.addEventListener('click', () => { isDeploying = false; refreshCurrentTab(); });

    document.querySelectorAll('.du-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const uid = e.currentTarget.dataset.uid;
            const isInc = e.currentTarget.classList.contains('inc');
            const input = document.querySelector(`input.deploy-val[data-uid="${uid}"]`);
            if (input) {
                let val = parseInt(input.value) || 0;
                const max = parseInt(input.dataset.max) || 0;
                if (isInc) val = Math.min(val + getStep(max), max);
                else val = Math.max(val - getStep(max), 0);
                input.value = val;
            }
        });
    });

    const btnDispatch = document.getElementById('btn-dispatch-units');
    if (btnDispatch) {
        btnDispatch.addEventListener('click', () => {
            const inputs = document.querySelectorAll('input.deploy-val');
            let totalAttackPower = 0;
            let unitsSent = 0;
            const war = activeWars.find(w => w.id === selectedWar);
            if(!war) return;

            inputs.forEach(input => {
                const uid = input.dataset.uid;
                let val = parseInt(input.value) || 0;
                if (val > 0) {
                    if (val > inventory.military[uid]) val = inventory.military[uid];
                    inventory.military[uid] -= val; 
                    const meta = unitDict[uid];
                    totalAttackPower += meta.attack * val; 
                    unitsSent += val;
                }
            });

            if (unitsSent === 0) return alert('Birlik seçmediniz.');

            // Hasarı 10'la çarpıp büyük sayılar elde edelim ki barda güzel dursun
            const dealtDamage = totalAttackPower * 10;
            const playerName = gameState.role === 'president' ? 'Siz (Başkan)' : 'Siz';

            if (war.playerSupportedSide === 'A') {
                war.damageA += dealtDamage;
                war.casualtiesB += Math.floor(totalAttackPower / 3);
                // Liderlik tablosunu güncelle
                const existing = war.contributorsA.find(c => c.name === playerName);
                if(existing) existing.damage += dealtDamage;
                else war.contributorsA.push({name: playerName, damage: dealtDamage});
            } else {
                war.damageB += dealtDamage;
                war.casualtiesA += Math.floor(totalAttackPower / 3);
                const existing = war.contributorsB.find(c => c.name === playerName);
                if(existing) existing.damage += dealtDamage;
                else war.contributorsB.push({name: playerName, damage: dealtDamage});
            }

            alert(`Başarılı! Hangar'dan ${unitsSent.toLocaleString()} birlik cepheye ulaştı.\nVerilen Hasar: ${dealtDamage.toLocaleString()}`);
            isDeploying = false; 
            refreshCurrentTab(); 
        });
    }
}

function getStep(maxCount) {
    if (maxCount > 10000) return 500;
    if (maxCount > 1000) return 100;
    if (maxCount > 100) return 10;
    return 1;
}

// ===================================================================
// 2. YENİ CEPHE AÇ
// ===================================================================
function renderDeclareTab() {
    return `
        <div style="margin-bottom:15px; font-size:0.85rem; color:var(--text-dim);">Komşu ülkelere farklı tiplerde (Fetih, Darbe) savaş veya operasyon başlatabilirsiniz.</div>
        <div class="declare-grid">
            ${neighbors.map(n => `
                <div class="target-card">
                    <div class="tc-header">
                        <div class="tc-name"><img src="${getFlagUrl(n.code)}" class="img-flag" /> ${n.name}</div>
                        <div style="font-size:0.7rem; color:var(--text-dim);">Güç: ${n.strength}</div>
                    </div>
                    <select class="tc-select" id="wt_${n.id}">
                        <option value="Fetih Harekâtı">Fetih Harekâtı</option>
                        <option value="Askeri Darbe Destek">Askeri Darbe (İç Savaş)</option>
                        <option value="Sınır Ötesi Operasyon">Sınır Ötesi Operasyon</option>
                    </select>
                    <button class="btn-declare" data-target-id="${n.id}">Operasyonu Başlat</button>
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
            const select = document.getElementById(`wt_${targetId}`);
            const warType = select ? select.value : 'Fetih Harekâtı';
            
            if (activeWars.find(w => w.sideB.name === target.name || w.sideA.name === target.name)) {
                return alert(`Şu anda zaten ${target.name} aktif bir çatışmanın içinde!`);
            }

            if (target) {
                if(confirm(`Kendi ülkeniz adına ${target.name} ülkesine "${warType}" başlatmak istediğinizden emin misiniz?`)) {
                    activeWars.push({
                        id: 'w_' + Date.now(),
                        type: warType,
                        sideA: { name: 'Türkiye (Biz)', code: 'tr' }, 
                        sideB: { name: target.name, code: target.code },
                        location: target.name + ' Sınırı',
                        casusBelli: 'Milli Güvenlik Tehdidi',
                        damageA: 0,
                        damageB: 0,
                        casualtiesA: 0,
                        casualtiesB: 0,
                        duration: '1 Gün',
                        playerSupportedSide: 'A',
                        contributorsA: [{name: 'Siz (Başkan)', damage: 0}],
                        contributorsB: []
                    });
                    document.querySelector('.wars-tab[data-tab="overview"]').click();
                }
            }
        });
    });
}

// ===================================================================
// 3. TARİHİ SAVAŞLAR
// ===================================================================
function renderHistoryTab() {
    if (warHistory.length === 0) return `<div class="war-list">Kayıt yok.</div>`;
    return `
        <div class="war-list">
            ${warHistory.map(wh => `
                <div class="war-row" style="grid-template-columns: 1fr auto;">
                    <div>
                        <div style="font-size:0.85rem; font-weight:700; color:var(--text-light); display:flex; align-items:center; gap:8px;">
                            <img src="${getFlagUrl(wh.sideA.code)}" class="img-flag" /> ${wh.sideA.name} 
                            <span style="color:#ef4444; font-size:0.7rem;">VS</span> 
                            ${wh.sideB.name} <img src="${getFlagUrl(wh.sideB.code)}" class="img-flag" />
                        </div>
                        <div style="font-size:0.7rem; color:var(--text-dim); margin-top:4px;">${wh.type} | ${wh.location}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase;">Kazanan</div>
                        <div style="color:var(--success-color); font-weight:800; font-size:0.9rem;">${wh.winner === 'A' ? wh.sideA.name : wh.sideB.name}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
