// PARTİLER: OLUŞTURMA EKRANI
import { availableIdeologies, addParty, partiesData } from './data.js';

let cropper = null;
let croppedLogoUrl = null;

export function renderCreateView(container) {
    const ideologyOptions = availableIdeologies.sort().map(i => `<option value="${i}">${i}</option>`).join('');

    container.innerHTML = `
        <div class="create-party-wrapper">
            <div class="cp-header">
                <button class="back-btn" id="btn-back"><i class="fa-solid fa-arrow-left"></i></button>
                <div class="cp-title"><h2>Yeni Siyasi Parti Kur</h2></div>
            </div>
            <div class="cp-grid">
                <div class="logo-upload-section">
                    <input type="file" id="logo-input" accept="image/*" style="display:none">
                    <div class="logo-preview-box" id="logo-dropzone">
                        <div class="upload-placeholder" id="upload-placeholder"><i class="fa-solid fa-cloud-arrow-up"></i><div>Logo Yükle</div></div>
                        <img id="final-logo-preview" style="display:none;">
                    </div>
                </div>
                <div class="form-fields">
                    <div class="form-row">
                        <div class="form-group"><label>Parti Adı</label><input type="text" class="cp-input" id="inp-name"></div>
                        <div class="form-group"><label>Kısaltma</label><input type="text" class="cp-input" id="inp-short" maxlength="6"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>İdeoloji</label><select class="cp-select" id="inp-ideology">${ideologyOptions}</select></div>
                        <div class="form-group"><label>Renk</label><div class="color-picker-wrapper"><input type="color" id="inp-color" value="#3b82f6"><span id="color-hex">#3b82f6</span></div></div>
                    </div>
                    <div class="form-group"><label>Slogan</label><input type="text" class="cp-input" id="inp-slogan"></div>
                    <div class="form-group"><label>Manifesto</label><textarea class="cp-textarea" id="inp-desc"></textarea></div>
                </div>
            </div>
            <div class="cp-footer">
                <div class="cost-display"><i class="fa-solid fa-coins"></i> 1000 G</div>
                <button class="publish-btn" id="btn-publish">Partiyi Kur</button>
            </div>
        </div>

        <!-- CROPPER MODAL -->
        <div id="cropper-modal" class="cropper-modal" style="display:none;">
            <div class="cropper-container"><img id="image-to-crop" style="max-width:100%;"></div>
            <div class="cropper-controls">
                <button class="crop-btn btn-cancel" id="btn-crop-cancel">İptal</button>
                <button class="crop-btn btn-save" id="btn-crop-save">Kırp</button>
            </div>
        </div>
    `;

    setupEventListeners();
}

function setupEventListeners() {
    // Geri Dön
    document.getElementById('btn-back').addEventListener('click', () => history.back());

    // Renk Güncelle
    document.getElementById('inp-color').addEventListener('input', (e) => document.getElementById('color-hex').innerText = e.target.value);

    // Yayınla
    document.getElementById('btn-publish').addEventListener('click', () => {
        const name = document.getElementById('inp-name').value;
        if(!name) { alert("Lütfen isim giriniz"); return; }
        
        const newParty = {
            id: partiesData.length + 1,
            name: name,
            shortName: document.getElementById('inp-short').value.toUpperCase(),
            leader: "Başkan [TR]",
            founded: new Date().toLocaleDateString('tr-TR'),
            members: 1,
            ideology: document.getElementById('inp-ideology').value,
            color: document.getElementById('inp-color').value,
            logo: croppedLogoUrl,
            slogan: document.getElementById('inp-slogan').value,
            description: document.getElementById('inp-desc').value,
            policies: ["Yeni"], wage: "0 G", country: "Türkiye", city: "Ankara", countryCode: "tr"
        };

        addParty(newParty);
        alert("Parti Kuruldu!");
        history.back();
    });

    setupCropper();
}

function setupCropper() {
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
                if(cropper) cropper.destroy();
                cropper = new Cropper(imageToCrop, { aspectRatio: 1, viewMode: 1, background: false });
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('btn-crop-save').addEventListener('click', () => {
        if(cropper) {
            croppedLogoUrl = cropper.getCroppedCanvas({ width: 300, height: 300 }).toDataURL('image/png');
            document.getElementById('final-logo-preview').src = croppedLogoUrl;
            document.getElementById('final-logo-preview').style.display = 'block';
            document.getElementById('upload-placeholder').style.display = 'none';
            cropperModal.style.display = 'none';
        }
    });

    document.getElementById('btn-crop-cancel').addEventListener('click', () => {
        cropperModal.style.display = 'none';
        fileInput.value = '';
    });
}