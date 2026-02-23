// =============================================
// AYARLAR PANELİ MODÜLÜ
// =============================================

const SETTINGS_KEY = 'nomos_settings';

// Varsayılan ayarlar
const defaultSettings = {
    // 🔊 Ses
    soundEnabled: true,
    musicEnabled: false,
    soundVolume: 70,
    musicVolume: 40,

    // 🎨 Görünüm
    animationsEnabled: true,
    particleEffects: true,
    highContrast: false,
    compactMode: false,
    showFPS: false,

    // 🎮 Oynanış
    autoSave: true,
    autoSaveInterval: 30, // saniye
    notifications: true,
    confirmActions: true,
    gameSpeed: 1, // 1x, 2x, 3x

    // 🌐 Dil
    language: 'tr'
};

// Mevcut ayarlar (runtime)
let currentSettings = { ...defaultSettings };

// =============================================
// AYARLARI YÜKLE / KAYDET
// =============================================

export function loadSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            currentSettings = { ...defaultSettings, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('Ayarlar yüklenemedi, varsayılanlara dönüldü.');
        currentSettings = { ...defaultSettings };
    }
    applySettings();
    return currentSettings;
}

export function saveSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
    } catch (e) {
        console.error('Ayarlar kaydedilemedi:', e);
    }
}

export function getSetting(key) {
    return currentSettings[key];
}

export function setSetting(key, value) {
    currentSettings[key] = value;
    saveSettings();
    applySettings();
}

function resetSettings() {
    currentSettings = { ...defaultSettings };
    saveSettings();
    applySettings();
    renderSettingsContent(); // paneli güncelle
}

// =============================================
// AYARLARI UYGULA (body class, css variable vb.)
// =============================================

function applySettings() {
    const body = document.body;

    // Animasyonlar
    body.classList.toggle('no-animations', !currentSettings.animationsEnabled);

    // Compact mod
    body.classList.toggle('compact-mode', currentSettings.compactMode);

    // High contrast
    body.classList.toggle('high-contrast', currentSettings.highContrast);

    // FPS göstergesi
    const fpsEl = document.getElementById('fps-counter');
    if (fpsEl) fpsEl.style.display = currentSettings.showFPS ? 'block' : 'none';
}

// =============================================
// PANEL OLUŞTUR VE AÇ/KAPA
// =============================================

let panelOpen = false;

export function initSettingsPanel() {
    // Ayarlar butonuna click handler ekle
    const btn = document.querySelector('.settings-btn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSettingsPanel();
        });
    }

    // Ayarları yükle
    loadSettings();
}

export function toggleSettingsPanel() {
    panelOpen ? closeSettingsPanel() : openSettingsPanel();
}

export function openSettingsPanel() {
    if (panelOpen) return;
    panelOpen = true;

    // Varsa eski paneli kaldır
    const old = document.getElementById('settings-panel-overlay');
    if (old) old.remove();

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'settings-panel-overlay';
    overlay.className = 'settings-overlay';

    // Panel
    const panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.innerHTML = `
        <div class="settings-header">
            <div class="settings-title">
                <i class="fa-solid fa-gear"></i>
                <span>Ayarlar</span>
            </div>
            <button class="settings-close-btn" id="settings-close">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="settings-tabs">
            <button class="settings-tab active" data-stab="audio"><i class="fa-solid fa-volume-high"></i> Ses</button>
            <button class="settings-tab" data-stab="visual"><i class="fa-solid fa-palette"></i> Görünüm</button>
            <button class="settings-tab" data-stab="gameplay"><i class="fa-solid fa-gamepad"></i> Oynanış</button>
            <button class="settings-tab" data-stab="data"><i class="fa-solid fa-database"></i> Veri</button>
        </div>
        <div class="settings-body" id="settings-body"></div>
    `;

    overlay.appendChild(panel);
    document.documentElement.appendChild(overlay);

    // İçeriği render et
    renderSettingsContent();

    // Event: overlay tıklama → kapat
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSettingsPanel();
    });

    // Event: close butonu
    document.getElementById('settings-close').addEventListener('click', closeSettingsPanel);

    // Event: Tab geçişleri
    panel.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            panel.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderSettingsContent();
        });
    });

    // Açılma animasyonu
    requestAnimationFrame(() => {
        overlay.classList.add('open');
    });
}

