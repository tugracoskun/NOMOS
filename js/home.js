// ANA SAYFA MODÜLÜ
// Chat Sistemi ve Dashboard Widgetları

// --- MOCK CHAT VERİSİ ---
let chatMessages = [
    { id: 1, user: "Sistem", text: "NOMOS sunucularına hoşgeldiniz.", lang: "all", type: "system", time: "10:00" },
    { id: 2, user: "JohnDoe", text: "Hello everyone from UK!", lang: "global", type: "user", time: "10:05" },
    { id: 3, user: "Kürşat Bey", text: "Selamun aleyküm beyler, seçimler ne zaman?", lang: "tr", type: "user", time: "10:12" },
    { id: 4, user: "Hans_De", text: "Does anyone want to trade oil?", lang: "global", type: "user", time: "10:15" },
    { id: 5, user: "Ece Y.", text: "Aleykümselam, yarın akşam başlıyor.", lang: "tr", type: "user", time: "10:18" },
    // Resim Örneği
    { id: 6, user: "Admin", text: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/250px-Flag_of_France.svg.png", lang: "global", type: "user", time: "10:20" }
];

let currentChannel = "tr"; // Varsayılan Kanal (tr veya global)

// --- GİRİŞ FONKSİYONU ---
export function renderHome(container) {
    if (!container) return;

    container.innerHTML = `
        <div class="home-layout">
            
            <!-- SOL SÜTUN: CHAT SİSTEMİ -->
            <div class="home-main-col">
                <div class="chat-container">
                    
                    <!-- Kanal Başlıkları (Tablar) -->
                    <div class="chat-header-tabs">
                        <button class="chat-tab ${currentChannel === 'global' ? 'active' : ''}" data-channel="global">
                            <i class="fa-solid fa-earth-americas"></i> Global
                        </button>
                        <button class="chat-tab ${currentChannel === 'tr' ? 'active' : ''}" data-channel="tr">
                            <img src="https://flagcdn.com/20x15/tr.png"> Türkiye
                        </button>
                    </div>

                    <!-- Mesaj Alanı -->
                    <div class="chat-messages-area" id="chat-feed">
                        <!-- JS ile dolacak -->
                    </div>

                    <!-- Yazma Alanı -->
                    <div class="chat-input-wrapper">
                        <input type="text" id="chat-input" placeholder="${currentChannel === 'tr' ? 'Mesaj yaz...' : 'Type a message...'}">
                        <button id="chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>

            <!-- SAĞ SÜTUN: WIDGETLAR (Gelecek Özellikler) -->
            <div class="home-side-col">
                
                <!-- Gündem Widget -->
                <div class="home-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-newspaper"></i> Gündem</h3>
                    </div>
                    <div class="widget-body">
                        <div class="empty-placeholder">
                            <i class="fa-regular fa-newspaper"></i>
                            <p>Henüz öne çıkan haber yok.</p>
                        </div>
                    </div>
                </div>

                <!-- Savaşlar Widget -->
                <div class="home-widget">
                    <div class="widget-header">
                        <h3><i class="fa-solid fa-person-rifle"></i> Sıcak Çatışmalar</h3>
                    </div>
                    <div class="widget-body">
                        <div class="empty-placeholder">
                            <i class="fa-solid fa-peace"></i>
                            <p>Dünya şu an barış içinde.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    // Mesajları yükle ve olay dinleyicilerini başlat
    renderMessages();
    setupEventListeners();
}

// --- MESAJLARI LİSTELEME ---
function renderMessages() {
    const feed = document.getElementById('chat-feed');
    if(!feed) return;
    
    feed.innerHTML = "";

    // Kanala göre filtrele (Sistem mesajları her kanalda görünür)
    const filteredMsgs = chatMessages.filter(m => m.lang === currentChannel || m.lang === "all");

    filteredMsgs.forEach(msg => {
        const isMe = msg.user === "Başkan [TR]"; // Kendi mesajımız mı?
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isMe ? 'me' : ''} ${msg.type === 'system' ? 'system' : ''}`;

        // URL Resim Algılama (Basit Regex)
        let content = msg.text;
        const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;
        if (msg.text.match(imgRegex)) {
            content = `<img src="${msg.text}" class="chat-img-preview" onclick="window.open('${msg.text}', '_blank')">`;
        }

        // HTML Oluşturma
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

    // En alta kaydır
    feed.scrollTop = feed.scrollHeight;
}

// --- EVENT LISTENERLAR ---
function setupEventListeners() {
    // 1. Kanal Değiştirme
    document.querySelectorAll('.chat-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Aktif sınıfını güncelle
            document.querySelectorAll('.chat-tab').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Kanalı değiştir
            currentChannel = e.currentTarget.getAttribute('data-channel');
            
            // Input placeholder güncelle
            const input = document.getElementById('chat-input');
            input.placeholder = currentChannel === 'tr' ? 'Mesaj yaz...' : 'Type a message...';
            
            // Mesajları yeniden çiz
            renderMessages();
        });
    });

    // 2. Mesaj Gönderme Mantığı
    const sendMsg = () => {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        // Yeni mesajı diziye ekle
        chatMessages.push({
            id: Date.now(),
            user: "Başkan [TR]",
            text: text,
            lang: currentChannel,
            type: "user",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        input.value = "";
        renderMessages();
    };

    // Butona basınca gönder
    document.getElementById('chat-send-btn').addEventListener('click', sendMsg);
    
    // Enter'a basınca gönder
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMsg();
    });
}