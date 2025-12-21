// Harita Modülü
// Harita kurulumu ve yönetimi buradan yapılır.

let mapInstance = null;
let geoJsonLayer = null;

// Haritayı başlatır
export async function initMap(containerId) {
    // Eğer harita zaten varsa önce temizle (Hata önlemi)
    if (mapInstance) {
        destroyMap();
    }

    // 1. DÜNYA SINIRLARINI BELİRLE
    // Kullanıcının gidebileceği maksimum alan (Kuzey-Güney / Doğu-Batı)
    const southWest = L.latLng(-85, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    // 2. Harita Motorunu Oluştur
    mapInstance = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        
        // --- KRİTİK AYARLAR ---
        minZoom: 3,             // En fazla bu kadar uzaklaşabilir (Dünya ekrana tam sığar, küçülmez)
        maxZoom: 8,             // En fazla bu kadar yaklaşabilir
        maxBounds: bounds,      // Haritayı yukarıdaki sınırlara hapset
        maxBoundsViscosity: 1.0,// Kenara gelince esnemesin, taş gibi dursun
        worldCopyJump: true,    // Yatayda dünya tekrar ederken atlama yapmasın (Akıcı olsun)
        // ---------------------
        
        preferCanvas: true 
    }).setView([39.0, 35.0], 5); // Türkiye odaklı başla

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // 3. Veriyi Çek ve İşle
    console.log("Map: Veri indiriliyor...");
    
    try {
        // Localdeki dosyayı çekiyoruz (Daha önce indirmiştik)
        const response = await fetch('./assets/world.json');
        
        if (!response.ok) throw new Error(`Dosya Bulunamadı: ${response.status}`);
        
        const data = await response.json();

        // 4. Ülkeleri Haritaya Ekle
        geoJsonLayer = L.geoJSON(data, {
            style: getCountryStyle,
            onEachFeature: onCountryInteraction
        }).addTo(mapInstance);

        console.log("Map: Sınırlar başarıyla çizildi.");

    } catch (error) {
        console.error("Map Hatası:", error);
        // Hata durumunda ekrana mesaj bas (Eğer element varsa)
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; color:#ef4444; text-align:center;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem; margin-bottom:10px;"></i>
                    <p>Harita verisi yüklenemedi.</p>
                </div>
            `;
        }
    }
}

// Haritayı bellekten siler
export function destroyMap() {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
        geoJsonLayer = null;
        console.log("Map: Temizlendi.");
    }
}

// --- Stil ve Etkileşim Fonksiyonları ---

function getCountryStyle(feature) {
    return {
        fillColor: '#1e293b', // Ülke Rengi
        weight: 1,            // Sınır Kalınlığı
        opacity: 1,
        color: '#475569',     // Sınır Rengi
        fillOpacity: 1
    };
}

function onCountryInteraction(feature, layer) {
    const countryName = feature.properties.NAME || feature.properties.ADMIN || "Bilinmeyen Bölge";

    layer.on({
        mouseover: (e) => {
            const l = e.target;
            l.setStyle({
                weight: 2,
                color: '#60a5fa',
                fillColor: '#3b82f6'
            });
            l.bringToFront();
        },
        mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
        },
        click: (e) => {
            mapInstance.fitBounds(e.target.getBounds());
            
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`
                    <div style="text-align:center; min-width:100px;">
                        <b style="color:#0f172a; font-size:14px;">${countryName}</b>
                        <div style="margin-top:8px; display:flex; gap:5px; justify-content:center;">
                            <button style="background:#3b82f6; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:12px;">Profil</button>
                            <button style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:12px;">Savaş</button>
                        </div>
                    </div>
                `)
                .openOn(mapInstance);
        }
    });
}