export function closeSettingsPanel() {
    const overlay = document.getElementById('settings-panel-overlay');
    if (!overlay) return;

    overlay.classList.remove('open');
    overlay.classList.add('closing');

    setTimeout(() => {
        overlay.remove();
        panelOpen = false;
    }, 300);
}

// =============================================
// İÇERİK RENDER (Aktif Tab'a göre)
// =============================================

function renderSettingsContent() {
    const body = document.getElementById('settings-body');
    if (!body) return;

    const activeTab = document.querySelector('.settings-tab.active');
    const tab = activeTab ? activeTab.dataset.stab : 'audio';

    switch (tab) {
        case 'audio': body.innerHTML = renderAudioTab(); break;
        case 'visual': body.innerHTML = renderVisualTab(); break;
        case 'gameplay': body.innerHTML = renderGameplayTab(); break;
        case 'data': body.innerHTML = renderDataTab(); break;
    }

    // Event listener'ları ekle
    attachSettingsListeners(body);
}

// =============================================
// SES SEKME
// =============================================

function renderAudioTab() {
    return `
        <div class="settings-section">
            <h3 class="section-title"><i class="fa-solid fa-volume-high"></i> Ses Efektleri</h3>
            ${renderToggle('soundEnabled', 'Ses Efektleri', 'Tıklama, bildirim ve oyun sesleri')}
            ${renderSlider('soundVolume', 'Ses Seviyesi', 0, 100, currentSettings.soundVolume, currentSettings.soundEnabled)}
        </div>
        <div class="settings-section">
            <h3 class="section-title"><i class="fa-solid fa-music"></i> Müzik</h3>
            ${renderToggle('musicEnabled', 'Arkaplan Müziği', 'Oyun içi müzik')}
            ${renderSlider('musicVolume', 'Müzik Seviyesi', 0, 100, currentSettings.musicVolume, currentSettings.musicEnabled)}
        </div>
    `;
}

// =============================================
// GÖRÜNÜM SEKME
// =============================================

function renderVisualTab() {
    return `
        <div class="settings-section">
            <h3 class="section-title"><i class="fa-solid fa-wand-magic-sparkles"></i> Efektler</h3>
            ${renderToggle('animationsEnabled', 'Animasyonlar', 'UI geçiş animasyonları ve hover efektleri')}
            ${renderToggle('particleEffects', 'Parçacık Efektleri', 'Harita ve arayüzdeki parçacık animasyonları')}
        </div>
        <div class="settings-section">
            <h3 class="section-title"><i class="fa-solid fa-display"></i> Arayüz</h3>
            ${renderToggle('compactMode', 'Kompakt Mod', 'Daha sıkışık UI elemanları')}
            ${renderToggle('highContrast', 'Yüksek Kontrast', 'Daha belirgin renkler ve kenarlar')}
            ${renderToggle('showFPS', 'FPS Göstergesi', 'Ekranın köşesinde FPS sayacı göster')}
        </div>
    `;
}

// =============================================
// OYNANIŞ SEKME
// =============================================

