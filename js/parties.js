// PARTİLER MODÜLÜ
// Veri, Listeleme, Arama ve Detay Penceresi

// --- GENİŞLETİLMİŞ İDEOLOJİ LİSTESİ (40+ Adet) ---
const availableIdeologies = [
    "Agraryanizm (Köylü Hareketi)",
    "Anarşizm",
    "Anarko-Kapitalizm",
    "Anarko-Komünizm",
    "Bölgeselcilik",
    "Çevrecilik (Yeşil Siyaset)",
    "Demokratik Sosyalizm",
    "Devletçilik",
    "Eko-Faşizm",
    "Faşizm",
    "Feminizm",
    "Gelenekselcilik",
    "Hristiyan Demokrasi",
    "İslamcılık",
    "İslami Demokrasi",
    "Kemalizm",
    "Komünizm",
    "Korporatizm",
    "Liberalizm",
    "Liberteryanizm",
    "Marksizm-Leninizm",
    "Merkezcilik",
    "Militarizm",
    "Milliyetçilik",
    "Monarşizm",
    "Muhafazakarlık",
    "Mutlakiyet",
    "Nasyonal Sosyalizm",
    "Neo-Liberalizm",
    "Otoriteryanizm",
    "Pan-Türkizm (Turanizm)",
    "Parlamentarizm",
    "Pasifizm",
    "Piratizm (Korsan Parti)",
    "Popülizm",
    "Progresivizm (İlerlemecilik)",
    "Sosyal Demokrasi",
    "Sosyalizm",
    "Teknokratizm",
    "Teokrasi",
    "Totalitarizm",
    "Transhümanizm",
    "Troçkizm",
    "Ulusalcılık"
];

// Örnek Veritabanı (Test için çeşitlendirildi)
const partiesData = [
    {
        id: 1,
        name: "Milli İrade Partisi",
        shortName: "MİP",
        leader: "Kürşat Bey",
        founded: "12 Kasım 2024",
        members: 1420,
        ideology: "Milliyetçilik",
        color: "#94a3b8", 
        logo: "fa-wolf-pack-battalion", 
        slogan: "Her şey vatan için!",
        description: "Milli İrade Partisi, devletin bekasını ve ulusun bölünmez bütünlüğünü savunan, geleneklerine bağlı vatandaşların partisidir.",
        policies: ["Sınır güvenliği artırılacak", "Yerli üretim desteklenecek", "Askeri bütçe %20 artırılacak"],
        wage: "500 G"
    },
    {
        id: 2,
        name: "Özgür Yarınlar Hareketi",
        shortName: "ÖYH",
        leader: "Ece Yılmaz",
        founded: "5 Ocak 2025",
        members: 850,
        ideology: "Liberalizm",
        color: "#3b82f6", 
        logo: "fa-dove",
        slogan: "Bırakınız yapsınlar, bırakınız geçsinler.",
        description: "Bireysel özgürlükleri ve serbest piyasa ekonomisini savunan oluşum.",
        policies: ["Vergiler düşürülecek", "Gümrük duvarları kaldırılacak", "İfade özgürlüğü"],
        wage: "250 G"
    },
    {
        id: 3,
        name: "Kızıl Sendika",
        shortName: "KS",
        leader: "Devrim Ç.",
        founded: "1 Mayıs 2024",
        members: 2300,
        ideology: "Komünizm",
        color: "#ef4444", 
        logo: "fa-hammer",
        slogan: "Zincirlerinden başka kaybedecek neyin var?",
        description: "İşçi sınıfının haklarını savunan devrimci parti.",
        policies: ["Kamulaştırma", "Ücretsiz konut", "İşçi konseyleri"],
        wage: "100 G"
    },
    {
        id: 4,
        name: "Yeşil Doğa Partisi",
        shortName: "YEŞİL",
        leader: "Deniz G.",
        founded: "22 Mart 2025",
        members: 120,
        ideology: "Çevrecilik (Yeşil Siyaset)",
        color: "#10b981", 
        logo: "fa-leaf",
        slogan: "Doğa yoksa, gelecek yok.",
        description: "Sürdürülebilir kalkınma odaklı parti.",
        policies: ["Fosil yakıt yasağı", "Yenilenebilir enerji", "Orman koruma"],
        wage: "0 G"
    },
    {
        id: 5,
        name: "Gelecek Bilim Hareketi",
        shortName: "GBH",
        leader: "Dr. Selim A.",
        founded: "10 Nisan 2025",
        members: 450,
        ideology: "Teknokratizm",
        color: "#a855f7", 
        logo: "fa-microchip",
        slogan: "Veri, Bilim, Yönetim.",
        description: "Devletin siyasetçiler değil, yapay zeka ve uzman kurullar tarafından yönetilmesini savunan hareket.",
        policies: ["Yapay zeka hükümeti", "Ar-Ge bütçesi %10", "Dijital vatandaşlık"],
        wage: "300 G"
    },
    {
        id: 6,
        name: "Büyük Turan Birliği",
        shortName: "BTB",
        leader: "Alparslan T.",
        founded: "19 Mayıs 2023",
        members: 3100,
        ideology: "Pan-Türkizm (Turanizm)",
        color: "#06b6d4", 
        logo: "fa-horse-head",
        slogan: "Adriyatik'ten Çin Seddi'ne!",
        description: "Tüm Türk devletlerinin tek çatı altında birleşmesini hedefleyen birlik.",
        policies: ["Ortak ordu", "Ortak para birimi", "Vizesiz seyahat"],
        wage: "600 G"
    }
];

