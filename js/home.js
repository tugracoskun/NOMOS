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
    { id: 3, title: "ABD - Çin Ticaret Anlaşması", time: "3sa önce", flag: "us" },
    { id: 4, title: "Almanya'da Koalisyon Krizi", time: "5sa önce", flag: "de" },
    { id: 5, title: "Japonya Deprem Uyarısı", time: "8sa önce", flag: "jp" },
    { id: 6, title: "Brezilya Orman Yangınları", time: "12sa önce", flag: "br" },
    { id: 7, title: "İngiltere Brexit Sonrası Anlaşma", time: "1gün önce", flag: "gb" }
];

const socialTrends = [
    { user: "AhmetK", text: "Bu yeni vergi yasası ne böyle?! #Protesto", likes: 124 },
    { user: "Baron", text: "Petrol alıyorum, satan DM. 🛢️", likes: 56 }
];

// Piyasa Haberleri
const marketNews = [
    { title: "Petrol fiyatları %3.2 düştü", source: "Reuters", time: "5dk" },
    { title: "Altın rekor kırdı: $2,450", source: "Bloomberg", time: "12dk" },
    { title: "Fed faiz kararı açıklandı", source: "CNBC", time: "1sa" },
    { title: "EUR/USD paritesi düşüşte", source: "ForexLive", time: "2sa" },
    { title: "Çin ihracatı beklentileri aştı", source: "Reuters", time: "4sa" },
    { title: "Bitcoin $68,000'ı geçti", source: "CoinDesk", time: "6sa" },
    { title: "OPEC üretim kısıtlaması", source: "Bloomberg", time: "8sa" }
];

// Borsa Verileri
const stockMarket = {
    risers: [
        { symbol: "NMS", name: "Nomos Corp", change: +5.42, price: "142.30" },
        { symbol: "GLD", name: "Gold Mining", change: +3.18, price: "87.50" },
        { symbol: "OIL", name: "PetroEnergy", change: +2.75, price: "63.20" },
        { symbol: "TEC", name: "TechVision", change: +1.92, price: "234.80" },
        { symbol: "CRY", name: "CryptoFund", change: +1.45, price: "56.70" },
        { symbol: "DEF", name: "DefenseCo", change: +0.89, price: "178.20" }
    ],
    fallers: [
        { symbol: "BNK", name: "MegaBank", change: -4.15, price: "28.40" },
        { symbol: "AIR", name: "SkyAirlines", change: -3.67, price: "15.90" },
        { symbol: "RET", name: "RetailMax", change: -2.83, price: "42.10" },
        { symbol: "MED", name: "MedPharma", change: -1.54, price: "95.60" },
        { symbol: "LOG", name: "LogiTrans", change: -1.22, price: "33.80" },
        { symbol: "FUD", name: "FoodChain", change: -0.76, price: "67.40" }
    ]
};

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
            
            <!-- 1. SOL SÜTUN (Görevler & Dünya & Konum & Meclis) -->
            <div class="home-col-left">
                
                <!-- Görevler -->
                <div class="home-widget task-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-list-check"></i> Görevler</h3>
                    </div>
                    <div class="widget-body">
                        ${renderTasks()}
                    </div>
                </div>

                <!-- Dünyadan Haberler -->
                <div class="home-widget world-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-earth-americas"></i> Dünyadan Haberler</h3>
                    </div>
                    <div class="widget-body">
                        ${renderWorldNews()}
                    </div>
                </div>

                <!-- Konum -->
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

                <!-- Meclis Dağılımı (en altta) -->
                <div class="home-widget parliament-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-landmark"></i> Meclis Dağılımı</h3>
                    </div>
                    <div class="widget-body">
                        ${renderParliamentSummary()}
                    </div>
                </div>

            </div>

            <!-- 2. ORTA SÜTUN (Chat) -->
            <div class="home-col-center">
                <div class="chat-container">
                    <div class="chat-header-tabs">
                        <button class="chat-tab ${currentChannel === 'global' ? 'active' : ''}" data-channel="global">
                            <i class="fa-solid fa-globe"></i> Global
                        </button>
                        <button class="chat-tab ${currentChannel === 'tr' ? 'active' : ''}" data-channel="tr">
                            <img src="https://flagcdn.com/20x15/tr.png"> Türkiye
                        </button>
                    </div>
                    <div class="chat-messages-area" id="chat-feed"></div>
                    <div class="chat-input-wrapper">
                        <input type="text" id="chat-input" placeholder="Mesaj yaz...">
                        <button id="chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>

            <!-- 3. SAĞ SÜTUN (Gündem/Popüler + Piyasa/Borsa) -->
            <div class="home-col-right">
                
                <!-- Gündem & Popüler (Sekmeli Widget) -->
                <div class="home-widget trending-widget">
                    <div class="trending-tabs">
                        <button class="trending-tab active" data-trend="gundem">
                            <i class="fa-solid fa-hashtag"></i> Gündem
                        </button>
                        <button class="trending-tab" data-trend="populer">
                            <i class="fa-solid fa-fire"></i> Popüler
                        </button>
                    </div>
                    <div class="widget-body trending-body">
                        <div class="trend-panel active" id="trend-gundem">
                            <div class="agenda-item">#Seçim2025 <span class="trend-up">▲</span></div>
                            <div class="agenda-item">#DolarKuru <span class="trend-down">▼</span></div>
                            <div class="agenda-item">#Savaşİhtimali</div>
                            <div class="agenda-item">#EkonomikKriz <span class="trend-up">▲</span></div>
                            <div class="agenda-item">#NATOZirvesi</div>
                        </div>
                        <div class="trend-panel" id="trend-populer">
                            ${renderSocialTrends()}
                        </div>
                    </div>
                </div>

                <!-- Piyasa & Borsa (Sekmeli Widget) -->
                <div class="home-widget market-widget">
                    <div class="trending-tabs">
                        <button class="trending-tab active" data-trend="piyasa">
                            <i class="fa-solid fa-newspaper"></i> Piyasa
                        </button>
                        <button class="trending-tab" data-trend="borsa">
                            <i class="fa-solid fa-chart-line"></i> Borsa
                        </button>
                    </div>
                    <div class="widget-body trending-body">
                        <div class="trend-panel active" id="trend-piyasa">
                            ${renderMarketNews()}
                        </div>
                        <div class="trend-panel" id="trend-borsa">
                            ${renderStockMarket()}
                        </div>
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
    const count = Math.min(partiesData.length, 6);
    return partiesData.slice(0, count).map(p => `
        <div class="parl-row">
            <div class="parl-color" style="background:${p.color}"></div>
            <span class="parl-name">${p.shortName}</span>
            <span class="parl-count">${p.members} Vekil</span>
        </div>
    `).join('') + (partiesData.length > count ? `<div class="parl-more">... ve ${partiesData.length - count} diğer parti</div>` : '');
}