function renderGameplayTab() {
    return `
        <div class="settings-section">
            <h3 class="section-title"><i class="fa-solid fa-floppy-disk"></i> Kaydetme</h3>
            ${renderToggle('autoSave', 'Otomatik Kaydetme', 'Oyun ilerlemesini düzenli olarak kaydet')}
            ${renderSelect('autoSaveInterval', 'Kaydetme Sıklığı', [
        { value: 15, label: '15 Saniye' },
        { value: 30, label: '30 Saniye' },
        { value: 60, label: '1 Dakika' },
        { value: 120, label: '2 Dakika' },
        { value: 300, label: '5 Dakika' }
    ], !currentSettings.autoSave)}
        </div>
        <div class="settings-section">
            <h3 class="section-title"><i class="fa-solid fa-sliders"></i> Tercihler</h3>
            ${renderToggle('notifications', 'Bildirimler', 'Oyun içi bildirim popup\'ları')}
            ${renderToggle('confirmActions', 'Onay Diyalogları', 'Önemli eylemlerde onay iste')}
            ${renderSelect('gameSpeed', 'Oyun Hızı', [
        { value: 1, label: '1x Normal' },
        { value: 2, label: '2x Hızlı' },
        { value: 3, label: '3x Çok Hızlı' }
    ])}
        </div>
    `;
}

// =============================================
// VERİ SEKME
// =============================================

function renderDataTab() {
    // localStorage boyutunu hesapla
    let storageSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            storageSize += localStorage[key].length * 2; // UTF-16
        }
    }
    const sizeKB = (storageSize / 1024).toFixed(1);

    return `
        <div class="settings-section">
            <h3 class="section-title"><i class="fa-solid fa-hard-drive"></i> Depolama</h3>
            <div class="data-info-row">
                <div class="data-info-card">
                    <i class="fa-solid fa-database"></i>
                    <div>
                        <span class="info-label">Kullanılan Alan</span>
                        <span class="info-value">${sizeKB} KB</span>
                    </div>
                </div>
                <div class="data-info-card">
                    <i class="fa-solid fa-key"></i>
                    <div>
                        <span class="info-label">Kayıt Sayısı</span>
                        <span class="info-value">${localStorage.length} kayıt</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="settings-section">
            <h3 class="section-title"><i class="fa-solid fa-arrow-right-arrow-left"></i> Aktar</h3>
            <div class="data-actions">
                <button class="data-btn export-btn" data-action="export">
                    <i class="fa-solid fa-file-export"></i>
                    <div>
                        <span>Dışa Aktar</span>
                        <small>Tüm verileri JSON olarak indir</small>
                    </div>
                </button>
                <button class="data-btn import-btn" data-action="import">
                    <i class="fa-solid fa-file-import"></i>
                    <div>
                        <span>İçe Aktar</span>
                        <small>JSON dosyasından verileri yükle</small>
                    </div>
                </button>
            </div>
        </div>
        <div class="settings-section danger-section">
            <h3 class="section-title"><i class="fa-solid fa-triangle-exclamation"></i> Tehlikeli Bölge</h3>
            <div class="data-actions">
                <button class="data-btn reset-settings-btn" data-action="reset-settings">
                    <i class="fa-solid fa-rotate-left"></i>
                    <div>
                        <span>Ayarları Sıfırla</span>
                        <small>Sadece ayarları varsayılanlara döndür</small>
                    </div>
                </button>
                <button class="data-btn danger-btn" data-action="reset-all">
                    <i class="fa-solid fa-trash"></i>
                    <div>
                        <span>Tüm Verileri Sil</span>
                        <small>Oyun ilerlemesi dahil her şeyi sil</small>
                    </div>
                </button>
            </div>
        </div>
    `;
}

// =============================================
// KONTROL BİLEŞENLERİ (Toggle, Slider, Select)
// =============================================

function renderToggle(key, label, description) {
    const checked = currentSettings[key];
    return `
        <div class="setting-row">
            <div class="setting-info">
                <span class="setting-label">${label}</span>
                <span class="setting-desc">${description}</span>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" data-key="${key}" ${checked ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        </div>
    `;
}

