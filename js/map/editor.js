// HARİTA EDİTÖRÜ VE GELİŞTİRİCİ ARACI
import { getProvinceStyle } from './styles.js';

let isDevMode = false;
let currentFeature = null;
let currentLayer = null;
let mapRef = null; // Harita referansı (Yenileme için)
let layerRef = null; // Katman referansı

// Verileri Hafızadan Çek
const savedData = JSON.parse(localStorage.getItem('nomos_map_data')) || {};

// --- 1. BAŞLAT ---
export function initEditor(mapInstance, provinceLayer) {
    mapRef = mapInstance;
    layerRef = provinceLayer;

    // Butonu Ekle
    const devBtn = L.control({ position: 'bottomright' });
    devBtn.onAdd = function () {
        const div = document.createElement('div');
        div.innerHTML = `<button id="dev-toggle-btn" style="background:#1e293b; color:white; border:1px solid #334155; padding:8px 12px; border-radius:4px; cursor:pointer; font-weight:bold; box-shadow:0 0 10px rgba(0,0,0,0.5); margin-bottom:10px;">🛠️ Editor: OFF</button>`;
        div.onclick = (e) => { e.stopPropagation(); toggleDevMode(); };
        return div;
    };
    devBtn.addTo(mapInstance);
    
    injectEditorPanel();
}

// --- 2. MODU AÇ/KAPA ---
function toggleDevMode() {
    isDevMode = !isDevMode;
    const btn = document.getElementById('dev-toggle-btn');
    const panel = document.getElementById('map-editor-panel');
    
    if (isDevMode) {
        btn.innerHTML = "🛠️ Editor: ON";
        btn.style.background = "#10b981"; 
        btn.style.color = "#000";
        document.getElementById('game-map').style.cursor = "crosshair";
    } else {
        btn.innerHTML = "🛠️ Editor: OFF";
        btn.style.background = "#1e293b"; 
        btn.style.color = "#fff";
        panel.style.display = 'none';
        document.getElementById('game-map').style.cursor = "grab";
    }
}

export function isEditorActive() { return isDevMode; }

// --- 3. PANELİ AÇ ---
export function openEditor(feature, layer) {
    const panel = document.getElementById('map-editor-panel');
    const content = document.getElementById('editor-content');
    
    currentFeature = feature;
    currentLayer = layer;
    const key = getUniqueKey(feature);
    const data = savedData[key] || {};

    // Mevcut veya Tahmin Edilen İsim
    const currentName = data.name || guessName(feature);
    // Kayıtlı Renk (Yoksa varsayılan siyah gelsin inputta)
    const currentColor = data.color || "#000000";

    content.innerHTML = `
        <div style="margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
            <h4 style="color:#eab308; margin:0;">Bölge Düzenle</h4>
            <small style="color:#64748b; font-size:0.7rem;">ID: ${key.substring(0, 15)}...</small>
        </div>

        <!-- İSİM AYARI -->
        <div style="margin-bottom:15px;">
            <label style="display:block; color:#ccc; font-size:0.8rem; margin-bottom:5px;">Bölge İsmi</label>
            <input type="text" id="dev-name" value="${currentName}" 
                style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:white; border-radius:4px;">
        </div>

        <!-- RENK AYARI -->
        <div style="margin-bottom:15px;">
            <label style="display:block; color:#ccc; font-size:0.8rem; margin-bottom:5px;">Bölge Rengi (Override)</label>
            <div style="display:flex; gap:10px; align-items:center;">
                <input type="color" id="dev-color" value="${currentColor}" style="width:50px; height:40px; border:none; background:none; cursor:pointer;">
                <span id="dev-color-code" style="color:#94a3b8; font-size:0.8rem;">${currentColor}</span>
                <button id="dev-reset-color" style="font-size:0.7rem; padding:4px 8px; background:#334155; color:white; border:none; border-radius:4px; cursor:pointer;">Sıfırla</button>
            </div>
        </div>

        <!-- KAYDET BUTONLARI -->
        <div style="display:flex; gap:10px; margin-top:20px;">
            <button id="dev-save" style="flex:2; background:#10b981; color:black; border:none; padding:10px; border-radius:4px; cursor:pointer; font-weight:bold;">KAYDET</button>
            <button id="dev-close" style="flex:1; background:#ef4444; color:white; border:none; padding:10px; border-radius:4px; cursor:pointer;">İPTAL</button>
        </div>
        
        <div style="margin-top:15px; border-top:1px solid #333; padding-top:10px;">
             <small style="color:#64748b; cursor:pointer;" onclick="document.getElementById('dev-json').style.display='block'">[+] Ham Veriyi Göster</small>
             <textarea id="dev-json" style="display:none; width:100%; height:100px; background:black; color:#0f0; font-size:0.7rem; margin-top:5px;">${JSON.stringify(feature.properties, null, 2)}</textarea>
        </div>
    `;

    panel.style.display = 'block';

    // Eventler
    document.getElementById('dev-close').onclick = () => panel.style.display = 'none';
    
    document.getElementById('dev-color').oninput = (e) => {
        document.getElementById('dev-color-code').innerText = e.target.value;
    };

    document.getElementById('dev-reset-color').onclick = () => {
        document.getElementById('dev-color').value = "#000000"; // Reset değeri (boş)
        document.getElementById('dev-color-code').innerText = "Varsayılan";
    };

    document.getElementById('dev-save').onclick = () => saveChanges(key);
}

