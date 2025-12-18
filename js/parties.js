// PARTİLER MODÜLÜ
// Parti listeleme, detay görüntüleme ve yeni parti kurma işlemlerini yönetir.

import { navigateTo } from './router.js';

// ==========================================
// BÖLÜM 1: VERİ HAVUZU
// ==========================================

const availableIdeologies = [
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

// Örnek Parti Verileri (Local State)
let partiesData = [
    {
        id: 1,
        name: "Milli İrade Partisi",
        shortName: "MİP",
        leader: "Kürşat Bey",
        founded: "12 Kasım 2024",
        members: 1420,
        ideology: "Milliyetçilik",
        color: "#94a3b8", 
        logo: null, 
        icon: "fa-wolf-pack-battalion", 
        slogan: "Her şey vatan için!",
        description: "Milli İrade Partisi, devletin bekasını ve ulusun bölünmez bütünlüğünü savunan, geleneklerine bağlı vatandaşların partisidir.",
        policies: ["Sınır güvenliği artırılacak", "Yerli üretim desteklenecek"],
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
        logo: null, 
        icon: "fa-dove", 
        slogan: "Bırakınız yapsınlar.",
        description: "Bireysel özgürlükleri ve serbest piyasa ekonomisini savunan oluşum.",
        policies: ["Vergiler düşürülecek", "Gümrük duvarları kaldırılacak"],
        wage: "250 G"
    }
];

// Cropper Değişkenleri
let cropper = null;
let croppedLogoUrl = null;

// ==========================================
// BÖLÜM 2: GİRİŞ VE YÖNLENDİRME
// ==========================================

export function renderPartiesPage(container, viewMode = null, id = null) {
    // Router'dan gelen isteğe göre doğru ekranı göster
    
    if (viewMode === 'create') {
        // 1. Parti Kurma Ekranı
        loadCreateView(container);
    } else {
        // 2. Liste Ekranı (Varsayılan)
        // Eğer sayfa zaten yüklüyse tekrar render etmeyebiliriz ama şimdilik her seferinde temiz kurulum yapıyoruz.
        loadListView(container);

        // Eğer URL'de detay varsa (parties/detail/5) Modalı Aç
        if (viewMode === 'detail' && id) {
            const party = partiesData.find(p => p.id == id);
            if (party) {
                // DOM oluştuktan hemen sonra modalı aç
                setTimeout(() => openPartyModal(party), 50);
            }
        }
    }
}

// ==========================================
// BÖLÜM 3: LİSTE GÖRÜNÜMÜ (LOBİ)
// ==========================================

function loadListView(container) {
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');

    container.innerHTML = `
        <div class="parties-wrapper">
            <!-- Araç Çubuğu -->
            <div class="parties-toolbar">
                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="party-search" placeholder="Parti ara...">
                </div>
                
                <div class="filter-box">
                    <select id="ideology-filter">
                        <option value="all">Tüm İdeolojiler</option>
                        ${ideologyOptions}
                    </select>
                </div>

                <!-- ROUTER LINK: Parti Kur Sayfasına Git -->
                <button class="create-btn" data-page="parties" data-view="create">
                    <i class="fa-solid fa-plus"></i> Parti Kur
                </button>
            </div>

            <!-- Liste Izgarası -->
            <div id="party-list-grid" class="party-list-grid">
                <!-- JS ile doldurulacak -->
            </div>
        </div>

        <!-- Detay Modalı (Pop-up) -->
        <div id="party-modal" class="modal-overlay" style="display:none;">
            <div class="modal-content">
                <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
                <div id="modal-body"></div>
            </div>
        </div>
    `;

    // Listeyi ilk kez doldur
    renderList(partiesData);

    // Event Listeners (Filtreleme)
    document.getElementById('party-search').addEventListener('input', (e) => filterParties(e.target.value));
    document.getElementById('ideology-filter').addEventListener('change', (e) => filterParties(document.getElementById('party-search').value));

    // Modal Kapatma Mantığı (Geri Tuşu Entegrasyonu)
    const modal = document.getElementById('party-modal');
    
    const closeAction = () => {
        // Eğer URL detay modundaysa (#parties/detail/1), geçmişte geri git
        if (window.location.hash.includes('detail')) {
            history.back();
        } else {
            modal.style.display = 'none';
        }
    };

    modal.addEventListener('click', (e) => { if (e.target === modal) closeAction(); });
    document.querySelector('.close-modal').addEventListener('click', closeAction);
}

// Listeyi Ekrana Basan Yardımcı Fonksiyon
function renderList(data) {
    const grid = document.getElementById('party-list-grid');
    grid.innerHTML = "";

    const ideologyFilter = document.getElementById('ideology-filter') ? document.getElementById('ideology-filter').value : 'all';
    
    // İdeoloji Filtresi Uygula
    const finalData = data.filter(p => ideologyFilter === 'all' || p.ideology === ideologyFilter);

    if (finalData.length === 0) {
        grid.innerHTML = `<div style="text-align:center; width:100%; color:#64748b; padding:20px;">Aradığınız kriterlere uygun parti bulunamadı.</div>`;
        return;
    }

    finalData.forEach(party => {
        const card = document.createElement('div');
        card.className = 'party-list-card';
        card.style.borderLeft = `4px solid ${party.color}`;

        // Logo Kontrolü (Resim mi İkon mu?)
        let logoHtml = '';
        if (party.logo) {
            logoHtml = `<div class="list-logo"><img src="${party.logo}" style="width:40px; height:40px; border-radius:4px; object-fit:contain;"></div>`;
        } else {
            logoHtml = `<div class="list-logo" style="color:${party.color}"><i class="fa-solid ${party.icon || 'fa-flag'}"></i></div>`;
        }

        card.innerHTML = `
            ${logoHtml}
            <div class="list-info">
                <div class="list-name">${party.name} <span class="list-short">(${party.shortName})</span></div>
                <div class="list-sub">${party.leader} • ${party.members} Üye</div>
            </div>
            <div class="list-tag">${party.ideology}</div>
            
            <!-- ROUTER LINK: Detaya Git -->
            <button class="details-btn" data-page="parties" data-view="detail" data-id="${party.id}">İncele</button>
        `;

        // Karta tıklayınca da detaya git (Global listener yakalayacak)
        card.setAttribute('data-page', 'parties');
        card.setAttribute('data-view', 'detail');
        card.setAttribute('data-id', party.id);

        grid.appendChild(card);
    });
}

function filterParties(text) {
    const filtered = partiesData.filter(p => 
        p.name.toLowerCase().includes(text.toLowerCase()) || 
        p.shortName.toLowerCase().includes(text.toLowerCase())
    );
    renderList(filtered);
}

// ==========================================
// BÖLÜM 4: DETAY PENCERESİ (MODAL)
// ==========================================

function openPartyModal(party) {
    const modal = document.getElementById('party-modal');
    const body = document.getElementById('modal-body');

    if (!modal || !body) return;

    // Büyük Logo Gösterimi
    let logoDisplay = '';
    if (party.logo) {
        logoDisplay = `<img src="${party.logo}" style="width:120px; height:120px; object-fit:contain; border-radius:10px; background:rgba(0,0,0,0.2); padding:10px;">`;
    } else {
        logoDisplay = `<div class="big-logo" style="color:${party.color}"><i class="fa-solid ${party.icon || 'fa-flag'}"></i></div>`;
    }

    body.innerHTML = `
        <div class="party-profile-header" style="background: linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.6)), linear-gradient(to right, ${party.color}, transparent);">
            ${logoDisplay}
            <div class="header-texts">
                <h1>${party.name}</h1>
                <p class="slogan">"${party.slogan || 'Slogan yok'}"</p>
            </div>
        </div>

        <div class="party-profile-grid">
            <!-- Sol: Künye -->
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

// ==========================================
// BÖLÜM 5: PARTİ KURMA EKRANI & CROPPER
// ==========================================

function loadCreateView(container) {
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');

    container.innerHTML = `
        <div class="create-party-wrapper">
            <div class="cp-header">
                <!-- GERİ BUTONU -->
                <button class="back-btn" id="btn-back"><i class="fa-solid fa-arrow-left"></i></button>
                <div class="cp-title">
                    <h2>Yeni Siyasi Parti Kur</h2>
                    <p>İdeolojini seç, manifestonu yaz ve destekçilerini topla.</p>
                </div>
            </div>

            <div class="cp-grid">
                <!-- LOGO YÜKLEME ALANI -->
                <div class="logo-upload-section">
                    <input type="file" id="logo-input" accept="image/*" style="display:none">
                    <div class="logo-preview-box" id="logo-dropzone">
                        <div class="upload-placeholder" id="upload-placeholder">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                            <div>Logo Yükle</div>
                            <small style="font-size:0.7rem; color:#64748b">(PNG, JPG)</small>
                        </div>
                        <img id="final-logo-preview" style="display:none;">
                    </div>
                    <p style="font-size:0.8rem; color:#64748b; text-align:center;">Logo kenarlarda otomatik boşluk bırakılarak yerleştirilir.</p>
                </div>

                <!-- FORM ALANLARI -->
                <div class="form-fields">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Parti Adı</label>
                            <input type="text" class="cp-input" id="inp-name" placeholder="Örn: Büyük Birlik Partisi">
                        </div>
                        <div class="form-group">
                            <label>Kısaltma</label>
                            <input type="text" class="cp-input" id="inp-short" placeholder="Örn: BBP" maxlength="6">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>İdeoloji</label>
                            <select class="cp-select" id="inp-ideology">
                                ${ideologyOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Parti Rengi</label>
                            <div class="color-picker-wrapper">
                                <input type="color" id="inp-color" value="#3b82f6">
                                <span id="color-hex">#3b82f6</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Slogan</label>
                        <input type="text" class="cp-input" id="inp-slogan" placeholder="Partinizin vurucu cümlesi...">
                    </div>

                    <div class="form-group">
                        <label>Parti Manifestosu (Hakkında)</label>
                        <textarea class="cp-textarea" id="inp-desc" placeholder="Partinizin amaçlarını ve politikalarını halka anlatın..."></textarea>
                    </div>
                </div>
            </div>

            <div class="cp-footer">
                <div class="cost-display">
                    <i class="fa-solid fa-coins"></i> KURULUŞ BEDELİ: 1000 G
                </div>
                <button class="publish-btn" id="btn-publish">
                    <i class="fa-solid fa-check"></i> Partiyi Kur
                </button>
            </div>
        </div>

        <!-- CROPPER MODAL (Kırpma Penceresi) -->
        <div id="cropper-modal" class="cropper-modal" style="display:none;">
            <div class="cropper-container">
                <img id="image-to-crop" style="max-width:100%;">
            </div>
            <div class="cropper-controls">
                <button class="crop-btn btn-cancel" id="btn-crop-cancel">İptal</button>
                <button class="crop-btn btn-save" id="btn-crop-save">Kırp ve Kaydet</button>
            </div>
        </div>
    `;

    // --- EVENT HANDLERS ---
    
    // Geri Butonu (Mouse Back Tuşuyla Aynı İşlevi Görür)
    document.getElementById('btn-back').addEventListener('click', () => {
        history.back();
    });

    // 1. Logo Yükleme ve Kırpma Başlatma
    const dropzone = document.getElementById('logo-dropzone');
    const fileInput = document.getElementById('logo-input');
    const cropperModal = document.getElementById('cropper-modal');
    const imageToCrop = document.getElementById('image-to-crop');

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                imageToCrop.src = evt.target.result;
                cropperModal.style.display = 'flex';
                
                // Cropper'ı başlat (Varsa eskisini sil)
                if (cropper) cropper.destroy();
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 1, // Kare kesim
                    viewMode: 1,
                    background: false
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // 2. Kırpmayı Kaydet
    document.getElementById('btn-crop-save').addEventListener('click', () => {
        if (cropper) {
            // Resmi PNG olarak al (300x300px)
            croppedLogoUrl = cropper.getCroppedCanvas({
                width: 300, height: 300
            }).toDataURL('image/png');

            // Önizlemeye koy
            const preview = document.getElementById('final-logo-preview');
            const placeholder = document.getElementById('upload-placeholder');
            
            preview.src = croppedLogoUrl;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            
            cropperModal.style.display = 'none';
        }
    });

    // 3. İptal Et
    document.getElementById('btn-crop-cancel').addEventListener('click', () => {
        cropperModal.style.display = 'none';
        fileInput.value = '';
    });

    // 4. Renk Göstergesi
    document.getElementById('inp-color').addEventListener('input', (e) => {
        document.getElementById('color-hex').innerText = e.target.value;
    });

    // 5. Partiyi Yayınla
    document.getElementById('btn-publish').addEventListener('click', () => {
        const name = document.getElementById('inp-name').value;
        const short = document.getElementById('inp-short').value;
        const ideology = document.getElementById('inp-ideology').value;
        const desc = document.getElementById('inp-desc').value;
        
        if (!name || !short || !desc) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        const newParty = {
            id: partiesData.length + 1,
            name: name,
            shortName: short.toUpperCase(),
            leader: "Başkan [TR]",
            founded: new Date().toLocaleDateString('tr-TR'),
            members: 1,
            ideology: ideology,
            color: document.getElementById('inp-color').value,
            logo: croppedLogoUrl, // Kırpılmış resim
            icon: null,
            slogan: document.getElementById('inp-slogan').value,
            description: desc,
            policies: ["Yeni kuruldu"],
            wage: "0 G"
        };

        partiesData.push(newParty);
        alert("Parti başarıyla kuruldu!");
        
        // Başarılı olunca geçmişte geri git (Listeye dön)
        history.back();
    });
}