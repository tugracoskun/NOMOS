// ANA SAYFA MODÜLÜ
// 3 Sütunlu Dashboard: Widgetlar ve Chat

import { partiesData } from './parties/data.js'; // Parti renklerini çekmek için

// --- MOCK VERİLER ---
const tasks = [
    { id: 1, title: "Günlük Giriş Yap", progress: "1/1", status: "completed", reward: "10G" },
    { id: 2, title: "Makale Oyla", progress: "3/5", status: "ongoing", reward: "50G" },
    { id: 3, title: "Çalışma Yap", progress: "0/1", status: "pending", reward: "100 Enerji" }
];

const worldNews = [
    { id: 1, title: "Rusya'da Seçim Gerginliği", time: "10dk önce", flag: "ru" },
    { id: 2, title: "Petrol Fiyatları Çakıldı", time: "1sa önce", flag: "sa" },
    { id: 3, title: "ABD - Çin Ticaret Anlaşması", time: "3sa önce", flag: "us" }
];

const socialTrends = [
    { user: "AhmetK", text: "Bu yeni vergi yasası ne böyle?! #Protesto", likes: 124 },
    { user: "Baron", text: "Petrol alıyorum, satan DM. 🛢️", likes: 56 }
];

let chatMessages = [
    { id: 1, user: "Sistem", text: "NOMOS sunucularına hoşgeldiniz.", lang: "all", type: "system", time: "10:00" },
    { id: 2, user: "JohnDoe", text: "Hello everyone!", lang: "global", type: "user", time: "10:05" },
    { id: 3, user: "Kürşat Bey", text: "Selamun aleyküm beyler.", lang: "tr", type: "user", time: "10:12" },
    { id: 4, user: "Admin", text: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/320px-Flag_of_Turkey.svg.png", lang: "tr", type: "user", time: "10:20" }
];

let currentChannel = "tr"; 

// --- RENDER ---
export function renderHome(container) {
    if (!container) return;

    container.innerHTML = `
        <div class="home-layout-grid">
            
            <!-- 1. SOL SÜTUN (Görevler & Dünya) -->
            <div class="home-col-left">
                
                <!-- Kırmızı Alan: Görevler -->
                <div class="home-widget task-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-list-check"></i> Görevler</h3>
                    </div>
                    <div class="widget-body">
                        ${renderTasks()}
                    </div>
                </div>

                <!-- Turuncu Alan: Dünyadan Gelişmeler -->
                <div class="home-widget world-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-earth-americas"></i> Dünyadan Haberler</h3>
                    </div>
                    <div class="widget-body">
                        ${renderWorldNews()}
                    </div>
                </div>

                <!-- Mavi Alan (Boşluk/Ekstra) - Şimdilik Bölge Bilgisi -->
                <div class="home-widget region-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-map-pin"></i> Konum</h3>
                    </div>
                    <div class="region-info">
                        <img src="https://flagcdn.com/w80/tr.png" class="region-flag">
                        <div>
                            <strong>Ankara, Türkiye</strong>
                            <small>Barış Bölgesi</small>
                        </div>
                    </div>
                </div>

            </div>

            <!-- 2. ORTA SÜTUN (Chat - Beyaz Alan) -->
            <div class="home-col-center">
                <div class="chat-container">
                    <!-- Sekmeler -->
                    <div class="chat-header-tabs">
                        <button class="chat-tab ${currentChannel === 'global' ? 'active' : ''}" data-channel="global">
                            <i class="fa-solid fa-globe"></i> Global
                        </button>
                        <button class="chat-tab ${currentChannel === 'tr' ? 'active' : ''}" data-channel="tr">
                            <img src="https://flagcdn.com/20x15/tr.png"> Türkiye
                        </button>
                    </div>

                    <!-- Mesajlar -->
                    <div class="chat-messages-area" id="chat-feed"></div>

                    <!-- Input -->
                    <div class="chat-input-wrapper">
                        <input type="text" id="chat-input" placeholder="Mesaj yaz...">
                        <button id="chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>

            <!-- 3. SAĞ SÜTUN (Gündem, Sosyal, Meclis) -->
            <div class="home-col-right">
                
                <!-- Sarı Alan: Gündem -->
                <div class="home-widget agenda-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-hashtag"></i> Gündem</h3>
                    </div>
                    <div class="widget-body">
                        <div class="agenda-item">#Seçim2025 <span class="trend-up">▲</span></div>
                        <div class="agenda-item">#DolarKuru <span class="trend-down">▼</span></div>
                        <div class="agenda-item">#Savaşİhtimali</div>
                    </div>
                </div>

                <!-- Kahverengi Alan: Sosyal Medya -->
                <div class="home-widget social-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-fire"></i> Popüler</h3>
                    </div>
                    <div class="widget-body">
                        ${renderSocialTrends()}
                    </div>
                </div>

                <!-- Pembe Alan: Meclis Durumu -->
                <div class="home-widget parliament-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-landmark"></i> Meclis Dağılımı</h3>
                    </div>
                    <div class="widget-body">
                        ${renderParliamentSummary()}
                    </div>
                </div>

            </div>

        </div>
    `;

    renderMessages();
    setupEventListeners();
}

// --- HELPER RENDERS ---

function renderTasks() {
    return tasks.map(t => `
        <div class="task-item ${t.status}">
            <div class="task-info">
                <span class="task-title">${t.title}</span>
                <span class="task-reward">${t.reward}</span>
            </div>
            <div class="task-status">
                ${t.status === 'completed' ? '<i class="fa-solid fa-check"></i>' : t.progress}
            </div>
        </div>
    `).join('');
}

function renderWorldNews() {
    return worldNews.map(n => `
        <div class="news-item">
            <img src="https://flagcdn.com/20x15/${n.flag}.png">
            <div class="news-content">
                <span class="news-head">${n.title}</span>
                <span class="news-time">${n.time}</span>
            </div>
        </div>
    `).join('');
}

function renderSocialTrends() {
    return socialTrends.map(s => `
        <div class="social-item">
            <div class="social-head">
                <span class="social-user">@${s.user}</span>
                <span class="social-likes"><i class="fa-solid fa-heart"></i> ${s.likes}</span>
            </div>
            <p>"${s.text}"</p>
        </div>
    `).join('');
}

function renderParliamentSummary() {
    // Sadece ilk 3 partiyi gösterelim
    return partiesData.slice(0, 3).map(p => `
        <div class="parl-row">
            <div class="parl-color" style="background:${p.color}"></div>
            <span class="parl-name">${p.shortName}</span>
            <span class="parl-count">${p.members} Vekil</span>
        </div>
    `).join('') + `<div class="parl-more">... ve diğerleri</div>`;
}

// --- CHAT LOGIC (Aynı) ---
function renderMessages() {
    const feed = document.getElementById('chat-feed');
    if(!feed) return;
    feed.innerHTML = "";
    
    const filteredMsgs = chatMessages.filter(m => m.lang === currentChannel || m.lang === "all");

    filteredMsgs.forEach(msg => {
        const isMe = msg.user === "Başkan [TR]";
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isMe ? 'me' : ''} ${msg.type === 'system' ? 'system' : ''}`;

        let content = msg.text;
        const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;
        if (msg.text.match(imgRegex)) content = `<img src="${msg.text}" class="chat-img-preview" onclick="window.open('${msg.text}', '_blank')">`;

        msgDiv.innerHTML = `
            ${msg.type !== 'system' && !isMe ? `<div class="msg-avatar">${msg.user.charAt(0)}</div>` : ''}
            <div class="msg-bubble">
                ${msg.type !== 'system' && !isMe ? `<div class="msg-author">${msg.user}</div>` : ''}
                <div class="msg-text">${content}</div>
                <div class="msg-time">${msg.time}</div>
            </div>
        `;
        feed.appendChild(msgDiv);
    });
    feed.scrollTop = feed.scrollHeight;
}

function setupEventListeners() {
    document.querySelectorAll('.chat-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chat-tab').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentChannel = e.currentTarget.getAttribute('data-channel');
            renderMessages();
        });
    });

    const sendMsg = () => {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        chatMessages.push({ id: Date.now(), user: "Başkan [TR]", text: text, lang: currentChannel, type: "user", time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) });
        input.value = "";
        renderMessages();
    };

    document.getElementById('chat-send-btn').addEventListener('click', sendMsg);
    document.getElementById('chat-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMsg(); });
}