// --- 4. KAYDETME MANTIĞI ---
function saveChanges(key) {
    const newName = document.getElementById('dev-name').value;
    const newColor = document.getElementById('dev-color').value;
    
    // Veriyi hazırla
    if (!savedData[key]) savedData[key] = {};
    
    savedData[key].name = newName;
    
    // Renk siyah (#000000) değilse kaydet, siyahsa sil (Varsayılana dönsün)
    if (newColor !== "#000000") {
        savedData[key].color = newColor;
    } else {
        delete savedData[key].color;
    }

    // LocalStorage'a yaz
    localStorage.setItem('nomos_map_data', JSON.stringify(savedData));

    // Haritadaki o bölgenin stilini ve popup'ını anlık güncelle
    if (currentLayer) {
        // Stili yenile
        currentLayer.setStyle(getProvinceStyle(currentFeature));
        
        // Popup'ı kapat
        mapRef.closePopup();
        
        // Paneli kapat
        document.getElementById('map-editor-panel').style.display = 'none';
        
        // Geri bildirim (Kısa yanıp sönme)
        const el = currentLayer.getElement();
        if(el) {
            el.style.transition = "fill 0.5s";
            el.style.fill = "white";
            setTimeout(() => {
                currentLayer.setStyle(getProvinceStyle(currentFeature));
            }, 300);
        }
    }
}

// --- YARDIMCILAR ---
function getUniqueKey(feature) {
    // Benzersiz anahtar üret (ID yoksa koordinat ve isimden hashle)
    if (feature.id) return feature.id;
    const p = feature.properties;
    const rawStr = (p.name || p.NAME || JSON.stringify(p)).replace(/\s/g, '');
    return rawStr; // Basit string key
}

function guessName(feature) {
    const p = feature.properties;
    return p.name || p.NAME || p.Name || p.NAME_1 || p.VARNAME_1 || p.lektur || 
           p.bulgarian_name || p.NUTS3_NAME || p.province || "Bölge";
}

function injectEditorPanel() {
    if (document.getElementById('map-editor-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'map-editor-panel';
    panel.style.cssText = `
        display: none; position: absolute; top: 20px; right: 20px; width: 320px;
        background: #1e293b; border: 1px solid #475569; box-shadow: 0 10px 40px rgba(0,0,0,0.9);
        border-radius: 8px; padding: 20px; z-index: 9999; color: white; font-family: sans-serif;
    `;
    panel.innerHTML = `<div id="editor-content"></div>`;
    document.getElementById('app-container').appendChild(panel);
}

// --- DIŞARI VERİ ---
export function getSavedData(feature) {
    const key = getUniqueKey(feature);
    return savedData[key] || null;
}