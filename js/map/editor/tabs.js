import { state } from './store.js';
import { getUniqueKey, guessCountry } from './utils.js';
import { resourcesList as RESOURCES } from '../resources.js';
import { marketState, marketScenarios } from '../../data/market.js';

// --- TAB 1: TEKLİ DÜZENLEME ---
export function renderSingleEditTab() {
    if (!state.currentFeature) {
        return `
            <div style="text-align:center; padding:40px 20px; color:#64748b;">
                <div style="font-size:48px; margin-bottom:16px;">🗺️</div>
                <p>Bir bölgeye tıklayın</p>
            </div>
        `;
    }

    const key = getUniqueKey(state.currentFeature);
    const data = state.savedData[key] || {};
    const currentName = data.name || "";
    const currentCountry = data.country || guessCountry(state.currentFeature);
    const currentColor = data.color || "#000000";
    const currentResource = data.resource || null;

    return `
        <div class="editor-section">
            <div style="background:#0f172a; padding:12px; border-radius:6px; margin-bottom:16px;">
                <div style="color:#64748b; font-size:11px; margin-bottom:4px;">ŞEHİR ID (DEĞİŞTİRİLEMEZ)</div>
                <div style="color:#94a3b8; font-size:13px; font-family:monospace;">${key.substring(0, 30)}...</div>
            </div>

            <!-- İSİM -->
            <div class="editor-field">
                <label class="editor-label">Şehir İsmi (Oyunculara Görünecek)</label>
                <input type="text" id="single-name" value="${currentName}" placeholder="Varsayılan: Otomatik ID" class="editor-input">
            </div>

            <!-- ÜLKE -->
            <div class="editor-field">
                <label class="editor-label">Bağlı Olduğu Ülke</label>
                <input type="text" id="single-country" value="${currentCountry}" class="editor-input">
            </div>

            <!-- RENK -->
            <div class="editor-field">
                <label class="editor-label">Şehir Rengi</label>
                <div style="display:flex; gap:10px; align-items:center;">
                    <input type="color" id="single-color" value="${currentColor}" 
                        style="width:60px; height:40px; border:2px solid #334155; background:#0f172a; border-radius:6px; cursor:pointer;">
                    <span id="single-color-code" style="color:#94a3b8; font-size:13px; font-family:monospace; flex:1;">${currentColor}</span>
                    <button id="single-reset-color" class="editor-btn-secondary">Sıfırla</button>
                </div>
            </div>

            <!-- KAYNAK -->
            <div class="editor-field">
                <label class="editor-label">Üretilen Kaynak</label>
                <select id="single-resource" class="editor-input">
                    <option value="">Kaynak Yok</option>
                    ${RESOURCES.map(r => `
                        <option value="${r.name}" ${currentResource === r.name ? 'selected' : ''}>
                            ${r.name}
                        </option>
                    `).join('')}
                </select>
            </div>

            <!-- KAYDET -->
            <div style="display:flex; gap:10px; margin-top:24px;">
                <button id="single-save" class="editor-btn-primary" style="flex:2;">
                    💾 Kaydet
                </button>
                <button id="single-cancel" class="editor-btn-secondary" style="flex:1;">
                    İptal
                </button>
            </div>

            <!-- HAM VERİ -->
            <details style="margin-top:16px;">
                <summary style="color:#64748b; cursor:pointer; font-size:12px; user-select:none;">
                    Ham Veriyi Göster
                </summary>
                <textarea readonly style="
                    width:100%; height:120px; margin-top:8px;
                    background:#000; color:#0f0; 
                    border:1px solid #334155; border-radius:4px;
                    padding:8px; font-size:11px; font-family:monospace;
                ">${JSON.stringify(state.currentFeature.properties, null, 2)}</textarea>
            </details>
        </div>
    `;
}