export function renderPartiesPage(container) {
    // İdeoloji Seçeneklerini Oluştur (Alfabetik Sıraya Göre)
    const ideologyOptions = availableIdeologies.sort().map(ideology => 
        `<option value="${ideology}">${ideology}</option>`
    ).join('');

    container.innerHTML = `
        <div class="parties-wrapper">
            <!-- ÜST KONTROL PANELİ -->
            <div class="parties-toolbar">
                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="party-search" placeholder="Parti ara...">
                </div>
                
                <div class="filter-box">
                    <select id="ideology-filter">
                        <option value="all">Tüm İdeolojiler</option>
                        ${ideologyOptions} <!-- LİSTE BURAYA OTOMATİK GELİYOR -->
                    </select>
                </div>

                <button class="create-btn"><i class="fa-solid fa-plus"></i> Parti Kur</button>
            </div>

            <!-- PARTİ LİSTESİ (GRID) -->
            <div id="party-list-grid" class="party-list-grid">
                <!-- JS ile doldurulacak -->
            </div>
        </div>

        <!-- DETAY MODAL -->
        <div id="party-modal" class="modal-overlay" style="display:none;">
            <div class="modal-content">
                <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
                <div id="modal-body"></div>
            </div>
        </div>
    `;

    filterAndRenderParties();

    document.getElementById('party-search').addEventListener('input', filterAndRenderParties);
    document.getElementById('ideology-filter').addEventListener('change', filterAndRenderParties);
    
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('party-modal').addEventListener('click', (e) => {
        if (e.target.id === 'party-modal') closeModal();
    });
}

function filterAndRenderParties() {
    const searchText = document.getElementById('party-search').value.toLowerCase();
    const ideologyFilter = document.getElementById('ideology-filter').value;
    const grid = document.getElementById('party-list-grid');

    grid.innerHTML = "";

    const filtered = partiesData.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchText) || p.shortName.toLowerCase().includes(searchText);
        const matchesIdeology = ideologyFilter === 'all' || p.ideology === ideologyFilter;
        return matchesSearch && matchesIdeology;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8; width:100%;">Aradığınız kriterlere uygun parti bulunamadı.</div>`;
        return;
    }

    filtered.forEach(party => {
        const card = document.createElement('div');
        card.className = 'party-list-card';
        card.style.borderLeft = `4px solid ${party.color}`;
        card.innerHTML = `
            <div class="list-logo" style="color:${party.color}"><i class="fa-solid ${party.logo}"></i></div>
            <div class="list-info">
                <div class="list-name">${party.name} <span class="list-short">(${party.shortName})</span></div>
                <div class="list-sub">${party.leader} • ${party.members} Üye</div>
            </div>
            <div class="list-tag">${party.ideology}</div>
            <button class="details-btn">İncele</button>
        `;
        
        card.querySelector('.details-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openPartyModal(party);
        });
        card.addEventListener('click', () => openPartyModal(party));

        grid.appendChild(card);
    });
}

function openPartyModal(party) {
    const modal = document.getElementById('party-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <div class="party-profile-header" style="background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4)), linear-gradient(to right, ${party.color}, transparent);">
            <div class="big-logo" style="color:${party.color}"><i class="fa-solid ${party.logo}"></i></div>
            <div class="header-texts">
                <h1>${party.name}</h1>
                <p class="slogan">"${party.slogan}"</p>
            </div>
        </div>

        <div class="party-profile-grid">
            <div class="wiki-infobox">
                <div class="wiki-title">Parti Künyesi</div>
                <div class="wiki-row"><span>Kısaltma</span> <strong>${party.shortName}</strong></div>
                <div class="wiki-row"><span>Genel Başkan</span> <strong>${party.leader}</strong></div>
                <div class="wiki-row"><span>Kuruluş</span> <strong>${party.founded}</strong></div>
                <div class="wiki-row"><span>İdeoloji</span> <span class="tag" style="color:${party.color}">${party.ideology}</span></div>
                <div class="wiki-row"><span>Üye Sayısı</span> <strong>${party.members}</strong></div>
                <div class="wiki-row"><span>Parti Maaşı</span> <strong style="color:#eab308">${party.wage}</strong></div>
            </div>

            <div class="party-main-content">
                <h3>Hakkında</h3>
                <p>${party.description}</p>
                
                <h3>Parti Politikaları</h3>
                <ul class="policy-list">
                    ${party.policies.map(p => `<li><i class="fa-solid fa-check" style="color:${party.color}"></i> ${p}</li>`).join('')}
                </ul>

                <div class="action-buttons">
                    <button class="join-party-btn" style="background-color:${party.color}">Partiye Katıl</button>
                    <button class="donate-btn"><i class="fa-solid fa-coins"></i> Bağış Yap</button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('party-modal').style.display = 'none';
}