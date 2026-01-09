import { state } from './store.js';
import { attachTabEventListeners, setupKeyboardShortcuts, clearSelection } from './actions.js';
import {
    renderSingleEditTab, renderMultiSelectTab,
    renderDataTab, renderMarketTab, renderHistoryTab
} from './tabs.js';
import { marketState, initMarket } from '../../data/market.js';

// Market Init
if (Object.keys(marketState).length === 0) initMarket();

export function initEditor(mapInstance, provinceLayer) {
    state.mapRef = mapInstance;
    state.layerRef = provinceLayer;

    // Dev Button
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

export function toggleDevMode() {
    state.isDevMode = !state.isDevMode;
    const btn = document.getElementById('dev-toggle-btn');
    const panel = document.getElementById('map-editor-panel');

    if (state.isDevMode) {
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

export function isEditorActive() { return state.isDevMode; }

export function showEditorPanel() {
    const panel = document.getElementById('map-editor-panel');
    panel.style.display = 'flex';
    renderEditorContent();
}

export function openEditor(feature, layer) {
    state.currentFeature = feature;
    state.currentLayer = layer;
    state.currentTab = 'single';
    showEditorPanel();
}

export function renderEditorContent() {
    const content = document.getElementById('editor-content');
    if (!content) return;

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
            ${generateTabBtn('single', '📍 Tekli Düzenle')}
            ${generateTabBtn('multi', '🎯 Çoklu Seçim')}
            ${generateTabBtn('data', '💾 Veri')}
            ${generateTabBtn('market', '📈 Pazar')}
            ${generateTabBtn('history', '📜 Geçmiş')}
        </div>

        <!-- TAB CONTENT -->
        <div id="editor-tab-content" class="editor-tab-content">
            ${getTabContent()}
        </div>
    `;

    // Event listeners
    document.getElementById('editor-close-btn').onclick = () => {
        document.getElementById('map-editor-panel').style.display = 'none';
    };

    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.onclick = () => {
            state.currentTab = tab.dataset.tab;
            renderEditorContent();
        };
    });

    attachTabEventListeners();
}

function generateTabBtn(id, label) {
    return `
        <button class="editor-tab ${state.currentTab === id ? 'active' : ''}" data-tab="${id}">
            ${label}
        </button>
    `;
}

function getTabContent() {
    switch (state.currentTab) {
        case 'single': return renderSingleEditTab();
        case 'multi': return renderMultiSelectTab();
        case 'data': return renderDataTab();
        case 'market': return renderMarketTab();
        case 'history': return renderHistoryTab();
        default: return '';
    }
}

function injectEditorPanel() {
    if (document.getElementById('map-editor-panel')) return;

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
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'map-editor-panel';
    panel.innerHTML = `<div id="editor-content" style="display:flex; flex-direction:column; height:100%;"></div>`;
    document.body.appendChild(panel);
}
