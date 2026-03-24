// MESAJLAR - VERİ KATMANI
// Mock mesaj verileri ve yardımcı fonksiyonlar

export const messageCategories = [
    { id: 'all', label: 'Tümü', icon: 'fa-inbox', count: 0 },
    { id: 'diplomacy', label: 'Diplomasi', icon: 'fa-handshake', count: 0 },
    { id: 'trade', label: 'Ticaret', icon: 'fa-coins', count: 0 },
    { id: 'military', label: 'Askeri', icon: 'fa-shield-halved', count: 0 },
    { id: 'system', label: 'Sistem', icon: 'fa-gear', count: 0 },
    { id: 'social', label: 'Sosyal', icon: 'fa-users', count: 0 },
];

// Mesaj öncelik seviyeleri
export const priorities = {
    urgent: { label: 'Acil', color: '#ef4444', icon: 'fa-circle-exclamation' },
    high: { label: 'Yüksek', color: '#f59e0b', icon: 'fa-arrow-up' },
    normal: { label: 'Normal', color: '#3b82f6', icon: 'fa-minus' },
    low: { label: 'Düşük', color: '#6b7280', icon: 'fa-arrow-down' },
};

// Mock mesajlar
export const mockMessages = [
    {
        id: 'm001',
        category: 'diplomacy',
        from: { name: 'Fransa Dışişleri', flag: 'fr', title: 'Büyükelçi' },
        subject: 'İkili Ticaret Anlaşması Teklifi',
        preview: 'Sayın lider, Fransa Cumhuriyeti adına ikili ticaret anlaşması için resmi teklifimizi iletmek isteriz...',
        body: `Sayın Lider,

Fransa Cumhuriyeti Dışişleri Bakanlığı adına, ülkelerimiz arasındaki ticari ilişkileri güçlendirmek amacıyla yeni bir ikili ticaret anlaşması önerisinde bulunmak isteriz.

Anlaşma kapsamı:
• Gümrük vergilerinde %15 karşılıklı indirim
• Teknoloji transferi kolaylığı
• Enerji sektöründe iş birliği

Yanıtınızı bekliyoruz.

Saygılarımızla,
Fransa Dışişleri Bakanlığı`,
        date: '2 saat önce',
        timestamp: Date.now() - 7200000,
        read: false,
        starred: true,
        priority: 'high',
        attachments: [
            { name: 'Anlasma_Taslagi.pdf', size: '2.4 MB' }
        ],
        actions: ['accept', 'reject', 'negotiate']
    },
    {
        id: 'm002',
        category: 'trade',
        from: { name: 'Borsa Komisyonu', flag: null, title: 'Sistem' },
        subject: 'Petrol Fiyat Uyarısı',
        preview: '⚠️ Brent petrol fiyatı son 24 saatte %5.2 düşüş gösterdi. Portföyünüz etkilenmiş olabilir.',
        body: `⚠️ PİYASA UYARISI

Brent petrolde son 24 saatte %5.2 düşüş kaydedildi.

Mevcut Fiyat: $68.40/varil
Değişim: -$3.80 (-5.2%)
24s Hacim: 142M varil

Portföy Etkisi:
Elinizde 50,000 varil bulunmaktadır.
Tahmini Zarar: -190,000 Altın

Önerilen İşlem: Pozisyonu gözden geçirin.`,
        date: '4 saat önce',
        timestamp: Date.now() - 14400000,
        read: false,
        starred: false,
        priority: 'urgent',
        attachments: [],
        actions: ['view-market']
    },
    {
        id: 'm003',
        category: 'military',
        from: { name: 'Genelkurmay', flag: 'tr', title: 'Komutan' },
        subject: 'Sınır Güvenliği Raporu',
        preview: 'Haftalık sınır güvenliği değerlendirme raporu hazırlanmıştır. Doğu sınırında hareketlilik...',
        body: `HAFTALIK SINIR GÜVENLİĞİ DEĞERLENDİRME RAPORU

Rapor Dönemi: Bu Hafta
Tehdit Seviyesi: ORTA

Özet:
• Doğu sınırında olağandışı hareketlilik tespit edildi
• Kuzey bölgesinde 2 adet İHA uçuşu gerçekleştirildi
• Deniz Kuvvetleri rutin devriye görevinde

Tavsiye: Mevcut güvenlik seviyesinin korunması.`,
        date: '6 saat önce',
        timestamp: Date.now() - 21600000,
        read: true,
        starred: false,
        priority: 'normal',
        attachments: [
            { name: 'Sinir_Raporu.pdf', size: '1.1 MB' },
            { name: 'Harita_Eki.png', size: '340 KB' }
        ],
        actions: ['acknowledge']
    },
    {
        id: 'm004',
        category: 'system',
        from: { name: 'NOMOS Sistem', flag: null, title: 'Otomasyon' },
        subject: 'Günlük Gelir Raporu',
        preview: 'Bugünkü toplam geliriniz: 12,450 Altın. Detaylı dağılım ektedir.',
        body: `GÜNLÜK GELİR RAPORU

Toplam Gelir: 12,450 Altın

Dağılım:
├─ Vergi Gelirleri: 8,200 Altın
├─ Ticaret Kârı: 3,100 Altın
├─ Kaynak Satışı: 950 Altın
└─ Diğer: 200 Altın

Bir önceki güne göre: +%4.2 artış`,
        date: '8 saat önce',
        timestamp: Date.now() - 28800000,
        read: true,
        starred: false,
        priority: 'low',
        attachments: [],
        actions: []
    },
    {
        id: 'm005',
        category: 'diplomacy',
        from: { name: 'Almanya Başbakanı', flag: 'de', title: 'Şansölye' },
        subject: 'NATO Zirvesi Daveti',
        preview: 'Önümüzdeki hafta Berlin\'de gerçekleşecek NATO Olağanüstü Zirvesi\'ne katılımınızı...',
        body: `Sayın Lider,

Berlin'de düzenlenecek NATO Olağanüstü Zirvesi'ne katılım davetimizi iletmek isteriz.

Tarih: Gelecek Hafta Salı
Yer: Berlin Kongre Merkezi
Gündem: Doğu Avrupa güvenlik durumu

Katılım onayınızı 48 saat içinde bekliyoruz.

Saygılarımızla,
O. Scholz`,
        date: '1 gün önce',
        timestamp: Date.now() - 86400000,
        read: false,
        starred: true,
        priority: 'high',
        attachments: [
            { name: 'Zirve_Gundemi.pdf', size: '890 KB' }
        ],
        actions: ['accept', 'reject']
    },
    {
        id: 'm006',
        category: 'social',
        from: { name: 'HakanTR42', flag: 'tr', title: 'Oyuncu' },
        subject: 'İttifak Teklifi',
        preview: 'Selam! Bizim ittifaka katılmak ister misin? 15 aktif üyeyiz, her gün savaşıyoruz...',
        body: `Selam!

Bizim ittifaka katılmak ister misin? "Osmanlı Kartalları" ittifakı olarak 15 aktif üyeyle dünya sıralamasında 23. sıradayız.

Avantajlar:
• Günlük ticaret bonusu
• Ortak savunma
• Aktif Discord sunucusu

İlgilenirsen yaz!`,
        date: '1 gün önce',
        timestamp: Date.now() - 90000000,
        read: true,
        starred: false,
        priority: 'normal',
        attachments: [],
        actions: ['reply']
    },
    {
        id: 'm007',
        category: 'trade',
        from: { name: 'Rusya Ticaret Odası', flag: 'ru', title: 'Ticaret Temsilcisi' },
        subject: 'Doğalgaz Teklifi - 500,000 Birim',
        preview: 'Rusya Federasyonu olarak 500,000 birim doğalgaz satışı için aşağıdaki koşulları öneriyoruz...',
        body: `DOĞALGAZ SATIŞ TEKLİFİ

Miktar: 500,000 birim
Birim Fiyat: 42 Altın
Toplam: 21,000,000 Altın

Teslimat: 3 tur içinde
Ödeme: %50 peşin, %50 teslimat sonrası

Geçerlilik: 48 saat`,
        date: '2 gün önce',
        timestamp: Date.now() - 172800000,
        read: true,
        starred: false,
        priority: 'normal',
        attachments: [],
        actions: ['accept', 'reject', 'negotiate']
    }
];

// Yardımcı fonksiyonlar
export function getMessagesByCategory(category) {
    if (category === 'all') return mockMessages;
    return mockMessages.filter(m => m.category === category);
}

export function getUnreadCount(category) {
    const msgs = category === 'all' ? mockMessages : mockMessages.filter(m => m.category === category);
    return msgs.filter(m => !m.read).length;
}

export function getCategoriesWithCounts() {
    return messageCategories.map(cat => ({
        ...cat,
        count: getUnreadCount(cat.id)
    }));
}
