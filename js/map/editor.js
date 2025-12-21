// HARİTA EDİTÖRÜ VE GELİŞTİRİCİ ARACI
import { getProvinceStyle } from './styles.js';

let isDevMode = false;
let currentLayer = null;
let currentFeature = null;

// Kaydedilen verileri hafızadan çek
const savedData = JSON.parse(localStorage.getItem('nomos_map_overrides')) || {};

// --- 1. EDİTÖRÜ BAŞLAT ---
export function initEditor(mapInstance) {
    // Haritaya "Geliştirici Modu" butonu ekle
    const devBtn = L.control({ position: 'bottomright' });

    devBtn.onAdd = function () {
        const div = document.createElement('div');
        div.innerHTML = `<button id="dev-toggle-btn" style="background:#1e293b; color:white; border:1px solid #334155; padding:8px 12px; border-radius:4px; cursor:pointer; font-weight:bold; box-shadow:0 0 10px rgba(0,0,0,0.5);">🛠️ Dev Mode: OFF</button>`;
        
        // Tıklama olayı (Haritaya tıklamayı engelle)
        div.onclick = (e) => {
            e.stopPropagation();
            toggleDevMode();
        };
        return div;
    };

    devBtn.addTo(mapInstance);
    
    // Editör Panelini HTML'e göm
    injectEditorPanel();
}

// --- 2. MODU AÇ/KAPA ---
function toggleDevMode() {
    isDevMode = !isDevMode;
    const btn = document.getElementById('dev-toggle-btn');
    const panel = document.getElementById('map-editor-panel');
    
    if (isDevMode) {
        btn.innerHTML = "🛠️ Dev Mode: ON";
        btn.style.background = "#10b981"; // Yeşil
        btn.style.color = "#000";
        // Harita container'ına özel bir sınıf ekle ki imleç değişsin
        document.getElementById('game-map').style.cursor = "crosshair";
    } else {
        btn.innerHTML = "🛠️ Dev Mode: OFF";
        btn.style.background = "#1e293b"; // Eski haline dön
        btn.style.color = "#fff";
        panel.style.display = 'none';
        document.getElementById('game-map').style.cursor = "grab";
    }
}

export function isEditorActive() {
    return isDevMode;
}

// --- 3. DÜZENLEME PANELİNİ AÇ ---
export function openEditor(feature, layer) {
    const panel = document.getElementById('map-editor-panel');
    const content = document.getElementById('editor-content');
    
    currentFeature = feature;
    currentLayer = layer;

    // Olası ID veya Benzersiz Anahtar (Kaydetmek için)
    // Genelde feature.id olur, yoksa özelliklerden birini seçeriz
    const uniqueKey = getUniqueKey(feature);
    
    // Önceden kaydedilmiş bir isim var mı?
    const savedName = savedData[uniqueKey]?.name || "";

    // Ham verileri göster (JSON formatında)
    const rawProps = JSON.stringify(feature.properties, null, 2);

    content.innerHTML = `
        <div style="margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
            <h4 style="color:#eab308; margin-bottom:5px;">Bölge Düzenleyici</h4>
            <small style="color:#94a3b8;">ID: ${uniqueKey}</small>
        </div>

        <div style="margin-bottom:15px;">
            <label style="display:block; color:#ccc; font-size:0.8rem; margin-bottom:5px;">Görünen İsim (Override)</label>
            <input type="text" id="editor-name-input" value="${savedName}" placeholder="Orijinal: ${guessName(feature)}" 
                style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:white; border-radius:4px;">
        </div>

        <div style="margin-bottom:15px;">
            <label style="display:block; color:#ccc; font-size:0.8rem; margin-bottom:5px;">HAM VERİ (GeoJSON Properties)</label>
            <textarea style="width:100%; height:150px; background:#000; color:#0f0; font-family:monospace; font-size:0.7rem; border:1px solid #333; padding:5px;" readonly>${rawProps}</textarea>
            <small style="color:#64748b;">Buraya bakarak Bulgaristan'ın hangi etiketi kullandığını bulabilirsin.</small>
        </div>

        <div style="display:flex; gap:10px;">
            <button id="editor-save-btn" style="flex:1; background:#10b981; color:black; border:none; padding:8px; border-radius:4px; cursor:pointer; font-weight:bold;">Kaydet</button>
            <button id="editor-close-btn" style="flex:1; background:#ef4444; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">Kapat</button>
        </div>
    `;

    panel.style.display = 'block';

    // Buton Eventleri
    document.getElementById('editor-close-btn').onclick = () => panel.style.display = 'none';
    document.getElementById('editor-save-btn').onclick = saveChanges;
}

// --- 4. KAYDETME ---
function saveChanges() {
    const newName = document.getElementById('editor-name-input').value;
    const uniqueKey = getUniqueKey(currentFeature);

    if (newName) {
        // Veriyi güncelle
        savedData[uniqueKey] = { name: newName };
        
        // LocalStorage'a yaz (Sayfa yenilense de gitmez)
        localStorage.setItem('nomos_map_overrides', JSON.stringify(savedData));
        
        alert("Bölge ismi kaydedildi! (Sayfayı yenileyince de kalacak)");
    } else {
        // İsim silindiyse kaydı sil
        delete savedData[uniqueKey];
        localStorage.setItem('nomos_map_overrides', JSON.stringify(savedData));
    }

    // Paneli kapat
    document.getElementById('map-editor-panel').style.display = 'none';
}

// --- YARDIMCILAR ---

// Harita verisinden benzersiz bir ID üretmeye çalışır
function getUniqueKey(feature) {
    // Varsa ID'yi kullan, yoksa koordinatların string halini veya özelliklerin hash'ini kullan
    if (feature.id) return feature.id;
    // Benzersizlik için properties içindeki bazı değerleri birleştiriyoruz
    const p = feature.properties;
    return (p.gns_id || p.gu_a3 || p.adm1_code || p.name || JSON.stringify(p)).toString().replace(/\s/g, '');
}

// İsim tahmin edici (Bizim eski fonksiyon)
function guessName(feature) {
    const p = feature.properties;
    return p.name || p.NAME || p.Name || p.NAME_1 || "Bölge";
}

// HTML Panelini Oluştur
function injectEditorPanel() {
    if (document.getElementById('map-editor-panel')) return;
    
    const panel = document.createElement('div');
    panel.id = 'map-editor-panel';
    panel.style.cssText = `
        display: none;
        position: absolute;
        top: 20px; right: 20px;
        width: 300px;
        background: #1e293b;
        border: 1px solid #475569;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        border-radius: 8px;
        padding: 20px;
        z-index: 9999;
        color: white;
    `;
    document.getElementById('app-container').appendChild(panel);
}

// --- DIŞARIYA VERİ SAĞLAMA (Styles ve Events kullanacak) ---
export function getOverriddenName(feature) {
    const uniqueKey = getUniqueKey(feature);
    const saved = JSON.parse(localStorage.getItem('nomos_map_overrides')) || {};
    return saved[uniqueKey]?.name || null;
}