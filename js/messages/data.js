// MESAJLAR - VERİ KATMANI
// Mock mesaj verileri ve yardımcı fonksiyonlar

export const messageCategories = [
    { id: 'all', label: 'Tümü', icon: 'fa-inbox', count: 0 },
    { id: 'starred', label: 'Yıldızlı', icon: 'fa-star', count: 0 },
    { id: 'archived', label: 'Arşiv', icon: 'fa-box-archive', count: 0 },
    { id: 'diplomacy', label: 'Diplomasi', icon: 'fa-handshake', count: 0 },
    { id: 'trade', label: 'Ticaret', icon: 'fa-coins', count: 0 },
    { id: 'military', label: 'Askeri', icon: 'fa-shield-halved', count: 0 },
    { id: 'system', label: 'Sistem', icon: 'fa-gear', count: 0 },
    { id: 'social', label: 'Sosyal', icon: 'fa-users', count: 0 },
    { id: 'trash', label: 'Çöp Kutusu', icon: 'fa-trash-can', count: 0 },
];

export const mockMessages = [
    {
        id: 'm001',
        category: 'diplomacy',
        from: { name: 'Fransa Dışişleri', flag: 'fr', title: 'Büyükelçi' },
        subject: 'İkili Ticaret Anlaşması Teklifi',
        preview: 'Sayın lider, Fransa Cumhuriyeti adına ikili ticaret anlaşması için resmi teklifimizi iletmek isteriz...',
        body: `Sayın Lider,\n\nFransa Cumhuriyeti Dışişleri Bakanlığı adına, ülkelerimiz arasındaki ticari ilişkileri güçlendirmek amacıyla yeni bir ikili ticaret anlaşması önerisinde bulunmak isteriz.\n\nAnlaşma kapsamı:\n• Gümrük vergilerinde %15 karşılıklı indirim\n• Teknoloji transferi kolaylığı\n• Enerji sektöründe iş birliği\n\nYanıtınızı bekliyoruz.\n\nSaygılarımızla,\nFransa Dışişleri Bakanlığı`,
        date: '2 saat önce',
        timestamp: Date.now() - 7200000,
        read: false,
        starred: true,
        priority: 'high',
        attachments: [{ name: 'Anlasma_Taslagi.pdf', size: '2.4 MB' }],
        actions: ['accept', 'reject', 'negotiate'],
        archived: false,
        deleted: false
    },
    {
        id: 'm002',
        category: 'trade',
        from: { name: 'Borsa Komisyonu', flag: null, title: 'Sistem' },
        subject: 'Petrol Fiyat Uyarısı',
        preview: '⚠️ Brent petrol fiyatı son 24 saatte %5.2 düşüş gösterdi. Portföyünüz etkilenmiş olabilir.',
        body: `⚠️ PİYASA UYARISI\n\nBrent petrolde son 24 saatte %5.2 düşüş kaydedildi.\n\nMevcut Fiyat: $68.40/varil\nDeğişim: -$3.80 (-5.2%)\n24s Hacim: 142M varil\n\nPortföy Etkisi:\nElinizde 50,000 varil bulunmaktadır.\nTahmini Zarar: -190,000 Altın\n\nÖnerilen İşlem: Pozisyonu gözden geçirin.`,
        date: '4 saat önce',
        timestamp: Date.now() - 14400000,
        read: false,
        starred: false,
        priority: 'urgent',
        attachments: [],
        actions: ['view-market'],
        archived: false,
        deleted: false
    },
    {
        id: 'm003',
        category: 'military',
        from: { name: 'Genelkurmay', flag: 'tr', title: 'Komutan' },
        subject: 'Sınır Güvenliği Raporu',
        preview: 'Haftalık sınır güvenliği değerlendirme raporu hazırlanmıştır. Doğu sınırında hareketlilik...',
        body: `HAFTALIK SINIR GÜVENLİĞİ DEĞERLENDİRME RAPORU\n\nRapor Dönemi: Bu Hafta\nTehdit Seviyesi: ORTA\n\nÖzet:\n• Doğu sınırında olağandışı hareketlilik tespit edildi\n• Kuzey bölgesinde 2 adet İHA uçuşu gerçekleştirildi\n• Deniz Kuvvetleri rutin devriye görevinde\n\nTavsiye: Mevcut güvenlik seviyesinin korunması.`,
        date: '6 saat önce',
        timestamp: Date.now() - 21600000,
        read: true,
        starred: false,
        priority: 'normal',
        attachments: [{ name: 'Sinir_Raporu.pdf', size: '1.1 MB' }],
        actions: ['acknowledge'],
        archived: false,
        deleted: false
    },
    {
        id: 'm004',
        category: 'system',
        from: { name: 'NOMOS Sistem', flag: null, title: 'Otomasyon' },
        subject: 'Günlük Gelir Raporu',
        preview: 'Bugünkü toplam geliriniz: 12,450 Altın. Detaylı dağılım ektedir.',
        body: `GÜNLÜK GELİR RAPORU\n\nToplam Gelir: 12,450 Altın\n\nDağılım:\n├─ Vergi Gelirleri: 8,200 Altın\n├─ Ticaret Kârı: 3,100 Altın\n├─ Kaynak Satışı: 950 Altın\n└─ Diğer: 200 Altın\n\nBir önceki güne göre: +%4.2 artış`,
        date: '8 saat önce',
        timestamp: Date.now() - 28800000,
        read: true,
        starred: false,
        priority: 'low',
        attachments: [],
        actions: [],
        archived: false,
        deleted: false
    },
    {
        id: 'm008',
        category: 'system',
        from: { name: 'Maliye Bakanlığı', flag: 'tr', title: 'Gelir İdaresi' },
        subject: '💡 Dönemlik Gelir Vergisi Tahakkuku',
        preview: 'Sayın mükellef, son 3 turdaki ticari kazancınız üzerinden hesaplanan vergi borcunuz...',
        body: `SAYIN MÜKELLEF,\n\nSon hesap dönemine ait ticari faaliyetleriniz üzerinden hesaplanan vergi dökümü aşağıdadır:\n\n• Kurumlar Vergisi: 4.200 ₳\n• Şehir Hizmet Bedeli: 800 ₳\n• Katma Değer Teşviki: -500 ₳\n\nTOPLAM ÖDENECEK: 4.500 ₳\n\nGecikme faizi binmemesi için en kısa sürede ödeme yapmanızı rica ederiz.`,
        date: '5 dk önce',
        timestamp: Date.now() - 300000,
        read: false,
        starred: false,
        priority: 'urgent',
        amount: 4500,
        actions: ['pay-tax', 'archive'],
        archived: false,
        deleted: false
    },
    {
        id: 'm009',
        category: 'system',
        from: { name: 'Elektrik Dağıtım', flag: null, title: 'Fatura' },
        subject: '⚡ Elektrik Faturası Bildirimi',
        preview: 'Şehir merkezi ve sanayi bölgelerinde kullanılan enerji maliyeti hesaplanmıştır...',
        body: `ELEKTRİK FATURASI DETAYI\n\nAbone No: 4882-X10\nDönem: Mevcut Ay\n\nTüketim Tutarı: 1.150 ₳\nSistem Kullanım Bedeli: 120 ₳\n\nTOPLAM: 1.270 ₳\n\nYetersiz bakiye durumunda enerji üretim binalarında kısıtlamaya gidilebilir.`,
        date: '1 saat önce',
        timestamp: Date.now() - 3600000,
        read: false,
        starred: false,
        priority: 'normal',
        amount: 1270,
        actions: ['pay-bill', 'archive'],
        archived: false,
        deleted: false
    }
];

export function getMessagesByCategory(category) {
    if (category === 'all') return mockMessages.filter(m => !m.archived && !m.deleted);
    if (category === 'starred') return mockMessages.filter(m => m.starred && !m.deleted);
    if (category === 'archived') return mockMessages.filter(m => m.archived && !m.deleted);
    if (category === 'trash') return mockMessages.filter(m => m.deleted);
    return mockMessages.filter(m => m.category === category && !m.archived && !m.deleted);
}

export function getUnreadCount(category) {
    const msgs = getMessagesByCategory(category);
    return msgs.filter(m => !m.read).length;
}

export function getCategoriesWithCounts() {
    return messageCategories.map(cat => ({
        ...cat,
        count: getUnreadCount(cat.id)
    }));
}