// --- TAB 2: ÇOKLU SEÇİM ---
export function renderMultiSelectTab() {
    return `
        <div class="editor-section">
            <div style="background:#0f172a; padding:12px; border-radius:6px; margin-bottom:16px;">
                <div style="color:#64748b; font-size:11px; margin-bottom:4px;">SEÇİLİ BÖLGELER</div>
                <div style="color:#10b981; font-size:24px; font-weight:bold;">${state.selectedRegions.size}</div>
            </div>

            ${state.selectedRegions.size > 0 ? `
                <div class="editor-field">
                    <label class="editor-label">Toplu Renk Uygula</label>
                    <div style="display:flex; gap:10px;">
                        <input type="color" id="multi-color" value="#3b82f6" 
                            style="width:60px; height:40px; border:2px solid #334155; background:#0f172a; border-radius:6px; cursor:pointer;">
                        <button id="multi-apply-color" class="editor-btn-primary" style="flex:1;">
                            🎨 Uygula
                        </button>
                    </div>
                </div>

                <div class="editor-field">
                    <label class="editor-label">Toplu Kaynak Ata</label>
                    <div style="display:flex; gap:10px;">
                        <select id="multi-resource" class="editor-input" style="flex:1;">
                            <option value="">Kaynak Seç</option>
                            ${RESOURCES.map(r => `
                                <option value="${r.name}">${r.name}</option>
                            `).join('')}
                        </select>
                        <button id="multi-apply-resource" class="editor-btn-primary">
                            ⚡ Ata
                        </button>
                    </div>
                </div>

                <button id="multi-clear" class="editor-btn-danger" style="width:100%; margin-top:16px;">
                    🗑️ Seçili Bölgeleri Temizle
                </button>

                <button id="multi-deselect" class="editor-btn-secondary" style="width:100%; margin-top:8px;">
                    ✕ Seçimi Kaldır
                </button>
            ` : `
                <div style="text-align:center; padding:40px 20px; color:#64748b;">
                    <div style="font-size:48px; margin-bottom:16px;">🎯</div>
                    <p>Ctrl tuşuna basılı tutarak<br>birden fazla bölge seçin</p>
                </div>
            `}
        </div>
    `;
}

// --- TAB 3: VERİ YÖNETİMİ ---
export function renderDataTab() {
    const dataCount = Object.keys(state.savedData).length;

    return `
        <div class="editor-section">
            <div style="background:#0f172a; padding:12px; border-radius:6px; margin-bottom:16px;">
                <div style="color:#64748b; font-size:11px; margin-bottom:4px;">KAYITLI BÖLGE</div>
                <div style="color:#3b82f6; font-size:24px; font-weight:bold;">${dataCount}</div>
            </div>

            <div class="editor-field">
                <label class="editor-label">Dışa Aktar</label>
                <button id="data-export" class="editor-btn-primary" style="width:100%;">
                    📥 JSON İndir
                </button>
            </div>

            <div class="editor-field">
                <label class="editor-label">İçe Aktar</label>
                <input type="file" id="data-import-file" accept=".json" style="display:none;">
                <button id="data-import" class="editor-btn-primary" style="width:100%;">
                    📤 JSON Yükle
                </button>
            </div>

            <div class="editor-field">
                <label class="editor-label" style="color:#ef4444;">Tehlikeli Bölge</label>
                <button id="data-reset" class="editor-btn-danger" style="width:100%;">
                    ⚠️ Tüm Verileri Sıfırla
                </button>
            </div>

            <details style="margin-top:16px;">
                <summary style="color:#64748b; cursor:pointer; font-size:12px; user-select:none;">
                    Veri Önizleme
                </summary>
                <textarea readonly style="
                    width:100%; height:200px; margin-top:8px;
                    background:#000; color:#0f0; 
                    border:1px solid #334155; border-radius:4px;
                    padding:8px; font-size:11px; font-family:monospace;
                ">${JSON.stringify(state.savedData, null, 2)}</textarea>
            </details>
        </div>
    `;
}

