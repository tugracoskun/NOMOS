// PARTİLER: DETAY MODALI

export function setupModal(container) {
    // Modalı HTML'e ekle (Eğer yoksa)
    if (!document.getElementById('party-modal')) {
        const modalHtml = `
            <div id="party-modal" class="modal-overlay" style="display:none;">
                <div class="modal-content">
                    <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
                    <div id="modal-body"></div>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', modalHtml);
    }

    const modal = document.getElementById('party-modal');
    
    // Kapatma Mantığı
    const closeAction = () => {
        if (window.location.hash.includes('detail')) {
            history.back();
        } else {
            modal.style.display = 'none';
        }
    };

    modal.addEventListener('click', (e) => { if (e.target === modal) closeAction(); });
    document.querySelector('.close-modal').addEventListener('click', closeAction);
}

export function openPartyModal(party) {
    const modal = document.getElementById('party-modal');
    const body = document.getElementById('modal-body');

    if(!modal || !body) return;

    let logoDisplay = party.logo 
        ? `<img src="${party.logo}" class="modal-logo-img">` 
        : `<div class="big-logo" style="color:${party.color}"><i class="fa-solid ${party.icon || 'fa-flag'}"></i></div>`;

    body.innerHTML = `
        <div class="party-profile-header" style="background: linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.6)), linear-gradient(to right, ${party.color}, transparent);">
            ${logoDisplay}
            <div class="header-texts">
                <h1>${party.name} <img src="https://flagcdn.com/32x24/${party.countryCode}.png" title="${party.country}"></h1>
                <p class="slogan">"${party.slogan || ''}"</p>
            </div>
        </div>
        <div class="party-profile-grid">
            <div class="wiki-infobox">
                <div class="wiki-title">Künye</div>
                <div class="wiki-row"><span>Merkez</span> <strong>${party.city}, ${party.country}</strong></div>
                <div class="wiki-row"><span>Lider</span> <strong>${party.leader}</strong></div>
                <div class="wiki-row"><span>Kuruluş</span> <strong>${party.founded}</strong></div>
                <div class="wiki-row"><span>İdeoloji</span> <span style="color:${party.color}">${party.ideology}</span></div>
                <div class="wiki-row"><span>Maaş</span> <strong style="color:#eab308">${party.wage}</strong></div>
            </div>
            <div class="party-main-content">
                <h3>Hakkında</h3>
                <p>${party.description}</p>
                <h3>Politikalar</h3>
                <ul class="policy-list">${party.policies.map(p => `<li><i class="fa-solid fa-check" style="color:${party.color}"></i> ${p}</li>`).join('')}</ul>
                <div class="action-buttons"><button class="join-party-btn" style="background:${party.color}">Katıl</button></div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}