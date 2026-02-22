// PARTİLER: VERİ KATMANI (Genişletilmiş)

export const availableIdeologies = [
    "Agraryanizm", "Anarşizm", "Anarko-Kapitalizm", "Anarko-Komünizm", "Bölgeselcilik",
    "Çevrecilik (Yeşil Siyaset)", "Demokratik Sosyalizm", "Devletçilik", "Eko-Faşizm",
    "Faşizm", "Feminizm", "Gelenekselcilik", "Hristiyan Demokrasi", "İslamcılık",
    "İslami Demokrasi", "Kemalizm", "Komünizm", "Korporatizm", "Liberalizm",
    "Liberteryanizm", "Marksizm-Leninizm", "Merkezcilik", "Militarizm", "Milliyetçilik",
    "Monarşizm", "Muhafazakarlık", "Mutlakiyet", "Nasyonal Sosyalizm", "Neo-Liberalizm",
    "Otoriteryanizm", "Pan-Türkizm (Turanizm)", "Parlamentarizm", "Pasifizm",
    "Piratizm (Korsan Parti)", "Popülizm", "Progresivizm", "Sosyal Demokrasi",
    "Sosyalizm", "Teknokratizm", "Teokrasi", "Totalitarizm", "Transhümanizm",
    "Troçkizm", "Ulusalcılık"
];

export const playerProfile = {
    name: "Başkan [TR]",
    ideology: "Liberalizm"
};

// Prestij Seviyeleri
export const prestigeLevels = [
    { min: 0, max: 499, name: "Yerel Hareket", icon: "fa-seedling", color: "#64748b" },
    { min: 500, max: 1499, name: "Yükselen Güç", icon: "fa-arrow-trend-up", color: "#3b82f6" },
    { min: 1500, max: 3499, name: "Ulusal Parti", icon: "fa-landmark", color: "#a855f7" },
    { min: 3500, max: 6999, name: "Büyük Parti", icon: "fa-crown", color: "#eab308" },
    { min: 7000, max: Infinity, name: "Süper Güç", icon: "fa-star", color: "#ef4444" }
];

export function getPrestigeLevel(prestige) {
    return prestigeLevels.find(l => prestige >= l.min && prestige <= l.max) || prestigeLevels[0];
}

