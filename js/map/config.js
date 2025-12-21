// HARİTA AYARLARI VE SABİTLER

export const mapConfig = {
    minZoom: 4,
    maxZoom: 10,
    startView: [39.0, 35.0], // Türkiye'ye odaklan
    startZoom: 6,            // Biraz daha yakından başla
    maxBounds: [
        [-85, -180],
        [85, 180]
    ]
};

export const dataUrls = {
    // Zemin (Dünya Ülkeleri - Siyah Arka Plan)
    world: './assets/world.json',
    
    // DETAY KATMANI: SADECE TÜRKİYE (HIZLI VE KESİN ÇÖZÜM)
    // Bu dosya hafif olduğu için anında İzmir, Ankara sınırlarını çizecek.
    provinces: 'https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json'
};