function renderMarketNews() {
    return marketNews.map(n => `
        <div class="market-news-item">
            <div class="market-news-content">
                <span class="market-news-title">${n.title}</span>
                <span class="market-news-meta">${n.source} · ${n.time}</span>
            </div>
        </div>
    `).join('');
}

function renderStockMarket() {
    const renderStock = (s) => {
        const isUp = s.change > 0;
        return `
            <div class="stock-row">
                <div class="stock-info">
                    <span class="stock-symbol">${s.symbol}</span>
                    <span class="stock-name">${s.name}</span>
                </div>
                <div class="stock-data">
                    <span class="stock-price">$${s.price}</span>
                    <span class="stock-change ${isUp ? 'up' : 'down'}">${isUp ? '+' : ''}${s.change.toFixed(2)}%</span>
                </div>
            </div>
        `;
    };

    return `
        <div class="stock-section">
            <div class="stock-section-label up"><i class="fa-solid fa-arrow-trend-up"></i> Yükselenler</div>
            ${stockMarket.risers.map(renderStock).join('')}
        </div>
        <div class="stock-section">
            <div class="stock-section-label down"><i class="fa-solid fa-arrow-trend-down"></i> Düşenler</div>
            ${stockMarket.fallers.map(renderStock).join('')}
        </div>
    `;
}

// --- CHAT LOGIC (Aynı) ---
function renderMessages() {
    const feed = document.getElementById('chat-feed');
    if (!feed) return;
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

    // Trending tab geçişleri (her widget bağımsız)
    document.querySelectorAll('.trending-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const widget = btn.closest('.home-widget');
            if (!widget) return;
            // Sadece bu widget içindeki tab ve panelleri güncelle
            widget.querySelectorAll('.trending-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            widget.querySelectorAll('.trend-panel').forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`trend-${btn.dataset.trend}`);
            if (target) target.classList.add('active');
        });
    });

    const sendMsg = () => {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        chatMessages.push({ id: Date.now(), user: "Başkan [TR]", text: text, lang: currentChannel, type: "user", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        input.value = "";
        renderMessages();
    };

    document.getElementById('chat-send-btn').addEventListener('click', sendMsg);
    document.getElementById('chat-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMsg(); });
}