function renderSlider(key, label, min, max, value, enabled = true) {
    return `
        <div class="setting-row ${!enabled ? 'disabled' : ''}">
            <div class="setting-info">
                <span class="setting-label">${label}</span>
                <span class="setting-value-display" id="val-${key}">${value}%</span>
            </div>
            <input type="range" class="settings-slider" data-key="${key}" 
                   min="${min}" max="${max}" value="${value}" ${!enabled ? 'disabled' : ''}>
        </div>
    `;
}

function renderSelect(key, label, options, disabled = false) {
    const optionsHtml = options.map(o =>
        `<option value="${o.value}" ${currentSettings[key] == o.value ? 'selected' : ''}>${o.label}</option>`
    ).join('');

    return `
        <div class="setting-row ${disabled ? 'disabled' : ''}">
            <div class="setting-info">
                <span class="setting-label">${label}</span>
            </div>
            <select class="settings-select" data-key="${key}" ${disabled ? 'disabled' : ''}>
                ${optionsHtml}
            </select>
        </div>
    `;
}

// =============================================
// EVENT LISTENERS
// =============================================

function attachSettingsListeners(container) {
    // Toggle'lar
    container.querySelectorAll('input[type="checkbox"][data-key]').forEach(input => {
        input.addEventListener('change', () => {
            setSetting(input.dataset.key, input.checked);
            renderSettingsContent(); // bağımlı kontroller güncellenir
        });
    });

    // Slider'lar
    container.querySelectorAll('input[type="range"][data-key]').forEach(input => {
        input.addEventListener('input', () => {
            const display = document.getElementById(`val-${input.dataset.key}`);
            if (display) display.textContent = `${input.value}%`;
        });
        input.addEventListener('change', () => {
            setSetting(input.dataset.key, parseInt(input.value));
        });
    });

    // Select'ler
    container.querySelectorAll('select[data-key]').forEach(select => {
        select.addEventListener('change', () => {
            const val = isNaN(select.value) ? select.value : Number(select.value);
            setSetting(select.dataset.key, val);
        });
    });

    // Veri butonları
    container.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            handleDataAction(btn.dataset.action);
        });
    });
}

// =============================================
// VERİ İŞLEMLERİ
// =============================================

function handleDataAction(action) {
    switch (action) {
        case 'export':
            exportData();
            break;
        case 'import':
            importData();
            break;
        case 'reset-settings':
            if (confirm('Tüm ayarlar varsayılanlara dönecek. Devam etmek istiyor musunuz?')) {
                resetSettings();
                showToast('Ayarlar sıfırlandı', 'success');
            }
            break;
        case 'reset-all':
            if (confirm('⚠️ DİKKAT: Tüm oyun verileri silinecek!\n\nBu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
                if (confirm('Gerçekten emin misiniz? Son şans!')) {
                    localStorage.clear();
                    showToast('Tüm veriler silindi. Sayfa yenileniyor...', 'warning');
                    setTimeout(() => location.reload(), 1500);
                }
            }
            break;
    }
}

function exportData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            data[key] = JSON.parse(localStorage.getItem(key));
        } catch {
            data[key] = localStorage.getItem(key);
        }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nomos-save-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Veriler dışa aktarıldı', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (confirm(`${Object.keys(data).length} kayıt içe aktarılacak. Mevcut veriler üzerine yazılacak. Devam?`)) {
                    Object.entries(data).forEach(([key, value]) => {
                        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                    });
                    showToast('Veriler içe aktarıldı. Sayfa yenileniyor...', 'success');
                    setTimeout(() => location.reload(), 1500);
                }
            } catch (err) {
                showToast('Geçersiz dosya formatı!', 'error');
            }
        };
        reader.readAsText(file);
    });
    input.click();
}

// =============================================
// TOAST BİLDİRİM
// =============================================

function showToast(message, type = 'info') {
    const old = document.getElementById('settings-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.id = 'settings-toast';
    toast.className = `settings-toast toast-${type}`;

    const icons = { success: 'fa-check-circle', error: 'fa-xmark-circle', warning: 'fa-triangle-exclamation', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${message}`;

    document.documentElement.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
