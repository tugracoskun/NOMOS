// KATMAN AYARLARI (PANES & Z-INDEX)

export function setupMapPanes(mapInstance) {
    // 1. Zemin Katmanı (En Alt)
    if (!mapInstance.getPane('basePane')) {
        mapInstance.createPane('basePane');
        mapInstance.getPane('basePane').style.zIndex = 300;
    }

    // 2. Detay Katmanı (Orta - Renkli Şehirler)
    if (!mapInstance.getPane('detailPane')) {
        mapInstance.createPane('detailPane');
        mapInstance.getPane('detailPane').style.zIndex = 400; 
    }

    // 3. Sınır Katmanı (En Üst - Siyah Çerçeveler)
    if (!mapInstance.getPane('borderPane')) {
        mapInstance.createPane('borderPane');
        mapInstance.getPane('borderPane').style.zIndex = 500;
        // Tıklamayı engelle ki alttaki şehre tıklayabilelim
        mapInstance.getPane('borderPane').style.pointerEvents = 'none'; 
    }
}