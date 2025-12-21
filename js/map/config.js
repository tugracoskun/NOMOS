// HARİTA AYARLARI VE SABİTLER

export const mapConfig = {
    minZoom: 4,  // Biraz daha yakın başlasın
    maxZoom: 10,
    startView: [39.0, 35.0], // Türkiye
    startZoom: 5,
    maxBounds: [
        [-85, -180],
        [85, 180]
    ]
};

export const dataUrls = {
    // Zemin (Sadece kıtaları tutsun yeter)
    world: './assets/world.json',
    
    // DETAYLI EYALETLER (10m - YÜKSEK ÇÖZÜNÜRLÜK)
    // Buradaki '10m' ibaresi kritik. Türkiye'nin illeri burada var.
    provinces: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.json'
};