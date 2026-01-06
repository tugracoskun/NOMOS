// GELİŞMİŞ HARİTA EDİTÖRÜ V2.0
import { getProvinceStyle } from './styles.js';
import { resourcesList as RESOURCES } from './resources.js';

// --- STATE MANAGEMENT ---
let isDevMode = false;
let currentFeature = null;
let currentLayer = null;
let mapRef = null;
let layerRef = null;
let selectedRegions = new Set(); // Çoklu seçim için
let changeHistory = []; // Değişiklik geçmişi
let currentTab = 'single'; // 'single', 'multi', 'data', 'history'

// Verileri Hafızadan Çek
const savedData = JSON.parse(localStorage.getItem('nomos_map_data')) || {};

// --- 1. BAŞLAT ---
export function initEditor(mapInstance, provinceLayer) {
    mapRef = mapInstance;
    layerRef = provinceLayer;

    // Gelişmiş Editor Butonu
    const devBtn = L.control({ position: 'bottomright' });
    devBtn.onAdd = function () {
        const div = document.createElement('div');
        div.innerHTML = `
            <button id="dev-toggle-btn" style="
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                color: white;
                border: 2px solid #334155;
                padding: 10px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                margin-bottom: 10px;
                transition: all 0.3s ease;
                font-size: 14px;
            ">
                🛠️ Editor: OFF
            </button>
        `;
        div.onclick = (e) => { e.stopPropagation(); toggleDevMode(); };
        return div;
    };
    devBtn.addTo(mapInstance);

    injectEditorPanel();
    setupKeyboardShortcuts();
}

// --- 2. MODU AÇ/KAPA ---
function toggleDevMode() {
    isDevMode = !isDevMode;
    const btn = document.getElementById('dev-toggle-btn');
    const panel = document.getElementById('map-editor-panel');

    if (isDevMode) {
        btn.innerHTML = "🛠️ Editor: ON";
        btn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
        btn.style.borderColor = "#10b981";
        btn.style.color = "#000";
        btn.style.boxShadow = "0 4px 20px rgba(16,185,129,0.4)";
        document.getElementById('game-map').style.cursor = "crosshair";
        showEditorPanel();
    } else {
        btn.innerHTML = "🛠️ Editor: OFF";
        btn.style.background = "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";
        btn.style.borderColor = "#334155";
        btn.style.color = "#fff";
        btn.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
        panel.style.display = 'none';
        document.getElementById('game-map').style.cursor = "grab";
        clearSelection();
    }
}

export function isEditorActive() { return isDevMode; }

// --- 3. GELİŞMİŞ PANEL ---
function showEditorPanel() {
    const panel = document.getElementById('map-editor-panel');
    panel.style.display = 'flex';
    renderEditorContent();
}

function renderEditorContent() {
    const content = document.getElementById('editor-content');

    content.innerHTML = `
        <!-- HEADER -->
        <div class="editor-header">
            <h3 style="margin:0; color:#fff; font-size:18px; display:flex; align-items:center; gap:8px;">
                <span style="font-size:24px;">🛠️</span>
                Harita Editörü
            </h3>
            <button id="editor-close-btn" style="
                background:none; border:none; color:#94a3b8; cursor:pointer; font-size:20px;
                transition: color 0.2s;
            " onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">✕</button>
        </div>

        <!-- TABS -->
        <div class="editor-tabs">
            <button class="editor-tab ${currentTab === 'single' ? 'active' : ''}" data-tab="single">
                📍 Tekli Düzenle
            </button>
            <button class="editor-tab ${currentTab === 'multi' ? 'active' : ''}" data-tab="multi">
                🎯 Çoklu Seçim
            </button>
            <button class="editor-tab ${currentTab === 'data' ? 'active' : ''}" data-tab="data">
                💾 Veri
            </button>
            <button class="editor-tab ${currentTab === 'history' ? 'active' : ''}" data-tab="history">
                📜 Geçmiş
            </button>
        </div>

        <!-- TAB CONTENT -->
        <div id="editor-tab-content" class="editor-tab-content">
            ${renderTabContent()}
        </div>
    `;

    // Event listeners
    document.getElementById('editor-close-btn').onclick = () => {
        document.getElementById('map-editor-panel').style.display = 'none';
    };

    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.onclick = () => {
            currentTab = tab.dataset.tab;
            renderEditorContent();
        };
    });

    attachTabEventListeners();
}

function renderTabContent() {
    switch (currentTab) {
        case 'single':
            return renderSingleEditTab();
        case 'multi':
            return renderMultiSelectTab();
        case 'data':
            return renderDataTab();
        case 'history':
            return renderHistoryTab();
        default:
            return '';
    }
}

