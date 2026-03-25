// HARİTA MODLARI SİSTEMİ
// Haritayı farklı perspektiflerden görüntüleme

import { toggleStatisticsPanel } from './statistics-panel.js';
import { showSeaRoutes, hideSeaRoutes } from './routes.js';

export const mapModes = {
    default: {
        id: 'default',
        name: 'Varsayılan',
        icon: 'fa-solid fa-map',
        description: 'Normal harita görünümü',
        colorScheme: null // Varsayılan renkler
    },
    buildings: {
        id: 'buildings',
        name: 'Yapılar',
        icon: 'fa-solid fa-city',
        description: 'Şehirlerdeki bina sayısına göre',
        colorScheme: {
            low: '#fee2e2',    // Kırmızı açık (0-2 bina)
            medium: '#fbbf24', // Sarı (3-5 bina)
            high: '#22c55e'    // Yeşil (6+ bina)
        },
        getValue: (cityData) => (cityData.buildings || []).length
    },
    alliances: {
        id: 'alliances',
        name: 'İttifaklar',
        icon: 'fa-solid fa-handshake',
        description: 'Ülkeler arası ittifakları gösterir',
        colorScheme: {
            // Her ittifak farklı renk alacak
            colors: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
        },
        getValue: (countryData) => countryData.allianceId || null
    },
    wars: {
        id: 'wars',
        name: 'Savaşlar',
        icon: 'fa-solid fa-burst',
        description: 'Aktif savaş bölgelerini gösterir',
        colorScheme: {
            atWar: '#ef4444',     // Kırmızı (savaşta)
            neutral: '#64748b',   // Gri (nötr)
            allied: '#22c55e'     // Yeşil (müttefik)
        },
        getValue: (countryData) => countryData.atWar || false
    },
    statistics: {
        id: 'statistics',
        name: 'Eyalet Değeri',
        icon: 'fa-solid fa-star',
        description: 'Eyaletlerin değer puanlaması',
        colorScheme: null,
        hasPanel: true // Bu mod özel bir panel açar
    },
    technology: {
        id: 'technology',
        name: 'Teknoloji',
        icon: 'fa-solid fa-flask',
        description: 'Teknoloji seviyesine göre',
        colorScheme: {
            low: '#fee2e2',
            medium: '#dbeafe',
            high: '#c084fc'
        },
        getValue: (cityData) => cityData.techIndex || 0
    },
    infrastructure: {
        id: 'infrastructure',
        name: 'Altyapı',
        icon: 'fa-solid fa-road',
        description: 'Altyapı seviyesine göre (1-10)',
        colorScheme: {
            gradient: ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e']
        },
        getValue: (cityData) => cityData.infrastructure || 1
    },
    population: {
        id: 'population',
        name: 'Nüfus',
        icon: 'fa-solid fa-users',
        description: 'Nüfus yoğunluğuna göre',
        colorScheme: {
            gradient: ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a']
        },
        getValue: (cityData) => cityData.population || 0
    },
    trade: {
        id: 'trade',
        name: 'Ticaret',
        icon: 'fa-solid fa-ship',
        description: 'Deniz ticaret rotalarını gösterir',
        colorScheme: null,
        hasToggle: true // Bu mod toggle açar/kapat
    },
    government: {
        id: 'government',
        name: 'Yönetim',
        icon: 'fa-solid fa-crown',
        description: 'Ülkelerin yönetim biçimlerine göre',
        colorScheme: {
            'Presidential Republic': '#3b82f6',     // Parlak Mavi
            'Parlementer Monarşi': '#8b5cf6',       // Mor
            'Başkanlık Cumhuriyeti': '#3b82f6',     // Parlak Mavi (Türkçe/İngilizce uyumu)
            'Komünizm': '#ef4444',                  // Devrimci Kırmızı
            'Monarşi': '#f59e0b',                   // Altın Sarısı
            'Diktatörlük': '#1e293b',                // Koyu Lacivert/Siyah
            'Cumhuriyet': '#60a5fa',                 // Gök Mavisi
            'Other': '#64748b'                      // Gri
        },
        getValue: (countryData) => countryData.government || 'Other'
    }
};

// Aktif mod
let currentMode = 'default';

