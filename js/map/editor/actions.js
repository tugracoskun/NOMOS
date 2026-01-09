import { state, saveToStorage, addToHistory } from './store.js';
import { getUniqueKey, showNotification, flashLayer } from './utils.js';
import { getProvinceStyle } from '../styles.js';
import { renderEditorContent, showEditorPanel } from './ui.js';
import { triggerScenario, updateMarketPrice } from '../../data/market.js';

export function saveSingleEdit() {
    const key = getUniqueKey(state.currentFeature);
    const newName = document.getElementById('single-name').value;
    const newCountry = document.getElementById('single-country').value;
    const newColor = document.getElementById('single-color').value;
    const newResource = document.getElementById('single-resource').value;

    if (!state.savedData[key]) state.savedData[key] = {};

    state.savedData[key].name = newName;
    state.savedData[key].country = newCountry;

    if (newColor !== "#000000") {
        state.savedData[key].color = newColor;
    } else {
        delete state.savedData[key].color;
    }

    if (newResource) {
        state.savedData[key].resource = newResource;
    } else {
        delete state.savedData[key].resource;
    }

    saveToStorage();
    addToHistory('edit', `"${newName}" (${newCountry}) düzenlendi`);

    if (state.currentLayer) {
        state.currentLayer.setStyle(getProvinceStyle(state.currentFeature));
        flashLayer(state.currentLayer);
    }

    showNotification('✅ Değişiklikler kaydedildi!', 'success');
    renderEditorContent();
}

export function applyMultiColor() {
    const color = document.getElementById('multi-color').value;
    let count = 0;

    state.selectedRegions.forEach(key => {
        if (!state.savedData[key]) state.savedData[key] = {};
        state.savedData[key].color = color;
        count++;
    });

    saveToStorage();
    addToHistory('multi', `${count} bölgeye renk uygulandı`);

    if (state.layerRef) {
        state.layerRef.eachLayer(layer => {
            layer.setStyle(getProvinceStyle(layer.feature));
        });
    }

    showNotification(`✅ ${count} bölge güncellendi!`, 'success');
    renderEditorContent();
}

export function applyMultiResource() {
    const resource = document.getElementById('multi-resource').value;
    if (!resource) return;

    let count = 0;
    state.selectedRegions.forEach(key => {
        if (!state.savedData[key]) state.savedData[key] = {};
        state.savedData[key].resource = resource;
        count++;
    });

    saveToStorage();
    addToHistory('multi', `${count} bölgeye kaynak atandı`);

    showNotification(`✅ ${count} bölgeye kaynak atandı!`, 'success');
    renderEditorContent();
}

export function clearMultiSelection() {
    if (!confirm(`${state.selectedRegions.size} bölgenin verileri silinecek. Emin misiniz?`)) return;

    let count = 0;
    state.selectedRegions.forEach(key => {
        delete state.savedData[key];
        count++;
    });

    saveToStorage();
    addToHistory('delete', `${count} bölge temizlendi`);

    clearSelection();
    showNotification(`✅ ${count} bölge temizlendi!`, 'success');
    renderEditorContent();
}

export function exportData() {
    const dataStr = JSON.stringify(state.savedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nomos-map-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('✅ Veri dışa aktarıldı!', 'success');
}

export function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            Object.assign(state.savedData, imported);
            saveToStorage();

            addToHistory('import', `${Object.keys(imported).length} bölge içe aktarıldı`);
            showNotification('✅ Veri içe aktarıldı!', 'success');
            renderEditorContent();

            if (state.layerRef) {
                state.layerRef.eachLayer(layer => {
                    layer.setStyle(getProvinceStyle(layer.feature));
                });
            }
        } catch (err) {
            showNotification('❌ Geçersiz JSON dosyası!', 'error');
        }
    };
    reader.readAsText(file);
}

export function resetAllData() {
    localStorage.removeItem('nomos_map_data');
    Object.keys(state.savedData).forEach(key => delete state.savedData[key]);
    state.changeHistory = [];

    if (state.layerRef) {
        state.layerRef.eachLayer(layer => {
            layer.setStyle(getProvinceStyle(layer.feature));
        });
    }

    showNotification('✅ Tüm veriler sıfırlandı!', 'success');
    renderEditorContent();
}

export function clearSelection() {
    state.selectedRegions.clear();
    if (state.layerRef) {
        state.layerRef.eachLayer(layer => {
            layer.setStyle(getProvinceStyle(layer.feature));
        });
    }
}

// RESTORED FUNCTION: Çoklu Seçim Mantığı
export function toggleRegionSelection(feature, layer) {
    const key = getUniqueKey(feature);

    if (state.selectedRegions.has(key)) {
        state.selectedRegions.delete(key);
    } else {
        state.selectedRegions.add(key);
    }

    // Görsel güncelleme
    layer.setStyle(getProvinceStyle(feature));

    // Eğer seçim varsa otomatik olarak 'multi' tabına geç
    if (state.selectedRegions.size > 0) {
        state.currentTab = 'multi';
        showEditorPanel();
    } else {
        renderEditorContent(); // Seçim bittiyse paneli güncelle
    }
}

export function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!state.isDevMode) return;

        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (state.currentTab === 'single' && state.currentFeature) {
                saveSingleEdit();
            }
        }

        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportData();
        }

        if (e.key === 'Escape') {
            document.getElementById('map-editor-panel').style.display = 'none';
        }
    });
}

export function attachTabEventListeners() {
    // SINGLE TAB
    const singleSave = document.getElementById('single-save');
    if (singleSave) {
        singleSave.onclick = () => saveSingleEdit();
        document.getElementById('single-cancel').onclick = () => {
            state.currentFeature = null;
            state.currentLayer = null;
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
            // History clear logic can be added to store if needed or direct manipulation
            // For now, simpler to clear array reference in store if exported, or just set length 0
            state.changeHistory.length = 0; // Clear array
            renderEditorContent();
        };
    }

    // MARKET TAB
    if (state.currentTab === 'market') {
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.closest('button').dataset.id;
                const type = e.target.closest('button').dataset.type;
                if (type === 'war') {
                    if (!confirm('⚠️ DİKKAT: Bu senaryo global bir savaşı tetikler ve ekonomiyi derinden sarsar. Emin misiniz?')) return;
                }
                if (triggerScenario(id)) {
                    showNotification(`✅ Senaryo başlatıldı: ${id}`, 'success');
                    renderEditorContent();
                }
            };
        });

        document.querySelectorAll('.market-price-inp').forEach(inp => {
            inp.onchange = (e) => {
                const res = e.target.dataset.resource;
                const val = e.target.value;
                if (updateMarketPrice(res, val)) {
                    showNotification(`${res} fiyatı güncellendi: x${val}`, 'success');
                }
            };
        });
    }
}
