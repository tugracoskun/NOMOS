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

    // 1. Harita Motorunu Oluştur
    // TileLayer (Resim) kullanmıyoruz, zemin rengini CSS'den alacak.
    mapInstance = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        minZoom: 3,
        maxZoom: 8,
        maxBoundsViscosity: 1.0,
        preferCanvas: true // Performans artışı
    }).setView([39.0, 35.0], 5); // Türkiye odaklı

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // 2. Veriyi Çek ve İşle (Natural Earth 50m - Yüksek Detay)
    console.log("Map: Veri indiriliyor...");
    
    try {
        // GÜNCELLENEN GÜVENİLİR URL (Cloudfront CDN)
        const response = await fetch('./assets/world.json');
        
        if (!response.ok) throw new Error(`Dosya Bulunamadı: ${response.status}`);
        
        const data = await response.json();

        // 3. Ülkeleri Haritaya Ekle
        geoJsonLayer = L.geoJSON(data, {
            style: getCountryStyle,
            onEachFeature: onCountryInteraction
        }).addTo(mapInstance);

        console.log("Map: Sınırlar başarıyla çizildi.");

    } catch (error) {
        console.error("Map Hatası:", error);
        document.getElementById(containerId).innerHTML = `
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; color:#ef4444; text-align:center;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem; margin-bottom:10px;"></i>
                <p>Harita verisi yüklenemedi.</p>
                <p style="font-size:0.8rem; color:#94a3b8;">${error.message}</p>
            </div>
        `;
    }
}

// Haritayı bellekten siler (Sayfa değişince çağrılır)
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
        fillColor: '#1e293b', // Ülke Rengi (Koyu Mavi-Gri)
        weight: 1,            // Sınır Kalınlığı
        opacity: 1,
        color: '#475569',     // Sınır Rengi (Açık Gri)
        fillOpacity: 1        // Tam Görünürlük (Alttaki denizi kapat)
    };
}

function onCountryInteraction(feature, layer) {
    // Bu veri setinde ülke ismi genellikle 'name' veya 'admin' içindedir.
    const countryName = feature.properties.name || feature.properties.admin || "Bilinmeyen Bölge";

    layer.on({
        // Mouse üzerine gelince
        mouseover: (e) => {
            const l = e.target;
            l.setStyle({
                weight: 2,
                color: '#60a5fa',     // Parlak Mavi Çerçeve
                fillColor: '#3b82f6'  // Parlak Mavi Dolgu
            });
            l.bringToFront(); // Öne çıkart
        },
        // Mouse gidince
        mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
        },
        // Tıklayınca
        click: (e) => {
            mapInstance.fitBounds(e.target.getBounds()); // Oraya odaklan
            
            // Popup aç
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