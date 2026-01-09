// KIYI EYALETİ SEÇİCİ
// Haritada eyaletlere tıklayarak kıyı eyaletlerini manuel seçme aracı
// NOT: Kıyı eyaletleri seçildi, buton artık gizli. Console'dan toggleCoastalSelector() ile açılabilir.

let isCoastalSelectorActive = false;
let selectedCoastalIds = [];

// Harita yüklendiğinde butonu ekle - DEVRE DIŞI (Kıyı eyaletleri zaten seçildi)
// document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(createToggleButton, 2000);
// });

function createToggleButton() {
    const mapEl = document.getElementById('game-map');
    if (!mapEl) return;

    const btn = document.createElement('button');
    btn.id = 'coastal-toggle-btn';
    btn.innerHTML = '<i class="fa-solid fa-anchor"></i> Kıyı Seç';
    btn.title = 'Kıyı Eyaleti Seçici Aracını Aç/Kapat';
    btn.addEventListener('click', toggleCoastalSelector);

    mapEl.appendChild(btn);
}

// Seçici modunu aç/kapa
export function toggleCoastalSelector() {
    isCoastalSelectorActive = !isCoastalSelectorActive;

    if (isCoastalSelectorActive) {
        showSelectorPanel();
        console.log('Kıyı Seçici: AKTİF - Eyaletlere tıklayın');
    } else {
        hideSelectorPanel();
        console.log('Kıyı Seçici: KAPALI');
    }

    return isCoastalSelectorActive;
}

// Global erişim için window'a ekle
window.toggleCoastalSelector = toggleCoastalSelector;

// Aktif mi?
export function isCoastalSelectorMode() {
    return isCoastalSelectorActive;
}

// Eyalet tıklandığında çağrılır
export function addCoastalId(regionId, regionName) {
    if (!isCoastalSelectorActive) return;

    // Zaten ekliyse çıkar (toggle)
    const index = selectedCoastalIds.findIndex(item => item.id === regionId);
    if (index > -1) {
        selectedCoastalIds.splice(index, 1);
        console.log(`Kaldırıldı: ${regionId}`);
    } else {
        selectedCoastalIds.push({ id: regionId, name: regionName });
        console.log(`Eklendi: ${regionId} (${regionName})`);
    }

    updateSelectorPanel();
}

// Panel göster
function showSelectorPanel() {
    // Varsa kaldır
    hideSelectorPanel();

    const panel = document.createElement('div');
    panel.id = 'coastal-selector-panel';
    panel.innerHTML = `
        <div class="csp-header">
            <h4><i class="fa-solid fa-anchor"></i> Kıyı Eyaleti Seçici</h4>
            <button id="csp-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <p class="csp-info">Eyaletlere tıklayarak kıyı eyaletlerini seçin. Tekrar tıklayarak kaldırabilirsiniz.</p>
        <div id="csp-count">Seçilen: 0</div>
        <div id="csp-list"></div>
        <div class="csp-actions">
            <button id="csp-copy"><i class="fa-solid fa-copy"></i> ID'leri Kopyala</button>
            <button id="csp-clear"><i class="fa-solid fa-trash"></i> Temizle</button>
        </div>
    `;

    document.body.appendChild(panel);

    // Event listeners
    document.getElementById('csp-close').addEventListener('click', () => toggleCoastalSelector());
    document.getElementById('csp-copy').addEventListener('click', copyIdsToClipboard);
    document.getElementById('csp-clear').addEventListener('click', clearSelection);

    updateSelectorPanel();
}

function hideSelectorPanel() {
    const panel = document.getElementById('coastal-selector-panel');
    if (panel) panel.remove();
}

function updateSelectorPanel() {
    const countEl = document.getElementById('csp-count');
    const listEl = document.getElementById('csp-list');

    if (countEl) countEl.textContent = `Seçilen: ${selectedCoastalIds.length}`;

    if (listEl) {
        if (selectedCoastalIds.length === 0) {
            listEl.innerHTML = '<span class="csp-empty">Henüz seçim yok</span>';
        } else {
            listEl.innerHTML = selectedCoastalIds.map(item => `
                <div class="csp-item">
                    <span class="csp-id">${item.id}</span>
                    <span class="csp-name">${item.name}</span>
                </div>
            `).join('');
        }
    }
}

function copyIdsToClipboard() {
    const ids = selectedCoastalIds.map(item => item.id);
    const text = JSON.stringify(ids, null, 2);

    navigator.clipboard.writeText(text).then(() => {
        alert(`${ids.length} adet ID kopyalandı!\n\nBunları js/data/coastal-regions.js dosyasına yapıştırabilirsiniz.`);
    }).catch(err => {
        // Fallback
        console.log('Kopyalanan ID\'ler:', text);
        prompt('ID\'leri kopyalayın:', text);
    });
}

function clearSelection() {
    if (confirm('Tüm seçimi temizlemek istediğinize emin misiniz?')) {
        selectedCoastalIds = [];
        updateSelectorPanel();
    }
}

// CSS enjekte et
const style = document.createElement('style');
style.textContent = `
#coastal-selector-panel {
    position: fixed;
    top: 80px;
    right: 20px;
    width: 320px;
    max-height: 70vh;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 12px;
    z-index: 10000;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.csp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(59, 130, 246, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.csp-header h4 {
    margin: 0;
    font-size: 0.9rem;
    color: #60a5fa;
    display: flex;
    align-items: center;
    gap: 8px;
}

.csp-header button {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 4px;
}

.csp-header button:hover {
    color: white;
}

.csp-info {
    padding: 10px 16px;
    font-size: 0.7rem;
    color: #94a3b8;
    margin: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

#csp-count {
    padding: 8px 16px;
    font-size: 0.75rem;
    color: #22c55e;
    font-weight: 600;
}

#csp-list {
    max-height: 300px;
    overflow-y: auto;
    padding: 0 16px 10px;
}

.csp-empty {
    color: #64748b;
    font-size: 0.75rem;
    font-style: italic;
}

.csp-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.7rem;
}

.csp-id {
    color: #fbbf24;
    font-family: monospace;
}

.csp-name {
    color: #e2e8f0;
    text-align: right;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.csp-actions {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.2);
}

.csp-actions button {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 6px;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
}

#csp-copy {
    background: #2563eb;
    color: white;
}

#csp-copy:hover {
    background: #1d4ed8;
}

#csp-clear {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
}

#csp-clear:hover {
    background: rgba(239, 68, 68, 0.3);
}

#coastal-toggle-btn {
    position: absolute;
    bottom: 100px;
    left: 20px;
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
}

#coastal-toggle-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
}

#coastal-toggle-btn:active {
    transform: translateY(0);
}
`;
document.head.appendChild(style);
