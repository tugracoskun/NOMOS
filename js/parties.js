// PARTİLER MODÜLÜ

// --- İDEOLOJİ LİSTESİ ---
const availableIdeologies = [
    "Agraryanizm", "Anarşizm", "Anarko-Kapitalizm", "Anarko-Komünizm", "Bölgeselcilik",
    "Çevrecilik", "Demokratik Sosyalizm", "Devletçilik", "Faşizm", "Feminizm",
    "Gelenekselcilik", "İslamcılık", "Kemalizm", "Komünizm", "Liberalizm",
    "Liberteryanizm", "Merkezcilik", "Militarizm", "Milliyetçilik", "Monarşizm",
    "Muhafazakarlık", "Mutlakiyet", "Nasyonal Sosyalizm", "Neo-Liberalizm",
    "Pan-Türkizm (Turanizm)", "Parlamentarizm", "Pasifizm", "Popülizm",
    "Sosyal Demokrasi", "Sosyalizm", "Teknokratizm", "Teokrasi", "Totalitarizm", "Ulusalcılık"
];

// --- PARTİ VERİLERİ (Local State) ---
let partiesData = [
    {
        id: 1, name: "Milli İrade Partisi", shortName: "MİP", leader: "Başkan [TR]",
        founded: "12.03.2025", members: 1420, ideology: "Milliyetçilik", color: "#94a3b8",
        logo: null, icon: "fa-wolf-pack-battalion", slogan: "Her şey vatan için!",
        description: "Devletin bekasını savunan köklü bir hareket.", policies: ["Sınır güvenliği", "Milli üretim"], wage: "500 G"
    },
    {
        id: 2, name: "Özgür Yarınlar", shortName: "ÖYH", leader: "Ece Y.",
        founded: "05.01.2025", members: 850, ideology: "Liberalizm", color: "#3b82f6",
        logo: null, icon: "fa-dove", slogan: "Özgür birey, zengin toplum.",
        description: "Serbest piyasayı savunan oluşum.", policies: ["Düşük vergi", "Özgürlük"], wage: "250 G"
    }
];

let cropper = null; // Kırpma aracı örneği
let croppedLogoUrl = null; // Kaydedilecek logo

// --- GİRİŞ NOKTASI ---
export function renderPartiesPage(container) {
    // İlk açılışta liste görünümünü yükle
    loadListView(container);
}

// 1. LİSTE GÖRÜNÜMÜ
function loadListView(container) {
    // İdeoloji Dropdown HTML
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');

    container.innerHTML = `
        <div class="parties-wrapper">
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
                <button class="create-btn" id="btn-create-party"><i class="fa-solid fa-plus"></i> Parti Kur</button>
            </div>
            <div id="party-list-grid" class="party-list-grid"></div>
        </div>
        <!-- Modal -->
        <div id="party-modal" class="modal-overlay" style="display:none;">
            <div class="modal-content"><button class="close-modal"><i class="fa-solid fa-xmark"></i></button><div id="modal-body"></div></div>
        </div>
    `;

    renderList(partiesData);
    
    // Event Listeners
    document.getElementById('party-search').addEventListener('input', (e) => filterParties(e.target.value));
    document.getElementById('btn-create-party').addEventListener('click', () => loadCreateView(container));
    
    // Modal Events
    const modal = document.getElementById('party-modal');
    modal.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });
    document.querySelector('.close-modal').addEventListener('click', () => modal.style.display = 'none');
}

