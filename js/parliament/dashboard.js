// MECLİS DASHBOARD
import { parliamentSeats, outsideParties, activeBills, electionPolls, constitutionArticles } from './data.js';

export function renderParliament(container) {
    container.innerHTML = `
        <div class="parliament-layout">
            
            <!-- GRID ALANI -->
            <div class="parliament-grid-system">
                
                <!-- 1. HEMICYCLE (SOL ÜST - ARTIK HEADER BURADA) -->
                <div class="grid-area-hemicycle">
                    
                    <!-- ENTEGRE HEADER -->
                    <div class="integrated-header">
                        <div class="state-info">
                            <img src="https://flagcdn.com/80x60/tr.png" class="state-flag">
                            <div>
                                <h1>Türkiye Cumhuriyeti Meclisi</h1>
                                <span class="regime-tag">Cumhuriyet • Çok Partili Sistem</span>
                            </div>
                        </div>
                        <div class="actions">
                            <button class="action-btn red" id="btn-constitution"><i class="fa-solid fa-book-journal-whills"></i> Anayasa</button>
                            <button class="action-btn blue"><i class="fa-solid fa-check-to-slot"></i> Seçimler</button>
                        </div>
                    </div>

                    <!-- GRAFİK -->
                    <div class="hemicycle-wrapper" id="hemicycle-wrapper"></div>
                    <div class="seat-legend" id="seat-legend"></div>
                </div>

                <!-- 2. SAĞ PANEL (SON YASALAR + ANKETLER) -->
                <div class="grid-area-right-panel">
                    
                    <!-- Kısım A: Son Yasalar -->
                    <div class="sub-panel">
                        <div class="panel-header"><h3><i class="fa-solid fa-gavel"></i> Son Yasalar</h3></div>
                        <ul class="logs-list">
                            <li class="log-item passed"><i class="fa-solid fa-circle-check"></i> <div><strong>Vergi Reformu</strong><small>Dün kabul edildi</small></div></li>
                            <li class="log-item failed"><i class="fa-solid fa-circle-xmark"></i> <div><strong>Savaş İlanı</strong><small>2 gün önce reddedildi</small></div></li>
                        </ul>
                    </div>

                    <!-- Kısım B: Anketler -->
                    <div class="sub-panel">
                        <div class="panel-header"><h3><i class="fa-solid fa-chart-pie"></i> Seçim Anketleri</h3></div>
                        <div class="polls-list" id="polls-list"></div>
                    </div>

                </div>

                <!-- 3. AKTİF TASARILAR (SOL ALT) -->
                <div class="grid-area-bills">
                    <div class="panel-header"><h3><i class="fa-solid fa-file-signature"></i> Gündemdeki Tasarılar</h3></div>
                    <div class="bills-container" id="bills-grid"></div>
                </div>

                <!-- 4. PARTİ DAĞILIMI (SAĞ ALT) -->
                <div class="grid-area-parties">
                    <div class="panel-header"><h3><i class="fa-solid fa-users-rectangle"></i> Parti Durumları</h3></div>
                    <div class="parliament-parties-list">
                        <div class="list-group-title">MECLİSTEKİ PARTİLER</div>
                        ${renderParliamentPartiesList()}
                        <div class="list-group-title">BARAJ ALTI</div>
                        ${renderOutsidePartiesList()}
                    </div>
                </div>

            </div>
        </div>

        <!-- MODAL -->
        <div id="constitution-modal" class="modal-overlay" style="display:none;">
            <div class="modal-content">
                <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
                <div class="const-body">
                    <h2><i class="fa-solid fa-scale-balanced"></i> Devlet Anayasası</h2>
                    <ul class="const-list">${constitutionArticles.map(a => `<li>${a}</li>`).join('')}</ul>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        generateHemicycle();
        renderBills();
        renderPolls();
        setupEvents();
    }, 50);
}

// --- YARDIMCI HTML GENERATORS --- (AYNI KALIYOR)
function renderParliamentPartiesList() {
    return parliamentSeats.map(p => `
        <div class="pp-row">
            <div class="pp-color" style="background:${p.color}"></div>
            <div class="pp-name">${p.party}</div>
            <div class="pp-seats">${p.count} <small>Koltuk</small></div>
        </div>
    `).join('');
}

function renderOutsidePartiesList() {
    return outsideParties.map(p => `
        <div class="pp-row out">
            <div class="pp-color" style="background:${p.color}"></div>
            <div class="pp-name">${p.party}</div>
            <div class="pp-seats">${p.rate} <small>Oy</small></div>
        </div>
    `).join('');
}

function renderPolls() {
    document.getElementById('polls-list').innerHTML = electionPolls.map(poll => `
        <div class="poll-row">
            <div class="poll-name">${poll.party}</div>
            <div class="poll-track"><div class="poll-fill" style="width:${poll.rate}%"></div></div>
            <div class="poll-val"><span>%${poll.rate}</span><small class="${poll.change.includes('+')?'green':'red'}">${poll.change}</small></div>
        </div>
    `).join('');
}

function renderBills() {
    document.getElementById('bills-grid').innerHTML = activeBills.map(bill => `
        <div class="bill-card">
            <div class="bill-header"><span style="color:#3b82f6">${bill.proposer}</span><span><i class="fa-regular fa-clock"></i> ${bill.deadline}</span></div>
            <h4>${bill.title}</h4>
            <div class="vote-bar"><div class="yes" style="width:${(bill.votes.yes/600)*100}%"></div><div class="no" style="width:${(bill.votes.no/600)*100}%"></div><div class="abs" style="width:${(bill.votes.abstain/600)*100}%"></div></div>
            <div class="bill-actions"><button class="vote-btn yes">KABUL</button><button class="vote-btn no">RED</button></div>
        </div>
    `).join('');
}

function generateHemicycle() {
    const wrapper = document.getElementById('hemicycle-wrapper');
    const legend = document.getElementById('seat-legend');
    wrapper.innerHTML = ''; legend.innerHTML = '';
    let allSeats = [];
    parliamentSeats.forEach(group => {
        for(let i=0; i<group.count; i++) allSeats.push({ color: group.color, party: group.party });
        legend.innerHTML += `<div class="legend-item"><span class="dot" style="background:${group.color}"></span> ${group.short} (${group.count})</div>`;
    });
    const rows = 12; const baseRadius = 60; const rowSpacing = 20; let seatIndex = 0;
    for (let r = 1; r <= rows; r++) {
        const radius = baseRadius + (r * rowSpacing);
        const arcLength = Math.PI * radius; 
        const seatsInRow = Math.floor(arcLength / 13);
        for (let s = 0; s < seatsInRow; s++) {
            if (seatIndex >= allSeats.length) break;
            const seatData = allSeats[seatIndex];
            const angleStep = 180 / (seatsInRow - 1 || 1);
            const angle = 180 - (s * angleStep);
            const radians = (angle * Math.PI) / 180;
            const x = radius * Math.cos(radians);
            const y = radius * Math.sin(radians);
            const dot = document.createElement('div');
            dot.className = 'seat-dot'; dot.style.backgroundColor = seatData.color;
            dot.style.left = `calc(50% + ${x}px)`; dot.style.bottom = `${y}px`; dot.title = seatData.party;
            wrapper.appendChild(dot); seatIndex++;
        }
    }
}

function setupEvents() {
    const modal = document.getElementById('constitution-modal');
    document.getElementById('btn-constitution').addEventListener('click', () => modal.style.display = 'flex');
    document.querySelector('.close-modal').addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => { if(e.target===modal) modal.style.display='none'; });
}