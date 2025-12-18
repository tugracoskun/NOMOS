// PARTİLER: VERİ KATMANI

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

// Mock Veritabanı
export let partiesData = [
    {
        id: 1, name: "Milli İrade Partisi", shortName: "MİP", leader: "Kürşat Bey",
        founded: "2024-11-12", members: 1420, ideology: "Milliyetçilik", color: "#94a3b8",
        logo: null, icon: "fa-wolf-pack-battalion", slogan: "Her şey vatan için!",
        description: "Devletin bekasını savunan hareket.", policies: ["Sınır güvenliği"], wage: "500 G",
        country: "Türkiye", city: "Ankara", countryCode: "tr"
    },
    {
        id: 2, name: "Özgür Yarınlar", shortName: "ÖYH", leader: "Ece Y.",
        founded: "2025-01-05", members: 850, ideology: "Liberalizm", color: "#3b82f6",
        logo: null, icon: "fa-dove", slogan: "Özgür birey.",
        description: "Serbest piyasa.", policies: ["Düşük vergi"], wage: "250 G",
        country: "Türkiye", city: "İzmir", countryCode: "tr"
    },
    {
        id: 3, name: "Kızıl Tugaylar", shortName: "KT", leader: "Dimitri V.",
        founded: "2023-05-01", members: 3200, ideology: "Komünizm", color: "#ef4444",
        logo: null, icon: "fa-hammer", slogan: "İşçiler birleşin!",
        description: "Devrimci işçi partisi.", policies: ["Kamulaştırma"], wage: "100 G",
        country: "Rusya", city: "Moskova", countryCode: "ru"
    }
];

export const invitations = [
    { partyId: 3, message: "Yoldaş, devrimci mücadelemize katılmanı bekliyoruz.", inviter: "Dimitri V." }
];

export function addParty(party) {
    partiesData.push(party);
}