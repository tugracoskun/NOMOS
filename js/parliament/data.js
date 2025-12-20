// MECLİS VERİ KATMANI

// Meclis Dağılımı (Toplam 600 Koltuk)
export const parliamentSeats = [
    { party: "Milli İrade Partisi", count: 290, color: "#94a3b8", short: "MİP" },
    { party: "Özgür Yarınlar", count: 150, color: "#3b82f6", short: "ÖYH" },
    { party: "Kızıl Tugaylar", count: 100, color: "#ef4444", short: "KT" },
    { party: "Yeşiller", count: 40, color: "#10b981", short: "YEŞİL" },
    { party: "Bağımsızlar", count: 20, color: "#cbd5e1", short: "BĞMSZ" }
];

// Aktif Yasa Tasarıları
export const activeBills = [
    {
        id: 101,
        title: "Savunma Bütçesi Artırımı",
        proposer: "Milli İrade Partisi",
        desc: "Kuzey sınırındaki tehditlere karşı askeri harcamaların %15 artırılması.",
        votes: { yes: 280, no: 140, abstain: 10 },
        deadline: "2 saat kaldı"
    },
    {
        id: 102,
        title: "Karbon Vergisi Düzenlemesi",
        proposer: "Yeşiller",
        desc: "Sanayi tesislerine ek çevre vergisi getirilmesi.",
        votes: { yes: 45, no: 300, abstain: 50 },
        deadline: "5 saat kaldı"
    }
];

// Seçim Anketleri
export const electionPolls = [
    { party: "Milli İrade Partisi", rate: 42.5, change: "+1.2" },
    { party: "Özgür Yarınlar", rate: 28.3, change: "-0.5" },
    { party: "Kızıl Tugaylar", rate: 15.1, change: "+0.1" },
    { party: "Diğer", rate: 14.1, change: "0.0" }
];

// Anayasa Maddeleri (Örnek)
export const constitutionArticles = [
    "Madde 1: Devletin yönetim şekli Cumhuriyettir.",
    "Madde 2: Resmi dil Türkçedir.",
    "Madde 3: Egemenlik kayıtsız şartsız milletindir."
];