// 2. PARTİ KURMA GÖRÜNÜMÜ
function loadCreateView(container) {
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');

    container.innerHTML = `
        <div class="create-party-wrapper">
            <div class="cp-header">
                <button class="back-btn" id="btn-back"><i class="fa-solid fa-arrow-left"></i></button>
                <div class="cp-title">
                    <h2>Yeni Siyasi Parti Kur</h2>
                    <p>İdeolojini seç, manifestonu yaz ve destekçilerini topla.</p>
                </div>
            </div>

            <div class="cp-grid">
                <!-- LOGO YÜKLEME -->
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

                <!-- FORM -->
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

        <!-- CROPPER MODAL (Gizli) -->
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

    // --- EVENTLER ---
    
    // Geri Dön
    document.getElementById('btn-back').addEventListener('click', () => loadListView(container));

    // Logo Yükleme ve Kırpma Mantığı
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
                
                // Cropper Başlat (1:1 Kare)
                if(cropper) cropper.destroy();
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 1,
                    viewMode: 1,
                    background: false // PNG saydamlık için
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Kırpma Kaydet
    document.getElementById('btn-crop-save').addEventListener('click', () => {
        if(cropper) {
            // Resmi al ve base64 yap
            croppedLogoUrl = cropper.getCroppedCanvas({
                width: 300, height: 300
            }).toDataURL('image/png'); // PNG formatı

            // Önizlemeye koy
            const preview = document.getElementById('final-logo-preview');
            const placeholder = document.getElementById('upload-placeholder');
            
            preview.src = croppedLogoUrl;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            
            cropperModal.style.display = 'none';
        }
    });

    document.getElementById('btn-crop-cancel').addEventListener('click', () => {
        cropperModal.style.display = 'none';
        fileInput.value = ''; // Reset
    });

    // Renk Değişimi
    document.getElementById('inp-color').addEventListener('input', (e) => {
        document.getElementById('color-hex').innerText = e.target.value;
    });

    // PARTİYİ KUR BUTONU
    document.getElementById('btn-publish').addEventListener('click', () => {
        const name = document.getElementById('inp-name').value;
        const short = document.getElementById('inp-short').value;
        const ideology = document.getElementById('inp-ideology').value;
        const desc = document.getElementById('inp-desc').value;
        
        if(!name || !short || !desc) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        // Yeni Partiyi Ekle
        const newParty = {
            id: partiesData.length + 1,
            name: name,
            shortName: short.toUpperCase(),
            leader: "Başkan [TR]", // Şu anki kullanıcı
            founded: new Date().toLocaleDateString('tr-TR'),
            members: 1,
            ideology: ideology,
            color: document.getElementById('inp-color').value,
            logo: croppedLogoUrl, // Kırpılmış resim
            icon: null, // Custom logo varsa ikon null olsun
            slogan: document.getElementById('inp-slogan').value,
            description: desc,
            policies: ["Yeni kuruldu"],
            wage: "0 G"
        };

        partiesData.push(newParty);
        alert("Parti başarıyla kuruldu!");
        loadListView(container); // Listeye dön
    });
}

// --- YARDIMCI FONKSİYONLAR ---
function renderList(data) {
    const grid = document.getElementById('party-list-grid');
    grid.innerHTML = "";
    
    if(data.length === 0) {
        grid.innerHTML = `<div style="text-align:center; width:100%; color:#64748b;">Kayıt bulunamadı.</div>`;
        return;
    }

    data.forEach(party => {
        const card = document.createElement('div');
        card.className = 'party-list-card';
        card.style.borderLeft = `4px solid ${party.color}`;
        
        // Logo var mı, yoksa varsayılan ikon mu?
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
            <button class="details-btn">İncele</button>
        `;
        
        card.querySelector('.details-btn').addEventListener('click', (e) => { e.stopPropagation(); openPartyModal(party); });
        card.addEventListener('click', () => openPartyModal(party));
        grid.appendChild(card);
    });
}

function filterParties(text) {
    const filtered = partiesData.filter(p => p.name.toLowerCase().includes(text.toLowerCase()));
    renderList(filtered);
}

function openPartyModal(party) {
    const modal = document.getElementById('party-modal');
    const body = document.getElementById('modal-body');
    
    // Logo Gösterimi (Resim veya İkon)
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
            <div class="wiki-infobox">
                <div class="wiki-title">Künye</div>
                <div class="wiki-row"><span>Kısaltma</span> <strong>${party.shortName}</strong></div>
                <div class="wiki-row"><span>Lider</span> <strong>${party.leader}</strong></div>
                <div class="wiki-row"><span>İdeoloji</span> <span style="color:${party.color}">${party.ideology}</span></div>
            </div>
            <div class="party-main-content">
                <h3>Hakkında</h3>
                <p>${party.description}</p>
                <div class="action-buttons"><button class="join-party-btn" style="background:${party.color}">Katıl</button></div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}