// Mod değiştir
export function setMapMode(modeId) {
    if (!mapModes[modeId]) {
        console.warn(`Bilinmeyen harita modu: ${modeId}`);
        return;
    }

    currentMode = modeId;
    updateModePanel();
    applyModeVisualization();

    // İstatistik modundaysa paneli aç, değilse kapat
    toggleStatisticsPanel(modeId === 'statistics');

    // Ticaret modu toggle
    if (modeId === 'trade') {
        toggleTradeRoutes();
        return; // Ticaret modu toggle, diğer modlar gibi değil
    }

    console.log(`Harita modu değiştirildi: ${modeId}`);
}

// Ticaret rotaları toggle state
let tradeRoutesVisible = false;

function toggleTradeRoutes() {
    tradeRoutesVisible = !tradeRoutesVisible;

    if (tradeRoutesVisible) {
        showSeaRoutes();
    } else {
        hideSeaRoutes();
    }

    // Buton stilini güncelle
    const tradeBtn = document.querySelector('[data-mode="trade"]');
    if (tradeBtn) {
        tradeBtn.classList.toggle('active', tradeRoutesVisible);
    }
    const tradeBtnIcon = document.querySelector('.icon-strip-btn[data-mode="trade"]');
    if (tradeBtnIcon) {
        tradeBtnIcon.classList.toggle('active', tradeRoutesVisible);
    }

    console.log(`Ticaret rotaları: ${tradeRoutesVisible ? 'Görünür' : 'Gizli'}`);
}

// Aktif modu al
export function getCurrentMode() {
    return currentMode;
}

// Mod panelini güncelle
function updateModePanel() {
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => {
        const modeId = btn.dataset.mode;
        if (modeId === currentMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Mod bilgi alanını güncelle
    const infoEl = document.getElementById('mode-info');
    if (infoEl) {
        const mode = mapModes[currentMode];
        infoEl.innerHTML = `
            <i class="${mode.icon}"></i>
            <span>${mode.name}</span>
            <small>${mode.description}</small>
        `;
    }
}

// Mod görselleştirmesini uygula
function applyModeVisualization() {
    // Bu fonksiyon layers.js veya styles.js ile entegre edilecek
    // Şimdilik event dispatch edelim
    window.dispatchEvent(new CustomEvent('mapModeChanged', {
        detail: { mode: currentMode, config: mapModes[currentMode] }
    }));
}

// Mod paneli HTML'ini oluştur
export function createModePanelHTML() {
    // Açık panel için sadece yazılı butonlar (ikonlar zaten sağda var)
    const modeButtons = Object.values(mapModes).map(mode => `
        <button class="mode-btn ${mode.id === currentMode ? 'active' : ''}" 
                data-mode="${mode.id}" 
                title="${mode.description}">
            ${mode.name}
        </button>
    `).join('');

    // Icon strip için sadece ikonlar
    const iconStripButtons = Object.values(mapModes).map(mode => `
        <button class="icon-strip-btn ${mode.id === currentMode ? 'active' : ''}" 
                data-mode="${mode.id}" 
                title="${mode.name}">
            <i class="${mode.icon}"></i>
        </button>
    `).join('');

    return `
        <div id="map-modes-panel" class="map-modes-panel collapsed">
            <!-- Pull-tab (sol kenarda toggle) -->
            <div class="modes-pull-tab" id="modes-pull-tab" title="Harita Modları">
                <i class="fa-solid fa-chevron-left"></i>
            </div>
            
            <!-- İçerik (sol taraf, açıkken görünür) -->
            <div class="modes-content">
                <div class="modes-header-inline">
                    <span>Harita Modları</span>
                </div>
                <div class="mode-buttons">
                    ${modeButtons}
                </div>
            </div>
            
            <!-- İkon şeridi (sağ taraf, her zaman görünür) -->
            <div class="modes-icon-strip">
                ${iconStripButtons}
            </div>
        </div>
    `;
}

// Panel event listener'larını kur
export function initModePanelEvents() {
    const panel = document.getElementById('map-modes-panel');
    const pullTab = document.getElementById('modes-pull-tab');

    // Pull-tab toggle
    if (pullTab && panel) {
        pullTab.addEventListener('click', () => {
            panel.classList.toggle('collapsed');
        });
    }

    // Mod butonları (hem ana panel hem icon strip)
    document.querySelectorAll('.mode-btn, .icon-strip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modeId = btn.dataset.mode;
            setMapMode(modeId);

            // Her iki gruptaki butonları da güncelle
            document.querySelectorAll('.mode-btn, .icon-strip-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.mode === modeId);
            });
        });
    });
}
