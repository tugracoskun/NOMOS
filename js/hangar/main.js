// HANGAR MODÜLÜ — V2
// Askeri birimler, sivil araçlar, üretim ve depo yönetimi
// Çalışan satın alma sistemi, detaylı birim istatistikleri, info popup

import { gameState, updateGold } from '../data/state.js';

// ===================================================================
// VERİ KATMANI — ASKERİ BİRİM VERİTABANI (Genişletilmiş)
// ===================================================================
// Her birimin detaylı istatistikleri:
//   attack: Saldırı gücü (0-150)
//   defense: Savunma gücü (0-150)
//   speed: Hareket hızı (1-10)
//   upkeep: Günlük bakım maliyeti (₳/gün)
//   wearRate: Savaşta yıpranma oranı (% / muharebe)
//   repairCost: Hasar onarım maliyeti (₳ / %hasar başına)
//   requiredLevel: Satın alabilmek için gereken minimum oyuncu seviyesi
//   desc: Birim açıklaması

const unitDatabase = {
    // ======================== KARA KUVVETLERİ ========================
    land: [
        {
            id: 'militia', name: 'Milis', icon: 'fa-person', tier: 1,
            attack: 8, defense: 10, speed: 3, upkeep: 20,
            wearRate: 15, repairCost: 5, requiredLevel: 1, cost: 500, batchSize: 1000,
            desc: 'Düşük maliyetli, hızla toplanabilen halk gücü. Sayıyla etkili olur ancak düzenli ordu karşısında dayanıksızdır. Bakım maliyeti düşüktür.'
        },
        {
            id: 'inf', name: 'Piyade', icon: 'fa-person-rifle', tier: 1,
            attack: 15, defense: 20, speed: 3, upkeep: 50,
            wearRate: 12, repairCost: 8, requiredLevel: 1, cost: 1200, batchSize: 1000,
            desc: 'Temel kara savaş birimi. Her türlü arazide savaşabilir. Şehir savunmasında ve işgalinde kritik rol oynar. Savaşta orta düzey yıpranma yaşar.'
        },
        {
            id: 'spec_ops', name: 'Özel Kuvvetler', icon: 'fa-user-secret', tier: 2,
            attack: 45, defense: 25, speed: 7, upkeep: 200,
            wearRate: 8, repairCost: 40, requiredLevel: 5, cost: 5000, batchSize: 100,
            desc: 'Yüksek eğitimli seçkin birlikler. Sabotaj, keşif ve hassas operasyonlarda kullanılır. Düşük yıpranma ama onarımı pahalıdır.'
        },
        {
            id: 'apc', name: 'ZPT (APC)', icon: 'fa-truck-field', tier: 1,
            attack: 25, defense: 50, speed: 6, upkeep: 150,
            wearRate: 10, repairCost: 30, requiredLevel: 3, cost: 3000, batchSize: 50,
            desc: 'Zırhlı Personel Taşıyıcısı. Piyadelerinizi cepheye güvenle ulaştırır. Savunması yüksek, saldırı gücü orta düzeydedir.'
        },
        {
            id: 'ifv', name: 'ZMA (IFV)', icon: 'fa-truck-field-un', tier: 2,
            attack: 40, defense: 55, speed: 6, upkeep: 250,
            wearRate: 10, repairCost: 45, requiredLevel: 6, cost: 6000, batchSize: 30,
            desc: 'Zırhlı Muharebe Aracı. ZPT\'den daha ağır silahlıdır. Hem asker taşır hem de doğrudan savaşa girer. Her yönden dengeli bir birimdir.'
        },
        {
            id: 'art', name: 'Topçu', icon: 'fa-crosshairs', tier: 2,
            attack: 95, defense: 12, speed: 2, upkeep: 250,
            wearRate: 8, repairCost: 50, requiredLevel: 4, cost: 4500, batchSize: 20,
            desc: 'Uzun menzilli ateş destek birimi. Düşman mevzilerini mesafeden vurur. Çok yüksek saldırı gücüne sahip ama yakın savunması çok zayıftır.'
        },
        {
            id: 'mlrs', name: 'Çok Namlulu Roketatar', icon: 'fa-burst', tier: 3,
            attack: 120, defense: 8, speed: 3, upkeep: 500,
            wearRate: 12, repairCost: 80, requiredLevel: 8, cost: 12000, batchSize: 10,
            desc: 'Geniş alanı aynı anda vurabilen güçlü roket sistemi. Topçudan daha yıkıcı ama mermi maliyeti yüksek, yıpranması fazladır.'
        },
        {
            id: 'tank_light', name: 'Hafif Tank', icon: 'fa-truck-monster', tier: 2,
            attack: 55, defense: 50, speed: 7, upkeep: 200,
            wearRate: 10, repairCost: 40, requiredLevel: 4, cost: 5000, batchSize: 20,
            desc: 'Hızlı hareket edebilen hafif zırhlı muharebe aracı. Keşif ve yan hücumlarda etkilidir. Ağır tanklara karşı dezavantajlıdır.'
        },
        {
            id: 'tank', name: 'Ana Muharebe Tankı', icon: 'fa-truck-monster', tier: 3,
            attack: 85, defense: 75, speed: 5, upkeep: 350,
            wearRate: 8, repairCost: 70, requiredLevel: 7, cost: 10000, batchSize: 10,
            desc: 'Zırhlı savaşın kralı. Yüksek saldırı ve savunma gücü sunar. Bakımı pahalıdır ama savaş alanının en etkili kara birimidir.'
        },
        {
            id: 'tank_heavy', name: 'Ağır Tank', icon: 'fa-truck-monster', tier: 3,
            attack: 100, defense: 95, speed: 3, upkeep: 600,
            wearRate: 6, repairCost: 120, requiredLevel: 10, cost: 18000, batchSize: 5,
            desc: 'Son derece kalın zırha sahip ağır savaş makinesi. Çeperin kırılmasında kullanılır. Yavaştır ama neredeyse durdurulamaz.'
        },
        {
            id: 'sam', name: 'Hava Savunma (SAM)', icon: 'fa-satellite-dish', tier: 2,
            attack: 70, defense: 30, speed: 2, upkeep: 300,
            wearRate: 5, repairCost: 60, requiredLevel: 5, cost: 7000, batchSize: 10,
            desc: 'Yüzeyden havaya füze sistemi. Düşman uçaklarını ve füzelerini engeller. Hava savunması olmadan ordunuz havadan savunmasız kalır.'
        },
    ],
    // ======================== HAVA KUVVETLERİ ========================
    air: [
        {
            id: 'recon', name: 'Keşif Uçağı', icon: 'fa-binoculars', tier: 1,
            attack: 5, defense: 10, speed: 9, upkeep: 150,
            wearRate: 4, repairCost: 30, requiredLevel: 2, cost: 3000, batchSize: 5,
            desc: 'Düşman hareketlerini tespit eden istihbarat uçağı. Saldırı gücü yoktur ama savaşta keşif bonusu sağlar.'
        },
        {
            id: 'drone', name: 'İHA (Keşif)', icon: 'fa-satellite', tier: 1,
            attack: 15, defense: 3, speed: 7, upkeep: 80,
            wearRate: 6, repairCost: 15, requiredLevel: 2, cost: 1500, batchSize: 10,
            desc: 'İnsansız keşif aracı. Ucuz ve harcana­bilir. Düşman mevzilerini tespit eder ve hafif saldırı yapabilir.'
        },
        {
            id: 'siha', name: 'SİHA (Taarruz)', icon: 'fa-satellite', tier: 2,
            attack: 70, defense: 5, speed: 7, upkeep: 200,
            wearRate: 10, repairCost: 35, requiredLevel: 5, cost: 5000, batchSize: 5,
            desc: 'Silahlı insansız hava aracı. Hassas mühimmatla zırhlı hedefleri vurur. Yıpranma oranı yüksek ama pilot kaybı riski yoktur.'
        },
        {
            id: 'fighter', name: 'Avcı Uçağı', icon: 'fa-jet-fighter', tier: 2,
            attack: 80, defense: 25, speed: 10, upkeep: 600,
            wearRate: 8, repairCost: 100, requiredLevel: 6, cost: 15000, batchSize: 1,
            desc: 'Hava üstünlüğü sağlamak için tasarlanmış savaş jeti. Hava muharebelerinde rakipsizdir. Bakımı ve onarımı pahalıdır.'
        },
        {
            id: 'multirole', name: 'Çok Amaçlı Jet', icon: 'fa-jet-fighter-up', tier: 3,
            attack: 90, defense: 30, speed: 9, upkeep: 800,
            wearRate: 9, repairCost: 130, requiredLevel: 8, cost: 22000, batchSize: 1,
            desc: 'Hem hava hem kara hedeflerini vurabilen gelişmiş savaş uçağı. En esnek hava birimi. Yüksek saldırı gücü ve hıza sahiptir.'
        },
        {
            id: 'bomber', name: 'Bombardıman Uçağı', icon: 'fa-plane', tier: 2,
            attack: 130, defense: 15, speed: 6, upkeep: 1200,
            wearRate: 7, repairCost: 150, requiredLevel: 7, cost: 25000, batchSize: 1,
            desc: 'Stratejik bombalama kapasitesine sahip ağır uçak. Altyapı ve endüstriyi hedef alır. Avcı uçağı koruması olmadan savunmasızdır.'
        },
        {
            id: 'stealth', name: 'Hayalet Uçak', icon: 'fa-jet-fighter', tier: 3,
            attack: 95, defense: 20, speed: 9, upkeep: 1500,
            wearRate: 5, repairCost: 250, requiredLevel: 11, cost: 40000, batchSize: 1,
            desc: 'Radara yakalanmayan 5. nesil savaş uçağı. İlk vuruş avantajı sağlar. Son derece pahalı ama savaşın seyrini değiştirebilir.'
        },
        {
            id: 'heli_attack', name: 'Taarruz Helikopteri', icon: 'fa-helicopter', tier: 2,
            attack: 65, defense: 30, speed: 6, upkeep: 500,
            wearRate: 10, repairCost: 80, requiredLevel: 5, cost: 10000, batchSize: 2,
            desc: 'Zırhlı araçlara karşı etkili saldırı helikopteri. Alçak uçuş yaparak tank ve konvoyları avlar.'
        },
        {
            id: 'heli_transport', name: 'Nakliye Helikopteri', icon: 'fa-helicopter', tier: 1,
            attack: 10, defense: 25, speed: 5, upkeep: 300,
            wearRate: 6, repairCost: 50, requiredLevel: 3, cost: 6000, batchSize: 2,
            desc: 'Asker ve malzeme taşıyan helikopter. Saldırı gücü düşük ama lojistik destek için kritik öneme sahiptir.'
        },
    ],
    // ======================== DENİZ KUVVETLERİ ========================
    sea: [
        {
            id: 'patrol', name: 'Devriye Botu', icon: 'fa-sailboat', tier: 1,
            attack: 20, defense: 15, speed: 8, upkeep: 100,
            wearRate: 8, repairCost: 15, requiredLevel: 2, cost: 2000, batchSize: 5,
            desc: 'Kıyı devriye ve koruma görevi yapan hızlı bot. Kaçakçılık önleme ve kıyı güvenliği sağlar. Açık denizde yetersiz kalır.'
        },
        {
            id: 'corvette', name: 'Korvet', icon: 'fa-ship', tier: 1,
            attack: 40, defense: 35, speed: 7, upkeep: 400,
            wearRate: 7, repairCost: 60, requiredLevel: 4, cost: 8000, batchSize: 2,
            desc: 'Küçük ama çevik savaş gemisi. Denizaltı avlamada ve kıyı savunmasında etkilidir. Firkateyn kadar güçlü değildir.'
        },
        {
            id: 'frig', name: 'Firkateyn', icon: 'fa-ship', tier: 2,
            attack: 60, defense: 55, speed: 6, upkeep: 1500,
            wearRate: 6, repairCost: 200, requiredLevel: 6, cost: 25000, batchSize: 1,
            desc: 'Çok amaçlı savaş gemisi. Denizaltı savunması, hava savunması ve yüzey muharebesinde dengeli performans gösterir.'
        },
        {
            id: 'destroyer', name: 'Muhrip', icon: 'fa-ship', tier: 2,
            attack: 75, defense: 50, speed: 7, upkeep: 2000,
            wearRate: 6, repairCost: 280, requiredLevel: 8, cost: 35000, batchSize: 1,
            desc: 'Hızlı ve ağır silahlı savaş gemisi. Filo korumasında ve denizaltı avlamada uzmandır. Yüksek ateş gücüne sahiptir.'
        },
        {
            id: 'cruiser', name: 'Kruvazör', icon: 'fa-ship', tier: 3,
            attack: 90, defense: 70, speed: 5, upkeep: 3500,
            wearRate: 5, repairCost: 400, requiredLevel: 10, cost: 50000, batchSize: 1,
            desc: 'Büyük ve güçlü yüzey savaş gemisi. Uzun menzilli füze saldırıları yapabilir. Filo komuta gemisi olarak kullanılabilir.'
        },
        {
            id: 'sub', name: 'Denizaltı', icon: 'fa-water', tier: 2,
            attack: 85, defense: 40, speed: 5, upkeep: 2000,
            wearRate: 5, repairCost: 300, requiredLevel: 7, cost: 35000, batchSize: 1,
            desc: 'Su altından torpido ve füze saldırıları yapan gizli gemi. Tespit edilmesi zordur ve ticaret yollarını kesmede çok etkilidir.'
        },
        {
            id: 'sub_nuclear', name: 'Nükleer Denizaltı', icon: 'fa-radiation', tier: 3,
            attack: 110, defense: 50, speed: 6, upkeep: 5000,
            wearRate: 3, repairCost: 600, requiredLevel: 12, cost: 80000, batchSize: 1,
            desc: 'Nükleer güçle çalışan stratejik denizaltı. Aylarca su altında kalabilir. Caydırıcı güç olarak rakipsizdir.'
        },
        {
            id: 'carrier', name: 'Uçak Gemisi', icon: 'fa-anchor', tier: 3,
            attack: 50, defense: 90, speed: 4, upkeep: 8000,
            wearRate: 3, repairCost: 800, requiredLevel: 12, cost: 120000, batchSize: 1,
            desc: 'Yüzen askeri üs. Uçakları barındırır ve uzak bölgelere hava gücü yansıtır. Bir filonun kalbidir. Korunması şarttır.'
        },
        {
            id: 'landing', name: 'Çıkarma Gemisi', icon: 'fa-ship', tier: 2,
            attack: 20, defense: 60, speed: 4, upkeep: 1200,
            wearRate: 8, repairCost: 150, requiredLevel: 6, cost: 20000, batchSize: 1,
            desc: 'Kara birliklerini düşman kıyılarına çıkaran amfibi savaş gemisi. İşgal operasyonları için zorunludur.'
        },
    ]
};