// --- TAB 1: TEKLİ DÜZENLEME ---
function renderSingleEditTab() {
    if (!currentFeature) {
        return `
            <div style="text-align:center; padding:40px 20px; color:#64748b;">
                <div style="font-size:48px; margin-bottom:16px;">🗺️</div>
                <p>Bir bölgeye tıklayın</p>
            </div>
        `;
    }

    const key = getUniqueKey(currentFeature);
    const data = savedData[key] || {};
    const currentName = data.name || guessName(currentFeature);
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
                <input type="text" id="single-name" value="${currentName}" class="editor-input">
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
                ">${JSON.stringify(currentFeature.properties, null, 2)}</textarea>
            </details>
        </div>
    `;
}

// --- TAB 2: ÇOKLU SEÇİM ---
function renderMultiSelectTab() {
    return `
        <div class="editor-section">
            <div style="background:#0f172a; padding:12px; border-radius:6px; margin-bottom:16px;">
                <div style="color:#64748b; font-size:11px; margin-bottom:4px;">SEÇİLİ BÖLGELER</div>
                <div style="color:#10b981; font-size:24px; font-weight:bold;">${selectedRegions.size}</div>
            </div>

            ${selectedRegions.size > 0 ? `
                <!-- TOPLU RENK DEĞİŞTİRME -->
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

                <!-- TOPLU KAYNAK ATAMA -->
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

                <!-- TOPLU SİL -->
                <button id="multi-clear" class="editor-btn-danger" style="width:100%; margin-top:16px;">
                    🗑️ Seçili Bölgeleri Temizle
                </button>

                <!-- SEÇİMİ KALDIR -->
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
function renderDataTab() {
    const dataCount = Object.keys(savedData).length;

    return `
        <div class="editor-section">
            <div style="background:#0f172a; padding:12px; border-radius:6px; margin-bottom:16px;">
                <div style="color:#64748b; font-size:11px; margin-bottom:4px;">KAYITLI BÖLGE</div>
                <div style="color:#3b82f6; font-size:24px; font-weight:bold;">${dataCount}</div>
            </div>

            <!-- EXPORT -->
            <div class="editor-field">
                <label class="editor-label">Dışa Aktar</label>
                <button id="data-export" class="editor-btn-primary" style="width:100%;">
                    📥 JSON İndir
                </button>
            </div>

            <!-- IMPORT -->
            <div class="editor-field">
                <label class="editor-label">İçe Aktar</label>
                <input type="file" id="data-import-file" accept=".json" style="display:none;">
                <button id="data-import" class="editor-btn-primary" style="width:100%;">
                    📤 JSON Yükle
                </button>
            </div>

            <!-- SIFIRLA -->
            <div class="editor-field">
                <label class="editor-label" style="color:#ef4444;">Tehlikeli Bölge</label>
                <button id="data-reset" class="editor-btn-danger" style="width:100%;">
                    ⚠️ Tüm Verileri Sıfırla
                </button>
            </div>

            <!-- VERİ ÖNİZLEME -->
            <details style="margin-top:16px;">
                <summary style="color:#64748b; cursor:pointer; font-size:12px; user-select:none;">
                    Veri Önizleme
                </summary>
                <textarea readonly style="
                    width:100%; height:200px; margin-top:8px;
                    background:#000; color:#0f0; 
                    border:1px solid #334155; border-radius:4px;
                    padding:8px; font-size:11px; font-family:monospace;
                ">${JSON.stringify(savedData, null, 2)}</textarea>
            </details>
        </div>
    `;
}

// --- TAB 4: GEÇMİŞ ---
function renderHistoryTab() {
    return `
        <div class="editor-section">
            <div style="background:#0f172a; padding:12px; border-radius:6px; margin-bottom:16px;">
                <div style="color:#64748b; font-size:11px; margin-bottom:4px;">DEĞİŞİKLİK SAYISI</div>
                <div style="color:#a855f7; font-size:24px; font-weight:bold;">${changeHistory.length}</div>
            </div>

            ${changeHistory.length > 0 ? `
                <div style="max-height:400px; overflow-y:auto;">
                    ${changeHistory.slice().reverse().map((change, idx) => `
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

// --- EVENT LISTENERS ---
function attachTabEventListeners() {
    // SINGLE TAB
    const singleSave = document.getElementById('single-save');
    if (singleSave) {
        singleSave.onclick = () => saveSingleEdit();

        document.getElementById('single-cancel').onclick = () => {
            currentFeature = null;
            currentLayer = null;
            renderEditorContent();
        };

        document.getElementById('single-color').oninput = (e) => {
            document.getElementById('single-color-code').innerText = e.target.value;
        };

        document.getElementById('single-reset-color').onclick = () => {
            document.getElementById('single-color').value = "#000000";
            document.getElementById('single-color-code').innerText = "#000000";
        };
    }

    // MULTI TAB
    const multiApplyColor = document.getElementById('multi-apply-color');
    if (multiApplyColor) {
        multiApplyColor.onclick = () => applyMultiColor();

        document.getElementById('multi-apply-resource').onclick = () => applyMultiResource();
        document.getElementById('multi-clear').onclick = () => clearMultiSelection();
        document.getElementById('multi-deselect').onclick = () => {
            clearSelection();
            renderEditorContent();
        };
    }

    // DATA TAB
    const dataExport = document.getElementById('data-export');
    if (dataExport) {
        dataExport.onclick = () => exportData();

        document.getElementById('data-import').onclick = () => {
            document.getElementById('data-import-file').click();
        };

        document.getElementById('data-import-file').onchange = (e) => importData(e);

        document.getElementById('data-reset').onclick = () => {
            if (confirm('⚠️ TÜM VERİLER SİLİNECEK! Emin misiniz?')) {
                resetAllData();
            }
        };
    }

    // HISTORY TAB
    const historyClear = document.getElementById('history-clear');
    if (historyClear) {
        historyClear.onclick = () => {
            changeHistory = [];
            renderEditorContent();
        };
    }
}

// --- 4. PANELİ AÇ (Tekli Düzenleme İçin) ---
export function openEditor(feature, layer) {
    currentFeature = feature;
    currentLayer = layer;
    currentTab = 'single';
    showEditorPanel();
}

// --- 5. KAYDETME FONKSİYONLARI ---
function saveSingleEdit() {
    const key = getUniqueKey(currentFeature);
    const newName = document.getElementById('single-name').value;
    const newColor = document.getElementById('single-color').value;
    const newResource = document.getElementById('single-resource').value;

    if (!savedData[key]) savedData[key] = {};

    savedData[key].name = newName;

    if (newColor !== "#000000") {
        savedData[key].color = newColor;
    } else {
        delete savedData[key].color;
    }

    if (newResource) {
        savedData[key].resource = newResource;
    } else {
        delete savedData[key].resource;
    }

    localStorage.setItem('nomos_map_data', JSON.stringify(savedData));

    // Geçmişe ekle
    addToHistory('edit', `"${newName}" bölgesi düzenlendi`);

    // Görsel geri bildirim
    if (currentLayer) {
        currentLayer.setStyle(getProvinceStyle(currentFeature));
        flashLayer(currentLayer);
    }

    showNotification('✅ Değişiklikler kaydedildi!', 'success');
    renderEditorContent();
}

function applyMultiColor() {
    const color = document.getElementById('multi-color').value;
    let count = 0;

    selectedRegions.forEach(key => {
        if (!savedData[key]) savedData[key] = {};
        savedData[key].color = color;
        count++;
    });

    localStorage.setItem('nomos_map_data', JSON.stringify(savedData));
    addToHistory('multi', `${count} bölgeye renk uygulandı`);

    // Haritayı yenile
    if (layerRef) {
        layerRef.eachLayer(layer => {
            layer.setStyle(getProvinceStyle(layer.feature));
        });
    }

    showNotification(`✅ ${count} bölge güncellendi!`, 'success');
    renderEditorContent();
}

function applyMultiResource() {
    const resource = document.getElementById('multi-resource').value;
    if (!resource) return;

    let count = 0;
    selectedRegions.forEach(key => {
        if (!savedData[key]) savedData[key] = {};
        savedData[key].resource = resource;
        count++;
    });

    localStorage.setItem('nomos_map_data', JSON.stringify(savedData));
    addToHistory('multi', `${count} bölgeye kaynak atandı`);

    showNotification(`✅ ${count} bölgeye kaynak atandı!`, 'success');
    renderEditorContent();
}

function clearMultiSelection() {
    if (!confirm(`${selectedRegions.size} bölgenin verileri silinecek. Emin misiniz?`)) return;

    let count = 0;
    selectedRegions.forEach(key => {
        delete savedData[key];
        count++;
    });

    localStorage.setItem('nomos_map_data', JSON.stringify(savedData));
    addToHistory('delete', `${count} bölge temizlendi`);

    clearSelection();
    showNotification(`✅ ${count} bölge temizlendi!`, 'success');
    renderEditorContent();
}

// --- 6. VERİ YÖNETİMİ ---
function exportData() {
    const dataStr = JSON.stringify(savedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nomos-map-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('✅ Veri dışa aktarıldı!', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            Object.assign(savedData, imported);
            localStorage.setItem('nomos_map_data', JSON.stringify(savedData));

            addToHistory('import', `${Object.keys(imported).length} bölge içe aktarıldı`);
            showNotification('✅ Veri içe aktarıldı!', 'success');
            renderEditorContent();

            // Haritayı yenile
            if (layerRef) {
                layerRef.eachLayer(layer => {
                    layer.setStyle(getProvinceStyle(layer.feature));
                });
            }
        } catch (err) {
            showNotification('❌ Geçersiz JSON dosyası!', 'error');
        }
    };
    reader.readAsText(file);
}

function resetAllData() {
    localStorage.removeItem('nomos_map_data');
    Object.keys(savedData).forEach(key => delete savedData[key]);
    changeHistory = [];

    // Haritayı yenile
    if (layerRef) {
        layerRef.eachLayer(layer => {
            layer.setStyle(getProvinceStyle(layer.feature));
        });
    }

    showNotification('✅ Tüm veriler sıfırlandı!', 'success');
    renderEditorContent();
}

// --- 7. YARDIMCI FONKSİYONLAR ---
function clearSelection() {
    selectedRegions.clear();
    // Haritadaki seçim görsellerini temizle
    if (layerRef) {
        layerRef.eachLayer(layer => {
            layer.setStyle(getProvinceStyle(layer.feature));
        });
    }
}

function flashLayer(layer) {
    const el = layer.getElement();
    if (el) {
        el.style.transition = "fill 0.3s";
        el.style.fill = "white";
        setTimeout(() => {
            layer.setStyle(getProvinceStyle(layer.feature));
        }, 300);
    }
}

function addToHistory(type, description) {
    changeHistory.push({
        type,
        description,
        timestamp: Date.now()
    });

    // Son 50 değişikliği tut
    if (changeHistory.length > 50) {
        changeHistory.shift();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 99999;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!isDevMode) return;

        // Ctrl+S: Kaydet
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (currentTab === 'single' && currentFeature) {
                saveSingleEdit();
            }
        }

        // Ctrl+E: Export
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportData();
        }

        // Escape: Paneli kapat
        if (e.key === 'Escape') {
            document.getElementById('map-editor-panel').style.display = 'none';
        }
    });
}

