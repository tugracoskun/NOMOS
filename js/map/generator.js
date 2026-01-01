// HARİTA ÜRETİM MOTORU (VORONOI GENERATOR)
// GÜÇLENDİRİLMİŞ VERSİYON: Ana kara tespiti ile Fransa gibi dağınık ülkeleri böler.

export function generateVoronoiRegions(countryFeature, numPoints = 5) {
    try {
        let searchBbox = turf.bbox(countryFeature);

        // --- AKILLI NİŞAN ALMA (YENİ) ---
        // Eğer ülke çok parçalıysa (Adalar, sömürgeler vs.), noktaları okyanusa atma.
        // En büyük kara parçasını bul ve oraya odaklan.
        if (countryFeature.geometry.type === 'MultiPolygon') {
            let maxArea = 0;
            let mainLandCoordinates = null;

            // Her bir parçanın alanını hesapla
            countryFeature.geometry.coordinates.forEach(coords => {
                try {
                    const poly = turf.polygon(coords);
                    const area = turf.area(poly);
                    if (area > maxArea) {
                        maxArea = area;
                        mainLandCoordinates = poly;
                    }
                } catch (e) { /* Geometri hatası varsa atla */ }
            });

            // Eğer ana karayı bulduysak, arama kutusunu (Bbox) ona göre daralt
            if (mainLandCoordinates) {
                searchBbox = turf.bbox(mainLandCoordinates);
            }
        }

        // 1. Rastgele Nokta Üretimi
        // Artık daraltılmış alana (Ana Kara) ateş ediyoruz, isabet oranı artıyor.
        // Yine de garanti olsun diye 20 katı nokta üretip filtriyoruz.
        const options = { bbox: searchBbox };
        const randomPoints = turf.randomPoint(numPoints * 20, options);

        // 2. Sadece KARA üzerindeki noktaları seç (Orijinal ülke sınırlarına göre)
        const pointsInside = {
            type: "FeatureCollection",
            features: randomPoints.features.filter(pt => booleanPointInPolygon(pt, countryFeature))
        };

        // Eğer hala yeterli nokta yoksa, ülkeyi olduğu gibi döndür
        if (pointsInside.features.length < 2) {
            const singleRegion = JSON.parse(JSON.stringify(countryFeature));
            singleRegion.properties.regionName = countryFeature.properties.NAME || "Merkez";
            return [singleRegion];
        }

        // 3. İstenen sayı kadar noktayı al
        const finalPoints = {
            type: "FeatureCollection",
            features: pointsInside.features.slice(0, numPoints)
        };

        // 4. Voronoi Diyagramını Oluştur
        // Not: Voronoi'yi hesaplarken tüm ülkenin Bbox'ını kullanıyoruz ki 
        // uzak adalar (Guyana vb.) da bir hücreye dahil olsun.
        const globalBbox = turf.bbox(countryFeature);
        const voronoiPolygons = turf.voronoi(finalPoints, { bbox: globalBbox });

        // 5. Hücreleri Ülke Sınırlarıyla Kes (Clip)
        const clippedRegions = [];

        voronoiPolygons.features.forEach((cell, index) => {
            try {
                const clipped = turf.intersect(cell, countryFeature);
                
                if (clipped) {
                    // Eğer kesme işlemi MultiPolygon döndürürse (örneğin Fransa + Korsika aynı hücredeyse)
                    // bunu tek bir feature olarak kabul et.
                    clipped.properties = {
                        ...countryFeature.properties, 
                        regionName: `Bölge ${index + 1}`,
                        regionId: `${countryFeature.properties.ISO_A3 || 'UNK'}_${index}`
                    };
                    clippedRegions.push(clipped);
                }
            } catch (e) { }
        });

        if (clippedRegions.length === 0) return [countryFeature];

        return clippedRegions;

    } catch (err) {
        console.warn(`Voronoi Hatası (${countryFeature.properties.ADMIN}):`, err);
        return [countryFeature];
    }
}

// --- YARDIMCI ---
function booleanPointInPolygon(point, polygon) {
    try {
        return turf.booleanPointInPolygon(point, polygon);
    } catch (e) {
        return false;
    }
}