// ===================================================================
// SİVİL ARAÇ VERİTABANI
// ===================================================================
const civilDatabase = [
    {
        id: 'cargo_ship', name: 'Kargo Gemisi', icon: 'fa-ship',
        cost: 28000, buildTime: '6g', capacity: '15,000 ton', income: 2400, requiredLevel: 3,
        desc: 'Büyük yük kapasiteli ticaret gemisi. Hammadde ve ürün taşıyarak günlük pasif gelir sağlar. Ticaret yollarında çalışır.'
    },
    {
        id: 'tanker', name: 'Tanker', icon: 'fa-gas-pump',
        cost: 32000, buildTime: '7g', capacity: '25,000 varil', income: 3800, requiredLevel: 5,
        desc: 'Petrol ve sıvı yakıt taşıyan gemi. Enerji ticaretinden yüksek gelir getirir. Savaş zamanında stratejik hedef olabilir.'
    },
    {
        id: 'passenger', name: 'Yolcu Uçağı', icon: 'fa-plane-departure',
        cost: 45000, buildTime: '10g', capacity: '180 yolcu', income: 5200, requiredLevel: 7,
        desc: 'Uluslararası yolcu taşımacılığı yapan sivil uçak. Turizm ve diplomatik ziyaretlerden gelir elde eder.'
    },
    {
        id: 'fishing', name: 'Balıkçı Teknesi', icon: 'fa-fish',
        cost: 5000, buildTime: '2g', capacity: '500 kg', income: 600, requiredLevel: 1,
        desc: 'Balık avlayan küçük gemi. Düşük maliyetli erken oyun gelir kaynağı. Besin üretimi ve ihracat için kullanılır.'
    },
    {
        id: 'cargo_plane', name: 'Kargo Uçağı', icon: 'fa-plane',
        cost: 55000, buildTime: '12g', capacity: '80 ton', income: 4800, requiredLevel: 8,
        desc: 'Hızlı hava yolu taşımacılığı yapan kargo uçağı. Değerli malları hızlıca taşır. Yüksek gelir ama bakım maliyeti fazladır.'
    },
    {
        id: 'cruise', name: 'Yolcu Gemisi (Kruvaziyer)', icon: 'fa-ship',
        cost: 70000, buildTime: '15g', capacity: '2,000 yolcu', income: 7500, requiredLevel: 10,
        desc: 'Lüks yolcu gemisi. Turizm gelirini en üst düzeye çıkarır. Pahalıdır ama en yüksek pasif geliri sağlayan sivil araçtır.'
    },
];