// Mock Veritabanı (Genişletilmiş)
export let partiesData = [
    {
        id: 1, name: "Milli İrade Partisi", shortName: "MİP", leader: "Kürşat Bey",
        founded: "2024-11-12", members: 1420, ideology: "Milliyetçilik", color: "#94a3b8",
        logo: null, icon: "fa-wolf-pack-battalion", slogan: "Her şey vatan için!",
        description: "Milletin iradesini ve devletin bekasını savunan köklü bir siyasi hareket. Güçlü ordu, güçlü millet prensibiyle hareket eder. İç ve dış politikada bağımsızlığı savunur.",
        policies: ["Sınır güvenliği", "Savunma sanayii", "Milli eğitim", "Tarım desteği"],
        wage: "500 G", country: "Türkiye", city: "Ankara", countryCode: "tr",
        // Prestij Sistemi
        prestige: 4200,
        prestigeHistory: [
            { date: "2025-01", event: "Seçim Zaferi", points: 500 },
            { date: "2025-02", event: "Yasa Teklifi Kabul", points: 200 },
            { date: "2025-03", event: "Meclis Oturumu Liderliği", points: 150 },
            { date: "2025-04", event: "Halk Mitingi", points: 300 },
        ],
        // Koalisyon
        coalitionId: "ittifak-1",
        coalitionPartners: [2],
        // Finans
        finance: {
            treasury: 125000,
            monthlyIncome: 18500,
            monthlyExpense: 12000,
            donations: [
                { donor: "Ahmet K.", amount: 5000, date: "2025-04-10" },
                { donor: "Fatma Y.", amount: 2500, date: "2025-04-08" },
                { donor: "Mehmet D.", amount: 10000, date: "2025-03-25" },
            ],
            memberDues: 50,
            expenses: [
                { category: "Personel", amount: 5000 },
                { category: "Propaganda", amount: 3500 },
                { category: "Lojistik", amount: 2000 },
                { category: "Etkinlik", amount: 1500 },
            ]
        },
        // İstatistikler
        stats: {
            activeMembers: 980,
            weeklyGrowth: 3.2,
            totalVotes: 45200,
            seatsInParliament: 12,
            lawsProposed: 8,
            lawsPassed: 3,
            electionHistory: [
                { year: "2024-Q4", votes: 38000, percentage: 28.5, seats: 10, rank: 2 },
                { year: "2025-Q1", votes: 42000, percentage: 31.2, seats: 11, rank: 1 },
                { year: "2025-Q2", votes: 45200, percentage: 33.8, seats: 12, rank: 1 },
            ],
            activityLog: [
                { date: "2025-04-12", action: "Meclis oylama katılımı", type: "parliament" },
                { date: "2025-04-10", action: "Parti mitingi düzenlendi", type: "event" },
                { date: "2025-04-08", action: "Yeni üye kampanyası", type: "recruitment" },
                { date: "2025-04-05", action: "Bağış kampanyası başlatıldı", type: "finance" },
            ]
        }
    },
    {
        id: 2, name: "Özgür Yarınlar", shortName: "ÖYH", leader: "Ece Y.",
        founded: "2025-01-05", members: 850, ideology: "Liberalizm", color: "#3b82f6",
        logo: null, icon: "fa-dove", slogan: "Özgür birey, güçlü toplum.",
        description: "Bireysel özgürlükleri, serbest piyasa ekonomisini ve demokratik değerleri savunan liberal bir siyasi hareket. Her bireyin kendi kaderini tayin etme hakkını destekler.",
        policies: ["Düşük vergi", "Serbest ticaret", "Dijital haklar", "Girişimcilik"],
        wage: "250 G", country: "Türkiye", city: "İzmir", countryCode: "tr",
        prestige: 1800,
        prestigeHistory: [
            { date: "2025-01", event: "Parti Kuruluş Töreninde", points: 100 },
            { date: "2025-02", event: "İlk Seçim Katılımı", points: 300 },
            { date: "2025-03", event: "Yasa Teklifi", points: 150 },
        ],
        coalitionId: "ittifak-1",
        coalitionPartners: [1],
        finance: {
            treasury: 42000,
            monthlyIncome: 8200,
            monthlyExpense: 6500,
            donations: [
                { donor: "Startup Fonu", amount: 15000, date: "2025-04-01" },
                { donor: "Ali R.", amount: 3000, date: "2025-03-20" },
            ],
            memberDues: 30,
            expenses: [
                { category: "Personel", amount: 2500 },
                { category: "Propaganda", amount: 2000 },
                { category: "Dijital Kampanya", amount: 1500 },
                { category: "Etkinlik", amount: 500 },
            ]
        },
        stats: {
            activeMembers: 620,
            weeklyGrowth: 5.1,
            totalVotes: 18500,
            seatsInParliament: 5,
            lawsProposed: 4,
            lawsPassed: 1,
            electionHistory: [
                { year: "2025-Q1", votes: 15000, percentage: 11.1, seats: 4, rank: 4 },
                { year: "2025-Q2", votes: 18500, percentage: 13.8, seats: 5, rank: 3 },
            ],
            activityLog: [
                { date: "2025-04-11", action: "Dijital kampanya başlatıldı", type: "event" },
                { date: "2025-04-09", action: "Yeni üye kaydı", type: "recruitment" },
                { date: "2025-04-07", action: "Meclis görüşmesi", type: "parliament" },
            ]
        }
    },
    {
        id: 3, name: "Kızıl Tugaylar", shortName: "KT", leader: "Dimitri V.",
        founded: "2023-05-01", members: 3200, ideology: "Komünizm", color: "#ef4444",
        logo: null, icon: "fa-hammer", slogan: "İşçiler birleşin!",
        description: "Emekçilerin hakları için mücadele eden devrimci bir hareket. Kamulaştırma, eşit gelir dağılımı ve işçi sendikaları üzerinden toplumsal dönüşümü hedefler.",
        policies: ["Kamulaştırma", "İşçi hakları", "Eşit gelir", "Ücretsiz sağlık"],
        wage: "100 G", country: "Rusya", city: "Moskova", countryCode: "ru",
        prestige: 6500,
        prestigeHistory: [
            { date: "2024-06", event: "Büyük Grev Organizasyonu", points: 500 },
            { date: "2024-09", event: "Seçim Başarısı", points: 800 },
            { date: "2025-01", event: "Uluslararası Dayanışma", points: 400 },
            { date: "2025-03", event: "Sendika İttifakı", points: 350 },
        ],
        coalitionId: null,
        coalitionPartners: [],
        finance: {
            treasury: 210000,
            monthlyIncome: 32000,
            monthlyExpense: 25000,
            donations: [
                { donor: "İşçi Sendikası", amount: 20000, date: "2025-04-01" },
                { donor: "Yoldaş Kampanyası", amount: 8000, date: "2025-03-15" },
                { donor: "Halk Bağışları", amount: 5000, date: "2025-03-10" },
            ],
            memberDues: 25,
            expenses: [
                { category: "Personel", amount: 8000 },
                { category: "Propaganda", amount: 7000 },
                { category: "Lojistik", amount: 5000 },
                { category: "Etkinlik", amount: 3000 },
                { category: "Yardım Fonu", amount: 2000 },
            ]
        },
        stats: {
            activeMembers: 2800,
            weeklyGrowth: 1.8,
            totalVotes: 62000,
            seatsInParliament: 18,
            lawsProposed: 15,
            lawsPassed: 6,
            electionHistory: [
                { year: "2024-Q2", votes: 48000, percentage: 22.1, seats: 14, rank: 2 },
                { year: "2024-Q4", votes: 55000, percentage: 25.8, seats: 16, rank: 2 },
                { year: "2025-Q1", votes: 58000, percentage: 27.4, seats: 17, rank: 1 },
                { year: "2025-Q2", votes: 62000, percentage: 29.1, seats: 18, rank: 1 },
            ],
            activityLog: [
                { date: "2025-04-12", action: "Grev desteği verildi", type: "event" },
                { date: "2025-04-10", action: "Meclis oylama katılımı", type: "parliament" },
                { date: "2025-04-08", action: "İşçi forumu düzenlendi", type: "event" },
                { date: "2025-04-05", action: "Sendika toplantısı", type: "recruitment" },
                { date: "2025-04-02", action: "Bağış toplama etkinliği", type: "finance" },
            ]
        }
    },
    {
        id: 4, name: "Yeşil Gelecek Partisi", shortName: "YGP", leader: "Ayşe Nur T.",
        founded: "2024-03-22", members: 560, ideology: "Çevrecilik (Yeşil Siyaset)", color: "#10b981",
        logo: null, icon: "fa-leaf", slogan: "Doğa için, gelecek için.",
        description: "Sürdürülebilir kalkınmayı, yenilenebilir enerjiyi ve ekolojik dengeyi savunan çevreci bir parti. İklim değişikliğiyle mücadeleyi öncelik olarak görür.",
        policies: ["Yenilenebilir enerji", "Karbon vergisi", "Doğa koruma", "Organik tarım"],
        wage: "150 G", country: "Türkiye", city: "Antalya", countryCode: "tr",
        prestige: 920,
        prestigeHistory: [
            { date: "2024-04", event: "Parti Kuruluşu", points: 50 },
            { date: "2024-08", event: "Çevre Kampanyası", points: 200 },
            { date: "2025-01", event: "Ağaçlandırma Projesi", points: 300 },
        ],
        coalitionId: null,
        coalitionPartners: [],
        finance: {
            treasury: 18000,
            monthlyIncome: 4200,
            monthlyExpense: 3800,
            donations: [
                { donor: "Çevre Vakfı", amount: 8000, date: "2025-04-05" },
                { donor: "Gönüllü Bağışlar", amount: 2000, date: "2025-03-28" },
            ],
            memberDues: 20,
            expenses: [
                { category: "Personel", amount: 1500 },
                { category: "Kampanya", amount: 1200 },
                { category: "Proje", amount: 800 },
                { category: "Etkinlik", amount: 300 },
            ]
        },
        stats: {
            activeMembers: 420,
            weeklyGrowth: 4.5,
            totalVotes: 8200,
            seatsInParliament: 2,
            lawsProposed: 3,
            lawsPassed: 1,
            electionHistory: [
                { year: "2024-Q4", votes: 6500, percentage: 4.8, seats: 2, rank: 6 },
                { year: "2025-Q1", votes: 7800, percentage: 5.8, seats: 2, rank: 5 },
                { year: "2025-Q2", votes: 8200, percentage: 6.1, seats: 2, rank: 5 },
            ],
            activityLog: [
                { date: "2025-04-11", action: "Sahil temizliği kampanyası", type: "event" },
                { date: "2025-04-07", action: "Meclis konuşması", type: "parliament" },
            ]
        }
    },
    {
        id: 5, name: "Dijital Demokrasi", shortName: "DD", leader: "Can Ö.",
        founded: "2025-02-14", members: 280, ideology: "Teknokratizm", color: "#8b5cf6",
        logo: null, icon: "fa-microchip", slogan: "Veriyle yönet, bilimle karar ver.",
        description: "Teknoloji odaklı yönetişimi, veri tabanlı karar mekanizmalarını ve dijital demokrasiyi savunan modern bir hareket. Yapay zeka destekli politika üretimini destekler.",
        policies: ["e-Demokrasi", "Yapay zeka regülasyonu", "Dijital kimlik", "Açık kaynak devlet"],
        wage: "200 G", country: "Türkiye", city: "İstanbul", countryCode: "tr",
        prestige: 350,
        prestigeHistory: [
            { date: "2025-02", event: "Parti Kuruluşu", points: 50 },
            { date: "2025-03", event: "Hackathon Etkinliği", points: 150 },
            { date: "2025-04", event: "Online Kampanya", points: 100 },
        ],
        coalitionId: null,
        coalitionPartners: [],
        finance: {
            treasury: 12000,
            monthlyIncome: 3500,
            monthlyExpense: 2800,
            donations: [
                { donor: "Tech Sponsoru", amount: 5000, date: "2025-03-01" },
                { donor: "Kripto Bağışlar", amount: 3000, date: "2025-04-02" },
            ],
            memberDues: 35,
            expenses: [
                { category: "Sunucu/Altyapı", amount: 1200 },
                { category: "Geliştirme", amount: 800 },
                { category: "Kampanya", amount: 500 },
                { category: "Etkinlik", amount: 300 },
            ]
        },
        stats: {
            activeMembers: 210,
            weeklyGrowth: 8.3,
            totalVotes: 3500,
            seatsInParliament: 1,
            lawsProposed: 2,
            lawsPassed: 0,
            electionHistory: [
                { year: "2025-Q2", votes: 3500, percentage: 2.6, seats: 1, rank: 7 },
            ],
            activityLog: [
                { date: "2025-04-12", action: "Hackathon düzenlendi", type: "event" },
                { date: "2025-04-09", action: "e-Demokrasi platformu tanıtımı", type: "event" },
            ]
        }
    }
];

