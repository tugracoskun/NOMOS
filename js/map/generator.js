// HARİTA ÜRETİM MOTORU (VORONOI GENERATOR)
// GÜÇLENDİRİLMİŞ VERSİYON: Ana kara tespiti ile Fransa gibi dağınık ülkeleri böler.

export function generateVoronoiRegions(countryFeature, numPoints = 5, startIndex = 0) {
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

        // --- DETERMINISTIC RANDOM (SEED BAĞIMLI) ---
        // Harita her yüklendiğinde aynı sınırların oluşması için seed kullanıyoruz.
        // Seed olarak ülke ismini kullanacağız.
        const seedString = countryFeature.properties.ADMIN || countryFeature.properties.NAME || "Country";
        const seed = stringToSeed(seedString);

        // 1. Seed'li Rastgele Nokta Üretimi
        // turf.randomPoint yerine kendi fonksiyonumuzu kullanıyoruz.
        // Artık daraltılmış alana (Ana Kara) ateş ediyoruz.
        // Garanti olsun diye 30 katı nokta üretip filtriyoruz.
        const randomPoints = generateSeededPoints(numPoints * 30, searchBbox, seed);

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
                        regionId: `REGION_${String(startIndex + index).padStart(4, '0')}` // Unique ID
                    };
                    // ÖNEMLİ: Editor ve veri sistemi için feature.id ataması
                    clipped.id = clipped.properties.regionId;

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

// --- SEEDED RANDOM YARDIMCILARI ---

function stringToSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    }
    return h >>> 0;
}

function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function generateSeededPoints(count, bbox, seed) {
    const points = [];
    const minX = bbox[0];
    const minY = bbox[1];
    const maxX = bbox[2];
    const maxY = bbox[3];

    const random = mulberry32(seed);

    // Isınma turları (rastgeleliği dağıtmak için)
    random(); random(); random();

    for (let i = 0; i < count; i++) {
        const x = minX + (maxX - minX) * random();
        const y = minY + (maxY - minY) * random();
        points.push(turf.point([x, y]));
    }
    return { type: "FeatureCollection", features: points };
}