// ===================================================================
// OYUNCU ENVANTERİ (Dinamik)
// ===================================================================
let inventory = {
    military: {
        militia: 0, inf: 12000, spec_ops: 0, apc: 220, ifv: 0, art: 180, mlrs: 0,
        tank_light: 0, tank: 340, tank_heavy: 0, sam: 0,
        recon: 0, drone: 50, siha: 46, fighter: 64, multirole: 0, bomber: 18,
        stealth: 0, heli_attack: 42, heli_transport: 0,
        patrol: 0, corvette: 0, frig: 8, destroyer: 0, cruiser: 0,
        sub: 4, sub_nuclear: 0, carrier: 1, landing: 0
    },
    civil: [
        { id: 'cargo_ship', count: 3, status: 'Aktif' },
        { id: 'tanker', count: 2, status: 'Aktif' },
        { id: 'passenger', count: 1, status: 'Bakımda' },
        { id: 'fishing', count: 5, status: 'Aktif' },
    ]
};

let productionQueue = [
    { id: 1, unitId: 'fighter', name: 'Avcı Uçağı', icon: 'fa-jet-fighter', progress: 72, timeLeft: '2g 8sa', cost: 15000, type: 'military' },
    { id: 2, unitId: 'cargo_ship', name: 'Kargo Gemisi', icon: 'fa-ship', progress: 35, timeLeft: '5g 14sa', cost: 28000, type: 'civil' },
    { id: 3, unitId: 'siha', name: 'SİHA x5', icon: 'fa-satellite', progress: 90, timeLeft: '6sa', cost: 5000, type: 'military' },
];

