// MECLİS DASHBOARD VE KOLTUK SİSTEMİ
import { parliamentSeats, activeBills, electionPolls, constitutionArticles } from './data.js';

export function renderParliament(container) {
    container.innerHTML = `
        <div class="parliament-layout">
            
            <!-- ÜST BİLGİ PANELI -->
            <div class="state-header">
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

            <!-- ORTA: MECLİS KOLTUKLARI VE GRAFİKLER -->
            <div class="parliament-stage">
                
                <!-- Sol: Koltuk Düzeni (Hemicycle) -->
                <div class="hemicycle-container">
                    <div class="hemicycle-wrapper" id="hemicycle-wrapper">
                        <!-- JS ile Noktalar Buraya Gelecek -->
                    </div>
                    <div class="seat-legend" id="seat-legend"></div>
                </div>

                <!-- Sağ: Özet ve Anketler -->
                <div class="stats-panel">
                    <div class="panel-box">
                        <h3><i class="fa-solid fa-chart-pie"></i> Seçim Anketleri</h3>
                        <div class="polls-list" id="polls-list"></div>
                    </div>
                    <div class="panel-box">
                        <h3><i class="fa-solid fa-gavel"></i> Son Geçen Yasalar</h3>
                        <ul class="logs-list">
                            <li class="log-item passed"><i class="fa-solid fa-check"></i> Vergi Reformu (Dün)</li>
                            <li class="log-item failed"><i class="fa-solid fa-xmark"></i> Savaş İlanı (2 gün önce)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- ALT: YASA TASARILARI (Active Bills) -->
            <div class="bills-section">
                <h3><i class="fa-solid fa-file-signature"></i> Gündemdeki Yasa Tasarıları</h3>
                <div class="bills-grid" id="bills-grid"></div>
            </div>
        </div>

        <!-- ANAYASA MODALI -->
        <div id="constitution-modal" class="modal-overlay" style="display:none;">
            <div class="modal-content">
                <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
                <div class="const-body">
                    <h2><i class="fa-solid fa-scale-balanced"></i> Devlet Anayasası</h2>
                    <ul class="const-list">
                        ${constitutionArticles.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    // Fonksiyonları çalıştır
    generateHemicycle();
    renderBills();
    renderPolls();
    setupEvents();
}

// --- 1. HEMICYCLE (YARIM DAİRE) ÇİZİMİ ---
function generateHemicycle() {
    const wrapper = document.getElementById('hemicycle-wrapper');
    const legend = document.getElementById('seat-legend');
    
    // Partileri tek bir düz listede topla (Koltuk sayısı kadar nokta)
    let allSeats = [];
    parliamentSeats.forEach(group => {
        for(let i=0; i<group.count; i++) {
            allSeats.push({ color: group.color, party: group.party });
        }
        // Legend (Alt açıklama) ekle
        legend.innerHTML += `<div class="legend-item"><span class="dot" style="background:${group.color}"></span> ${group.short} (${group.count})</div>`;
    });

    // Yarım Daire Matematiği
    const totalSeats = allSeats.length;
    const rows = 10; // Kaç sıra koltuk olacak
    let seatIndex = 0;

    for (let r = 1; r <= rows; r++) {
        // Dışarıdaki sıralar daha fazla koltuk alır
        const radius = 100 + (r * 25); // Yarıçap genişler
        const seatsInRow = Math.floor((Math.PI * radius) / 12); // Çevreye göre sığacak koltuk hesabı (12px boşluk)
        
        // Bu sıraya sığacak koltukları yerleştir
        for (let s = 0; s < seatsInRow; s++) {
            if (seatIndex >= totalSeats) break;

            const seatData = allSeats[seatIndex];
            
            // Açıyı hesapla (180 dereceye yay)
            const angleStep = 180 / (seatsInRow - 1);
            const angle = 180 - (s * angleStep); // Soldan sağa
            const radians = (angle * Math.PI) / 180;

            // Koordinatlar (Merkeze göre)
            const x = radius * Math.cos(radians); // Cosinus X verir
            const y = radius * Math.sin(radians); // Sinus Y verir

            const dot = document.createElement('div');
            dot.className = 'seat-dot';
            dot.style.backgroundColor = seatData.color;
            // Merkeze hizalama (wrapper'ın ortası %50, altı %100)
            dot.style.left = `calc(50% + ${x}px)`; 
            dot.style.bottom = `${y}px`;
            
            // Tooltip
            dot.title = seatData.party; // Basit tooltip, ileride CSS ile güzelleşir

            wrapper.appendChild(dot);
            seatIndex++;
        }
    }
    
    // Kalan koltuk varsa (matematiksel yuvarlama hatası) onları da en arkaya ekleyebiliriz ama şimdilik kalsın.
}

// --- 2. YASA TASARILARI ---
function renderBills() {
    const grid = document.getElementById('bills-grid');
    grid.innerHTML = activeBills.map(bill => `
        <div class="bill-card">
            <div class="bill-header">
                <span class="proposer">Öneren: ${bill.proposer}</span>
                <span class="deadline"><i class="fa-regular fa-clock"></i> ${bill.deadline}</span>
            </div>
            <div class="bill-content">
                <h4>${bill.title}</h4>
                <p>${bill.desc}</p>
            </div>
            <div class="vote-bar">
                <div class="bar-segment yes" style="width:${(bill.votes.yes/600)*100}%"></div>
                <div class="bar-segment no" style="width:${(bill.votes.no/600)*100}%"></div>
                <div class="bar-segment abs" style="width:${(bill.votes.abstain/600)*100}%"></div>
            </div>
            <div class="vote-actions">
                <button class="vote-btn btn-yes">KABUL</button>
                <button class="vote-btn btn-abs">ÇEKİMSER</button>
                <button class="vote-btn btn-no">RED</button>
            </div>
        </div>
    `).join('');
}

// --- 3. ANKETLER ---
function renderPolls() {
    const list = document.getElementById('polls-list');
    list.innerHTML = electionPolls.map(poll => `
        <div class="poll-row">
            <div class="poll-info">
                <span>${poll.party}</span>
                <span class="${poll.change.includes('+') ? 'text-green' : 'text-red'}">${poll.change}%</span>
            </div>
            <div class="poll-bar-bg">
                <div class="poll-bar-fill" style="width:${poll.rate}%"></div>
            </div>
            <span class="poll-rate">%${poll.rate}</span>
        </div>
    `).join('');
}

// --- EVENTLER ---
function setupEvents() {
    const modal = document.getElementById('constitution-modal');
    document.getElementById('btn-constitution').addEventListener('click', () => {
        modal.style.display = 'flex';
    });
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.style.display = 'none';
    });
}