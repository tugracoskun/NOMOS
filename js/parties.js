// PARTİLER MODÜLÜ
// Veri, Listeleme, Arama ve Detay Penceresi (Modal)

// Örnek Veritabanı (Rival Regions + Wiki Hibrit)
const partiesData = [
    {
        id: 1,
        name: "Milli İrade Partisi",
        shortName: "MİP",
        leader: "Kürşat Bey",
        founded: "12 Kasım 2024",
        members: 1420,
        ideology: "Milliyetçilik",
        color: "#94a3b8", // Koyu Gri/Metal
        logo: "fa-wolf-pack-battalion", // FontAwesome ikonu (Resim de olabilir)
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
        color: "#3b82f6", // Mavi
        logo: "fa-dove",
        slogan: "Bırakınız yapsınlar, bırakınız geçsinler.",
        description: "Bireysel özgürlükleri ve serbest piyasa ekonomisini savunan, devletin ekonomiye müdahalesini en aza indirmeyi hedefleyen oluşum.",
        policies: ["Vergiler %10 düşürülecek", "Gümrük duvarları kaldırılacak", "İfade özgürlüğü yasası"],
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
        color: "#ef4444", // Kırmızı
        logo: "fa-hammer",
        slogan: "Zincirlerinden başka kaybedecek neyin var?",
        description: "İşçi sınıfının haklarını savunan, üretim araçlarının kamulaştırılmasını hedefleyen devrimci parti.",
        policies: ["Özel mülkiyet sınırlandırılacak", "Herkese ücretsiz konut", "Fabrikalar işçilere devredilecek"],
        wage: "100 G"
    },
    {
        id: 4,
        name: "Yeşil Doğa Partisi",
        shortName: "YEŞİL",
        leader: "Deniz G.",
        founded: "22 Mart 2025",
        members: 120,
        ideology: "Ekolojizm",
        color: "#10b981", // Yeşil
        logo: "fa-leaf",
        slogan: "Doğa yoksa, gelecek yok.",
        description: "Sürdürülebilir kalkınma ve çevre koruma odaklı, sanayileşmenin doğaya verdiği zararı durdurmayı amaçlayan parti.",
        policies: ["Fosil yakıtlar yasaklanacak", "Yenilenebilir enerji teşviği", "Orman alanları koruma kanunu"],
        wage: "0 G"
    }
];

export function renderPartiesPage(container) {
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
                        <option value="Milliyetçilik">Milliyetçilik</option>
                        <option value="Liberalizm">Liberalizm</option>
                        <option value="Komünizm">Komünizm</option>
                        <option value="Ekolojizm">Ekolojizm</option>
                    </select>
                </div>

                <button class="create-btn"><i class="fa-solid fa-plus"></i> Parti Kur</button>
            </div>

            <!-- PARTİ LİSTESİ (GRID) -->
            <div id="party-list-grid" class="party-list-grid">
                <!-- JS ile doldurulacak -->
            </div>
        </div>

        <!-- DETAY MODAL (Pop-up) - Başlangıçta gizli -->
        <div id="party-modal" class="modal-overlay" style="display:none;">
            <div class="modal-content">
                <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
                <div id="modal-body">
                    <!-- İçerik dinamik gelecek -->
                </div>
            </div>
        </div>
    `;

    // İlk listeleme
    filterAndRenderParties();

    // Event Listeners (Arama ve Filtreleme)
    document.getElementById('party-search').addEventListener('input', filterAndRenderParties);
    document.getElementById('ideology-filter').addEventListener('change', filterAndRenderParties);
    
    // Modal Kapatma
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('party-modal').addEventListener('click', (e) => {
        if (e.target.id === 'party-modal') closeModal();
    });
}

// Filtreleme ve Ekrana Basma Fonksiyonu
function filterAndRenderParties() {
    const searchText = document.getElementById('party-search').value.toLowerCase();
    const ideologyFilter = document.getElementById('ideology-filter').value;
    const grid = document.getElementById('party-list-grid');

    grid.innerHTML = ""; // Temizle

    const filtered = partiesData.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchText) || p.shortName.toLowerCase().includes(searchText);
        const matchesIdeology = ideologyFilter === 'all' || p.ideology === ideologyFilter;
        return matchesSearch && matchesIdeology;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-result">Aradığınız kriterlere uygun parti bulunamadı.</div>`;
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
        
        // Tıklayınca Modalı Aç
        card.querySelector('.details-btn').addEventListener('click', () => openPartyModal(party));
        card.addEventListener('click', (e) => {
             // Butona değil karta basınca da açılsın (opsiyonel)
             if(e.target.tagName !== 'BUTTON') openPartyModal(party);
        });

        grid.appendChild(card);
    });
}

// Detay Penceresini Açma (Rival Regions / Wiki Style)
function openPartyModal(party) {
    const modal = document.getElementById('party-modal');
    const body = document.getElementById('modal-body');

    // Wiki/RR Tarzı İçerik Oluşturma
    body.innerHTML = `
        <div class="party-profile-header" style="background: linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.8)), linear-gradient(to right, ${party.color}, transparent);">
            <div class="big-logo" style="color:${party.color}"><i class="fa-solid ${party.logo}"></i></div>
            <div class="header-texts">
                <h1>${party.name}</h1>
                <p class="slogan">"${party.slogan}"</p>
            </div>
        </div>

        <div class="party-profile-grid">
            <!-- Sol: Wiki Infobox -->
            <div class="wiki-infobox">
                <div class="wiki-title">Parti Künyesi</div>
                <div class="wiki-row"><span>Kısaltma</span> <strong>${party.shortName}</strong></div>
                <div class="wiki-row"><span>Genel Başkan</span> <strong>${party.leader}</strong></div>
                <div class="wiki-row"><span>Kuruluş</span> <strong>${party.founded}</strong></div>
                <div class="wiki-row"><span>İdeoloji</span> <span class="tag" style="color:${party.color}">${party.ideology}</span></div>
                <div class="wiki-row"><span>Üye Sayısı</span> <strong>${party.members}</strong></div>
                <div class="wiki-row"><span>Parti Maaşı</span> <strong style="color:#eab308">${party.wage}</strong></div>
            </div>

            <!-- Sağ: İçerik -->
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