const MAX_PRODUCTION_SLOTS = 5;
let activeTab = 'overview';

// ===================================================================
// YARDIMCI FONKSİYONLAR
// ===================================================================
function getPlayerLevel() {
    return gameState.level || 12;
}

function recalcStats() {
    let totalMil = 0;
    Object.values(inventory.military).forEach(c => totalMil += c);
    let totalCivil = inventory.civil.reduce((s, v) => s + v.count, 0);
    let dailyUpkeep = 0;
    const allUnits = [...unitDatabase.land, ...unitDatabase.air, ...unitDatabase.sea];
    allUnits.forEach(u => {
        dailyUpkeep += (inventory.military[u.id] || 0) * u.upkeep;
    });
    let dailyIncome = 0;
    inventory.civil.forEach(cv => {
        if (cv.status === 'Aktif') {
            const def = civilDatabase.find(d => d.id === cv.id);
            if (def) dailyIncome += def.income * cv.count;
        }
    });
    return { totalMilitary: totalMil, totalCivil, dailyUpkeep, dailyIncome };
}

function showToast(msg, type = 'success') {
    const existing = document.querySelector('.hangar-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `hangar-toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

// ===================================================================
// INFO POPUP
// ===================================================================
function showInfoPopup(unit) {
    const existing = document.getElementById('hangar-info-popup');
    if (existing) existing.remove();

    const playerLvl = getPlayerLevel();
    const locked = playerLvl < unit.requiredLevel;
    const owned = inventory.military[unit.id] || 0;

    const popup = document.createElement('div');
    popup.id = 'hangar-info-popup';
    popup.className = 'hangar-info-overlay';
    popup.innerHTML = `
        <div class="hangar-info-popup">
            <div class="hip-header">
                <div class="hip-icon"><i class="fa-solid ${unit.icon}"></i></div>
                <div class="hip-title-area">
                    <h3>${unit.name}</h3>
                    <span class="hip-tier">Kademe ${unit.tier} ${locked ? '<span class="hip-locked"><i class="fa-solid fa-lock"></i> Seviye ' + unit.requiredLevel + ' gerekli</span>' : ''}</span>
                </div>
                <button class="hip-close" id="hip-close-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="hip-body">
                <p class="hip-desc">${unit.desc}</p>
                <div class="hip-stats">
                    <div class="hip-stat"><div class="hip-stat-label"><i class="fa-solid fa-crosshairs"></i> Saldırı</div><div class="hip-stat-bar"><div class="hip-stat-fill attack" style="width:${(unit.attack/150)*100}%"></div></div><span>${unit.attack}</span></div>
                    <div class="hip-stat"><div class="hip-stat-label"><i class="fa-solid fa-shield-halved"></i> Savunma</div><div class="hip-stat-bar"><div class="hip-stat-fill defense" style="width:${(unit.defense/150)*100}%"></div></div><span>${unit.defense}</span></div>
                    <div class="hip-stat"><div class="hip-stat-label"><i class="fa-solid fa-gauge-high"></i> Hız</div><div class="hip-stat-bar"><div class="hip-stat-fill speed" style="width:${(unit.speed/10)*100}%"></div></div><span>${unit.speed}</span></div>
                </div>
                <div class="hip-details-grid">
                    <div class="hip-detail"><span class="hd-label">Günlük Bakım</span><span class="hd-val upkeep">${unit.upkeep} ₳/gün</span></div>
                    <div class="hip-detail"><span class="hd-label">Savaş Yıpranması</span><span class="hd-val wear">${unit.wearRate}% / muharebe</span></div>
                    <div class="hip-detail"><span class="hd-label">Onarım Maliyeti</span><span class="hd-val repair">${unit.repairCost} ₳ / %hasar</span></div>
                    <div class="hip-detail"><span class="hd-label">Envanterinizde</span><span class="hd-val owned">${owned.toLocaleString()} adet</span></div>
                </div>
            </div>
            <div class="hip-footer">
                <div class="hip-cost"><i class="fa-solid fa-coins"></i> ${unit.cost.toLocaleString()} ₳ <span class="hip-batch">(x${unit.batchSize.toLocaleString()})</span></div>
                <button class="hip-buy-btn ${locked ? 'disabled' : ''}" ${locked ? 'disabled' : ''} data-unit-id="${unit.id}">
                    ${locked ? '<i class="fa-solid fa-lock"></i> Kilitli' : '<i class="fa-solid fa-cart-plus"></i> Satın Al'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 10);

    // Events
    popup.querySelector('#hip-close-btn').addEventListener('click', () => closeInfoPopup());
    popup.addEventListener('click', (e) => { if (e.target === popup) closeInfoPopup(); });

    const buyBtn = popup.querySelector('.hip-buy-btn');
    if (buyBtn && !locked) {
        buyBtn.addEventListener('click', () => {
            purchaseMilitary(unit);
            closeInfoPopup();
        });
    }
}

function showCivilInfoPopup(vehicle) {
    const existing = document.getElementById('hangar-info-popup');
    if (existing) existing.remove();

    const playerLvl = getPlayerLevel();
    const locked = playerLvl < vehicle.requiredLevel;
    const owned = inventory.civil.filter(c => c.id === vehicle.id).reduce((s, c) => s + c.count, 0);

    const popup = document.createElement('div');
    popup.id = 'hangar-info-popup';
    popup.className = 'hangar-info-overlay';
    popup.innerHTML = `
        <div class="hangar-info-popup">
            <div class="hip-header">
                <div class="hip-icon civil"><i class="fa-solid ${vehicle.icon}"></i></div>
                <div class="hip-title-area">
                    <h3>${vehicle.name}</h3>
                    <span class="hip-tier">Sivil Araç ${locked ? '<span class="hip-locked"><i class="fa-solid fa-lock"></i> Seviye ' + vehicle.requiredLevel + ' gerekli</span>' : ''}</span>
                </div>
                <button class="hip-close" id="hip-close-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="hip-body">
                <p class="hip-desc">${vehicle.desc}</p>
                <div class="hip-details-grid">
                    <div class="hip-detail"><span class="hd-label">Kapasite</span><span class="hd-val">${vehicle.capacity}</span></div>
                    <div class="hip-detail"><span class="hd-label">Günlük Gelir</span><span class="hd-val income">+${vehicle.income.toLocaleString()} ₳</span></div>
                    <div class="hip-detail"><span class="hd-label">Üretim Süresi</span><span class="hd-val">${vehicle.buildTime}</span></div>
                    <div class="hip-detail"><span class="hd-label">Envanterinizde</span><span class="hd-val owned">${owned} adet</span></div>
                </div>
            </div>
            <div class="hip-footer">
                <div class="hip-cost"><i class="fa-solid fa-coins"></i> ${vehicle.cost.toLocaleString()} ₳</div>
                <button class="hip-buy-btn civil ${locked ? 'disabled' : ''}" ${locked ? 'disabled' : ''} data-civil-id="${vehicle.id}">
                    ${locked ? '<i class="fa-solid fa-lock"></i> Kilitli' : '<i class="fa-solid fa-industry"></i> Üretime Başla'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 10);

    popup.querySelector('#hip-close-btn').addEventListener('click', () => closeInfoPopup());
    popup.addEventListener('click', (e) => { if (e.target === popup) closeInfoPopup(); });

    const buyBtn = popup.querySelector('.hip-buy-btn');
    if (buyBtn && !locked) {
        buyBtn.addEventListener('click', () => {
            purchaseCivil(vehicle);
            closeInfoPopup();
        });
    }
}

function closeInfoPopup() {
    const popup = document.getElementById('hangar-info-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// ===================================================================
// SATIN ALMA SİSTEMİ
// ===================================================================
function purchaseMilitary(unit) {
    if (gameState.gold < unit.cost) {
        showToast('Yeterli altın yok! Gereken: ' + unit.cost.toLocaleString() + ' ₳', 'error');
        return;
    }
    updateGold(-unit.cost, `${unit.name} x${unit.batchSize.toLocaleString()} satın alındı`);
    inventory.military[unit.id] = (inventory.military[unit.id] || 0) + unit.batchSize;
    showToast(`${unit.name} x${unit.batchSize.toLocaleString()} envanterinize eklendi!`);
    refreshCurrentTab();
}

function purchaseCivil(vehicle) {
    if (gameState.gold < vehicle.cost) {
        showToast('Yeterli altın yok! Gereken: ' + vehicle.cost.toLocaleString() + ' ₳', 'error');
        return;
    }
    if (productionQueue.length >= MAX_PRODUCTION_SLOTS) {
        showToast('Üretim slotları dolu! Mevcut üretim tamamlanana kadar bekleyin.', 'error');
        return;
    }
    updateGold(-vehicle.cost, `${vehicle.name} üretim siparişi`);
    productionQueue.push({
        id: Date.now(),
        unitId: vehicle.id,
        name: vehicle.name,
        icon: vehicle.icon,
        progress: 0,
        timeLeft: vehicle.buildTime,
        cost: vehicle.cost,
        type: 'civil'
    });
    showToast(`${vehicle.name} üretime eklendi! (${vehicle.buildTime})`);
    refreshCurrentTab();
}

function refreshCurrentTab() {
    const content = document.getElementById('hangar-content');
    if (!content) return;
    switch (activeTab) {
        case 'overview': content.innerHTML = renderOverviewTab(); break;
        case 'military': content.innerHTML = renderMilitaryTab(); initMilitarySubTabs(); break;
        case 'civil': content.innerHTML = renderCivilTab(); break;
        case 'production': content.innerHTML = renderProductionTab(); break;
        case 'shop': content.innerHTML = renderShopTab(); initShopEvents(); break;
    }
}

// ===================================================================
// ANA RENDER
// ===================================================================
export function renderHangarPage(container) {
    if (!container) return;
    activeTab = 'overview';

    container.innerHTML = `
        <div class="hangar-page">
            <div class="hangar-tabs">
                <button class="hangar-tab active" data-tab="overview">
                    <i class="fa-solid fa-warehouse"></i> Genel Bakış
                </button>
                <button class="hangar-tab" data-tab="military">
                    <i class="fa-solid fa-shield-halved"></i> Askeri Birimler
                </button>
                <button class="hangar-tab" data-tab="civil">
                    <i class="fa-solid fa-plane-departure"></i> Sivil Araçlar
                </button>
                <button class="hangar-tab" data-tab="production">
                    <i class="fa-solid fa-industry"></i> Üretim
                </button>
                <button class="hangar-tab" data-tab="shop">
                    <i class="fa-solid fa-cart-shopping"></i> Satın Al
                </button>
            </div>
            <div class="hangar-content" id="hangar-content">
                ${renderOverviewTab()}
            </div>
        </div>
    `;

    initHangarEvents();
}

function initHangarEvents() {
    document.querySelectorAll('.hangar-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.hangar-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.dataset.tab;
            refreshCurrentTab();
        });
    });
}

// ===================================================================
// 1. GENEL BAKIŞ
// ===================================================================
function renderOverviewTab() {
    const stats = recalcStats();
    const netDaily = stats.dailyIncome - stats.dailyUpkeep;
    return `
        <div class="hangar-overview">
            <div class="hangar-stat-cards">
                <div class="hangar-stat-card">
                    <div class="hsc-icon military"><i class="fa-solid fa-shield-halved"></i></div>
                    <div class="hsc-info">
                        <div class="hsc-value">${stats.totalMilitary.toLocaleString()}</div>
                        <div class="hsc-label">Toplam Askeri Birim</div>
                    </div>
                </div>
                <div class="hangar-stat-card">
                    <div class="hsc-icon civil"><i class="fa-solid fa-plane-departure"></i></div>
                    <div class="hsc-info">
                        <div class="hsc-value">${stats.totalCivil}</div>
                        <div class="hsc-label">Sivil Araç</div>
                    </div>
                </div>
                <div class="hangar-stat-card">
                    <div class="hsc-icon upkeep"><i class="fa-solid fa-coins"></i></div>
                    <div class="hsc-info">
                        <div class="hsc-value">-${stats.dailyUpkeep.toLocaleString()} ₳</div>
                        <div class="hsc-label">Günlük Bakım</div>
                    </div>
                </div>
                <div class="hangar-stat-card">
                    <div class="hsc-icon ${netDaily >= 0 ? 'income' : 'loss'}"><i class="fa-solid fa-chart-line"></i></div>
                    <div class="hsc-info">
                        <div class="hsc-value">${netDaily >= 0 ? '+' : ''}${netDaily.toLocaleString()} ₳</div>
                        <div class="hsc-label">Sivil Gelir</div>
                    </div>
                </div>
            </div>

            <div class="hangar-overview-grid">
                <div class="hangar-widget">
                    <div class="hangar-widget-header"><h3><i class="fa-solid fa-chart-pie"></i> Kuvvet Dağılımı</h3></div>
                    <div class="hangar-widget-body">${renderForceDistribution()}</div>
                </div>
                <div class="hangar-widget">
                    <div class="hangar-widget-header">
                        <h3><i class="fa-solid fa-industry"></i> Aktif Üretim</h3>
                        <span class="hangar-badge">${productionQueue.length}/${MAX_PRODUCTION_SLOTS}</span>
                    </div>
                    <div class="hangar-widget-body">${renderProductionQueueMini()}</div>
                </div>
            </div>
        </div>
    `;
}

function renderForceDistribution() {
    const forces = [
        { name: 'Kara', icon: 'fa-person-rifle', count: unitDatabase.land.reduce((s, u) => s + (inventory.military[u.id] || 0), 0), color: '#22c55e' },
        { name: 'Hava', icon: 'fa-jet-fighter', count: unitDatabase.air.reduce((s, u) => s + (inventory.military[u.id] || 0), 0), color: '#3b82f6' },
        { name: 'Deniz', icon: 'fa-anchor', count: unitDatabase.sea.reduce((s, u) => s + (inventory.military[u.id] || 0), 0), color: '#06b6d4' },
    ];
    const total = forces.reduce((s, f) => s + f.count, 0) || 1;
    return forces.map(f => {
        const pct = ((f.count / total) * 100).toFixed(1);
        return `<div class="force-row">
            <div class="force-label"><i class="fa-solid ${f.icon}" style="color:${f.color}"></i><span>${f.name}</span></div>
            <div class="force-bar-track"><div class="force-bar-fill" style="width:${pct}%;background:${f.color};"></div></div>
            <div class="force-count">${f.count.toLocaleString()} <span class="force-pct">(${pct}%)</span></div>
        </div>`;
    }).join('');
}

function renderProductionQueueMini() {
    if (productionQueue.length === 0) return '<div class="hangar-empty">Aktif üretim bulunmuyor.</div>';
    return productionQueue.map(item => `
        <div class="prod-item-mini">
            <div class="prod-icon ${item.type}"><i class="fa-solid ${item.icon}"></i></div>
            <div class="prod-info">
                <div class="prod-name">${item.name}</div>
                <div class="prod-progress-track"><div class="prod-progress-fill" style="width:${item.progress}%"></div></div>
            </div>
            <div class="prod-meta">
                <div class="prod-pct">${item.progress}%</div>
                <div class="prod-time"><i class="fa-regular fa-clock"></i> ${item.timeLeft}</div>
            </div>
        </div>
    `).join('');
}

// ===================================================================
// 2. ASKERİ BİRİMLER
// ===================================================================
function renderMilitaryTab() {
    return `<div class="hangar-military">
        <div class="mil-sub-tabs">
            <button class="mil-sub-tab active" data-force="land"><i class="fa-solid fa-person-rifle"></i> Kara</button>
            <button class="mil-sub-tab" data-force="air"><i class="fa-solid fa-jet-fighter"></i> Hava</button>
            <button class="mil-sub-tab" data-force="sea"><i class="fa-solid fa-anchor"></i> Deniz</button>
        </div>
        <div class="mil-units-grid" id="mil-units-grid">${renderUnitCards('land')}</div>
    </div>`;
}

function initMilitarySubTabs() {
    document.querySelectorAll('.mil-sub-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.mil-sub-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const grid = document.getElementById('mil-units-grid');
            if (grid) { grid.innerHTML = renderUnitCards(tab.dataset.force); attachUnitCardEvents(); }
        });
    });
    attachUnitCardEvents();
}

