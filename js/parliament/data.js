// MECLİS VERİ KATMANI

// Meclis Dağılımı (Mevcut)
export const parliamentSeats = [
    { party: "Milli İrade Partisi", count: 290, color: "#94a3b8", short: "MİP", change: "+12" },
    { party: "Özgür Yarınlar", count: 150, color: "#3b82f6", short: "ÖYH", change: "-5" },
    { party: "Kızıl Tugaylar", count: 100, color: "#ef4444", short: "KT", change: "+8" },
    { party: "Yeşiller", count: 40, color: "#10b981", short: "YEŞİL", change: "-2" },
    { party: "Bağımsızlar", count: 20, color: "#cbd5e1", short: "BĞMSZ", change: "0" }
];

// Meclis Dışı Partiler (YENİ)
export const outsideParties = [
    { party: "Liberal Demokratlar", rate: "%2.1", color: "#f59e0b" },
    { party: "Gelecek Bilim", rate: "%1.4", color: "#a855f7" },
    { party: "Turan Birliği", rate: "%0.9", color: "#06b6d4" }
];

// Aktif Yasa Tasarıları
export const activeBills = [
    {
        id: 101, title: "Savunma Bütçesi Artırımı", proposer: "Milli İrade Partisi",
        desc: "Kuzey sınırındaki tehditlere karşı askeri harcamaların %15 artırılması.",
        votes: { yes: 280, no: 140, abstain: 10 }, deadline: "2 saat kaldı"
    },
    {
        id: 102, title: "Karbon Vergisi Düzenlemesi", proposer: "Yeşiller",
        desc: "Sanayi tesislerine ek çevre vergisi getirilmesi.",
        votes: { yes: 45, no: 300, abstain: 50 }, deadline: "5 saat kaldı"
    }
];

// Seçim Anketleri
export const electionPolls = [
    { party: "Milli İrade Partisi", rate: 42.5, change: "+1.2" },
    { party: "Özgür Yarınlar", rate: 28.3, change: "-0.5" },
    { party: "Kızıl Tugaylar", rate: 15.1, change: "+0.1" },
    { party: "Diğer", rate: 14.1, change: "0.0" }
];

// Anayasa
export const constitutionArticles = [
    "Madde 1: Devletin yönetim şekli Cumhuriyettir.",
    "Madde 2: Resmi dil Türkçedir.",
    "Madde 3: Egemenlik kayıtsız şartsız milletindir."
];