import { resourcesEconomics } from './city-stats.js';

// GLOBAL PAZAR DURUMU
// Her kaynak için anlık çarpanı (multiplier) tutar. Varsayılan 1.0
export let marketState = {};

// Başlangıçta tüm kaynakları 1.0'a eşitle
export function initMarket() {
    Object.keys(resourcesEconomics).forEach(res => {
        marketState[res] = 1.0;
    });
    console.log("Market initialized with stable prices.");
}

// Belirli bir kaynağın çarpanını getir
export function getMarketMultiplier(resourceName) {
    return marketState[resourceName] || 1.0;
}

// Manuel fiyat güncelleme (Admin Panelinden)
export function updateMarketPrice(resourceName, newMultiplier) {
    if (resourcesEconomics[resourceName]) {
        marketState[resourceName] = parseFloat(newMultiplier);
        return true;
    }
    return false;
}

// --- GLOBAL OLAYLAR SİSTEMİ (SCENARIOS) ---
// Her senaryo belirli kaynakları belirli bir süre etkiler.

export const marketScenarios = [
    {
        id: 'oil_crisis',
        name: 'Petrol Krizi',
        description: 'Global petrol arzında şok düşüş. Fiyatlar fırlıyor!',
        effects: { 'Petrol': 2.5, 'Doğalgaz': 1.8 }, // Çarpanlar
        duration: 300, // Saniye (5 dakika)
        newsText: "SON DAKİKA: Orta Doğu'daki gerilim Petrol fiyatlarını uçurdu!",
        type: 'crisis'
    },
    {
        id: 'gold_rush',
        name: 'Altına Hücum',
        description: 'Ekonomik belirsizlik altını güvenli liman yaptı.',
        effects: { 'Altın': 1.6, 'Pırlanta': 1.4 },
        duration: 180,
        newsText: "EKONOMİ: Borsalardaki çöküş sonrası yatırımcı Altın'a yöneliyor.",
        type: 'boom'
    },
    {
        id: 'harvest_boom',
        name: 'Bereketli Hasat',
        description: 'İklim koşulları mükemmel gitti, gıda bolluğu var.',
        effects: { 'Buğday': 0.5, 'Mısır': 0.6, 'Pamuk': 0.7 },
        duration: 600, // 10 dakika ucuzluk
        newsText: "TARIM: Rekor rekolte beklentisi gıda fiyatlarını düşürdü.",
        type: 'surplus'
    },
    {
        id: 'tech_breakthrough',
        name: 'Teknoloji Devrimi',
        description: 'Yeni pil teknolojisi Nadir Metallere talebi artırdı.',
        effects: { 'Lityum': 2.2, 'Titanyum': 1.9, 'Bakır': 1.5 },
        duration: 400,
        newsText: "TEKNOLOJİ: Devrimsel pil patenti Lityum madenlerini değerli kıldı.",
        type: 'boom'
    },
    {
        id: 'global_war',
        name: 'Global Savaş',
        description: 'Dünya genelinde çatışma hali. Demir/Çelik kritik önemde.',
        effects: {
            'Demir': 3.0, 'Çelik': 2.8, 'Petrol': 2.0,
            'Buğday': 2.5, // Gıda da pahalanır
            'Lüks': 0.4 // Lüks tüketim ölür (Henüz lüks kategorisi yok ama mantık bu)
        },
        duration: 600,
        newsText: "SON DAKİKA: Küresel çatışma riski arttı! Stratejik kaynaklara talep patladı!",
        type: 'war' // DANGER ZONE
    }
];

// Olayı Tetikle
export function triggerScenario(scenarioId) {
    const scenario = marketScenarios.find(s => s.id === scenarioId);
    if (!scenario) return false;

    // 1. Etkileri Uygula
    Object.entries(scenario.effects).forEach(([res, mult]) => {
        if (marketState[res] !== undefined) {
            marketState[res] = mult;
        }
    });

    // 2. Haber Geç (UI'da gösterilecek)
    showNewsTicker(scenario.newsText, scenario.type);

    // 3. Süre bitince normale döndür
    setTimeout(() => {
        Object.keys(scenario.effects).forEach(res => {
            marketState[res] = 1.0; // Normale dön
        });
        showNewsTicker(`${scenario.name} sona erdi. Piyasalar normalleşiyor.`, 'info');
    }, scenario.duration * 1000);

    return true;
}

// Basit Haber Bandı (DOM)
function showNewsTicker(text, type) {
    let ticker = document.getElementById('global-news-ticker');

    // Eğer ticker yoksa yarat
    if (!ticker) {
        ticker = document.createElement('div');
        ticker.id = 'global-news-ticker';
        document.body.appendChild(ticker);

        // Temel Stil (Daha sonra CSS dosyasına taşınabilir)
        ticker.style.cssText = `
            position: fixed;
            top: 70px; /* Header'ın hemen altı */
            left: 0;
            width: 100%;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 0;
            overflow: hidden;
            z-index: 9000;
            display: none;
            border-bottom: 2px solid #ef4444;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            letter-spacing: 0.5px;
        `;
    }

    // Renk Ayarı
    let color = '#fff';
    let borderColor = '#3b82f6'; // Mavi (Info)

    if (type === 'crisis' || type === 'war') {
        borderColor = '#ef4444'; // Kırmızı
        ticker.style.background = 'linear-gradient(90deg, #7f1d1d 0%, #000 100%)';
    } else if (type === 'boom') {
        borderColor = '#eab308'; // Altın
        ticker.style.background = 'linear-gradient(90deg, #713f12 0%, #000 100%)';
    } else if (type === 'surplus') {
        borderColor = '#22c55e'; // Yeşil
        ticker.style.background = 'linear-gradient(90deg, #14532d 0%, #000 100%)';
    }

    ticker.style.borderBottomColor = borderColor;
    ticker.style.display = 'block';

    ticker.innerHTML = `<div class="scrolling-text" style="
        white-space: nowrap; 
        animation: scrollText 20s linear infinite; 
        padding-left: 100%;
        color: ${color};
        text-transform: uppercase;
    ">🚨 ${text} 🚨</div>`;

    // Animasyon ekle (dinamik style)
    if (!document.getElementById('news-anim-style')) {
        const style = document.createElement('style');
        style.id = 'news-anim-style';
        style.textContent = `
            @keyframes scrollText {
                0% { transform: translateX(0); }
                100% { transform: translateX(-100%); }
            }
        `;
        document.head.appendChild(style);
    }

    // 15 saniye sonra gizle (Opsiyonel)
    setTimeout(() => {
        ticker.style.display = 'none';
    }, 15000);
}