function renderUnitCards(forceType) {
    const units = unitDatabase[forceType] || [];
    const playerLvl = getPlayerLevel();
    return units.map(u => {
        const count = inventory.military[u.id] || 0;
        const locked = playerLvl < u.requiredLevel;
        return `
        <div class="unit-card ${locked ? 'locked' : ''}" data-unit-id="${u.id}" data-force="${forceType}">
            <div class="unit-card-top">
                <div class="unit-icon-large"><i class="fa-solid ${u.icon}"></i></div>
                <div class="unit-tier">T${u.tier}</div>
            </div>
            <div class="unit-card-body">
                <div class="unit-name">${u.name} ${locked ? '<i class="fa-solid fa-lock" style="font-size:0.6rem;color:var(--text-dim);"></i>' : ''}</div>
                <div class="unit-count">${count > 0 ? count.toLocaleString() + ' adet' : locked ? 'Lv.' + u.requiredLevel + ' gerekli' : 'Envanterinizde yok'}</div>
                <div class="unit-stats-grid">
                    <div class="unit-stat"><i class="fa-solid fa-crosshairs"></i><span class="us-val attack">${u.attack}</span></div>
                    <div class="unit-stat"><i class="fa-solid fa-shield-halved"></i><span class="us-val defense">${u.defense}</span></div>
                    <div class="unit-stat"><i class="fa-solid fa-gauge-high"></i><span class="us-val speed">${u.speed}</span></div>
                    <div class="unit-stat"><i class="fa-solid fa-coins"></i><span class="us-val upkeep">${u.upkeep}</span></div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function attachUnitCardEvents() {
    document.querySelectorAll('.unit-card[data-unit-id]').forEach(card => {
        card.addEventListener('click', () => {
            const force = card.dataset.force;
            const unitId = card.dataset.unitId;
            const unit = unitDatabase[force]?.find(u => u.id === unitId);
            if (unit) showInfoPopup(unit);
        });
    });
}

// ===================================================================
// 3. SİVİL ARAÇLAR
// ===================================================================
function renderCivilTab() {
    const totalIncome = inventory.civil.reduce((s, cv) => {
        if (cv.status === 'Aktif') {
            const def = civilDatabase.find(d => d.id === cv.id);
            return s + (def ? def.income * cv.count : 0);
        }
        return s;
    }, 0);
    return `<div class="hangar-civil">
        <div class="civil-summary">
            <div class="civil-summary-stat"><i class="fa-solid fa-ship"></i><span>Toplam Filo: <strong>${inventory.civil.reduce((s, v) => s + v.count, 0)} araç</strong></span></div>
            <div class="civil-summary-stat"><i class="fa-solid fa-coins"></i><span>Günlük Gelir: <strong class="text-green">+${totalIncome.toLocaleString()} ₳</strong></span></div>
        </div>
        <div class="civil-list">
            ${inventory.civil.map(v => {
                const def = civilDatabase.find(d => d.id === v.id);
                if (!def) return '';
                const income = v.status === 'Aktif' ? def.income * v.count : 0;
                return `<div class="civil-item">
                    <div class="civil-item-icon"><i class="fa-solid ${def.icon}"></i></div>
                    <div class="civil-item-info"><div class="civil-item-name">${def.name}</div><div class="civil-item-cap">${def.capacity}</div></div>
                    <div class="civil-item-count">x${v.count}</div>
                    <div class="civil-item-status ${v.status === 'Aktif' ? 'active' : 'maintenance'}">${v.status}</div>
                    <div class="civil-item-income ${income > 0 ? 'earning' : 'idle'}">${income > 0 ? '+' + income.toLocaleString() + ' ₳/gün' : 'Gelir yok'}</div>
                </div>`;
            }).join('')}
        </div>
    </div>`;
}

// ===================================================================
// 4. ÜRETİM
// ===================================================================
function renderProductionTab() {
    return `<div class="hangar-production">
        <div class="prod-header-info">
            <span>Üretim Slotları</span>
            <span class="prod-slots">${productionQueue.length} / ${MAX_PRODUCTION_SLOTS} kullanılıyor</span>
        </div>
        <div class="prod-queue-list">
            ${productionQueue.length > 0 ? productionQueue.map((item, i) => `
                <div class="prod-queue-item">
                    <div class="pqi-rank">#${i + 1}</div>
                    <div class="pqi-icon ${item.type}"><i class="fa-solid ${item.icon}"></i></div>
                    <div class="pqi-info">
                        <div class="pqi-name">${item.name}</div>
                        <div class="pqi-progress-track"><div class="pqi-progress-fill" style="width:${item.progress}%"></div></div>
                        <div class="pqi-details">
                            <span>${item.progress}% tamamlandı</span>
                            <span><i class="fa-regular fa-clock"></i> ${item.timeLeft}</span>
                            <span><i class="fa-solid fa-coins"></i> ${item.cost.toLocaleString()} ₳</span>
                        </div>
                    </div>
                    <button class="pqi-cancel" title="İptal Et" data-prod-id="${item.id}"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `).join('') : '<div class="hangar-empty"><i class="fa-solid fa-inbox"></i><p>Aktif üretim bulunmuyor</p></div>'}
        </div>
        ${productionQueue.length < MAX_PRODUCTION_SLOTS ? `<div class="prod-empty-slot"><i class="fa-solid fa-plus"></i><span>Boş Slot — Yeni üretim başlat</span></div>` : ''}
    </div>`;
}

// ===================================================================
// 5. SATIN AL
// ===================================================================
function renderShopTab() {
    return `<div class="hangar-shop">
        <div class="shop-sub-tabs">
            <button class="shop-sub-tab active" data-shop="military"><i class="fa-solid fa-shield-halved"></i> Askeri</button>
            <button class="shop-sub-tab" data-shop="civil"><i class="fa-solid fa-plane-departure"></i> Sivil</button>
        </div>
        <div class="shop-grid" id="shop-grid">${renderShopItems('military')}</div>
    </div>`;
}

function initShopEvents() {
    // Sub-tab switching
    document.querySelectorAll('.shop-sub-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.shop-sub-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const grid = document.getElementById('shop-grid');
            if (grid) { grid.innerHTML = renderShopItems(tab.dataset.shop); attachShopItemEvents(tab.dataset.shop); }
        });
    });
    attachShopItemEvents('military');
}

function renderShopItems(type) {
    const playerLvl = getPlayerLevel();
    if (type === 'military') {
        const allUnits = [...unitDatabase.land, ...unitDatabase.air, ...unitDatabase.sea];
        return allUnits.map(unit => {
            const locked = playerLvl < unit.requiredLevel;
            return `
            <div class="shop-item ${locked ? 'locked' : ''}" data-shop-type="military" data-unit-id="${unit.id}" data-force="${unitDatabase.land.includes(unit) ? 'land' : unitDatabase.air.includes(unit) ? 'air' : 'sea'}">
                <div class="shop-item-icon ${locked ? 'locked' : ''}"><i class="fa-solid ${unit.icon}"></i></div>
                <div class="shop-item-name">${unit.name}</div>
                <div class="shop-item-batch">x${unit.batchSize.toLocaleString()}</div>
                ${locked ? `<div class="shop-item-lock"><i class="fa-solid fa-lock"></i> Lv.${unit.requiredLevel}</div>` : ''}
                <button class="shop-buy-btn ${locked ? 'disabled' : ''}" ${locked ? 'disabled' : ''}>
                    <i class="fa-solid fa-coins"></i> ${unit.cost.toLocaleString()} ₳
                </button>
            </div>`;
        }).join('');
    } else {
        return civilDatabase.map(v => {
            const locked = playerLvl < v.requiredLevel;
            return `
            <div class="shop-item civil ${locked ? 'locked' : ''}" data-shop-type="civil" data-civil-id="${v.id}">
                <div class="shop-item-icon civil ${locked ? 'locked' : ''}"><i class="fa-solid ${v.icon}"></i></div>
                <div class="shop-item-name">${v.name}</div>
                <div class="shop-item-batch"><i class="fa-regular fa-clock"></i> ${v.buildTime}</div>
                <div class="shop-item-income">+${v.income.toLocaleString()} ₳/gün</div>
                ${locked ? `<div class="shop-item-lock"><i class="fa-solid fa-lock"></i> Lv.${v.requiredLevel}</div>` : ''}
                <button class="shop-buy-btn civil ${locked ? 'disabled' : ''}" ${locked ? 'disabled' : ''}>
                    <i class="fa-solid fa-coins"></i> ${v.cost.toLocaleString()} ₳
                </button>
            </div>`;
        }).join('');
    }
}

function attachShopItemEvents(type) {
    document.querySelectorAll('.shop-item').forEach(item => {
        // Info popup on card click (not on buy button)
        item.addEventListener('click', (e) => {
            if (e.target.closest('.shop-buy-btn')) return; // buy button has its own handler
            if (type === 'military' || item.dataset.shopType === 'military') {
                const force = item.dataset.force;
                const unitId = item.dataset.unitId;
                const unit = unitDatabase[force]?.find(u => u.id === unitId);
                if (unit) showInfoPopup(unit);
            } else {
                const civilId = item.dataset.civilId;
                const vehicle = civilDatabase.find(v => v.id === civilId);
                if (vehicle) showCivilInfoPopup(vehicle);
            }
        });

        // Direct buy on button click
        const buyBtn = item.querySelector('.shop-buy-btn:not(.disabled)');
        if (buyBtn) {
            buyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (type === 'military' || item.dataset.shopType === 'military') {
                    const force = item.dataset.force;
                    const unitId = item.dataset.unitId;
                    const unit = unitDatabase[force]?.find(u => u.id === unitId);
                    if (unit) purchaseMilitary(unit);
                } else {
                    const civilId = item.dataset.civilId;
                    const vehicle = civilDatabase.find(v => v.id === civilId);
                    if (vehicle) purchaseCivil(vehicle);
                }
            });
        }
    });
}