// Koalisyon Verileri
export let coalitions = [
    {
        id: "ittifak-1",
        name: "Halk İttifakı",
        color: "#60a5fa",
        partyIds: [1, 2],
        founded: "2025-03-01",
        description: "Milli İrade Partisi ve Özgür Yarınlar Hareketi arasındaki demokratik ittifak.",
        totalMembers: 2270,
        totalSeats: 17,
        sharedPolicies: ["Ekonomik reform", "Demokratik değerler", "Güçlü savunma"]
    }
];

export const invitations = [
    { partyId: 3, message: "Yoldaş, devrimci mücadelemize katılmanı bekliyoruz.", inviter: "Dimitri V." }
];

export function addParty(party) {
    // Yeni partilere varsayılan genişletilmiş verileri ekle
    party.prestige = 0;
    party.prestigeHistory = [];
    party.coalitionId = null;
    party.coalitionPartners = [];
    party.finance = {
        treasury: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        donations: [],
        memberDues: 0,
        expenses: []
    };
    party.stats = {
        activeMembers: 1,
        weeklyGrowth: 0,
        totalVotes: 0,
        seatsInParliament: 0,
        lawsProposed: 0,
        lawsPassed: 0,
        electionHistory: [],
        activityLog: [{ date: new Date().toISOString().split('T')[0], action: "Parti kuruldu", type: "event" }]
    };
    partiesData.push(party);
}

// Koalisyona parti ekleme
export function addToCoalition(coalitionId, partyId) {
    const coalition = coalitions.find(c => c.id === coalitionId);
    const party = partiesData.find(p => p.id === partyId);
    if (coalition && party) {
        coalition.partyIds.push(partyId);
        party.coalitionId = coalitionId;
        // Diğer üyelerin partner listesini güncelle
        coalition.partyIds.forEach(pid => {
            const p = partiesData.find(x => x.id === pid);
            if (p) p.coalitionPartners = coalition.partyIds.filter(id => id !== pid);
        });
    }
}

// Para formatlayıcı
export function formatMoney(amount) {
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
    if (amount >= 1000) return (amount / 1000).toFixed(1) + 'K';
    return amount.toString();
}