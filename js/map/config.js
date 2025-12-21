// HARİTA AYARLARI VE SABİTLER

export const mapConfig = {
    minZoom: 3,
    maxZoom: 10,
    startView: [39.0, 35.0], // Türkiye
    startZoom: 5,
    maxBounds: [
        [-85, -180], // Güney Batı
        [85, 180]    // Kuzey Doğu
    ]
};

export const dataUrls = {
    // Yerel dosya (Zemin)
    world: './assets/world.json',
    
    // Detaylı Eyaletler (Voronoi) - 10m Yüksek Çözünürlük (İzmir'i görmek için en iyisi)
    // Eğer internet yavaşsa 50m olanı kullanabiliriz ama 10m en net olanıdır.
    provinces: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.json'
};