function getUniqueKey(feature) {
    if (feature.id) return feature.id;
    const p = feature.properties;
    const rawStr = (p.name || p.NAME || JSON.stringify(p)).replace(/\s/g, '');
    return rawStr;
}

function guessName(feature) {
    const p = feature.properties;
    return p.name || p.NAME || p.Name || p.NAME_1 || p.VARNAME_1 || p.lektur ||
        p.bulgarian_name || p.NUTS3_NAME || p.province || "Bölge";
}

function injectEditorPanel() {
    if (document.getElementById('map-editor-panel')) return;

    // CSS Stilleri
    const style = document.createElement('style');
    style.textContent = `
        #map-editor-panel {
            display: none;
            position: absolute;
            top: 20px;
            right: 20px;
            width: 380px;
            max-height: calc(100vh - 40px);
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border: 2px solid #334155;
            box-shadow: 0 20px 60px rgba(0,0,0,0.9);
            border-radius: 12px;
            z-index: 9999;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            overflow: hidden;
            flex-direction: column;
        }
        
        .editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 2px solid #334155;
            background: rgba(15, 23, 42, 0.5);
        }
        
        .editor-tabs {
            display: flex;
            background: #0f172a;
            border-bottom: 2px solid #334155;
        }
        
        .editor-tab {
            flex: 1;
            padding: 12px 8px;
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s;
            border-bottom: 3px solid transparent;
        }
        
        .editor-tab:hover {
            background: rgba(59, 130, 246, 0.1);
            color: #94a3b8;
        }
        
        .editor-tab.active {
            color: #3b82f6;
            border-bottom-color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
        }
        
        .editor-tab-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        
        .editor-section {
            animation: fadeIn 0.3s ease;
        }
        
        .editor-field {
            margin-bottom: 16px;
        }
        
        .editor-label {
            display: block;
            color: #cbd5e1;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .editor-input {
            width: 100%;
            padding: 10px 12px;
            background: #0f172a;
            border: 2px solid #334155;
            color: white;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .editor-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .editor-btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #000;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .editor-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        
        .editor-btn-secondary {
            background: #334155;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s;
        }
        
        .editor-btn-secondary:hover {
            background: #475569;
        }
        
        .editor-btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .editor-btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'map-editor-panel';
    panel.innerHTML = `<div id="editor-content"></div>`;
    document.getElementById('app-container').appendChild(panel);
}

// --- DIŞARI VERİ ---
export function getSavedData(feature) {
    const key = getUniqueKey(feature);
    return savedData[key] || null;
}

// Çoklu seçim için (events.js'den çağrılacak)
export function toggleRegionSelection(feature) {
    const key = getUniqueKey(feature);
    if (selectedRegions.has(key)) {
        selectedRegions.delete(key);
    } else {
        selectedRegions.add(key);
    }
    renderEditorContent();
    return selectedRegions.has(key);
}