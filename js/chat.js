// Chat Modülü
// Şimdilik yerel çalışır, sonra Supabase bağlanacak.

export function setupChat() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const messagesContainer = document.getElementById('chat-messages');

    if (!input || !sendBtn) return;

    // "Enter" tuşu ile gönderme
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Buton ile gönderme
    sendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
        const text = input.value.trim();
        if (text === "") return;

        // Ekrana mesajı ekle (Kendi mesajımız)
        addMessageToUI("Başkan [TR]", text, true);
        
        // Inputu temizle
        input.value = "";

        // Scroll'u en aşağı çek
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Mesajı HTML olarak listeye ekleyen fonksiyon
export function addMessageToUI(username, text, isMe = false) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    // Mesaj rengi (Admin, VIP vs. için burası değişebilir)
    const nameColor = isMe ? '#3b82f6' : '#10b981'; // Mavi: Biz, Yeşil: Başkası

    const html = `
        <div class="message">
            <span class="msg-author" style="color:${nameColor}">${username}</span>
            <span class="msg-text">${text}</span>
            <span class="msg-time">${time}</span>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', html);
    container.scrollTop = container.scrollHeight;
}

// Test için sahte mesajlar (Sayfa açılınca çalışır)
export function initFakeChat() {
    setTimeout(() => addMessageToUI("Sistem", "NOMOS dünyasına hoşgeldiniz."), 500);
    setTimeout(() => addMessageToUI("General Komutan", "Sınırdaki birlikler hazır mı?"), 2000);
    setTimeout(() => addMessageToUI("Ahmet Y.", "Parti kurmak için kaç level lazım?", false), 4500);
}