// --- TAB 4: MARKET ---
export function renderMarketTab() {
    const activeResources = Object.keys(marketState);

    return `
        <div class="editor-section">
            <div style="background:#0f172a; padding:12px; border-radius:6px; margin-bottom:16px;">
                <div style="color:#fbbf24; font-size:11px; margin-bottom:4px;">GLOBAL MARKET DURUMU</div>
                <div style="font-size:13px; color:#cbd5e1;">Arz/Talep dengesini buradan yönetebilirsiniz.</div>
            </div>

            <div style="margin-bottom:24px;">
                <label class="editor-label">Hızlı Senaryolar</label>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    ${marketScenarios.filter(s => s.type !== 'war').map(s => `
                        <button class="scenario-btn ${s.type}" data-id="${s.id}" data-type="${s.type}" 
                            style="
                                padding:10px; border:1px solid #334155; border-radius:8px; 
                                background: ${s.type === 'crisis' ? 'rgba(239,68,68,0.1)' : s.type === 'boom' ? 'rgba(234,179,8,0.1)' : 'rgba(34,197,94,0.1)'};
                                color: ${s.type === 'crisis' ? '#f87171' : s.type === 'boom' ? '#facc15' : '#4ade80'};
                                cursor:pointer; font-weight:600; font-size:12px;
                            ">
                            ${s.type === 'crisis' ? '📉' : s.type === 'boom' ? '🚀' : '🌾'} ${s.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="editor-field">
                <label class="editor-label">Kaynak Çarpanları (x)</label>
                <div style="max-height:250px; overflow-y:auto; padding-right:5px;">
                    ${activeResources.map(res => {
        const val = marketState[res];
        let color = '#94a3b8';
        if (val > 1) color = '#4ade80';
        if (val < 1) color = '#f87171';

        return `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:rgba(255,255,255,0.03); padding:6px 10px; border-radius:6px;">
                            <span style="font-size:12px; color:#e2e8f0;">${res}</span>
                            <input type="number" step="0.1" min="0.1" max="5.0" value="${val}" data-resource="${res}" class="market-price-inp"
                                style="width:60px; background:#1e293b; border:1px solid #334155; color:${color}; border-radius:4px; padding:2px 6px; font-weight:bold;">
                        </div>
                        `;
    }).join('')}
                </div>
            </div>

            <div style="margin-top:24px; border-top:1px solid #334155; padding-top:16px;">
                 <label class="editor-label" style="color:#ef4444;">⚠️ Tehlikeli Bölge</label>
                 ${marketScenarios.filter(s => s.type === 'war').map(s => `
                    <button class="scenario-btn war" data-id="${s.id}" data-type="${s.type}"
                        style="
                            width:100%; padding:12px; background:linear-gradient(90deg, #7f1d1d 0%, #450a0a 100%);
                            border:1px solid #ef4444; color:white; font-weight:bold; border-radius:8px; cursor:pointer;
                            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
                        ">
                        💣 ${s.name} BAŞLAT
                    </button>
                 `).join('')}
            </div>
        </div>
    `;
}

// --- TAB 5: GEÇMİŞ ---
export function renderHistoryTab() {
    return `
        <div class="editor-section">
            <div style="background:#0f172a; padding:12px; border-radius:6px; margin-bottom:16px;">
                <div style="color:#64748b; font-size:11px; margin-bottom:4px;">DEĞİŞİKLİK SAYISI</div>
                <div style="color:#a855f7; font-size:24px; font-weight:bold;">${state.changeHistory.length}</div>
            </div>

            ${state.changeHistory.length > 0 ? `
                <div style="max-height:400px; overflow-y:auto;">
                    ${state.changeHistory.slice().reverse().map((change, idx) => `
                        <div style="
                            background:#0f172a; padding:12px; border-radius:6px; margin-bottom:8px;
                            border-left:3px solid ${change.type === 'edit' ? '#10b981' : change.type === 'multi' ? '#3b82f6' : '#ef4444'};
                        ">
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span style="color:#94a3b8; font-size:12px; font-weight:bold;">
                                    ${change.type === 'edit' ? '✏️ Düzenleme' : change.type === 'multi' ? '🎯 Toplu İşlem' : '🗑️ Silme'}
                                </span>
                                <span style="color:#64748b; font-size:11px;">
                                    ${new Date(change.timestamp).toLocaleTimeString('tr-TR')}
                                </span>
                            </div>
                            <div style="color:#cbd5e1; font-size:12px;">
                                ${change.description}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button id="history-clear" class="editor-btn-secondary" style="width:100%; margin-top:16px;">
                    🗑️ Geçmişi Temizle
                </button>
            ` : `
                <div style="text-align:center; padding:40px 20px; color:#64748b;">
                    <div style="font-size:48px; margin-bottom:16px;">📜</div>
                    <p>Henüz değişiklik yapılmadı</p>
                </div>
            `}
        </div>
    `;
}
